import React, { useEffect, useState } from "react";
import { Space, Row, Card, Col, Select, Tabs, Input } from "antd";

import HeaderMenu from "./Components/HeaderMenu";
import ContactsTable from "./Components/ContactTable";
import ContactTableHeader from "./Components/ContactTableHeader";
import { mutateGet } from "../../api/mutation/useSetupMutation";
import { ENDPOINTS } from "../../endpoints";

interface DataType {
    key: React.Key;
    name: string;
    email: string;
    mobile: string;
    countryLink: string;
    acres: string;
    tags: string[];
    owner: string;
    avatar: any;
}

interface ListItem {
    id: string;
    title: string;
    key: string;
}

const { Option } = Select;
const { TabPane } = Tabs;

const handleTabChange = (key) => {
    // Handle tab change event
    console.log("Selected tab:", key);
};
const { Search } = Input;

// const menu = (

// );

const Contacts = () => {
    const [selectedRows, setSelectedRows] = useState<any>([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState<any>([]);

    const [filters, setFilters] = useState({
        conditions: [],
        condition: "and",
    });
    const {
        data: filteredContacts,
        isLoading: isFilteredContactsLoading,
        refetch: refetchFilteredContacts,
    } = mutateGet(
        filters,
        ENDPOINTS.filteredContacts.url,
        ENDPOINTS.filteredContacts.cache
    );

    useEffect(() => {
        refetchFilteredContacts();
    }, [filters]);

    return (
        <Space direction="vertical" className="w-100">
            <HeaderMenu />
            <Card>
                <ContactTableHeader
                    setSelectedRows={setSelectedRows}
                    setSelectedRowKeys={setSelectedRowKeys}
                    selectedRows={selectedRows}
                    selectedRowKeys={selectedRowKeys}
                    filters={filters}
                    setFilters={setFilters}
                />
                <Row>
                    <Col md={24} lg={24}>
                        <ContactsTable
                            contacts={filteredContacts}
                            setSelectedRows={setSelectedRows}
                            setSelectedRowKeys={setSelectedRowKeys}
                            selectedRowKeys={selectedRowKeys}
                        />
                    </Col>
                </Row>
            </Card>
        </Space>
    );
};

export default Contacts;
