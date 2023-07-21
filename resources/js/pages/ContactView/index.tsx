import { Card, Col, Row, Space, Spin } from "antd";
import React, { createContext } from "react";
import ContactInfo from "./components/ContactInfo";
import ActionsTabs from "./components/ActionsTabs";
import ContactsWall from "./components/ContactsWall";
import CollapsibleDetails from "./components/ActivityTab";
import { useGetContact } from "../../api/query/contactsQuery";
import { useParams } from "react-router-dom";
import { TContact } from "../../entities";
import LoadingComponent from "../../components/LoadingComponent";
import ContactContext from "./context";

const ContactView = () => {
    const { contactId } = useParams();
    const { contact, isLoading } = useGetContact(contactId ?? "");

    if (isLoading || !contact) {
        return <LoadingComponent />;
    }
    return (
        <ContactContext.Provider value={{ contact }}>
            <Row gutter={24}>
                <Col span={7}>
                    <ContactInfo />
                </Col>
                <Col span={10}>
                    <ActionsTabs />
                    <div style={{ paddingTop: "15px" }}>
                        <ContactsWall />
                    </div>
                </Col>
                <Col span={7}>
                    <CollapsibleDetails />
                </Col>
            </Row>
        </ContactContext.Provider>
    );
};

export default ContactView;
