import { CaretDownFilled, EyeOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import {
    Button,
    Col,
    Dropdown,
    Modal,
    Row,
    Space,
    Input,
    Select,
    Typography,
    Checkbox,
    Divider,
    Form,
    Popconfirm,
    Avatar,
} from "antd";

import React, { useEffect, useState, useRef } from "react";
import type { CheckboxChangeEvent } from "antd/es/checkbox";
import { DEFAULT_REQUIRED_MESSAGE } from "../../../constants";
import { useMutation, useQueryClient } from "react-query";
import { addContactMutation } from "../../../api/mutation/useContactMutation";
import queryClient from "../../../queryClient";
import { TContact } from "../../../entities";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router";

interface ContactsComponentsTableEditableCellName {
    record: any;
    type: string;
    setCurrentActiveCell: any;
    setCurrentBtnActive: any;
    currentBtnActive: string;
    currentActiveCell: string;
    recordType: any | null;
    setCurrentActiveType: any;
    currentActiveType: string;
    setisModalOpen: any;
    setTContact: any;
    setTitle: any;
    navigate: any;
}

const ContactsComponentsTableEditableCellName = ({
    record,
    type,
    setCurrentActiveCell,
    setCurrentBtnActive,
    currentBtnActive,
    currentActiveCell,
    recordType,
    setCurrentActiveType,
    currentActiveType,
    setisModalOpen,
    setTContact,
    setTitle,
    navigate,
}: ContactsComponentsTableEditableCellName) => {
    const addContact = useMutation(addContactMutation, {
        onSuccess: () => {
            console.log("success");
            queryClient.invalidateQueries("contacts");
            setCurrentBtnActive("");
            setCurrentActiveType("");
            setCurrentActiveCell("");
        },
    });

    const handleEdit = (record: TContact) => {
        setTContact(record);
    };

    const [updateVal, setUpdateValue] = useState(recordType);

    const handleFinish = (values: TContact, updateVal: any) => {
        // let data = {
        //     ...values,
        //     id: record.id,
        //     [type]: updateVal,
        // };

        // console.log(data);

        if (record) {
            addContact.mutate({
                ...values,
                id: record.id,
                [type]: updateVal,
            });
        }
    };

    return (
        <>
            {recordType ? (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                    onMouseOver={() => {
                        setCurrentBtnActive(record.id);
                        setCurrentActiveType(type);
                    }}
                    onMouseLeave={() => {
                        setCurrentBtnActive("");
                        setCurrentActiveType("");
                    }}
                >
                    <div>
                        <span>
                            <Button
                                type="text"
                                className="m-r-sm"
                                icon={<FontAwesomeIcon icon={faPen} />}
                                onClick={() => {
                                    setisModalOpen(true);
                                    handleEdit(record);
                                    console.log("data", record);
                                    setTitle("Edit Contact");
                                }}
                            />
                            <Avatar
                                className="avatarText m-r-sm"
                                // src={record.avatar}
                                size={32}
                                style={{
                                    backgroundColor: "#1677FF",
                                    verticalAlign: "middle",
                                }}
                            >
                                {record.firstName.charAt(0)}
                            </Avatar>
                            <span style={{ marginLeft: "8px" }}>
                                <Button
                                    type="link"
                                    style={{ padding: 0 }}
                                    onClick={() => {
                                        navigate(`/contacts/${record.id}`);
                                    }}
                                >
                                    {record.firstName} {record.lastName}
                                </Button>
                            </span>
                        </span>
                    </div>

                    {((currentBtnActive == record.id &&
                        currentActiveType == type) ||
                        currentActiveCell == type + ": " + record.id) && (
                        <Popconfirm
                            title=""
                            icon={null}
                            description={
                                <Space
                                    style={{
                                        flexDirection: "column",
                                        width: "200px !important",
                                    }}
                                >
                                    <Input
                                        style={{ width: "200px !important" }}
                                        autoFocus
                                        value={record.firstName ?? ""}
                                        onBlur={(value) => {
                                            setCurrentBtnActive("");
                                        }}
                                        onChange={(e) => {
                                            console.log(
                                                "value",
                                                e.target.value
                                            );
                                            setUpdateValue(e.target.value);
                                        }}
                                    ></Input>
                                    <Input
                                        style={{ width: "200px !important" }}
                                        value={record.lastName ?? ""}
                                        onBlur={(value) => {
                                            setCurrentBtnActive("");
                                        }}
                                        onChange={(e) => {
                                            console.log(
                                                "value",
                                                e.target.value
                                            );
                                            setUpdateValue(e.target.value);
                                        }}
                                    ></Input>
                                </Space>
                            }
                            onConfirm={() => {
                                handleFinish(record, updateVal);
                            }}
                            onCancel={() => {
                                setCurrentActiveCell("");
                            }}
                            okText="Save"
                            cancelText="No"
                        >
                            <Button
                                type="text"
                                onClick={() => {
                                    setCurrentActiveCell(
                                        type + ": " + record.id
                                    );
                                }}
                                onBlur={() => {
                                    setCurrentBtnActive("");
                                }}
                            >
                                {<FontAwesomeIcon icon={faPen} />}
                            </Button>
                            <Button type="text">
                                <EyeOutlined />
                            </Button>
                        </Popconfirm>
                    )}
                </div>
            ) : (
                (currentActiveCell != type + ": " + record.id ||
                    currentActiveCell == type + ": " + record.id) && (
                    <Popconfirm
                        title=""
                        icon={null}
                        description={
                            <Space
                                style={{
                                    flexDirection: "column",
                                    width: "200px !important",
                                }}
                            >
                                <Input
                                    style={{ width: "200px !important" }}
                                    autoFocus
                                    value={record.firstName ?? ""}
                                    onBlur={(value) => {
                                        setCurrentBtnActive("");
                                    }}
                                    onChange={(e) => {
                                        console.log("value", e.target.value);
                                        setUpdateValue(e.target.value);
                                    }}
                                ></Input>
                                <Input
                                    style={{ width: "200px !important" }}
                                    value={record.lastName ?? ""}
                                    onBlur={(value) => {
                                        setCurrentBtnActive("");
                                    }}
                                    onChange={(e) => {
                                        console.log("value", e.target.value);
                                        setUpdateValue(e.target.value);
                                    }}
                                ></Input>
                            </Space>
                        }
                        onConfirm={() => {
                            handleFinish(record, updateVal);
                        }}
                        onCancel={() => {
                            setCurrentActiveCell("");
                        }}
                        okText="Save"
                        cancelText="No"
                    >
                        <Button
                            onMouseOver={() => {
                                setCurrentBtnActive(record.id);
                                setCurrentActiveType(type);
                            }}
                            onMouseLeave={() => {
                                setCurrentBtnActive("");
                                setCurrentActiveType("");
                            }}
                            type="text"
                            onClick={() => {
                                setCurrentActiveCell(type + ": " + record.id);
                            }}
                        >
                            {((currentBtnActive == record.id &&
                                currentActiveType == type) ||
                                currentActiveCell ==
                                    type + ": " + record.id) && (
                                <FontAwesomeIcon icon={faPen} />
                            )}
                        </Button>
                    </Popconfirm>
                )
            )}
        </>
    );
};

export default ContactsComponentsTableEditableCellName;
