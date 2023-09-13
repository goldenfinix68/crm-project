import React, { useContext, useEffect, useRef, useState } from "react";
import { Button, Modal, Space, Typography } from "antd";

import { CloseOutlined } from "@ant-design/icons";

interface Props {
    title: string;
    message: string;
    isOpen: boolean;
    handleYes: () => void;
    handleNo: () => void;
    loading?: boolean;
}
const ConfirmModal = ({
    title,
    message,
    handleYes,
    handleNo,
    isOpen,
    loading = false,
}: Props) => {
    return (
        <Modal
            className="modal-activity"
            open={isOpen}
            onCancel={handleNo}
            footer={null}
            title={null}
            closable={false}
        >
            <div className="modal-header">
                <Typography.Title level={5} style={{ color: "white" }}>
                    {title}
                </Typography.Title>

                <Button
                    onClick={handleNo}
                    style={{
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        border: "0px",
                    }}
                    icon={<CloseOutlined style={{ color: "white" }} />}
                />
            </div>
            <Space
                direction="vertical"
                style={{ padding: "20px", width: "100%", paddingTop: "50px" }}
                size={"large"}
            >
                <Typography.Text>{message}</Typography.Text>

                <Space style={{ paddingTop: "5px" }}>
                    <Button
                        type="primary"
                        onClick={() => handleYes()}
                        loading={loading}
                    >
                        Yes
                    </Button>

                    <Button onClick={handleNo}>No</Button>
                </Space>
            </Space>
        </Modal>
    );
};

export default ConfirmModal;
