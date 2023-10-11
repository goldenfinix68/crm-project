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
import {
    ACTIVITY_COLUMNS,
    CONTACT_COLUMNS,
    DEAL_COLUMNS,
    DEFAULT_REQUIRED_MESSAGE,
} from "../../../constants";
import { TTextTemplateFolder } from "../../../entities";
import { createTextTemplateFolderMutation } from "../../../api/mutation/useTextTemplateMutation";
import Search from "antd/es/input/Search";
interface Props {
    handleSelect: (e) => void;
}
const AddAttributePopoverContent = ({ handleSelect }: Props) => {
    const [menu, setMenu] = useState("contact");
    const [searchKey, setSearchKey] = useState("");

    // const list = menu == "contact" ? CONTACT_COLUMNS : [];

    const list = () => {
        let data: any = [];
        if (menu == "contact") {
            data = CONTACT_COLUMNS;
        }
        if (menu == "deal") {
            data = DEAL_COLUMNS;
        }
        if (menu == "activity") {
            data = ACTIVITY_COLUMNS;
        }

        if (searchKey) {
            data = data?.filter((item) =>
                item.label.toLowerCase().includes(searchKey.toLowerCase())
            );
        }

        return data;
    };

    return (
        <Space direction="vertical" size={"large"}>
            <Radio.Group value={menu} onChange={(e) => setMenu(e.target.value)}>
                <Radio.Button value="contact">Contact</Radio.Button>
                <Radio.Button value="activity">Activity</Radio.Button>
                <Radio.Button value="deal">Deal</Radio.Button>
                {/* <Radio.Button disabled value="owner">
                    Owner
                </Radio.Button> */}
            </Radio.Group>

            <Search
                placeholder="Search"
                onChange={(e) => setSearchKey(e.target.value)}
            />

            <List
                dataSource={list()}
                style={{ maxHeight: "200px", overflowY: "auto" }}
                renderItem={(item: any) => (
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
                            handleSelect(item);
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
