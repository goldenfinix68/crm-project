import { Button, Mentions, Form, Space } from "antd";
import React, { useContext } from "react";
import { useMutation } from "react-query";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { addNoteMutation } from "../../../api/mutation/useNoteMutation";
import queryClient from "../../../queryClient";
import ContactContext from "../context";
import { TNote } from "../../../entities";

const Notestab = ({
    note,
    handleCancel,
}: {
    note?: TNote;
    handleCancel?: () => void;
}) => {
    const [form] = Form.useForm();
    const notes = Form.useWatch("notes", form);
    const quillRef = React.useRef(null);
    const [isFocused, setIsFocused] = React.useState(note ? true : false);
    const { contact } = useContext(ContactContext);

    const resetFields = () => {
        if (handleCancel) {
            handleCancel();
        }
        setIsFocused(false);
        form.resetFields();
    };

    const addNote = useMutation(addNoteMutation, {
        onSuccess: () => {
            queryClient.invalidateQueries("getContact");
            //sa deals to
            queryClient.invalidateQueries("deals_by_id");
            resetFields();
        },
    });

    const handleFinish = async (values) => {
        await addNote.mutate({
            ...values,
            contactId: contact.id,
            id: note?.id,
        });
    };

    React.useEffect(() => {
        if (isFocused && quillRef.current) {
            (quillRef.current as any).focus();
        }
    }, [isFocused]);

    React.useEffect(() => {
        if (note) {
            form.setFieldValue("notes", note.notes);
        } else {
            form.resetFields();
        }
    }, [note]);

    return (
        <Form form={form} onFinish={handleFinish}>
            <Form.Item name="notes">
                {isFocused ? (
                    <ReactQuill
                        ref={quillRef}
                        style={{ height: note ? "300px" : "150px" }}
                        onBlur={() => {
                            if (!notes || notes == "<p><br></p>") {
                                resetFields();
                            }
                        }}
                    />
                ) : (
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
                        onFocus={() => setIsFocused(true)}
                    />
                )}
                {/**/}
            </Form.Item>

            {isFocused && (
                <Form.Item
                    style={{
                        float: "right",
                        paddingTop: "30px",
                        marginBottom: 0,
                    }}
                >
                    <Space>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={addNote.isLoading}
                        >
                            Submit
                        </Button>
                        <Button type="default" onClick={resetFields}>
                            Cancel
                        </Button>
                    </Space>
                </Form.Item>
            )}
        </Form>
    );
};

export default Notestab;
