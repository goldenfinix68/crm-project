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

    const getLabel = (customFieldName, fields) => {
        const customField = contactFields?.find(
            (field) => field.fieldName == customFieldName
        );
        if (customField) {
            if (customField?.type == "contactTypeLookup") {
                return <ContactTypeTag fields={fields} />;
            }
            if (customField?.type == "url" && fields[customField?.fieldName]) {
                return (
                    <a href={fields[customField?.fieldName]} target="_blank">
                        {fields[customField.fieldName]}
                    </a>
                );
            }
            if (
                customField?.type == "currency" &&
                fields[customField.fieldName]
            ) {
                return maskToCurrency(fields[customField.fieldName]);
            }
            return fields[customField.fieldName];
        }

        return null;
    };

    return (
        <Tooltip
            title={
                deal.contact?.fields.firstName +
                " " +
                deal.contact?.fields.lastName
            }
        >
            <Card
                className="w-100 p-0"
                bodyStyle={{ padding: "12px" }}
                loading={isContactFieldsLoading}
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
                            <StarFilled
                                style={{
                                    cursor: "pointer",
                                    display: "inline-block",
                                    marginLeft: 3,
                                    color: deal.star ? "gold" : "gray",
                                }}
                                onClick={() => {
                                    // alert();
                                    updateStarredDeal(deal);
                                }}
                            />
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
                                                    deal.contact?.id +
                                                    "/" +
                                                    deal?.contact?.fields[
                                                        "firstName"
                                                    ].replace(/\s/g, "-") +
                                                    "-" +
                                                    deal?.contact?.fields[
                                                        "lastName"
                                                    ].replace(/\s/g, "-")
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
                    <Row>
                        <Col span={12}>
                            <TextEllipsis
                                style={{
                                    fontWeight:
                                        sortBy == "firstName"
                                            ? "bold"
                                            : "normal",
                                }}
                            >
                                {deal.contact?.fields.firstName +
                                    " " +
                                    deal.contact?.fields.lastName}
                            </TextEllipsis>
                        </Col>
                        <Col span={12}>
                            {settings?.dealCardpos2FieldId ? (
                                <div style={{ float: "right" }}>
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
                                            settings?.dealCardpos2FieldId,
                                            deal.contact?.fields
                                        )}
                                    </TextEllipsis>
                                </div>
                            ) : null}
                        </Col>
                    </Row>

                    <Row gutter={12}>
                        <Col span={12}>
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
                                        settings?.dealCardpos3FieldId,
                                        deal.contact?.fields
                                    )}
                                </TextEllipsis>
                            ) : (
                                <></>
                            )}
                        </Col>

                        <Col span={12} className="w-100">
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
                                        settings?.dealCardpos4FieldId,
                                        deal.contact?.fields
                                    )}
                                </TextEllipsis>
                            ) : (
                                <></>
                            )}
                        </Col>
                    </Row>
                </Space>
            </Card>
        </Tooltip>
    );
};

export default DealCard;
