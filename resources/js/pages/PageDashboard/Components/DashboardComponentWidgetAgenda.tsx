import React, { useState } from "react";
import { CaretDownFilled } from "@ant-design/icons";
import {
    Avatar,
    Button,
    Card,
    Col,
    Dropdown,
    List,
    Progress,
    Row,
    Select,
    Space,
    Typography,
} from "antd";
import type, { SelectProps } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-regular-svg-icons";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";

interface MyProps {
    props: any;
}

const data = [
    {
        title: "Ant Design Title 1",
    },
    {
        title: "Ant Design Title 2",
    },
    {
        title: "Ant Design Title 3",
    },
    {
        title: "Ant Design Title 4",
    },
];

const typeOption: SelectProps["options"] = [
    {
        value: "All",
        label: "All",
    },
    {
        value: "Activities",
        label: "Activities",
    },
    {
        value: "Emails",
        label: "Emails",
    },
    {
        value: "Texts",
        label: "Texts",
    },
];

const DashboardComponentWidgetAgenda: React.FC<MyProps> = (props) => {
    const {} = props;

    return (
        <>
            <div
                style={{
                    overflow: "auto",
                }}
            >
                {/* <Row gutter={24}>
                    <Col xs={24} sm={24} md={6}>
                        <Select className="w-100" defaultValue={"All"}>
                            {typeOption.map((item, key) => {
                                return (
                                    <Select.Option key={key} value={item.value}>
                                        {item.label}
                                    </Select.Option>
                                );
                            })}
                        </Select>
                    </Col>
                </Row> */}

                <List
                    // pagination={{ position, align }}
                    dataSource={data}
                    renderItem={(item, index) => (
                        <List.Item>
                            <List.Item.Meta
                                avatar={
                                    <Avatar
                                        src={`https://xsgames.co/randomusers/avatar.php?g=pixel&key=${index}`}
                                    />
                                }
                                title={
                                    <a href="https://ant.design">
                                        {item.title}
                                    </a>
                                }
                                description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                            />
                        </List.Item>
                    )}
                />
            </div>
        </>
    );
};

export default DashboardComponentWidgetAgenda;
