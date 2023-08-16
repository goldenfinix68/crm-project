import React, { useState } from "react";
import { Dropdown, Space, Typography } from "antd";
import type { MenuProps } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCircle,
    faCircleDollarToSlot,
    faPlus,
    faSearch,
} from "@fortawesome/free-solid-svg-icons";
import {
    faCircleCheck,
    faEnvelope,
    faMessage,
    faNoteSticky,
    faUser,
} from "@fortawesome/free-regular-svg-icons";
import ContactsComponentsAddContacts from "../../pages/PageContacts/Components/ContactsComponentsAddContacts";
import ModalAddActivity from "../../pages/Activity/components/ModalAddActivity";
import ModalAddDeal from "../../pages/Deal/components/ModalAddDeal";
import queryClient from "../../queryClient";

const NavigationComponentsQuickAdd: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalOpenAdd, setIsModalOpenAdd] = useState(false);
    const [isModalDealOpenAdd, setIsModalDealOpenAdd] = useState(false);

    const handleOkAdd = () => {
        queryClient.invalidateQueries("deals");
        setIsModalOpenAdd(false);
        setIsModalDealOpenAdd(false);
    };

    const handleCancelAdd = () => {
        setIsModalOpenAdd(false);
        setIsModalDealOpenAdd(false);
    };

    const items: MenuProps["items"] = [
        {
            key: "1",
            label: (
                <div className="list-data" onClick={() => setIsModalOpen(true)}>
                    <Space>
                        <FontAwesomeIcon icon={faUser} />
                        <Typography.Text>Add Contact</Typography.Text>
                    </Space>

                    <Typography.Text>ci</Typography.Text>
                </div>
            ),
        },
        {
            key: "2",
            label: (
                <div
                    className="list-data"
                    onClick={() => setIsModalOpenAdd(true)}
                >
                    <Space>
                        <FontAwesomeIcon icon={faCircleCheck} />
                        <Typography.Text>Add Activity</Typography.Text>
                    </Space>

                    <Typography.Text>ca</Typography.Text>
                </div>
            ),
        },
        {
            key: "3",
            label: (
                <div
                    className="list-data"
                    onClick={() => setIsModalDealOpenAdd(true)}
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
            key: "4",
            label: (
                <div className="list-data">
                    <Space>
                        <FontAwesomeIcon icon={faEnvelope} />
                        <Typography.Text>Email</Typography.Text>
                    </Space>

                    <Typography.Text>ce</Typography.Text>
                </div>
            ),
        },
        {
            key: "5",
            label: (
                <div className="list-data">
                    <Space>
                        <FontAwesomeIcon icon={faMessage} />
                        <Typography.Text>Text</Typography.Text>
                    </Space>

                    <Typography.Text>ct</Typography.Text>
                </div>
            ),
        },
        {
            key: "6",
            label: (
                <div className="list-data">
                    <Space>
                        <FontAwesomeIcon icon={faNoteSticky} />
                        <Typography.Text>Add Note</Typography.Text>
                    </Space>

                    <Typography.Text>cn</Typography.Text>
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
                <FontAwesomeIcon icon={faPlus} className="header-btn-plus" />
            </Dropdown>

            {/* <ContactsComponentsAddContacts
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
            /> */}

            <ModalAddActivity
                isModalOpenAdd={isModalOpenAdd}
                handleOkAdd={handleOkAdd}
                handleCancelAdd={handleCancelAdd}
            />

            {/* <ModalAddDeal
                isModalOpenAdd={isModalDealOpenAdd}
                handleOkAdd={handleOkAdd}
                handleCancelAdd={handleCancelAdd}
            /> */}
        </>
    );
};

export default NavigationComponentsQuickAdd;
