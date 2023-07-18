import { Button, Mentions, Form, Space } from "antd";
import React from "react";

const Notestab = () => {
    const [form] = Form.useForm();
    const notes = Form.useWatch("notes", form);
    const handleFinish = (values) => {
        console.log(values);
        // Perform form submission logic here
    };
    return (
        <Form form={form} onFinish={handleFinish}>
            <Form.Item name="notes">
                <Mentions
                    rows={2}
                    style={{ width: "100%" }}
                    onChange={(e) => console.log(e)}
                    onSelect={(e) => console.log(e)}
                    placeholder="Start tracking your notes here. Use @ sign to mention your teammates."
                    options={[
                        {
                            value: "afc163",
                            label: "afc163",
                        },
                        {
                            value: "zombieJ",
                            label: "zombieJ",
                        },
                        {
                            value: "yesmeck",
                            label: "yesmeck",
                        },
                    ]}
                />
            </Form.Item>

            {notes && (
                <Form.Item style={{ float: "right" }}>
                    <Space>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                        <Button
                            type="default"
                            onClick={() => form.resetFields()}
                        >
                            Cancel
                        </Button>
                    </Space>
                </Form.Item>
            )}
        </Form>
    );
};

export default Notestab;
