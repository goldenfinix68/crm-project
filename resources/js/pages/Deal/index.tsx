import {
    Card,
    Button,
    Dropdown,
    Space,
    Radio,
    MenuProps,
    Row,
    Col,
    Popconfirm,
    Typography,
    Empty,
    Avatar,
    Tooltip,
} from "antd";
import React, { useEffect, useState } from "react";
import {
    PlusCircleOutlined,
    DownOutlined,
    FilterOutlined,
    PhoneOutlined,
    MailOutlined,
    UserOutlined,
    CloseOutlined,
    PlusSquareOutlined,
    SaveOutlined,
    ExportOutlined,
    MobileOutlined,
    CheckCircleOutlined,
    FunnelPlotOutlined,
    EditOutlined,
} from "@ant-design/icons";
import ModalAddDeal from "./components/ModalAddDeal";
import Filter from "./components/Filter";
import { useNavigate } from "react-router-dom";
import Board from "react-trello";
import { dealPipelines, useDealsAll } from "../../api/query/dealQuery";
import { useMutation, useQueryClient } from "react-query";
import {
    useDealMutationDeleteDeal,
    useDealUpdateBoardMutation,
} from "../../api/mutation/useDealMutation";
import moment from "moment";
import DealsTable from "./components/DealsTable";
import { TDeal } from "../../entities";
import LoadingComponent from "../../components/LoadingComponent";
import { useAppContextProvider } from "../../context/AppContext";
import { useCallContext } from "../../context/CallContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import TextEllipsis from "../../components/TextEllipsis";
import CustomButtonIcon from "../../components/CustomButtonIcon";

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
const Deal = () => {
    const navigate = useNavigate();
    const { isRoleStats, pipelines } = useAppContextProvider();
    const queryClient = useQueryClient();
    const [filterPage, setFilterPage] = useState({
        pipelineId: pipelines?.length ? pipelines[0].id : "",
        title: "",
        status: "All Deals",
        page: 1,
        page_size: 50,
        search: "",
        sort_field: "id",
        sort_order: "asc",
    });
    const { deals, isLoading, refetch } = useDealsAll(filterPage);
    const selectedpipeline = pipelines?.find(
        (pipeline) => pipeline.id === filterPage.pipelineId
    );

    const { setIsModalOpen, setCallerNumber, setDestinationNumber } =
        useCallContext();

    const [selectedDeal, setSelectedDeal] = useState<TDeal | undefined>(
        undefined
    );

    const [showDeleteButton, setShowDeleteButton] = useState(false);

    const [isModalOpenAdd, setIsModalOpenAdd] = useState(false);

    const showModalAdd = () => {
        setIsModalOpenAdd(true);
    };

    useEffect(() => {
        refetch();
    }, [filterPage]);

    const pipelineDropdownItem: MenuProps["items"] = pipelines?.map(
        (pipeline) => {
            return {
                key: pipeline.id,
                label: (
                    <div
                        onClick={() =>
                            setFilterPage({
                                ...filterPage,
                                pipelineId: pipeline.id,
                            })
                        }
                    >
                        {pipeline.name}
                    </div>
                ),
            };
        }
    );

    const [listBoard, setListBoard] = useState("Board");
    const [boardData, setBoardData] = useState<{ lanes: Lane[] } | undefined>();

    useEffect(() => {
        if (deals) {
            if (listBoard != "List") {
                const initialBoardData: { lanes: Lane[] } = {
                    lanes:
                        selectedpipeline?.stages?.map((stage) => {
                            return {
                                id: stage.id,
                                title: (
                                    <div className="item-deals-header">
                                        <div className="arrow top"></div>
                                        <div className="content">
                                            {stage.name}
                                        </div>
                                        <div className="arrow bottom"></div>
                                        <span className="add-deals">
                                            <PlusSquareOutlined
                                                onClick={() =>
                                                    setIsModalOpenAdd(true)
                                                }
                                            />
                                        </span>
                                    </div>
                                ),
                                style: {
                                    width: 280,
                                },
                                label: "",
                                cards:
                                    stage.deals?.map((deal) => {
                                        return {
                                            id: parseInt(deal.id ?? ""),
                                            title: cardDiv(deal),
                                            laneId: stage.id,
                                        };
                                    }) ?? [],
                            };
                        }) ?? [],
                };

                setBoardData(initialBoardData);
            }
        }
    }, [deals, listBoard]);

    const cardDiv = (deal: TDeal) => {
        return (
            <Card style={{ width: "100%", cursor: "pointer" }}>
                <div>
                    {deal.contact?.fields.firstName +
                        " " +
                        deal.contact?.fields.lastName}
                </div>

                <div
                    style={{
                        fontSize: 10,
                        color: "#9b9999",
                    }}
                >
                    {moment(deal?.created_at).format("LL")}
                </div>

                <div
                    style={{
                        marginTop: 10,
                        float: "right",
                        cursor: "pointer",
                    }}
                >
                    <Space>
                        <Tooltip title="Call contact">
                            <PhoneOutlined
                                onClick={() => {
                                    setCallerNumber(
                                        deal.contact?.fields
                                            ?.defaultMobileNumber ?? ""
                                    );
                                    setDestinationNumber(
                                        deal.contact?.fields.mobile ?? ""
                                    );
                                    setIsModalOpen(true);
                                }}
                            />
                        </Tooltip>
                        <Tooltip title="Contact profile">
                            <UserOutlined
                                onClick={() => {
                                    navigate("/contacts/" + deal.contact?.id);
                                }}
                            />
                        </Tooltip>
                        <Tooltip title="Edit deal">
                            <EditOutlined
                                onClick={() => {
                                    setSelectedDeal(deal);
                                    setIsModalOpenAdd(true);
                                }}
                            />
                        </Tooltip>
                    </Space>
                </div>
            </Card>
        );
    };

    const mutation = useMutation(useDealUpdateBoardMutation, {
        onSuccess: (res) => {
            queryClient.invalidateQueries("pipelines");
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

    //set initial pipeline
    useEffect(() => {
        if (pipelines?.length && !filterPage.pipelineId) {
            setFilterPage({
                ...filterPage,
                pipelineId: pipelines[0].id,
            });
            setTimeout(() => {
                refetch(); // Call refetch after a 1-second delay
            }, 1000);
        }
    }, [pipelines]);

    return (
        <Row className="deal-group-row">
            <Col md={24}>
                <Card loading={isLoading}>
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
                                    setIsModalOpenAdd(true);
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
                                            menu={{
                                                items: pipelineDropdownItem,
                                            }}
                                            placement="bottomLeft"
                                        >
                                            <Button>
                                                <Space>
                                                    {selectedpipeline?.name ??
                                                        "Select pipeline"}

                                                    <DownOutlined />
                                                </Space>
                                            </Button>
                                        </Dropdown>
                                    </span>
                                </div>

                                <div>
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
                                            disabled={isRoleStats}
                                        >
                                            <PlusCircleOutlined /> &nbsp;Deal
                                        </Button>
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
                                        # of Deals: <b>{deals?.length}</b>
                                    </span>
                                </div>
                            </div>
                        </>
                    )}

                    {deals?.length ? (
                        <>
                            {boardData &&
                            listBoard != "List" &&
                            !isRoleStats ? (
                                <div>
                                    <div className="mainDealArrow">
                                        <div
                                            style={{
                                                width: "100%",
                                                height: "100vh",
                                            }}
                                        >
                                            <Board
                                                draggable
                                                data={boardData}
                                                laneDraggable={false}
                                                hideCardDeleteIcon={true}
                                                className="react-trello-board board"
                                                cardDragClass="card-drag"
                                                cardDropClass="card-drop"
                                                style={{
                                                    background:
                                                        "none!important",
                                                }}
                                                customCardLayout={true}
                                                onDataChange={onDataChangeBoard}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <DealsTable
                                        deals={deals ?? []}
                                        filterPage={filterPage}
                                        setFilterPage={setFilterPage}
                                        showDeleteButton={showDeleteButton}
                                        setShowDeleteButton={
                                            setShowDeleteButton
                                        }
                                        selectedData={selectedData}
                                        setSelectedData={setSelectedData}
                                        selectedRowsData={selectedRowsData}
                                        setSelectedRows={setSelectedRows}
                                        isModalOpenUpdate={isModalOpenUpdate}
                                        setisModalOpenUpdate={
                                            setisModalOpenUpdate
                                        }
                                        isTContact={isTContact}
                                        setTContact={setTContact}
                                        isTitle={isTitle}
                                        setTitle={setTitle}
                                    />
                                </div>
                            )}
                        </>
                    ) : (
                        <Card>
                            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                        </Card>
                    )}

                    {/* <Filter
                        openFilter={openFilter}
                        setOpenFilter={setOpenFilter}
                    /> */}
                    <ModalAddDeal
                        isModalOpen={isModalOpenAdd}
                        handleSubmit={() => {
                            console.log("qwe");
                        }}
                        closeModal={() => {
                            setIsModalOpenAdd(false);
                            setSelectedDeal(undefined);
                        }}
                        deal={selectedDeal}
                        selectedRows={!selectedDeal ? selectedRowsData : []}
                    />
                </Card>
            </Col>
        </Row>
    );
};

export default Deal;
