import React from "react";
import {
    Button,
    Col,
    Modal,
    Row,
    Typography,
    Form,
    Select,
    DatePicker,
    notification,
} from "antd";

import { CloseOutlined } from "@ant-design/icons";

import TextArea from "antd/es/input/TextArea";
import { useNavigate } from "react-router-dom";
import { useForm } from "antd/es/form/Form";
import { useMutation, useQueryClient } from "react-query";
import { useDealMutationWon } from "../../../api/mutation/useDealMutation";
interface Props {
    isModalOpenAdd1: boolean;
    handleOkAdd1: () => void;
    handleCancelAdd1: () => void;
    dealId: string;
}

const ModalLostDeal = ({
    isModalOpenAdd1,
    handleOkAdd1,
    handleCancelAdd1,
    dealId,
}: Props) => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const [form] = useForm();
    const onFinish = (values: any) => {
        mutation.mutate({
            ...values,
            dealId: dealId,
            isWon: 0,
            isLost: 1,
            action: "lost",
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
                handleOkAdd1();
                queryClient.invalidateQueries("deals_by_id");
            }
        },
    });

    return (
        <Modal
            className="modal-activity danger-bg-modal"
            open={isModalOpenAdd1}
            onCancel={handleCancelAdd1}
            width={600}
            // footer={null}
            title={null}
            closable={false}
            footer={
                <>
                    {" "}
                    <Button
                        className="m-r-xs button-danger-solid "
                        type="primary"
                        htmlType="submit"
                        onClick={() => {
                            form.submit();
                        }}
                    >
                        Save
                    </Button>
                    <Button onClick={handleCancelAdd1}>Cancel</Button>
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
                        Lost Deal
                    </Typography.Title>

                    <Button
                        onClick={handleCancelAdd1}
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
                            label="Lost Reason"
                            name="lost_reason"
                            rules={[
                                {
                                    required: true,
                                    message: "this is required",
                                },
                            ]}
                        >
                            <Select placeholder="Lost Reason">
                                <Select.Option value="No Reason">
                                    No Reason
                                </Select.Option>
                                <Select.Option value="Need">Need</Select.Option>
                                <Select.Option value="Timing">
                                    Timing
                                </Select.Option>
                                <Select.Option value="Competition">
                                    Competition
                                </Select.Option>
                                <Select.Option value="Feature">
                                    Feature
                                </Select.Option>
                                <Select.Option value="Poor Qualification">
                                    Poor Qualification
                                </Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label="Lost Description"
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
                        className="m-r-xs button-danger-solid "
                        type="primary"
                        htmlType="submit"
                    >
                        Save
                    </Button>

                    <Button onClick={handleCancelAdd1}>Cancel</Button>
                </div> */}
            </Form>
        </Modal>
    );
};

export default ModalLostDeal;
