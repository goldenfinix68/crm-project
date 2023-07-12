import { CaretDownFilled } from "@ant-design/icons";
import { Button, Col, Dropdown, Row, Space } from "antd";
import React from "react";
import { faFilter, faHome } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function DashboardComponentFilters() {
    return (
        <>
            <Row gutter={24} className="m-t-sm">
                <Col xs={24} sm={24} md={24}>
                    <Space wrap>
                        <Button type="link">
                            <FontAwesomeIcon icon={faFilter} />
                        </Button>
                    </Space>
                </Col>
            </Row>
        </>
    );
}
