import { Card, Col, Row, Space } from "antd";
import React from "react";
import ContactInfo from "./components/ContactInfo";
import ActionsTabs from "./components/ActionsTabs";
import ContactsWall from "./components/ContactsWall";
import CollapsibleDetails from "./components/ActivityTab";

const ContactView = () => {
    return (
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
    );
};

export default ContactView;
