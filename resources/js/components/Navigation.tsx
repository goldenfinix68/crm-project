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

const Navigation: React.FC = () => {
    const navigate = useNavigate();
    const [searchKeyword, setSearchKey] = useState("");

    const { contacts } = useAppContextProvider();

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
                                    <Typography.Text>Full Name</Typography.Text>
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
                                navigate("/setup");
                            }}
                        >
                            <Space>
                                <Button shape="circle">
                                    <SettingOutlined />
                                </Button>
                                Setup
                            </Space>
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
        <>
            <Row gutter={12}>
                <Col span={12}>{/* Left Side  */}</Col>
                <Col span={12}>
                    {/* Right Side  */}
                    <Row gutter={12} justify={"end"}>
                        <Col md={24} lg={24} xl={24} xxl={24}>
                            <Space
                                wrap
                                className="w-100 header-btn m-l-sm"
                                size={20}
                            >
                                <Dropdown
                                    // menu={{ items }}
                                    placement="bottomRight"
                                    arrow
                                    overlayClassName="header-search-bar"
                                    trigger={["click"]}
                                    overlay={
                                        <Menu
                                            onClick={(e) => {
                                                navigate("/contacts/" + e.key);
                                            }}
                                        >
                                            {contacts
                                                ?.filter(
                                                    (contact) =>
                                                        contact.firstName
                                                            .toLowerCase()
                                                            .includes(
                                                                searchKeyword.toLowerCase()
                                                            ) ||
                                                        contact.lastName
                                                            .toLowerCase()
                                                            .includes(
                                                                searchKeyword.toLowerCase()
                                                            ) ||
                                                        (contact.mobile &&
                                                            contact.mobile
                                                                .toLowerCase()
                                                                .includes(
                                                                    searchKeyword.toLowerCase()
                                                                )) ||
                                                        (contact.phone &&
                                                            contact.phone
                                                                .toLowerCase()
                                                                .includes(
                                                                    searchKeyword.toLowerCase()
                                                                ))
                                                )
                                                ?.map((contact) => (
                                                    <Menu.Item key={contact.id}>
                                                        <div className="list-data">
                                                            <Avatar
                                                                className="avatarText m-r-sm"
                                                                // src={record.avatar}
                                                                size={32}
                                                                style={{
                                                                    backgroundColor:
                                                                        "#1677FF",
                                                                    verticalAlign:
                                                                        "middle",
                                                                }}
                                                            >
                                                                {contact.firstName.charAt(
                                                                    0
                                                                )}
                                                            </Avatar>
                                                            {/* <img src="https://files.salesmate.io/clinkup.salesmate.io/profilepic/9bfff1ff-8021-4f0b-a1c1-2c614882ac6b.jpg" /> */}
                                                            <Space
                                                                direction="vertical"
                                                                size={0}
                                                                className="m-l-xs"
                                                            >
                                                                <Typography.Text>
                                                                    {`${contact.firstName} ${contact.lastName}`}
                                                                </Typography.Text>
                                                                <Typography.Text className="list-data-info">
                                                                    <Space
                                                                        split={
                                                                            <FontAwesomeIcon
                                                                                icon={
                                                                                    faCircle
                                                                                }
                                                                                style={{
                                                                                    fontSize: 4,
                                                                                    verticalAlign: 3,
                                                                                }}
                                                                            />
                                                                        }
                                                                    >
                                                                        <Typography.Text
                                                                            className="list-data-info"
                                                                            style={{
                                                                                fontWeight: 300,
                                                                            }}
                                                                        >
                                                                            {`Mobile: ${
                                                                                contact.mobile ??
                                                                                "Not set"
                                                                            }`}
                                                                        </Typography.Text>
                                                                        <Typography.Text
                                                                            className="list-data-info"
                                                                            style={{
                                                                                fontWeight: 300,
                                                                            }}
                                                                        >
                                                                            {`Phone: ${
                                                                                contact.phone ??
                                                                                "Not set"
                                                                            }`}
                                                                        </Typography.Text>
                                                                    </Space>
                                                                </Typography.Text>
                                                            </Space>
                                                        </div>
                                                    </Menu.Item>
                                                ))}
                                        </Menu>
                                    }
                                >
                                    <Input
                                        placeholder="Search"
                                        prefix={
                                            <FontAwesomeIcon icon={faSearch} />
                                        }
                                        onChange={(e) =>
                                            setSearchKey(e.target.value)
                                        }
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
                        </Col>
                    </Row>
                </Col>
            </Row>
        </>
    );
};

export default Navigation;
