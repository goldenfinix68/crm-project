import React from "react";
import { Card } from "antd";

import { useQueryClient } from "react-query";
import { useUsersAll } from "../../../api/query/userQuery";
import AdminUsersTable from "./components/AdminUsersTable";

const AdminUsers: React.FC = ({}) => {
    return <AdminUsersTable />;
};

export default AdminUsers;
