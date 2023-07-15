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
    List,
    Avatar,
} from "antd";

import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined,
    VideoCameraOutlined,
    CheckCircleOutlined,
    FunnelPlotOutlined,
    PhoneOutlined,
    FileDoneOutlined,
    TeamOutlined,
    PlaySquareOutlined,
    TableOutlined,
    PlusCircleOutlined,
    DownOutlined,
    LockOutlined,
    CloseOutlined,
    HolderOutlined,
} from "@ant-design/icons";

import React, { useState } from "react";
import {
    faFilter,
    faHome,
    faFont,
    faSquare,
    fa1,
    faCircleDot,
    faCalendarDay,
    faCalendarTimes,
    faEnvelope,
    faPhone,
    faCircleArrowDown,
    faSquareCheck,
    faUser,
    faCircleUser,
    faLink,
    faPercentage,
    faDollarSign,
    faCalculator,
    faClock,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const handleChange = (value: string) => {
    console.log(`selected ${value}`);
};

interface ContactsComponentsAddCustomField {
    isModalAddCustomField: boolean;
    setModalAddCustomField: any;
}

const data = [
    {
        title: "Text",
        description: "The text field can store up to 255 characters",
        icon: <FontAwesomeIcon icon={faFont} />,
    },
    {
        title: "Text Area",
        description:
            "This field lets you store much bigger texts than text fields. Such fields are not visible on reports or grids.",
        icon: <FontAwesomeIcon icon={faSquare} />,
    },
    {
        title: "Integer",
        description:
            "The integer field can have numeric values without any demical points",
        icon: <FontAwesomeIcon icon={fa1} />,
    },
    {
        title: "Decimal",
        description:
            "The decimal field can have numeric values with two decimal points",
        icon: <FontAwesomeIcon icon={faCircleDot} />,
    },
    {
        title: "Date",
        description:
            "The field lets you select date input using the calendar component.",
        icon: <FontAwesomeIcon icon={faCalendarDay} />,
    },
    {
        title: "Date Time",
        description:
            "The field lets you select a date and time information using calendar + time picker.",
        icon: <FontAwesomeIcon icon={faClock} />,
    },
    {
        title: "Email",
        description: "The field lets you enter a valid email address.",
        icon: <FontAwesomeIcon icon={faEnvelope} />,
    },
    {
        title: "Phone",
        description: "The field lets you enter a phone or mobile number.",
        icon: <FontAwesomeIcon icon={faPhone} />,
    },
    {
        title: "Select",
        description:
            "The field lets you define a list of options that will appear in the dropdown. You can select a single option from the list.",
        icon: <FontAwesomeIcon icon={faCircleArrowDown} />,
    },
    {
        title: "Multi Select",
        description:
            "The field lets define a list of options that will appear in the dropdown. You can select multiple options from the list.",
        icon: <FontAwesomeIcon icon={faSquareCheck} />,
    },
    {
        title: "Contact Lookup",
        description:
            "The field lets you associate the contact record with your module.",
        icon: <FontAwesomeIcon icon={faUser} />,
    },
    {
        title: "User Lookup",
        description:
            "The field lets you associate the user record with your module.",
        icon: <FontAwesomeIcon icon={faCircleUser} />,
    },
    {
        title: "URL",
        description:
            "The field lets you enter a website or page URL, which appears as a clickable link.",
        icon: <FontAwesomeIcon icon={faLink} />,
    },
    {
        title: "Big Integer",
        description:
            "The big integer field can have numeric values without any decimal points. Big Integer can go up to 9223372036854775807",
        icon: <FontAwesomeIcon icon={fa1} />,
    },
    {
        title: "Percentage",
        description:
            "The field can have numeric values that appear with a % sign during display.",
        icon: <FontAwesomeIcon icon={faPercentage} />,
    },
    {
        title: "Boolean",
        description:
            "The field lets you create a single value (true/false) option with a toggle operation.",
        icon: <FontAwesomeIcon icon={faCircleDot} />,
    },
    {
        title: "Currency",
        description:
            "The field lets you create a numeric value with decimals that appears with the organization's currency symbol during display.",
        icon: <FontAwesomeIcon icon={faDollarSign} />,
    },
    {
        title: "Formula",
        description:
            "The field presents calculated information on basis of the other fields.",
        icon: <FontAwesomeIcon icon={faCalculator} />,
    },
];

const ContactsComponentsAddCustomField: React.FC<
    ContactsComponentsAddCustomField
> = ({ isModalAddCustomField, setModalAddCustomField }) => {
    return (
        <>
            <Modal
                width={500}
                title={"Select Field Type"}
                open={isModalAddCustomField}
                onCancel={() => setModalAddCustomField(false)}
                footer={null}
                // footer={[
                //     <Button type="primary">Save</Button>,
                //     <Button type="primary">Save and add other</Button>,
                //     <Button onClick={() => setIsModalOpen(false)}>
                //         Cancel
                //     </Button>,
                // ]}
            >
                <Input className="m-t-sm m-b-lg" placeholder="Search Fields" />

                <List
                    itemLayout="horizontal"
                    dataSource={data}
                    style={{ height: 500, overflow: "auto" }}
                    renderItem={(item, index) => (
                        <List.Item
                            className="clickable-item hover-item"
                            onClick={() => console.log(item)}
                        >
                            <List.Item.Meta
                                className="p-xs"
                                avatar={
                                    <Avatar
                                        icon={item.icon}
                                        style={{
                                            backgroundColor: "transparent",
                                            color: "gray",
                                        }}
                                    />
                                }
                                title={item.title}
                                description={item.description}
                            />
                        </List.Item>
                    )}
                />
            </Modal>
        </>
    );
};

export default ContactsComponentsAddCustomField;
