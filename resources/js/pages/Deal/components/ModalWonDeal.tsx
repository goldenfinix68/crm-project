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
    useDealMutationWon,
} from "../../../api/mutation/useDealMutation";
import { useContactsAll } from "../../../api/query/contactsQuery";
import {
    useContactsList,
    useDealsList,
    useUsersList,
} from "../../../api/query/activityQuery";
interface Props {
    isModalOpenAdd: boolean;
    handleOkAdd: () => void;
    handleCancelAdd: () => void;
    dealId: string;
}

const ModalWonDeal = ({
    isModalOpenAdd,
    handleOkAdd,
    handleCancelAdd,
    dealId,
}: Props) => {
    const { dataUsers, isLoadingUsers } = useUsersList();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { contacts, isLoading } = useContactsAll();
    const [showFireWorks, setShowFireWorks] = useState(false);
    const [form] = useForm();
    const onFinish = (values: any) => {
        mutation.mutate({
            ...values,
            dealId: dealId,
            isWon: 1,
            isLost: 0,
            action: "won",
            estimated_close_date:
                values.estimated_close_date.format("YYYY-MM-DD"),
        });
    };

    const mutation = useMutation(useDealMutationWon, {
        onSuccess: (res) => {
            // navigate("/users"); // Redirect to the users list page after successful submission
            if (res.success) {
                notification.success({
                    message: "Deal",
                    description: "Updated Successfully",
                });
                form.resetFields();
                handleOkAdd();
                queryClient.invalidateQueries("deals_by_id");
                const elements = document.getElementsByClassName("pyro");
                elements[0].classList.remove("hide");
                setShowFireWorks(true);
            }
        },
    });

    React.useEffect(() => {
        if (showFireWorks) {
            setTimeout(() => {
                const elements = document.getElementsByClassName("pyro");
                elements[0].classList.add("hide");
                setShowFireWorks(false);
            }, 1000);
        }
    }, [showFireWorks]);

    return (
        <Modal
            className="modal-activity  success-bg-modal"
            open={isModalOpenAdd}
            onCancel={handleCancelAdd}
            width={600}
            // footer={null}
            title={null}
            closable={false}
            footer={
                <>
                    <Button
                        className="m-r-xs button-success-solid "
                        type="primary"
                        htmlType="submit"
                        onClick={() => {
                            form.submit();
                        }}
                    >
                        Save
                    </Button>

                    <Button onClick={handleCancelAdd}>Cancel</Button>
                </>
            }
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
                        Won Deal
                    </Typography.Title>

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
                    <Col md={24} className="col-1-modal-act">
                        <div style={{ marginTop: 15, marginBottom: 15 }}>
                            Before you mark this deal as won, please update the
                            following information as needed.
                        </div>
                        <Form.Item
                            label="Won Description"
                            name="notes"
                            rules={[
                                {
                                    required: true,
                                    message: "this is required",
                                },
                            ]}
                        >
                            <TextArea name="notes" />
                        </Form.Item>

                        <Form.Item
                            label="Close Date"
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
                                name="estimated_close_date"
                                showTime
                                format="YYYY-MM-DD HH:mm:ss"
                            />
                        </Form.Item>
                    </Col>
                </Row>
                {/* <div className="modal-footer">
                    <Button
                        className="m-r-xs button-success-solid "
                        type="primary"
                        htmlType="submit"
                    >
                        Save
                    </Button>

                    <Button onClick={handleCancelAdd}>Cancel</Button>
                </div> */}
            </Form>
        </Modal>
    );
};

export default ModalWonDeal;
