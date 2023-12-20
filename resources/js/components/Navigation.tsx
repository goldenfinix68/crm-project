import React, { useEffect, useState } from "react";
import {
    Avatar,
    Button,
    Card,
    Col,
    Dropdown,
    Image,
    Input,
    Menu,
    Row,
    Space,
    Typography,
} from "antd";
import type { MenuProps } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle, faPlus, faSearch } from "@fortawesome/free-solid-svg-icons";

import { Link, useNavigate } from "react-router-dom";
import {
    LoadingOutlined,
    PoweroffOutlined,
    SettingOutlined,
} from "@ant-design/icons";
import NavigationComponentsQuickAdd from "./NavigationComponents/NavigationComponentsQuickAdd";
import NavigationComponentsCall from "./NavigationComponents/NavigationComponentsCall";
import { useAppContextProvider } from "../context/AppContext";
import CustomLink from "./CustomLink";

type NavigationProps = {
    title?: string; // Add this line to include the 'title' prop
};
const Navigation: React.FC<NavigationProps> = ({ title }) => {
    const navigate = useNavigate();
    const [searchKeyword, setSearchKey] = useState("");
    const { loggedInUser } = useAppContextProvider();

    const { contacts, isRoleStats } = useAppContextProvider();

    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const handleSignOut = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("userdata");
        location.href = window.location.origin;
    };
    const profile: MenuProps["items"] = [
        {
            key: "1",
            label: (
                <Card
                    bordered={false}
                    className="card-dropdown"
                    title={
                        <>
                            <Space>
                                <Image
                                    src={
                                        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                                    }
                                    style={{
                                        height: 45,
                                        width: 45,
                                        borderRadius: 100,
                                    }}
                                    preview={false}
                                />

                                <Space
                                    direction="vertical"
                                    size={0}
                                    className="card-dropdown-space"
                                >
                                    <Typography.Text>
                                        {loggedInUser?.lastName +
                                            ", " +
                                            loggedInUser?.firstName}
                                    </Typography.Text>
                                    <Typography.Link
                                        style={{
                                            fontWeight: 300,
                                            fontSize: 12,
                                        }}
                                    >
                                        Go to my account
                                    </Typography.Link>
                                </Space>
                            </Space>
                        </>
                    }
                >
                    <Menu className="dropdowmn-menu">
                        <Menu.Item
                            onClick={() => {
                                setDropdownVisible(false);
                            }}
                            disabled={isRoleStats}
                        >
                            <CustomLink to="/setup">
                                <Space>
                                    <Button shape="circle">
                                        <SettingOutlined />
                                    </Button>
                                    Setup
                                </Space>
                            </CustomLink>
                        </Menu.Item>
                        <Menu.Item
                            onClick={() => {
                                handleSignOut();
                            }}
                        >
                            <Space>
                                <Button shape="circle">
                                    <PoweroffOutlined />
                                </Button>
                                Sign out
                            </Space>
                        </Menu.Item>
                    </Menu>
                </Card>
            ),
        },
        // {
        //     key: "2",
        //     label: <div>Clone</div>,
        // },
    ];
    return (
        <Space
            className="w-100"
            direction="horizontal"
            style={{
                alignItems: "center",
                justifyContent: "space-between",
            }}
        >
            {/* Page title on the left */}
            <Typography.Text strong>{title}</Typography.Text>

            {/* Components on the right */}
            <Space wrap className="header-btn m-l-sm" size={20}>
                <Dropdown
                    placement="bottomRight"
                    arrow
                    overlayClassName="header-search-bar"
                    trigger={["click"]}
                    overlay={
                        <Menu>
                            {contacts
                                ?.filter(
                                    (contact) =>
                                        contact.fields?.firstName
                                            ?.toLowerCase()
                                            .includes(
                                                searchKeyword.toLowerCase()
                                            ) ||
                                        contact.fields?.lastName
                                            ?.toLowerCase()
                                            .includes(
                                                searchKeyword.toLowerCase()
                                            ) ||
                                        contact.phoneNumbers?.includes(
                                            searchKeyword.toLowerCase()
                                        )
                                )
                                ?.map((contact) => (
                                    <Menu.Item key={contact.id}>
                                        <CustomLink
                                            to={`/contacts/${contact.id}`}
                                        >
                                            <div className="list-data">
                                                <Space
                                                    direction="vertical"
                                                    size={0}
                                                    className="m-l-xs"
                                                >
                                                    <Typography.Text>
                                                        {`${contact.fields?.firstName} ${contact.fields?.lastName}`}
                                                    </Typography.Text>
                                                    <Typography.Text className="list-data-info">
                                                        <Typography.Text
                                                            className="list-data-info"
                                                            style={{
                                                                fontWeight: 300,
                                                            }}
                                                        >
                                                            {`Phone numbers: ${
                                                                contact
                                                                    .phoneNumbers
                                                                    ?.length
                                                                    ? contact.phoneNumbers?.join(
                                                                          ", "
                                                                      )
                                                                    : "Not set"
                                                            }`}
                                                        </Typography.Text>
                                                    </Typography.Text>
                                                </Space>
                                            </div>
                                        </CustomLink>
                                    </Menu.Item>
                                ))}
                        </Menu>
                    }
                >
                    <Input
                        placeholder="Search"
                        prefix={<FontAwesomeIcon icon={faSearch} />}
                        onChange={(e) => setSearchKey(e.target.value)}
                        size="large"
                        style={{ width: "400px" }}
                    />
                </Dropdown>

                <NavigationComponentsQuickAdd />
                <NavigationComponentsCall />

                <Dropdown
                    open={isDropdownVisible}
                    onOpenChange={setDropdownVisible}
                    menu={{ items: profile }}
                    placement="bottomLeft"
                    trigger={["click"]}
                    overlayClassName="profile-dropdown"
                >
                    <Image
                        src={
                            "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                        }
                        style={{
                            height: 50,
                            width: 50,
                            borderRadius: 100,
                        }}
                        preview={false}
                    />
                </Dropdown>
            </Space>
        </Space>
    );
};

export default Navigation;
