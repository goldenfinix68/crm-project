import React, { useEffect, useState } from "react";
import {
    Avatar,
    Button,
    Card,
    Col,
    Dropdown,
    Empty,
    Input,
    Menu,
    Row,
    Space,
    Tag,
    Typography,
} from "antd";
import {
    AppstoreOutlined,
    ClockCircleOutlined,
    DeleteOutlined,
    FolderOutlined,
    InboxOutlined,
    MailOutlined,
    SearchOutlined,
    SendOutlined,
    SettingOutlined,
    EllipsisOutlined,
    PlusCircleOutlined,
    TagFilled,
} from "@ant-design/icons";
import { Divider } from "rc-menu";
import {
    useContactsAll,
    useGetContact,
} from "../../../api/query/contactsQuery";
import { TContact, TText, TTextLabel } from "../../../entities";
import DropdownComponent from "../../../components/DropdownComponent";
import ChatBoxItem from ".././components/ChatBoxItem";
import ContactInfo from "../../ContactView/components/ContactInfo";
import ContactContext from "../../ContactView/context";
import TextContent from "./../components/TextContent";
import { useNavigate, useParams } from "react-router-dom";
import { getTimeAgo } from "../../../helpers";
import SentBox from "./../components/SentBox";
import TextItem from "./../components/TextItem";
import LoadingComponent from "../../../components/LoadingComponent";
import AddUpdateTextLabelModal from "../../PageContacts/Components/AddUpdateTextLabelModal";
import { useTextLabels } from "../../../api/query/textQuery";
import TextsHeaderMenu from "./../components/TextsHeaderMenu";

const TextBoxView = () => {
    const { contactId } = useParams();
    const navigate = useNavigate();

    const {
        contact,
        refetch,
        isLoading: isContactLoading,
    } = useGetContact(contactId ?? "", (data) => {
        setIsLoading(false);
    });

    const [searchKey, setSearchKey] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { contacts, isLoading: isContractsLoading } = useContactsAll();
    const [isCreateLabelModalOpen, setIsCreateLabelModalOpen] = useState(false);
    const [selectedTextLabel, setSelectedTextLabel] = useState<
        TTextLabel | undefined
    >(undefined);

    const filteredContacts = (): TContact[] | undefined => {
        let data = contacts;

        data = data?.filter((contact) => contact.texts?.length);

        if (searchKey) {
            let searchWord = searchKey;
            let label = "";
            const match = searchKey.match(/\{\{label:(.*?)\}\}/);

            if (match) {
                label = match[1];
                searchWord = searchWord.replace(/\{\{.*?\}\}\s*/g, "");
            }

            return data?.filter((contact) => {
                let bool = false;
                if (label) {
                    bool =
                        (contact.firstName
                            .toLowerCase()
                            .includes(searchWord.toLowerCase()) ||
                            contact.lastName
                                .toLowerCase()
                                .includes(searchWord.toLowerCase())) &&
                        contact.label?.name == label;
                } else if (searchWord != "") {
                    bool =
                        contact.firstName
                            .toLowerCase()
                            .includes(searchWord.toLowerCase()) ||
                        contact.lastName
                            .toLowerCase()
                            .includes(searchWord.toLowerCase());
                }

                return bool;
            });
        }

        return data;
    };
    useEffect(() => {
        // Check if the contact exists and has no value
        if (!contactId) {
            navigate("/texts");
        } else {
            setIsLoading(true);
            refetch();
        }
    }, [contactId]);

    if (isLoading || isContactLoading || isContractsLoading) {
        return <LoadingComponent />;
    }

    return (
        <Space direction="vertical" style={{ width: "100%" }}>
            <TextsHeaderMenu
                handleLabelChange={(e) => setSearchKey(`{{label:${e.key}}} `)}
            />
            <Card bodyStyle={{ padding: 0 }}>
                <Row gutter={0} style={{ height: "85vh" }}>
                    <Col span={6} style={{ padding: "24px" }}>
                        <Space
                            direction="vertical"
                            style={{
                                padding: "10px",
                                width: "100%",
                            }}
                        >
                            <Input
                                suffix={<SearchOutlined />}
                                placeholder="Search"
                                style={{ marginBottom: "20px" }}
                                onChange={(e: any) =>
                                    setSearchKey(e.target.value)
                                }
                                value={searchKey}
                            />
                            {filteredContacts()?.length ? (
                                filteredContacts()?.map((contact) => {
                                    if (contact.texts?.length) {
                                        return (
                                            <div
                                                style={{
                                                    cursor: "pointer",
                                                }}
                                                onClick={() =>
                                                    navigate(
                                                        "/texts/contact/" +
                                                            contact.id
                                                    )
                                                }
                                            >
                                                <TextItem
                                                    name={`${contact.firstName} ${contact.lastName}`}
                                                    text={contact?.texts![0]}
                                                    label={contact.label?.name}
                                                />
                                            </div>
                                        );
                                    }
                                    return null;
                                })
                            ) : (
                                <Typography.Text>
                                    No converstation found.
                                </Typography.Text>
                            )}
                        </Space>
                    </Col>

                    <Col
                        span={18}
                        style={{
                            backgroundColor: "#F5F5F5",
                            margin: 0,
                            height: "85vh",
                            overflowY: "auto",
                        }}
                    >
                        <TextContent contact={contact!} menu={"all"} />
                    </Col>
                </Row>

                <AddUpdateTextLabelModal
                    isModalOpen={isCreateLabelModalOpen}
                    closeModal={() => setIsCreateLabelModalOpen(false)}
                    textLabel={selectedTextLabel}
                />
            </Card>
        </Space>
    );
};
export default TextBoxView;
