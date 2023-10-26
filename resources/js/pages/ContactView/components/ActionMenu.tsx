import {
    PhoneFilled,
    MessageFilled,
    MailFilled,
    EllipsisOutlined,
    PhoneOutlined,
    GlobalOutlined,
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

const ActionMenu = ({ contact }: { contact: TContact }) => {
    const [textModalOpen, setTextModalOpen] = React.useState(false);
    const [activityModalOpen, setActivityModalOpen] = React.useState(false);
    const [dealModalOpen, setDealModalOpen] = React.useState(false);
    const { setIsModalOpen, setCallerNumber, setDestinationNumber } =
        useCallContext();
    const { user, isLoading: isLogginUserLoading } = useLoggedInUser();

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
            <DropdownComponent
                menuList={[
                    {
                        label: (
                            <Space
                                onClick={() => {
                                    setCallerNumber(
                                        contact?.defaultMobileNumber
                                            ?.mobileNumber ?? ""
                                    );
                                    setDestinationNumber(
                                        contact?.fields.mobile ?? ""
                                    );
                                    setIsModalOpen(true);
                                }}
                            >
                                <GlobalOutlined />
                                Call Via Browser
                            </Space>
                        ),
                        key: "41",
                    },
                    {
                        label: (
                            <Space>
                                <PhoneOutlined />
                                Call Via Phone
                            </Space>
                        ),
                        key: "42",
                    },
                ]}
                showCarret={false}
                label={
                    <ActionMenuBtn
                        handleClick={() => {
                            console.log("phone");
                        }}
                        icon={
                            <PhoneFilled
                                style={{ color: "white", fontSize: "10px" }}
                            />
                        }
                        tooltip="Click to call"
                    />
                }
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
                    console.log("phone");
                }}
                icon={
                    <span
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                    >
                        <MailFilled
                            style={{ color: "white", fontSize: "10px" }}
                        />
                        <MailFilled
                            style={{ color: "white", fontSize: "10px" }}
                        />
                        <MailFilled
                            style={{ color: "white", fontSize: "10px" }}
                        />
                    </span>
                }
                tooltip="Enroll to sequence"
            />
            <DropdownComponent
                menuList={[
                    {
                        label: (
                            <Typography.Text
                                onClick={() => setActivityModalOpen(true)}
                            >
                                Add Activity
                            </Typography.Text>
                        ),
                        key: "1",
                    },
                    {
                        label: (
                            <Typography.Text
                                onClick={() => setDealModalOpen(true)}
                            >
                                Add Deal
                            </Typography.Text>
                        ),
                        key: "2",
                    },
                ]}
                showCarret={false}
                label={
                    <ActionMenuBtn
                        handleClick={() => {
                            console.log("phone");
                        }}
                        icon={<EllipsisOutlined style={{ color: "white" }} />}
                    />
                }
            />

            <TextModal
                closeModal={() => setTextModalOpen(false)}
                isModalOpen={textModalOpen}
                to={contact.fields.mobile ?? ""}
                contact={contact}
            />

            <ModalAddActivity
                isModalOpenAdd={activityModalOpen}
                handleOkAdd={() => setActivityModalOpen(false)}
                handleCancelAdd={() => setActivityModalOpen(false)}
            />
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
