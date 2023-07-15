import React, { useState } from "react";
import { CaretDownFilled } from "@ant-design/icons";
import {
    Avatar,
    Button,
    Card,
    Col,
    Dropdown,
    List,
    Row,
    Select,
    Space,
    Typography,
    Table,
    Radio,
} from "antd";
import type, { SelectProps } from "antd";
import {
    faCalendar,
    faCheck,
    faClipboardCheck,
    faDownload,
    faFilter,
    faHome,
    faPlay,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ColumnsType } from "antd/es/table";
import { faTrashAlt } from "@fortawesome/free-regular-svg-icons";

const data = [
    {
        name: "Joanne Middleton PASCO AUCTION Deal Review",
        title: "Ant Design Title 1",
        description: "Joanne Middleton PASCO AUCTION",
        image: "J",
        color: "#FF5622",
    },
    {
        name: "Joanne Middleton PASCO AUCTION Deal Review",
        title: "Ant Design Title 1",
        description: "Joanne Middleton PASCO AUCTION",
        image: "J",
        color: "#FF5622",
    },
    {
        name: "Joanne Middleton PASCO AUCTION Deal Review",
        title: "Ant Design Title 1",
        description: "Joanne Middleton PASCO AUCTION",
        image: "J",
        color: "#FF5622",
    },
    {
        name: "Joanne Middleton PASCO AUCTION Deal Review",
        title: "Ant Design Title 1",
        description: "Joanne Middleton PASCO AUCTION",
        image: "J",
        color: "#FF5622",
    },
    {
        name: "Joanne Middleton PASCO AUCTION Deal Review",
        title: "Ant Design Title 1",
        description: "Joanne Middleton PASCO AUCTION",
        image: "J",
        color: "#FF5622",
    },
    {
        name: "Joanne Middleton PASCO AUCTION Deal Review",
        title: "Ant Design Title 1",
        description: "Joanne Middleton PASCO AUCTION",
        image: "J",
        color: "#FF5622",
    },
    {
        name: "Joanne Middleton PASCO AUCTION Deal Review",
        title: "Ant Design Title 1",
        description: "Joanne Middleton PASCO AUCTION",
        image: "J",
        color: "#FF5622",
    },
    {
        name: "Joanne Middleton PASCO AUCTION Deal Review",
        title: "Ant Design Title 1",
        description: "Joanne Middleton PASCO AUCTION",
        image: "J",
        color: "#FF5622",
    },
    {
        name: "Joanne Middleton PASCO AUCTION Deal Review",
        title: "Ant Design Title 1",
        description: "Joanne Middleton PASCO AUCTION",
        image: "J",
        color: "#FF5622",
    },
    {
        name: "Joanne Middleton PASCO AUCTION Deal Review",
        title: "Ant Design Title 1",
        description: "Joanne Middleton PASCO AUCTION",
        image: "J",
        color: "#FF5622",
    },
    {
        name: "Joanne Middleton PASCO AUCTION Deal Review",
        title: "Ant Design Title 1",
        description: "Joanne Middleton PASCO AUCTION",
        image: "J",
        color: "#FF5622",
    },
];

