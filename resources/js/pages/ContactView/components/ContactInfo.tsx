import {
    CameraOutlined,
    CaretDownFilled,
    CheckCircleOutlined,
    CheckOutlined,
    CloseOutlined,
    DownOutlined,
    EditOutlined,
    EllipsisOutlined,
    LeftOutlined,
    MailFilled,
    MessageFilled,
    PhoneFilled,
    PhoneOutlined,
} from "@ant-design/icons";
import {
    Avatar,
    Badge,
    Button,
    Card,
    Col,
    Descriptions,
    Divider,
    Dropdown,
    Form,
    FormInstance,
    Input,
    InputNumber,
    Mentions,
    Menu,
    MenuProps,
    Popover,
    Radio,
    Row,
    Select,
    Space,
    Tag,
    Typography,
} from "antd";
import React, { useContext } from "react";
import { DEFAULT_REQUIRED_MESSAGE } from "../../../constants";
import DropdownComponent from "../../../components/DropdownComponent";
import ActionMenuBtn from "./ActionMenuBtn";
import AvatarWithPopover from "./AvatarWithPopover";
import ActionMenu from "./ActionMenu";
import { useMutation } from "react-query";
import {
    addTypeMutation,
    updateContactMutation,
} from "../../../api/mutation/useContactMutation";
import { TContact, TContactType } from "../../../entities";
import { useContactTypesAll } from "../../../api/query/contactsQuery";
import queryClient from "../../../queryClient";
import { useParams } from "react-router-dom";
import ContactContext from "../context";

