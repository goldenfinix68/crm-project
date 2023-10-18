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
} from "antd";
import {
    DeleteOutlined,
    EditOutlined,
    PlusCircleOutlined,
} from "@ant-design/icons";

import { useMutation, useQueryClient } from "react-query";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import DraggableCardSection from "./components/DraggableCardSection";
import { useCustomFieldSections } from "../../api/query/customFieldQuery";
import LoadingComponent from "../../components/LoadingComponent";
import { Empty } from "antd/lib";
import { TCustomFieldSection } from "../../entities";
import { sortCustomFieldSectionsMutation } from "../../api/mutation/useCustomFieldMutation";
import CustomFieldSectionAddUpdateModal from "../../components/CustomFieldSectionAddUpdateModal";

const ContactSetup: React.FC = () => {
    const queryClient = useQueryClient();
    const [
        isCustomFieldSectionAddUpdateOpen,
        setIsCustomFieldSectionAddUpdateOpen,
    ] = React.useState(false);
    const [cards, setCards] = useState<TCustomFieldSection[] | undefined>();
    const [selectedSection, setSelectedSection] = useState<
        TCustomFieldSection | undefined
    >();

    const {
        data: sections,
        isLoading,
        refetch: refetchContacts,
    } = useCustomFieldSections("contact");

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
                <Col span={18}>
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
                                        handleEdit={(section) => {
                                            setSelectedSection(section);
                                            setIsCustomFieldSectionAddUpdateOpen(
                                                true
                                            );
                                        }}
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
            </Row>

            {selectedSection && (
                <CustomFieldSectionAddUpdateModal
                    isModalOpen={isCustomFieldSectionAddUpdateOpen}
                    closeModal={() =>
                        setIsCustomFieldSectionAddUpdateOpen(false)
                    }
                    handleSubmit={() => {
                        console.log("qwe");
                    }}
                    type="contact"
                    cutomFieldSection={selectedSection}
                />
            )}
        </>
    );
};

export default ContactSetup;
