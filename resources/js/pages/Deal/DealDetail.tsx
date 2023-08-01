import {
    Card,
    Button,
    Dropdown,
    Space,
    Radio,
    Tooltip,
    MenuProps,
    Tabs,
    Menu,
    Row,
    Col,
    List,
    notification,
    Typography,
    Collapse,
    theme,
    Input,
    Divider,
} from "antd";
import type { CollapseProps } from "antd";
import type { CSSProperties } from "react";

import type { TabsProps } from "antd";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
    UserAddOutlined,
    PlusCircleOutlined,
    DownOutlined,
    InsertRowBelowOutlined,
    FilterOutlined,
    PhoneOutlined,
    MailOutlined,
    UserOutlined,
    HolderOutlined,
    CloseOutlined,
    PlusCircleFilled,
    PlusSquareOutlined,
    LikeOutlined,
    DislikeOutlined,
    CaretRightOutlined,
    CheckCircleOutlined,
    CalculatorOutlined,
    CalendarOutlined,
} from "@ant-design/icons";
import Search from "antd/es/input/Search";
import ModalAddDeal from "./components/ModalAddDeal";
import Filter from "./components/Filter";
import {
    DragDropContext,
    Draggable,
    Droppable,
    DropResult,
    DraggableLocation,
} from "react-beautiful-dnd";
import Board from "react-trello";
import { useDealsAll, useDealsByid } from "../../api/query/dealQuery";
import { useMutation, useQueryClient } from "react-query";
import {
    useDealMutation,
    useDealUpdateBoardMutation,
} from "../../api/mutation/useDealMutation";
import moment from "moment";
import DealsTable from "./components/DealsTable";

interface DealsById {
    title: string;
    win_probabilty: string;
    owner: string;
    estimated_close_date: string;
    value: string;
    currency: string;
    pipeline: string;
    source: string;
    stage: string;
    priority: string;
    status: string;
    details: string;
}

interface Props {
    match: any;
}

