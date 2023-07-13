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

interface ContactsComponentsManageColumnProps {
    isModalManageColumnOpen: boolean;
    setIsModalManageColumnOpen: any;
}

// const handleChange = (value: string) => {
//     console.log(`selected ${value}`);
// };

// const handleChangeType = (value: string) => {
//     console.log(`selected ${value}`);
// };

const onChange = (e: CheckboxChangeEvent) => {
    console.log(`checked = ${e.target.checked}`);
};

const ContactsComponentsManageColumn: React.FC<
    ContactsComponentsManageColumnProps
> = ({ isModalManageColumnOpen, setIsModalManageColumnOpen }) => {
    return (
        <>
            <Modal
                closable={false}
                className="your-modal"
                width={1000}
                title={null}
                open={isModalManageColumnOpen}
                onCancel={() => setIsModalManageColumnOpen(false)}
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
                    <Typography.Title level={5}>
                        Manage Columns
                    </Typography.Title>
                    <Button type="link" style={{ marginRight: "-640px" }}>
                        {" "}
                        <u>Add Custom Field</u>
                    </Button>
                    <Button
                        onClick={() => setIsModalManageColumnOpen(false)}
                        icon={<CloseOutlined />}
                    />
                </div>
                <div className="modal-content">
                    <Row gutter={24} className="m-b-md m-t-md">
                        <Col md={12} xs={12}>
                            <Row>
                                <Button type="primary">Contact</Button>
                                <Input
                                    className="m-t-sm m-b-lg"
                                    placeholder="Search Fields"
                                />
                            </Row>
                            <Row>
                                <Col
                                    md={24}
                                    xs={24}
                                    style={{
                                        height: "600px",
                                        overflowY: "auto",
                                    }}
                                >
                                    <Typography.Title level={5}>
                                        System Fields
                                    </Typography.Title>
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        First Name
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Last Name
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Mobile
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Email
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        County Link
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Job Title
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Acres
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Other Phone
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Phone
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        SMS Opt Out
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Owner
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Email 2
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Type
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Mailing Street Address
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Email Opt Out
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Mailing City
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Mailing State
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Email Opt Out Reason
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Mailing Street Address
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Mailing Zip
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Mailing County
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Subdivision
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        APN
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Google Map Link
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Road Frontage (ft)
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Redfin Quick Link
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Opening Bid
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Assessed vs Opening Bid Margin (manual)
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Assessed vs Opening Bid Multiple
                                        (manual)
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Wetlands Status
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Legal Description
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Subdivision
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Flood Zone
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Topography
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Wireless 1
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Wireless 2
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Wireless 3
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Wireless 4
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Landline 1
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Landline 2
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Landline 3
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Landline 4
                                    </Checkbox>
                                    <br />
                                    <Typography.Title
                                        className="m-t-md"
                                        level={5}
                                    >
                                        Social
                                    </Typography.Title>
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Skype
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Website
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        LinkedIn
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Facebook
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Instagram
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Twitter
                                    </Checkbox>
                                    <br />
                                    <Typography.Title
                                        className="m-t-md"
                                        level={5}
                                    >
                                        Details
                                    </Typography.Title>
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Description
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Tags
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Legal Description
                                    </Checkbox>
                                    <br />
                                    <Typography.Title
                                        className="m-t-md"
                                        level={5}
                                    >
                                        Address
                                    </Typography.Title>

                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Address Line 1
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Address Line 2
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        City
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Zip Code
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        County
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Country
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        State
                                    </Checkbox>
                                    <br />
                                    <Typography.Title
                                        className="m-t-md"
                                        level={5}
                                    >
                                        Internal
                                    </Typography.Title>

                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Name
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Created At
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Created By
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Last Modified Date
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Last Modified By
                                    </Checkbox>
                                    <br />
                                    <Checkbox
                                        onChange={onChange}
                                        className="m-t-sm"
                                    >
                                        Last Note Added By
                                    </Checkbox>
                                </Col>
                            </Row>
                        </Col>

                        <Col md={12} xs={12}>
                            <Row
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                }}
                            >
                                <Typography.Title level={5}>
                                    Selected fields
                                </Typography.Title>
                                <Button type="link">Clear all</Button>
                            </Row>
                        </Col>
                    </Row>
                </div>
                <div className="modal-footer">
                    <Button type="link" style={{ marginRight: "646px" }}>
                        {" "}
                        <u>Reset to default columns</u>
                    </Button>
                    <Button className="m-r-xs" type="primary">
                        Save
                    </Button>

                    <Button onClick={() => setIsModalManageColumnOpen(false)}>
                        Cancel
                    </Button>
                </div>
            </Modal>
        </>
    );
};

export default ContactsComponentsManageColumn;
