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
    Modal,
} from "antd";
import { useMutation } from "react-query";
import { DEFAULT_REQUIRED_MESSAGE } from "../../../constants";
import queryClient from "../../../queryClient";
import { useAppContextProvider } from "../../../context/AppContext";
import { userSettings } from "../../../api/mutation/useUserMutation";
import { useCustomFields } from "../../../api/query/customFieldQuery";
import type { UploadFile, UploadProps } from "antd";
import { CloseOutlined, InboxOutlined } from "@ant-design/icons";
import axios from "axios";

const { Dragger } = Upload;

const OpenPhoneAudioImport = () => {
    useEffect(() => {
        document.title = "OpenPhone Audio Import - SpeedLead";
        return () => {};
    }, []);
    const [progress, setProgress] = React.useState<number>(0);
    const [form] = Form.useForm();
    const { loggedInUser } = useAppContextProvider();
    const [defaultFileList, setDefaultFileList] = useState<UploadFile<any>[]>(
        []
    );
    const [isInstructionModalOpen, setIsInstructionModalOpen] = useState(false);

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
        <Card className="w-100">
            <Typography.Title level={3}>Manual Audio Import</Typography.Title>
            <Typography className="m-b-sm">
                Now, you can import audio files and automatically attached it
                with the contact base on the file name.
            </Typography>

            <Button
                type="link"
                className="p-0"
                onClick={() => setIsInstructionModalOpen(true)}
            >
                Learn more about manual audio import.
            </Button>
            <Divider />
            <Dragger {...propsUpload}>
                <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                    Click or drag file to this area to upload
                </p>
                <p className="ant-upload-hint">
                    Support for a single or bulk upload. Strictly prohibit from
                    uploading company data or other band files
                </p>
            </Dragger>

            <Modal
                className="modal-activity"
                open={isInstructionModalOpen}
                onCancel={() => {
                    setIsInstructionModalOpen(false);
                }}
                footer={null}
                title={null}
                closable={false}
                width={"500px"}
            >
                <div className="modal-header">
                    <Typography.Title level={5} style={{ color: "white" }}>
                        Instruction
                    </Typography.Title>

                    <Button
                        onClick={() => {
                            setIsInstructionModalOpen(false);
                        }}
                        style={{
                            backgroundColor: "rgba(0, 0, 0, 0.5)",
                            border: "0px",
                        }}
                        icon={<CloseOutlined style={{ color: "white" }} />}
                    />
                </div>
                <ol className="p-t-xl">
                    <li>
                        Ensure that the file name follows the correct format:
                        <ul>
                            <li>
                                Format: yyyy-mm-ddThh_mm_ss + contact number
                            </li>
                            <li>
                                Example:
                                2024-03-24T19_56_16+00_00+13034892316.mp3
                            </li>
                        </ul>
                    </li>
                    <li>
                        The system will automatically attach the call recording
                        to the contact's history within their profile. This
                        ensures that the recording is seamlessly integrated into
                        the contact's interaction log for easy access and
                        reference.
                    </li>
                </ol>
            </Modal>
        </Card>
    );
};
export default OpenPhoneAudioImport;
