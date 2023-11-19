import React, { useState } from "react";
import { Button, Card } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";

import { useQueryClient } from "react-query";
import { Link } from "react-router-dom";
import { useUsersAll } from "../../../api/query/userQuery";
import UsersTable from "../../Users/components/UsersTable";
import AdminUsersTable from "./components/AdminUsersTable";

const AdminUsers: React.FC = ({}) => {
    const queryClient = useQueryClient();
    const { users, isLoading } = useUsersAll();

    return (
        <>
            <Card title="Users" loading={isLoading}>
                <AdminUsersTable />
            </Card>
        </>
    );
};

export default AdminUsers;
