import React, { useState } from "react";
import { Dropdown, Space, Typography } from "antd";
import type { MenuProps } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCircleDollarToSlot,
    faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { faMessage, faUser } from "@fortawesome/free-regular-svg-icons";
import ModalAddDeal from "../../pages/Deal/components/ModalAddDeal";
import queryClient from "../../queryClient";
import TextModal from "../../pages/ContactView/components/TextModal";
import CustomFieldFormModal from "../CustomFieldFormModal";

const NavigationComponentsQuickAdd: React.FC = () => {
    const [isAddModalContactOpen, setIsAddModalContactOpen] = useState(false);
    const [isAddDealModalOpen, setIsAddDealModalOpen] = useState(false);
    const [isTextModalOpen, setIsTextModalOpen] = useState(false);

    const items: MenuProps["items"] = [
        {
            key: "1",
            label: (
                <div
                    className="list-data"
                    onClick={() => setIsAddModalContactOpen(true)}
                >
                    <Space>
                        <FontAwesomeIcon icon={faUser} />
                        <Typography.Text>Add Contact</Typography.Text>
                    </Space>

                    <Typography.Text>ci</Typography.Text>
                </div>
            ),
        },
        {
            key: "3",
            label: (
                <div
                    className="list-data"
                    onClick={() => setIsAddDealModalOpen(true)}
                >
                    <Space>
                        <FontAwesomeIcon icon={faCircleDollarToSlot} />
                        <Typography.Text>Add Deal</Typography.Text>
                    </Space>

                    <Typography.Text>cd</Typography.Text>
                </div>
            ),
        },
        {
            key: "5",
            label: (
                <div
                    className="list-data"
                    onClick={() => setIsTextModalOpen(true)}
                >
                    <Space>
                        <FontAwesomeIcon icon={faMessage} />
                        <Typography.Text>Text</Typography.Text>
                    </Space>

                    <Typography.Text>ct</Typography.Text>
                </div>
            ),
        },
    ];

    return (
        <>
            <Dropdown
                menu={{ items }}
                placement="bottomRight"
                arrow
                overlayClassName="header-quick-add"
                trigger={["click"]}
            >
                <FontAwesomeIcon
                    style={{ cursor: "pointer" }}
                    icon={faPlus}
                    className="header-btn-plus"
                />
            </Dropdown>

            {isAddModalContactOpen && (
                <CustomFieldFormModal
                    isModalOpen={isAddModalContactOpen}
                    closeModal={() => {
                        setIsAddModalContactOpen(false);
                    }}
                    handleSubmit={() => {
                        queryClient.invalidateQueries("contacts");
                        queryClient.invalidateQueries("filteredContacts");
                    }}
                    type="contact"
                />
            )}

            {isAddDealModalOpen && (
                <ModalAddDeal
                    isModalOpen={isAddDealModalOpen}
                    handleSubmit={() => {
                        console.log("qwe");
                    }}
                    closeModal={() => {
                        setIsAddDealModalOpen(false);
                    }}
                />
            )}

            {isTextModalOpen && (
                <TextModal
                    closeModal={() => setIsTextModalOpen(false)}
                    isModalOpen={isTextModalOpen}
                />
            )}
        </>
    );
};

export default NavigationComponentsQuickAdd;
