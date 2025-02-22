import { Col, Row, Space } from "antd";
import React, { useEffect } from "react";
import ContactInfo from "./components/ContactInfo";
import ActionsTabs from "./components/ActionsTabs";
import ContactsWall from "./components/ContactsWall";
import { useGetContact } from "../../api/query/contactsQuery";
import { useParams } from "react-router-dom";
import LoadingComponent from "../../components/LoadingComponent";
import ContactContext from "./context";
import CollapsibleDetails from "./components/CollapsbileDetails";
import { useAppContextProvider } from "../../context/AppContext";
import DealSteps from "./components/DealSteps";

const ContactView = () => {
    const { contactId } = useParams();
    const { contact, isLoading, refetch } = useGetContact(contactId ?? "");
    const { isRoleStats } = useAppContextProvider();

    useEffect(() => {
        console.log("contact", contact);
        if (contact) {
            // document.title = contact.fields.custom_field_16 + " - SpeedLead";
            document.title =
                contact.fields["firstName"].replace(/\s/g, "-") +
                " " +
                contact.fields["lastName"].replace(/\s/g, "-") +
                " - SpeedLead";
        }
        return () => {};
    }, [contact]);

    useEffect(() => {
        refetch();
    }, [contactId]);

    if (isLoading || !contact) {
        return <LoadingComponent />;
    }

    return (
        <ContactContext.Provider value={{ contact }}>
            <Space direction="vertical" className="w-100">
                {contact.deal && <DealSteps deal={contact.deal} />}

                <Row gutter={24} className="p-t-lg">
                    <Col span={7}>
                        <ContactInfo contact={contact} />
                    </Col>
                    <Col span={10}>
                        {!isRoleStats && <ActionsTabs />}
                        <div style={{ paddingTop: "15px" }}>
                            <ContactsWall />
                        </div>
                    </Col>
                    <Col span={7}>
                        <CollapsibleDetails
                            logs={contact.wall?.filter(
                                (data) => data.type == "contactUpdates"
                            )}
                        />
                    </Col>
                </Row>
            </Space>
        </ContactContext.Provider>
    );
};

export default ContactView;
