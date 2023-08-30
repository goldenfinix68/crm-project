import React, { useEffect, useRef, useState } from "react";
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
    notification,
    InputNumber,
    Tag,
} from "antd";

import {
    AuditOutlined,
    CloseOutlined,
    ContainerOutlined,
    DownOutlined,
    FilterOutlined,
    GroupOutlined,
    InsertRowBelowOutlined,
    MobileOutlined,
    PhoneOutlined,
    PlusCircleOutlined,
} from "@ant-design/icons";

import Title from "antd/es/skeleton/Title";
import TextArea from "antd/es/input/TextArea";
import { useNavigate } from "react-router-dom";
import { useForm } from "antd/es/form/Form";
import { useMutation, useQueryClient } from "react-query";
import {
    useDealMutation,
    useDealMutationAddParticipant,
    useDealMutationAddTeammate,
    useDealMutationDeleteParticipants,
    useDealMutationDeleteTeammate,
} from "../../../api/mutation/useDealMutation";
import { useContactsAll } from "../../../api/query/contactsQuery";
import {
    useContactsList,
    useDealsList,
    useUsersList,
} from "../../../api/query/activityQuery";
import moment from "moment";
import { TContact } from "../../../entities";
interface Teamate {
    id: number;
    firstName: string;
    lastName: string;
}
interface Props {
    isModalOpenAdd: boolean;
    handleOkAdd: () => void;
    handleCancelAdd: () => void;

    showModalAddDealValue?: string;
    from?: string;
    modalValue?: any;
}

