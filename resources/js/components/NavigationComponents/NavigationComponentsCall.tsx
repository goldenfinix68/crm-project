import React, { useState } from "react";
import {
    Button,
    Checkbox,
    Col,
    Divider,
    Dropdown,
    Form,
    Input,
    Row,
    Select,
    Space,
    Switch,
    Tabs,
    Typography,
} from "antd";
import type { MenuProps, SelectProps, TabsProps } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLaptop, faPhone } from "@fortawesome/free-solid-svg-icons";
import validataRules from "../../providers/validateRules";

import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { LoadingOutlined } from "@ant-design/icons";

const optionsFrom: SelectProps["options"] = [
    {
        label: "Outreach (+1 303-952-1461)",
        value: "+1 303-952-1461",
    },
];

const NavigationComponentsCall: React.FC = () => {
    const [showCall, setShowCall] = useState(false);

    const onChange = (key: string) => {
        console.log(key);
    };

    const handleNumBtn = (val: any) => {
        if (val) {
            let formTo = form.getFieldsValue().to;
            let combineTo = "";
            if (formTo) {
                combineTo = `${formTo}` + `${val}`;
            } else {
                combineTo = `${val}`;
            }
            console.log("handleNumBtn", combineTo, val);
            form.setFieldsValue({
                to: combineTo,
            });
        }
    };

    const [form] = Form.useForm();
    const itemTabs: TabsProps["items"] = [
        {
            key: "1",
            label: `DIALER`,
            children: (
                <>
                    <Form
                        form={form}
                        layout="vertical"
                        className="form-remove-label-mb"
                        initialValues={{
                            from: "+1 303-952-1461",
                            to: "+1",
                        }}
                    >
                        <Row gutter={24}>
                            <Col span={24}>
                                <Form.Item
                                    name="from"
                                    label="Form"
                                    rules={[validataRules.required]}
                                >
                                    <Select className="w-100">
                                        {optionsFrom.length > 0 &&
                                            optionsFrom.map((item, key) => {
                                                return (
                                                    <Select.Option
                                                        key={key}
                                                        value={item.value}
                                                    >
                                                        {item.label}
                                                    </Select.Option>
                                                );
                                            })}
                                    </Select>
                                </Form.Item>
                            </Col>

                            <Col span={24}>
                                <Form.Item
                                    name="to"
                                    label="To"
                                    rules={[validataRules.required]}
                                >
                                    <PhoneInput
                                        country={"us"}
                                        inputClass="w-100"
                                        enableSearch
                                    />
                                </Form.Item>
                            </Col>

                            <Col span={24} className="m-t-xs">
                                <Row gutter={[24, 12]} justify={"center"}>
                                    <Col span={3} className="text-center">
                                        <Button
                                            size="large"
                                            shape="circle"
                                            onClick={() => handleNumBtn(1)}
                                        >
                                            1
                                        </Button>
                                    </Col>
                                    <Col span={3} className="text-center">
                                        <Button
                                            size="large"
                                            shape="circle"
                                            onClick={() => handleNumBtn(2)}
                                        >
                                            2
                                        </Button>
                                    </Col>
                                    <Col span={3} className="text-center">
                                        <Button
                                            size="large"
                                            shape="circle"
                                            onClick={() => handleNumBtn(3)}
                                        >
                                            3
                                        </Button>
                                    </Col>
                                </Row>

                                <Row
                                    gutter={[24, 12]}
                                    className="m-t-sm"
                                    justify={"center"}
                                >
                                    <Col span={3} className="text-center">
                                        <Button
                                            size="large"
                                            shape="circle"
                                            onClick={() => handleNumBtn(4)}
                                        >
                                            4
                                        </Button>
                                    </Col>
                                    <Col span={3} className="text-center">
                                        <Button
                                            size="large"
                                            shape="circle"
                                            onClick={() => handleNumBtn(5)}
                                        >
                                            5
                                        </Button>
                                    </Col>
                                    <Col span={3} className="text-center">
                                        <Button
                                            size="large"
                                            shape="circle"
                                            onClick={() => handleNumBtn(6)}
                                        >
                                            6
                                        </Button>
                                    </Col>
                                </Row>

                                <Row
                                    gutter={[24, 12]}
                                    className="m-t-sm"
                                    justify={"center"}
                                >
                                    <Col span={3} className="text-center">
                                        <Button
                                            size="large"
                                            shape="circle"
                                            onClick={() => handleNumBtn(7)}
                                        >
                                            7
                                        </Button>
                                    </Col>
                                    <Col span={3} className="text-center">
                                        <Button
                                            size="large"
                                            shape="circle"
                                            onClick={() => handleNumBtn(8)}
                                        >
                                            8
                                        </Button>
                                    </Col>
                                    <Col span={3} className="text-center">
                                        <Button
                                            size="large"
                                            shape="circle"
                                            onClick={() => handleNumBtn(9)}
                                        >
                                            9
                                        </Button>
                                    </Col>
                                </Row>

                                <Row
                                    gutter={[24, 12]}
                                    className="m-t-sm"
                                    justify={"center"}
                                >
                                    <Col span={3} className="text-center">
                                        <Button
                                            size="large"
                                            shape="circle"
                                            onClick={() => handleNumBtn("*")}
                                        >
                                            *
                                        </Button>
                                    </Col>
                                    <Col span={3} className="text-center">
                                        <Button
                                            size="large"
                                            shape="circle"
                                            onClick={() => handleNumBtn(0)}
                                        >
                                            0
                                        </Button>
                                    </Col>
                                    <Col span={3} className="text-center">
                                        <Button
                                            size="large"
                                            shape="circle"
                                            onClick={() => handleNumBtn("#")}
                                        >
                                            #
                                        </Button>
                                    </Col>
                                </Row>

                                <Row
                                    gutter={[24, 12]}
                                    className="m-t-sm"
                                    justify={"center"}
                                >
                                    <Col span={10}>
                                        <Checkbox>Record</Checkbox>
                                    </Col>
                                </Row>
                                <Row
                                    gutter={[24, 12]}
                                    className="m-t-sm m-b-md"
                                    justify={"center"}
                                >
                                    <Col span={10}>
                                        <Space>
                                            <Button className="btn-browser">
                                                {" "}
                                                Via Browser
                                            </Button>
                                            <Button className="btn-phone">
                                                {" "}
                                                Via Phone
                                            </Button>
                                        </Space>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Form>
                </>
            ),
        },
        {
            key: "2",
            label: `PENDING`,
            children: (
                <>
                    <div className="w-100 text-center m-b-xs">
                        <LoadingOutlined style={{ fontSize: 28 }} />
                    </div>
                </>
            ),
        },
        {
            key: "3",
            label: `RECENT`,
            children: (
                <>
                    <div className="w-100 text-center m-b-xs">
                        <LoadingOutlined style={{ fontSize: 28 }} />
                    </div>
                </>
            ),
        },
        {
            key: "4",
            label: `MISSED`,
            children: (
                <>
                    <div className="w-100 text-center m-b-xs">
                        <LoadingOutlined style={{ fontSize: 28 }} />
                    </div>
                </>
            ),
        },
        {
            key: "5",
            label: `VM'S`,
            children: (
                <>
                    <div className="w-100 text-center m-b-xs">
                        <LoadingOutlined style={{ fontSize: 28 }} />
                    </div>
                </>
            ),
        },
        {
            key: "6",
            label: `SETTINGS`,
            children: (
                <>
                    <Space
                        wrap
                        className="w-100"
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                        }}
                    >
                        <Typography.Text>
                            Available to take phone calls
                        </Typography.Text>

                        <Switch size="small" checked />
                    </Space>

                    <Space
                        wrap
                        className="w-100 m-t-sm"
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                        }}
                    >
                        <Checkbox checked>Answer calls in browser</Checkbox>

                        <FontAwesomeIcon
                            icon={faLaptop}
                            style={{ fontSize: 12 }}
                        />
                    </Space>

                    <Space
                        wrap
                        className="w-100 m-t-sm"
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                        }}
                    >
                        <Checkbox checked>
                            Forward calls to mobile phone
                        </Checkbox>

                        <FontAwesomeIcon
                            icon={faLaptop}
                            style={{ fontSize: 12 }}
                        />
                    </Space>

                    <Space
                        wrap
                        className="w-100 m-t-sm"
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                        }}
                    >
                        <Checkbox checked>Answer calls on mobile app</Checkbox>

                        <FontAwesomeIcon
                            icon={faLaptop}
                            style={{ fontSize: 12 }}
                        />
                    </Space>

                    <Divider />

                    <Typography.Text strong>Device Settings</Typography.Text>

                    <Row gutter={12}>
                        <Col span={24}>
                            <Typography.Text>Microphone</Typography.Text>
                            <br />
                            <Select
                                className="w-100"
                                disabled
                                placeholder="No microphone found"
                            ></Select>
                        </Col>
                        <Col span={24} className="m-t-sm">
                            <Typography.Text>Speaker/Headset</Typography.Text>
                            <br />
                            <Select
                                className="w-100"
                                disabled
                                placeholder="No speaker found"
                            ></Select>
                        </Col>

                        <Col span={24} className="m-t-lg m-b-xs  text-right">
                            <Typography.Link
                                style={{ textDecoration: "underline" }}
                            >
                                Learn More
                            </Typography.Link>
                        </Col>
                    </Row>
                </>
            ),
        },
    ];

    const items: MenuProps["items"] = [
        {
            key: "1",
            label: (
                <div className="list-data">
                    <Tabs
                        className="w-100"
                        defaultActiveKey="1"
                        items={itemTabs}
                        onChange={onChange}
                    />
                </div>
            ),
        },
    ];

    return (
        <>
            <Dropdown
                arrow
                menu={{ items }}
                placement="bottomRight"
                overlayClassName="header-call"
                trigger={["click"]}
                open={true}
                // open={showCall}
                onOpenChange={() => setShowCall(!showCall)}
            >
                <FontAwesomeIcon
                    icon={faPhone}
                    onClick={() => setShowCall(true)}
                />
            </Dropdown>
        </>
    );
};

export default NavigationComponentsCall;
