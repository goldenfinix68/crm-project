import React from "react";
import { UploadOutlined } from "@ant-design/icons";
import {
    Button,
    Popconfirm,
    Space,
    Upload,
    Row,
    Card,
    Divider,
    Radio,
    Table,
    Checkbox,
    Col,
    Select,
} from "antd";
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined,
    VideoCameraOutlined,
    CheckCircleOutlined,
    FunnelPlotOutlined,
    PhoneOutlined,
    FileDoneOutlined,
    TeamOutlined,
    PlaySquareOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

interface DataType {
    key: React.Key;
    titlename: string;
    startDate: string;
    duration: string;
    owner: string;
    title: string;
    name: string;
    tags: string;
}

const columns: ColumnsType<DataType> = [
    {
        title: "Title",
        dataIndex: "titlename",
        render: (text: string) => <a>{text}</a>,
    },
    {
        title: "Start Date",
        dataIndex: "startDate",
    },
    {
        title: "Duration",
        dataIndex: "duration",
    },
    {
        title: "Owner",
        dataIndex: "owner",
    },
    {
        title: "Title",
        dataIndex: "title",
    },
    {
        title: "Name",
        dataIndex: "name",
    },
    {
        title: "Tags",
        dataIndex: "tags",
    },
];

const data: DataType[] = [
    {
        key: "1",
        titlename: "Joanne Middleton PASCO AUCTION Deal Review",
        startDate: "Jun 27, 2023 12:00PM",
        duration: "01:00",
        owner: "Jesse Admin",
        title: "",
        name: "Joanne Middleton PASCO AUCTION",
        tags: "",
    },
    {
        key: "1",
        titlename: "Joanne Middleton PASCO AUCTION Deal Review",
        startDate: "Jun 27, 2023 12:00PM",
        duration: "01:00",
        owner: "Jesse Admin",
        title: "",
        name: "Joanne Middleton PASCO AUCTION",
        tags: "",
    },
    {
        key: "1",
        titlename: "Joanne Middleton PASCO AUCTION Deal Review",
        startDate: "Jun 27, 2023 12:00PM",
        duration: "01:00",
        owner: "Jesse Admin",
        title: "",
        name: "Joanne Middleton PASCO AUCTION",
        tags: "",
    },
    {
        key: "1",
        titlename: "Joanne Middleton PASCO AUCTION Deal Review",
        startDate: "Jun 27, 2023 12:00PM",
        duration: "01:00",
        owner: "Jesse Admin",
        title: "",
        name: "Joanne Middleton PASCO AUCTION",
        tags: "",
    },
];

const Activities = () => {
    return (
        <Card>
            <Row style={{ marginBottom: "20px" }}>
                <Col md={12} lg={12}>
                    <Select
                        suffixIcon={<FunnelPlotOutlined />}
                        defaultValue="All Contacts"
                        // options={[
                        //     { value: "jack", label: "Jack" },
                        //     { value: "lucy", label: "Lucy" },
                        //     { value: "Yiminghe", label: "yiminghe" },
                        // ]}
                    />
                </Col>
                <Col md={12} lg={12}>
                    <Button>asd</Button>
                    <Select
                        defaultValue="Action"
                        // options={[
                        //     { value: "jack", label: "Jack" },
                        //     { value: "lucy", label: "Lucy" },
                        //     { value: "Yiminghe", label: "yiminghe" },
                        // ]}
                    />
                </Col>
            </Row>

            <Row>
                <Col md={24} lg={24}>
                    <Table
                        rowSelection={{
                            type: "checkbox",
                        }}
                        columns={columns}
                        dataSource={data}
                    />
                </Col>
            </Row>
        </Card>
    );
};

export default Activities;
