import React, { useEffect, useState } from "react";
import { Space, Row, Card, Col } from "antd";

import HeaderMenu from "./Components/HeaderMenu";
import ContactsTable from "./Components/ContactTable";
import ContactTableHeader from "./Components/ContactTableHeader";
import { mutateGet } from "../../api/mutation/useSetupMutation";
import { ENDPOINTS } from "../../endpoints";
import { TContact, TFilter } from "../../entities";
import { defaultFilter } from "../../constants";
import { useCustomFields } from "../../api/query/customFieldQuery";

const Contacts = () => {
    useEffect(() => {
        document.title = "Contacts - SpeedLead";
        return () => {};
    }, []);
    const [selectedRows, setSelectedRows] = useState<any>([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState<any>([]);

    const [filter, setFilter] = useState<TFilter>(defaultFilter);

    const [contacts, setContacts] = useState<TContact[] | undefined>();

    const [pagination, setPagination] = useState({
        page_size: 50,
        page: 1,
        total: 0,
    });
    const [isContactsLoading, setIsContactsLoading] = useState(true);

    const {
        data: contactFields,
        isLoading: isContactFieldsLoading,
        refetch: refetchContactFields,
    } = useCustomFields("contact");

    const { data: filteredContacts, refetch: refetchFilteredContacts } =
        mutateGet(
            { ...filter, ...pagination },
            ENDPOINTS.contacts.url,
            ENDPOINTS.contacts.cache,
            () => {
                setIsContactsLoading(false);
            }
        );

    const handleChangeViewAs = (filter?: TFilter) => {
        if (!filter) {
            setFilter(defaultFilter);
        } else {
            setFilter(filter);
        }
    };

    useEffect(() => {
        setIsContactsLoading(true);
        refetchFilteredContacts();
    }, [filter, pagination.page, pagination.page_size]);

    useEffect(() => {
        if (filteredContacts) {
            setContacts(filteredContacts?.data?.data);
            setPagination({
                ...pagination,
                total: filteredContacts?.data?.total,
            });
        } else {
            setContacts([]);
        }
    }, [filteredContacts]);

    return (
        <Space direction="vertical" className="w-100">
            <HeaderMenu />
            <Card loading={isContactFieldsLoading}>
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
                            filter={filter}
                            setFilter={setFilter}
                            pagination={pagination}
                            setPagination={setPagination}
                            isContactLoading={isContactsLoading}
                        />
                    </Col>
                </Row>
            </Card>
        </Space>
    );
};

export default Contacts;
