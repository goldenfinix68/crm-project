import { Card, Button } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import { UserAddOutlined } from "@ant-design/icons";
import UsersTable from "./components/UsersTable";
import { useQuery } from "react-query";
import { TUser } from "../../entities";
import { useUsersAll } from "../../api/query/userQuery";

const Users = () => {
    const { users, isLoading } = useUsersAll();

    return (
        <Card
            title="Users List"
            extra={
                <Link to="/setup/customizations/users/new">
                    <Button type="link">
                        <UserAddOutlined /> &nbsp;Add
                    </Button>
                </Link>
            }
        >
            <UsersTable users={users || []} />
        </Card>
    );
};

export default Users;
