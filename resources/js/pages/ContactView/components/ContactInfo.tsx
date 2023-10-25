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
import { useAppContextProvider } from "../../../context/AppContext";
import {
    createCustomFieldMutation,
    saveCustomFieldValuesMutation,
} from "../../../api/mutation/useCustomFieldMutation";

const ContactInfo = ({ contact }: { contact: TContact }) => {
    const [isCreateNewTypeOpen, setIsCreateNewTypeOpen] = React.useState(false);
    const [form] = Form.useForm<TContact>();
    const { contactTypes, isLoading } = useContactTypesAll();
    const contactTypelookupId = contact.fields.contactTypelookupIds
        ? JSON.parse(contact.fields.contactTypelookupIds)[0]
        : "0";
    const contactType = contactTypes?.find(
        (type) => type.id == contactTypelookupId
    );
    // const { contact } = useContext(ContactContext);
    const [tagSearchKey, setTagSearchKey] = React.useState("");

    const { loggedInUser } = useAppContextProvider();

    const save = useMutation(saveCustomFieldValuesMutation, {
        onSuccess: () => {
            queryClient.invalidateQueries("getContact");
        },
        onError: (e: any) => {
            console.log(e.message || "An error occurred");
        },
    });

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
            queryClient.invalidateQueries("getContact");
            queryClient.invalidateQueries("thread");
        },
    });

    const handleFinish = async (values: TContact) => {
        console.log(values);
        await updateContact.mutate({ ...values, id: contact.id });
    };

    const handleTypeChange = async (e) => {
        const fields = {
            contactType: [e.key],
        };
        save.mutate({
            fields,
            customableId: contact.id,
            customableType: "contact",
        });
    };

    return (
        <Card style={{ width: "100%" }}>
            <Space direction="vertical" style={{ width: "100%" }} size="large">
                <Row>
                    <Col span={12}>
                        <Dropdown
                            overlay={
                                <Menu
                                    onClick={handleTypeChange}
                                    selectedKeys={[contactTypelookupId]}
                                >
                                    <Menu.Item key="search">
                                        <Input
                                            placeholder="Search"
                                            onKeyUp={(e: any) =>
                                                setTagSearchKey(e.target.value)
                                            }
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    </Menu.Item>
                                    <Menu.Item key="disabled" disabled>
                                        <Typography.Text strong>
                                            SELECT CONTACT TYPE
                                        </Typography.Text>
                                    </Menu.Item>

                                    <Menu.Item key={0}>
                                        <Tag>No Type</Tag>
                                    </Menu.Item>
                                    {contactTypes
                                        ?.filter((tag) =>
                                            tag.name.includes(tagSearchKey)
                                        )
                                        ?.map((type) => (
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
                                {contactTypelookupId &&
                                contactTypelookupId != 0 ? (
                                    <Tag
                                        color={contactType?.highlight}
                                        style={{ cursor: "pointer" }}
                                    >
                                        {contactType?.name}
                                    </Tag>
                                ) : (
                                    <Tag style={{ cursor: "pointer" }}>
                                        No Type
                                    </Tag>
                                )}
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
                        {contact.fields.firstName +
                            " " +
                            contact.fields.lastName}
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
                <ActionMenu contact={contact} />

                <Space
                    style={{ width: "100%", justifyContent: "space-between" }}
                >
                    <Typography.Text strong>Contact Details</Typography.Text>
                </Space>

                <Form form={form} onFinish={handleFinish} layout="vertical">
                    <Form.Item name="typeId" style={{ display: "none" }}>
                        <Input />
                    </Form.Item>
                    {/* <Descriptions column={1}>
                        <Descriptions.Item label="Default Mobile">
                            <EditableText
                                type="select"
                                value={contact.defaultMobileNumberId}
                                placeholderValue={
                                    contact.defaultMobileNumber?.mobileNumber
                                }
                                column="defaultMobileNumberId"
                                form={form}
                                options={loggedInUser?.numbers?.map(
                                    (number) => ({
                                        value: number.id,
                                        label: number.mobileNumber,
                                    })
                                )}
                            />
                        </Descriptions.Item>

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
                                type="selectTags"
                                value={contact.tags}
                                column="tags"
                                form={form}
                            />
                        </Descriptions.Item>
                    </Descriptions> */}
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
    placeholderValue,
}: {
    type: "select" | "inputNumber" | "input" | "selectTags";
    options?: { label: string; value: string }[];
    value?: string | number | string[];
    column: string;
    form: any;
    placeholderValue?: string;
}) => {
    const [editing, setEditing] = React.useState(false);
    const [text, setText] = React.useState(
        placeholderValue ? placeholderValue : value ?? "-"
    );
    const [textBackgroundColor, setTextBackgroundColor] = React.useState("");

    const handleTextClick = () => {
        setEditing(true);
    };

    const handleInputChange = (e) => {
        setText(e.target.value);
    };

    const handleSelectChange = (value) => {
        const selectedOption = options?.find(
            (option) => option.value === value
        );
        const selectedLabel = selectedOption ? selectedOption.label : ""; // Use an empty string as a default value if the option is not found
        setText(selectedLabel);
    };

    const handleInputBlur = () => {
        setTextBackgroundColor("");
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
                        showSearch
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
            case "selectTags":
                return (
                    <Select
                        mode="tags"
                        style={{ width: "100%" }}
                        tokenSeparators={[","]}
                        onChange={handleSelectChange}
                        onBlur={handleInputBlur}
                        // options={options}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <>
            {editing ? (
                <Form.Item
                    name={[column]}
                    style={{ width: "100%", marginBottom: 0 }}
                    initialValue={text}
                >
                    {renderInputComponent()}
                </Form.Item>
            ) : (
                <span
                    onClick={handleTextClick}
                    style={{
                        width: "100%",
                        height: "30px",
                        backgroundColor: textBackgroundColor,
                    }}
                    onMouseEnter={() => setTextBackgroundColor("#ADD8E6")}
                    onMouseLeave={() => setTextBackgroundColor("")}
                >
                    {text}
                </span>
            )}
        </>
    );
};

const CreateNewTypeForm = ({ onClose }: { onClose: () => void }) => {
    const [form] = Form.useForm();
    const highlight = Form.useWatch("highlight", form);

    const addType = useMutation(addTypeMutation, {
        onSuccess: () => {
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
