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
import { TContact } from "../../../entities";

import React, { useState } from "react";
import menu from "antd/es/menu";
import Search from "antd/es/input/Search";
import { useArray } from "../../../helpers";
import { FILTER_OPTIONS } from "../../../constants";

const handleChange = (value: string) => {
    console.log(`selected ${value}`);
};

interface Props {
    openFilter: boolean;
    setOpenFilter: any;
    columns?: { label: string; value: string }[];
}

interface IFilter {
    key: string;
    column: { label: string; value: string };
    condition: string;
    value: string;
}

const Filter: React.FC<Props> = ({ openFilter, setOpenFilter, columns }) => {
    const {
        array: filters,
        add,
        removeByKey,
        updateByKey,
        clear,
    } = useArray<IFilter>();

    const [searchKey, setSearchKey] = useState("");
    return (
        <>
            <Drawer
                title="Filters"
                placement="right"
                onClose={() => setOpenFilter(false)}
                open={openFilter}
                mask={false}
                extra={<Button type="link">Clear all</Button>}
                footer={[<Button type="primary">Save as View</Button>]}
            >
                <Select
                    defaultValue="Match all filters (AND)"
                    style={{ width: "100%" }}
                    onChange={handleChange}
                    showSearch
                    options={[
                        {
                            value: "Match all filters (AND)",
                            label: "Match all filters (AND)",
                        },
                        {
                            value: "Match any filters (OR)",
                            label: "Match any filters (OR)",
                        },
                    ]}
                />

                <Typography.Title className="m-t-md" level={5}>
                    SELECTED FILTERS
                </Typography.Title>
                {filters.length ? (
                    filters.map((filter) => (
                        <Space className="w-100" direction="vertical">
                            <Card
                                extra={
                                    <Button
                                        type="link"
                                        onClick={() => removeByKey(filter.key)}
                                        className="p-0"
                                    >
                                        <CloseCircleOutlined />
                                    </Button>
                                }
                                title={
                                    <Space>
                                        <UserOutlined />
                                        {` > ${filter.column.label} 1`}
                                    </Space>
                                }
                            >
                                <Space direction="vertical" className="w-100">
                                    <Select
                                        style={{ width: "100%" }}
                                        onChange={(e) =>
                                            updateByKey(filter.key, {
                                                ...filter,
                                                condition: e,
                                            })
                                        }
                                        options={FILTER_OPTIONS}
                                        value={filter.condition}
                                        showSearch
                                    />
                                    <Input
                                        value={filter.value}
                                        onBlur={(e) =>
                                            updateByKey(filter.key, {
                                                ...filter,
                                                value: e.target.value,
                                            })
                                        }
                                    />
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
        </>
    );
};

export default Filter;
