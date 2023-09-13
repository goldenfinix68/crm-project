import { CaretDownFilled } from "@ant-design/icons";
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

interface ContactsComponentsTableEditableCell {
    record: any;
    type: string;
    setCurrentActiveCell: any;
    setCurrentBtnActive: any;
    currentBtnActive: string;
    currentActiveCell: string;
    recordType: any | null;
    setCurrentActiveType: any;
    currentActiveType: string;
}

const ContactsComponentsTableEditableCell = ({
    record,
    type,
    setCurrentActiveCell,
    setCurrentBtnActive,
    currentBtnActive,
    currentActiveCell,
    recordType,
    setCurrentActiveType,
    currentActiveType,
}: ContactsComponentsTableEditableCell) => {
    const addContact = useMutation(addContactMutation, {
        onSuccess: () => {
            console.log("success");
            queryClient.invalidateQueries("contacts");
            setCurrentBtnActive("");
            setCurrentActiveType("");
            setCurrentActiveCell("");
        },
    });

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

    useEffect(() => {
        console.log("check_data", currentBtnActive, record.id);
        console.log("check_data", currentActiveType, type);
        console.log("check_data", currentActiveCell, type + ": " + record.id);
    }, []);

    return (
        <>
            {recordType ? (
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
                    {recordType}

                    {/* {((currentBtnActive == record.id &&
                        currentActiveType == type) ||
                        currentActiveCell == type + ": " + record.id) && ( */}
                    <Popconfirm
                        title={type.charAt(0).toUpperCase() + type.slice(1)}
                        icon={null}
                        description={
                            <Input
                                autoFocus
                                value={updateVal ?? ""}
                                onBlur={(value) => {
                                    setCurrentBtnActive("");
                                }}
                                onChange={(e) => {
                                    console.log("value", e.target.value);
                                    setUpdateValue(e.target.value);
                                }}
                            />
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
                            style={{
                                margin: "2px",
                                padding: "8px",
                                display: "flex",
                                alignItems: "center",
                                backgroundColor: "white",
                            }}
                            className="cell-hover-btn"
                            type="text"
                            onClick={() => {
                                setCurrentActiveCell(type + ": " + record.id);
                            }}
                            onBlur={() => {
                                setCurrentBtnActive("");
                            }}
                        >
                            {<FontAwesomeIcon icon={faPen} />}
                        </Button>
                    </Popconfirm>
                    {/* // )} */}
                </div>
            ) : (
                (currentActiveCell != type + ": " + record.id ||
                    currentActiveCell == type + ": " + record.id) && (
                    <Popconfirm
                        title={type.charAt(0).toUpperCase() + type.slice(1)}
                        icon={null}
                        description={
                            <Input
                                autoFocus
                                value={updateVal ?? ""}
                                onBlur={() => {
                                    setCurrentBtnActive("");
                                }}
                                onChange={(e) => {
                                    console.log("value", e.target.value);
                                    setUpdateValue(e.target.value);
                                }}
                                onClick={(value) => {
                                    setCurrentBtnActive("");
                                }}
                            />
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
                        <div
                            className="cell cell-hover"
                            style={{
                                display: "flex",
                                justifyContent: "flex-end",
                                borderRadius: "5px",
                            }}
                            onMouseOver={() => {
                                setCurrentBtnActive(record.id);
                                setCurrentActiveType(type);
                            }}
                            onMouseLeave={() => {
                                setCurrentBtnActive("");
                                setCurrentActiveType("");
                            }}
                            onClick={() => {
                                setCurrentActiveCell(type + ": " + record.id);
                            }}
                        >
                            <Button
                                style={{
                                    padding: "8px",
                                    display: "flex",
                                    alignItems: "center",
                                    margin: "2px",
                                    backgroundColor: "white",
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
                                    setCurrentActiveCell(
                                        type + ": " + record.id
                                    );
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
                                {/* )}{" "} */}
                            </Button>
                        </div>
                    </Popconfirm>
                )
            )}
        </>
    );
};

export default ContactsComponentsTableEditableCell;
