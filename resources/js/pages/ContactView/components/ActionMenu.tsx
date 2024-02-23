import {
    PhoneFilled,
    MessageFilled,
    MailFilled,
    EllipsisOutlined,
    PhoneOutlined,
    GlobalOutlined,
    DollarCircleOutlined,
    ApartmentOutlined,
} from "@ant-design/icons";
import { Button, Popover, Space, Typography } from "antd";
import React, { useContext } from "react";
import ActionMenuBtn from "./ActionMenuBtn";
import DropdownComponent from "../../../components/DropdownComponent";
import TextModal from "./TextModal";
import ModalAddActivity from "../../Activity/components/ModalAddActivity";
import ModalAddDeal from "../../Deal/components/ModalAddDeal";
import queryClient from "../../../queryClient";
import { useCallContext } from "../../../context/CallContext";
import { useLoggedInUser } from "../../../api/query/userQuery";
import ContactContext from "../context";
import { TContact } from "../../../entities";
import ModalSetDefaultMobile from "./ModalSetDefaultMobile";

const ActionMenu = ({ contact }: { contact: TContact }) => {
    const [textModalOpen, setTextModalOpen] = React.useState(false);
    const [activityModalOpen, setActivityModalOpen] = React.useState(false);
    const [dealModalOpen, setDealModalOpen] = React.useState(false);
    const [defaultMobileNumberModal, setDefaultMobileNumberModal] =
        React.useState(false);
    const { setIsModalOpen, setCallerNumber, setDestinationNumber } =
        useCallContext();

    return (
        <Space
            style={{
                display: "flex",
                justifyContent: "space-between",
                borderTop: "2px solid #e8e8e8",
                borderBottom: "2px solid #e8e8e8",
                padding: "8px",
            }}
        >
            <ActionMenuBtn
                handleClick={() => {
                    setCallerNumber(contact?.defaultMobileNumber ?? "");
                    setDestinationNumber(contact?.fields.mobile ?? "");
                    setIsModalOpen(true);
                }}
                icon={
                    <PhoneFilled style={{ color: "white", fontSize: "10px" }} />
                }
                tooltip="Click to call"
            />

            <ActionMenuBtn
                handleClick={() => {
                    setTextModalOpen(true);
                }}
                icon={
                    <MessageFilled
                        style={{ color: "white", fontSize: "10px" }}
                    />
                }
                tooltip="Click to text"
            />
            <ActionMenuBtn
                handleClick={() => {
                    console.log("phone");
                }}
                icon={
                    <MailFilled style={{ color: "white", fontSize: "10px" }} />
                }
                tooltip="No email address found"
                isDisabled={true}
            />
            <ActionMenuBtn
                handleClick={() => {
                    setDealModalOpen(true);
                }}
                icon={
                    <DollarCircleOutlined
                        style={{ color: "white", fontSize: "10px" }}
                    />
                }
                tooltip="Click to add deal"
            />
            <ActionMenuBtn
                handleClick={() => {
                    setDefaultMobileNumberModal(true);
                }}
                icon={
                    <ApartmentOutlined
                        style={{ color: "white", fontSize: "10px" }}
                    />
                }
                tooltip="Click to set the default mobile number for contacting this contact. This number will be automatically selected when initiating communication."
            />

            <TextModal
                closeModal={() => setTextModalOpen(false)}
                isModalOpen={textModalOpen}
                to={JSON.stringify(contact.phoneNumbers) ?? ""}
                contact={contact}
            />

            <ModalSetDefaultMobile
                isModalOpen={defaultMobileNumberModal}
                closeModal={() => setDefaultMobileNumberModal(false)}
                contact={contact}
            />

            {/* <ModalAddActivity
                isModalOpenAdd={activityModalOpen}
                handleOkAdd={() => setActivityModalOpen(false)}
                handleCancelAdd={() => setActivityModalOpen(false)}
            /> */}
            <ModalAddDeal
                isModalOpen={dealModalOpen}
                handleSubmit={() => {
                    setDealModalOpen(false);
                    queryClient.invalidateQueries("getContact");
                }}
                closeModal={() => setDealModalOpen(false)}
            />
        </Space>
    );
};

export default ActionMenu;
