import { Card, Button } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import { UserAddOutlined } from "@ant-design/icons";
import UsersTable from "./components/UsersTable";

const Users = () => {
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
            <UsersTable users={[]} />
        </Card>
    );
};

export default Users;
