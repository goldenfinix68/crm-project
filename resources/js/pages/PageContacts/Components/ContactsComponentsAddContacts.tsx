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
import { useMutation } from "react-query";
import { addContactMutation } from "../../../api/mutation/useContactMutation";
import queryClient from "../../../queryClient";
import { TContact } from "../../../entities";

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
    const [form] = Form.useForm<TContact>();
    const [isAddNew, seIsAddNew] = useState(false);

    const addContact = useMutation(addContactMutation, {
        onSuccess: () => {
            console.log("success");
            //queryClient.invalidateQueries("contactTypesAll");
            form.resetFields();
            setIsModalOpen(false);
        },
    });

    const handleFinish = (values: TContact) => {
        addContact.mutate(values);
        console.log(values);
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
                    <Form
                        form={form}
                        onFinish={handleFinish}
                        layout="vertical"
                        initialValues={{ ownerId: 1 }}
                    >
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
                                <Form.Item name="acres" label="Acres">
                                    <Input placeholder="Acres" />
                                </Form.Item>
                            </Col>
                            <Col md={12} xs={12}>
                                <Form.Item name="email" label="Email">
                                    <Input placeholder="Email" />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col md={12} xs={12}>
                                <Form.Item name="jobTitle" label="Job Title">
                                    <Input placeholder="Job Title" />
                                </Form.Item>
                            </Col>
                            <Col md={12} xs={12}>
                                <Form.Item name="phone" label="Phone">
                                    <Input placeholder="Phone" />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col md={12} xs={12}>
                                <Form.Item
                                    name="otherPhone"
                                    label="Other Phone"
                                >
                                    <Input placeholder="Other Phone" />
                                </Form.Item>
                            </Col>
                            <Col md={12} xs={12}>
                                <Form.Item name="ownerId" label="Owner">
                                    <Select
                                        defaultValue="Jesse Admin"
                                        style={{ width: "100%" }}
                                        onChange={handleChange}
                                        options={[
                                            {
                                                value: 1,
                                                label: "Jesse Admin",
                                            },
                                            {
                                                value: 2,
                                                label: "Jesse Ashley",
                                            },
                                        ]}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col md={12} xs={12}>
                                <Form.Item name="email2" label="Email 2">
                                    <Input placeholder="Email 2" />
                                </Form.Item>
                            </Col>
                            <Col md={12} xs={12}>
                                <Form.Item name="type" label="Type">
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
                                            {
                                                value: "Vendor",
                                                label: "Vendor",
                                            },
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
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col md={12} xs={12}>
                                <Form.Item
                                    name="mailingStreetAddress"
                                    label="Mailing Street Address"
                                >
                                    <Input placeholder="Mailing Street Address" />
                                </Form.Item>
                            </Col>
                            <Col md={12} xs={12}>
                                <Form.Item name="emailOptOut">
                                    <Checkbox
                                        className={"m-t-lg"}
                                        onChange={onChange}
                                    >
                                        Email Opt Out
                                    </Checkbox>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col md={12} xs={12}>
                                <Form.Item
                                    name="mailingCity"
                                    label="Mailing City"
                                >
                                    <Input placeholder="Mailing City" />
                                </Form.Item>
                            </Col>
                            <Col md={12} xs={12}>
                                <Form.Item
                                    name="mailingState"
                                    label="Mailing State"
                                >
                                    <Input placeholder="Mailing State" />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col md={12} xs={12}>
                                <Form.Item name="smsOptOut">
                                    <Checkbox
                                        className={"m-t-lg"}
                                        onChange={onChange}
                                    >
                                        SMS Opt Out
                                    </Checkbox>
                                </Form.Item>
                            </Col>
                            <Col md={12} xs={12}>
                                <Form.Item
                                    name="emailOptOutReason"
                                    label="Email Opt Out Reason"
                                >
                                    <Input.TextArea placeholder="Email Opt Out Reason" />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col md={12} xs={12}>
                                <Form.Item
                                    name="mailingZip"
                                    label="Mailing Zip"
                                >
                                    <Input placeholder="Mailing Zip" />
                                </Form.Item>
                            </Col>
                            <Col md={12} xs={12}>
                                <Form.Item
                                    name="mailingCounty"
                                    label="Mailing County"
                                >
                                    <Input placeholder="Mailing County" />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col md={12} xs={12}>
                                <Form.Item
                                    name="subdivision"
                                    label="Subdivision"
                                >
                                    <Input placeholder="Subdivision" />
                                </Form.Item>
                            </Col>

                            <Col md={12} xs={12}>
                                <Form.Item name="apn" label="APN">
                                    <Input placeholder="APN" />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col md={12} xs={12}>
                                <Form.Item
                                    name="googleMapLink"
                                    label="Google Map Link"
                                >
                                    <Input placeholder="Google Map Link" />
                                </Form.Item>
                            </Col>
                            <Col md={12} xs={12}>
                                <Form.Item
                                    name="roadFrontage"
                                    label="Road Frontage (ft)"
                                >
                                    <Input placeholder="Road Frontage (ft)" />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col md={12} xs={12}>
                                <Form.Item
                                    name="redfinQuickLink"
                                    label="Redfin Quick Link"
                                >
                                    <Input placeholder="Redfin Quick Link" />
                                </Form.Item>
                            </Col>
                            <Col md={12} xs={12}>
                                <Form.Item
                                    name="openingBid"
                                    label="Opening Bid"
                                >
                                    <Input placeholder="Opening Bid" />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col md={12} xs={12}>
                                <Form.Item
                                    name="assessedValue"
                                    label="Assessed Value"
                                >
                                    <Input placeholder="Assessed Value" />
                                </Form.Item>
                            </Col>
                            <Col md={12} xs={12}>
                                <Form.Item
                                    name="assessedVsOpeningBidMargin"
                                    label="Assessed vs. Opening Bid Margin (manual)"
                                >
                                    <Input placeholder="Assessed vs. Opening Bid Margin (manual)" />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col md={12} xs={12}>
                                <Form.Item
                                    name="assessedVsOpeningBidMultiple"
                                    label="Assessed vs. Opening Bid Multiple (manual)"
                                >
                                    <Input placeholder="Assessed vs. Opening Bid Multiple (manual)" />
                                </Form.Item>
                            </Col>
                            <Col md={12} xs={12}>
                                <Form.Item
                                    name="wetlandsStatus"
                                    label="Wetlands Status"
                                >
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
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col md={12} xs={12}>
                                <Form.Item
                                    name="legalDescription"
                                    label="Legal Description"
                                >
                                    <Input placeholder="Legal Description" />
                                </Form.Item>
                            </Col>
                            <Col md={12} xs={12}>
                                <Form.Item name="subdivision" label="Subdivion">
                                    <Input placeholder="Subdivision" />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col md={12} xs={12}>
                                <Form.Item name="floodZone" label="Flood Zone">
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
                                </Form.Item>
                            </Col>
                            <Col md={12} xs={12}>
                                <Form.Item name="topography" label="Topography">
                                    <Input placeholder="Topography" />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col md={12} xs={12}>
                                <Form.Item name="wireless1" label="Wireless 1">
                                    <Input placeholder="Wireless 1" />
                                </Form.Item>
                            </Col>
                            <Col md={12} xs={12}>
                                <Form.Item name="wireless2" label="Wireless 2">
                                    <Input placeholder="Wireless 2" />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col md={12} xs={12}>
                                <Form.Item name="wireless3" label="Wireless 3">
                                    <Input placeholder="Wireless 3" />
                                </Form.Item>
                            </Col>
                            <Col md={12} xs={12}>
                                <Form.Item name="wireless4" label="Wireless 4">
                                    <Input placeholder="Wireless 4" />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col md={12} xs={12}>
                                <Form.Item name="landline1" label="Landline 1">
                                    <Input placeholder="Landline 1" />
                                </Form.Item>
                            </Col>
                            <Col md={12} xs={12}>
                                <Form.Item name="landline2" label="Landline 2">
                                    <Input placeholder="Landline 2" />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col md={12} xs={12}>
                                <Form.Item name="landline3" label="Landline 3">
                                    <Input placeholder="Landline 3" />
                                </Form.Item>
                            </Col>
                            <Col md={12} xs={12}>
                                <Form.Item name="landline4" label="Landline 4">
                                    <Input placeholder="Landline 4" />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col md={12} xs={12}>
                                <Form.Item
                                    name="marketAreaName"
                                    label="MarketAreaName"
                                >
                                    <Input placeholder="MarketAreaName" />
                                </Form.Item>
                            </Col>
                            <Col md={12} xs={12}></Col>
                        </Row>
                        <Row gutter={24} className="m-b-sm">
                            <Col>
                                <Typography.Title level={5}>
                                    Social
                                </Typography.Title>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col md={12} xs={12}>
                                <Form.Item name="skype" label="Skype">
                                    <Input placeholder="Skype" />
                                </Form.Item>
                            </Col>
                            <Col md={12} xs={12}>
                                <Form.Item name="website" label="Website">
                                    <Input placeholder="Website" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={24}>
                            <Col md={12} xs={12}>
                                <Form.Item name="facebook" label="Facebook">
                                    <Input placeholder="Facebook" />
                                </Form.Item>
                            </Col>
                            <Col md={12} xs={12}>
                                <Form.Item name="linkedin" label="LinkedIn">
                                    <Input placeholder="LinkedIn" />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col md={12} xs={12}>
                                <Form.Item name="twitter" label="Twitter">
                                    <Input placeholder="Twitter" />
                                </Form.Item>
                            </Col>
                            <Col md={12} xs={12}>
                                <Form.Item name="instagram" label="Instagram">
                                    <Input placeholder="Instagram" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={24} className="m-b-sm">
                            <Col>
                                <Typography.Title level={5}>
                                    Details
                                </Typography.Title>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col md={24} xs={24}>
                                <Form.Item
                                    name="description"
                                    label="Description"
                                >
                                    <Input.TextArea
                                        maxLength={6}
                                        placeholder="Description"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col md={24} xs={24}>
                                <Form.Item name="tags" label="Tags">
                                    <Input placeholder="Tags" />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col md={24} xs={24}>
                                <Form.Item
                                    name="legalDescription"
                                    label="Legal Description"
                                >
                                    <Input placeholder="Legal Description" />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24} className="m-b-sm">
                            <Col>
                                <Typography.Title level={5}>
                                    Address
                                </Typography.Title>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col md={12} xs={12}>
                                <Form.Item
                                    name="addressLine1"
                                    label=" Address Line 1"
                                >
                                    <Input placeholder="Address Line 1" />
                                </Form.Item>
                            </Col>
                            <Col md={12} xs={12}>
                                <Form.Item
                                    name="addressLine2"
                                    label="Address Line 2"
                                >
                                    <Input placeholder="Address Line 2" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={24}>
                            <Col md={12} xs={12}>
                                <Form.Item name="city" label="City">
                                    <Input placeholder="City" />
                                </Form.Item>
                            </Col>
                            <Col md={12} xs={12}>
                                <Form.Item name="county" label="County">
                                    <Input placeholder="County" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={24}>
                            <Col md={12} xs={12}>
                                <Form.Item name="zipCode" label="Zip Code">
                                    <Input placeholder="Zip Code" />
                                </Form.Item>
                            </Col>
                            <Col md={12} xs={12}>
                                <Form.Item name="state" label="State">
                                    <Input placeholder="State" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={24}>
                            <Col md={12} xs={12}>
                                <Form.Item name="country" label="Country">
                                    <Input placeholder="Country" />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </div>
                <div className="modal-footer">
                    <Button
                        className="m-r-xs"
                        type="primary"
                        onClick={() => {
                            form.validateFields().then((values) => {
                                form.submit();
                            });
                        }}
                    >
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
