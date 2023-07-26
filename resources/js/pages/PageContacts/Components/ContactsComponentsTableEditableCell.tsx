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

import React, { useEffect, useState } from "react";
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
    recordType: string | null;
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
    return (
        <>
            {record.email ? (
                <div
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

                    {((currentBtnActive == record.id &&
                        currentActiveType == type) ||
                        currentActiveCell == type + ": " + record.id) && (
                        <Popconfirm
                            title=""
                            icon={null}
                            description={
                                <Input
                                    value={recordType ?? ""}
                                    onBlur={() => {
                                        setCurrentActiveCell("");
                                        setCurrentBtnActive("");
                                    }}
                                />
                            }
                            onConfirm={() => {}}
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
                                    setCurrentActiveCell("");
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
                            <Input
                                value={record.email}
                                onBlur={() => {
                                    setCurrentActiveCell("");
                                    setCurrentBtnActive("");
                                }}
                            />
                        }
                        onConfirm={() => {}}
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

export default ContactsComponentsTableEditableCell;
