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
import { deleteTextTemplateMutation } from "../../../api/mutation/useTextTemplateMutation";
import ConfirmModal from "../../../components/ConfirmModal";
import { useAppContextProvider } from "../../../context/AppContext";
interface Props {
    handleEditBtnClicked: (template: TTextTemplate) => void;
}

const TextTemplatesTable = ({ handleEditBtnClicked }: Props) => {
    const { route } = useParams();
    const folder = route ?? "All";
    const navigate = useNavigate();
    const { templates, isLoading } = useTextTemplates();
    const [template, setTemplate] = useState<TTextTemplate | undefined>();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleteBtnLoading, setIsDeleteBtnLoading] = useState(false);
    const { isRoleStats } = useAppContextProvider();

    const deleteTemplate = useMutation(
        (id: string) => deleteTextTemplateMutation(id),
        {
            onSuccess: () => {
                queryClient.invalidateQueries("textTemplates");
                setIsDeleteModalOpen(false);
            },
            onError: (e: any) => {
                console.log(e.message || "An error occurred");
            },
        }
    );
    const columns: ColumnsType<TTextTemplate> = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            render: (text) => <p className="p-l-md">{text}</p>,
        },
        {
            title: "Created By",
            key: "created_at",
            render: (_, record) =>
                record.user?.firstName + " " + record.user?.lastName,
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
                    <Button
                        type="link"
                        style={{ padding: "0" }}
                        onClick={() => handleEditBtnClicked(record)}
                        disabled={isRoleStats}
                    >
                        <EditOutlined />
                    </Button>
                    <Button
                        type="link"
                        style={{ padding: "0" }}
                        onClick={() => {
                            setTemplate(record);
                            setIsDeleteModalOpen(true);
                        }}
                        disabled={isRoleStats}
                    >
                        <DeleteOutlined />
                    </Button>
                </Space>
            ),
        },
    ];

    const filteredTemplates = () => {
        if (folder == "Archived") {
            return templates?.filter((template) => template.deleted_at);
        } else if (folder != "All") {
            return templates?.filter(
                (template) =>
                    !template.deleted_at && template.folder?.name == folder
            );
        } else {
            return templates?.filter((template) => !template.deleted_at);
        }
    };

    if (isLoading) {
        return <LoadingComponent />;
    }
    return (
        <>
            <Table columns={columns} dataSource={filteredTemplates()} />

            <ConfirmModal
                title="Confirm"
                message={`Are you sure you want to delete ${template?.name}?`}
                handleNo={() => setIsDeleteModalOpen(false)}
                handleYes={async () => {
                    setIsDeleteBtnLoading(true);
                    await deleteTemplate.mutate(template!.id!);
                    setIsDeleteBtnLoading(false);
                }}
                isOpen={isDeleteModalOpen}
                loading={isDeleteBtnLoading}
            />
        </>
    );
};
export default TextTemplatesTable;
