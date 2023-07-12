import React, { useState } from "react";
import { CaretDownFilled } from "@ant-design/icons";
import { Button, Col, Dropdown, Row, Space } from "antd";
import { faFilter, faHome } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DashboardModalDateRange from "../Modals/DashboardModalDateRange";

export default function DashboardComponentFilters() {
    const [modateDateRange, setModateDateRange] = useState(false);

    const handleClick = (val: string) => {
        if (val === "date") {
            setModateDateRange(true);
        }
    };
    return (
        <>
            <Row gutter={24} className="m-t-md">
                <Col xs={24} sm={24} md={24}>
                    <Space wrap>
                        <Button type="link" className="black" size="small">
                            <FontAwesomeIcon
                                icon={faFilter}
                                className="m-r-xs"
                            />{" "}
                            Filter
                        </Button>

                        <Button
                            size="small"
                            onClick={() => {
                                handleClick("date");
                            }}
                        >
                            Date Range
                        </Button>
                        <Button
                            size="small"
                            onClick={() => {
                                handleClick("user");
                            }}
                        >
                            Users
                        </Button>
                        <Button
                            size="small"
                            onClick={() => {
                                handleClick("deal");
                            }}
                        >
                            Deal Pipeline
                        </Button>
                    </Space>
                </Col>
            </Row>

            <DashboardModalDateRange
                modateDateRange={modateDateRange}
                setModateDateRange={setModateDateRange}
            />
        </>
    );
}
