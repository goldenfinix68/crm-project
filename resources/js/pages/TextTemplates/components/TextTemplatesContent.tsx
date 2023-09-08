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
} from "antd";

import { CloseOutlined, PlusOutlined } from "@ant-design/icons";

import { useMutation } from "react-query";
import { sendTextMutation } from "../../../api/mutation/useTextMutation";
import queryClient from "../../../queryClient";
import TextForm from "../../Texts/components/TextForm";
import { DEFAULT_REQUIRED_MESSAGE } from "../../../constants";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import AddUpdateTemplateModal from "./AddUpdateTemplate";
import { TTextTemplateFolder } from "../../../entities";
import TextTemplatesTable from "./TextTemplateTable";
interface Props {
    folders?: TTextTemplateFolder[];
}
const TextTemplatesContent = ({ folders }: Props) => {
    const { route } = useParams();
    const folder = route ?? "all";
    const navigate = useNavigate();

    return (
        <Space direction="vertical" style={{ width: "100%" }}>
            <TopNav folder={folder} />
            <div style={{ padding: "20px" }}>
                <TextTemplatesTable />
            </div>
        </Space>
    );
};

const TopNav = ({ folder }) => (
    <div
        style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px",
            backgroundColor: "white",
        }}
    >
        <div
            style={{
                flexGrow: 1,
            }}
        >
            <Breadcrumb style={{ fontSize: "20px" }}>
                <Breadcrumb.Item>
                    <Link to="/texts">Text</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>{folder}</Breadcrumb.Item>
            </Breadcrumb>
        </div>
        <div
            style={{
                marginLeft: "16px",
            }}
        >
            <AddUpdateTemplateModal />
        </div>
    </div>
);

export default TextTemplatesContent;
