import React, { useEffect, useState } from "react";
import {
    Button,
    Popconfirm,
    Space,
    Row,
    Card,
    Table,
    Col,
    Select,
    Tabs,
    Typography,
    Menu,
    Dropdown,
    Input,
    notification,
} from "antd";
import {
    CheckCircleOutlined,
    FunnelPlotOutlined,
    TableOutlined,
    PlusCircleOutlined,
    LockOutlined,
    CaretDownOutlined,
    CloseOutlined,
    SaveOutlined,
    ExportOutlined,
    CopyOutlined,
    MailOutlined,
    MobileOutlined,
    UnorderedListOutlined,
    StarFilled,
    StarOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import ContactsComponentsAddContacts from "./Components/ContactsComponentsAddContacts";
import ContactsComponentsManageColumn from "./Components/ContactsComponentsManageColumn";
import {
    filteredContactsQuery,
    useContactsTableColumn,
} from "../../api/query/contactsQuery";
import { useUserFavorites } from "../../api/query/userQuery";

import { useMutation } from "react-query";
import { TContact } from "../../entities";
import { deleteContactMutation } from "../../api/mutation/useContactMutation";
import queryClient from "../../queryClient";
import { useNavigate } from "react-router";
import ContactsComponentsTableEditableCell from "./Components/ContactsComponentsTableEditableCell";
import ContactsComponentsTableEditableCellTags from "./Components/ContactsComponentsTableEditableCellTags";
import ContactsComponentsTableEditableCellName from "./Components/ContactsEditableTableCell";
import ContactsComponentsUpdate from "./Components/ContactBulkUpdate";
import Papa from "papaparse";
import {
    useContactAddFavorite,
    useContactDeleteFavorite,
} from "../../api/mutation/useContactMutation";
import ContactsComponentsAddtoList from "./Components/ContactsComponentsAddtoList";
import SendToManyModal from "../../components/SentToManyModal";
import HeaderMenu from "./Components/HeaderMenu";
import { useAppContextProvider } from "../../context/AppContext";
import { CONTACT_COLUMNS, CONTACT_LIST_ACTION } from "../../constants";
import Filter from "../Deal/components/Filter";
import CustomFieldFormModal from "../../components/CustomFieldFormModal";
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
