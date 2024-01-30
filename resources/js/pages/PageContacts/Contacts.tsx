import React, { useEffect, useState } from "react";
import { Space, Row, Card, Col, Select, Tabs, Input } from "antd";

import HeaderMenu from "./Components/HeaderMenu";
import ContactsTable from "./Components/ContactTable";
import ContactTableHeader from "./Components/ContactTableHeader";
import { mutateGet } from "../../api/mutation/useSetupMutation";
import { ENDPOINTS } from "../../endpoints";
import { TContact, TFilter, TFilters } from "../../entities";
import { filterData } from "../../helpers";
import FilterAddUpdateModal from "../../components/FilterAddUpdateModal";
import { defaultFilter } from "../../constants";
import { useAppContextProvider } from "../../context/AppContext";

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
    const [contacts, setContacts] = useState<TContact[] | undefined>();

    const { isContactFieldsLoading } = useAppContextProvider();

    const [filter, setFilter] = useState<TFilter>(defaultFilter);
    const {
        data: filteredContacts,
        isLoading: isFilteredContactsLoading,
        refetch: refetchFilteredContacts,
    } = mutateGet(
        JSON.stringify(filter),
        ENDPOINTS.filteredContacts.url,
        ENDPOINTS.filteredContacts.cache
    );

    const handleChangeViewAs = (filter?: TFilter) => {
        if (!filter) {
            setFilter(defaultFilter);
        } else {
            setFilter(filter);
        }
    };

    useEffect(() => {
        if (filter.filters.conditions.length) {
            const result = filterData(filteredContacts, filter.filters);
            setContacts(result);
        } else {
            setContacts(filteredContacts);
        }
    }, [filter]);

    useEffect(() => {
        setContacts(filteredContacts);
    }, [filteredContacts]);
    return (
        <Space direction="vertical" className="w-100">
            <HeaderMenu />
            <Card loading={isFilteredContactsLoading || isContactFieldsLoading}>
                <ContactTableHeader
                    setSelectedRows={setSelectedRows}
                    setSelectedRowKeys={setSelectedRowKeys}
                    selectedRows={selectedRows}
                    selectedRowKeys={selectedRowKeys}
                    filter={filter}
                    setFilter={setFilter}
                    handleChangeViewAs={handleChangeViewAs}
                />
                <Row>
                    <Col md={24} lg={24}>
                        <ContactsTable
                            contacts={contacts}
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
