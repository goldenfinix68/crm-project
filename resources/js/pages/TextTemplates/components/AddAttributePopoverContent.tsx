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
    List,
} from "antd";

import { CloseOutlined } from "@ant-design/icons";

import { useMutation } from "react-query";
import { sendTextMutation } from "../../../api/mutation/useTextMutation";
import queryClient from "../../../queryClient";
import TextForm from "../../Texts/components/TextForm";
import { DEFAULT_REQUIRED_MESSAGE } from "../../../constants";
import { TTextTemplateFolder } from "../../../entities";
import { createTextTemplateFolderMutation } from "../../../api/mutation/useTextTemplateMutation";
import Search from "antd/es/input/Search";
interface Props {
    handleSelect: (e) => void;
}
const AddAttributePopoverContent = ({ handleSelect }: Props) => {
    const [menu, setMenu] = useState("contact");
    const list = [
        {
            menu: "contact",
            label: "Id",
            value: "{{id}}",
        },
        {
            menu: "contact",
            label: "First Name",
            value: "{{firstName}}",
        },
        {
            menu: "contact",
            label: "Last Name",
            value: "{{lastName}}",
        },
        {
            menu: "contact",
            label: "Mobile",
            value: "{{mobile}}",
        },
        {
            menu: "contact",
            label: "Country Link",
            value: "{{countryLink}}",
        },
        {
            menu: "contact",
            label: "Acres",
            value: "{{acres}}",
        },
        {
            menu: "contact",
            label: "Email",
            value: "{{email}}",
        },
        {
            menu: "contact",
            label: "Job Title",
            value: "{{jobTitle}}",
        },
        {
            menu: "contact",
            label: "Phone",
            value: "{{phone}}",
        },
        {
            menu: "contact",
            label: "Other Phone",
            value: "{{otherPhone}}",
        },
        {
            menu: "contact",
            label: "Owner Id",
            value: "{{ownerId}}",
        },
        {
            menu: "contact",
            label: "Email 2",
            value: "{{email2}}",
        },
        {
            menu: "contact",
            label: "Type Id",
            value: "{{typeId}}",
        },
        {
            menu: "contact",
            label: "Mailing Street Address",
            value: "{{mailingStreetAddress}}",
        },
        {
            menu: "contact",
            label: "Email Opt Out",
            value: "{{emailOptOut}}",
        },
        {
            menu: "contact",
            label: "Mailing City",
            value: "{{mailingCity}}",
        },
        {
            menu: "contact",
            label: "Mailing Country",
            value: "{{mailingCountry}}",
        },
        {
            menu: "contact",
            label: "Subdivision",
            value: "{{subdivision}}",
        },
        {
            menu: "contact",
            label: "APN",
            value: "{{APN}}",
        },
        {
            menu: "contact",
            label: "Google Map Link",
            value: "{{gMapLink}}",
        },
        {
            menu: "contact",
            label: "Road Frontage",
            value: "{{roadFrontage}}",
        },
        {
            menu: "contact",
            label: "Redfin Link",
            value: "{{redfinLink}}",
        },
        {
            menu: "contact",
            label: "Opening Bid",
            value: "{{openingBid}}",
        },
        {
            menu: "contact",
            label: "Assessed Value",
            value: "{{assessedValue}}",
        },
        {
            menu: "contact",
            label: "Assessed vs Opening Margin",
            value: "{{assessedVsOpeningMargin}}",
        },
    ];
    return (
        <Space direction="vertical" size={"large"}>
            <Radio.Group value={menu} onChange={(e) => setMenu(e.target.value)}>
                <Radio.Button value="contact">Contact</Radio.Button>
                <Radio.Button disabled value="activity">
                    Activity
                </Radio.Button>
                <Radio.Button disabled value="deal">
                    Deal
                </Radio.Button>
                <Radio.Button disabled value="owner">
                    Owner
                </Radio.Button>
            </Radio.Group>

            <Search placeholder="Search" />

            <List
                dataSource={list.filter((e) => e.menu == menu)}
                style={{ maxHeight: "200px", overflowY: "auto" }}
                renderItem={(item) => (
                    <div
                        style={{
                            cursor: "pointer", // Add pointer cursor
                            backgroundColor: "white", // Set the default background color
                            padding: "8px",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "blue";
                            e.currentTarget.style.color = "white"; // Change background color on hover
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "white";
                            e.currentTarget.style.color = "black"; // Restore default background color on hover out
                        }}
                        onClick={() => {
                            handleSelect(item.value);
                        }}
                    >
                        {item.label}
                    </div>
                )}
            />
        </Space>
    );
};

export default AddAttributePopoverContent;
