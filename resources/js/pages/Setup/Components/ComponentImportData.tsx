import React, { useEffect, useState } from "react";
import {
    Button,
    Form,
    Input,
    Modal,
    Popconfirm,
    Space,
    Table,
    Typography,
    notification,
    Card,
    Divider,
    Row,
    message,
    Upload,
} from "antd";
import {
    DeleteOutlined,
    EditOutlined,
    PlusCircleOutlined,
    LoadingOutlined,
    PlusOutlined,
} from "@ant-design/icons";
import validateRules from "../../../providers/validateRules";

import { useMutation, useQueryClient } from "react-query";
import { mutateGet, mutatePost } from "../../../api/mutation/useSetupMutation";
import type { RcFile, UploadFile, UploadProps } from "antd/es/upload/interface";
import type { UploadChangeParam } from "antd/es/upload";

const getBase64 = (img: RcFile, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result as string));
    reader.readAsDataURL(img);
};

const beforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
        message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error("Image must smaller than 2MB!");
    }
    return isJpgOrPng && isLt2M;
};

const ComponentImportData: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState<string>();

    const handleChange: UploadProps["onChange"] = (
        info: UploadChangeParam<UploadFile>
    ) => {
        if (info.file.status === "uploading") {
            setLoading(true);
            return;
        }
        if (info.file.status === "done") {
            // Get this url from response in real world.
            getBase64(info.file.originFileObj as RcFile, (url) => {
                setLoading(false);
                setImageUrl(url);
            });
        }
    };

    const uploadButton = (
        <div>
            {loading ? <LoadingOutlined /> : ""}
            <div style={{ marginTop: 8 }}>
                Drag and drop or choose a file We support .csv, .xls and .xlsx
                files.
            </div>
        </div>
    );

    const queryClient = useQueryClient();

    const [modalTitle, setModalTitle] = useState("Add");

    return (
        <>
            <Card>
                <Typography.Title level={3}>Import using file</Typography.Title>
                <Typography className="m-b-sm">
                    You can import contacts, companies, deals, activities, and
                    notes separately or using a single file by grouping records
                    together.
                </Typography>
                <Typography.Link href="" target="_blank">
                    Learn more about how to import using an individual or
                    grouped file.
                </Typography.Link>
                <Divider />
                <Row style={{ display: "flex", justifyContent: "center" }}>
                    <Typography.Title level={5}>
                        Need help in getting started?
                    </Typography.Title>
                </Row>
                <Row style={{ display: "flex", justifyContent: "center" }}>
                    <Typography.Link href="" target="_blank">
                        Download sample speadsheet
                    </Typography.Link>
                    <Typography className="m-r-sm m-l-sm">|</Typography>
                    <Typography.Link href="" target="_blank">
                        view import FAQs
                    </Typography.Link>
                </Row>
                <Row>
                    <Upload
                        name="avatar"
                        listType="picture-card"
                        className="avatar-uploader upload m-t-lg"
                        showUploadList={false}
                        action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                        beforeUpload={beforeUpload}
                        onChange={handleChange}
                    >
                        {imageUrl ? (
                            <img
                                src={imageUrl}
                                alt="avatar"
                                style={{ width: "100%" }}
                            />
                        ) : (
                            uploadButton
                        )}
                    </Upload>
                </Row>
                <Row className="m-t-xl">
                    <Button type="primary">Next</Button>
                </Row>
            </Card>
        </>
    );
};

export default ComponentImportData;
