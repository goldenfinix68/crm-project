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
    Tooltip,
    Typography,
} from "antd";
import type { MenuProps } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle, faPlus, faSearch } from "@fortawesome/free-solid-svg-icons";

import { Link, useNavigate } from "react-router-dom";
import {
    DollarCircleOutlined,
    HomeOutlined,
    LoadingOutlined,
    MobileOutlined,
    PoweroffOutlined,
    SettingOutlined,
    UsergroupAddOutlined,
} from "@ant-design/icons";
import NavigationComponentsQuickAdd from "./NavigationComponents/NavigationComponentsQuickAdd";
import NavigationComponentsCall from "./NavigationComponents/NavigationComponentsCall";
import { useAppContextProvider } from "../context/AppContext";
import CustomLink from "./CustomLink";
import { defaultFilter } from "../constants";
import { ENDPOINTS } from "../endpoints";
import { mutateGet } from "../api/mutation/useSetupMutation";
import _ from "lodash";

type NavigationProps = {
    title?: string; // Add this line to include the 'title' prop
};
const Navigation: React.FC<NavigationProps> = ({ title }) => {
    const { loggedInUser } = useAppContextProvider();

    const { isRoleStats } = useAppContextProvider();

    const [pagination, setPagination] = useState({
        page_size: 10,
        page: 1,
        total: 0,
    });
    const [contacts, setContacts] = useState<any>();

    const [filter, setFilter] = useState<any>(defaultFilter);

    const { data: filteredContacts, refetch: refetchFilteredContacts } =
        mutateGet(
            { ...filter, ...pagination },
            ENDPOINTS.contacts.url,
            "globalSearch"
        );

    const debouncedSearch = _.debounce((value) => {
        handleSearch(value);
    }, 300);

    const handleSearch = (value) => {
        setFilter({
            ...filter,
            filters: {
                conditions: [
                    { key: "firstName", condition: "contains", value: value },
                    { key: "lastName", condition: "contains", value: value },
                ],
                conditionalOperator: "or",
            },
        });
    };

    useEffect(() => {
        refetchFilteredContacts();
    }, [filter]);

    useEffect(() => {
        if (filteredContacts && filteredContacts.data) {
            setContacts(filteredContacts.data.data);
        }
    }, [filteredContacts]);

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
            <Menu
                theme="light"
                mode="horizontal"
                defaultSelectedKeys={["1"]}
                items={[
                    {
                        key: "/dashboard",
                        label: (
                            <CustomLink
                                to="/dashboard"
                                tooltipTitle="Dashboard"
                            >
                                <HomeOutlined />
                            </CustomLink>
                        ),
                    },
                    {
                        key: "/contacts",
                        icon: (
                            <CustomLink to="/contacts" tooltipTitle="Contacts">
                                <UsergroupAddOutlined />
                            </CustomLink>
                        ),
                    },
                    {
                        key: "/deals",
                        icon: (
                            <CustomLink to="/deals" tooltipTitle="Deals">
                                <DollarCircleOutlined />
                            </CustomLink>
                        ),
                    },
                    {
                        key: "/text-threads",
                        icon: (
                            <CustomLink to="/text-threads" tooltipTitle="Texts">
                                <MobileOutlined />
                            </CustomLink>
                        ),
                    },
                ]}
            />

            {/* Components on the right */}
            <Space wrap className="header-btn m-l-sm" size={20}>
                <Dropdown
                    placement="bottomRight"
                    arrow
                    overlayClassName="header-search-bar"
                    trigger={["click"]}
                    overlay={
                        <Menu>
                            {contacts?.map((contact) => (
                                <Menu.Item key={contact.id}>
                                    <CustomLink to={`/contacts/${contact.id}`}>
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
                                                            contact.phoneNumbers
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
                        onChange={(e) => debouncedSearch(e.target.value)}
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
