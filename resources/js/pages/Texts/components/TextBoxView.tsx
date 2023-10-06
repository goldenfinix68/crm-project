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
import TextItem from "./TextList";
import LoadingComponent from "../../../components/LoadingComponent";
import AddUpdateTextLabelModal from "../../PageContacts/Components/AddUpdateTextLabelModal";
import { useTextLabels, useTextThread } from "../../../api/query/textQuery";
import TextsHeaderMenu from "./../components/TextsHeaderMenu";
import Texts from "..";
import TextList from "./TextList";
import { useMutation } from "react-query";
import queryClient from "../../../queryClient";
import { useMarkThreadSeen } from "../../../api/mutation/useTextMutation";

const TextBoxView = () => {
    const { threadId } = useParams();
    const navigate = useNavigate();

    const {
        thread,
        refetch,
        isLoading: isThreadLoading,
    } = useTextThread(threadId ?? "", (data) => {
        setIsLoading(false);
    });

    const [label, setLabel] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isCreateLabelModalOpen, setIsCreateLabelModalOpen] = useState(false);
    const [selectedTextLabel, setSelectedTextLabel] = useState<
        TTextLabel | undefined
    >(undefined);

    const markAsSeen = useMutation(useMarkThreadSeen, {
        onSuccess: () => {
            queryClient.invalidateQueries("threads");
        },
    });

    useEffect(() => {
        // Check if the contact exists and has no value
        if (!threadId) {
            navigate("/texts");
        } else {
            setIsLoading(true);
            refetch();
            markAsSeen.mutate({ threadId });
        }
    }, [threadId]);

    if (isThreadLoading) {
        return <LoadingComponent />;
    }

    return (
        <Space direction="vertical" style={{ width: "100%" }}>
            {isLoading && <LoadingComponent />}
            <TextsHeaderMenu
                handleLabelChange={(e) => setLabel(`{{label:${e.key}}} `)}
            />
            <Card bodyStyle={{ padding: 0 }}>
                <Row gutter={0} style={{ height: "85vh" }}>
                    <Col span={11} style={{ padding: "24px" }}>
                        <TextList label={label} />
                    </Col>

                    <Col
                        span={13}
                        style={{
                            backgroundColor: "#F5F5F5",
                            margin: 0,
                            height: "85vh",
                            overflowY: "auto",
                        }}
                    >
                        <TextContent thread={thread!} menu={"all"} />
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
