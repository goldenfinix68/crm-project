import {
    Card,
    Button,
    Dropdown,
    Space,
    Radio,
    Tooltip,
    MenuProps,
    Tabs,
    Menu,
    Row,
    Col,
    List,
    notification,
    Typography,
    Collapse,
    theme,
    Input,
    Divider,
    Form,
    Select,
    DatePicker,
    TimePicker,
    message,
    Upload,
} from "antd";
import type { UploadProps } from "antd";
import type { CollapseProps } from "antd";
import type { CSSProperties } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import validateRules from "../../providers/validateRules";
dayjs.extend(customParseFormat);
import { faPaperPlane } from "@fortawesome/free-regular-svg-icons";
import {
    faList,
    faPhoneVolume,
    faUsers,
    faVideo,
} from "@fortawesome/free-solid-svg-icons";
import type { TabsProps } from "antd";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
    UserAddOutlined,
    PlusCircleOutlined,
    DownOutlined,
    InsertRowBelowOutlined,
    FilterOutlined,
    PhoneOutlined,
    MailOutlined,
    UserOutlined,
    HolderOutlined,
    CloseOutlined,
    PlusCircleFilled,
    PlusSquareOutlined,
    LikeOutlined,
    DislikeOutlined,
    CaretRightOutlined,
    CheckCircleOutlined,
    CalculatorOutlined,
    CalendarOutlined,
    InboxOutlined,
} from "@ant-design/icons";
import Search from "antd/es/input/Search";
import ModalAddDeal from "./components/ModalAddDeal";
import Filter from "./components/Filter";
import {
    DragDropContext,
    Draggable,
    Droppable,
    DropResult,
    DraggableLocation,
} from "react-beautiful-dnd";
import Board from "react-trello";
import { useDealsAll, useDealsByid } from "../../api/query/dealQuery";
import {
    useContactsList,
    useDealsList,
    useUsersList,
} from "../../api/query/activityQuery";
import { useMutation, useQueryClient } from "react-query";
import {
    useDealMutation,
    useDealUpdateBoardMutation,
} from "../../api/mutation/useDealMutation";
import moment from "moment";
import DealsTable from "./components/DealsTable";
import type { SelectProps } from "antd";

import { addActivityMutation } from "../../api/mutation/useActivityMutation";

interface DealsById {
    title: string;
    win_probabilty: string;
    owner: string;
    estimated_close_date: string;
    value: string;
    currency: string;
    pipeline: string;
    source: string;
    stage: string;
    priority: string;
    status: string;
    details: string;
}

interface Props {
    match: any;
}

