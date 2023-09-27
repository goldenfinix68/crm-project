import React, { useEffect, useState } from "react";
import {
    Avatar,
    Button,
    Card,
    Col,
    Dropdown,
    Empty,
    Input,
    List,
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
import { useContactsAll } from "../../api/query/contactsQuery";
import { TContact, TText, TTextLabel } from "../../entities";
import DropdownComponent from "../../components/DropdownComponent";
import ChatBoxItem from "./components/ChatBoxItem";
import ContactInfo from "../ContactView/components/ContactInfo";
import ContactContext from "../ContactView/context";
import TextContent from "./components/TextContent";
import { useNavigate, useParams } from "react-router-dom";
import { getTimeAgo } from "../../helpers";
import SentBox from "./components/SentBox";
import TextItem from "./components/TextList";
import LoadingComponent from "../../components/LoadingComponent";
import AddUpdateTextLabelModal from "../PageContacts/Components/AddUpdateTextLabelModal";
import { useTextLabels } from "../../api/query/textQuery";
import TextsHeaderMenu from "./components/TextsHeaderMenu";
import TextList from "./components/TextList";

const Texts = () => {
    const { route } = useParams();
    const [label, setLabel] = useState("");
    const navigate = useNavigate();
    const isChatBox = ["all", "inbox"].includes(route ?? "all");
    return (
        <Space direction="vertical" style={{ width: "100%" }}>
            <TextsHeaderMenu
                handleLabelChange={(e) => setLabel(`{{label:${e.key}}} `)}
            />
            <Card>
                {isChatBox ? (
                    <TextList label={label} />
                ) : (
                    <SentBox menu={route} />
                )}
            </Card>
        </Space>
    );
};

export default Texts;
