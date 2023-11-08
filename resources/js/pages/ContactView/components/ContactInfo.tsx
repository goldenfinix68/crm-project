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
    Table,
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
import ContactsEditableTableCell from "../../PageContacts/Components/ContactsEditableTableCell";
import ContactTypeTag from "../../../components/ContactTypeTag";

const ContactInfo = ({ contact }: { contact: TContact }) => {
    const [isCreateNewTypeOpen, setIsCreateNewTypeOpen] = React.useState(false);
    const [form] = Form.useForm<TContact>();
    const { contactTypes, isLoading } = useContactTypesAll();
    const contactTypelookupId = contact.fields?.contactTypelookupIds
        ? JSON.parse(contact.fields.contactTypelookupIds)[0]
        : "0";
    const contactType = contactTypes?.find(
        (type) => type.id == contactTypelookupId
    );
    // const { contact } = useContext(ContactContext);
    const [tagSearchKey, setTagSearchKey] = React.useState("");

    const { isRoleStats, contactFields } = useAppContextProvider();

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
        if (e.key != "new") {
            const fields = {
                contactType: [e.key],
            };
            save.mutate({
                fields,
                customableId: contact.id,
                customableType: "contact",
            });
        }
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

                                    <Menu.Item key={0} disabled={isRoleStats}>
                                        <Tag>No Type</Tag>
                                    </Menu.Item>
                                    {contactTypes
                                        ?.filter((tag) =>
                                            tag.name.includes(tagSearchKey)
                                        )
                                        ?.map((type) => (
                                            <Menu.Item
                                                key={type.id}
                                                disabled={isRoleStats}
                                            >
                                                <Tag color={type.highlight}>
                                                    {type.name}
                                                </Tag>
                                            </Menu.Item>
                                        ))}
                                    <Menu.Divider />
                                    <Menu.Item key="new" disabled={isRoleStats}>
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
                                <div style={{ cursor: "pointer" }}>
                                    <ContactTypeTag fields={contact.fields} />
                                </div>
                            </Popover>
                        </Dropdown>
                    </Col>
                    <Col span={12} style={{ float: "right" }}>
                        <DropdownComponent
                            menuList={actionMenuList}
                            label="Actions"
                            floatRight
                            disabled={isRoleStats}
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
                    disabled={isRoleStats}
                />
                <ActionMenu contact={contact} />

                <Space
                    style={{ width: "100%", justifyContent: "space-between" }}
                >
                    <Typography.Text strong>Contact Details</Typography.Text>
                </Space>

                <Table
                    dataSource={contactFields}
                    pagination={false}
                    showHeader={false}
                    className="tableCell"
                >
                    <Table.Column
                        key="label"
                        render={(text, record: any) => (
                            <b>{`${record.label}: `}</b>
                        )}
                        width={"30%"}
                    />
                    <Table.Column
                        key="value"
                        render={(text, record: any) => (
                            <ContactsEditableTableCell
                                record={contact.fields}
                                field={record}
                                handleSubmit={() => {
                                    queryClient.invalidateQueries("getContact");
                                }}
                            />
                        )}
                        width={"70%"}
                    />
                </Table>
                {/* <Descriptions column={1}>
                        {contactFields?.map((field, index) => {
                            return (
                                <Descriptions.Item
                                    label={field.label}
                                    key={index}
                                >
                                    <div className="w-100">
                                        <ContactsEditableTableCell
                                            record={contact.fields}
                                            field={field}
                                            handleSubmit={() => {
                                                queryClient.invalidateQueries(
                                                    "getContact"
                                                );
                                            }}
                                        />
                                    </div>
                                </Descriptions.Item>
                            );
                        })}
                    </Descriptions> */}
            </Space>
        </Card>
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
