import {
    CaretDownFilled,
    CloseCircleOutlined,
    CloseSquareOutlined,
    UserOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import {
    Button,
    Col,
    Dropdown,
    Modal,
    Row,
    Space,
    Input,
    Select,
    Typography,
    Checkbox,
    Divider,
    Drawer,
    Popover,
    List,
    Card,
} from "antd";
import {
    TContact,
    TFilter,
    TFilterCondition,
    TFilters,
} from "../../../entities";

import React, { useEffect, useState } from "react";
import menu from "antd/es/menu";
import Search from "antd/es/input/Search";
import { arraysAreEqual, useArray } from "../../../helpers";
import { FILTER_OPTIONS, defaultFilter } from "../../../constants";
import FilterAddUpdateModal from "../../../components/FilterAddUpdateModal";
import { useMutation } from "react-query";
import { deleteFilterMutation } from "../../../api/mutation/useFilterMutation";
import queryClient from "../../../queryClient";
import { Popconfirm } from "antd/lib";
import { useAppContextProvider } from "../../../context/AppContext";
import { useCustomFields } from "../../../api/query/customFieldQuery";

interface Props {
    openFilter: boolean;
    setOpenFilter: any;
    setFilter: any;
    filter: TFilter;
    type: string;
}
const Filter: React.FC<Props> = ({
    openFilter,
    setOpenFilter,
    filter,
    setFilter,
    type,
}) => {
    const {
        array: conditions,
        add,
        removeByKey,
        updateByKey,
        setInitialArray,
    } = useArray<TFilterCondition>();

    const { isRoleStats } = useAppContextProvider();
    const [searchKey, setSearchKey] = useState("");
    const [conditionalOperator, setConditionalOperator] = useState(
        filter.filters.conditionalOperator
    );
    const [isCreateFilterModalOpen, setIsCreateFilterModalOpen] =
        useState(false);

    const {
        data: contactFields,
        isLoading: isContactFieldsLoading,
        refetch: refetchContactFields,
    } = useCustomFields("contact");

    const columns = contactFields?.map((field) => {
        return { label: field.label, value: field.fieldName };
    });

    const deleteFilter = useMutation((id: string) => deleteFilterMutation(id), {
        onSuccess: () => {
            queryClient.invalidateQueries("filters");
            setFilter(defaultFilter);
        },
        onError: (e: any) => {
            console.log(e.message || "An error occurred");
        },
    });
    useEffect(() => {
        setFilter({
            ...filter,
            filters: { conditions, conditionalOperator },
        });
    }, [conditions, conditionalOperator]);

    useEffect(() => {
        if (filter.filters) {
            if (!arraysAreEqual(conditions, filter.filters.conditions)) {
                setInitialArray(filter.filters.conditions);
            }
            if (conditionalOperator !== filter.filters.conditionalOperator) {
                setConditionalOperator(filter.filters.conditionalOperator);
            }
        }
    }, [filter]);
    return (
        <>
            <Drawer
                title="Filters"
                placement="right"
                onClose={() => setOpenFilter(false)}
                open={openFilter}
                mask={false}
                extra={
                    <Button
                        type="link"
                        onClick={() => {
                            setInitialArray([]);
                        }}
                    >
                        Clear all
                    </Button>
                }
                footer={
                    <Space>
                        <Button
                            type="primary"
                            onClick={() => setIsCreateFilterModalOpen(true)}
                            disabled={
                                !filter.filters.conditions.length || isRoleStats
                            }
                        >
                            Save as View
                        </Button>

                        {filter.id && (
                            <Popconfirm
                                title="Delete"
                                description="Are you sure to delete this view?"
                                onConfirm={() => deleteFilter.mutate(filter.id)}
                                okText="Yes"
                                cancelText="No"
                            >
                                <Button
                                    type="primary"
                                    danger
                                    disabled={isRoleStats}
                                >
                                    {`Delete "${filter.name}"`}
                                </Button>
                            </Popconfirm>
                        )}
                    </Space>
                }
            >
                <Select
                    defaultValue="and"
                    style={{ width: "100%" }}
                    onChange={(e: "and" | "or") => setConditionalOperator(e)}
                    showSearch
                    options={[
                        {
                            value: "and",
                            label: "Match all filters (AND)",
                        },
                        {
                            value: "or",
                            label: "Match any filters (OR)",
                        },
                    ]}
                />

                <Typography.Title className="m-t-md" level={5}>
                    SELECTED FILTERS
                </Typography.Title>
                {conditions.length ? (
                    conditions.map((val) => (
                        <Space className="w-100" direction="vertical">
                            <Card
                                extra={
                                    <Button
                                        type="link"
                                        onClick={() => removeByKey(val.key)}
                                        className="p-0"
                                    >
                                        <CloseCircleOutlined />
                                    </Button>
                                }
                                title={
                                    <Space>
                                        <UserOutlined />
                                        {` > ${val.column.label}`}
                                    </Space>
                                }
                            >
                                <Space direction="vertical" className="w-100">
                                    <Select
                                        style={{ width: "100%" }}
                                        onChange={(e) =>
                                            updateByKey(val.key, {
                                                ...val,
                                                condition: e,
                                            })
                                        }
                                        options={FILTER_OPTIONS}
                                        value={val.condition}
                                        showSearch
                                    />
                                    {!["empty", "notEmpty"].includes(
                                        val.condition
                                    ) && (
                                        <Input
                                            // value={val.value}
                                            // placeholder={val.value}
                                            onBlur={(e) =>
                                                updateByKey(val.key, {
                                                    ...val,
                                                    value: e.target.value,
                                                })
                                            }
                                        />
                                    )}
                                </Space>
                            </Card>
                        </Space>
                    ))
                ) : (
                    <Typography
                        className="m-t-xl"
                        style={{ display: "flex", justifyContent: "center" }}
                    >
                        No selected filters found
                    </Typography>
                )}

                <Popover
                    content={
                        <Space direction="vertical" size={"large"}>
                            <Search
                                placeholder="Search"
                                onChange={(e) => setSearchKey(e.target.value)}
                            />

                            <List
                                dataSource={columns?.filter((e) =>
                                    e.label
                                        .toLocaleLowerCase()
                                        .includes(searchKey.toLowerCase())
                                )}
                                style={{
                                    maxHeight: "200px",
                                    overflowY: "auto",
                                }}
                                renderItem={(item) => (
                                    <div
                                        style={{
                                            cursor: "pointer", // Add pointer cursor
                                            backgroundColor: "white", // Set the default background color
                                            padding: "8px",
                                        }}
                                        onClick={() => {
                                            add({
                                                key: item.value,
                                                column: item,
                                                condition: "contains",
                                                value: "",
                                            });
                                        }}
                                    >
                                        {item.label}
                                    </div>
                                )}
                            />
                        </Space>
                    }
                    trigger={"click"}
                    placement="left"
                >
                    <Button type="primary" block className="m-t-xl">
                        Add Filter
                    </Button>
                </Popover>
            </Drawer>

            <FilterAddUpdateModal
                isModalOpen={isCreateFilterModalOpen}
                closeModal={() => setIsCreateFilterModalOpen(false)}
                filter={filter}
                type={type}
                // templateFolder={templateFolder}
            />
        </>
    );
};

export default Filter;