const ContactInfo = () => {
    const [isCreateNewTypeOpen, setIsCreateNewTypeOpen] = React.useState(false);
    const [form] = Form.useForm<TContact>();
    const { contactTypes, isLoading } = useContactTypesAll();
    const { contact } = useContext(ContactContext);

    const actionMenuList = [
        {
            label: <a href="https://www.antgroup.com">Edit Contact</a>,
            key: "0",
        },
        {
            label: <a href="https://www.aliyun.com">Clone</a>,
            key: "1",
        },
        {
            label: <a href="https://www.aliyun.com">Add to List</a>,
            key: "3",
        },
        {
            type: "divider",
        },
        {
            label: "Delete",
            key: "4",
        },
        {
            label: "Delete Tracking Logs",
            key: "5",
        },
    ];

    const updateContact = useMutation(updateContactMutation, {
        onSuccess: () => {
            form.resetFields();
        },
    });

    const handleFinish = async (values: TContact) => {
        await updateContact.mutate({ ...values, id: contact.id });
        form.setFieldsValue(values);
    };

    return (
        <Card style={{ width: "100%" }}>
            <Space direction="vertical" style={{ width: "100%" }} size="large">
                <Row>
                    <Col span={12}>
                        <Dropdown
                            overlay={
                                <Menu>
                                    <Menu.Item key="search">
                                        <Input placeholder="Search" />
                                    </Menu.Item>
                                    <Menu.Item key="search" disabled>
                                        <Typography.Text strong>
                                            SELECT CONTACT TYPE
                                        </Typography.Text>
                                    </Menu.Item>

                                    <Menu.Item key={0}>
                                        <Tag>No Type</Tag>
                                    </Menu.Item>
                                    {contactTypes?.map((type) => (
                                        <Menu.Item key={type.id}>
                                            <Tag color={type.highlight}>
                                                {type.name}
                                            </Tag>
                                        </Menu.Item>
                                    ))}
                                    <Menu.Divider />
                                    <Menu.Item key="new">
                                        <a
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setIsCreateNewTypeOpen(true);
                                            }}
                                        >
                                            Create New Type
                                        </a>
                                    </Menu.Item>
                                </Menu>
                            }
                            trigger={["click"]}
                        >
                            <Popover
                                content={
                                    <CreateNewTypeForm
                                        onClose={() =>
                                            setIsCreateNewTypeOpen(false)
                                        }
                                    />
                                }
                                title={
                                    <Space>
                                        <LeftOutlined
                                            onClick={() =>
                                                setIsCreateNewTypeOpen(false)
                                            }
                                        />
                                        <Typography.Text>
                                            CREATE NEW TYPE
                                        </Typography.Text>
                                    </Space>
                                }
                                visible={isCreateNewTypeOpen}
                                placement="rightTop"
                            >
                                <Button
                                    type="default"
                                    style={{ backgroundColor: "#E6EAF2" }}
                                    size="small"
                                >
                                    No type
                                </Button>
                            </Popover>
                        </Dropdown>
                    </Col>
                    <Col span={12} style={{ float: "right" }}>
                        <DropdownComponent
                            menuList={actionMenuList}
                            label="Actions"
                            floatRight
                        />
                    </Col>
                </Row>
                <Space>
                    <Badge count={1} offset={[-8, 8]} showZero>
                        <AvatarWithPopover />
                    </Badge>
                    <Typography.Title level={5}>
                        {contact.firstName + " " + contact.lastName}
                    </Typography.Title>
                </Space>

                <DropdownComponent
                    menuList={actionMenuList}
                    label={
                        <Space>
                            <Avatar
                                style={{
                                    backgroundColor: "#C0CA33",
                                    verticalAlign: "middle",
                                }}
                                size={20}
                            >
                                J
                            </Avatar>
                            <Typography.Text>Jesse Ashley</Typography.Text>
                        </Space>
                    }
                />
                <ActionMenu />

                <Space
                    style={{ width: "100%", justifyContent: "space-between" }}
                >
                    <Typography.Text strong>Contact Details</Typography.Text>
                </Space>

                <Form
                    form={form}
                    onFinish={handleFinish}
                    layout="vertical"
                    initialValues={contact}
                >
                    <Descriptions column={1}>
                        <Descriptions.Item label="Email">
                            <EditableText
                                type="input"
                                value={contact.email}
                                column="email"
                                form={form}
                            />
                        </Descriptions.Item>
                        <Descriptions.Item label="Phone">
                            <EditableText
                                type="input"
                                value={contact.phone}
                                column="phone"
                                form={form}
                            />
                        </Descriptions.Item>
                        <Descriptions.Item label="Redfin Quick Link">
                            <EditableText
                                type="input"
                                value={contact.redfinLink}
                                column="redfinLink"
                                form={form}
                            />
                        </Descriptions.Item>
                        <Descriptions.Item label="County Link">
                            <EditableText
                                type="input"
                                value={contact.countryLink}
                                column="countryLink"
                                form={form}
                            />
                        </Descriptions.Item>
                        <Descriptions.Item label="APN">
                            <EditableText
                                type="input"
                                value={contact.APN}
                                column="APN"
                                form={form}
                            />
                        </Descriptions.Item>
                        <Descriptions.Item label="Google Map Link">
                            <EditableText
                                type="input"
                                value={contact.gMapLink}
                                column="gMapLink"
                                form={form}
                            />
                        </Descriptions.Item>
                        <Descriptions.Item label="Acres">
                            <EditableText
                                type="inputNumber"
                                value={contact.acres}
                                column="acres"
                                form={form}
                            />
                        </Descriptions.Item>
                        <Descriptions.Item label="Wetlands Status">
                            <EditableText
                                type="select"
                                value={contact.wetlandsStatus}
                                column="wetlandsStatus"
                                form={form}
                                options={[
                                    {
                                        value: "None",
                                        label: "None",
                                    },
                                    {
                                        value: "Small Portion",
                                        label: "Small Portion",
                                    },
                                    {
                                        value: "Half",
                                        label: "Half",
                                    },
                                    {
                                        value: "Most",
                                        label: "Most",
                                    },
                                    { value: "All", label: "All" },
                                ]}
                            />
                        </Descriptions.Item>
                        <Descriptions.Item label="Mobile">
                            <EditableText
                                type="input"
                                value={contact.mobile}
                                column="mobile"
                                form={form}
                            />
                        </Descriptions.Item>
                        <Descriptions.Item label="Other Phone">
                            <EditableText
                                type="input"
                                value={contact.otherPhone}
                                column="otherPhone"
                                form={form}
                            />
                        </Descriptions.Item>
                        <Descriptions.Item label="Website">
                            <EditableText
                                type="input"
                                value={contact.website}
                                column="website"
                                form={form}
                            />
                        </Descriptions.Item>
                        <Descriptions.Item label="Address Line 1">
                            <EditableText
                                type="input"
                                value={contact.addressLine1}
                                column="addressLine1"
                                form={form}
                            />
                        </Descriptions.Item>
                        <Descriptions.Item label="Address Line 2">
                            <EditableText
                                type="input"
                                value={contact.addressLine2}
                                column="addressLine2"
                                form={form}
                            />
                        </Descriptions.Item>
                        <Descriptions.Item label="City">
                            <EditableText
                                type="input"
                                value={contact.city}
                                column="city"
                                form={form}
                            />
                        </Descriptions.Item>
                        <Descriptions.Item label="State">
                            <EditableText
                                type="input"
                                value={contact.state}
                                column="state"
                                form={form}
                            />
                        </Descriptions.Item>
                        <Descriptions.Item label="ZipCode">
                            <EditableText
                                type="inputNumber"
                                value={contact.zipCode}
                                column="zipCode"
                                form={form}
                            />
                        </Descriptions.Item>
                        <Descriptions.Item label="County">
                            <EditableText
                                type="input"
                                value={contact.country}
                                column="country"
                                form={form}
                            />
                        </Descriptions.Item>
                        <Descriptions.Item label="Description">
                            <EditableText
                                type="input"
                                value={contact.detailsDescription}
                                column="detailsDescription"
                                form={form}
                            />
                        </Descriptions.Item>
                        <Descriptions.Item label="Tags">
                            <EditableText
                                type="input"
                                value={contact.tags}
                                column="tags"
                                form={form}
                            />
                        </Descriptions.Item>
                    </Descriptions>
                </Form>
            </Space>
        </Card>
    );
};

