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
    Form,
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
    TableOutlined,
    PlusCircleOutlined,
    DownOutlined,
    LockOutlined,
    CloseOutlined,
} from "@ant-design/icons";
import React, { useState } from "react";
import type { CheckboxChangeEvent } from "antd/es/checkbox";
import { DEFAULT_REQUIRED_MESSAGE } from "../../../constants";

interface ContactsComponentsAddContactsProps {
    isModalOpen: boolean;
    setIsModalOpen: any;
}

const handleChange = (value: string) => {
    console.log(`selected ${value}`);
};

const handleChangeType = (value: string) => {
    console.log(`selected ${value}`);
};

const onChange = (e: CheckboxChangeEvent) => {
    console.log(`checked = ${e.target.checked}`);
};

const ContactsComponentsAddContacts = ({
    isModalOpen,
    setIsModalOpen,
}: ContactsComponentsAddContactsProps) => {
    const [form] = Form.useForm();

    const handleFinish = (values) => {
        console.log(values);
        // Perform form submission logic here
    };
    return (
        <>
            <Modal
                closable={false}
                className="your-modal"
                width={650}
                title={null}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                style={{ maxHeight: "700px" }}
                footer={null}
                // footer={[
                //     <Button type="primary">Save</Button>,
                //     <Button type="primary">Save and add other</Button>,
                //     <Button onClick={() => setIsModalOpen(false)}>
                //         Cancel
                //     </Button>,
                // ]}
            >
                <div className="modal-header">
                    <Typography.Title level={5} style={{ color: "white" }}>
                        Add New Contact
                    </Typography.Title>
                    <Button
                        type="link"
                        style={{ marginRight: "-270px", color: "white" }}
                    >
                        {" "}
                        <u>Manage Fields</u>
                    </Button>
                    <Button
                        style={{
                            backgroundColor: "rgba(0, 0, 0, 0.5)",
                            border: "0px",
                        }}
                        onClick={() => setIsModalOpen(false)}
                        icon={<CloseOutlined style={{ color: "white" }} />}
                    />
                </div>
                <div className="modal-content">
                    <Form form={form} onFinish={handleFinish} layout="vertical">
                        <Row gutter={24} className="m-t-md">
                            <Col md={12} xs={12}>
                                <Form.Item
                                    name="firstName"
                                    label="First Name"
                                    rules={[
                                        {
                                            required: true,
                                            message: DEFAULT_REQUIRED_MESSAGE,
                                        },
                                    ]}
                                >
                                    <Input placeholder="First Name" />
                                </Form.Item>
                            </Col>
                            <Col md={12} xs={12}>
                                <Form.Item
                                    name="lastName"
                                    label="Last Name"
                                    rules={[
                                        {
                                            required: true,
                                            message: DEFAULT_REQUIRED_MESSAGE,
                                        },
                                    ]}
                                >
                                    <Input placeholder="Last Name" />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col md={12} xs={12}>
                                <Form.Item name="mobile" label="Mobile">
                                    <Input placeholder="Mobile" />
                                </Form.Item>
                            </Col>
                            <Col md={12} xs={12}>
                                <Form.Item
                                    name="countryLink"
                                    label="County Link"
                                >
                                    <Input placeholder="County Link" />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col md={12} xs={12}>
                                <Typography className="m-b-xs">
                                    Acres
                                </Typography>
                                <Input placeholder="Acres" />
                            </Col>
                            <Col md={12} xs={12}>
                                <Typography className="m-b-xs">
                                    Email
                                </Typography>
                                <Input placeholder="Email" />
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col md={12} xs={12}>
                                <Typography className="m-b-xs">
                                    Job Title
                                </Typography>
                                <Input placeholder="Job Title" />
                            </Col>
                            <Col md={12} xs={12}>
                                <Typography className="m-b-xs">
                                    Phone
                                </Typography>
                                <Input placeholder="Phone" />
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col md={12} xs={12}>
                                <Typography className="m-b-xs">
                                    Other Phone
                                </Typography>
                                <Input placeholder="Other Phone" />
                            </Col>
                            <Col md={12} xs={12}>
                                <Typography className="m-b-xs">
                                    Owner
                                </Typography>
                                <Select
                                    defaultValue="Jesse Admin"
                                    style={{ width: "100%" }}
                                    onChange={handleChange}
                                    options={[
                                        {
                                            value: "jesse admin",
                                            label: "Jesse Admin",
                                        },
                                        {
                                            value: "jesse ashley",
                                            label: "Jesse Ashley",
                                        },
                                    ]}
                                />
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col md={12} xs={12}>
                                <Typography className="m-b-xs">
                                    Email 2
                                </Typography>
                                <Input placeholder="Email 2" />
                            </Col>
                            <Col md={12} xs={12}>
                                <Typography className="m-b-xs">Type</Typography>
                                <Select
                                    defaultValue="Select"
                                    style={{ width: "100%" }}
                                    onChange={handleChangeType}
                                    options={[
                                        {
                                            value: "Customer",
                                            label: "Customer",
                                        },
                                        {
                                            value: "Lead",
                                            label: "Lead",
                                        },
                                        { value: "Vendor", label: "Vendor" },
                                        {
                                            value: "Partner",
                                            label: "Partner",
                                        },
                                        {
                                            value: "Competitor",
                                            label: "Competitor",
                                        },
                                        {
                                            value: "Reseller",
                                            label: "Reseller",
                                        },
                                        {
                                            value: "Other",
                                            label: "Other",
                                        },
                                    ]}
                                />
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col md={12} xs={12}>
                                <Typography className="m-b-xs">
                                    Mailing Street Address
                                </Typography>
                                <Input placeholder="Mailing Street Address" />
                            </Col>
                            <Col md={12} xs={12}>
                                {/* <Typography className="m-b-xs">
                            Email Opt Out
                        </Typography> */}
                                <Checkbox
                                    className={"m-t-lg"}
                                    onChange={onChange}
                                >
                                    Email Opt Out
                                </Checkbox>
                            </Col>
                        </Row>
                        <Row gutter={24} className="m-b-md">
                            <Col md={12} xs={12}>
                                <Typography className="m-b-xs">
                                    Mailing City
                                </Typography>
                                <Input placeholder="Mailing City" />
                            </Col>
                            <Col md={12} xs={12}>
                                <Typography className="m-b-xs">
                                    Mailing State
                                </Typography>
                                <Input placeholder="Mailing State" />
                            </Col>
                        </Row>
                        <Row gutter={24} className="m-b-md">
                            <Col md={12} xs={12}>
                                {/* <Typography className="m-b-xs">SMS Opt Out</Typography> */}
                                <Checkbox
                                    className={"m-t-lg"}
                                    onChange={onChange}
                                >
                                    SMS Opt Out
                                </Checkbox>
                            </Col>
                            <Col md={12} xs={12}>
                                <Typography className="m-b-xs">
                                    Email Opt Out Reason
                                </Typography>
                                <Input.TextArea
                                    maxLength={6}
                                    placeholder="Email Opt Out Reason"
                                />
                            </Col>
                        </Row>
                        <Row gutter={24} className="m-b-md">
                            <Col md={12} xs={12}>
                                <Typography className="m-b-xs">
                                    Mailing Zip
                                </Typography>
                                <Input placeholder="Mailing Zip" />
                            </Col>
                            <Col md={12} xs={12}>
                                <Typography className="m-b-xs">
                                    Mailing County
                                </Typography>
                                <Input placeholder="Mailing County" />
                            </Col>
                        </Row>
                        <Row gutter={24} className="m-b-md">
                            <Col md={12} xs={12}>
                                <Typography className="m-b-xs">
                                    Subdivision
                                </Typography>
                                <Input placeholder="Subdivision" />
                            </Col>

                            <Col md={12} xs={12}>
                                <Typography className="m-b-xs">APN</Typography>
                                <Input placeholder="APN" />
                            </Col>
                        </Row>
                        <Row gutter={24} className="m-b-md">
                            <Col md={12} xs={12}>
                                <Typography className="m-b-xs">
                                    Google Map Link
                                </Typography>
                                <Input placeholder="Google Map Link" />
                            </Col>
                            <Col md={12} xs={12}>
                                <Typography className="m-b-xs">
                                    Road Frontage (ft)
                                </Typography>
                                <Input placeholder="Road Frontage (ft)" />
                            </Col>
                        </Row>
                        <Row gutter={24} className="m-b-md">
                            <Col md={12} xs={12}>
                                <Typography className="m-b-xs">
                                    Redfin Quick Link
                                </Typography>
                                <Input placeholder="Redfin Quick Link" />
                            </Col>
                            <Col md={12} xs={12}>
                                <Typography className="m-b-xs">
                                    Opening Bid
                                </Typography>
                                <Input placeholder="Opening Bid" />
                            </Col>
                        </Row>
                        <Row gutter={24} className="m-b-md">
                            <Col md={12} xs={12}>
                                <Typography className="m-b-xs">
                                    Assessed Value
                                </Typography>
                                <Input placeholder="Assessed Value" />
                            </Col>
                            <Col md={12} xs={12}>
                                <Typography className="m-b-xs">
                                    Assessed vs. Opening Bid Margin (manual)
                                </Typography>
                                <Input placeholder="Assessed vs. Opening Bid Margin (manual)" />
                            </Col>
                        </Row>
                        <Row gutter={24} className="m-b-md">
                            <Col md={12} xs={12}>
                                <Typography className="m-b-xs">
                                    Assessed vs. Opening Bid Multiple (manual)
                                </Typography>
                                <Input placeholder="Assessed vs. Opening Bid Multiple (manual)" />
                            </Col>
                            <Col md={12} xs={12}>
                                <Typography className="m-b-xs">
                                    Wetlands Status
                                </Typography>
                                <Select
                                    defaultValue="Select"
                                    style={{ width: "100%" }}
                                    onChange={handleChangeType}
                                    options={[
                                        { value: "None", label: "None" },
                                        {
                                            value: "Small Portion",
                                            label: "Small Portion",
                                        },
                                        { value: "Half", label: "Half" },
                                        {
                                            value: "Most",
                                            label: "Most",
                                        },
                                        { value: "All", label: "All" },
                                    ]}
                                />
                            </Col>
                        </Row>
                        <Row gutter={24} className="m-b-md">
                            <Col md={12} xs={12}>
                                <Typography className="m-b-xs">
                                    Legal Description
                                </Typography>
                                <Input placeholder="Legal Description" />
                            </Col>
                            <Col md={12} xs={12}>
                                <Typography className="m-b-xs">
                                    Subdivision
                                </Typography>
                                <Input placeholder="Subdivision" />
                            </Col>
                        </Row>
                        <Row gutter={24} className="m-b-md">
                            <Col md={12} xs={12}>
                                <Typography className="m-b-xs">
                                    Flood Zone
                                </Typography>
                                <Select
                                    defaultValue="Yes"
                                    style={{ width: "100%" }}
                                    onChange={handleChangeType}
                                    options={[
                                        { value: "Yes", label: "Yes" },
                                        {
                                            value: "No",
                                            label: "No",
                                        },
                                    ]}
                                />
                            </Col>
                            <Col md={12} xs={12}>
                                <Typography className="m-b-xs">
                                    Topography
                                </Typography>
                                <Input placeholder="Topography" />
                            </Col>
                        </Row>
                        <Row gutter={24} className="m-b-md">
                            <Col md={12} xs={12}>
                                <Typography className="m-b-xs">
                                    Wireless 1
                                </Typography>
                                <Input placeholder="Wireless 1" />
                            </Col>
                            <Col md={12} xs={12}>
                                <Typography className="m-b-xs">
                                    Wireless 2
                                </Typography>
                                <Input placeholder="Wireless 2" />
                            </Col>
                        </Row>
                        <Row gutter={24} className="m-b-md">
                            <Col md={12} xs={12}>
                                <Typography className="m-b-xs">
                                    Wireless 3
                                </Typography>
                                <Input placeholder="Wireless 3" />
                            </Col>
                            <Col md={12} xs={12}>
                                <Typography className="m-b-xs">
                                    Wireless 4
                                </Typography>
                                <Input placeholder="Wireless 4" />
                            </Col>
                        </Row>
                        <Row gutter={24} className="m-b-md">
                            <Col md={12} xs={12}>
                                <Typography className="m-b-xs">
                                    Landline 1
                                </Typography>
                                <Input placeholder="Landline 1" />
                            </Col>
                            <Col md={12} xs={12}>
                                <Typography className="m-b-xs">
                                    Landline 2
                                </Typography>
                                <Input placeholder="Landline 2" />
                            </Col>
                        </Row>
                        <Row gutter={24} className="m-b-md">
                            <Col md={12} xs={12}>
                                <Typography className="m-b-xs">
                                    Landline 3
                                </Typography>
                                <Input placeholder="Landline 3" />
                            </Col>
                            <Col md={12} xs={12}>
                                <Typography className="m-b-xs">
                                    Landline 4
                                </Typography>
                                <Input placeholder="Landline 4" />
                            </Col>
                        </Row>
                        <Row gutter={24} className="m-b-md">
                            <Col md={12} xs={12}>
                                <Typography className="m-b-xs">
                                    MarketAreaName
                                </Typography>
                                <Input placeholder="MarketAreaName" />
                            </Col>
                            <Col md={12} xs={12}></Col>
                        </Row>
                        <Row gutter={24} className="m-b-md">
                            <Col>
                                <Typography.Title level={5}>
                                    Social
                                </Typography.Title>
                            </Col>
                        </Row>
                        <Row gutter={24} className="m-b-md">
                            <Col md={12} xs={12}>
                                <Typography className="m-b-xs">
                                    Skype
                                </Typography>
                                <Input placeholder="Skype" />
                            </Col>
                            <Col md={12} xs={12}>
                                <Typography className="m-b-xs">
                                    Website
                                </Typography>
                                <Input placeholder="Website" />
                            </Col>
                        </Row>

                        <Row gutter={24}>
                            <Col md={12} xs={12}>
                                <Typography className="m-b-xs">
                                    Facebook
                                </Typography>
                                <Input placeholder="Skype" />
                            </Col>
                            <Col md={12} xs={12}>
                                <Typography className="m-b-xs">
                                    LinkedIn
                                </Typography>
                                <Input placeholder="Website" />
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col md={12} xs={12}>
                                <Typography className="m-b-xs">
                                    Twitter
                                </Typography>
                                <Input placeholder="Skype" />
                            </Col>
                            <Col md={12} xs={12}>
                                <Typography className="m-b-xs">
                                    Instagram
                                </Typography>
                                <Input placeholder="Website" />
                            </Col>
                        </Row>

                        <Row gutter={24}>
                            <Col>
                                <Typography.Title level={5}>
                                    Details
                                </Typography.Title>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col md={24} xs={24}>
                                <Typography className="m-b-xs">
                                    Description
                                </Typography>
                                <Input.TextArea
                                    maxLength={6}
                                    placeholder="Description"
                                />
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col md={24} xs={24}>
                                <Typography className="m-b-xs">Tags</Typography>
                                <Input placeholder="Tags" />
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col md={24} xs={24}>
                                <Typography className="m-b-xs">
                                    Legal Description
                                </Typography>
                                <Input placeholder="Legal Description" />
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col>
                                <Typography.Title level={5}>
                                    Address
                                </Typography.Title>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col md={12} xs={12}>
                                <Typography className="m-b-xs">
                                    Address Line 1
                                </Typography>
                                <Input placeholder="Address Line 1" />
                            </Col>
                            <Col md={12} xs={12}>
                                <Typography className="m-b-xs">
                                    Address Line 2
                                </Typography>
                                <Input placeholder="Address Line 2" />
                            </Col>
                        </Row>

                        <Row gutter={24}>
                            <Col md={12} xs={12}>
                                <Typography className="m-b-xs">City</Typography>
                                <Input placeholder="City" />
                            </Col>
                            <Col md={12} xs={12}>
                                <Typography className="m-b-xs">
                                    County
                                </Typography>
                                <Input placeholder="County" />
                            </Col>
                        </Row>

                        <Row gutter={24}>
                            <Col md={12} xs={12}>
                                <Typography className="m-b-xs">
                                    ZipCode
                                </Typography>
                                <Input placeholder="ZipCode" />
                            </Col>
                            <Col md={12} xs={12}>
                                <Typography className="m-b-xs">
                                    State
                                </Typography>
                                <Input placeholder="State" />
                            </Col>
                        </Row>

                        <Row gutter={24}>
                            <Col md={12} xs={12}>
                                <Typography className="m-b-xs">
                                    Country
                                </Typography>
                                <Input placeholder="Country" />
                            </Col>
                        </Row>
                    </Form>
                </div>
                <div className="modal-footer">
                    <Button className="m-r-xs" type="primary">
                        Save
                    </Button>
                    <Button className="m-r-xs" type="primary">
                        Save and add other
                    </Button>
                    <Button onClick={() => setIsModalOpen(false)}>
                        Cancel
                    </Button>
                </div>
            </Modal>
        </>
    );
};

export default ContactsComponentsAddContacts;
