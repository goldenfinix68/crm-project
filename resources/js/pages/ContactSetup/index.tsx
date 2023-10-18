import React, { useEffect, useState } from "react";
import {
    Button,
    Card,
    Dropdown,
    Form,
    Input,
    MenuProps,
    Modal,
    Popconfirm,
    Space,
    Table,
    Typography,
    notification,
    Row,
    Col,
    message,
    List,
    Tag,
} from "antd";
import {
    DeleteOutlined,
    EditOutlined,
    PlusCircleOutlined,
    UndoOutlined,
} from "@ant-design/icons";

import { useMutation, useQueryClient } from "react-query";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import DraggableCardSection from "../../components/DraggableCardSection";
import {
    useCustomFieldSections,
    useInactiveCustomFields,
} from "../../api/query/customFieldQuery";
import LoadingComponent from "../../components/LoadingComponent";
import { Empty } from "antd/lib";
import { TCustomFieldSection } from "../../entities";
import { sortCustomFieldSectionsMutation } from "../../api/mutation/useCustomFieldMutation";
import CustomFieldSectionAddUpdateModal from "../../components/CustomFieldSectionAddUpdateModal";
import { FIELD_TYPE_LIST } from "../../constants";
import InactiveCustomFields from "../../components/InactiveCustomFields";

const ContactSetup: React.FC = () => {
    const queryClient = useQueryClient();
    const [cards, setCards] = useState<TCustomFieldSection[] | undefined>();

    const {
        data: sections,
        isLoading,
        refetch: refetchContacts,
    } = useCustomFieldSections("contact");
    const {
        data: inactiveFields,
        isLoading: isInactiveFieldsLoading,
        refetch: refetchInactiveCustomFields,
    } = useInactiveCustomFields();

    const sortSections = useMutation(sortCustomFieldSectionsMutation, {
        onSuccess: () => {
            queryClient.invalidateQueries("customFieldSections");
            message.success("Succesfully saved.");
        },
        onError: (e: any) => {
            console.log(e.message || "An error occurred");
        },
    });

    const moveCard = (fromIndex, toIndex) => {
        const updatedCards = [...(cards || [])];
        const [movedCard] = updatedCards.splice(fromIndex, 1);
        updatedCards.splice(toIndex, 0, movedCard);
        setCards(updatedCards);
        sortSections.mutate(updatedCards);
    };
    useEffect(() => {
        setCards(sections);
    }, [sections]);

    if (isLoading) {
        return <LoadingComponent />;
    }
    return (
        <>
            <Row gutter={12}>
                <Col span={16}>
                    {cards?.length ? (
                        <DndProvider backend={HTML5Backend}>
                            <Space
                                direction="vertical"
                                style={{ width: "100%" }}
                            >
                                {cards.map((card, index) => (
                                    <DraggableCardSection
                                        key={card.id}
                                        id={card.id}
                                        card={card}
                                        index={index}
                                        moveCard={moveCard}
                                        type="contact"
                                    />
                                ))}
                            </Space>
                        </DndProvider>
                    ) : (
                        <Card>
                            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                        </Card>
                    )}
                </Col>
                <Col span={8}>
                    <InactiveCustomFields
                        inactiveFields={inactiveFields ?? []}
                        sections={sections ?? []}
                    />
                </Col>
            </Row>
        </>
    );
};

export default ContactSetup;
