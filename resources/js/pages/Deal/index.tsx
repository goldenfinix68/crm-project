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
    Spin,
} from "antd";
import React, { useEffect, useState } from "react";
import {
    PlusCircleOutlined,
    DownOutlined,
    MailOutlined,
    CloseOutlined,
    PlusSquareOutlined,
    SaveOutlined,
    ExportOutlined,
    MobileOutlined,
    CheckCircleOutlined,
    FunnelPlotOutlined,
    SettingOutlined,
    UpOutlined,
} from "@ant-design/icons";
import ModalAddDeal from "./components/ModalAddDeal";
import Board from "react-trello";
import { dealPipelines, useDealsAll } from "../../api/query/dealQuery";
import { useMutation, useQueryClient } from "react-query";
import {
    dealsByStageId,
    moveCardAcrossLanesMutation,
    useDealMutationDeleteDeal,
    useDealMutationUpdateStarred,
} from "../../api/mutation/useDealMutation";
import DealsTable from "./components/DealsTable";
import { TDeal } from "../../entities";
import { useAppContextProvider } from "../../context/AppContext";
import DealCardConfigureModal from "../../components/DealCardConfigureModal";
import DealCard from "../../components/DealCard";
import { useCustomFields } from "../../api/query/customFieldQuery";

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

