import {
    PhoneFilled,
    MessageFilled,
    MailFilled,
    DollarCircleOutlined,
    ApartmentOutlined,
    StarFilled,
} from "@ant-design/icons";
import { Space } from "antd";
import React from "react";
import ActionMenuBtn from "./ActionMenuBtn";
import TextModal from "./TextModal";
import ModalAddDeal from "../../Deal/components/ModalAddDeal";
import queryClient from "../../../queryClient";
import { useCallContext } from "../../../context/CallContext";
import { TContact } from "../../../entities";
import ModalSetDefaultMobile from "./ModalSetDefaultMobile";
import { useDealMutationUpdateStarred } from "../../../api/mutation/useDealMutation";
import { useMutation } from "react-query";

const ActionMenu = ({ contact }: { contact: TContact }) => {
    const [textModalOpen, setTextModalOpen] = React.useState(false);
    const [dealModalOpen, setDealModalOpen] = React.useState(false);
    const [defaultMobileNumberModal, setDefaultMobileNumberModal] =
        React.useState(false);
    const { setIsModalOpen, setCallerNumber, setDestinationNumber } =
        useCallContext();

    const updateContact = useMutation(useDealMutationUpdateStarred, {
        onSuccess: () => {
            console.log("success");
            queryClient.invalidateQueries("getContact");
            // setShowupdateButton(false);
        },
    });
    const updateStarredDeal = async (deal) => {
        console.log("deal", deal.star);
        await updateContact.mutate({
            id: deal.id,
        });
    };
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
                    // setCallerNumber(contact?.defaultMobileNumber ?? "");
                    // setDestinationNumber(contact?.fields.mobile ?? "");
                    // setIsModalOpen(true);
                    console.log("contact deal star", contact.deal?.star);
                }}
                icon={
                    <StarFilled
                        style={{
                            color:
                                contact?.deal?.star == 1 ? "yellow" : "white",
                            fontSize: "10px",
                        }}
                        onClick={() => {
                            // alert();
                            updateStarredDeal(contact.deal);
                        }}
                    />
                }
                tooltip="Add to Favorites"
            />
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
            {textModalOpen && (
                <TextModal
                    closeModal={() => setTextModalOpen(false)}
                    isModalOpen={textModalOpen}
                    phoneNumbers={contact.phoneNumbers}
                    contact={contact}
                />
            )}
            {defaultMobileNumberModal && (
                <ModalSetDefaultMobile
                    isModalOpen={defaultMobileNumberModal}
                    closeModal={() => setDefaultMobileNumberModal(false)}
                    contact={contact}
                />
            )}

            {dealModalOpen && (
                <ModalAddDeal
                    isModalOpen={dealModalOpen}
                    handleSubmit={() => {
                        setDealModalOpen(false);
                        queryClient.invalidateQueries("getContact");
                    }}
                    closeModal={() => setDealModalOpen(false)}
                    contactId={contact.id}
                />
            )}
        </Space>
    );
};

export default ActionMenu;
