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
    Popconfirm,
    Typography,
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
    PlusCircleFilled,
    PlusSquareOutlined,
    SaveOutlined,
    ExportOutlined,
    CopyOutlined,
    MobileOutlined,
    UnorderedListOutlined,
    EyeOutlined,
    StarFilled,
    StarOutlined,
    CheckCircleOutlined,
} from "@ant-design/icons";
import Search from "antd/es/input/Search";
import ModalAddDeal from "./components/ModalAddDeal";
import Filter from "./components/Filter";
import { useNavigate } from "react-router-dom";
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
    useDealAddFavorite,
    useDealDeleteFavorite,
    useDealMutation,
    useDealMutationDeleteDeal,
    useDealUpdateBoardMutation,
} from "../../api/mutation/useDealMutation";
import moment from "moment";
import DealsTable from "./components/DealsTable";
import { deleteContactMutation } from "../../api/mutation/useContactMutation";

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
    owner: any;
}
interface Bytotal {
    comp_qualify: number;
    first_given: number;
    in_negoation: number;
    verbal_offer_accepted: number;
    under_contract: number;
}
const Deal = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [filterPage, setFilterPage] = useState({
        pipeline: "ACQ",
        title: "",
        status: "All Deals",
        page: 1,
        page_size: 50,
        search: "",
        sort_field: "id",
        sort_order: "asc",
    });

    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const [isFavorite, setIsFavorite] = useState<string[]>([]);

    const addFavorite = useMutation(useDealAddFavorite, {
        onSuccess: (res) => {
            queryClient.invalidateQueries("deals");
        },
    });
    const deleteFavorite = useMutation(useDealDeleteFavorite, {
        onSuccess: (res) => {
            queryClient.invalidateQueries("deals");
        },
    });

    const handleFavoriteClick = (value) => {
        console.log("val", value);
        let isFavoriteVar = [...isFavorite];

        if (!isFavoriteVar.includes(value)) {
            isFavoriteVar.push(value);

            addFavorite.mutate({ name: value });
        } else {
            let index = isFavoriteVar.findIndex((x) => x === value);
            isFavoriteVar.splice(index, 1);

            deleteFavorite.mutate({ name: value });
        }

        setIsFavorite(isFavoriteVar);
    };
    const [showModalAddDealValue, setshowModalAddDealValue] =
        useState<string>("");
    const [showDeleteButton, setShowDeleteButton] = useState(false);
    const { deals, isLoading, refetch } = useDealsAll(filterPage);

    useEffect(() => {
        refetch();
    }, [filterPage]);
    const [isModalOpenAdd, setIsModalOpenAdd] = useState(false);
    const [byTotalDeals, setByTotalDeals] = useState<Bytotal>({
        comp_qualify: 0,
        first_given: 0,
        in_negoation: 0,
        verbal_offer_accepted: 0,
        under_contract: 0,
    });
    const showModalAdd = () => {
        setIsModalOpenAdd(true);
    };

    const showModalAddDeal = (val: any) => {
        setshowModalAddDealValue(val);
        setIsModalOpenAdd(true);
    };

    const handleOkAdd = () => {
        setIsModalOpenAdd(false);
        queryClient.invalidateQueries("deals");
    };

    const handleCancelAdd = () => {
        setIsModalOpenAdd(false);
    };

    const onClickACQ = (value: string) => {
        setFilterPage({
            ...filterPage,
            pipeline: value,
        });
    };

    const onClickStatus = (value: string) => {
        setFilterPage({
            ...filterPage,
            status: value,
        });
        console.log(value);
    };

    useEffect(() => {
        refetch();
    }, [filterPage]);

    function toCurrency(number: any) {
        return new Intl.NumberFormat("en-US", {
            style: "decimal",
            minimumFractionDigits: 2,
        }).format(number);
    }

    const [openFilter, setOpenFilter] = useState(false);

    const action: MenuProps["items"] = [
        {
            key: "1",
            label: <div>Mass Transfer Deals</div>,
        },
        {
            key: "2",
            label: <div>Mass Delete Deals</div>,
        },
        {
            key: "3",
            label: <div>Mass Update Deals</div>,
        },
        {
            key: "4",
            label: <div>Import From Excel or CSV file</div>,
        },
        {
            key: "5",
            label: <div>Export Deals</div>,
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

    const phone: MenuProps["items"] = [
        {
            key: "1",
            label: <div>Call Via Browser</div>,
        },
        {
            key: "2",
            label: <div>Call Via Phone</div>,
        },
        {
            key: "3",
            label: <div>Send Text</div>,
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
                    {isFavorite.length > 0 ? (
                        <Menu
                            style={{
                                backgroundColor: "none",
                                boxShadow: "none",
                            }}
                            mode="inline"
                        >
                            {isFavorite.map((item, index) => {
                                return (
                                    <Menu.Item
                                        key={index}
                                        onClick={() => {
                                            onClickStatus(item);
                                        }}
                                    >
                                        {item}
                                    </Menu.Item>
                                );
                            })}{" "}
                        </Menu>
                    ) : (
                        "You have no favorties"
                    )}
                </Tabs.TabPane>
                <Tabs.TabPane tab="ALL VIEWS" key="tab2">
                    <Menu
                        style={{
                            backgroundColor: "none",
                            boxShadow: "none",
                        }}
                        mode="inline"
                    >
                        <Menu.Item key="1">
                            <Space>
                                <div
                                    onClick={() => {
                                        onClickStatus("All Deals");
                                        setDropdownVisible(true);
                                    }}
                                >
                                    {" "}
                                    All Deals
                                </div>
                                <div
                                    onClick={() => {
                                        handleFavoriteClick("All Deals");
                                    }}
                                >
                                    {isFavorite.includes("All Deals") ? (
                                        <StarFilled />
                                    ) : (
                                        <StarOutlined />
                                    )}
                                </div>
                            </Space>
                        </Menu.Item>
                        <Menu.Item key="2">
                            <Space>
                                <div
                                    onClick={() => {
                                        onClickStatus("All Open Deals");
                                        setDropdownVisible(true);
                                    }}
                                >
                                    All Open Deals
                                </div>
                                <div
                                    onClick={() => {
                                        handleFavoriteClick("All Open Deals");
                                    }}
                                >
                                    {isFavorite.includes("All Open Deals") ? (
                                        <StarFilled />
                                    ) : (
                                        <StarOutlined />
                                    )}
                                </div>
                            </Space>
                        </Menu.Item>
                        <Menu.Item key="3">
                            <Space>
                                <div
                                    onClick={() => {
                                        onClickStatus(
                                            "Deals Closing Next Month"
                                        );
                                        setDropdownVisible(true);
                                    }}
                                >
                                    Deals Closing Next Month
                                </div>
                                <div
                                    onClick={() => {
                                        handleFavoriteClick(
                                            "Deals Closing Next Month"
                                        );
                                    }}
                                >
                                    {isFavorite.includes(
                                        "Deals Closing Next Month"
                                    ) ? (
                                        <StarFilled />
                                    ) : (
                                        <StarOutlined />
                                    )}
                                </div>
                            </Space>
                        </Menu.Item>
                        <Menu.Item key="4">
                            <Space>
                                <div
                                    onClick={() => {
                                        onClickStatus(
                                            "Deals Closing This Month"
                                        );
                                        setDropdownVisible(true);
                                    }}
                                >
                                    Deals Closing This Month
                                </div>
                                <div
                                    onClick={() => {
                                        handleFavoriteClick(
                                            "Deals Closing This Month"
                                        );
                                    }}
                                >
                                    {isFavorite.includes(
                                        "Deals Closing This Month"
                                    ) ? (
                                        <StarFilled />
                                    ) : (
                                        <StarOutlined />
                                    )}
                                </div>
                            </Space>
                        </Menu.Item>
                        {/* <Menu.Item
                            key="5"
                            onClick={() =>
                                onClickStatus("Deals I am following")
                            }
                        >
                            Deals I am following
                        </Menu.Item>
                        <Menu.Item
                            key="6"
                            onClick={() => onClickStatus("My Open Deals")}
                        >
                            My Open Deals
                        </Menu.Item>
                        <Menu.Item
                            key="7"
                            onClick={() => onClickStatus("My Ovderdue Deals")}
                        >
                            My Ovderdue Deals
                        </Menu.Item> */}
                        <Menu.Item key="8">
                            <Space>
                                <div
                                    onClick={() => {
                                        onClickStatus("Lost Deals");
                                        setDropdownVisible(true);
                                    }}
                                >
                                    Lost Deals
                                </div>
                                <div
                                    onClick={() => {
                                        handleFavoriteClick("Lost Deals");
                                    }}
                                >
                                    {isFavorite.includes("Lost Deals") ? (
                                        <StarFilled />
                                    ) : (
                                        <StarOutlined />
                                    )}
                                </div>
                            </Space>
                        </Menu.Item>
                        <Menu.Item key="9">
                            <Space>
                                <div
                                    onClick={() => {
                                        onClickStatus("Won Deals");
                                        setDropdownVisible(true);
                                    }}
                                >
                                    Won Deals
                                </div>
                                <div
                                    onClick={() => {
                                        handleFavoriteClick("Won Deals");
                                    }}
                                >
                                    {isFavorite.includes("Won Deals") ? (
                                        <StarFilled />
                                    ) : (
                                        <StarOutlined />
                                    )}
                                </div>
                            </Space>
                        </Menu.Item>
                    </Menu>
                </Tabs.TabPane>
            </Tabs>
        </Card>
    );

    const initialBoardData: { lanes: Lane[] } = {
        lanes: [
            {
                id: "Comp & Qualify",
                title: (
                    <div className="item-deals-header">
                        <div className="arrow top"></div>
                        <div className="content">
                            Comp & Qualify
                            <div className="total-dollar">
                                ${deals && toCurrency(deals.sum.cq)}
                            </div>
                        </div>
                        <div className="arrow bottom"></div>

                        <span className="add-deals">
                            <PlusSquareOutlined
                                onClick={() =>
                                    showModalAddDeal("Comp & Qualify")
                                }
                            />
                        </span>
                    </div>
                ),
                label: "",
                style: {
                    width: 280,
                },
                cards: [],
            },
            {
                id: "First Offer Given",

                title: (
                    <div className="item-deals-header">
                        <div className="arrow top"></div>
                        <div className="content">
                            First Offer Given{" "}
                            <div className="total-dollar">
                                ${deals && toCurrency(deals.sum.fg)}
                            </div>
                        </div>
                        <div className="arrow bottom"></div>
                        <span className="add-deals">
                            <PlusSquareOutlined
                                onClick={() =>
                                    showModalAddDeal("First Offer Given")
                                }
                            />
                        </span>
                    </div>
                ),
                label: "",
                style: {
                    width: 280,
                },
                cards: [],
            },
            {
                id: "In Negotiation",
                title: (
                    <div className="item-deals-header">
                        <div className="arrow top"></div>
                        <div className="content">
                            In Negotiation{" "}
                            <div className="total-dollar">
                                ${deals && toCurrency(deals.sum.in)}
                            </div>
                        </div>
                        <div className="arrow bottom"></div>
                        <span className="add-deals">
                            <PlusSquareOutlined
                                onClick={() =>
                                    showModalAddDeal("In Negotiation")
                                }
                            />
                        </span>
                    </div>
                ),
                label: "",
                style: {
                    width: 280,
                },
                cards: [],
            },
            {
                id: "Verbal Offer Accepted",
                title: (
                    <div className="item-deals-header">
                        <div className="arrow top"></div>
                        <div className="content">
                            Verbal Offer Accepted{" "}
                            <div className="total-dollar">
                                ${deals && toCurrency(deals.sum.voa)}
                            </div>
                        </div>
                        <div className="arrow bottom"></div>
                        <span className="add-deals">
                            <PlusSquareOutlined
                                onClick={() =>
                                    showModalAddDeal("Verbal Offer Accepted")
                                }
                            />
                        </span>
                    </div>
                ),
                style: {
                    width: 280,
                },
                label: "",
                cards: [],
            },
            {
                id: "Under Contract",
                title: (
                    <div className="item-deals-header">
                        <div className="arrow top"></div>
                        <div className="content">
                            Under Contract{" "}
                            <div className="total-dollar">
                                ${deals && toCurrency(deals.sum.uc)}
                            </div>
                        </div>
                        <div className="arrow bottom"></div>
                        <span className="add-deals">
                            <PlusSquareOutlined
                                onClick={() =>
                                    showModalAddDeal("Under Contract")
                                }
                            />
                        </span>
                    </div>
                ),
                style: {
                    width: 280,
                },
                label: "",
                cards: [],
            },
        ],
    };
    const [listBoard, setListBoard] = useState("Board");
    const [boardData, setBoardData] = useState(initialBoardData);
    const [listData, setListData] = useState<TDeals[]>([]);

    useEffect(() => {
        if (deals) {
            console.log(deals);
            if (deals.deal_favorite.length > 0) {
                let isFavoriteVar: any = [];

                deals.deal_favorite.forEach((element: any) => {
                    isFavoriteVar.push(element.name);
                });

                setIsFavorite(isFavoriteVar);
            }

            if (listBoard != "List") {
                const data: { lanes: Lane[] } = { ...initialBoardData }; // Clone the initial data

                deals.data.data.forEach((x: any, key: any) => {
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
            } else {
                setListData(deals.data.data);
                console.log("wew", deals.data.data);
            }
        }
    }, [deals, listBoard]);

    const cardDiv = (x: any) => {
        return (
            <div>
                <Card
                    style={{ width: "100%", cursor: "pointer" }}
                    onClick={() => {
                        navigate("/deals/" + x.id);
                    }}
                >
                    <div>{x.title}</div>
                    <div
                        style={{
                            fontSize: 12,
                            color: "#9b9999",
                        }}
                    >
                        {x?.contact?.firstName + " " + x?.contact?.lastName} - $
                        {toCurrency(x.value)}{" "}
                    </div>
                    <div
                        style={{
                            fontSize: 10,
                            color: "#9b9999",
                        }}
                    >
                        {moment(x?.estimated_close_date).format("LL")}
                    </div>

                    <div
                        style={{
                            marginTop: 10,
                            float: "right",
                            cursor: "pointer",
                        }}
                    >
                        <span
                            style={{
                                marginLeft: 5,
                                padding: 4,
                                border: " 1px solid #e5e5e5",
                                borderRadius: "53%",
                            }}
                            title="click to call"
                        >
                            <Dropdown
                                menu={{ items: phone }}
                                placement="bottomLeft"
                                trigger={["click"]}
                            >
                                <PhoneOutlined />
                            </Dropdown>
                        </span>
                        <span
                            style={{
                                marginLeft: 5,
                                padding: 4,
                                border: " 1px solid #e5e5e5",
                                borderRadius: "53%",
                            }}
                            title="send email"
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
            console.log("wew", res);
        },
    });

    const onDataChangeBoard = (newData: any) => {
        const new_data: { id: number; laneId: string }[] = [];
        newData.lanes.forEach((element: any) => {
            element.cards.forEach((cards: any) => {
                new_data.push({
                    id: cards.id,
                    laneId: cards.laneId,
                });
            });
        });

        mutation.mutate({ lanes: new_data });
    };

    const onChangeListBoard = (e: any) => {
        setListBoard(e.target.value);
        refetch();
    };

    const [selectedRowsData, setSelectedRows] = useState<React.Key[]>([]);
    const [selectedData, setSelectedData] = useState<TDeals[]>([]);

    const deleteContact = useMutation(useDealMutationDeleteDeal, {
        onSuccess: () => {
            console.log("success");
            queryClient.invalidateQueries("deals");
            setShowDeleteButton(false);
        },
    });
    const handleDelete = () => {
        deleteContact.mutate({ deals_id: selectedRowsData });
    };

    const [isModalOpenUpdate, setisModalOpenUpdate] = useState(false);
    const [isTContact, setTContact] = useState<TDeals | null>(null);
    const [isTitle, setTitle] = useState("");

    return (
        <Row className="deal-group-row">
            <Col md={24}>
                <Card title="Deals">
                    {showDeleteButton ? (
                        <Row
                            style={{
                                alignItems: "center",
                                marginBottom: "20px",
                            }}
                        >
                            <Button
                                icon={<CloseOutlined />}
                                type="text"
                                className="m-r-md"
                                onClick={() => {
                                    setShowDeleteButton(false);
                                }}
                            ></Button>
                            <Typography.Text className="m-r-md">
                                {/* {selectedRowsData?.length + " Selected"} */}
                            </Typography.Text>
                            <Popconfirm
                                title="Delete Contact"
                                description="Are you sure to delete this deal?"
                                onConfirm={() => {
                                    handleDelete();
                                }}
                            >
                                <Button
                                    type="primary"
                                    danger
                                    className="m-r-sm"
                                >
                                    Delete
                                </Button>
                            </Popconfirm>

                            <Button
                                onClick={() => {
                                    setisModalOpenUpdate(true);
                                }}
                                icon={<SaveOutlined />}
                                className="m-r-sm"
                            >
                                Update
                            </Button>
                            <Button
                                icon={<ExportOutlined />}
                                className="m-r-sm"
                            >
                                Export
                            </Button>

                            <Button icon={<MailOutlined />} className="m-r-sm">
                                Email
                            </Button>

                            <Button
                                icon={<CheckCircleOutlined />}
                                className="m-r-sm"
                            >
                                Create Activities
                            </Button>
                            <Button
                                icon={<MobileOutlined />}
                                className="m-r-sm"
                            >
                                Text
                            </Button>
                        </Row>
                    ) : (
                        <>
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
                                                    {filterPage.pipeline}

                                                    <DownOutlined />
                                                </Space>
                                            </Button>
                                        </Dropdown>
                                    </span>
                                    <span style={{ marginRight: 10 }}>
                                        <Dropdown
                                            visible={isDropdownVisible}
                                            onVisibleChange={setDropdownVisible}
                                            overlay={activities_type}
                                            placement="bottomLeft"
                                            trigger={["click"]}
                                        >
                                            <Button>
                                                <Space>
                                                    {filterPage.status}
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
                                        <Radio.Group
                                            value={listBoard}
                                            buttonStyle="solid"
                                            onChange={onChangeListBoard}
                                        >
                                            <Radio.Button value="List">
                                                List
                                            </Radio.Button>
                                            <Radio.Button value="Board">
                                                Board
                                            </Radio.Button>
                                        </Radio.Group>
                                    </span>
                                    <span style={{ marginRight: 10 }}>
                                        <Button
                                            type="primary"
                                            onClick={showModalAdd}
                                        >
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
                                        # of Deals:{" "}
                                        <b>{deals && deals.sum.count}</b>
                                    </span>
                                    <span style={{ marginRight: 15 }}>
                                        {" "}
                                        Pipeline Value:{" "}
                                        <b>
                                            {deals &&
                                                "$" +
                                                    toCurrency(
                                                        deals.sum.sum_upp
                                                    )}
                                        </b>
                                    </span>
                                    <span>
                                        {" "}
                                        Forecasted Value:{" "}
                                        <b>
                                            {deals &&
                                                "$" +
                                                    toCurrency(
                                                        deals.sum.sum_upp
                                                    )}
                                        </b>
                                    </span>
                                </div>
                            </div>
                        </>
                    )}

                    {boardData && listBoard != "List" ? (
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
                    ) : (
                        <div>
                            <DealsTable
                                deals={deals}
                                filterPage={filterPage}
                                setFilterPage={setFilterPage}
                                showDeleteButton={showDeleteButton}
                                setShowDeleteButton={setShowDeleteButton}
                                selectedData={selectedData}
                                setSelectedData={setSelectedData}
                                selectedRowsData={selectedRowsData}
                                setSelectedRows={setSelectedRows}
                                isModalOpenUpdate={isModalOpenUpdate}
                                setisModalOpenUpdate={setisModalOpenUpdate}
                                isTContact={isTContact}
                                setTContact={setTContact}
                                isTitle={isTitle}
                                setTitle={setTitle}
                            />
                        </div>
                    )}

                    <Filter
                        openFilter={openFilter}
                        setOpenFilter={setOpenFilter}
                    />
                    <ModalAddDeal
                        isModalOpenAdd={isModalOpenAdd}
                        handleOkAdd={handleOkAdd}
                        handleCancelAdd={handleCancelAdd}
                        showModalAddDealValue={showModalAddDealValue}
                        from={"add"}
                        modalValue={""}
                    />
                </Card>
            </Col>
        </Row>
    );
};

export default Deal;
