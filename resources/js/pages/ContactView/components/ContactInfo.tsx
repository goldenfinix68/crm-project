import { CheckOutlined, LeftOutlined } from "@ant-design/icons";
import {
    Badge,
    Button,
    Card,
    Col,
    Dropdown,
    Form,
    Input,
    Menu,
    Popover,
    Row,
    Space,
    Tag,
    Typography,
    Table,
    Popconfirm,
    message,
    Alert,
} from "antd";
import React from "react";
import { DEFAULT_REQUIRED_MESSAGE } from "../../../constants";
import DropdownComponent from "../../../components/DropdownComponent";
import AvatarWithPopover from "./AvatarWithPopover";
import ActionMenu from "./ActionMenu";
import { useMutation } from "react-query";
import {
    addTypeMutation,
    cloneContactMutation,
    deleteContactMutation,
    updateContactMutation,
} from "../../../api/mutation/useContactMutation";
import { TContact, TContactType } from "../../../entities";
import { useContactTypesAll } from "../../../api/query/contactsQuery";
import queryClient from "../../../queryClient";
import { useNavigate } from "react-router-dom";
import { useAppContextProvider } from "../../../context/AppContext";
import { saveCustomFieldValuesMutation } from "../../../api/mutation/useCustomFieldMutation";
import ContactTypeTag from "../../../components/ContactTypeTag";
import TextEllipsis from "../../../components/TextEllipsis";
import CustomFieldFormModal from "../../../components/CustomFieldFormModal";
import ContactInfoEditableText from "../../../components/ContactInfoEditableText";
import { useCustomFields } from "../../../api/query/customFieldQuery";
import CustomLink from "../../../components/CustomLink";

const ContactInfo = ({ contact }: { contact: TContact }) => {
    const navigate = useNavigate();
    const [isCreateNewTypeOpen, setIsCreateNewTypeOpen] = React.useState(false);
    const [isEditContactModalOpen, setIsEditContactModalOpen] =
        React.useState(false);
    const [form] = Form.useForm<TContact>();
    const { contactTypes, isLoading } = useContactTypesAll();
    const contactTypelookupId = contact.fields?.contactTypelookupIds
        ? JSON.parse(contact.fields.contactTypelookupIds)[0]
        : "0";
    // const { contact } = useContext(ContactContext);
    const [tagSearchKey, setTagSearchKey] = React.useState("");

    const { isRoleStats } = useAppContextProvider();

    const {
        data: contactFields,
        isLoading: isContactFieldsLoading,
        refetch: refetchContactFields,
    } = useCustomFields("contact");

    const save = useMutation(saveCustomFieldValuesMutation, {
        onSuccess: () => {
            queryClient.invalidateQueries("getContact");
        },
        onError: (e: any) => {
            console.log(e.message || "An error occurred");
        },
    });

    const deleteContact = useMutation(deleteContactMutation, {
        onSuccess: () => {
            queryClient.invalidateQueries("contacts");
            queryClient.invalidateQueries("filteredContacts");
            navigate("/contacts");
        },
    });

    const cloneContact = useMutation(cloneContactMutation, {
        onSuccess: (res) => {
            message.success("Cloned successfully");
            window.location.replace("/contacts/" + res.data.id);
        },
    });

    const actionMenuList = [
        {
            label: (
                <div
                    onClick={() => {
                        setIsEditContactModalOpen(true);
                    }}
                >
                    Edit
                </div>
            ),
            key: "0",
        },
        {
            label: (
                <Popconfirm
                    title="Clone Contact"
                    description="Are you sure to clone this contact?"
                    onConfirm={() => {
                        cloneContact.mutate({ contactId: contact.id });
                    }}
                >
                    <div>Clone</div>
                </Popconfirm>
            ),
            key: "1",
        },
        {
            label: (
                <Popconfirm
                    title="Delete Contact"
                    description="Are you sure to delete this contact?"
                    onConfirm={() => {
                        deleteContact.mutate({ contactId: [contact.id] });
                    }}
                >
                    <div>Delete</div>
                </Popconfirm>
            ),
            key: "4",
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
                    <CustomLink to={"/contacts/" + contact.id}>
                        <Typography.Title level={5}>
                            {contact.fields.firstName +
                                " " +
                                contact.fields.lastName}
                        </Typography.Title>
                    </CustomLink>
                </Space>

                {contact.duplicatePhoneNumbers?.length ? (
                    <Alert
                        message={
                            <>
                                <Typography.Text>
                                    Duplicate phone number/s with the following
                                    contact:
                                </Typography.Text>
                                <ul>
                                    {contact.duplicatePhoneNumbers.map(
                                        (val) => (
                                            <li>{val}</li>
                                        )
                                    )}
                                </ul>
                            </>
                        }
                        type="warning"
                    />
                ) : null}
                {/* <DropdownComponent
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
                /> */}
                <ActionMenu contact={contact} />

                <Space
                    style={{ width: "100%", justifyContent: "space-between" }}
                >
                    <Typography.Text strong>Contact Details</Typography.Text>
                </Space>

                <Table
                    dataSource={contactFields
                        ?.filter(
                            (field) =>
                                field.fieldName != "firstName" &&
                                field.fieldName != "lastName"
                        )
                        .sort(
                            (a, b) => (a?.tableSort ?? 0) - (b?.tableSort ?? 0)
                        )}
                    pagination={false}
                    showHeader={false}
                    className="tableCell"
                >
                    <Table.Column
                        key="label"
                        render={(text, record: any) => (
                            <TextEllipsis>{`${record.label}: `}</TextEllipsis>
                        )}
                        width={"30%"}
                    />
                    <Table.Column
                        key="value"
                        render={(text, record: any) => (
                            <ContactInfoEditableText
                                record={contact.fields}
                                field={record}
                                handleSubmit={() => {
                                    queryClient.invalidateQueries("getContact");
                                    queryClient.invalidateQueries("thread");
                                }}
                            />
                        )}
                        width={"70%"}
                    />
                </Table>
            </Space>
            {isEditContactModalOpen && (
                <CustomFieldFormModal
                    isModalOpen={isEditContactModalOpen}
                    closeModal={() => {
                        setIsEditContactModalOpen(false);
                    }}
                    handleSubmit={() => {
                        queryClient.invalidateQueries("contacts");
                        queryClient.invalidateQueries("filteredContacts");
                        queryClient.invalidateQueries("getContact");
                    }}
                    type="contact"
                    record={contact.fields}
                />
            )}
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
