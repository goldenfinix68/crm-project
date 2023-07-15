import { Col, Row } from "antd";
import React from "react";
import ContactInfo from "./components/ContactInfo";

const ContactView = () => {
    return (
        <Row gutter={24}>
            <Col span={7}>
                <ContactInfo />
            </Col>
            <Col span={10}></Col>
            <Col span={7}></Col>
        </Row>
    );
};

export default ContactView;
