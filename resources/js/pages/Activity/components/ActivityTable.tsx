import React, { Key, useEffect, useState } from "react";
import {
    Button,
    Card,
    Col,
    Dropdown,
    Input,
    Modal,
    Radio,
    Row,
    Space,
    Table,
    Tabs,
    Tag,
    Tooltip,
    Typography,
    notification,
} from "antd";
import { MenuProps, Menu } from "antd";
import type { ColumnsType, TableProps } from "antd/es/table";
import { TUser } from "../../../entities";
import type { TableRowSelection } from "antd/es/table/interface";
import {
    AuditOutlined,
    ContainerOutlined,
    DownOutlined,
    FilterOutlined,
    GroupOutlined,
    InsertRowBelowOutlined,
    MobileOutlined,
    PhoneOutlined,
    PlusCircleOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import Title from "antd/es/skeleton/Title";
import ModalAddActivity from "./ModalAddActivity";
import Search from "antd/es/input/Search";
import ModalManageColumn from "./ModalManageColumn";

import { TActivities } from "../ActivityEntities";
import {
    activitiList,
    useActivityType,
    useActivutyCustomField,
} from "../../../api/query/activityQuery";

import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCheck,
    faCheckCircle,
    faLock,
    faStar as starSolid,
    faCircleCheck as checkSolid,
} from "@fortawesome/free-solid-svg-icons";
import {
    faCircleCheck as checkRegular,
    faStar as starRegular,
} from "@fortawesome/free-regular-svg-icons";
import DrawerUpdateActivity from "./DrawerEditActivitty";
import ModalManageColumnFIeld from "./ModalManageColumnFIeld";
import ComponentActivityTypeIcon from "../../Setup/Components/ComponentActivityTypeIcon";
import { mutatePost } from "../../../api/mutation/useSetupMutation";
import { useMutation, useQueryClient } from "react-query";

const rowSelection: TableRowSelection<TActivities> = {
    onChange: (selectedRowKeys, selectedRows) => {
        // console.log(
        //     `selectedRowKeys: ${selectedRowKeys}`,
        //     "selectedRows: ",
        //     selectedRows
        // );
    },
    onSelect: (record, selected, selectedRows) => {
        // console.log(record, selected, selectedRows);
    },
    onSelectAll: (selected, selectedRows, changeRows) => {
        // console.log(selected, selectedRows, changeRows);
    },
};

