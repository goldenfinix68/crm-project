import React, { useEffect, useState } from "react";
import {
    Button,
    Typography,
    Card,
    Divider,
    Row,
    message,
    Space,
    Select,
    Form,
    Col,
    Upload,
} from "antd";
import { useMutation } from "react-query";
import { DEFAULT_REQUIRED_MESSAGE } from "../../../constants";
import queryClient from "../../../queryClient";
import { useAppContextProvider } from "../../../context/AppContext";
import { userSettings } from "../../../api/mutation/useUserMutation";
import { useCustomFields } from "../../../api/query/customFieldQuery";
import type { UploadFile, UploadProps } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import axios from "axios";

const { Dragger } = Upload;

const OpenPhoneAudioImport = () => {
    const [progress, setProgress] = React.useState<number>(0);
    const [form] = Form.useForm();
    const { loggedInUser } = useAppContextProvider();
    const [defaultFileList, setDefaultFileList] = useState<UploadFile<any>[]>(
        []
    );

    const propsUpload: UploadProps = {
        name: "file",
        multiple: true,
        // action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
        customRequest(options) {
            const { onSuccess, onError, file, onProgress } = options;

            const fmData = new FormData();
            const accessToken = localStorage.getItem("access_token");
            const config = {
                headers: {
                    "content-type": "multipart/form-data",
                    Authorization: `Bearer ${accessToken}`,
                },
                onUploadProgress: (event) => {
                    const percent = Math.floor(
                        (event.loaded / event.total) * 100
                    );
                    setProgress(percent);
                    if (percent === 100) {
                        setTimeout(() => setProgress(0), 1000);
                    }
                    if (onProgress !== undefined) {
                        onProgress({
                            percent: (event.loaded / event.total) * 100,
                        });
                    }
                },
            };
            fmData.append("audio", file);
            console.log(file);
            try {
                const res = axios.post(
                    "https://speedlead.click/api/openphone/upload",
                    fmData,
                    config
                );

                res.then((res) => {
                    console.log(res.data);
                    if (onSuccess && res.data.success) {
                        onSuccess("Ok");

                        message.success(
                            `${file.name} file uploaded successfully.`
                        );
                    }
                    console.log("server res: ", res);
                });
            } catch (err) {
                console.log("Eroor: ", err);
                if (onError) onError(err);
            }
        },
        onChange: (info) => {
            console.log(info.fileList);
            setDefaultFileList(info.fileList);
        },
        accept: ".mp3",
    };

    return (
        <Space direction="vertical">
            <Card>
                <Typography.Title level={3}>
                    OpenPhone Audio Import
                </Typography.Title>
                <Typography className="m-b-sm">
                    Now, you can import audio files from OpenPhone.
                </Typography>
                {/* <Button
                    type="link"
                    className="p-0"
                    onClick={() => console.log(true)}
                >
                    Learn more about how to import contacts into Roor.
                </Button> */}
                <Divider />
                <Dragger {...propsUpload}>
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">
                        Click or drag file to this area to upload
                    </p>
                    <p className="ant-upload-hint">
                        Support for a single or bulk upload. Strictly prohibit
                        from uploading company data or other band files
                    </p>
                </Dragger>
            </Card>
        </Space>
    );
};
export default OpenPhoneAudioImport;