const DealDetail = () => {
    const { id } = useParams();
    function toCurrency(number: any) {
        return new Intl.NumberFormat("en-US", {
            style: "decimal",
            minimumFractionDigits: 2,
        }).format(number);
    }
    const { deals, isLoading, refetch } = useDealsByid(id ?? "");
    const { token } = theme.useToken();
    const getItems: (panelStyle: CSSProperties) => CollapseProps["items"] = (
        panelStyle
    ) => [
        {
            key: "1",
            label: "Deal Specific Email",
            children: <p>Deal-E18@clinkup.salesmate.io</p>,
            style: panelStyle,
        },
        {
            key: "2",
            label: "Contact",
            children: (
                <div>
                    <div style={{ display: "flex" }}>
                        <span className="thumb-name-xs " title="Jesse Ashley">
                            B
                        </span>
                        <span style={{ fontSize: 14, marginLeft: 10 }}>
                            {" "}
                            Bernard Sweeney
                        </span>
                    </div>
                    <div>Mobile: +18044326971</div>
                    <div>Phone: +18044326971</div>
                </div>
            ),
            style: panelStyle,
        },
        {
            key: "3",
            label: "Deal Details",
            children: (
                <div>
                    <div>Source</div>
                    <div>Priority</div>
                    <div>Description</div>
                </div>
            ),
            style: panelStyle,
        },
    ];
    const getItems2: (panelStyle: CSSProperties) => CollapseProps["items"] = (
        panelStyle
    ) => [
        {
            key: "1",
            label: "Smart Insights",
            children: (
                <div>
                    <div>
                        <b>Last Communication</b>{" "}
                        <span style={{ marginLeft: 5 }}>Text</span>
                    </div>
                    <div>
                        <b>Last Communication On</b>{" "}
                        <span style={{ marginLeft: 5 }}>10hours Ago</span>
                    </div>
                </div>
            ),
            style: panelStyle,
        },
        {
            key: "2",
            label: "Teamates",
            children: (
                <div>
                    <div style={{ display: "flex" }}>
                        <span className="thumb-name-xs " title="Jesse Ashley">
                            J
                        </span>
                        <span
                            style={{
                                fontSize: 14,
                                marginLeft: 10,
                                marginTop: 10,
                            }}
                        >
                            {" "}
                            Jesse Ashley
                        </span>
                    </div>
                    <div>
                        <Input placeholder="Search User" />
                    </div>
                </div>
            ),
            style: panelStyle,
        },
        {
            key: "3",
            label: "Participants",
            children: (
                <div>
                    <div>
                        <Input placeholder="Search Participants" />
                    </div>
                </div>
            ),
            style: panelStyle,
        },
    ];
    const action: MenuProps["items"] = [
        {
            key: "1",
            label: <div>Edit</div>,
        },
        {
            key: "2",
            label: <div>Clone</div>,
        },
        {
            key: "3",
            label: <div>Delete</div>,
        },
    ];
    const panelStyle = {
        marginBottom: 24,

        border: "none",
    };
    const itemstab: TabsProps["items"] = [
        {
            key: "1",
            label: `Email`,
            children: `No Content`,
        },
        {
            key: "2",
            label: `Note`,
            children: `No Content`,
        },
        {
            key: "3",
            label: `Add Activity`,
            children: `No Content`,
        },
        {
            key: "4",
            label: `Log Activity`,
            children: `No Content`,
        },
        {
            key: "5",
            label: `File`,
            children: `No Content`,
        },
    ];
    const itemstab2: TabsProps["items"] = [
        {
            key: "1",
            label: `All`,
            children: (
                <div>
                    <div>Upcoming (4)</div>
                    <Card style={{ marginTop: 20 }}>
                        <div style={{ display: "flex" }}>
                            <span
                                className="thumb-name-xs "
                                title="Jesse Ashley"
                            >
                                J
                            </span>
                            <span style={{ fontSize: 16, marginLeft: 10 }}>
                                {" "}
                                <b>Task</b> for Jesse Ashley
                            </span>
                        </div>
                        <Divider></Divider>
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <span>
                                <CheckCircleOutlined style={{ fontSize: 24 }} />
                            </span>
                            <span style={{ fontSize: 16, marginLeft: 10 }}>
                                {" "}
                                assign to ACQ manager (jesse777ashley)
                            </span>
                        </div>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                padding: 20,
                                paddingTop: 0,
                                paddingBottom: 0,
                                marginTop: 10,
                            }}
                        >
                            <span>
                                <CalendarOutlined style={{ fontSize: 14 }} />
                            </span>
                            <span style={{ fontSize: 14, marginLeft: 10 }}>
                                {" "}
                                Jul 27, 2023 01:58 PM
                            </span>
                        </div>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                padding: 20,
                                paddingTop: 0,
                                paddingBottom: 0,
                            }}
                        >
                            <span>
                                <UserOutlined style={{ fontSize: 14 }} />
                            </span>
                            <span style={{ fontSize: 14, marginLeft: 10 }}>
                                {" "}
                                Bernard Sweeney
                            </span>
                        </div>
                        <Divider></Divider>
                        <Input placeholder="Add your note for this activity"></Input>
                    </Card>
                    <Card style={{ marginTop: 20 }}>
                        <div style={{ display: "flex" }}>
                            <span
                                className="thumb-name-xs "
                                title="Jesse Ashley"
                            >
                                J
                            </span>
                            <span style={{ fontSize: 16, marginLeft: 10 }}>
                                {" "}
                                <b>Task</b> for Jesse Ashley
                            </span>
                        </div>
                        <Divider></Divider>
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <span>
                                <CheckCircleOutlined style={{ fontSize: 24 }} />
                            </span>
                            <span style={{ fontSize: 16, marginLeft: 10 }}>
                                {" "}
                                assign to ACQ manager (jesse777ashley)
                            </span>
                        </div>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                padding: 20,
                                paddingTop: 0,
                                paddingBottom: 0,
                                marginTop: 10,
                            }}
                        >
                            <span>
                                <CalendarOutlined style={{ fontSize: 14 }} />
                            </span>
                            <span style={{ fontSize: 14, marginLeft: 10 }}>
                                {" "}
                                Jul 27, 2023 01:58 PM
                            </span>
                        </div>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                padding: 20,
                                paddingTop: 0,
                                paddingBottom: 0,
                            }}
                        >
                            <span>
                                <UserOutlined style={{ fontSize: 14 }} />
                            </span>
                            <span style={{ fontSize: 14, marginLeft: 10 }}>
                                {" "}
                                Bernard Sweeney
                            </span>
                        </div>
                        <Divider></Divider>
                        <Input placeholder="Add your note for this activity"></Input>
                    </Card>
                </div>
            ),
        },
        {
            key: "2",
            label: `Activites`,
            children: `No Content`,
        },
        {
            key: "3",
            label: `Notes`,
            children: `No Content`,
        },
        {
            key: "4",
            label: `Emails`,
            children: `No Content`,
        },
        {
            key: "5",
            label: `File`,
            children: `No Content`,
        },
        {
            key: "6",
            label: `Texts`,
            children: `No Content`,
        },
        {
            key: "7",
            label: `Updates`,
            children: `No Content`,
        },
    ];
    return (
        <Row className="deal-group-row">
            <Col md={24}>
                <Card title="Deals">
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: 15,
                        }}
                    >
                        <div>
                            <Typography.Title level={3}>
                                {deals && deals.data.title}
                            </Typography.Title>
                        </div>

                        <div>
                            <span style={{ marginRight: 10 }}></span>
                            <span style={{ marginRight: 10 }}>
                                <Button type="primary">
                                    &nbsp; <LikeOutlined />
                                    Won
                                </Button>
                            </span>
                            <span style={{ marginRight: 10 }}>
                                <Button type="primary" danger>
                                    <DislikeOutlined /> &nbsp; Lost
                                </Button>
                            </span>
                            <span style={{ marginRight: 10 }}>
                                <Dropdown
                                    menu={{ items: action }}
                                    placement="bottomLeft"
                                >
                                    <Button>
                                        <Space>
                                            Action
                                            <DownOutlined />
                                        </Space>
                                    </Button>
                                </Dropdown>
                            </span>
                        </div>
                    </div>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: 15,
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                marginBottom: 15,
                            }}
                        >
                            <span style={{ marginRight: 15 }}>
                                <span>
                                    <div>Value</div>
                                    <div>
                                        {" "}
                                        {deals &&
                                            "$" + toCurrency(deals.data.value)}
                                    </div>
                                </span>
                            </span>
                            <span style={{ marginRight: 15 }}>
                                <span>
                                    <div>Pipleline</div>
                                    <div>{deals && deals.data.pipeline}</div>
                                </span>
                            </span>
                            <span style={{ marginRight: 15 }}>
                                <div>
                                    <div>Estimated Close Date</div>
                                    <div>
                                        <CalendarOutlined />{" "}
                                        {deals &&
                                            deals.data.estimated_close_date}
                                    </div>
                                </div>
                            </span>
                            <span style={{ marginRight: 15 }}>
                                <div>
                                    <div>Win Probability</div>
                                    <div>0</div>
                                </div>
                            </span>
                        </div>

                        <div></div>
                    </div>

                    <div style={{ marginTop: 30 }}>
                        <div className="breadcrumb">
                            <a
                                href="#"
                                className={
                                    deals &&
                                    deals.data.stage == "Comp & Qualify"
                                        ? "active"
                                        : "none"
                                }
                            >
                                <span className="breadcrumb__inner">
                                    <span className="breadcrumb__title">
                                        Comp & Qualify
                                    </span>
                                </span>
                            </a>
                            <a
                                href="#"
                                className={
                                    deals &&
                                    deals.data.stage == "First Offer Given"
                                        ? "active"
                                        : "none"
                                }
                            >
                                <span className="breadcrumb__inner">
                                    <span className="breadcrumb__title">
                                        First Offer Given
                                    </span>
                                </span>
                            </a>
                            <a
                                href="#"
                                className={
                                    deals &&
                                    deals.data.stage == "In Negotiation"
                                        ? "active"
                                        : "none"
                                }
                            >
                                <span className="breadcrumb__inner">
                                    <span className="breadcrumb__title">
                                        In Negotiation
                                    </span>
                                </span>
                            </a>
                            <a
                                href="#"
                                className={
                                    deals &&
                                    deals.data.stage == "Verbal Offer Accepted"
                                        ? "active"
                                        : "none"
                                }
                            >
                                <span className="breadcrumb__inner">
                                    <span className="breadcrumb__title">
                                        Verbal Offer Accepted
                                    </span>
                                </span>
                            </a>
                            <a
                                href="#"
                                className={
                                    deals &&
                                    deals.data.stage == "Under Contract"
                                        ? "active"
                                        : "none"
                                }
                            >
                                <span className="breadcrumb__inner">
                                    <span className="breadcrumb__title">
                                        Under Contract
                                    </span>
                                </span>
                            </a>
                        </div>
                    </div>
                    <div style={{ marginTop: 30 }}>
                        <Row gutter={24}>
                            <Col md={6}>
                                <div className="card-left-deal-details ">
                                    <Collapse
                                        bordered={false}
                                        defaultActiveKey={["1", "2", "3"]}
                                        expandIcon={({ isActive }) => (
                                            <CaretRightOutlined
                                                rotate={isActive ? 90 : 0}
                                            />
                                        )}
                                        items={getItems(panelStyle)}
                                    />
                                </div>
                            </Col>
                            <Col md={12}>
                                <Card
                                    bodyStyle={{
                                        padding: 10,
                                        paddingTop: 0,
                                    }}
                                >
                                    <Tabs
                                        defaultActiveKey="1"
                                        items={itemstab}
                                        // onChange={onChange}
                                    />
                                </Card>

                                <div style={{ marginTop: 20 }}>
                                    <Tabs
                                        style={{ padding: 10 }}
                                        defaultActiveKey="1"
                                        items={itemstab2}
                                        // onChange={onChange}
                                    />
                                </div>
                            </Col>
                            <Col md={6}>
                                <div className="card-left-deal-details ">
                                    <Collapse
                                        bordered={false}
                                        defaultActiveKey={["1", "2", "3"]}
                                        expandIcon={({ isActive }) => (
                                            <CaretRightOutlined
                                                rotate={isActive ? 90 : 0}
                                            />
                                        )}
                                        items={getItems2(panelStyle)}
                                    />
                                </div>
                            </Col>
                        </Row>
                    </div>
                </Card>
            </Col>
        </Row>
    );
};

export default DealDetail;
