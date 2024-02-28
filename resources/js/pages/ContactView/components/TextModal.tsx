import React, { useContext, useEffect, useRef, useState } from "react";
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
} from "antd";

import { CloseOutlined } from "@ant-design/icons";

import { useMutation } from "react-query";
import { sendTextMutation } from "../../../api/mutation/useTextMutation";
import ContactContext from "../context";
import queryClient from "../../../queryClient";
import TextForm from "../../Texts/components/TextForm";
import { TContact } from "../../../entities";
interface Props {
    isModalOpen: boolean;
    closeModal: () => void;
    phoneNumbers?: string[];
    contact?: TContact;
}
const TextModal = ({
    isModalOpen,
    closeModal,
    phoneNumbers,
    contact,
}: Props) => {
    const [divKey, setDivKey] = useState(0);

    useEffect(() => {
        if (isModalOpen) {
            setDivKey(divKey + 1);
        }
    }, [isModalOpen]);
    return (
        <Modal
            className="modal-activity"
            open={isModalOpen}
            onCancel={closeModal}
            footer={null}
            title={null}
            closable={false}
        >
            <div className="modal-header">
                <Typography.Title level={5} style={{ color: "white" }}>
                    Send Text Message
                </Typography.Title>

                <Button
                    onClick={closeModal}
                    style={{
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        border: "0px",
                    }}
                    icon={<CloseOutlined style={{ color: "white" }} />}
                />
            </div>
            <Space
                direction="vertical"
                style={{ padding: "20px", width: "100%" }}
                size={0}
                key={divKey}
            >
                <TextForm
                    handleSubmit={() => {
                        queryClient.invalidateQueries("getContact");
                    }}
                    handleCancel={closeModal}
                    phoneNumbers={phoneNumbers}
                    contact={contact}
                />
            </Space>
        </Modal>
    );
};

export default TextModal;
