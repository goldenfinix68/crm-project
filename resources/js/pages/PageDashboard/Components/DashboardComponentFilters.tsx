import React, { useState } from "react";
import { CaretDownFilled } from "@ant-design/icons";
import { Button, Col, Dropdown, Row, Space } from "antd";
import { faFilter, faHome } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DashboardModalDateRange from "../Modals/DashboardModalDateRange";
import DashboardModalUsers from "../Modals/DashboardModalUsers";
import DashboardModalDeal from "../Modals/DashboardModalDeal";

const DashboardComponentFilters: React.FC = () => {
    const [modalteDateRange, setModalteDateRange] = useState(false);
    const [modalteUser, setModalteUser] = useState(false);
    const [modalteDeal, setModalteDeal] = useState(false);

    const handleClick = (val: string) => {
        if (val === "date") {
            setModalteDateRange(true);
        } else if (val === "user") {
            setModalteUser(true);
        } else if (val === "deal") {
            setModalteDeal(true);
        }
    };

    return (
        <>
            <Row gutter={24} className="m-t-md">
                <Col xs={24} sm={24} md={24}>
                    <Space wrap>
                        <Button
                            type="link"
                            className="black p-l-none"
                            size="small"
                        >
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
                modalteDateRange={modalteDateRange}
                setModalteDateRange={setModalteDateRange}
            />

            <DashboardModalUsers
                modalteUser={modalteUser}
                setModalteUser={setModalteUser}
            />

            <DashboardModalDeal
                modalteDeal={modalteDeal}
                setModalteDeal={setModalteDeal}
            />
        </>
    );
};

export default DashboardComponentFilters;
