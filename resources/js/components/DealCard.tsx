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
    PhoneOutlined,
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
interface Props {
    deal: TDeal;
    handleEditClick: () => void;
}
const DealCard = ({ deal, handleEditClick }: Props) => {
    const { setIsModalOpen, setCallerNumber, setDestinationNumber } =
        useCallContext();

    const { loggedInUser } = useAppContextProvider();

    const settings = loggedInUser?.settings;
    return (
        <Card className="w-100">
            <Space className="w-100" direction="vertical">
                <Space
                    className="w-100"
                    size={"large"}
                    style={{
                        justifyContent: "end",
                        alignItems: "center",
                        marginTop: "auto",
                    }}
                >
                    <Typography.Text
                        style={{ color: "gray", fontSize: "12px" }}
                    >
                        Aging: {deal.aging}
                    </Typography.Text>
                </Space>

                <Row gutter={12}>
                    <Col span={12}>
                        {deal.contact?.fields.firstName +
                            " " +
                            deal.contact?.fields.lastName}
                    </Col>

                    <Col span={12} className="w-100">
                        {settings?.dealCardpos2FieldId ? (
                            <TextEllipsis
                                style={{
                                    fontWeight: "normal",
                                    float: "right",
                                }}
                            >
                                {
                                    deal.contact?.fields[
                                        settings?.dealCardpos2FieldId
                                    ]
                                }
                            </TextEllipsis>
                        ) : (
                            <></>
                        )}
                    </Col>
                </Row>

                <Row gutter={12}>
                    <Col span={12}>
                        {settings?.dealCardpos3FieldId ? (
                            <TextEllipsis style={{ fontWeight: "normal" }}>
                                {
                                    deal.contact?.fields[
                                        settings?.dealCardpos3FieldId
                                    ]
                                }
                            </TextEllipsis>
                        ) : (
                            <div></div>
                        )}
                    </Col>

                    <Col span={12} className="w-100">
                        {settings?.dealCardpos4FieldId ? (
                            <TextEllipsis
                                style={{ fontWeight: "normal", float: "right" }}
                            >
                                {
                                    deal.contact?.fields[
                                        settings?.dealCardpos4FieldId
                                    ]
                                }
                            </TextEllipsis>
                        ) : (
                            <></>
                        )}
                    </Col>
                </Row>
                <Space
                    className="w-100"
                    size={"large"}
                    style={{
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: "auto",
                    }}
                >
                    <Tooltip title="Call contact">
                        <Button
                            type="text"
                            icon={<PhoneOutlined />}
                            onClick={() => {
                                setCallerNumber(
                                    deal.contact?.fields?.defaultMobileNumber ??
                                        ""
                                );
                                setDestinationNumber(
                                    deal.contact?.fields.mobile ?? ""
                                );
                                setIsModalOpen(true);
                            }}
                        />
                    </Tooltip>
                    <Tooltip title="Contact profile">
                        <CustomLink
                            to={"/contacts/" + deal.contact?.id}
                            style={{ color: "black" }}
                        >
                            <Button type="text" icon={<UserOutlined />} />
                        </CustomLink>
                    </Tooltip>
                    <Tooltip title="Edit deal">
                        <Button
                            type="text"
                            icon={<EditOutlined />}
                            onClick={handleEditClick}
                        />
                    </Tooltip>
                </Space>
            </Space>
        </Card>
    );
};

export default DealCard;
