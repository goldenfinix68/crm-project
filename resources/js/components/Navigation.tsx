import React, { useEffect, useState } from "react";
import {
    Button,
    Col,
    Dropdown,
    Image,
    Input,
    Row,
    Space,
    Typography,
} from "antd";
import type { MenuProps } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle, faPlus, faSearch } from "@fortawesome/free-solid-svg-icons";

import { Link } from "react-router-dom";
import { LoadingOutlined } from "@ant-design/icons";
import NavigationComponentsQuickAdd from "./NavigationComponents/NavigationComponentsQuickAdd";
import NavigationComponentsCall from "./NavigationComponents/NavigationComponentsCall";

const Navigation: React.FC = () => {
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

    return (
        <>
            <Row gutter={12}>
                <Col span={12}>{/* Left Side  */}</Col>
                <Col span={12}>
                    {/* Right Side  */}
                    <Row gutter={12} justify={"end"}>
                        <Col span={10}>
                            <Dropdown
                                menu={{ items }}
                                placement="bottomRight"
                                arrow
                                overlayClassName="header-search-bar"
                                trigger={["click"]}
                            >
                                <Input
                                    placeholder="Search"
                                    prefix={<FontAwesomeIcon icon={faSearch} />}
                                    onClick={() => {
                                        setSearchLoading(true);
                                    }}
                                />
                            </Dropdown>
                        </Col>
                        <Col span={4}>
                            <Space
                                wrap
                                className="w-100 header-btn m-l-sm"
                                size={20}
                            >
                                <NavigationComponentsQuickAdd />

                                <NavigationComponentsCall />

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
                            </Space>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </>
    );
};

export default Navigation;
