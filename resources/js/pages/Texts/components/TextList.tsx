import React, { useEffect, useState } from "react";
import {
    Avatar,
    Button,
    Col,
    Divider,
    Empty,
    Input,
    List,
    Row,
    Space,
    Tag,
    Typography,
} from "antd";
import { SearchOutlined, DeleteOutlined } from "@ant-design/icons"; // Step 1
import { useNavigate, useParams } from "react-router-dom";
import { useContactsAll } from "../../../api/query/contactsQuery";
import { getTimeAgo } from "../../../helpers";
import { TContact, TTextThread } from "../../../entities";
import ConfirmModal from "../../../components/ConfirmModal";
import { useMutation } from "react-query";
import queryClient from "../../../queryClient";
import { useTextThreads } from "../../../api/query/textQuery";
import { useDeleteThread } from "../../../api/mutation/useTextMutation";

const TextList = ({ label }) => {
    const [searchKey, setSearchKey] = useState("");
    const { textThreads, isLoading } = useTextThreads();
    const navigate = useNavigate();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleteBtnLoading, setIsDeleteBtnLoading] = useState(false);
    const [selectedThread, setSelectedThread] = useState<
        TTextThread | undefined
    >(undefined);

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

        if (searchKey) {
            let searchWord = searchKey;
            let label = "";
            const match = searchKey.match(/\{\{label:(.*?)\}\}/);

            if (match) {
                label = match[1];
                searchWord = searchWord.replace(/\{\{.*?\}\}\s*/g, "");
            }

            return data?.filter((thread) => {
                let bool = false;
                if (label) {
                    bool =
                        thread.contactName
                            .toLowerCase()
                            .includes(searchWord.toLowerCase()) &&
                        thread.label?.name == label;
                } else if (searchWord != "") {
                    bool = thread.contactName
                        .toLowerCase()
                        .includes(searchWord.toLowerCase());
                }

                return bool;
            });
        }

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
                                        <Space>
                                            {thread.label?.name ? (
                                                <Tag
                                                    style={{
                                                        float: "right",
                                                        fontWeight: "normal",
                                                    }}
                                                >
                                                    {thread.label?.name}
                                                </Tag>
                                            ) : null}
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
                                        {hoveredItemIndex === index ? ( // Step 3: Conditional rendering
                                            <DeleteOutlined
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedThread(thread);
                                                    setIsDeleteModalOpen(true);
                                                }}
                                            />
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
                handleNo={() => setIsDeleteModalOpen(false)}
                handleYes={async () => {
                    setIsDeleteBtnLoading(true);
                    await archiveThread.mutate(selectedThread!.id!);
                }}
                isOpen={isDeleteModalOpen}
                loading={isDeleteBtnLoading}
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
