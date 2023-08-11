import { CaretDownFilled } from "@ant-design/icons";
import type { MenuProps } from "antd";
import {
    Button,
    Col,
    Dropdown,
    Modal,
    Row,
    Space,
    Input,
    Select,
    Typography,
    Checkbox,
    Divider,
    Form,
} from "antd";
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined,
    VideoCameraOutlined,
    CheckCircleOutlined,
    FunnelPlotOutlined,
    PhoneOutlined,
    FileDoneOutlined,
    TeamOutlined,
    PlaySquareOutlined,
    TableOutlined,
    PlusCircleOutlined,
    DownOutlined,
    LockOutlined,
    CloseOutlined,
} from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import type { CheckboxChangeEvent } from "antd/es/checkbox";
import { DEFAULT_REQUIRED_MESSAGE } from "../../../constants";
import { useMutation, useQueryClient } from "react-query";
import { addContactMutation } from "../../../api/mutation/useContactMutation";
import queryClient from "../../../queryClient";
import { TContact } from "../../../entities";

import ContactsComponentsUpdateFields from "./ContactsComponentsUpdateFields";

interface ContactsComponentsUpdateProps {
    isModalOpenUpdate: boolean;
    setisModalOpenUpdate: any;
    record: any;
    title: any;
    setTContact: any;
    selectedData: TContact[];
}

const handleChange = (value: string) => {
    console.log(`selected ${value}`);
};

const handleChangeType = (value: string) => {
    console.log(`selected ${value}`);
};

const onChange = (e: CheckboxChangeEvent) => {
    console.log(`checked = ${e.target.checked}`);
};

const ContactsComponentsUpdate = ({
    isModalOpenUpdate,
    setisModalOpenUpdate,
    record,
    title,
    setTContact,
    selectedData,
}: ContactsComponentsUpdateProps) => {
    const queryClient = useQueryClient();
    const [form] = Form.useForm<TContact>();
    const [isAddNew, seIsAddNew] = useState(false);
    const [saveAndAdd, setSaveAndAdd] = useState(false);

    const addContact = useMutation(addContactMutation, {
        onSuccess: () => {
            console.log("success");
            queryClient.invalidateQueries("contacts");
            //queryClient.invalidateQueries("contactTypesAll");
            form.resetFields();
            if (!saveAndAdd) {
                setisModalOpenUpdate(false);
            }
            // queryClient.invalidateQueries("contacts");
        },
    });

    useEffect(() => {
        if (record) {
            console.log("record", record);
            //
            form.setFieldsValue(record);
        }
    }, [record]);

    useEffect(() => {
        console.log("title", title);
    }, [title]);

    const handleFinish = (values: any) => {
        console.log(values);

        selectedData.forEach((item) => {
            addContact.mutate({ ...item, ...values });
        });
    };

    const [activeField, setActiveField] = useState<string>("");
    return (
        <>
            <Modal
                closable={false}
                className="your-modal"
                width={500}
                title={null}
                open={isModalOpenUpdate}
                // onCancel={() => {
                //     console.log("asdasd");

                //     setTContact(null);
                //     form.resetFields();
                //     setIsModalOpen(false);
                // }}
                style={{ maxHeight: "700px" }}
                footer={null}
                // footer={[
                //     <Button type="primary">Save</Button>,
                //     <Button type="primary">Save and add other</Button>,
                //     <Button onClick={() => setIsModalOpen(false)}>
                //         Cancel
                //     </Button>,
                // ]}
            >
                <div className="modal-header">
                    <Typography.Title level={5} style={{ color: "white" }}>
                        Select Field to Update
                    </Typography.Title>

                    <Button
                        style={{
                            backgroundColor: "rgba(0, 0, 0, 0.5)",
                            border: "0px",
                        }}
                        onClick={() => {
                            setSaveAndAdd(false);
                            setTContact(null);
                            form.resetFields();
                            setisModalOpenUpdate(false);
                        }}
                        icon={<CloseOutlined style={{ color: "white" }} />}
                    />
                </div>
                <div className="modal-content">
                    <Row gutter={24} className="m-t-md">
                        <Col md={24} xs={24}>
                            <Select
                                defaultValue="Select"
                                style={{ width: "100%" }}
                                onChange={(value) => {
                                    setActiveField(value);
                                }}
                                options={[
                                    {
                                        value: "title",
                                        label: "Title",
                                    },
                                    // {
                                    //     value: "name",
                                    //     label: "Name",
                                    // },
                                    {
                                        value: "value",
                                        label: "Value",
                                    },
                                    {
                                        value: "stage",
                                        label: "Stage",
                                    },
                                    {
                                        value: "status",
                                        label: "Status",
                                    },
                                    // {
                                    //     value: "owner",
                                    //     label: "Status",
                                    // },
                                ]}
                            />
                        </Col>
                    </Row>

                    <Form
                        form={form}
                        onFinish={handleFinish}
                        layout="vertical"
                        initialValues={{ ownerId: 1 }}
                    >
                        <Row gutter={24} className="m-t-md">
                            <Col md={24} xs={24}>
                                <ContactsComponentsUpdateFields
                                    activeField={activeField}
                                />
                            </Col>
                        </Row>
                    </Form>
                </div>
                <div className="modal-footer">
                    <Button
                        className="m-r-xs"
                        type="primary"
                        onClick={() => {
                            setSaveAndAdd(false);
                            form.validateFields().then((values) => {
                                form.submit();
                            });
                        }}
                    >
                        Save
                    </Button>
                </div>
            </Modal>
        </>
    );
};

export default ContactsComponentsUpdate;
