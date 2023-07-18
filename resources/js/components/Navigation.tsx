import React, { useEffect, useState } from "react";
import { Col, Dropdown, Input, Row, Space, Typography } from "antd";
import type { MenuProps } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle, faSearch } from "@fortawesome/free-solid-svg-icons";

import { Link } from "react-router-dom";
import { LoadingOutlined } from "@ant-design/icons";

const items: MenuProps["items"] = [
    {
        key: "1",
        label: (
            <div className="list-data">
                <img src="https://files.salesmate.io/clinkup.salesmate.io/profilepic/9bfff1ff-8021-4f0b-a1c1-2c614882ac6b.jpg" />
                <Space direction="vertical" size={0} className="m-l-xs">
                    <Typography.Text>AL Sedevic Rome Twp Zonin</Typography.Text>
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

// const items: MenuProps["items"] = [
//     {
//         key: "1",
//         label: (
//             <>
//                 <LoadingOutlined />
//             </>
//         ),
//     },
// ];

const Navigation: React.FC = () => {
    const [searchLoading, setSearchLoading] = useState(true);
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setSearchLoading(false);
        }, 1500);
        return () => {
            clearTimeout(timeoutId);
        };
    }, []);

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
                                />
                            </Dropdown>
                        </Col>
                        <Col span={10}></Col>
                    </Row>
                </Col>
            </Row>
        </>
    );
};

export default Navigation;