const ModalAddDeal = ({
    isModalOpenAdd,
    handleOkAdd,
    handleCancelAdd,
    showModalAddDealValue,
    from,
    modalValue,
}: Props) => {
    const { dataUsers, isLoadingUsers } = useUsersList();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { contacts, isLoading } = useContactsAll("All");
    const [form] = useForm();
    const onFinish = (values: any) => {
        mutation.mutate({
            ...values,
            id: from == "update" ? modalValue.id : 0,
            estimated_close_date: values.estimated_close_date.format(
                "YYYY-MM-DD h:mm:ss "
            ),
            teamateLocal: teamateLocal,
            particapantLocal: particapantLocal,
        });
    };

    const mutation = useMutation(useDealMutation, {
        onSuccess: (res) => {
            // navigate("/users"); // Redirect to the users list page after successful submission
            if (res.success) {
                notification.success({
                    message: "Deal",
                    description: "Successfully Added",
                });
                handleOkAdd();
            }
        },
    });

    const calendar = useRef();

    useEffect(() => {
        if (showModalAddDealValue) {
            form.setFieldsValue({
                stage: showModalAddDealValue,
            });
        }
    }, [showModalAddDealValue]);

    useEffect(() => {
        console.log("modalValue", modalValue);
        if (from == "update" || from == "clone") {
            form.setFieldsValue({
                ...modalValue,
                estimated_close_date: moment(modalValue.estimated_close_date),
                owner: modalValue?.owner?.id,
            });
        }
    }, [isModalOpenAdd]);

    const onChangeSelectTeammate = (value: any) => {
        addTeammate.mutate({ user_id: value, deal_id: "" + modalValue.id });
    };

    useEffect(() => {
        if (modalValue) {
            console.log("modalValue", modalValue);
        }
    }, [modalValue]);

    const addTeammate = useMutation(useDealMutationAddTeammate, {
        onSuccess: (res) => {
            notification.success({
                message: "Deals",
                description: "Teammate Successfully Added",
            });
        },
    });

    const deleteTeammate = useMutation(useDealMutationDeleteTeammate, {
        onSuccess: (res) => {
            notification.success({
                message: "Deals",
                description: "Delete Successfully Added",
            });
        },
    });

    const handleCloseTeammate = (value: any) => {
        deleteTeammate.mutate({ id: value });
    };
    const deleteParticipant = useMutation(useDealMutationDeleteParticipants, {
        onSuccess: (res) => {
            notification.success({
                message: "Deals",
                description: "Delete Successfully Added",
            });
        },
    });

    const handleClose = (value: any) => {
        deleteParticipant.mutate({ id: modalValue.id });
    };

    const [teamateLocal, setTeamateLocal] = useState([]);
    const onChangeSelectTeammateToAdd = (val: any) => {
        if (contacts) {
            let find = contacts.filter((x) => x.id == val);
            var a = {
                id: find[0].id,
                label: find[0].firstName + " " + find[0].lastName,
            };

            setTeamateLocal([...teamateLocal, a]);

            console.log(find);
        }
    };

    const onChangeSelectParticipant = (value: any) => {
        addParticipant.mutate({ user_id: value, deal_id: "" + modalValue.id });
    };

    const addParticipant = useMutation(useDealMutationAddParticipant, {
        onSuccess: (res) => {
            notification.success({
                message: "Deals",
                description: "Participant Successfully Added",
            });
        },
    });

    const [particapantLocal, setParticipantLocal] = useState([]);
    const onChangeSelectParticipantToAdd = (val: any) => {
        if (contacts) {
            let find = contacts.filter((x) => x.id == val);
            var a = {
                id: find[0].id,
                label: find[0].firstName + " " + find[0].lastName,
            };

            setParticipantLocal([...particapantLocal, a]);

            console.log(find);
        }
    };

    useEffect(() => {
        console.log("teamateLocal", teamateLocal);
    }, [teamateLocal]);
    return (
        <Modal
            className="modal-activity"
            open={isModalOpenAdd}
            onCancel={handleCancelAdd}
            width={980}
            footer={null}
            title={null}
            closable={false}
            // footer={[
            //     <Button type="primary">Save</Button>,
            //     <Button type="primary">Save and add other</Button>,
            //     <Button>Cancel</Button>,
            // ]}
        >
            <Form
                form={form}
                layout="vertical"
                name="basic"
                labelAlign="left"
                labelWrap
                onFinish={onFinish}
                autoComplete="off"
            >
                <div className="modal-header">
                    <Typography.Title level={5} style={{ color: "white" }}>
                        {from == "update" ? "Update New Deal" : "Add New Deal"}
                    </Typography.Title>
                    <Button
                        type="link"
                        style={{ marginRight: "-559px", color: "white" }}
                    >
                        {" "}
                        <u>Manage Fields</u>
                    </Button>
                    <Button
                        onClick={handleCancelAdd}
                        style={{
                            backgroundColor: "rgba(0, 0, 0, 0.5)",
                            border: "0px",
                        }}
                        icon={<CloseOutlined style={{ color: "white" }} />}
                    />
                </div>
                <Row gutter={12}>
                    <Col md={16} className="col-1-modal-act">
                        <Form.Item
                            label="Title"
                            name="title"
                            rules={[
                                {
                                    required: true,
                                    message: "this is required",
                                },
                            ]}
                        >
                            <Input placeholder="Title" />
                        </Form.Item>

                        <Row gutter={24}>
                            <Col md={12}>
                                <Form.Item
                                    label="Contact"
                                    name="contactId"
                                    rules={[
                                        {
                                            required: true,
                                            message: "this is required",
                                        },
                                    ]}
                                >
                                    <Select
                                        style={{ width: "100%" }}
                                        placeholder="Contact"
                                    >
                                        {contacts?.map((contact) => {
                                            return (
                                                <Select.Option
                                                    value={contact.id}
                                                    key={contact.id}
                                                >
                                                    {contact.firstName +
                                                        " " +
                                                        contact.lastName}
                                                </Select.Option>
                                            );
                                        })}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col md={12}>
                                <Form.Item
                                    label="Win Probability"
                                    name="win_probability"
                                >
                                    <Input
                                        placeholder="Win Probability"
                                        disabled={true}
                                    />
                                </Form.Item>
                            </Col>
                            <Col md={12}>
                                <Form.Item
                                    label="Owner"
                                    name="owner"
                                    rules={[
                                        {
                                            required: true,
                                            message: "this is required",
                                        },
                                    ]}
                                >
                                    <Select
                                        placeholder="Owner"
                                        showSearch
                                        loading={isLoadingUsers}
                                        style={{ width: "100%" }}
                                    >
                                        {dataUsers &&
                                            dataUsers?.data &&
                                            dataUsers?.data.map(
                                                (item: any, key: any) => {
                                                    return (
                                                        <Select.Option
                                                            key={key}
                                                            value={item.id}
                                                            search={`${item.firstName} ${item.lastName}`}
                                                        >
                                                            {`${item.firstName} ${item.lastName}`}
                                                        </Select.Option>
                                                    );
                                                }
                                            )}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col md={12}>
                                <Form.Item
                                    label="Estimated Close Date"
                                    name="estimated_close_date"
                                    rules={[
                                        {
                                            required: true,
                                            message: "this is required",
                                        },
                                    ]}
                                >
                                    <DatePicker
                                        style={{ width: "100%" }}
                                        showTime
                                        format="YYYY-MM-DD HH:mm:ss"
                                    />
                                </Form.Item>
                            </Col>
                            <Col md={12}>
                                <Form.Item label="Value" name="value">
                                    <InputNumber
                                        placeholder="Value"
                                        style={{ width: "100%" }}
                                    />
                                </Form.Item>
                            </Col>
                            <Col md={12}>
                                <Form.Item
                                    label="Currency"
                                    name="currency"
                                    rules={[
                                        {
                                            required: true,
                                            message: "this is required",
                                        },
                                    ]}
                                >
                                    <Select placeholder="Currency">
                                        <Select.Option value="USD">
                                            USD
                                        </Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col md={12}>
                                <Form.Item
                                    label="Pipeline"
                                    name="pipeline"
                                    rules={[
                                        {
                                            required: true,
                                            message: "this is required",
                                        },
                                    ]}
                                >
                                    <Select placeholder="Pipeline">
                                        <Select.Option value="ACQ">
                                            ACQ
                                        </Select.Option>
                                        <Select.Option value="Referrals">
                                            Marketing
                                        </Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col md={12}>
                                <Form.Item
                                    label="Stage"
                                    name="stage"
                                    rules={[
                                        {
                                            required: true,
                                            message: "this is required",
                                        },
                                    ]}
                                >
                                    <Select placeholder="Stage">
                                        <Select.Option value="Comp & Qualify">
                                            Comp & Qualify
                                        </Select.Option>
                                        <Select.Option value="First Offer Given">
                                            First Offer Given
                                        </Select.Option>
                                        <Select.Option value="In Negotiation">
                                            In Negotiation
                                        </Select.Option>
                                        <Select.Option value="Verbal Offer Accepted">
                                            Verbal Offer Accepted
                                        </Select.Option>
                                        <Select.Option value="Under Contract">
                                            Under Contract
                                        </Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col md={12}>
                                <Form.Item
                                    label="Source"
                                    name="source"
                                    rules={[
                                        {
                                            required: true,
                                            message: "this is required",
                                        },
                                    ]}
                                >
                                    <Select placeholder="Source">
                                        <Select.Option value="ADS">
                                            ADS
                                        </Select.Option>
                                        <Select.Option value="Referrals">
                                            Referrals
                                        </Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col md={12}>
                                <Form.Item
                                    label="Priority"
                                    name="priority"
                                    rules={[
                                        {
                                            required: true,
                                            message: "this is required",
                                        },
                                    ]}
                                >
                                    <Select placeholder="Priority">
                                        <Select.Option value="High">
                                            High
                                        </Select.Option>
                                        <Select.Option value="Medium">
                                            Medium
                                        </Select.Option>
                                        <Select.Option value="Low">
                                            Low
                                        </Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>

                            <Col md={12}>
                                <Form.Item
                                    label="Status"
                                    name="status"
                                    rules={[
                                        {
                                            required: true,
                                            message: "this is required",
                                        },
                                    ]}
                                >
                                    <Select placeholder="Status">
                                        <Select.Option value="Open">
                                            Open
                                        </Select.Option>
                                        <Select.Option value="Won">
                                            Won
                                        </Select.Option>
                                        <Select.Option value="Lost">
                                            Lost
                                        </Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col md={24} style={{ marginBottom: 15 }}>
                                <b>Details</b>
                            </Col>

                            <Col md={24}>
                                <Form.Item label="Details" name="details">
                                    <TextArea></TextArea>
                                </Form.Item>
                            </Col>
                            <Col md={24}>
                                <Form.Item label="Tags" name="tags">
                                    <Input placeholder="Tags" />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Col>
                    <Col
                        md={8}
                        style={{ padding: 20 }}
                        className="col-2-modal-act"
                    >
                        <Row>
                            <Col md={24}>
                                <div
                                    style={{
                                        fontSize: 18,
                                        fontWeight: "bold",
                                    }}
                                >
                                    Teammates
                                </div>

                                {from == "update" &&
                                    modalValue &&
                                    modalValue.teammate.map(
                                        (item: any, key: any) => {
                                            return (
                                                <Tag
                                                    closable
                                                    color="#2db7f5"
                                                    onClose={(e) => {
                                                        handleCloseTeammate(
                                                            item.id
                                                        );
                                                    }}
                                                    style={{ marginTop: "5px" }}
                                                >
                                                    {item.user.firstName +
                                                        " " +
                                                        item.user.lastName}
                                                </Tag>
                                            );
                                        }
                                    )}
                                {from != "update" &&
                                    teamateLocal.length > 0 &&
                                    teamateLocal.map((item: any, key: any) => {
                                        return (
                                            <Tag
                                                closable
                                                color="#2db7f5"
                                                // onClose={(e) => {
                                                //     handleCloseTeammate(
                                                //         item.id
                                                //     );
                                                // }}
                                                style={{ marginTop: "5px" }}
                                            >
                                                {item.label}
                                            </Tag>
                                        );
                                    })}
                                <div style={{ marginTop: "10px" }}>
                                    {from == "update" && (
                                        <Select
                                            placeholder="Search"
                                            showSearch
                                            className="select-custom-width"
                                            loading={isLoadingUsers}
                                            style={{ width: "100%" }}
                                            onChange={onChangeSelectTeammate}
                                            dropdownRender={(menu) => (
                                                <>{menu}</>
                                            )}
                                        >
                                            {contacts &&
                                                contacts.map(
                                                    (item: any, key: any) => {
                                                        return (
                                                            <Select.Option
                                                                key={key}
                                                                value={item.id}
                                                                search={`${item.firstName} ${item.lastName}`}
                                                            >
                                                                {`${item.firstName} ${item.lastName}`}
                                                            </Select.Option>
                                                        );
                                                    }
                                                )}
                                        </Select>
                                    )}
                                </div>

                                {from != "update" && (
                                    <Select
                                        placeholder="Search"
                                        showSearch
                                        className="select-custom-width"
                                        loading={isLoadingUsers}
                                        style={{ width: "100%" }}
                                        onChange={onChangeSelectTeammateToAdd}
                                        dropdownRender={(menu) => <>{menu}</>}
                                    >
                                        {contacts &&
                                            contacts.map(
                                                (item: any, key: any) => {
                                                    return (
                                                        <Select.Option
                                                            key={key}
                                                            value={item.id}
                                                            search={`${item.firstName} ${item.lastName}`}
                                                        >
                                                            {`${item.firstName} ${item.lastName}`}
                                                        </Select.Option>
                                                    );
                                                }
                                            )}
                                    </Select>
                                )}
                            </Col>
                            <Col md={24}>
                                <div
                                    style={{
                                        fontSize: 18,
                                        fontWeight: "bold",
                                    }}
                                >
                                    Participants
                                </div>
                                {from == "update" &&
                                    modalValue &&
                                    modalValue.participant.map(
                                        (item: any, key: any) => {
                                            return (
                                                <Tag
                                                    closable
                                                    color="#2db7f5"
                                                    onClose={(e) => {
                                                        handleClose(item.id);
                                                    }}
                                                    style={{ marginTop: "5px" }}
                                                >
                                                    {item.user.firstName +
                                                        " " +
                                                        item.user.lastName}
                                                </Tag>
                                            );
                                        }
                                    )}
                                {from != "update" &&
                                    particapantLocal.length > 0 &&
                                    particapantLocal.map(
                                        (item: any, key: any) => {
                                            return (
                                                <Tag
                                                    closable
                                                    color="#2db7f5"
                                                    // onClose={(e) => {
                                                    //     handleCloseTeammate(
                                                    //         item.id
                                                    //     );
                                                    // }}
                                                    style={{ marginTop: "5px" }}
                                                >
                                                    {item.label}
                                                </Tag>
                                            );
                                        }
                                    )}
                                <div style={{ marginTop: "10px" }}>
                                    {from == "update" && (
                                        <Select
                                            placeholder="Search"
                                            showSearch
                                            className="select-custom-width"
                                            loading={isLoadingUsers}
                                            style={{ width: "100%" }}
                                            onChange={onChangeSelectParticipant}
                                            dropdownRender={(menu) => (
                                                <>{menu}</>
                                            )}
                                        >
                                            {contacts &&
                                                contacts.map(
                                                    (item: any, key: any) => {
                                                        return (
                                                            <Select.Option
                                                                key={key}
                                                                value={item.id}
                                                                search={`${item.firstName} ${item.lastName}`}
                                                            >
                                                                {`${item.firstName} ${item.lastName}`}
                                                            </Select.Option>
                                                        );
                                                    }
                                                )}
                                        </Select>
                                    )}
                                </div>

                                {from != "update" && (
                                    <Select
                                        placeholder="Search"
                                        showSearch
                                        className="select-custom-width"
                                        loading={isLoadingUsers}
                                        style={{ width: "100%" }}
                                        onChange={
                                            onChangeSelectParticipantToAdd
                                        }
                                        dropdownRender={(menu) => <>{menu}</>}
                                    >
                                        {contacts &&
                                            contacts.map(
                                                (item: any, key: any) => {
                                                    return (
                                                        <Select.Option
                                                            key={key}
                                                            value={item.id}
                                                            search={`${item.firstName} ${item.lastName}`}
                                                        >
                                                            {`${item.firstName} ${item.lastName}`}
                                                        </Select.Option>
                                                    );
                                                }
                                            )}
                                    </Select>
                                )}
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <div className="modal-footer">
                    <Button className="m-r-xs" type="primary" htmlType="submit">
                        Save
                    </Button>
                    <Button className="m-r-xs" type="primary">
                        Save and add other
                    </Button>
                    <Button onClick={handleCancelAdd}>Cancel</Button>
                </div>
            </Form>
        </Modal>
    );
};

export default ModalAddDeal;