const DealDetail = () => {
    const queryClient = useQueryClient();
    const { dealId } = useParams();
    const { dataUsers, isLoadingUsers } = useUsersList();
    const { deals, isLoading, refetch } = useDealsByid(dealId ?? "");
    const { token } = theme.useToken();
    const { Dragger } = Upload;
    const optionAvailability: SelectProps["options"] = [
        {
            label: "Busy",
            value: "Busy",
        },
        {
            label: "Free",
            value: "Free",
        },
    ];
    const [form] = Form.useForm();

    function toCurrency(number: any) {
        return new Intl.NumberFormat("en-US", {
            style: "decimal",
            minimumFractionDigits: 2,
        }).format(number);
    }

    const getItems: (panelStyle: CSSProperties) => CollapseProps["items"] = (
        panelStyle
    ) => [
        {
            key: "1",
            label: "Deal Specific Email",
            children: <p>Deal-E18@clinkup.salesmate.io</p>,
            style: panelStyle,
        },
        {
            key: "2",
            label: "Contact",
            children: (
                <div>
                    <div style={{ display: "flex" }}>
                        <span className="thumb-name-xs " title="Jesse Ashley">
                            B
                        </span>
                        <span style={{ fontSize: 14, marginLeft: 10 }}>
                            {" "}
                            Bernard Sweeney
                        </span>
                    </div>
                    <div>Mobile: +18044326971</div>
                    <div>Phone: +18044326971</div>
                </div>
            ),
            style: panelStyle,
        },
        {
            key: "3",
            label: "Deal Details",
            children: (
                <div>
                    <div>Source</div>
                    <div>Priority</div>
                    <div>Description</div>
                </div>
            ),
            style: panelStyle,
        },
    ];

    const onFinish = (values: any) => {
        values = {
            ...values,
            deal_id: dealId,
            invitees: [],
            follower_id: 0,
            contact_id: 0,
            start_date: values.start_date
                ? dayjs(values.start_date).format("YYYY/MM/DD")
                : undefined,
            end_date: values.end_date
                ? dayjs(values.end_date).format("YYYY/MM/DD")
                : undefined,
            start_time: values.start_time
                ? dayjs(values.start_time).format("HH:mm")
                : undefined,
            end_time: values.end_time
                ? dayjs(values.end_time).format("HH:mm")
                : undefined,
        };

        console.log("onFinish", values);

        addActivity.mutate(values);
    };

    const addActivity = useMutation(addActivityMutation, {
        onSuccess: (res) => {
            console.log("success");
            notification.success({
                message: "Activity",
                description: "Activity Successfully Added",
            });
            queryClient.invalidateQueries("activities");
        },
    });

    const getItems2: (panelStyle: CSSProperties) => CollapseProps["items"] = (
        panelStyle
    ) => [
        {
            key: "1",
            label: "Smart Insights",
            children: (
                <div>
                    <div>
                        <b>Last Communication</b>{" "}
                        <span style={{ marginLeft: 5 }}>Text</span>
                    </div>
                    <div>
                        <b>Last Communication On</b>{" "}
                        <span style={{ marginLeft: 5 }}>10hours Ago</span>
                    </div>
                </div>
            ),
            style: panelStyle,
        },
        {
            key: "2",
            label: "Teamates",
            children: (
                <div>
                    <div style={{ display: "flex" }}>
                        <span className="thumb-name-xs " title="Jesse Ashley">
                            J
                        </span>
                        <span
                            style={{
                                fontSize: 14,
                                marginLeft: 10,
                                marginTop: 10,
                            }}
                        >
                            {" "}
                            Jesse Ashley
                        </span>
                    </div>
                    <div>
                        <Input placeholder="Search User" />
                    </div>
                </div>
            ),
            style: panelStyle,
        },
        {
            key: "3",
            label: "Participants",
            children: (
                <div>
                    <div>
                        <Input placeholder="Search Participants" />
                    </div>
                </div>
            ),
            style: panelStyle,
        },
    ];
    const action: MenuProps["items"] = [
        {
            key: "1",
            label: <div>Edit</div>,
        },
        {
            key: "2",
            label: <div>Clone</div>,
        },
        {
            key: "3",
            label: <div>Delete</div>,
        },
    ];
    const panelStyle = {
        marginBottom: 24,

        border: "none",
    };
    const cardForm = () => {
        return (
            <Form form={form} onFinish={(e) => onFinish(e)}>
                <Row gutter={12} className="">
                    <Col span={24} className="p-md p-t-lg form-left">
                        <Row gutter={12}>
                            <Col span={5} className="col-label">
                                <Typography.Text>Title</Typography.Text>
                            </Col>
                            <Col span={19}>
                                {" "}
                                <Form.Item
                                    name={"Title"}
                                    rules={[validateRules.required]}
                                >
                                    <Input placeholder="Title" className="" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={12}>
                            <Col span={5} className="col-label">
                                <Typography.Text>Type</Typography.Text>
                            </Col>
                            <Col span={19}>
                                <Form.Item name={"Type"}>
                                    <Select
                                        className="select-custom-width"
                                        placeholder="Type"
                                    >
                                        <Select.Option value="Call">
                                            <FontAwesomeIcon
                                                icon={faPhoneVolume}
                                                className="font-12px m-r-xs"
                                            />
                                            Call
                                        </Select.Option>
                                        <Select.Option value="Task">
                                            <FontAwesomeIcon
                                                icon={faList}
                                                className="font-12px m-r-xs"
                                            />
                                            Task
                                        </Select.Option>
                                        <Select.Option value="Meeting">
                                            <FontAwesomeIcon
                                                icon={faUsers}
                                                className="font-12px m-r-xs"
                                            />
                                            Meeting
                                        </Select.Option>
                                        <Select.Option value="Demo">
                                            <FontAwesomeIcon
                                                icon={faVideo}
                                                className="font-12px m-r-xs"
                                            />
                                            Demo
                                        </Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={12}>
                            <Col span={5} className="col-label">
                                <Typography.Text>Date & Time</Typography.Text>
                            </Col>
                            <Col span={19}>
                                <Row gutter={12}>
                                    <Col span={12}>
                                        <Form.Item name="start_date">
                                            <DatePicker
                                                style={{
                                                    width: "100%",
                                                }}
                                                placeholder="Start Date"
                                                format={"MMM, DD YYYY"}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item name="start_time">
                                            <TimePicker
                                                style={{
                                                    width: "100%",
                                                }}
                                                minuteStep={30}
                                                format="HH:mm"
                                                placeholder="Start Time"
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item name="end_time">
                                            <TimePicker
                                                style={{
                                                    width: "100%",
                                                }}
                                                minuteStep={30}
                                                format="HH:mm"
                                                placeholder="End Time"
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item name="end_date">
                                            <DatePicker
                                                style={{
                                                    width: "100%",
                                                }}
                                                placeholder="End Date"
                                                format={"MMM, DD YYYY"}
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>

                        <Row gutter={12}>
                            <Col span={5} className="col-label">
                                <Typography.Text style={{ color: "red" }}>
                                    *
                                </Typography.Text>
                                <Typography.Text>Availability</Typography.Text>
                            </Col>
                            <Col span={19}>
                                <Form.Item
                                    name={"availability"}
                                    rules={[validateRules.required]}
                                >
                                    <Select
                                        placeholder="Availability"
                                        showSearch
                                        className="select-custom-width"
                                    >
                                        {optionAvailability.map((item, key) => {
                                            return (
                                                <Select.Option
                                                    key={key}
                                                    value={item.value}
                                                    search={item.label}
                                                >
                                                    {item.label}
                                                </Select.Option>
                                            );
                                        })}
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={12}>
                            <Col span={5} className="col-label col-label-note">
                                <Typography.Text>Internal Note</Typography.Text>
                            </Col>
                            <Col span={19}>
                                <Form.Item name={"internal_note"}>
                                    <Input.TextArea
                                        rows={3}
                                        placeholder="Add internal note"
                                        className="no-resize"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={12}>
                            <Col span={5} className="col-label">
                                <Typography.Text>Owner</Typography.Text>
                            </Col>
                            <Col span={19}>
                                <Form.Item
                                    name={"owner_id"}
                                    rules={[validateRules.required]}
                                >
                                    <Select
                                        placeholder="Owner"
                                        showSearch
                                        className="select-custom-width"
                                        loading={isLoadingUsers}
                                    >
                                        {dataUsers &&
                                            dataUsers?.data &&
                                            dataUsers?.data.map(
                                                (item: any, key: any) => {
                                                    return (
                                                        <Select.Option
                                                            key={key}
                                                            value={item.id}
                                                            search={`${item.firstName} ${item.lastName}`}
                                                        >
                                                            {`${item.firstName} ${item.lastName}`}
                                                        </Select.Option>
                                                    );
                                                }
                                            )}
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={12}>
                            <Col span={5} className="col-label">
                                <Typography.Text>Followers</Typography.Text>
                            </Col>
                            <Col span={19}>
                                <Form.Item name={"followers"}>
                                    <Input placeholder="Followers"></Input>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={12}>
                            <Col span={5} className="col-label">
                                <Typography.Text>Tags</Typography.Text>
                            </Col>
                            <Col span={19}>
                                <Form.Item name={"tags"}>
                                    <Input placeholder="Tags"></Input>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row>
                    <Col md={24}>
                        <div>
                            {" "}
                            <Button
                                style={{ float: "right" }}
                                onClick={() => {
                                    form.submit();
                                }}
                                type="primary"
                            >
                                Save
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Form>
        );
    };
    const itemstab: TabsProps["items"] = [
        {
            key: "1",
            label: `Note`,
            children: `No Content`,
        },
        {
            key: "2",
            label: `Email`,
            children: (
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 20,
                        padding: 20,
                    }}
                >
                    <div>
                        <FontAwesomeIcon
                            icon={faPaperPlane}
                            style={{ fontSize: 50 }}
                        />
                    </div>

                    <div>
                        <div style={{ fontSize: 20 }}>
                            Configure your Email Account
                        </div>
                        <br></br>
                        logging with Salesmate's two-way email sync
                        functionality. Measure email engagement with email open
                        and click tracking. Don't forget to use email templates
                        for your canned responses and repetitive emails.
                        <Button type="primary" style={{ marginTop: 20 }}>
                            Configue email account
                        </Button>
                    </div>
                </div>
            ),
        },
        {
            key: "3",
            label: `Add Activity`,
            children: cardForm(),
        },
        {
            key: "4",
            label: `Log Activity`,
            children: cardForm(),
        },
        {
            key: "5",
            label: `File`,
            children: (
                <div
                    style={{
                        padding: 20,
                    }}
                >
                    <Dragger>
                        <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                        </p>
                        <p className="ant-upload-text">
                            Click or drag file to this area to upload
                        </p>
                        <p className="ant-upload-hint">
                            Support for a single or bulk upload. Strictly
                            prohibited from uploading company data or other
                            banned files.
                        </p>
                    </Dragger>
                </div>
            ),
        },
    ];
    const itemstab2: TabsProps["items"] = [
        {
            key: "1",
            label: `All`,
            children: (
                <div>
                    <div>Upcoming (4)</div>
                    <Card style={{ marginTop: 20 }}>
                        <div style={{ display: "flex" }}>
                            <span
                                className="thumb-name-xs "
                                title="Jesse Ashley"
                            >
                                J
                            </span>
                            <span style={{ fontSize: 16, marginLeft: 10 }}>
                                {" "}
                                <b>Task</b> for Jesse Ashley
                            </span>
                        </div>
                        <Divider></Divider>
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <span>
                                <CheckCircleOutlined style={{ fontSize: 24 }} />
                            </span>
                            <span style={{ fontSize: 16, marginLeft: 10 }}>
                                {" "}
                                assign to ACQ manager (jesse777ashley)
                            </span>
                        </div>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                padding: 20,
                                paddingTop: 0,
                                paddingBottom: 0,
                                marginTop: 10,
                            }}
                        >
                            <span>
                                <CalendarOutlined style={{ fontSize: 14 }} />
                            </span>
                            <span style={{ fontSize: 14, marginLeft: 10 }}>
                                {" "}
                                Jul 27, 2023 01:58 PM
                            </span>
                        </div>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                padding: 20,
                                paddingTop: 0,
                                paddingBottom: 0,
                            }}
                        >
                            <span>
                                <UserOutlined style={{ fontSize: 14 }} />
                            </span>
                            <span style={{ fontSize: 14, marginLeft: 10 }}>
                                {" "}
                                Bernard Sweeney
                            </span>
                        </div>
                        <Divider></Divider>
                        <Input placeholder="Add your note for this activity"></Input>
                    </Card>
                    <Card style={{ marginTop: 20 }}>
                        <div style={{ display: "flex" }}>
                            <span
                                className="thumb-name-xs "
                                title="Jesse Ashley"
                            >
                                J
                            </span>
                            <span style={{ fontSize: 16, marginLeft: 10 }}>
                                {" "}
                                <b>Task</b> for Jesse Ashley
                            </span>
                        </div>
                        <Divider></Divider>
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <span>
                                <CheckCircleOutlined style={{ fontSize: 24 }} />
                            </span>
                            <span style={{ fontSize: 16, marginLeft: 10 }}>
                                {" "}
                                assign to ACQ manager (jesse777ashley)
                            </span>
                        </div>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                padding: 20,
                                paddingTop: 0,
                                paddingBottom: 0,
                                marginTop: 10,
                            }}
                        >
                            <span>
                                <CalendarOutlined style={{ fontSize: 14 }} />
                            </span>
                            <span style={{ fontSize: 14, marginLeft: 10 }}>
                                {" "}
                                Jul 27, 2023 01:58 PM
                            </span>
                        </div>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                padding: 20,
                                paddingTop: 0,
                                paddingBottom: 0,
                            }}
                        >
                            <span>
                                <UserOutlined style={{ fontSize: 14 }} />
                            </span>
                            <span style={{ fontSize: 14, marginLeft: 10 }}>
                                {" "}
                                Bernard Sweeney
                            </span>
                        </div>
                        <Divider></Divider>
                        <Input placeholder="Add your note for this activity"></Input>
                    </Card>
                </div>
            ),
        },
        {
            key: "2",
            label: `Activites`,
            children: `No Content`,
        },
        {
            key: "3",
            label: `Notes`,
            children: `No Content`,
        },
        {
            key: "4",
            label: `Emails`,
            children: `No Content`,
        },
        {
            key: "5",
            label: `File`,
            children: `No Content`,
        },
        {
            key: "6",
            label: `Texts`,
            children: `No Content`,
        },
        {
            key: "7",
            label: `Updates`,
            children: `No Content`,
        },
    ];

    return (
        <Row className="deal-group-row">
            <Col md={24}>
                <Card title="Deals">
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: 15,
                        }}
                    >
                        <div>
                            <Typography.Title level={3}>
                                {deals && deals.data.title}
                            </Typography.Title>
                        </div>

                        <div>
                            <span style={{ marginRight: 10 }}></span>
                            <span style={{ marginRight: 10 }}>
                                <Button type="primary">
                                    &nbsp; <LikeOutlined />
                                    Won
                                </Button>
                            </span>
                            <span style={{ marginRight: 10 }}>
                                <Button type="primary" danger>
                                    <DislikeOutlined /> &nbsp; Lost
                                </Button>
                            </span>
                            <span style={{ marginRight: 10 }}>
                                <Dropdown
                                    menu={{ items: action }}
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
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                marginBottom: 15,
                            }}
                        >
                            <span style={{ marginRight: 15 }}>
                                <span>
                                    <div>Value</div>
                                    <div>
                                        {" "}
                                        {deals &&
                                            "$" + toCurrency(deals.data.value)}
                                    </div>
                                </span>
                            </span>
                            <span style={{ marginRight: 15 }}>
                                <span>
                                    <div>Pipleline</div>
                                    <div>{deals && deals.data.pipeline}</div>
                                </span>
                            </span>
                            <span style={{ marginRight: 15 }}>
                                <div>
                                    <div>Estimated Close Date</div>
                                    <div>
                                        <CalendarOutlined />{" "}
                                        {deals &&
                                            deals.data.estimated_close_date}
                                    </div>
                                </div>
                            </span>
                            <span style={{ marginRight: 15 }}>
                                <div>
                                    <div>Win Probability</div>
                                    <div>0</div>
                                </div>
                            </span>
                        </div>

                        <div></div>
                    </div>

                    <div style={{ marginTop: 30 }}>
                        <div className="breadcrumb">
                            <a
                                href="#"
                                className={
                                    deals &&
                                    deals.data.stage == "Comp & Qualify"
                                        ? "active"
                                        : "none"
                                }
                            >
                                <span className="breadcrumb__inner">
                                    <span className="breadcrumb__title">
                                        Comp & Qualify
                                    </span>
                                </span>
                            </a>
                            <a
                                href="#"
                                className={
                                    deals &&
                                    deals.data.stage == "First Offer Given"
                                        ? "active"
                                        : "none"
                                }
                            >
                                <span className="breadcrumb__inner">
                                    <span className="breadcrumb__title">
                                        First Offer Given
                                    </span>
                                </span>
                            </a>
                            <a
                                href="#"
                                className={
                                    deals &&
                                    deals.data.stage == "In Negotiation"
                                        ? "active"
                                        : "none"
                                }
                            >
                                <span className="breadcrumb__inner">
                                    <span className="breadcrumb__title">
                                        In Negotiation
                                    </span>
                                </span>
                            </a>
                            <a
                                href="#"
                                className={
                                    deals &&
                                    deals.data.stage == "Verbal Offer Accepted"
                                        ? "active"
                                        : "none"
                                }
                            >
                                <span className="breadcrumb__inner">
                                    <span className="breadcrumb__title">
                                        Verbal Offer Accepted
                                    </span>
                                </span>
                            </a>
                            <a
                                href="#"
                                className={
                                    deals &&
                                    deals.data.stage == "Under Contract"
                                        ? "active"
                                        : "none"
                                }
                            >
                                <span className="breadcrumb__inner">
                                    <span className="breadcrumb__title">
                                        Under Contract
                                    </span>
                                </span>
                            </a>
                        </div>
                    </div>
                    <div style={{ marginTop: 30 }}>
                        <Row gutter={24}>
                            <Col md={6}>
                                <div className="card-left-deal-details ">
                                    <Collapse
                                        bordered={false}
                                        defaultActiveKey={["1", "2", "3"]}
                                        expandIcon={({ isActive }) => (
                                            <CaretRightOutlined
                                                rotate={isActive ? 90 : 0}
                                            />
                                        )}
                                        items={getItems(panelStyle)}
                                    />
                                </div>
                            </Col>
                            <Col md={12}>
                                <Card
                                    bodyStyle={{
                                        padding: 10,
                                        paddingTop: 0,
                                    }}
                                >
                                    <Tabs
                                        defaultActiveKey="1"
                                        items={itemstab}
                                        // onChange={onChange}
                                    />
                                </Card>

                                <div style={{ marginTop: 20 }}>
                                    <Tabs
                                        style={{ padding: 10 }}
                                        defaultActiveKey="1"
                                        items={itemstab2}
                                        // onChange={onChange}
                                    />
                                </div>
                            </Col>
                            <Col md={6}>
                                <div className="card-left-deal-details ">
                                    <Collapse
                                        bordered={false}
                                        defaultActiveKey={["1", "2", "3"]}
                                        expandIcon={({ isActive }) => (
                                            <CaretRightOutlined
                                                rotate={isActive ? 90 : 0}
                                            />
                                        )}
                                        items={getItems2(panelStyle)}
                                    />
                                </div>
                            </Col>
                        </Row>
                    </div>
                </Card>
            </Col>
        </Row>
    );
};

export default DealDetail;
