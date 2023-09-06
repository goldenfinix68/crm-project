import React, { useContext, useState } from "react";
import { InboxOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import { Button, message, notification, Upload } from "antd";
import axios from "axios";
import { useMutation } from "react-query";
import ContactContext from "../context";
import Resizer from "react-image-file-resizer";
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

const props: UploadProps = {
    name: "file",
    multiple: true,
    action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
    onChange(info) {
        const { status } = info.file;
        if (status !== "uploading") {
            console.log(info.file, info.fileList);
        }
        if (status === "done") {
            message.success(`${info.file.name} file uploaded successfully.`);
        } else if (status === "error") {
            message.error(`${info.file.name} file upload failed.`);
        }
    },
    onDrop(e) {
        console.log("Dropped files", e.dataTransfer.files);
    },
};

const FileTab = () => {
    const [fileList, setFileList] = useState([]);
    const handleChangeUpload = async ({ fileList: newFileList }) => {
        try {
            const modifiedFiles: any = await Promise.all(
                newFileList.map(async (item) => {
                    const compressedImage: any = await new Promise(
                        (resolve) => {
                            Resizer.imageFileResizer(
                                item.originFileObj,
                                1080, // maxWidth
                                1080, // maxHeight
                                "jpeg", // compressFormat
                                70, // quality
                                0, // rotation
                                (compressedImage) => {
                                    resolve(compressedImage);
                                },
                                "file", // outputType
                                1000 // minWidth
                            );
                        }
                    );

                    return {
                        originFileObj: compressedImage,
                        is_delete: 0,
                        lastModified: compressedImage.lastModified,
                        lastModifiedDate: compressedImage.lastModifiedDate,
                        name: compressedImage.name,
                        size: compressedImage.size,
                        type: compressedImage.type,
                        uid: item.uid,
                        status: "done",
                    };
                })
            );

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
        mutateUpload(data, {
            onSuccess: (res) => {
                if (res.success) {
                    notification.success({
                        message: "Deals",
                        description: "File(s) Successfully Added",
                    });

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
        <>
            <Dragger
                multiple={true}
                name="avatar"
                action={""}
                fileList={fileList}
                onChange={handleChangeUpload}
                accept="image/png,image/jpg,image/jpeg,image/gif"
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
        </>
    );
};

export default FileTab;
