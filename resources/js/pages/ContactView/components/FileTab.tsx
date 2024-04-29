import React, { useContext, useState } from "react";
import { InboxOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import { Button, message, notification, Select, Space, Upload } from "antd";
import axios from "axios";
import { useMutation } from "react-query";
import ContactContext from "../context";
import Resizer from "react-image-file-resizer";
import queryClient from "../../../queryClient";
const { Dragger } = Upload;

function POST_FILE(url: any) {
    const accessToken = localStorage.getItem("access_token");
    return useMutation((data: any) => {
        return axios
            .post(`${window.location.origin}${url}`, data, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })
            .then((res) => res.data);
    });
}

const FileTab = () => {
    const [fileList, setFileList] = useState([]);
    const [fileType, setFileType] = useState("Call Recording");
    const handleChangeUpload = async ({ fileList: newFileList }) => {
        try {
            const modifiedFiles = newFileList.map((item) => ({
                ...item,
                status: "done",
            }));

            setFileList(modifiedFiles);
        } catch (error) {
            console.error("Error occurred:", error);
        }
    };
    const { contact } = useContext(ContactContext);
    const { mutate: mutateUpload, isLoading: isLoadingUploadDeliveryRequest } =
        POST_FILE("/api/contacts/add_files");

    const onSaveChangeFile = (value: any) => {
        let data = new FormData();
        data.append("contact_id", "" + contact.id);
        let count: number = 0;
        for (let x = 0; x < fileList.length; x++) {
            const elem: any = fileList[x];
            data.append("files_" + x, elem.originFileObj, elem.name);
            count++;
        }
        data.append("files_count", "" + count);
        data.append("fileType", fileType);
        mutateUpload(data, {
            onSuccess: (res) => {
                if (res.success) {
                    notification.success({
                        message: "File(s) Successfully Added",
                    });
                    queryClient.invalidateQueries("getContact");
                    setFileList([]);
                }
            },
            onError: (err) => {},
        });

        // for (let x = 0; x < fileList.length; x++) {
        //     const elem: any = fileList[x];
        //     data.append("files_" + x, elem.originFileObj, elem.name);
        // }

        // addDealsFile.mutate({ id: fileList });
    };

    return (
        <Space direction="vertical" className="w-100">
            <Space size={0} direction="vertical" className="w-100">
                File Type
                <Select
                    style={{ width: "100%" }}
                    value={fileType}
                    onChange={(e) => setFileType(e)}
                >
                    <Select.Option value="Call Recording">
                        Call Recording
                    </Select.Option>
                    <Select.Option value="Image">Image</Select.Option>
                </Select>
            </Space>
            <Dragger
                multiple={true}
                name="avatar"
                action={""}
                fileList={fileList}
                onChange={handleChangeUpload}
                accept={
                    fileType == "Call Recording"
                        ? "audio/mpeg,audio/wav"
                        : "image/png,image/jpg,image/jpeg,image/gif"
                }
            >
                <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                    Drag and Drop files here or Click to upload
                </p>
            </Dragger>
            <div style={{ marginTop: 15 }}>
                <Button
                    type="primary"
                    onClick={onSaveChangeFile}
                    style={{ float: "right" }}
                >
                    Save
                </Button>
            </div>
        </Space>
    );
};

export default FileTab;