const action_type: MenuProps["items"] = [
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

const ActivityTable = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [dataFilter, setDataFilter] = useState({
        page: 1,
        page_size: 50,
        search: "",
        sort_field: "id",
        sort_order: "asc",
        // status: "Open",
        type: ["All"],
        date_filter: "",
        favorite_filter: localStorage.activitiesFavorite
            ? localStorage.activitiesFavorite
            : "Activites I am following",
    });

    const { dataSource, isLoadingUsers, refetchUsers, isFetchingUsers } =
        activitiList(dataFilter);

    const onChange: TableProps<TActivities>["onChange"] = (
        pagination: any,
        sorter: any,
        filters: any,
        extra: any
    ) => {
        // console.log("sorter", filters);

        setDataFilter({
            ...dataFilter,
            sort_field: filters.field,
            sort_order: filters.order ? filters.order.replace("end", "") : null,
            page: pagination.current,
            page_size: pagination.pageSize,
        });
    };

    useEffect(() => {
        refetchUsers();
        console.log("dataFilter", dataFilter);
    }, [dataFilter]);

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

    const [isModalManageColumnOpen, setIsModalManageColumnOpen] =
        useState(false);

    const [modalManageColumnField, setModalManageColumnField] = useState({
        show: false,
        title: "Select Field Type",
        step: 1,
    });

    const [activitiesSelectColumn, setActivitiesSelectColumn] = useState(
        localStorage.activitiesSelectColumn
            ? JSON.parse(localStorage.activitiesSelectColumn)
            : [
                  { title: "Title", id: "1" },
                  { title: "Start Date", id: "2" },
                  { title: "Duration", id: "3" },
                  { title: "Owner", id: "4" },
                  { title: "Title (Deal)", id: "5" },
                  { title: "Name (Contact)", id: "6" },
                  { title: "Tags", id: "7" },
              ]
    );

    const localTableColumn = localStorage.activitiesSelectColumn
        ? JSON.parse(localStorage.activitiesSelectColumn)
        : [
              { title: "Title", id: "1" },
              { title: "Start Date", id: "2" },
              { title: "Duration", id: "3" },
              { title: "Owner", id: "4" },
              { title: "Title (Deal)", id: "5" },
              { title: "Name (Contact)", id: "6" },
              { title: "Tags", id: "7" },
          ];

    const colums = [
        {
            title: "",
            dataIndex: "status",
            className: "col-status",
            render: (text: string, record: any) => {
                return record.status === "Open" ? (
                    <FontAwesomeIcon
                        icon={checkRegular}
                        className="cursor-pointer set-status"
                        onClick={() => handUpdateStatus(record, "Closed")}
                    />
                ) : (
                    <FontAwesomeIcon
                        icon={checkSolid}
                        className="cursor-pointer set-status"
                        onClick={() => handUpdateStatus(record, "Open")}
                    />
                );
            },
            // fixed: true,
            index: "0",
            width: 50,
        },
        localTableColumn?.find((p: any) => p.title === "Title")?.title
            ? {
                  title: "Title",
                  dataIndex: "title",
                  //   fixed: true,
                  render: (text: string, record: any) => {
                      return (
                          <Space className="w-100">
                              <PhoneOutlined style={{ marginTop: 2 }} />
                              <Typography.Link
                                  className="table-link"
                                  onClick={() => {
                                      setDrawerUpdateOpen(true);
                                      setDrawerUpdateData(record);
                                  }}
                              >
                                  {text}
                              </Typography.Link>
                          </Space>
                      );
                  },
                  width: 350,
                  index: localTableColumn?.find((p: any) => p.title === "Title")
                      ?.id,
                  //   sorter: true,
              }
            : {},
        localTableColumn?.find((p: any) => p.title === "Start Date")?.title
            ? {
                  title: "Start Date",
                  dataIndex: "start_date",
                  width: 300,
                  render: (text: string, record: any) => {
                      return (
                          <>
                              {moment(
                                  `${record.start_date}${
                                      record.start_time
                                          ? " " + record.start_time
                                          : ""
                                  }`
                              ).format("MMM DD, YYYY hh:mm A")}
                          </>
                      );
                  },
                  index: localTableColumn?.find(
                      (p: any) => p.title === "Start Date"
                  )?.id,
                  //   sorter: true,
              }
            : {},
        localTableColumn?.find((p: any) => p.title === "Duration")?.title
            ? {
                  title: "Duration",
                  dataIndex: "duration",
                  index: localTableColumn?.find(
                      (p: any) => p.title === "Duration"
                  )?.id,
                  //   sorter: true,
                  width: 350,
              }
            : {},
        localTableColumn?.find((p: any) => p.title === "Owner")?.title
            ? {
                  title: "Owner",
                  dataIndex: "owner",
                  index: localTableColumn?.find((p: any) => p.title === "Owner")
                      ?.id,
                  //   sorter: true,
                  width: 350,
              }
            : {},
        localTableColumn?.find((p: any) => p.title === "Title (Deal)")?.title
            ? {
                  title: "Title (Deal)",
                  dataIndex: "title2",
                  index: localTableColumn?.find(
                      (p: any) => p.title === "Title (Deal)"
                  )?.id,
                  //   sorter: true,
                  width: 350,
              }
            : {},
        localTableColumn?.find((p: any) => p.title === "Name (Contact)")?.title
            ? {
                  title: "Name (Contact)",
                  dataIndex: "name",
                  index: localTableColumn?.find(
                      (p: any) => p.title === "Name (Contact)"
                  )?.id,
                  //   sorter: true,
                  width: 350,
              }
            : {},
        localTableColumn?.find((p: any) => p.title === "Tags")?.title
            ? {
                  title: "Tags",
                  dataIndex: "tags",
                  render: (text: string, record: any) => {
                      return (
                          <>
                              {record?.activity_tags &&
                                  record?.activity_tags.map(
                                      (item: any, key: React.Key) => {
                                          return <Tag>{item.tag}</Tag>;
                                      }
                                  )}
                          </>
                      );
                  },
                  index: localTableColumn?.find((p: any) => p.title === "Tags")
                      ?.id,
                  //   sorter: true,
                  width: 350,
              }
            : {},
        localTableColumn?.find((p: any) => p.title === "End Date")?.title
            ? {
                  title: "End Date",
                  dataIndex: "end_date",
                  width: 300,
                  render: (text: string, record: any) => {
                      return (
                          <>
                              {record.end_date ? (
                                  <>
                                      {moment(
                                          `${record.end_date}${
                                              record.end_time
                                                  ? " " + record.end_time
                                                  : ""
                                          }`
                                      ).format("MMM DD, YYYY hh:mm A")}
                                  </>
                              ) : (
                                  ""
                              )}
                          </>
                      );
                  },
                  index: localTableColumn?.find(
                      (p: any) => p.title === "End Date"
                  )?.id,
                  //   sorter: true,
              }
            : {},
        localTableColumn?.find((p: any) => p.title === "Availability")?.title
            ? {
                  title: "Availability",
                  dataIndex: "name",
                  index: localTableColumn?.find(
                      (p: any) => p.title === "Availability"
                  )?.id,
                  //   sorter: true,
                  width: 350,
              }
            : {},
        localTableColumn?.find((p: any) => p.title === "Location")?.title
            ? {
                  title: "Location",
                  dataIndex: "name",
                  index: localTableColumn?.find(
                      (p: any) => p.title === "Location"
                  )?.id,
                  //   sorter: true,
                  width: 350,
              }
            : {},
        localTableColumn?.find((p: any) => p.title === "Video Conferencing")
            ?.title
            ? {
                  title: "Video Conferencing",
                  dataIndex: "name",
                  index: localTableColumn?.find(
                      (p: any) => p.title === "Video Conferencing"
                  )?.id,
                  //   sorter: true,
                  width: 350,
              }
            : {},
        localTableColumn?.find((p: any) => p.title === "Id")?.title
            ? {
                  title: "Id",
                  dataIndex: "id",
                  index: localTableColumn?.find((p: any) => p.title === "Id")
                      ?.id,
                  //   sorter: true,
                  width: 100,
              }
            : {},
        localTableColumn?.find((p: any) => p.title === "Created By")?.title
            ? {
                  title: "Created By",
                  dataIndex: "created_by",
                  index: localTableColumn?.find(
                      (p: any) => p.title === "Created By"
                  )?.id,
                  //   sorter: true,
                  width: 300,
              }
            : {},
        localTableColumn?.find((p: any) => p.title === "Completed Date")?.title
            ? {
                  title: "Completed Date",
                  dataIndex: "created_by",
                  index: localTableColumn?.find(
                      (p: any) => p.title === "Completed Date"
                  )?.id,
                  //   sorter: true,
                  width: 300,
              }
            : {},
        localTableColumn?.find((p: any) => p.title === "Completed Date")?.title
            ? {
                  title: "Completed Date",
                  dataIndex: "created_by",
                  index: localTableColumn?.find(
                      (p: any) => p.title === "Completed Date"
                  )?.id,
                  //   sorter: true,
                  width: 300,
              }
            : {},
        localTableColumn?.find((p: any) => p.title === "Last Modified By")
            ?.title
            ? {
                  title: "Last Modified By",
                  dataIndex: "created_by",
                  index: localTableColumn?.find(
                      (p: any) => p.title === "Last Modified By"
                  )?.id,
                  //   sorter: true,
                  width: 300,
              }
            : {},
        localTableColumn?.find((p: any) => p.title === "Created At")?.title
            ? {
                  title: "Created At",
                  dataIndex: "created_by",
                  index: localTableColumn?.find(
                      (p: any) => p.title === "Created At"
                  )?.id,
                  //   sorter: true,
                  width: 300,
              }
            : {},
        localTableColumn?.find((p: any) => p.title === "Last Note Added At")
            ?.title
            ? {
                  title: "Last Note Added At",
                  dataIndex: "created_by",
                  index: localTableColumn?.find(
                      (p: any) => p.title === "Last Note Added At"
                  )?.id,
                  //   sorter: true,
                  width: 300,
              }
            : {},
        localTableColumn?.find((p: any) => p.title === "Last Modified Date")
            ?.title
            ? {
                  title: "Last Modified Date",
                  dataIndex: "created_by",
                  index: localTableColumn?.find(
                      (p: any) => p.title === "Last Modified Date"
                  )?.id,
                  //   sorter: true,
                  width: 300,
              }
            : {},
        localTableColumn?.find((p: any) => p.title === "Last Note Added")?.title
            ? {
                  title: "Last Note Added",
                  dataIndex: "created_by",
                  index: localTableColumn?.find(
                      (p: any) => p.title === "Last Note Added"
                  )?.id,
                  //   sorter: true,
                  width: 300,
              }
            : {},
        localTableColumn?.find((p: any) => p.title === "Last Note Added By")
            ?.title
            ? {
                  title: "Last Note Added By",
                  dataIndex: "created_by",
                  index: localTableColumn?.find(
                      (p: any) => p.title === "Last Note Added By"
                  )?.id,
                  //   sorter: true,
                  width: 300,
              }
            : {},
        localTableColumn?.find((p: any) => p.title === "Created Longitude")
            ?.title
            ? {
                  title: "Created Longitude",
                  dataIndex: "created_by",
                  index: localTableColumn?.find(
                      (p: any) => p.title === "Created Longitude"
                  )?.id,
                  //   sorter: true,
                  width: 300,
              }
            : {},
        localTableColumn?.find((p: any) => p.title === "Created Latitude")
            ?.title
            ? {
                  title: "Created Latitude",
                  dataIndex: "created_by",
                  index: localTableColumn?.find(
                      (p: any) => p.title === "Created Latitude"
                  )?.id,
                  //   sorter: true,
                  width: 300,
              }
            : {},
        localTableColumn?.find((p: any) => p.title === "Created Address")?.title
            ? {
                  title: "Created Address",
                  dataIndex: "created_by",
                  index: localTableColumn?.find(
                      (p: any) => p.title === "Created Address"
                  )?.id,
                  //   sorter: true,
                  width: 300,
              }
            : {},
        localTableColumn?.find((p: any) => p.title === "Type")?.title
            ? {
                  title: "Type",
                  dataIndex: "type",
                  index: localTableColumn?.find((p: any) => p.title === "Type")
                      ?.id,
                  //   sorter: true,
                  width: 100,
              }
            : {},
    ];

    const [stateColumns, setStateColumns] = useState(colums);
    const { dataCustomField, isLoadingCustomField } = useActivutyCustomField();

    useEffect(() => {
        if (dataCustomField?.data) {
            let cols = [...colums];
            let customCols: any = [];

            dataCustomField?.data.map((item: any) => {
                customCols.push({
                    title: item?.label,
                    dataIndex: item?.name,
                    index: localTableColumn?.find(
                        (p: any) => p.title === item?.label
                    )?.id,
                    // sorter: true,
                    width: 250,
                    render: (text: any, record: any) => {
                        let val = "";

                        record?.custom_field_values.filter((data: any) => {
                            if (data.field_name === item?.name) {
                                // console.log("data.value", data, item?.name);
                                // if (item?.type === "Text Area") {
                                //     val = data.value;
                                // } else {
                                // }
                                val = data.value;
                            }
                        });

                        return val;
                    },
                });
            });

            let mergeCols = [...cols, ...customCols];

            // filter only selected column
            let filterColumns = mergeCols.filter((item) => {
                if (item?.index) {
                    let row = {
                        ...item,
                        index: Number(item.index),
                    };
                    return row;
                }
            });

            // sort selected columns
            let sortedColumns = [...filterColumns].sort(
                (a, b) => Number(a.index) - Number(b.index)
            );

            // remove index variable
            // sortedColumns.forEach(function (x) {
            //     delete x.index;
            // });

            setStateColumns(sortedColumns);
            // console.log("dataCustomField", customCols);
            // console.log("dataCustomField", sortedColumns);
            // console.log("dataCustomField", dataCustomField?.data);
        }
        // console.log("dataSource", dataSource?.data?.data);
    }, [
        dataCustomField,
        localStorage.activitiesSelectColumn,
        dataSource?.data?.data,
    ]);

    const [drawerUpdateOpen, setDrawerUpdateOpen] = useState(false);
    const [drawerUpdateData, setDrawerUpdateData] = useState(null);

    const handleOpenManageColumnFieldOpen = () => {
        setModalManageColumnField({
            ...modalManageColumnField,
            show: true,
        });
    };

    const handleOpenManageColumnFieldClose = () => {
        setModalManageColumnField({
            show: false,
            title: "Select Field Type",
            step: 1,
        });
    };

    const { dataType, isLoadingType } = useActivityType();

    const onChangeTypeFilter = (val: any) => {
        let setTypeValue: any = ["All"];
        let listType = dataType?.data.map((item: any) => {
            return item.type;
        });
        if (val === "All") {
            setTypeValue = ["All"];
        } else {
            let findIndex = dataFilter.type.findIndex((item) => item === val);
            if (findIndex !== -1) {
                let updatedData = [...dataFilter.type];
                updatedData.splice(findIndex, 1);
                setTypeValue = updatedData.length > 0 ? updatedData : ["All"];
            } else {
                if (
                    dataFilter.type.length > 0 &&
                    dataFilter.type[0] === "All"
                ) {
                    setTypeValue = [val];
                } else {
                    setTypeValue = [...dataFilter.type];
                    setTypeValue.push(val);
                }
            }

            if (listType.length === setTypeValue.length) {
                setTypeValue = ["All"];
            }
        }
        // console.log("onChangeTypeFilter", setTypeValue);

        let newTypeValue: any = {
            ...dataFilter,
            type: setTypeValue,
        };
        setDataFilter(newTypeValue);
    };

    const setActiveTypeFilter = (val: string) => {
        let checked = false;
        dataFilter.type.findIndex((element) => {
            if (element === val) {
                checked = true;
            }
        });

        return checked ? "ant-radio-button-wrapper-checked-selected" : "";
    };

    const setActiveDateFilter = (val: string) => {
        if (dataFilter.date_filter === val) {
            return "ant-radio-button-wrapper-checked-selected";
        }
    };

    const setChangeDateFilter = (val: string) => {
        let newValues = {
            ...dataFilter,
            date_filter: val,
        };
        if (dataFilter.date_filter === val) {
            newValues = {
                ...dataFilter,
                date_filter: "",
            };
        }

        setDataFilter(newValues);
    };

    const favoriteMenuList = [
        "Activites I am following",
        "All Closed Activities",
        "All Open Activities",
        "My Open Activities",
        "My Overdue Activites",
    ];
    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const [favoritesList, setFavoritesList] = useState(
        localStorage.activitiesFavoriteFilter
            ? JSON.parse(localStorage.activitiesFavoriteFilter)
            : []
    );

    const onClickFavorite = (val: any) => {
        let newValues = {
            ...dataFilter,
            favorite_filter: val,
        };
        setDataFilter(newValues);
        localStorage.setItem("activitiesFavorite", val);
        setDropdownVisible(false);
    };

    const onClickFavoriteActive = (val: any) => {
        return val === dataFilter.favorite_filter ? (
            <FontAwesomeIcon icon={faCheck} className="icon-selected" />
        ) : (
            ""
        );
    };

    const onClickFavoriteSelected = (val: any) => {
        let newVal: any = [...favoritesList];

        let findIndex = favoritesList.findIndex((item) => item === val);
        if (findIndex !== -1) {
            newVal.splice(findIndex, 1);
        } else {
            newVal.push(val);
        }

        setFavoritesList(newVal);
        localStorage.setItem(
            "activitiesFavoriteFilter",
            JSON.stringify(newVal)
        );
    };

    const onClickFavoriteSelectedActive = (val: any) => {
        const index: any = favoritesList.findIndex(
            (element: string) => element === val
        );

        return index !== Number("-1") ? (
            <FontAwesomeIcon icon={starSolid} className="icon-selected" />
        ) : (
            <FontAwesomeIcon icon={starRegular} />
        );
    };

    const itemsFilter: MenuProps["items"] = [
        {
            key: "1",
            label: (
                <>
                    <Card bordered={false}>
                        {/* <div className="p-sm">
                            <Search
                                placeholder="input search text"
                                allowClear
                                // onSearch={onSearch}
                                style={{ width: "100%" }}
                            />
                        </div> */}

                        <Tabs
                            defaultActiveKey="tab2"
                            className="m-b-xs"
                            // onChange={handleTabChange}
                        >
                            <Tabs.TabPane tab="FAVORITES" key="tab1">
                                {favoritesList.length === 0 && (
                                    <div className="p-md text-center">
                                        <Typography.Text className="font-16px">
                                            You have no favorites
                                        </Typography.Text>
                                        <br />
                                        <Typography.Text>
                                            Select views as favorites to make it
                                            appear here.
                                        </Typography.Text>
                                    </div>
                                )}

                                <div className="menu-favorite-list">
                                    {favoritesList.map(
                                        (item: string, key: number) => {
                                            return (
                                                <div
                                                    className="menu-favorite-list-item"
                                                    key={key}
                                                    onClick={() =>
                                                        onClickFavorite(item)
                                                    }
                                                >
                                                    <Space
                                                        className="w-100"
                                                        style={{
                                                            display: "flex",
                                                            justifyContent:
                                                                "space-between",
                                                        }}
                                                    >
                                                        <Space>
                                                            <FontAwesomeIcon
                                                                icon={faLock}
                                                            />
                                                            {item}
                                                        </Space>

                                                        <Space
                                                            style={{
                                                                width: 36,
                                                            }}
                                                        >
                                                            <Button
                                                                style={{
                                                                    padding: 0,
                                                                }}
                                                                type="link"
                                                                onClick={(
                                                                    event: any
                                                                ) => {
                                                                    event.stopPropagation();
                                                                    onClickFavoriteSelected(
                                                                        item
                                                                    );
                                                                }}
                                                            >
                                                                {onClickFavoriteSelectedActive(
                                                                    item
                                                                )}
                                                            </Button>

                                                            {onClickFavoriteActive(
                                                                item
                                                            )}
                                                        </Space>
                                                    </Space>
                                                </div>
                                            );
                                        }
                                    )}
                                </div>
                            </Tabs.TabPane>

                            <Tabs.TabPane tab="ALL VIEWS" key="tab2">
                                <div className="p-l-md p-r-sm p-b-xs">
                                    <Typography.Text>SYSTEM</Typography.Text>
                                </div>

                                <div className="menu-favorite-list">
                                    {favoriteMenuList.map(
                                        (item: string, key: number) => {
                                            return (
                                                <div
                                                    className="menu-favorite-list-item"
                                                    key={key}
                                                    onClick={() =>
                                                        onClickFavorite(item)
                                                    }
                                                >
                                                    <Space
                                                        className="w-100"
                                                        style={{
                                                            display: "flex",
                                                            justifyContent:
                                                                "space-between",
                                                        }}
                                                    >
                                                        <Space>
                                                            <FontAwesomeIcon
                                                                icon={faLock}
                                                            />
                                                            {item}
                                                        </Space>

                                                        <Space
                                                            style={{
                                                                width: 36,
                                                            }}
                                                        >
                                                            <Button
                                                                style={{
                                                                    padding: 0,
                                                                }}
                                                                type="link"
                                                                onClick={(
                                                                    event: any
                                                                ) => {
                                                                    event.stopPropagation();
                                                                    onClickFavoriteSelected(
                                                                        item
                                                                    );
                                                                }}
                                                            >
                                                                {onClickFavoriteSelectedActive(
                                                                    item
                                                                )}
                                                            </Button>

                                                            {onClickFavoriteActive(
                                                                item
                                                            )}
                                                        </Space>
                                                    </Space>
                                                </div>
                                            );
                                        }
                                    )}
                                </div>
                            </Tabs.TabPane>
                        </Tabs>
                    </Card>
                </>
            ),
        },
    ];

    const handUpdateStatus = (record: any, status: string) => {
        console.log("handUpdateStatus", record);
        let values = {
            data: {
                id: record.id,
                status: status,
            },
            url: "/api/activities_update",
        };
        updateStatus.mutate(values);
    };

    const updateStatus = useMutation(mutatePost, {
        onSuccess: (res) => {
            queryClient.invalidateQueries("activities");
            notification.success({
                message: "Success",
                description: "Successfully updated",
            });
        },
    });

    return (
        <>
            <Row className="activity-group-row">
                <Col md={24}>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: 15,
                        }}
                    >
                        <div>
                            <Dropdown
                                open={isDropdownVisible}
                                onOpenChange={setDropdownVisible}
                                overlayClassName="favorites-filter"
                                menu={{ items: itemsFilter }}
                                placement="bottomLeft"
                                trigger={["click"]}
                            >
                                <Button>
                                    <Space>
                                        {dataFilter.favorite_filter}
                                        <DownOutlined />
                                    </Space>
                                </Button>
                            </Dropdown>
                        </div>

                        <div>
                            <span style={{ marginRight: 10 }}>
                                <Radio.Group className="activity-type-filter">
                                    <Radio.Button
                                        value="Overdue"
                                        className="ant-radio-button-wrapper-checked-selected"
                                    >
                                        List
                                    </Radio.Button>
                                    <Radio.Button
                                        value="Today"
                                        onClick={() =>
                                            navigate("/activities/calendar")
                                        }
                                    >
                                        Calendar
                                    </Radio.Button>
                                </Radio.Group>
                            </span>
                            <span style={{ marginRight: 10 }}>
                                <Button type="primary" onClick={showModalAdd}>
                                    <PlusCircleOutlined /> &nbsp;Activity
                                </Button>
                            </span>
                            <span style={{ marginRight: 10 }}>
                                <Tooltip
                                    title="Manage Columns"
                                    placement="bottom"
                                >
                                    <Button
                                        onClick={() => {
                                            setIsModalManageColumnOpen(true);
                                        }}
                                    >
                                        <InsertRowBelowOutlined />
                                    </Button>
                                </Tooltip>
                            </span>
                            <span style={{ marginRight: 10 }}>
                                <Dropdown
                                    menu={{ items: action_type }}
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
                        <Radio.Group className="activity-type-filter">
                            <Tooltip title="All" placement="bottom">
                                <Radio.Button
                                    value="All"
                                    onClick={() => onChangeTypeFilter("All")}
                                    className={`${setActiveTypeFilter("All")}`}
                                >
                                    All
                                </Radio.Button>
                            </Tooltip>

                            {dataType?.data &&
                                dataType?.data.map(
                                    (item: any, key: React.Key) => {
                                        return (
                                            <Tooltip
                                                title={item?.type}
                                                placement="bottom"
                                                key={key}
                                            >
                                                <Radio.Button
                                                    // className="ant-radio-button-wrapper-checked"
                                                    className={`${setActiveTypeFilter(
                                                        item?.type
                                                    )}`}
                                                    value={item?.type}
                                                    onClick={() =>
                                                        onChangeTypeFilter(
                                                            item?.type
                                                        )
                                                    }
                                                >
                                                    {ComponentActivityTypeIcon(
                                                        item?.icon
                                                    )}
                                                </Radio.Button>
                                            </Tooltip>
                                        );
                                    }
                                )}
                        </Radio.Group>

                        <Radio.Group className="activity-type-filter">
                            <Radio.Button
                                value="Overdue"
                                className={`${setActiveDateFilter("Overdue")}`}
                                onClick={() => setChangeDateFilter("Overdue")}
                            >
                                Overdue
                            </Radio.Button>
                            <Radio.Button
                                value="Today"
                                className={`${setActiveDateFilter("Today")}`}
                                onClick={() => setChangeDateFilter("Today")}
                            >
                                Today
                            </Radio.Button>
                            <Radio.Button
                                value="Tomorrow"
                                className={`${setActiveDateFilter("Tomorrow")}`}
                                onClick={() => setChangeDateFilter("Tomorrow")}
                            >
                                Tomorrow
                            </Radio.Button>
                            <Radio.Button
                                value="This Week"
                                className={`${setActiveDateFilter(
                                    "This Week"
                                )}`}
                                onClick={() => setChangeDateFilter("This Week")}
                            >
                                This Week
                            </Radio.Button>
                            <Radio.Button
                                value="Custom"
                                className={`${setActiveDateFilter("Custom")}`}
                                onClick={() => setChangeDateFilter("Custom")}
                            >
                                Custom
                            </Radio.Button>
                        </Radio.Group>
                    </div>

                    <Table
                        loading={isLoadingUsers}
                        dataSource={dataSource?.data && dataSource?.data?.data}
                        // columns={sortedColumns}
                        columns={stateColumns}
                        onChange={onChange}
                        rowKey={(record) => record.id}
                        rowSelection={{ ...rowSelection }}
                        scroll={{ x: "max-content" }}
                        pagination={{
                            total: dataSource?.data?.total,
                            current: dataFilter.page,
                            pageSize: dataFilter.page_size,
                            showSizeChanger: true,
                            pageSizeOptions: [10, 20, 50, 100, 200],
                            showTotal: (total, range) =>
                                `${range[0]}-${range[1]} of ${total} items`,
                        }}
                    />
                </Col>
            </Row>

            <ModalAddActivity
                isModalOpenAdd={isModalOpenAdd}
                handleOkAdd={handleOkAdd}
                handleCancelAdd={handleCancelAdd}
            />

            <ModalManageColumn
                isModalManageColumnOpen={isModalManageColumnOpen}
                setIsModalManageColumnOpen={setIsModalManageColumnOpen}
                activitiesSelectColumn={activitiesSelectColumn}
                setActivitiesSelectColumn={setActivitiesSelectColumn}
                localStorageName="activitiesSelectColumn"
                handleOpenManageColumnFieldOpen={
                    handleOpenManageColumnFieldOpen
                }
            />

            {drawerUpdateOpen && (
                <DrawerUpdateActivity
                    drawerUpdateOpen={drawerUpdateOpen}
                    setDrawerUpdateOpen={setDrawerUpdateOpen}
                    drawerUpdateData={drawerUpdateData}
                    setDrawerUpdateData={setDrawerUpdateData}
                />
            )}

            <ModalManageColumnFIeld
                modalManageColumnField={modalManageColumnField}
                setModalManageColumnField={setModalManageColumnField}
                handleOpenManageColumnFieldClose={
                    handleOpenManageColumnFieldClose
                }
            />
        </>
    );
};

export default ActivityTable;
