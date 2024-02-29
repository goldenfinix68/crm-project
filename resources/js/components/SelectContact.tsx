import React, { useEffect, useState } from "react";
import { Select } from "antd";
import { ENDPOINTS } from "../endpoints";
import { mutateGet } from "../api/mutation/useSetupMutation";
import { defaultFilter } from "../constants";
import _ from "lodash";

interface Props {
    mode?: "multiple" | "tags";
    defaultOpen?: boolean;
    onChange?: (e) => void;
}

const SelectContact = ({
    mode = undefined,
    defaultOpen = false,
    onChange = () => console.log("selectContact"),
}: Props) => {
    const [pagination, setPagination] = useState({
        page_size: 10,
        page: 1,
        total: 0,
    });
    const [contacts, setContacts] = useState<any>();

    const [filter, setFilter] = useState<any>(defaultFilter);

    const { data: filteredContacts, refetch: refetchFilteredContacts } =
        mutateGet(
            { ...filter, ...pagination },
            ENDPOINTS.contacts.url,
            "selectContactFilter"
        );

    const debouncedSearch = _.debounce((value) => {
        handleSearch(value);
    }, 300); // Adjust the delay time as needed

    const handleSearch = (value) => {
        setFilter({
            ...filter,
            filters: {
                conditions: [
                    { key: "firstName", condition: "contains", value: value },
                    { key: "lastName", condition: "contains", value: value },
                ],
                conditionalOperator: "or",
            },
        });
    };

    useEffect(() => {
        refetchFilteredContacts();
    }, [filter]);

    useEffect(() => {
        if (filteredContacts && filteredContacts.data) {
            setContacts(filteredContacts.data.data);
        }
    }, [filteredContacts]);

    return (
        <Select
            showSearch
            mode={mode}
            className="w-100"
            defaultOpen={defaultOpen}
            onSearch={(value) => debouncedSearch(value)} // Use debouncedSearch here
            filterOption={false}
            onChange={onChange}
        >
            {contacts?.map((contact) => (
                <Select.Option value={contact.id} key={contact.id}>
                    {`${contact.fields?.firstName} ${contact.fields?.lastName}`}
                </Select.Option>
            ))}
        </Select>
    );
};

export default SelectContact;
