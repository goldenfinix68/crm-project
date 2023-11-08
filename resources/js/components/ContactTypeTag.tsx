import { Button, Col, Modal, Row, Typography, Form, Input, Tag } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import React, { useEffect } from "react";
import { useCustomFieldSections } from "../api/query/customFieldQuery";
import { DEFAULT_REQUIRED_MESSAGE } from "../constants";
import CustomFieldInput from "./CustomFieldInput";
import { Link } from "react-router-dom";
import { useMutation } from "react-query";
import { saveCustomFieldValuesMutation } from "../api/mutation/useCustomFieldMutation";
import CustomFieldInputWrapper from "./CustomFieldInput";
import { useContactTypesAll } from "../api/query/contactsQuery";
interface ContactTypeTagProps {
    fields: any;
}

const ContactTypeTag = ({ fields }: ContactTypeTagProps) => {
    const { contactTypes, isLoading } = useContactTypesAll();
    const contactTypelookupId = fields.contactTypelookupIds
        ? JSON.parse(fields.contactTypelookupIds)[0]
        : "0";
    const contactType = contactTypes?.find(
        (type) => type.id == contactTypelookupId
    );
    return (
        <>
            {" "}
            {contactTypelookupId && contactTypelookupId != 0 ? (
                <Tag color={contactType?.highlight}>{contactType?.name}</Tag>
            ) : (
                <Tag>No Type</Tag>
            )}
        </>
    );
};

export default ContactTypeTag;
