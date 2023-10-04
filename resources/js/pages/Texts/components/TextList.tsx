import React, { useEffect, useState } from "react";
import {
    Button,
    Checkbox,
    Col,
    Divider,
    Dropdown,
    Input,
    List,
    Menu,
    Row,
    Space,
    Tag,
    Typography,
} from "antd";
import {
    SearchOutlined,
    DeleteOutlined,
    EllipsisOutlined,
    CloseOutlined,
    TagFilled,
} from "@ant-design/icons"; // Step 1
import { useNavigate } from "react-router-dom";
import { getTimeAgo } from "../../../helpers";
import { TTextThread } from "../../../entities";
import ConfirmModal from "../../../components/ConfirmModal";
import { useMutation } from "react-query";
import queryClient from "../../../queryClient";
import { useTextThreads } from "../../../api/query/textQuery";
import { useDeleteThread } from "../../../api/mutation/useTextMutation";
import AssignLabelModal from "./AssignLabelModal";

const TextList = ({ label }) => {
    const [searchKey, setSearchKey] = useState("");
    const { textThreads, isLoading } = useTextThreads();
    const navigate = useNavigate();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleteBtnLoading, setIsDeleteBtnLoading] = useState(false);
    const [selectedThread, setSelectedThread] = useState<
        TTextThread | undefined
    >(undefined);
    const [selectedThreadIds, setSelectedThreadIds] = useState<string[]>([]);
    const [isAssignLabelModalOpen, setIsAssignLabelModalOpen] = useState(false);
    const [isViaMultiple, setIsViaMultiple] = useState(false);

    const archiveThread = useMutation(useDeleteThread, {
        onSuccess: () => {
            queryClient.invalidateQueries("threads");
            setIsDeleteModalOpen(false);
            setIsDeleteBtnLoading(false);
            navigate("/text-threads");
        },
        onError: (e: any) => {
            console.log(e.message || "An error occurred");
        },
    });

    // Step 2: Add hover state tracking
    const [hoveredItemIndex, setHoveredItemIndex] = useState<number | null>(
        null
    );

    const filteredContacts = (): TTextThread[] | undefined => {
        let data = textThreads;

        data = data?.filter((contact) => contact.texts?.length);

        if (searchKey) {
            let searchWord = searchKey;
            let labelKey = "";
            const match = searchKey.match(/\{\{label:(.*?)\}\}/);

            if (match) {
                labelKey = match[1];
                searchWord = searchWord.replace(/\{\{.*?\}\}\s*/g, "");
            }

            if (labelKey) {
                data = data?.filter((item) =>
                    item?.labels?.some((label) => label.name === labelKey)
                );
            }
            if (searchWord != "") {
                data = data?.filter(
                    (thread) =>
                        thread.contactName
                            .toLowerCase()
                            .includes(searchWord.toLowerCase()) ||
                        thread?.texts?.some((text) =>
                            text.message
                                .toLowerCase()
                                .includes(searchWord.toLowerCase())
                        )
                );
            }

            return data;
        }

        return data;
    };

    useEffect(() => {
        setSearchKey(label);
    }, [label]);

    const threadList = filteredContacts();

    // const selectedThreads = () => {
    //     const threads = threadList?.filter((thread) =>
    //         selectedThreadIds.includes(thread.id)
    //     );
    //     const allLabelIds = threads?.flatMap((item) =>
    //         item.labels?.map((label) => label.id)
    //     );
    //     return [...new Set(allLabelIds)]
    // };

    return (
        <>
            <Input
                suffix={<SearchOutlined />}
                placeholder="Search"
                style={{ marginBottom: "20px" }}
                onChange={(e: any) => setSearchKey(e.target.value)}
                value={searchKey}
            />
            {selectedThreadIds.length ? (
                <Space style={{ width: "100%" }} size={0}>
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
                    <Button
                        icon={<DeleteOutlined />}
                        type="text"
                        onClick={() => {
                            setIsViaMultiple(true);
                            setIsDeleteModalOpen(true);
                        }}
                    >
                        Delete
                    </Button>

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
                </Space>
            ) : null}
            <List itemLayout="horizontal" style={{ marginTop: 0 }}>
                {threadList?.map((thread, index) => (
                    <>
                        {index === 0 && <Divider style={{ margin: "5px" }} />}
                        <List.Item
                            style={{
                                cursor: "pointer",
                                padding: "3px 0",
                                // Step 3: Conditionally display timestamp or delete icon
                                position: "relative",
                            }}
                            onClick={() =>
                                navigate("/text-threads/" + thread.id)
                            }
                            onMouseEnter={() => setHoveredItemIndex(index)} // Step 4: Handle mouse enter
                            onMouseLeave={() => setHoveredItemIndex(null)} // Step 4: Handle mouse leave
                        >
                            <Row gutter={12} style={{ width: "100%" }}>
                                <Col span={6}>
                                    <TextEllipsis
                                        style={{
                                            fontWeight: "bold",
                                            fontSize: "16px",
                                        }}
                                    >
                                        <Space
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <Checkbox
                                                checked={selectedThreadIds.includes(
                                                    thread.id
                                                )}
                                                onClick={(e) => {
                                                    const isChecked = (
                                                        e.target as HTMLInputElement
                                                    ).checked;
                                                    if (isChecked) {
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
                                                                    (id) =>
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
                                            fontWeight: !thread?.texts![0]
                                                .seen_at
                                                ? "bold"
                                                : "",
                                        }}
                                    >
                                        <Space size={0}>
                                            {thread.labels?.map((label) => (
                                                <Tag
                                                    style={{
                                                        float: "right",
                                                        fontWeight: "normal",
                                                    }}
                                                >
                                                    {label?.name}
                                                </Tag>
                                            ))}
                                            {thread?.texts![0].message}
                                        </Space>
                                    </TextEllipsis>
                                </Col>
                                <Col span={3}>
                                    <TextEllipsis
                                        style={{
                                            textAlign: "right",
                                        }}
                                    >
                                        {hoveredItemIndex === index ||
                                        selectedThread ? ( // Step 3: Conditional rendering
                                            <Space
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedThread(thread);
                                                    setIsViaMultiple(false);
                                                }}
                                            >
                                                <DeleteOutlined
                                                    onClick={(e) => {
                                                        setIsDeleteModalOpen(
                                                            true
                                                        );
                                                    }}
                                                />
                                                <Dropdown
                                                    overlay={
                                                        <Menu>
                                                            <Menu.Item
                                                                key="assignLabel"
                                                                onClick={() =>
                                                                    setIsAssignLabelModalOpen(
                                                                        true
                                                                    )
                                                                }
                                                            >
                                                                Assign Label
                                                            </Menu.Item>
                                                        </Menu>
                                                    }
                                                    trigger={["click"]}
                                                >
                                                    <EllipsisOutlined
                                                        style={{
                                                            transform:
                                                                "rotate(90deg)",
                                                        }}
                                                    />
                                                </Dropdown>
                                            </Space>
                                        ) : (
                                            getTimeAgo(
                                                thread?.texts![0].created_at
                                            )
                                        )}
                                    </TextEllipsis>
                                </Col>
                            </Row>
                        </List.Item>
                    </>
                ))}
            </List>

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
                        ? selectedThread?.labels?.map((label) => label.id ?? "")
                        : undefined
                }
                isViaMultiple={isViaMultiple}
            />
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
    };
    const combinedStyles = { ...defaultStyles, ...style };
    return <div style={combinedStyles}>{children}</div>;
};

export default TextList;
