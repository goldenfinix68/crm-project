import React, { useEffect } from "react";
import { Card, Space, Row, Col } from "antd";

import DraggableCardSection from "../../components/DraggableCardSection";
import {
    useCustomFieldSections,
    useInactiveCustomFields,
} from "../../api/query/customFieldQuery";
import LoadingComponent from "../../components/LoadingComponent";
import { Empty } from "antd/lib";
import InactiveCustomFields from "../../components/InactiveCustomFields";

const DealSetup: React.FC = () => {
    const {
        data: sections,
        isLoading,
        refetch: refetchSections,
    } = useCustomFieldSections("deal");
    const {
        data: inactiveFields,
        isLoading: isInactiveFieldsLoading,
        refetch: refetchInactiveCustomFields,
    } = useInactiveCustomFields("deal");

    useEffect(() => {
        refetchInactiveCustomFields();
        refetchSections();
    }, []);

    if (isLoading) {
        return <LoadingComponent />;
    }
    return (
        <>
            <Row gutter={12}>
                <Col span={16}>
                    {sections?.length ? (
                        <Space direction="vertical" style={{ width: "100%" }}>
                            {sections?.map((card, index) => (
                                <DraggableCardSection
                                    key={card.id}
                                    id={card.id}
                                    card={card}
                                    sections={sections}
                                    index={index}
                                    type="deal"
                                />
                            ))}
                        </Space>
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

export default DealSetup;
