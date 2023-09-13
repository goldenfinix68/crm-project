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
    recordTypeFirst: any | null;
    recordTypeLast: any | null;
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
    recordTypeFirst,
    recordTypeLast,
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

    const [updateValFirst, setUpdateValueFirst] = useState(recordTypeFirst);
    const [updateValLast, setUpdateValueLast] = useState(recordTypeLast);

    const handleFinish = (
        values: TContact,
        updateValFirst: any,
        updateValLast: any
    ) => {
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
                firstName: updateValFirst,
                lastName: updateValLast,
            });
        }
    };

    return (
        <>
            {updateValFirst || updateValLast ? (
                <div
                    className="cell cell-hover"
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        paddingLeft: "10px",
                        paddingRight: "1px",
                        borderRadius: "5px",
                        paddingTop: "0px",
                        paddingBottom: "0px",
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
                                {/* <Button
                                    type="link"
                                    style={{ padding: 0 }}
                                    onClick={() => {
                                        navigate(`/contacts/${record.id}`);
                                    }}
                                >
                                    {record.firstName} {record.lastName}
                                </Button> */}
                                <Typography.Link
                                    style={{
                                        padding: 0,
                                        // whiteSpace: "nowrap",
                                        // overflow: "hidden",
                                        // textOverflow: "ellipsis",
                                        // width: "100%",
                                    }}
                                    onClick={() => {
                                        navigate(`/contacts/${record.id}`);
                                    }}
                                >
                                    {record.firstName} {record.lastName}
                                </Typography.Link>
                            </span>
                        </span>
                    </div>

                    {/* {((currentBtnActive == record.id &&
                        currentActiveType == type) ||
                        currentActiveCell == type + ": " + record.id) && ( */}
                    <div className="cell-hover" style={{ display: "flex" }}>
                        <Popconfirm
                            title=""
                            icon={null}
                            description={
                                <Space
                                    style={{
                                        flexDirection: "column",
                                        width: "300px",
                                        alignItems: "flex-start",
                                    }}
                                >
                                    <Typography>First Name</Typography>
                                    <Input
                                        style={{
                                            width: "300px",
                                        }}
                                        autoFocus
                                        value={updateValFirst ?? ""}
                                        onBlur={(value) => {
                                            setCurrentBtnActive("");
                                        }}
                                        onChange={(e) => {
                                            console.log(
                                                "value",
                                                e.target.value
                                            );
                                            setUpdateValueFirst(e.target.value);
                                        }}
                                    ></Input>
                                    <Typography className="m-t-sm">
                                        Last Name
                                    </Typography>
                                    <Input
                                        style={{
                                            width: "300px ",
                                        }}
                                        value={updateValLast ?? ""}
                                        onBlur={(value) => {
                                            setCurrentBtnActive("");
                                        }}
                                        onChange={(e) => {
                                            console.log(
                                                "value",
                                                e.target.value
                                            );
                                            setUpdateValueLast(e.target.value);
                                        }}
                                    ></Input>
                                </Space>
                            }
                            onConfirm={() => {
                                handleFinish(
                                    record,
                                    updateValFirst,
                                    updateValLast
                                );
                            }}
                            onCancel={() => {
                                setCurrentActiveCell("");
                            }}
                            okText="Save"
                            cancelText="No"
                        >
                            <Button
                                className="m-r-xs cell-hover-btn"
                                style={{
                                    padding: "8px",
                                    display: "flex !important",
                                    alignItems: "center",
                                    backgroundColor: "white",
                                }}
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
                        </Popconfirm>
                        <Button
                            className="cell-hover-btn"
                            style={{
                                padding: "8px",
                                display: "flex !important",
                                alignItems: "center",
                                backgroundColor: "white",
                                marginRight: "2px",
                            }}
                            type="text"
                            onClick={() => {
                                navigate(`/contacts/${record.id}`);
                            }}
                        >
                            <EyeOutlined />
                        </Button>
                    </div>
                    {/* )} */}
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
                                    width: "300px ",
                                }}
                            >
                                <Typography>First Name</Typography>
                                <Input
                                    style={{ width: "300px " }}
                                    autoFocus
                                    value={updateValFirst ?? ""}
                                    onBlur={(value) => {
                                        setCurrentBtnActive("");
                                    }}
                                    onChange={(e) => {
                                        console.log("value", e.target.value);
                                        setUpdateValueFirst(e.target.value);
                                    }}
                                    onClick={(value) => {
                                        setCurrentBtnActive("");
                                    }}
                                ></Input>
                                <Typography>Last Name</Typography>
                                <Input
                                    style={{ width: "300px " }}
                                    value={updateValLast ?? ""}
                                    onBlur={(value) => {
                                        setCurrentBtnActive("");
                                    }}
                                    onChange={(e) => {
                                        console.log("value", e.target.value);
                                        setUpdateValueLast(e.target.value);
                                    }}
                                    onClick={(value) => {
                                        setCurrentBtnActive("");
                                    }}
                                ></Input>
                            </Space>
                        }
                        onConfirm={() => {
                            handleFinish(record, updateValFirst, updateValLast);
                        }}
                        onCancel={() => {
                            setCurrentActiveCell("");
                        }}
                        okText="Save"
                        cancelText="No"
                    >
                        <Button
                            style={{
                                padding: "8px",
                                display: "flex",
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
                            type="text"
                            onClick={() => {
                                setCurrentActiveCell(type + ": " + record.id);
                            }}
                        >
                            {/* {((currentBtnActive == record.id &&
                                currentActiveType == type) ||
                                currentActiveCell ==
                                    type + ": " + record.id) && ( */}
                            <FontAwesomeIcon
                                icon={faPen}
                                className="cell-hover-btn"
                            />
                            {/* )} */}
                        </Button>
                    </Popconfirm>
                )
            )}
        </>
    );
};

export default ContactsComponentsTableEditableCellName;
