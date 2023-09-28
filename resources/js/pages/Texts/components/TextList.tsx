import React, { useEffect, useState } from "react";
import {
    Avatar,
    Button,
    Col,
    Divider,
    Dropdown,
    Empty,
    Input,
    List,
    Menu,
    Popover,
    Row,
    Space,
    Tag,
    Typography,
} from "antd";
import {
    SearchOutlined,
    DeleteOutlined,
    EllipsisOutlined,
    CaretDownFilled,
} from "@ant-design/icons"; // Step 1
import { useNavigate, useParams } from "react-router-dom";
import { useContactsAll } from "../../../api/query/contactsQuery";
import { getTimeAgo } from "../../../helpers";
import { TContact, TTextThread } from "../../../entities";
import ConfirmModal from "../../../components/ConfirmModal";
import { useMutation } from "react-query";
import queryClient from "../../../queryClient";
import { useTextThreads } from "../../../api/query/textQuery";
import { useDeleteThread } from "../../../api/mutation/useTextMutation";
import DropdownComponent from "../../../components/DropdownComponent";
import AssignLabelDropdown from "./AssignLabelDropdown";
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
    const [isAssignLabelModalOpen, setIsAssignLabelModalOpen] = useState(false);

    const archiveThread = useMutation((id: string) => useDeleteThread(id), {
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

        // if (searchKey) {
        //     let searchWord = searchKey;
        //     let label = "";
        //     const match = searchKey.match(/\{\{label:(.*?)\}\}/);

        //     if (match) {
        //         label = match[1];
        //         searchWord = searchWord.replace(/\{\{.*?\}\}\s*/g, "");
        //     }

        //     return data?.filter((thread) => {
        //         let bool = false;
        //         if (label) {
        //             bool =
        //                 thread.contactName
        //                     .toLowerCase()
        //                     .includes(searchWord.toLowerCase()) &&
        //                 thread.label?.name == label;
        //         } else if (searchWord != "") {
        //             bool = thread.contactName
        //                 .toLowerCase()
        //                 .includes(searchWord.toLowerCase());
        //         }

        //         return bool;
        //     });
        // }

        return data;
    };

    useEffect(() => {
        setSearchKey(label);
    }, [label]);

    const threadList = filteredContacts();

    return (
        <>
            <Input
                suffix={<SearchOutlined />}
                placeholder="Search"
                style={{ marginBottom: "20px" }}
                onChange={(e: any) => setSearchKey(e.target.value)}
                value={searchKey}
            />
            <List
                itemLayout="horizontal"
                dataSource={threadList}
                style={{ marginTop: 0 }}
                renderItem={(thread, index) => (
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
                                <Col span={3}>
                                    <TextEllipsis
                                        style={{
                                            fontWeight: "bold",
                                            fontSize: "16px",
                                        }}
                                    >
                                        {`${thread.contactName}`}
                                    </TextEllipsis>
                                </Col>
                                <Col span={18}>
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
                )}
            />

            <ConfirmModal
                title="Confirm"
                message={`Are you sure you want to archive this thread?`}
                handleNo={() => {
                    setIsDeleteModalOpen(false);
                    setSelectedThread(undefined);
                }}
                handleYes={async () => {
                    setIsDeleteBtnLoading(true);
                    await archiveThread.mutate(selectedThread!.id!);
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
                }}
                threadIds={[selectedThread?.id ?? ""]}
                defaultChecked={selectedThread?.labels?.map(
                    (label) => label.id ?? ""
                )}
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
