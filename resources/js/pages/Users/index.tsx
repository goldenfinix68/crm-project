import React, { useEffect } from "react";
import { Button, Card } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";

import { useQueryClient } from "react-query";
import { useUsersAll } from "../../api/query/userQuery";
import UsersTable from "./components/UsersTable";
import { Link } from "react-router-dom";

const Users: React.FC = ({}) => {
    const queryClient = useQueryClient();
    const { users, isLoading } = useUsersAll();

    useEffect(() => {
        document.title = "Users - SpeedLead";
        return () => {};
    }, []);
    return (
        <>
            <Card bodyStyle={{ padding: 0 }}>
                <Card
                    style={{
                        boxShadow: "none",
                    }}
                    bodyStyle={{ padding: "19px" }}
                    bordered={false}
                >
                    <Link to="/setup/customizations/users/new">
                        <Button
                            type="primary"
                            icon={<PlusCircleOutlined />}
                            className="m-b-md"
                        >
                            Add User
                        </Button>
                    </Link>
                    <UsersTable users={users || []} />
                </Card>
            </Card>
        </>
    );
};

export default Users;
