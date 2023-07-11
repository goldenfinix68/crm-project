import { Card, Button } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import { UserAddOutlined } from "@ant-design/icons";
import ContactsTable from "./components/ContactsTable";

const Contacts = () => {
    return (
        <Card
            title="Contacts List"
            extra={
                <Link to="/contacts/new">
                    <Button type="link">
                        <UserAddOutlined /> &nbsp;Contact
                    </Button>
                </Link>
            }
        >
            <ContactsTable contacts={[]} />
        </Card>
    );
};

export default Contacts;
