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

const ContactsComponentsUpdateFields = ({ activeField }) => {
    switch (activeField) {
        case "apn":
            return (
                <Form.Item name="apn">
                    <Input placeholder="APN" />
                </Form.Item>
            );
            break;
        case "acres":
            return (
                <Form.Item name="acres">
                    <Input placeholder="Acres" />
                </Form.Item>
            );
            break;
        case "address-line-1":
            return (
                <Form.Item name="address-line-1">
                    <Input placeholder="Address Line 1" />
                </Form.Item>
            );
            break;

        default:
            break;
    }
    return <>{}</>;
};

export default ContactsComponentsUpdateFields;
