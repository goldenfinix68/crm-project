import React, { useEffect, useState } from "react";
import {
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

const Navigation: React.FC = () => {
    const navigate = useNavigate();
    const [searchLoading, setSearchLoading] = useState(false);
    useEffect(() => {
        if (searchLoading) {
            const timeoutId = setTimeout(() => {
                setSearchLoading(false);
            }, 1000);

            return () => {
                clearTimeout(timeoutId);
            };
        }
    }, [searchLoading]);

    const items: MenuProps["items"] = searchLoading
        ? [
              // loading
              {
                  key: "1",
                  label: (
                      <div className="list-data">
                          <div
                              style={{
                                  height: 44,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                              }}
                              className="w-100"
                          >
                              <LoadingOutlined style={{ fontSize: 28 }} />
                          </div>
                      </div>
                  ),
              },
          ]
        : [
              // main data
              {
                  key: "1",
                  label: (
                      <div className="list-data">
                          <img src="https://files.salesmate.io/clinkup.salesmate.io/profilepic/9bfff1ff-8021-4f0b-a1c1-2c614882ac6b.jpg" />
                          <Space
                              direction="vertical"
                              size={0}
                              className="m-l-xs"
                          >
                              <Typography.Text>
                                  AL Sedevic Rome Twp Zonin
                              </Typography.Text>
                              <Typography.Text className="list-data-info">
                                  <Space
                                      split={
                                          <FontAwesomeIcon
                                              icon={faCircle}
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
                                          Mobile: +14405633236
                                      </Typography.Text>
                                      <Typography.Text
                                          className="list-data-info"
                                          style={{
                                              fontWeight: 300,
                                          }}
                                      >
                                          Phone: (440) 487-8277
                                      </Typography.Text>
                                  </Space>
                              </Typography.Text>
                          </Space>
                      </div>
                  ),
              },
          ];

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
                                    menu={{ items }}
                                    placement="bottomRight"
                                    arrow
                                    overlayClassName="header-search-bar"
                                    trigger={["click"]}
                                >
                                    <Input
                                        placeholder="Search"
                                        prefix={
                                            <FontAwesomeIcon icon={faSearch} />
                                        }
                                        onClick={() => {
                                            setSearchLoading(true);
                                        }}
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
