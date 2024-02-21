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
    SettingOutlined,
    UpOutlined,
} from "@ant-design/icons";
import ModalAddDeal from "./components/ModalAddDeal";
import Filter from "./components/Filter";
import { useNavigate } from "react-router-dom";
import Board from "react-trello";
import { dealPipelines, useDealsAll } from "../../api/query/dealQuery";
import { useMutation, useQueryClient } from "react-query";
import {
    moveCardAcrossLanesMutation,
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
import { Link } from "react-router-dom";
import CustomLink from "../../components/CustomLink";
import DealCardConfigureModal from "../../components/DealCardConfigureModal";
import DealCard from "../../components/DealCard";

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
    const { loggedInUser, contactFields, isRoleStats } =
        useAppContextProvider();
    const settings = loggedInUser?.settings;

    const { data: pipelines, isLoading: isPipelinesLoading } = dealPipelines();
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
    const { deals, isLoading, refetch } = useDealsAll(filterPage);
    const selectedpipeline = pipelines?.find(
        (pipeline) => pipeline.id === filterPage.pipelineId
    );

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
                                    stage.deals
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

                                            return sortByAsc
                                                ? compareValueA.localeCompare(
                                                      compareValueB
                                                  )
                                                : compareValueB.localeCompare(
                                                      compareValueA
                                                  );
                                        })
                                        .map((deal) => {
                                            return {
                                                id: parseInt(deal.id ?? ""),
                                                title: (
                                                    <DealCard
                                                        deal={deal}
                                                        handleEditClick={() => {
                                                            setSelectedDeal(
                                                                deal
                                                            );
                                                            setIsModalOpenAdd(
                                                                true
                                                            );
                                                        }}
                                                        sortBy={sortBy}
                                                    />
                                                ),
                                                laneId: stage.id,
                                            };
                                        }) ?? [],
                            };
                        }) ?? [],
                };

                setBoardData(initialBoardData);
            }
        }
    }, [deals, listBoard, sortBy, sortByAsc, selectedpipeline?.stages]);

    const moveCardAcrossLanes = useMutation(moveCardAcrossLanesMutation, {
        onSuccess: (res) => {
            queryClient.invalidateQueries("dealPipelines");
            queryClient.invalidateQueries("deals");
        },
    });

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
                <Card loading={isLoading || isPipelinesLoading}>
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
                                                    moveCardAcrossLanes.mutate({
                                                        dealId: cardId,
                                                        stageId: toLaneId,
                                                    });
                                                }}
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
