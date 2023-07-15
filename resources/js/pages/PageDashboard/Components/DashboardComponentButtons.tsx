import { CaretDownFilled } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Button, Col, Dropdown, Row, Space } from "antd";
import React from "react";

const items: MenuProps["items"] = [
    {
        key: "1",
        label: (
            <a rel="noopener noreferrer" href="#">
                Clone Dashboard
            </a>
        ),
    },
    {
        key: "2",
        label: (
            <a rel="noopener noreferrer" href="#">
                Edit Dashboard
            </a>
        ),
    },
    {
        key: "3",
        label: (
            <a rel="noopener noreferrer" href="#">
                Delete Dashboard
            </a>
        ),
        disabled: true,
    },
    {
        key: "4",
        label: (
            <a rel="noopener noreferrer" href="#">
                Email this Dashboard
            </a>
        ),
    },
    {
        key: "5",
        label: (
            <a rel="noopener noreferrer" href="#">
                Manage your recurring emails
            </a>
        ),
    },
    {
        key: "6",
        label: (
            <a rel="noopener noreferrer" href="#">
                Manage Dashboards
            </a>
        ),
    },
];

const DashboardComponentButtons: React.FC = () => {
    return (
        <>
            <Row gutter={24}>
                <Col xs={12} sm={12} md={12}>
                    <Button type="link" className="dashboard-filter p-l-none">
                        Default Dashbaord <CaretDownFilled />
                    </Button>
                </Col>
                <Col
                    xs={12}
                    sm={12}
                    md={12}
                    className="dashboard-right-buttons"
                >
                    <Space wrap>
                        <Button type="primary">Create Dashboard</Button>
                        <Button>Add Widget</Button>
                        <Dropdown
                            menu={{ items }}
                            className="dashboard-actions"
                            trigger={["click"]}
                        >
                            <Button>
                                Actions <CaretDownFilled />
                            </Button>
                        </Dropdown>
                    </Space>
                </Col>
            </Row>
        </>
    );
};

export default DashboardComponentButtons;
