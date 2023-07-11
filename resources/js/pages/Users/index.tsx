import { Card, Button } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import { UserAddOutlined } from "@ant-design/icons";
import UsersTable from "./components/UsersTable";
import { useQuery } from "react-query";
import { TUser } from "../../entities";

const Users = () => {
    const {
        data: users,
        isLoading,
        error,
    } = useQuery<Array<TUser>>("users", () =>
        fetch("/api/users").then((response) => response.json())
    );

    return (
        <Card
            title="Users List"
            extra={
                <Link to="/users/new">
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
