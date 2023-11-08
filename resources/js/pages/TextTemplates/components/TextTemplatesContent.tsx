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
import { TTextTemplate, TTextTemplateFolder } from "../../../entities";
import TextTemplatesTable from "./TextTemplateTable";
import { useAppContextProvider } from "../../../context/AppContext";
interface Props {
    folders?: TTextTemplateFolder[];
}
const TextTemplatesContent = ({ folders }: Props) => {
    const { route } = useParams();
    const folder = route ?? "All";
    const navigate = useNavigate();
    const [isAddEditTemplateOpen, setIsAddEditTemplateOpen] = useState(false);
    const [template, setTemplate] = useState<TTextTemplate | undefined>();

    const openAddEditTemplateModal = () => {
        setIsAddEditTemplateOpen(true);
    };
    const closeAddEditTemplateModal = () => {
        setIsAddEditTemplateOpen(false);
        setTemplate(undefined);
    };
    const handleEditBtnClicked = (template: TTextTemplate) => {
        setTemplate(template);
        openAddEditTemplateModal();
    };

    return (
        <Space direction="vertical" style={{ width: "100%" }}>
            <TopNav folder={folder} handleAdd={openAddEditTemplateModal} />
            <div style={{ padding: "20px" }}>
                <TextTemplatesTable
                    handleEditBtnClicked={handleEditBtnClicked}
                />
            </div>

            <AddUpdateTemplateModal
                handleClose={closeAddEditTemplateModal}
                isModalOpen={isAddEditTemplateOpen}
                template={template}
            />
        </Space>
    );
};

type TopNavProps = {
    folder: string;
    handleAdd: () => void;
};

const TopNav = ({ folder, handleAdd }: TopNavProps) => {
    const { isRoleStats } = useAppContextProvider();

    return (
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
                        <Link to="/text-threads">Text Threads</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>{folder}</Breadcrumb.Item>
                </Breadcrumb>
            </div>

            <div
                style={{
                    marginLeft: "16px",
                }}
            >
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleAdd}
                    disabled={isRoleStats}
                >
                    Add Template
                </Button>
            </div>
        </div>
    );
};
export default TextTemplatesContent;
