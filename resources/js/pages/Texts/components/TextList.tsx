import React, { useEffect, useState } from "react";
import {
    Button,
    Checkbox,
    Col,
    Divider,
    Dropdown,
    Empty,
    Input,
    List,
    Menu,
    Pagination,
    Row,
    Space,
    Spin,
    Tag,
    Typography,
} from "antd";
import {
    SearchOutlined,
    DeleteOutlined,
    EllipsisOutlined,
    CloseOutlined,
    TagFilled,
    PlusCircleOutlined,
    BackwardOutlined,
    SaveOutlined,
    LoadingOutlined,
    Loading3QuartersOutlined,
    RedoOutlined,
} from "@ant-design/icons"; // Step 1
import { useNavigate } from "react-router-dom";
import { getTimeAgo, useArray } from "../../../helpers";
import { TTextThreadList } from "../../../entities";
import ConfirmModal from "../../../components/ConfirmModal";
import { useMutation } from "react-query";
import queryClient from "../../../queryClient";
import { useTextThreads } from "../../../api/query/textQuery";
import {
    useDeleteThread,
    useRestoreThread,
} from "../../../api/mutation/useTextMutation";
import AssignLabelModal from "./AssignLabelModal";
import { useAppContextProvider } from "../../../context/AppContext";
import AddTagModal from "./AddTagModal";
import CustomLink from "../../../components/CustomLink";
import moment from "moment";
import { useCustomFields } from "../../../api/query/customFieldQuery";
import _ from "lodash";
import ContactBulkUpdate from "../../PageContacts/Components/ContactBulkUpdate";

