import React, { useContext, useEffect, useRef, useState } from "react";
import {
    Button,
    Col,
    Dropdown,
    Input,
    Modal,
    Radio,
    Row,
    Space,
    Table,
    Tooltip,
    Typography,
    Form,
    Select,
    DatePicker,
    Breadcrumb,
    Avatar,
} from "antd";

import {
    CloseOutlined,
    DeleteOutlined,
    EditOutlined,
    PlusOutlined,
} from "@ant-design/icons";

import { useMutation } from "react-query";
import { sendTextMutation } from "../../../api/mutation/useTextMutation";
import queryClient from "../../../queryClient";
import TextForm from "../../Texts/components/TextForm";
import { DEFAULT_REQUIRED_MESSAGE } from "../../../constants";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import AddUpdateTemplateModal from "./AddUpdateTemplate";
import { TTextTemplate, TTextTemplateFolder } from "../../../entities";
import { ColumnsType } from "antd/es/table";
import { useTextTemplates } from "../../../api/query/textTemplateQuery";
import LoadingComponent from "../../../components/LoadingComponent";
import moment from "moment";
interface Props {
    folders?: TTextTemplateFolder[];
}

const TextTemplatesTable = ({ folders }: Props) => {
    const { route } = useParams();
    const folder = route ?? "all";
    const navigate = useNavigate();
    const { templates, isLoading } = useTextTemplates();
    const columns: ColumnsType<TTextTemplate> = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            render: (text) => <a>{text}</a>,
        },
        {
            title: "Created By",
            key: "created_at",
            render: (_, record) => (
                <div>
                    <Avatar
                        className="avatarText m-r-sm"
                        size={32}
                        style={{
                            backgroundColor: "#1677FF",
                            verticalAlign: "middle",
                            flexShrink: 0, // Prevent the Avatar from being shrunk
                        }}
                    >
                        {record.user?.firstName.charAt(0)}
                    </Avatar>{" "}
                    {record.user?.firstName + " " + record.user?.lastName}
                </div>
            ),
        },
        {
            title: "Sent",
            dataIndex: "sent",
            render: (text) => "",
        },
        {
            title: "Created",
            key: "created_at",
            render: (text) => moment(text).format("MMM D, YYYY"),
        },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <Space size="middle">
                    <Button type="link" style={{ padding: "0" }}>
                        <EditOutlined />
                    </Button>
                    <Button type="link" style={{ padding: "0" }}>
                        <DeleteOutlined />
                    </Button>
                </Space>
            ),
        },
    ];

    if (isLoading) {
        return <LoadingComponent />;
    }
    return (
        <>
            <Table
                columns={columns}
                dataSource={
                    folder == "All"
                        ? templates
                        : templates?.filter(
                              (template) => template.folder?.name == folder
                          )
                }
            />
        </>
    );
};
export default TextTemplatesTable;
