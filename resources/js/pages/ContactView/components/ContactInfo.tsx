import {
    CameraOutlined,
    CaretDownFilled,
    CheckCircleOutlined,
    CheckOutlined,
    DownOutlined,
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
    Input,
    Menu,
    MenuProps,
    Popover,
    Radio,
    Row,
    Space,
    Tag,
    Typography,
} from "antd";
import React from "react";
import { DEFAULT_REQUIRED_MESSAGE } from "../../../constants";
import DropdownComponent from "../../../components/DropdownComponent";
import ActionMenuBtn from "./ActionMenuBtn";
import AvatarWithPopover from "./AvatarWithPopover";
import ActionMenu from "./ActionMenu";
import { useMutation } from "react-query";
import { addTypeMutation } from "../../../api/mutation/useTypeMutation";
import { TContactType } from "../../../entities";
import { useContactTypesAll } from "../../../api/query/contactsQuery";
import queryClient from "../../../queryClient";

const ContactInfo = () => {
    const [isCreateNewTypeOpen, setIsCreateNewTypeOpen] = React.useState(false);
    const [avatarHovered, setAvatarHovered] = React.useState(false);

    const { contactTypes, isLoading } = useContactTypesAll();

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

    const types = [
        {
            label: <Tag>No Type</Tag>,
            key: "0",
        },
        {
            label: <Tag color="green">Customer</Tag>,
            key: "1",
        },
        {
            label: <Tag color="cyan">Lead</Tag>,
            key: "3",
        },
    ];
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
                        Karl Kenneth Flores
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

                <Descriptions column={1}>
                    <Descriptions.Item label="Email">-</Descriptions.Item>
                    <Descriptions.Item label="Phone">-</Descriptions.Item>
                    <Descriptions.Item label="Redfin Quick Link">
                        -
                    </Descriptions.Item>
                    <Descriptions.Item label="County Link">-</Descriptions.Item>
                    <Descriptions.Item label="APN">-</Descriptions.Item>
                    <Descriptions.Item label="Google Map Link">
                        -
                    </Descriptions.Item>
                    <Descriptions.Item label="Acres">-</Descriptions.Item>
                    <Descriptions.Item label="Wetlands Status">
                        -
                    </Descriptions.Item>
                    <Descriptions.Item label="Mobile">-</Descriptions.Item>
                    <Descriptions.Item label="Other Phone">-</Descriptions.Item>
                    <Descriptions.Item label="Website">-</Descriptions.Item>
                    <Descriptions.Item label="Address Line 1">
                        -
                    </Descriptions.Item>
                    <Descriptions.Item label="Address Line 2">
                        -
                    </Descriptions.Item>
                    <Descriptions.Item label="City">-</Descriptions.Item>
                    <Descriptions.Item label="State">-</Descriptions.Item>
                    <Descriptions.Item label="ZipCode">-</Descriptions.Item>
                    <Descriptions.Item label="County">-</Descriptions.Item>
                    <Descriptions.Item label="Description">-</Descriptions.Item>
                    <Descriptions.Item label="Tags">-</Descriptions.Item>
                </Descriptions>
            </Space>
        </Card>
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
