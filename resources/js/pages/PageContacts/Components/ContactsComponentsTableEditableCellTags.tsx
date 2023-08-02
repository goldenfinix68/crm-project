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
    Tag,
} from "antd";

import React, { useEffect, useState } from "react";
import type { CheckboxChangeEvent } from "antd/es/checkbox";
import { DEFAULT_REQUIRED_MESSAGE } from "../../../constants";
import { useMutation, useQueryClient } from "react-query";
import { addContactMutation } from "../../../api/mutation/useContactMutation";
import queryClient from "../../../queryClient";
import { TContact } from "../../../entities";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";

interface ContactsComponentsTableEditableCellTags {
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

const ContactsComponentsTableEditableCellTags = ({
    record,
    type,
    setCurrentActiveCell,
    setCurrentBtnActive,
    currentBtnActive,
    currentActiveCell,
    recordType,
    setCurrentActiveType,
    currentActiveType,
}: ContactsComponentsTableEditableCellTags) => {
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
    const [clearSelect, setClearSelect] = useState<string[]>(recordType);

    const handleModalClose = () => {
        setClearSelect([]);
    };

    useEffect(() => {
        console.log("clearselect", clearSelect);
    }, [clearSelect]);

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
                [type]: clearSelect.length > 0 ? clearSelect : null,
            });
        }
    };
    return (
        <>
            {recordType ? (
                <div
                    style={{
                        display: "flex",
                        // justifyContent: "space-between",
                        alignItems: "center",
                        // width: "250px",
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
                    {/* {recordType} */}
                    <div className="tag-container">
                        {recordType &&
                            recordType &&
                            recordType.length > 0 &&
                            recordType.map((tag) => (
                                <Tag
                                    color="blue"
                                    key={tag}
                                    className="tag-item"
                                >
                                    {tag}
                                </Tag>
                            ))}
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
                                        width: "250px",
                                    }}
                                >
                                    <Select
                                        value={clearSelect}
                                        // defaultValue={updateVal ?? []}
                                        mode="tags"
                                        style={{ width: "250px" }}
                                        tokenSeparators={[","]}
                                        onChange={(values) => {
                                            setClearSelect(values);
                                            setUpdateValue(values);
                                        }}
                                    />
                                </Space>
                            }
                            onConfirm={() => {
                                handleFinish(record, updateVal);
                            }}
                            onCancel={() => {
                                setCurrentActiveCell("");
                                setClearSelect(updateVal ?? []);
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
                                type="text"
                                onClick={() => {
                                    setCurrentActiveCell(
                                        type + ": " + record.id
                                    );
                                    setClearSelect(updateVal ?? []);
                                }}
                                onBlur={() => {
                                    setCurrentBtnActive("");
                                }}
                            >
                                {<FontAwesomeIcon icon={faPen} />}
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
                            <Space style={{ width: "250px" }}>
                                <Select
                                    value={clearSelect}
                                    // defaultValue={updateVal ?? []}
                                    mode="tags"
                                    style={{ width: "250px" }}
                                    tokenSeparators={[","]}
                                    onChange={(values) => {
                                        setClearSelect(values);
                                        setUpdateValue(values);
                                    }}
                                    // options={options}
                                />
                            </Space>
                        }
                        onConfirm={() => {
                            handleFinish(record, updateVal);
                        }}
                        onCancel={() => {
                            setCurrentActiveCell("");
                            setClearSelect(updateVal ?? []);
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
                                setClearSelect([]);
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

export default ContactsComponentsTableEditableCellTags;
