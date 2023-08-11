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
} from "antd";

import React, { useEffect, useState } from "react";
import type { CheckboxChangeEvent } from "antd/es/checkbox";
import { DEFAULT_REQUIRED_MESSAGE } from "../../../constants";
import { useMutation, useQueryClient } from "react-query";
import { addContactMutation } from "../../../api/mutation/useContactMutation";
import queryClient from "../../../queryClient";
import { TContact } from "../../../entities";

interface ContactsComponentsUpdateFields {
    activeField: string;
}

const handleChange = (value: string) => {
    console.log(`selected ${value}`);
};

const ContactsComponentsUpdateFields = ({ activeField }) => {
    switch (activeField) {
        case "title":
            return (
                <>
                    <Typography className="m-b-md">
                        Enter a new value for the field
                    </Typography>
                    <Typography className="m-b-xs">Title</Typography>

                    <Form.Item name="apn">
                        <Input />
                    </Form.Item>
                </>
            );
            break;
        // case "name":
        //     return (
        //         <>
        //             <Typography className="m-b-md">
        //                 Enter a new value for the field
        //             </Typography>
        //             <Typography className="m-b-xs">Name</Typography>

        //             <Form.Item name="acres">
        //                 <Input />
        //             </Form.Item>
        //         </>
        //     );
        //     break;
        case "value":
            return (
                <Form.Item name="addressLine1">
                    <Typography className="m-b-md">
                        Enter a new value for the field
                    </Typography>
                    <Typography className="m-b-xs">Value</Typography>
                    <Input />
                </Form.Item>
            );
            break;

        case "stage":
            return (
                <Form.Item name="type">
                    <Typography className="m-b-md">
                        Enter a new value for the field
                    </Typography>
                    <Typography className="m-b-xs">Stage</Typography>
                    <Select
                        className="m-b-md"
                        defaultValue="Select"
                        onChange={handleChange}
                    >
                        <Select.Option value="Comp & Qualify">
                            Comp & Qualify
                        </Select.Option>
                        <Select.Option value="First Offer Given">
                            First Offer Given
                        </Select.Option>
                        <Select.Option value="In Negotiation">
                            In Negotiation
                        </Select.Option>
                        <Select.Option value="Verbal Offer Accepted">
                            Verbal Offer Accepted
                        </Select.Option>
                        <Select.Option value="Under Contract">
                            Under Contract
                        </Select.Option>
                    </Select>
                </Form.Item>
            );
            break;
        // case "owner":
        //     return (
        //         <Form.Item name="website">
        //             <Typography className="m-b-md">
        //                 Enter a new value for the field
        //             </Typography>
        //             <Typography className="m-b-xs">Website</Typography>
        //             <Input />
        //         </Form.Item>
        //     );
        //     break;
        case "status":
            return (
                <Form.Item name="wetlandsStatus">
                    <Typography className="m-b-md">
                        Enter a new value for the field
                    </Typography>
                    <Typography className="m-b-xs">Status</Typography>
                    <Select
                        className="m-b-md"
                        defaultValue="Select"
                        onChange={handleChange}
                    >
                        {" "}
                        <Select placeholder="Status">
                            <Select.Option value="Open">Open</Select.Option>
                            <Select.Option value="Won">Won</Select.Option>
                            <Select.Option value="Lost">Lost</Select.Option>
                        </Select>
                    </Select>
                </Form.Item>
            );
            break;

        default:
            break;
    }
    return <>{}</>;
};

export default ContactsComponentsUpdateFields;
