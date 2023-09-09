import React, { useEffect, useState } from "react";
import {
    Button,
    Form,
    Input,
    Modal,
    Space,
    Table,
    Typography,
    notification,
} from "antd";
import {
    DeleteOutlined,
    EditOutlined,
    PlusCircleOutlined,
} from "@ant-design/icons";
import validateRules from "../../../providers/validateRules";

import { useMutation, useQueryClient } from "react-query";
import { mutateGet, mutatePost } from "../../../api/mutation/useSetupMutation";

const ComponentTagManagement: React.FC = () => {
    const queryClient = useQueryClient();

    const tableColumns = [
        {
            dataIndex: "action",
            title: "",
            width: 100,
            render: (text: string, record: any) => {
                return (
                    <Space>
                        <Button type="link">
                            <EditOutlined className="font-18px" />
                        </Button>
                        <Button type="link">
                            <DeleteOutlined className="font-18px" />
                        </Button>
                    </Space>
                );
            },
        },
        {
            dataIndex: "tag_name",
            title: "Tag name",
            width: 300,
        },
        {
            dataIndex: "contact",
            title: "Contact",
            width: 150,
            render: (text: string, record: any) => {
                return <Typography.Link>See Contacts</Typography.Link>;
            },
        },
        {
            dataIndex: "activity",
            title: "Activity",
            width: 150,
            render: (text: string, record: any) => {
                return <Typography.Link>See Activities</Typography.Link>;
            },
        },
        {
            dataIndex: "deal",
            title: "Deal",
            width: 150,
            render: (text: string, record: any) => {
                return <Typography.Link>See Deals</Typography.Link>;
            },
        },
    ];

    const [form] = Form.useForm();
    const [createModal, setCreateModal] = useState(false);

    const handleOpenCreateMdal = () => {
        setCreateModal(true);
    };

    const handleCloseCreateMdal = () => {
        setCreateModal(false);
        form.resetFields();
    };

    const handleOnFinish = () => {
        form.validateFields()
            .then((data) => {
                let values = {
                    data: data,
                    url: "/api/tag_management",
                };
                handlePost.mutate(values);
            })
            .catch((error) => {
                notification.warning({
                    message: "Warning",
                    description: "Please fill-up required fields.",
                });
            });
    };

    const handlePost = useMutation(mutatePost, {
        onSuccess: (res) => {
            queryClient.invalidateQueries("tag_management");
            handleCloseCreateMdal();
        },
    });

    const [dataFilter, setDataFilter] = useState({
        page: 1,
        page_size: 20,
        sort_field: "id",
        sort_order: "asc",
    });

    const { data, isLoading, isFetching } = mutateGet(
        dataFilter,
        "/api/tag_management",
        "tag_management"
    );

    const onChange = (
        pagination: any,
        sorter: any,
        filters: any,
        extra: any
    ) => {
        // console.log("sorter", filters);

        setDataFilter({
            ...dataFilter,
            sort_field: filters.field,
            sort_order: filters.order ? filters.order.replace("end", "") : null,
            page: pagination.current,
            page_size: pagination.pageSize,
        });
    };

    return (
        <>
            <Button
                type="primary"
                icon={<PlusCircleOutlined />}
                onClick={handleOpenCreateMdal}
            >
                Add Tag
            </Button>

            <Table
                loading={isLoading || isFetching}
                dataSource={data?.data && data?.data?.data}
                columns={tableColumns}
                scroll={{ x: "max-content" }}
                className="m-t-md"
                onChange={onChange}
                rowKey={(record) => record.id}
                pagination={{
                    total: data?.data?.total,
                    current: dataFilter.page,
                    pageSize: dataFilter.page_size,
                    showSizeChanger: true,
                    pageSizeOptions: [10, 20, 50, 100, 200],
                    showTotal: (total, range) =>
                        `${range[0]}-${range[1]} of ${total} items`,
                }}
            />

            <Modal
                open={createModal}
                onCancel={handleCloseCreateMdal}
                title={<Typography.Text>Add Tag</Typography.Text>}
                className="manage-column-field"
                footer={[
                    <Space key={"footer"}>
                        <Button type="primary" onClick={handleOnFinish}>
                            Add
                        </Button>
                        <Button onClick={handleCloseCreateMdal}> Cancel</Button>
                    </Space>,
                ]}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name={"tag_name"}
                        label="Tag Name"
                        rules={[validateRules.required]}
                    >
                        <Input size="large" />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default ComponentTagManagement;