const TextList = ({ label }) => {
    const [isTextThreadLoading, setIsTextThreadLoading] = useState(true);
    const [searchKey, setSearchKey] = useState("");
    const [pagination, setPagination] = useState({
        page_size: 20,
        page: 1,
        searchKey: "",
        label: "",
        total: 0,
    });
    const [textStatus, setTextStatus] = useState(
        localStorage.getItem("textStatus") ?? "Current"
    );
    useEffect(() => {
        if (textStatus) {
            localStorage.setItem("textStatus", textStatus);
        }

        return () => {};
    }, [textStatus]);

    const {
        array: textThreads,
        updateById,
        setInitialArray,
    } = useArray<TTextThreadList>();

    const { data: filteredThreads, refetch: refetchTextThreads } =
        useTextThreads({ ...pagination, textStatus }, () => {
            setIsTextThreadLoading(false);
        });

    const handleSearch = (e) => {
        setPagination({ ...pagination, searchKey: e.target.value, page: 1 });
    };

    const debouncedSearch = _.debounce((e) => {
        handleSearch(e);
    }, 500);

    const navigate = useNavigate();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false);
    const [isAddTagModalOpen, setIsAddTagModalOpen] = useState(false);
    const [isDeleteBtnLoading, setIsDeleteBtnLoading] = useState(false);
    const [isRestoreBtnLoading, setIsRestoreBtnLoading] = useState(false);
    const [selectedThread, setSelectedThread] = useState<
        TTextThreadList | undefined
    >(undefined);
    const [selectedThreadIds, setSelectedThreadIds] = useState<string[]>([]);
    const [isAssignLabelModalOpen, setIsAssignLabelModalOpen] = useState(false);
    const [isViaMultiple, setIsViaMultiple] = useState(false);

    const {
        data: contactFields,
        isLoading: isContactFieldsLoading,
        refetch: refetchContactFields,
    } = useCustomFields("contact");

    const archiveThread = useMutation(useDeleteThread, {
        onSuccess: () => {
            queryClient.invalidateQueries("textThreads");
            setIsDeleteModalOpen(false);
            setIsDeleteBtnLoading(false);
            setSelectedThread(undefined);
            setSelectedThreadIds([]);
            // navigate("/text-threads");
        },
        onError: (e: any) => {
            console.log(e.message || "An error occurred");
        },
    });
    const restoreThread = useMutation(useRestoreThread, {
        onSuccess: () => {
            queryClient.invalidateQueries("textThreads");
            setIsRestoreModalOpen(false);
            setIsRestoreBtnLoading(false);
            setSelectedThread(undefined);
            setSelectedThreadIds([]);
            // navigate("/text-threads");
        },
        onError: (e: any) => {
            console.log(e.message || "An error occurred");
        },
    });

    const handlePaginationChange = (page, pageSize) => {
        setPagination({ ...pagination, page: page, page_size: pageSize });
    };

    useEffect(() => {
        setPagination({ ...pagination, label: label });
    }, [label]);

    useEffect(() => {
        setIsTextThreadLoading(true);
        refetchTextThreads();
    }, [
        pagination.page,
        pagination.searchKey,
        pagination.page_size,
        pagination.label,
        textStatus,
    ]);

    useEffect(() => {
        if (filteredThreads && filteredThreads.data) {
            setInitialArray(filteredThreads.data);
            setPagination({ ...pagination, total: filteredThreads.total });
        }
    }, [filteredThreads]);

    return (
        <>
            <Input
                suffix={<SearchOutlined />}
                placeholder="Search"
                style={{ marginBottom: "20px" }}
                onChange={debouncedSearch}
            />
            <Space>
                <Button
                    onClick={(e) => setTextStatus("Current")}
                    type={textStatus == "Current" ? "primary" : "default"}
                >
                    Current
                </Button>
                <Button
                    onClick={(e) => setTextStatus("Archived")}
                    type={textStatus == "Archived" ? "primary" : "default"}
                >
                    Archived
                </Button>
            </Space>

            {selectedThreadIds.length ? (
                <Space
                    style={{
                        width: "100%",
                        marginTop: 10,
                        background:
                            textStatus == "Current" ? "white" : "#f8f8f8",
                    }}
                >
                    <Button
                        icon={<CloseOutlined />}
                        type="text"
                        onClick={() => {
                            setSelectedThreadIds([]);
                        }}
                    />
                    <Typography.Text>
                        {selectedThreadIds?.length + " Selected"}
                    </Typography.Text>
                    {textStatus == "Current" ? (
                        <Button
                            icon={<DeleteOutlined />}
                            type="text"
                            onClick={() => {
                                setIsViaMultiple(true);
                                setIsDeleteModalOpen(true);
                            }}
                        >
                            Archive
                        </Button>
                    ) : (
                        <Button
                            icon={<RedoOutlined />}
                            type="text"
                            onClick={() => {
                                setIsViaMultiple(true);
                                setIsRestoreModalOpen(true);
                            }}
                        >
                            Restore
                        </Button>
                    )}

                    <Button
                        onClick={() => {
                            setIsViaMultiple(true);
                            setIsAssignLabelModalOpen(true);
                        }}
                        type="text"
                        icon={
                            <TagFilled
                                style={{
                                    transform: "rotate(45deg)",
                                }}
                            />
                        }
                    >
                        Labels
                    </Button>
                    {contactFields?.find((field) => field.type == "tag") && (
                        <Button
                            icon={<PlusCircleOutlined />}
                            type="text"
                            onClick={() => {
                                setIsAddTagModalOpen(true);
                            }}
                        >
                            Tag
                        </Button>
                    )}
                </Space>
            ) : (
                <div style={{ height: "42px" }}></div>
            )}

            <div
                style={{
                    paddingLeft: 10,
                    paddingTop: 5,
                    background: textStatus == "Current" ? "white" : "#f8f8f8",
                }}
            >
                <Checkbox
                    onClick={(e) => {
                        if (e.target.checked) {
                            setSelectedThreadIds(
                                textThreads.map((thread) => thread.id)
                            );
                        } else {
                            setSelectedThreadIds([]);
                        }
                    }}
                />
            </div>
            <List
                itemLayout="horizontal"
                style={{
                    marginTop: 0,
                    height: "69vh",
                    overflow: "auto",
                    background: textStatus == "Current" ? "white" : "#f8f8f8",
                    paddingLeft: 10,
                    paddingRight: 10,
                }}
            >
                {isTextThreadLoading ? (
                    <div
                        style={{
                            display: "grid",
                            placeItems: "center",
                            marginTop: "50%",
                        }}
                    >
                        <Spin />
                    </div>
                ) : (
                    <>
                        {textThreads?.length || isTextThreadLoading ? (
                            textThreads?.map((thread, index) => (
                                <>
                                    {index === 0 && (
                                        <Divider style={{ margin: "5px" }} />
                                    )}
                                    <List.Item
                                        style={{
                                            cursor: "pointer",
                                            padding: "3px 0",
                                            // position: "relative",
                                            backgroundColor:
                                                thread.haveDuplicatePhoneNumbers
                                                    ? "#ffc166"
                                                    : "",
                                        }}
                                    >
                                        <CustomLink
                                            onClick={() => {
                                                updateById(thread.id, {
                                                    ...thread,
                                                    isLastTextSeen: true,
                                                });
                                            }}
                                            to={`/text-threads/${
                                                thread.isContactSaved
                                                    ? `contact/${thread.contactId}`
                                                    : thread.id
                                            }`}
                                            style={{
                                                padding: 0,
                                                color: "black",
                                                width: "100%",
                                            }}
                                        >
                                            <Row
                                                gutter={12}
                                                style={{ width: "100%" }}
                                            >
                                                <Col span={6}>
                                                    <TextEllipsis
                                                        style={{
                                                            fontWeight:
                                                                !thread?.isLastTextSeen
                                                                    ? "bold"
                                                                    : "",
                                                            fontSize: "16px",
                                                        }}
                                                    >
                                                        <Space
                                                            onClick={(e) =>
                                                                e.stopPropagation()
                                                            }
                                                        >
                                                            <Checkbox
                                                                checked={selectedThreadIds.includes(
                                                                    thread.id
                                                                )}
                                                                onClick={(
                                                                    e
                                                                ) => {
                                                                    const isChecked =
                                                                        (
                                                                            e.target as HTMLInputElement
                                                                        )
                                                                            .checked;
                                                                    if (
                                                                        isChecked
                                                                    ) {
                                                                        setSelectedThreadIds(
                                                                            (
                                                                                prevSelectedThreadIds
                                                                            ) => [
                                                                                ...prevSelectedThreadIds,
                                                                                thread.id,
                                                                            ]
                                                                        );
                                                                    } else {
                                                                        setSelectedThreadIds(
                                                                            (
                                                                                prevSelectedThreadIds
                                                                            ) =>
                                                                                prevSelectedThreadIds.filter(
                                                                                    (
                                                                                        id
                                                                                    ) =>
                                                                                        id !==
                                                                                        thread.id
                                                                                )
                                                                        );
                                                                    }
                                                                }}
                                                            />
                                                            <div
                                                                style={{
                                                                    cursor: "default",
                                                                }}
                                                            >
                                                                &nbsp; &nbsp;
                                                            </div>
                                                        </Space>
                                                        {` ${thread.contactName}`}
                                                    </TextEllipsis>
                                                </Col>
                                                <Col span={15}>
                                                    <TextEllipsis
                                                        style={{
                                                            fontWeight:
                                                                !thread?.isLastTextSeen
                                                                    ? "bold"
                                                                    : "",
                                                        }}
                                                    >
                                                        <Space size={0}>
                                                            {thread.labels?.map(
                                                                (label) => (
                                                                    <Tag
                                                                        style={{
                                                                            float: "right",
                                                                            fontWeight:
                                                                                "normal",
                                                                        }}
                                                                    >
                                                                        {
                                                                            label?.name
                                                                        }
                                                                    </Tag>
                                                                )
                                                            )}
                                                            {thread?.lastText}
                                                        </Space>
                                                    </TextEllipsis>
                                                </Col>
                                                <Col span={3}>
                                                    <TextEllipsis
                                                        style={{
                                                            textAlign: "right",
                                                        }}
                                                    >
                                                        {moment
                                                            .utc(
                                                                thread?.created_at
                                                            )
                                                            .local()
                                                            .isSame(
                                                                moment(),
                                                                "day"
                                                            )
                                                            ? moment
                                                                  .utc(
                                                                      thread?.created_at
                                                                  )
                                                                  .local()
                                                                  .format(
                                                                      "hh:mm A"
                                                                  )
                                                            : moment
                                                                  .utc(
                                                                      thread?.created_at
                                                                  )
                                                                  .local()
                                                                  .format(
                                                                      "MMM DD"
                                                                  )}
                                                    </TextEllipsis>
                                                </Col>
                                            </Row>
                                        </CustomLink>
                                    </List.Item>
                                </>
                            ))
                        ) : (
                            <Empty
                                style={{
                                    marginTop: "50%",
                                }}
                            />
                        )}
                    </>
                )}
            </List>
            <center>
                <Pagination
                    className="p-t-sm"
                    current={pagination.page}
                    pageSize={pagination.page_size}
                    total={pagination.total}
                    onChange={handlePaginationChange}
                    // pageSizeOptions={["15", "30", "50"]}
                    showSizeChanger={false}
                    size="small"
                />
            </center>
            {isDeleteModalOpen && (
                <ConfirmModal
                    title="Confirm"
                    message={`Are you sure you want to archive this thread?`}
                    handleNo={() => {
                        setIsDeleteModalOpen(false);
                        setSelectedThread(undefined);
                    }}
                    handleYes={async () => {
                        setIsDeleteBtnLoading(true);
                        await archiveThread.mutate(
                            isViaMultiple
                                ? { threadIds: selectedThreadIds }
                                : { threadIds: [selectedThread!.id!] }
                        );
                        setSelectedThread(undefined);
                    }}
                    isOpen={isDeleteModalOpen}
                    loading={isDeleteBtnLoading}
                />
            )}
            {isRestoreModalOpen && (
                <ConfirmModal
                    title="Confirm"
                    message={`Are you sure you want to restore this thread?`}
                    handleNo={() => {
                        setIsRestoreModalOpen(false);
                        setSelectedThread(undefined);
                    }}
                    handleYes={async () => {
                        setIsRestoreBtnLoading(true);
                        await restoreThread.mutate(
                            isViaMultiple
                                ? { threadIds: selectedThreadIds }
                                : { threadIds: [selectedThread!.id!] }
                        );
                        setSelectedThread(undefined);
                    }}
                    isOpen={isRestoreModalOpen}
                    loading={isRestoreBtnLoading}
                />
            )}
            {isAssignLabelModalOpen && (
                <AssignLabelModal
                    isModalOpen={isAssignLabelModalOpen}
                    closeModal={() => {
                        setIsAssignLabelModalOpen(false);
                        setSelectedThread(undefined);
                        setSelectedThreadIds([]);
                    }}
                    threadIds={
                        isViaMultiple
                            ? selectedThreadIds
                            : [selectedThread?.id ?? ""]
                    }
                    defaultChecked={
                        !isViaMultiple
                            ? selectedThread?.labels?.map(
                                  (label) => label.id ?? ""
                              )
                            : undefined
                    }
                    isViaMultiple={isViaMultiple}
                />
            )}
            {isAddTagModalOpen && (
                <ContactBulkUpdate
                    isModalOpen={isAddTagModalOpen}
                    closeModal={() => setIsAddTagModalOpen(false)}
                    handleSubmit={() => {
                        queryClient.invalidateQueries("textThreads");
                        setIsAddTagModalOpen(false);
                        setSelectedThread(undefined);
                        setSelectedThreadIds([]);
                    }}
                    selectedRowKeys={selectedThreadIds}
                    type="thread"
                    defaultCustomFieldId={
                        contactFields?.find((field) => field.type == "tag")?.id
                    }
                />
            )}
        </>
    );
};

const TextEllipsis = ({
    children,
    style,
}: {
    children: any;
    style?: React.CSSProperties;
}) => {
    const defaultStyles: React.CSSProperties = {
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        alignItems: "center",
        justifyContent: "center",
    };
    const combinedStyles = { ...defaultStyles, ...style };
    return <div style={combinedStyles}>{children}</div>;
};

export default TextList;
