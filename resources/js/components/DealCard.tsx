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
    Card,
} from "antd";

import {
    CloseOutlined,
    EditOutlined,
    EllipsisOutlined,
    PhoneOutlined,
    StarFilled,
    UserOutlined,
} from "@ant-design/icons";

import { useMutation } from "react-query";
import {
    createCustomFieldMutation,
    createCustomFieldSectionMutation,
} from "../api/mutation/useCustomFieldMutation";
import queryClient from "../queryClient";
import { DEFAULT_REQUIRED_MESSAGE } from "../constants";
import { TCustomFieldSection, TDeal, TUserSettings } from "../entities";
import { useCustomFields } from "../api/query/customFieldQuery";
import { userSettings } from "../api/mutation/useUserMutation";
import { useAppContextProvider } from "../context/AppContext";
import { useCallContext } from "../context/CallContext";
import CustomLink from "./CustomLink";
import TextEllipsis from "./TextEllipsis";
import DropdownComponent from "./DropdownComponent";
import ContactTypeTag from "./ContactTypeTag";
import { maskToCurrency } from "../helpers";
import { useDealMutationUpdateStarred } from "../api/mutation/useDealMutation";
interface Props {
    deal: TDeal;
    handleEditClick: () => void;
    sortBy: string;
    updateStarredDeal: (deal: TDeal) => void;
}
const DealCard = ({
    deal,
    handleEditClick,
    sortBy,
    updateStarredDeal,
}: Props) => {
    const { setIsModalOpen, setCallerNumber, setDestinationNumber } =
        useCallContext();

    const { loggedInUser } = useAppContextProvider();

    const settings = loggedInUser?.settings;

    const {
        data: contactFields,
        isLoading: isContactFieldsLoading,
        refetch: refetchContactFields,
    } = useCustomFields("contact");

    const getLabel = (dealCardpos2FieldName, dealCardpos2FieldValue) => {
        const customField = contactFields?.find(
            (field) => field.fieldName == dealCardpos2FieldName
        );

        if (
            !customField ||
            dealCardpos2FieldValue === undefined ||
            !dealCardpos2FieldValue
        ) {
            return "";
        }

        // if (customField?.type == "contactTypeLookup") {
        //     return <ContactTypeTag fields={fields} />;
        // }
        if (customField?.type == "url") {
            return (
                <a href={dealCardpos2FieldValue} target="_blank">
                    {dealCardpos2FieldValue}
                </a>
            );
        }
        if (customField?.type == "currency") {
            return maskToCurrency(dealCardpos2FieldValue);
        }
        return dealCardpos2FieldValue;
    };

    return (
        <Tooltip title={deal.fullName} style={{ overflow: "hidden" }}>
            <Card
                className=" p-0"
                bodyStyle={{ padding: "12px" }}
                loading={isContactFieldsLoading}
                style={{ width: "250px" }}
            >
                <Space className="w-100" direction="vertical" size={0}>
                    <Space
                        className="w-100"
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginTop: "auto",
                        }}
                    >
                        <div>
                            <Typography.Text
                                style={{
                                    color: "gray",
                                    fontSize: "12px",
                                    fontWeight:
                                        sortBy == "aging" ? "bold" : "normal",
                                }}
                            >
                                {deal.aging}
                            </Typography.Text>
                            {deal.star ? (
                                <StarFilled
                                    style={{
                                        cursor: "pointer",
                                        display: "inline-block",
                                        marginLeft: 3,
                                        color: "gold",
                                    }}
                                    onClick={() => {
                                        // alert();
                                        // updateStarredDeal(deal);
                                    }}
                                />
                            ) : (
                                <></>
                            )}
                        </div>

                        <div>
                            <DropdownComponent
                                menuList={[
                                    {
                                        label: (
                                            <div onClick={handleEditClick}>
                                                Edit Deal
                                            </div>
                                        ),
                                        key: 0,
                                    },
                                    {
                                        label: (
                                            <CustomLink
                                                to={
                                                    "/contacts/" +
                                                    deal.contactId +
                                                    "/" +
                                                    deal?.fullName.replace(
                                                        /\s/g,
                                                        "-"
                                                    )
                                                }
                                                style={{ color: "black" }}
                                            >
                                                View Contact
                                            </CustomLink>
                                        ),
                                        key: 1,
                                    },
                                    {
                                        label: (
                                            <div
                                                onClick={() => {
                                                    setCallerNumber(
                                                        deal.contact?.fields
                                                            ?.defaultMobileNumber ??
                                                            ""
                                                    );
                                                    setDestinationNumber(
                                                        deal.contact?.fields
                                                            .mobile ?? ""
                                                    );
                                                    setIsModalOpen(true);
                                                }}
                                            >
                                                Call Contact
                                            </div>
                                        ),
                                        key: 3,
                                    },
                                    {
                                        label: (
                                            <div
                                                onClick={() => {
                                                    updateStarredDeal(deal);
                                                }}
                                            >
                                                {deal.star
                                                    ? "Remove to Favorites"
                                                    : "Add to Favorites"}
                                            </div>
                                        ),
                                        key: 4,
                                    },
                                ]}
                                label={
                                    <EllipsisOutlined
                                        style={{ transform: "rotate(90deg)" }}
                                    />
                                }
                                floatRight
                                showCarret={false}
                            />
                        </div>
                    </Space>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginTop: "auto",
                        }}
                    >
                        <div style={{ width: "50%" }}>
                            <TextEllipsis
                                style={{
                                    fontWeight:
                                        sortBy == "firstName"
                                            ? "bold"
                                            : "normal",
                                }}
                            >
                                {deal.fullName}
                            </TextEllipsis>
                        </div>

                        <div style={{ width: "50%" }}>
                            {settings?.dealCardpos2FieldId ? (
                                <TextEllipsis
                                    style={{
                                        fontWeight:
                                            sortBy ==
                                            settings?.dealCardpos2FieldId
                                                ? "bold"
                                                : "normal",
                                    }}
                                >
                                    {getLabel(
                                        deal.dealCardpos2FieldName,
                                        deal.dealCardpos2FieldValue
                                    )}
                                </TextEllipsis>
                            ) : null}
                        </div>
                    </div>

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginTop: "auto",
                        }}
                    >
                        <div style={{ width: "50%" }}>
                            {settings?.dealCardpos3FieldId ? (
                                <TextEllipsis
                                    style={{
                                        fontWeight:
                                            sortBy ==
                                            settings?.dealCardpos3FieldId
                                                ? "bold"
                                                : "normal",
                                    }}
                                >
                                    {getLabel(
                                        deal.dealCardpos3FieldName,
                                        deal.dealCardpos3FieldValue
                                    )}
                                </TextEllipsis>
                            ) : (
                                <></>
                            )}
                        </div>

                        <div style={{ width: "50%" }}>
                            {settings?.dealCardpos4FieldId ? (
                                <TextEllipsis
                                    style={{
                                        fontWeight:
                                            sortBy ==
                                            settings?.dealCardpos4FieldId
                                                ? "bold"
                                                : "normal",
                                        float: "right",
                                    }}
                                >
                                    {getLabel(
                                        deal.dealCardpos4FieldName,
                                        deal.dealCardpos4FieldValue
                                    )}
                                </TextEllipsis>
                            ) : (
                                <></>
                            )}
                        </div>
                    </div>
                </Space>
            </Card>
        </Tooltip>
    );
};

export default DealCard;