const EditableText = ({
    type,
    options,
    value,
    column,
    form,
}: {
    type: "select" | "inputNumber" | "input" | "mention";
    options?: { label: string; value: string }[];
    value?: string | number;
    column: string;
    form: any;
}) => {
    const [editing, setEditing] = React.useState(false);
    const [text, setText] = React.useState(value ?? "-");

    const handleTextClick = () => {
        setEditing(true);
    };

    const handleInputChange = (e) => {
        setText(e.target.value);
    };

    const handleSelectChange = (value) => {
        setText(value);
    };

    const handleInputBlur = () => {
        setEditing(false);
        form.submit();
    };

    const renderInputComponent = () => {
        switch (type) {
            case "input":
                return (
                    <Input
                        value={text}
                        onChange={handleInputChange}
                        onBlur={handleInputBlur}
                        autoFocus
                    />
                );
            case "inputNumber":
                return (
                    <InputNumber
                        value={text}
                        onChange={handleInputChange}
                        onBlur={handleInputBlur}
                        autoFocus
                    />
                );
            case "select":
                return (
                    <Select
                        value={text}
                        onChange={handleSelectChange}
                        onBlur={handleInputBlur}
                        autoFocus
                        style={{ width: "100%" }}
                    >
                        {options?.map((option) => (
                            <Select.Option
                                key={option.value}
                                value={option.value}
                            >
                                {option.label}
                            </Select.Option>
                        ))}
                    </Select>
                );
            case "mention":
                return (
                    <Mentions
                        rows={1}
                        style={{ width: "100%" }}
                        options={options}
                        onChange={(e) => {
                            setText(e);
                        }}
                        onSelect={(e) => console.log(e)}
                        onBlur={handleInputBlur}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <>
            {editing ? (
                <Form.Item name={[column]} style={{ width: "100%" }}>
                    {renderInputComponent()}
                </Form.Item>
            ) : (
                <span onClick={handleTextClick}>{text}</span>
            )}
        </>
    );
};

const CreateNewTypeForm = ({ onClose }: { onClose: () => void }) => {
    const [form] = Form.useForm();
    const highlight = Form.useWatch("highlight", form);

    const addType = useMutation(addTypeMutation, {
        onSuccess: () => {
            console.log("success");
            queryClient.invalidateQueries("contactTypesAll");
            form.resetFields();
            onClose();
        },
    });

    const ColorButton = ({ color }) => (
        <Button
            style={{ backgroundColor: color }}
            shape="circle"
            size="small"
            onClick={() => {
                console.log(color);
                form.setFieldsValue({ highlight: color });
            }}
        >
            {highlight == color && <CheckOutlined style={{ color: "white" }} />}
        </Button>
    );

    const handleFinish = (values: TContactType) => {
        console.log(values);
        addType.mutate(values);
        // Perform form submission logic here
    };
    return (
        <Space direction="vertical">
            <Form form={form} layout="vertical" onFinish={handleFinish}>
                <Form.Item
                    label="Name"
                    name="name"
                    required
                    rules={[
                        {
                            required: true,
                            message: DEFAULT_REQUIRED_MESSAGE,
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Highlights"
                    name="highlight"
                    required
                    rules={[
                        {
                            required: true,
                            message: DEFAULT_REQUIRED_MESSAGE,
                        },
                    ]}
                >
                    <Space direction="vertical">
                        <Typography.Text style={{ fontSize: "11px" }}>
                            Color code your contact type
                        </Typography.Text>
                        <Space>
                            <ColorButton color="magenta" />
                            <ColorButton color="red" />
                            <ColorButton color="yellow" />
                            <ColorButton color="orange" />
                            <ColorButton color="gold" />
                            <ColorButton color="gray" />
                        </Space>
                        <Space>
                            <ColorButton color="lime" />
                            <ColorButton color="green" />
                            <ColorButton color="cyan" />
                            <ColorButton color="blue" />
                            <ColorButton color="violet" />
                            <ColorButton color="purple" />
                        </Space>
                    </Space>
                </Form.Item>
                <Form.Item>
                    <Space style={{ float: "right" }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={addType.isLoading}
                        >
                            Create
                        </Button>
                        <Button htmlType="reset" onClick={() => onClose()}>
                            Cancel
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Space>
    );
};

export default ContactInfo;
