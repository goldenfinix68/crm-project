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
} from "antd";
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

interface Card {
    id: number;
    title: React.ReactNode;
    laneId: any;
}

interface Lane {
    id: string;
    title: string;
    label: string;
    style: {
        width: number;
    };
    cards: Card[];
}

const Deal = () => {
    const queryClient = useQueryClient();
    const [filerPage, setFilterPage] = useState({
        pipeline: "",
        title: "",
        open_deals: "",
    });

    const { deals, isLoading, refetch } = useDealsAll(filerPage);
    const [isModalOpenAdd, setIsModalOpenAdd] = useState(false);
    const showModalAdd = () => {
        setIsModalOpenAdd(true);
    };

    const handleOkAdd = () => {
        setIsModalOpenAdd(false);
    };

    const handleCancelAdd = () => {
        setIsModalOpenAdd(false);
    };

    const onClickACQ = (value: string) => {
        setFilterPage({
            ...filerPage,
            pipeline: value,
        });
    };

    useEffect(() => {
        refetch();
    }, [filerPage]);

    const [openFilter, setOpenFilter] = useState(false);

    const action: MenuProps["items"] = [
        {
            key: "1",
            label: <div>Mass Transfer Activites</div>,
        },
        {
            key: "2",
            label: <div>Mass Delete Activites</div>,
        },
        {
            key: "3",
            label: <div>Mass Update Activites</div>,
        },
        {
            key: "4",
            label: <div>Import From Excel or CSV file</div>,
        },
        {
            key: "5",
            label: <div>Export Activites</div>,
        },
        {
            key: "6",
            label: <div>View Recent Deleted Records</div>,
        },
    ];
    const acq: MenuProps["items"] = [
        {
            key: "1",
            label: <div onClick={() => onClickACQ("Marketing")}>Marketing</div>,
        },
        {
            key: "2",
            label: <div onClick={() => onClickACQ("ACQ")}>ACQ</div>,
        },
    ];
    const title: MenuProps["items"] = [
        {
            key: "1",
            label: <div>Title</div>,
        },
        {
            key: "2",
            label: <div>Win Probability</div>,
        },
        {
            key: "3",
            label: <div>Owner</div>,
        },
        {
            key: "4",
            label: <div>Estimated Close Date</div>,
        },
        {
            key: "5",
            label: <div>Created At</div>,
        },
        {
            key: "6",
            label: <div>Last Modified Date</div>,
        },
        {
            key: "7",
            label: <div> Inactive Days</div>,
        },
    ];

    const activities_type = (
        <Card>
            <Search
                placeholder="input search text"
                allowClear
                // onSearch={onSearch}
                style={{ width: 200 }}
            />
            <Tabs
                defaultActiveKey="tab1"
                // onChange={handleTabChange}
            >
                <Tabs.TabPane tab="FAVORITES" key="tab1">
                    You have no favorties
                </Tabs.TabPane>
                <Tabs.TabPane tab="ALL VIEWS" key="tab2">
                    <Menu
                        style={{
                            backgroundColor: "none",
                            boxShadow: "none",
                        }}
                        mode="inline"
                        defaultSelectedKeys={["1"]}
                        defaultOpenKeys={["sub1"]}
                    >
                        <Menu.Item key="1">Activites I am following</Menu.Item>
                        <Menu.Item key="2">All Closed Activities</Menu.Item>
                        <Menu.Item key="3">All Open Activities</Menu.Item>
                        <Menu.Item key="4">My Open Activities</Menu.Item>
                        <Menu.Item key="5">My Overdue Activites</Menu.Item>
                    </Menu>
                </Tabs.TabPane>
            </Tabs>
        </Card>
    );

    const initialBoardData: { lanes: Lane[] } = {
        lanes: [
            {
                id: "Comp & Qualify",
                title: "Comp & Qualify",
                label: "",
                style: {
                    width: 280,
                },
                cards: [],
            },
            {
                id: "First Offer Given",
                title: "First Offer Given",
                label: "",
                style: {
                    width: 280,
                },
                cards: [],
            },
            {
                id: "In Negotiation",
                title: "In Negotiation",
                label: "",
                style: {
                    width: 280,
                },
                cards: [],
            },
            {
                id: "Verbal Offer Accepted",
                title: "Verbal Offer Accepted",
                style: {
                    width: 280,
                },
                label: "",
                cards: [],
            },
            {
                id: "Under Contract",
                title: "Under Contract",
                style: {
                    width: 280,
                },
                label: "",
                cards: [],
            },
        ],
    };

    const [boardData, setBoardData] = useState(initialBoardData);

    useEffect(() => {
        if (deals) {
            const data: { lanes: Lane[] } = { ...initialBoardData }; // Clone the initial data
            deals.data.forEach((x: any, key: any) => {
                if (x.stage == "Comp & Qualify") {
                    data.lanes[0].cards.push({
                        id: x.id,
                        title: cardDiv(x),
                        laneId: x.stage,
                    });
                }
                if (x.stage == "First Offer Given") {
                    data.lanes[1].cards.push({
                        id: x.id,
                        title: cardDiv(x),
                        laneId: x.stage,
                    });
                }
                if (x.stage == "In Negotiation") {
                    data.lanes[2].cards.push({
                        id: x.id,
                        title: cardDiv(x),
                        laneId: x.stage,
                    });
                }
                if (x.stage == "Verbal Offer Accepted") {
                    data.lanes[3].cards.push({
                        id: x.id,
                        title: cardDiv(x),
                        laneId: x.stage,
                    });
                }
                if (x.stage == "Under Contract") {
                    data.lanes[4].cards.push({
                        id: x.id,
                        title: cardDiv(x),
                        laneId: x.stage,
                    });
                }
            });
            setBoardData(data);
        }
    }, [deals]);

    const cardDiv = (x: any) => {
        return (
            <div>
                <Card style={{ width: "100%" }}>
                    <div>{x.owner} </div>
                    <div
                        style={{
                            fontSize: 12,
                            color: "#9b9999",
                        }}
                    >
                        {x.owner} - ${x.value}{" "}
                    </div>
                    <div
                        style={{
                            fontSize: 10,
                            color: "#9b9999",
                        }}
                    >
                        {moment(x.estimated_close_date).format("LL")}
                    </div>

                    <div
                        style={{
                            marginTop: 10,
                            float: "right",
                        }}
                    >
                        <span
                            style={{
                                marginLeft: 5,
                                padding: 4,
                                border: " 1px solid #e5e5e5",
                                borderRadius: "53%",
                            }}
                        >
                            <PhoneOutlined />
                        </span>
                        <span
                            style={{
                                marginLeft: 5,
                                padding: 4,
                                border: " 1px solid #e5e5e5",
                                borderRadius: "53%",
                            }}
                        >
                            <MailOutlined />
                        </span>
                        <span
                            style={{
                                marginLeft: 5,
                                padding: 4,
                                border: " 1px solid #e5e5e5",
                                borderRadius: "53%",
                            }}
                        >
                            <UserOutlined />
                        </span>
                    </div>
                </Card>
            </div>
        );
    };

    const mutation = useMutation(useDealUpdateBoardMutation, {
        onSuccess: (res) => {
            console.log(res);
        },
    });

    const onDataChangeBoard = (newData: any) => {
        mutation.mutate(newData);
    };

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
                            <span style={{ marginRight: 10 }}>
                                <Dropdown
                                    menu={{ items: acq }}
                                    placement="bottomLeft"
                                >
                                    <Button>
                                        <Space>
                                            ACQ
                                            <DownOutlined />
                                        </Space>
                                    </Button>
                                </Dropdown>
                            </span>
                            <span style={{ marginRight: 10 }}>
                                <Dropdown
                                    overlay={activities_type}
                                    placement="bottomLeft"
                                >
                                    <Button>
                                        <Space>
                                            My Open Deals
                                            <DownOutlined />
                                        </Space>
                                    </Button>
                                </Dropdown>
                            </span>
                            <span style={{ marginRight: 10 }}>
                                <Dropdown
                                    menu={{ items: title }}
                                    placement="bottomLeft"
                                >
                                    <Button>
                                        <Space>
                                            Title
                                            <DownOutlined />
                                        </Space>
                                    </Button>
                                </Dropdown>
                            </span>
                        </div>

                        <div>
                            <span style={{ marginRight: 10 }}>
                                <Button
                                    icon={<FilterOutlined />}
                                    onClick={() => {
                                        setOpenFilter(true);
                                    }}
                                ></Button>
                            </span>
                            <span style={{ marginRight: 10 }}>
                                <Radio.Group>
                                    <Radio.Button value="Overdue">
                                        List
                                    </Radio.Button>
                                    <Radio.Button value="Today">
                                        Board
                                    </Radio.Button>
                                </Radio.Group>
                            </span>
                            <span style={{ marginRight: 10 }}>
                                <Button type="primary" onClick={showModalAdd}>
                                    <PlusCircleOutlined /> &nbsp;Deal
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
                        <div></div>
                        <div>
                            <span style={{ marginRight: 15 }}>
                                {" "}
                                # of Deals: <b>$0</b>
                            </span>
                            <span style={{ marginRight: 15 }}>
                                {" "}
                                Pipeline Value: <b>$0</b>
                            </span>
                            <span>
                                {" "}
                                Forecase Value: <b>$0</b>
                            </span>
                        </div>
                    </div>
                    <div>
                        <div className="mainDealArrow">
                            <div style={{ width: "100%", height: "100vh" }}>
                                <Board
                                    draggable
                                    data={boardData}
                                    laneDraggable={false}
                                    hideCardDeleteIcon={true}
                                    className="react-trello-board board"
                                    cardDragClass="card-drag"
                                    cardDropClass="card-drop"
                                    style={{ background: "none!important" }}
                                    customCardLayout={true}
                                    onDataChange={onDataChangeBoard}
                                />
                            </div>
                        </div>
                    </div>
                    <Filter
                        openFilter={openFilter}
                        setOpenFilter={setOpenFilter}
                    />
                    <ModalAddDeal
                        isModalOpenAdd={isModalOpenAdd}
                        handleOkAdd={handleOkAdd}
                        handleCancelAdd={handleCancelAdd}
                    />
                </Card>
            </Col>
        </Row>
    );
};

export default Deal;
