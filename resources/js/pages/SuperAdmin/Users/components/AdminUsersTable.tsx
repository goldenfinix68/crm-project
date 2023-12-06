import React, { useState } from "react";
import { Button, Table, Space, Input, Tooltip } from "antd";
import type { ColumnsType, TableProps } from "antd/es/table";
import { Link } from "react-router-dom";
import {
    EditOutlined,
    LoginOutlined,
    PlusCircleOutlined,
} from "@ant-design/icons";
import { TUser } from "../../../../entities";
import { userRoleOption } from "../../../../constants";
import AdminUsersAddUpdateModal from "./AdminUsersAddUpdateModal";
import { useUsersAll } from "../../../../api/query/userQuery";
import { useMutation } from "react-query";
import { userImpersonate } from "../../../../api/mutation/useUserMutation";

const AdminUsersTable = () => {
    const [isCreateUserModalOpen, setIsCreateUserModalOpen] =
        React.useState(false);
    const [selectedUser, setSelectedUser] = useState<TUser | undefined>();
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");

    const { users, isLoading, refetch } = useUsersAll(page, search);

    const impersonate = useMutation(userImpersonate, {
        onSuccess: (data) => {
            localStorage.setItem(
                "impersonator_access_token",
                localStorage.getItem("access_token")!
            );
            localStorage.setItem("access_token", data.access_token);
            window.location.replace("/dashboard");
        },
        onError: (e: any) => {
            console.log(e.message || "An error occurred");
        },
    });

    const columns: ColumnsType<TUser> = [
        {
            key: "firstName",
            title: "First Name",
            dataIndex: "firstName",
        },
        {
            key: "lastName",
            title: "Last Name",
            dataIndex: "lastName",
        },
        {
            key: "email",
            title: "Email Address",
            dataIndex: "email",
        },
        {
            key: "role",
            title: "Role",
            render: (key: any, record: TUser) => {
                const role = userRoleOption.find(
                    (option) => option.value == record.role
                )?.label;
                const mainUserName = ["user", "stats"].includes(record.role)
                    ? `(${record.main_user?.firstName} ${record.main_user?.lastName})`
                    : "";

                return `${role} ${mainUserName}`;
            },
        },
        {
            key: "telnyxConnectionName",
            title: "SIP Trunking / Mobile Numbers",
            render: (key: any, record: TUser) => {
                return record.telnyxConnectionName
                    ? `${record.telnyxConnectionName} (${
                          record.numbers?.length
                              ? record.numbers
                                    .map((number) => number.mobileNumber)
                                    .join(", ")
                              : ""
                      })`
                    : "Not Set";
            },
        },
        {
            title: "Action",
            key: "action",
            render: (key: any, record: any) => {
                return (
                    <Space>
                        <Tooltip title="Edit">
                            <Button
                                type="link"
                                onClick={() => {
                                    setSelectedUser(record);
                                    setIsCreateUserModalOpen(true);
                                }}
                                icon={<EditOutlined />}
                            />
                        </Tooltip>
                        <Tooltip title="Impersonate">
                            <Button
                                type="link"
                                onClick={() => {
                                    impersonate.mutate(record);
                                }}
                                loading={impersonate.isLoading}
                                icon={<LoginOutlined />}
                            />
                        </Tooltip>
                    </Space>
                );
            },
        },
    ];
    const handleSearch = (value) => {
        console.log(value);
        setSearch(value);
        setPage(1); // Reset page to 1 when searching
        refetch();
    };
    return (
        <Space direction="vertical" className="w-100">
            <Space
                className="w-100"
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <Input.Search
                    placeholder="Search"
                    onSearch={handleSearch}
                    style={{ width: 200 }}
                />
                <Button
                    type="primary"
                    icon={<PlusCircleOutlined />}
                    onClick={() => setIsCreateUserModalOpen(true)}
                >
                    Add User
                </Button>
            </Space>
            <Table
                columns={columns}
                dataSource={users.data}
                pagination={{
                    current: page,
                    defaultPageSize: 100,
                    pageSizeOptions: ["100", "250"],
                    showSizeChanger: true,
                    total: users?.total || 0,
                    onChange: (newPage) => {
                        setPage(newPage);
                        refetch();
                    },
                }}
            />
            <AdminUsersAddUpdateModal
                isModalOpen={isCreateUserModalOpen}
                closeModal={() => setIsCreateUserModalOpen(false)}
                handleSubmit={() => {
                    console.log("qwe");
                }}
                user={selectedUser}
            />
        </Space>
    );
};

export default AdminUsersTable;
