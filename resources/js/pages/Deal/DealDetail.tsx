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
} from "antd";
import type { CollapseProps } from "antd";
import type { CSSProperties } from "react";

import type { TabsProps } from "antd";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
import { useDealsAll } from "../../api/query/dealQuery";
import { useMutation, useQueryClient } from "react-query";
import {
    useDealMutation,
    useDealUpdateBoardMutation,
} from "../../api/mutation/useDealMutation";
import moment from "moment";
import DealsTable from "./components/DealsTable";

interface Card {
    id: number;
    title: React.ReactNode;
    laneId: any;
}

interface Lane {
    id: string;
    title: React.ReactNode;
    label: string;
    style: {
        width: number;
    };
    cards: Card[];
}

interface TDeals {
    title: string;
    name: string;
    value: string;
    stage: string;
    status: string;
    owner: string;
}
interface Bytotal {
    comp_qualify: number;
    first_given: number;
    in_negoation: number;
    verbal_offer_accepted: number;
    under_contract: number;
}

const DealDetail = () => {
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
                    <div>Bernard Sweeney</div>
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
                    <div>Jesse Ashley</div>
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
                                0.95acres-Ashtabula City-smaller lots closer to{" "}
                                the water and near <br></br>a decent sized town
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
                            <span style={{ marginRight: 10 }}>
                                <span>
                                    <div>Value</div>
                                    <div>$0</div>
                                </span>
                            </span>
                            <span style={{ marginRight: 10 }}>
                                <span>
                                    <div>Pipleline</div>
                                    <div>ACQ</div>
                                </span>
                            </span>
                            <span style={{ marginRight: 10 }}>
                                <div>
                                    <div>Esitmated</div>
                                </div>
                            </span>
                            <span style={{ marginRight: 10 }}>
                                <div>
                                    <div>Win Probability</div>
                                </div>
                            </span>
                        </div>

                        <div></div>
                    </div>

                    <div style={{ marginTop: 20 }}>
                        <div className="breadcrumb">
                            <a href="#">
                                <span className="breadcrumb__inner">
                                    <span className="breadcrumb__title">
                                        Comp & Qualify
                                    </span>
                                </span>
                            </a>
                            <a href="#">
                                <span className="breadcrumb__inner">
                                    <span className="breadcrumb__title">
                                        First Offer Given
                                    </span>
                                </span>
                            </a>
                            <a href="#">
                                <span className="breadcrumb__inner">
                                    <span className="breadcrumb__title">
                                        In Negotation
                                    </span>
                                </span>
                            </a>
                            <a href="#">
                                <span className="breadcrumb__inner">
                                    <span className="breadcrumb__title">
                                        Verbal Offer Accepted
                                    </span>
                                </span>
                            </a>
                            <a href="#">
                                <span className="breadcrumb__inner">
                                    <span className="breadcrumb__title">
                                        Under Contract
                                    </span>
                                </span>
                            </a>
                        </div>
                    </div>
                    <div style={{ marginTop: 20 }}>
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

                                <div>
                                    <Tabs
                                        defaultActiveKey="1"
                                        items={itemstab}
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
