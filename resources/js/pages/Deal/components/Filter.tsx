import { CaretDownFilled } from "@ant-design/icons";
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
} from "antd";

import React, { useState } from "react";

const handleChange = (value: string) => {
    console.log(`selected ${value}`);
};

interface Filter {
    openFilter: boolean;
    setOpenFilter: any;
}

const Filter: React.FC<Filter> = ({ openFilter, setOpenFilter }) => {
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

                <Typography
                    className="m-t-xl"
                    style={{ display: "flex", justifyContent: "center" }}
                >
                    No selected filters found
                </Typography>
                <Button type="primary" block className="m-t-xl">
                    Add Filter
                </Button>
            </Drawer>
        </>
    );
};

export default Filter;
