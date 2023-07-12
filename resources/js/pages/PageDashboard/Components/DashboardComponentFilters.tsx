import { CaretDownFilled } from "@ant-design/icons";
import { Button, Col, Dropdown, Row, Space } from "antd";
import React from "react";

export default function DashboardComponentFilters() {
    return (
        <>
            <Row gutter={24} className="m-t-lg">
                <Col xs={24} sm={24} md={24}>
                    <Button type="link" className="dashboard-filter">
                        Default Dashbaord <CaretDownFilled />
                    </Button>
                </Col>
            </Row>
        </>
    );
}
