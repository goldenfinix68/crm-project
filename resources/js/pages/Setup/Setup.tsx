import React, { useEffect } from "react";
import { Button, Col, Divider, Row, Space, Typography } from "antd";
import {
    DollarCircleOutlined,
    PhoneOutlined,
    UserOutlined,
    DatabaseOutlined,
    UsergroupAddOutlined,
    PicCenterOutlined,
    UploadOutlined,
    CommentOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAppContextProvider } from "../../context/AppContext";
import { allowedroleToAccess } from "../../constants";
import CustomLink from "../../components/CustomLink";

const Setup: React.FC = (props) => {
    useEffect(() => {
        document.title = "Setup - SpeedLead";
        return () => {};
    }, []);

    const { loggedInUser } = useAppContextProvider();
    const customizationButtons: any = [
        {
            icon: <UsergroupAddOutlined />,
            title: "Contact",
            link: "/setup/customizations/contact",
        },
        {
            icon: <DollarCircleOutlined />,
            title: "Deal Pipeline",
            link: "/setup/customizations/deal-pipeline",
        },
    ];

    const usersAndSecurityButtons: any = [
        {
            icon: <UserOutlined />,
            title: "Users",
            link: "/setup/customizations/users",
        },
        {
            icon: <PhoneOutlined />,
            title: "Call Forwarding",
            link: "/setup/customizations/call-forwarding",
        },
    ];

    const dataAdministration: any = [
        {
            icon: <DatabaseOutlined />,
            title: "Import Data from Excel or CSV",
            link: "/setup/data-administration/import-file",
        },
        {
            icon: <DatabaseOutlined />,
            title: "Import Data from Google Sheet",
            link: "/setup/data-administration/import-file-gsheet",
        },
        {
            icon: <PicCenterOutlined />,
            title: "Roor Data Mapping",
            link: "/setup/data-administration/roor-data-mapping",
        },
        {
            icon: <UploadOutlined />,
            title: "Manual Audio Import",
            link: "/setup/data-administration/openphone-audio-import",
        },
        {
            icon: <CommentOutlined />,
            title: "Stop Word List",
            link: "/setup/data-administration/stop-word-list",
        },
    ];

    return (
        <>
            <Divider
                orientation="left"
                orientationMargin="0"
                style={{ fontSize: 20 }}
            >
                Customizations
            </Divider>
            <Row gutter={[12, 20]}>
                {customizationButtons.map((item: any, key: React.Key) => {
                    return (
                        <Col xs={6} sm={6} md={4} key={key}>
                            <CustomLink to={item.link}>
                                <Space
                                    direction="vertical"
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                >
                                    <Button
                                        className="button-link"
                                        shape="circle"
                                        size="large"
                                        icon={item.icon}
                                        style={{
                                            height: 80,
                                            width: 80,
                                        }}
                                    />

                                    <Typography.Text style={{ fontSize: 16 }}>
                                        {item.title}
                                    </Typography.Text>
                                </Space>
                            </CustomLink>
                        </Col>
                    );
                })}
            </Row>

            <br />
            <br />
            <Divider
                orientation="left"
                orientationMargin="0"
                style={{ fontSize: 20 }}
            >
                Data Administration
            </Divider>
            <Row gutter={[12, 20]}>
                {dataAdministration.map((item: any, key: React.Key) => {
                    return (
                        <Col xs={6} sm={6} md={4} key={key}>
                            <CustomLink to={item.link}>
                                <Space
                                    direction="vertical"
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                >
                                    <Button
                                        className="button-link"
                                        shape="circle"
                                        size="large"
                                        icon={item.icon}
                                        style={{
                                            height: 80,
                                            width: 80,
                                        }}
                                    />

                                    <Typography.Text style={{ fontSize: 16 }}>
                                        <center>{item.title}</center>
                                    </Typography.Text>
                                </Space>
                            </CustomLink>
                        </Col>
                    );
                })}
            </Row>

            {allowedroleToAccess.includes(loggedInUser?.role ?? "") && (
                <>
                    <br />
                    <br />
                    <Divider
                        orientation="left"
                        orientationMargin="0"
                        style={{ fontSize: 20 }}
                    >
                        Users & Security
                    </Divider>
                    <Row gutter={[12, 20]}>
                        {usersAndSecurityButtons.map(
                            (item: any, key: React.Key) => {
                                return (
                                    <Col xs={6} sm={6} md={4} key={key}>
                                        <CustomLink to={item.link}>
                                            <Space
                                                direction="vertical"
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                }}
                                            >
                                                <Button
                                                    className="button-link"
                                                    shape="circle"
                                                    size="large"
                                                    icon={item.icon}
                                                    style={{
                                                        height: 80,
                                                        width: 80,
                                                    }}
                                                />

                                                <Typography.Text
                                                    style={{ fontSize: 16 }}
                                                >
                                                    {item.title}
                                                </Typography.Text>
                                            </Space>
                                        </CustomLink>
                                    </Col>
                                );
                            }
                        )}
                    </Row>
                </>
            )}
        </>
    );
};

export default Setup;
