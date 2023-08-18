import React, { useEffect, useState } from "react";
import { Col, Input, List, Modal, Row, Space, Typography } from "antd";
import { FIELD_TYPE_LIST } from "../../../constants";

interface ModalManageColumnFIeldProps {
    modalManageColumnField: any;
    setModalManageColumnField: any;
    handleOpenManageColumnFieldClose: any;
}

const ModalManageColumnFIeld: React.FC<ModalManageColumnFIeldProps> = (
    props
) => {
    const {
        modalManageColumnField,
        setModalManageColumnField,
        handleOpenManageColumnFieldClose,
    } = props;

    const [fieldTypeList, setFieldTypeList]: any = useState(FIELD_TYPE_LIST);

    const onSeachFields = (value: string) => {
        if (value) {
            let filteredColumns = FIELD_TYPE_LIST.filter((str: any) =>
                str.label.toLowerCase().includes(value.toLowerCase())
            );

            setFieldTypeList(filteredColumns);
            // if (FIELD_TYPE_LIST.length > 0) {
            // } else {
            //     setFieldTypeList(FIELD_TYPE_LIST);
            // }
        } else {
            setFieldTypeList(FIELD_TYPE_LIST);
        }
    };

    useEffect(() => {
        console.log("fieldTypeList", fieldTypeList);
    }, [fieldTypeList]);

    return (
        <Modal
            title={
                <Typography.Text>
                    {modalManageColumnField.title}
                </Typography.Text>
            }
            open={modalManageColumnField.show}
            onCancel={() => handleOpenManageColumnFieldClose()}
            className="manage-column-field"
        >
            {modalManageColumnField.step === 1 ? (
                <>
                    <Row gutter={12}>
                        <Col span={24}>
                            <Input
                                placeholder="Search Field"
                                className="w-100"
                                onChange={(event: any) => {
                                    onSeachFields(
                                        event.target.value
                                            ? event.target.value
                                            : ""
                                    );
                                }}
                            />
                        </Col>

                        <Col span={24} className="m-t-md">
                            <FieldTypeListComponent
                                fieldTypeList={fieldTypeList}
                            />
                        </Col>
                    </Row>
                </>
            ) : (
                <></>
            )}
        </Modal>
    );
};

export default ModalManageColumnFIeld;

interface FieldTypeListComponentProps {
    fieldTypeList: [];
}
const FieldTypeListComponent: React.FC<FieldTypeListComponentProps> = (
    props
) => {
    const { fieldTypeList } = props;
    return (
        <>
            <List
                className="field-list"
                size="large"
                header={false}
                footer={false}
                bordered
                dataSource={fieldTypeList}
                renderItem={(item: any) => (
                    <List.Item>
                        {/* <Row gutter={12} className="w-100">
                            <Col span={2}>
                                <span className={item.icon} />
                            </Col> */}
                        {/* <Col span={22}> */}
                        <Space direction="vertical" size={0}>
                            <Typography.Text strong>
                                {item.label}
                            </Typography.Text>
                            <Typography.Text>
                                {item.description}
                            </Typography.Text>
                        </Space>
                        {/* </Col>
                        </Row> */}
                    </List.Item>
                )}
            />
        </>
    );
};