const optioData: SelectProps["options"] = [
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

const dataDeal = [
    {
        title: "Deals Created - Count",
        count: "0",
    },
    {
        title: "Open Deals - Count",
        count: "0",
    },
    {
        title: "Open Deals - Value",
        count: "0",
    },
    {
        title: "Deals Won - Count",
        count: "0",
    },
    {
        title: "Deals Won - Value",
        count: "0",
    },
    {
        title: "Deals Lost - Count",
        count: "0",
    },
    {
        title: "Deals Lost - Value",
        count: "0",
    },
    {
        title: "Win Ratio",
        count: "0%",
    },
    {
        title: "Avg. Time To Close",
        count: "0 days",
    },
    {
        title: "Avg. Won Deal Size",
        count: "0",
    },
    {
        title: "Avg. Won Deal Size",
        count: "0",
    },
    {
        title: "Avg. Won Deal Size",
        count: "0",
    },
    {
        title: "Avg. Won Deal Size",
        count: "0",
    },
];

interface DataType {
    key: React.Key;
    date: string;
    duration: string;
    type: string;
    outcome: string;
    company: any;
    contact_number: string;
    sm_number: string;
    user: string;
}

const columns: ColumnsType<DataType> = [
    {
        title: "Date",
        dataIndex: "date",
        key: "date",
    },
    {
        title: "Duration",
        dataIndex: "duration",
        key: "duration",
    },
    {
        title: "Type",
        dataIndex: "type",
        key: "type",
    },
    {
        title: "Outcome",
        dataIndex: "outcome",
        key: "outcome",
    },
    {
        title: "Contact/Deal/Compony",
        dataIndex: "company",
        key: "company",
    },
    {
        title: "Contact Number",
        dataIndex: "contact_number",
        key: "contact_number",
    },
    {
        title: "SM Number",
        dataIndex: "sm_number",
        key: "sm_number",
    },
    {
        title: "User",
        dataIndex: "user",
        key: "user",
    },
    {
        title: "Recording",
        dataIndex: "recording",
        key: "recording",
        render: (text, record) => {
            return (
                <Space wrap>
                    <Button
                    // style={{
                    //     width: 40,
                    //     height: 40,
                    // }}
                    >
                        <FontAwesomeIcon icon={faPlay} />
                    </Button>
                    <Button
                    // style={{
                    //     width: 40,
                    //     height: 40,
                    // }}
                    >
                        <FontAwesomeIcon icon={faTrashAlt} />
                    </Button>
                    <Button
                    // style={{
                    //     width: 40,
                    //     height: 40,
                    // }}
                    >
                        <FontAwesomeIcon icon={faDownload} />
                    </Button>
                </Space>
            );
        },
    },
];

const dataTable: DataType[] = [
    {
        key: "1",
        date: "Jul 10, 2023 04:36 PM",
        duration: "41s",
        type: "Outbound",
        outcome: "Outbound",
        company: "Donnie Schilling",
        contact_number: "+14404794551",
        sm_number: "+13039521461",
        user: "Jesse Ashley",
    },
    {
        key: "1",
        date: "Jul 10, 2023 04:36 PM",
        duration: "41s",
        type: "Outbound",
        outcome: "Outbound",
        company: "Donnie Schilling",
        contact_number: "+14404794551",
        sm_number: "+13039521461",
        user: "Jesse Ashley",
    },
    {
        key: "1",
        date: "Jul 10, 2023 04:36 PM",
        duration: "41s",
        type: "Outbound",
        outcome: "Outbound",
        company: "Donnie Schilling",
        contact_number: "+14404794551",
        sm_number: "+13039521461",
        user: "Jesse Ashley",
    },
    {
        key: "1",
        date: "Jul 10, 2023 04:36 PM",
        duration: "41s",
        type: "Outbound",
        outcome: "Outbound",
        company: "Donnie Schilling",
        contact_number: "+14404794551",
        sm_number: "+13039521461",
        user: "Jesse Ashley",
    },
    {
        key: "1",
        date: "Jul 10, 2023 04:36 PM",
        duration: "41s",
        type: "Outbound",
        outcome: "Outbound",
        company: "Donnie Schilling",
        contact_number: "+14404794551",
        sm_number: "+13039521461",
        user: "Jesse Ashley",
    },
];

const DashboardComponentWidget: React.FC = () => {
    // const layouts = getLayoutsFromSomewhere();

    return (
        <>
            <Row gutter={[12, 10]}>
                <Col xs={24} sm={24} md={12}>
                    <Card
                        style={{ height: 760 }}
                        headStyle={{ border: 0 }}
                        bodyStyle={{
                            paddingTop: 10,
                            overflow: "auto",
                            height: 640,
                        }}
                        title={
                            <div className="p-t-md">
                                <Typography.Text className="font-22px">
                                    My Agenda
                                </Typography.Text>
                                <br />
                                <Row gutter={24} className="m-t-md">
                                    <Col xs={24} sm={24} md={12}>
                                        <Select
                                            defaultValue={"All"}
                                            style={{ width: 150 }}
                                        >
                                            {optioData.map((item, key) => {
                                                return (
                                                    <Select.Option
                                                        value={item.value}
                                                        key={key}
                                                    >
                                                        {item.label}
                                                    </Select.Option>
                                                );
                                            })}
                                        </Select>
                                    </Col>
                                    <Col
                                        xs={24}
                                        sm={24}
                                        md={12}
                                        className="text-right"
                                    >
                                        <Button className="">
                                            {" "}
                                            Start Queue
                                        </Button>
                                    </Col>
                                </Row>
                            </div>
                        }
                    >
                        <List
                            itemLayout="horizontal"
                            dataSource={data}
                            renderItem={(item, index) => (
                                <List.Item
                                    actions={[
                                        <Button
                                            type="default"
                                            shape="circle"
                                            size="large"
                                        >
                                            <FontAwesomeIcon icon={faCheck} />
                                        </Button>,
                                        <Button
                                            type="default"
                                            shape="circle"
                                            size="large"
                                        >
                                            <FontAwesomeIcon
                                                icon={faCalendar}
                                            />
                                        </Button>,
                                    ]}
                                    className="p-none"
                                >
                                    <List.Item.Meta
                                        avatar={
                                            <FontAwesomeIcon
                                                icon={faClipboardCheck}
                                                className="font-20px m-t-sm"
                                            />
                                        }
                                        title={
                                            <Typography.Text strong>
                                                {item.name}
                                            </Typography.Text>
                                        }
                                        description={
                                            <Space wrap>
                                                <Button
                                                    size="small"
                                                    shape="circle"
                                                    style={{
                                                        background: item.color,
                                                        color: "white",
                                                        minWidth: 20,
                                                        height: 20,
                                                        fontSize: 10,
                                                    }}
                                                >
                                                    {item.image}
                                                </Button>
                                                <Typography.Text>
                                                    {item.description}
                                                </Typography.Text>
                                            </Space>
                                        }
                                    />
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>

                <Col xs={24} sm={24} md={12}>
                    <Row gutter={[12, 10]}>
                        <Col xs={24} sm={24} md={24}>
                            <Card
                                // title="Deal performance"
                                title={
                                    <div className="p-t-md">
                                        <Typography.Text className="font-22px">
                                            Deal performance
                                        </Typography.Text>
                                        <br />
                                        <Typography.Text
                                            className="font-12px"
                                            style={{ color: "#505f79" }}
                                        >
                                            Period: Jun 15, 2023 - Jul 14, 2023
                                        </Typography.Text>
                                    </div>
                                }
                                headStyle={{ border: 0 }}
                                style={{ height: 375 }}
                                bodyStyle={{ height: 290, overflow: "auto" }}
                            >
                                <Row gutter={[12, 10]}>
                                    {dataDeal.map((item, key) => {
                                        return (
                                            <Col
                                                xs={24}
                                                sm={24}
                                                md={12}
                                                key={key}
                                            >
                                                <Button block size="large">
                                                    <Space
                                                        wrap
                                                        style={{
                                                            display: "flex",
                                                            justifyContent:
                                                                "space-between",
                                                        }}
                                                    >
                                                        <Typography.Text>
                                                            {item.title}
                                                        </Typography.Text>
                                                        <Typography.Text>
                                                            <Space wrap>
                                                                {item.count}
                                                            </Space>
                                                        </Typography.Text>
                                                    </Space>
                                                </Button>
                                            </Col>
                                        );
                                    })}
                                </Row>
                            </Card>
                        </Col>
                        <Col xs={24} sm={24} md={24}>
                            <Card
                                // title="Deal performance"
                                title={
                                    <div className="p-t-md">
                                        <Typography.Text className="font-22px">
                                            Deal performance
                                        </Typography.Text>
                                        <br />
                                        <Row gutter={24} className="m-t-md">
                                            <Col xs={24} sm={24} md={12}>
                                                <Radio.Group value={"Upcoming"}>
                                                    <Radio.Button value="Overdue">
                                                        Overdue
                                                    </Radio.Button>
                                                    <Radio.Button value="Default">
                                                        Default
                                                    </Radio.Button>
                                                    <Radio.Button value="Upcoming">
                                                        Upcoming (0)
                                                    </Radio.Button>
                                                    <Radio.Button value="No Due Date">
                                                        No Due Date
                                                    </Radio.Button>
                                                </Radio.Group>
                                            </Col>
                                            <Col
                                                xs={24}
                                                sm={24}
                                                md={12}
                                                className="text-right"
                                            >
                                                <Button className="">
                                                    {" "}
                                                    Start Queue
                                                </Button>
                                            </Col>
                                        </Row>
                                    </div>
                                }
                                headStyle={{ border: 0 }}
                                style={{ height: 375 }}
                                bodyStyle={{ height: 260, overflow: "auto" }}
                            >
                                <List
                                    itemLayout="horizontal"
                                    dataSource={data}
                                    renderItem={(item, index) => (
                                        <List.Item
                                            actions={[
                                                <Button
                                                    type="default"
                                                    shape="circle"
                                                    size="large"
                                                >
                                                    <FontAwesomeIcon
                                                        icon={faCheck}
                                                    />
                                                </Button>,
                                                <Button
                                                    type="default"
                                                    shape="circle"
                                                    size="large"
                                                >
                                                    <FontAwesomeIcon
                                                        icon={faCalendar}
                                                    />
                                                </Button>,
                                            ]}
                                            className="p-none"
                                        >
                                            <List.Item.Meta
                                                avatar={
                                                    <FontAwesomeIcon
                                                        icon={faClipboardCheck}
                                                        className="font-20px m-t-sm"
                                                    />
                                                }
                                                title={
                                                    <Typography.Text strong>
                                                        {item.name}
                                                    </Typography.Text>
                                                }
                                                description={
                                                    <Space wrap>
                                                        <Button
                                                            size="small"
                                                            shape="circle"
                                                            style={{
                                                                background:
                                                                    item.color,
                                                                color: "white",
                                                                minWidth: 20,
                                                                height: 20,
                                                                fontSize: 10,
                                                            }}
                                                        >
                                                            {item.image}
                                                        </Button>
                                                        <Typography.Text>
                                                            {item.description}
                                                        </Typography.Text>
                                                    </Space>
                                                }
                                            />
                                        </List.Item>
                                    )}
                                />
                            </Card>
                        </Col>
                    </Row>
                </Col>

                <Col xs={24} sm={24} md={24}>
                    <Card
                        style={{ height: 440 }}
                        headStyle={{ border: 0 }}
                        // bodyStyle={{
                        //     paddingTop: 10,
                        //     overflow: "auto",
                        //     height: 340,
                        // }}
                        title={
                            <div className="p-t-md">
                                <Typography.Text className="font-22px">
                                    Call Logs
                                </Typography.Text>
                                <br />
                                <Typography.Text
                                    className="font-12px"
                                    style={{ color: "#505f79" }}
                                >
                                    Period: Last 7 Days
                                </Typography.Text>
                            </div>
                        }
                    >
                        <Table
                            columns={columns}
                            dataSource={dataTable}
                            scroll={{ x: 1500, y: 250 }}
                            pagination={false}
                        />
                    </Card>
                </Col>

                <Col xs={24} sm={24} md={12}></Col>
                <Col xs={24} sm={24} md={12}></Col>
                <Col xs={24} sm={24} md={12}></Col>
                <Col xs={24} sm={24} md={12}></Col>
            </Row>
        </>
    );
};

export default DashboardComponentWidget;
