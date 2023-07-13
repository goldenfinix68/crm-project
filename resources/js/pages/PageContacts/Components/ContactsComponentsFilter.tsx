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
    Drawer,
} from "antd";

import React, { useState } from "react";

interface ContactsComponentsFilter {
    open: boolean;
    setOpen: any;
}

const ContactsComponentsFilter: React.FC<ContactsComponentsFilter> = ({
    open,
    setOpen,
}) => {
    return (
        <>
            <Drawer
                title="Basic Drawer"
                placement="right"
                onClose={() => setOpen(false)}
                open={open}
            >
                <p>Some contents...</p>
                <p>Some contents...</p>
                <p>Some contents...</p>
            </Drawer>
        </>
    );
};

export default ContactsComponentsFilter;