interface DealsByStage {
    [id: number]: {
        page: number;
        data: any[];
    };
}
const Deal = () => {
    useEffect(() => {
        document.title = "Deals - SpeedLead";
        return () => {};
    }, []);
    const { loggedInUser, isRoleStats } = useAppContextProvider();

    const {
        data: contactFields,
        isLoading: isContactFieldsLoading,
        refetch: refetchContactFields,
    } = useCustomFields("contact");
    const settings = loggedInUser?.settings;

    const { data: pipelines, isLoading: isPipelinesLoading } = dealPipelines();

    //const [isLoadingBoardData, setIsLoadingBoardData] =
    //    useState<boolean>(false);
    const queryClient = useQueryClient();
    const [filterPage, setFilterPage] = useState({
        pipelineId: pipelines?.length ? pipelines[0].id : "",
        page: 1,
        page_size: 100,
    });
    const [sortBy, setSortBy] = useState("firstName");
    const [sortByAsc, setSortByAsc] = useState(true);

    const getFieldLabelByFieldName = (value = "") => {
        return contactFields?.find((field) => field.fieldName == value)?.label;
    };

    const sortableItems: MenuProps["items"] = [
        { key: 5, label: "Name", onClick: () => handleChangeSort("firstName") },
        { key: 1, label: "Aging", onClick: () => handleChangeSort("aging") },
        {
            key: settings?.dealCardpos2FieldId ? 2 : "",
            label: settings?.dealCardpos2FieldId
                ? getFieldLabelByFieldName(settings?.dealCardpos2FieldId)
                : "",
            onClick: () => handleChangeSort(settings?.dealCardpos2FieldId),
        },
        {
            key: settings?.dealCardpos3FieldId ? 3 : "",
            label: settings?.dealCardpos3FieldId
                ? getFieldLabelByFieldName(settings?.dealCardpos3FieldId)
                : "",
            onClick: () => handleChangeSort(settings?.dealCardpos3FieldId),
        },
        {
            key: settings?.dealCardpos4FieldId ? 4 : "",
            label: settings?.dealCardpos4FieldId
                ? getFieldLabelByFieldName(settings?.dealCardpos4FieldId)
                : "",
            onClick: () => handleChangeSort(settings?.dealCardpos4FieldId),
        },
    ];

    const handleChangeSort = (val) => {
        if (val == sortBy) {
            setSortByAsc(!sortByAsc);
        } else {
            setSortByAsc(true);
        }
        setSortBy(val);
    };

    const [isConfigureModalOpen, setIsConfigureModalOpen] = useState(false);
    const { deals, isLoadingDeals, refetch, isFetchingDeals } =
        useDealsAll(filterPage);
    let selectedpipeline = pipelines?.find(
        (pipeline) => pipeline.id === filterPage.pipelineId
    );

    useEffect(() => {
        console.log("isFetchingDeals", isFetchingDeals);
        return () => {};
    }, [isFetchingDeals]);

    const [selectedDeal, setSelectedDeal] = useState<TDeal | undefined>(
        undefined
    );

    const [showDeleteButton, setShowDeleteButton] = useState(false);

    const [isModalOpenAdd, setIsModalOpenAdd] = useState(false);

    const showModalAdd = () => {
        setIsModalOpenAdd(true);
    };

    useEffect(() => {
        if (filterPage.pipelineId) {
            refetch();
        }
    }, [filterPage]);

    const pipelineDropdownItem: MenuProps["items"] = pipelines?.map(
        (pipeline) => {
            return {
                key: pipeline.id,
                label: (
                    <div
                        onClick={() => {
                            setFilterPage({
                                ...filterPage,
                                pipelineId: pipeline.id,
                            });
                        }}
                    >
                        {pipeline.name}
                    </div>
                ),
            };
        }
    );

    const [listBoard, setListBoard] = useState("Board");
    const [boardData, setBoardData] = useState<{ lanes: Lane[] } | undefined>();

    const [dealsByStage, setDealsByStage] = useState<DealsByStage>({});
    const [fetchingDealsByStage, setFetchingDealsByStage] =
        useState<boolean>(false);

    const fetchDealsByStage = async () => {
        const newDealsByStage = {};

        await Promise.all(
            selectedpipeline?.stages?.map(async (stage) => {
                const current = { page: 0, data: [] };
                const data = await dealsByStageId({
                    page: current.page + 1,
                    page_size: 10,
                    stageId: stage.id,
                    pipelineId: selectedpipeline?.id,
                });

                if (data.length) {
                    newDealsByStage[stage.id] = {
                        page: current.page + 1,
                        data: [...current.data, ...data],
                    };
                } else {
                    newDealsByStage[stage.id] = current;
                }
            }) ?? []
        );

        //setIsLoadingBoardData(false);
        setDealsByStage(newDealsByStage);
    };

    useEffect(() => {
        if (
            listBoard != "List" &&
            (!isPipelinesLoading || fetchingDealsByStage)
        ) {
            //setIsLoadingBoardData(true);
            fetchDealsByStage();
            setFetchingDealsByStage(false);
        }
    }, [
        dealPipelines,
        isPipelinesLoading,
        fetchingDealsByStage,
        listBoard,
        sortBy,
        sortByAsc,
        selectedpipeline?.stages,
    ]);

    const handleLane = async (requestedPage, laneId) => {
        //setIsLoadingBoardData(true);
        const newDealsByStage = { ...dealsByStage };

        const current = dealsByStage[laneId] ?? { page: 0, data: [] };

        const data = await dealsByStageId({
            page: current.page + 1,
            page_size: 10,
            stageId: laneId,
            pipelineId: selectedpipeline?.id,
        });

        if (data.length) {
            newDealsByStage[laneId] = {
                page: current.page + 1,
                data: [...current.data, ...data],
            };
        } else {
            newDealsByStage[laneId] = current;
        }

        //setIsLoadingBoardData(false);
        setDealsByStage(newDealsByStage);
    };

    useEffect(() => {
        if (dealsByStage) {
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
                                cards: dealsByStage[stage.id]?.data
                                    ? dealsByStage[stage.id]?.data
                                          ?.slice() // Create a shallow copy of the array to avoid mutating the original array
                                          .sort((a, b) => {
                                              const compareValueA =
                                                  sortBy === "aging"
                                                      ? a.aging ?? ""
                                                      : a.contact?.fields[
                                                            sortBy
                                                        ] ?? "";
                                              const compareValueB =
                                                  sortBy === "aging"
                                                      ? b.aging ?? ""
                                                      : b.contact?.fields[
                                                            sortBy
                                                        ] ?? "";

                                              if (a.star === b.star) {
                                                  return b.star - a.star ||
                                                      sortByAsc
                                                      ? compareValueA.localeCompare(
                                                            compareValueB
                                                        )
                                                      : compareValueB.localeCompare(
                                                            compareValueA
                                                        );
                                              } else if (a.star) {
                                                  return -1;
                                              }

                                              return 1;
                                          })
                                          .map((deal) => {
                                              return {
                                                  id: parseInt(deal.id ?? ""),
                                                  title: (
                                                      <DealCard
                                                          deal={deal}
                                                          handleEditClick={() => {
                                                              setSelectedDeal({
                                                                  ...deal,
                                                                  stageId:
                                                                      stage.id,
                                                                  pipelineId:
                                                                      selectedpipeline?.id,
                                                              });
                                                              setIsModalOpenAdd(
                                                                  true
                                                              );
                                                          }}
                                                          sortBy={sortBy}
                                                          updateStarredDeal={
                                                              updateStarredDeal
                                                          }
                                                      />
                                                  ),
                                                  laneId: stage.id,
                                              };
                                          })
                                    : [],
                            };
                        }) ?? [],
                };

                setBoardData(initialBoardData);
            }
        }
    }, [dealsByStage]);

    const moveCardAcrossLanes = useMutation(moveCardAcrossLanesMutation, {
        onSuccess: (res) => {
            queryClient.invalidateQueries("dealPipelines");
            queryClient.invalidateQueries("deals");
        },
    });

    const onChangeListBoard = (e: any) => {
        // alert(e);
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
        if (pipelines?.length) {
            setFilterPage({
                ...filterPage,
                pipelineId: pipelines[0].id,
            });
            // setTimeout(() => {
            //     refetch(); // Call refetch after a 1-second delay
            // }, 1000);
        }
    }, [pipelines]);

    const updateContact = useMutation(useDealMutationUpdateStarred, {
        onSuccess: () => {
            console.log("success");
            queryClient.invalidateQueries("deals");
            // setShowupdateButton(false);
        },
    });

    const updateStarredDeal = async (deal) => {
        console.log("deal", deal.star);
        await updateContact.mutate({
            id: deal.id,
        });
    };

    return (
        <Row className="deal-group-row">
            <Col md={24}>
                <Card
                    loading={
                        (isLoadingDeals && listBoard == "List") ||
                        (isPipelinesLoading && listBoard != "List")
                    }
                >
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
                            <Space
                                className="w-100"
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    marginBottom: 15,
                                }}
                            >
                                <Space className="w-100">
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

                                    <Button
                                        icon={<SettingOutlined />}
                                        onClick={() =>
                                            setIsConfigureModalOpen(true)
                                        }
                                    >
                                        Configure Card
                                    </Button>

                                    {listBoard != "List" && (
                                        <Dropdown
                                            menu={{
                                                items: sortableItems.filter(
                                                    (item) => item?.key
                                                ),
                                            }}
                                            placement="bottomLeft"
                                        >
                                            <Button
                                                icon={<FunnelPlotOutlined />}
                                                style={{
                                                    marginRight: "10px",
                                                    display: "flex",
                                                    alignItems: "center",
                                                }}
                                            >
                                                {sortBy == "aging"
                                                    ? "Aging"
                                                    : sortBy != "firstName"
                                                    ? getFieldLabelByFieldName(
                                                          sortBy
                                                      )
                                                    : "Name"}
                                                {sortByAsc ? (
                                                    <DownOutlined />
                                                ) : (
                                                    <UpOutlined />
                                                )}
                                            </Button>
                                        </Dropdown>
                                    )}
                                </Space>

                                <Space className="w-100">
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
                                    <Button
                                        type="primary"
                                        onClick={showModalAdd}
                                        disabled={isRoleStats}
                                        icon={<PlusCircleOutlined />}
                                    >
                                        Deal
                                    </Button>
                                </Space>
                            </Space>
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
                    {/* {isFetchingDeals && <Spin />} */}
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
                                            {isFetchingDeals ||
                                            isLoadingDeals ? (
                                                <div
                                                    style={{
                                                        display: "grid",
                                                        placeItems: "center",
                                                        marginTop: "5%",
                                                    }}
                                                >
                                                    <Spin />
                                                </div>
                                            ) : (
                                                <Board
                                                    draggable
                                                    data={boardData}
                                                    loading={
                                                        isLoadingDeals ||
                                                        isFetchingDeals
                                                    }
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
                                                    onLaneScroll={handleLane}
                                                    // onDataChange={onDataChangeBoard}
                                                    onCardMoveAcrossLanes={(
                                                        fromLaneId,
                                                        toLaneId,
                                                        cardId,
                                                        index
                                                    ) => {
                                                        console.log(
                                                            cardId,
                                                            toLaneId
                                                        );

                                                        moveCardAcrossLanes.mutate(
                                                            {
                                                                dealId: cardId,
                                                                stageId:
                                                                    toLaneId,
                                                            }
                                                        );

                                                        setFetchingDealsByStage(
                                                            true
                                                        );
                                                    }}
                                                />
                                            )}
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
                            setFetchingDealsByStage(true);
                        }}
                        closeModal={() => {
                            setIsModalOpenAdd(false);
                            setSelectedDeal(undefined);
                        }}
                        deal={selectedDeal}
                        selectedRows={!selectedDeal ? selectedRowsData : []}
                    />
                    <DealCardConfigureModal
                        isModalOpen={isConfigureModalOpen}
                        handleSubmit={() => {
                            console.log("qwe");
                        }}
                        closeModal={() => {
                            setIsConfigureModalOpen(false);
                        }}
                    />
                </Card>
            </Col>
        </Row>
    );
};

export default Deal;
