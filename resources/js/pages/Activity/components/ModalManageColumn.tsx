import React, { useState } from "react";
import {
    Button,
    Checkbox,
    Col,
    Input,
    Modal,
    Radio,
    Row,
    Space,
    Typography,
} from "antd";
import type { MenuProps } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";

const ModalManageColumn: React.FC = () => {
    const [currentTabs, setCurrentTabs] = useState("active");

    return (
        <Modal
            className="modal-activity-manage-column"
            open={true}
            // open={isModalOpenAdd}
            // onOk={handleOkAdd}
            // onCancel={handleCancelAdd}
            width={980}
            // afterClose={halderAfterClose}
            title={
                <>
                    <Typography.Text> Manage Columns</Typography.Text>
                </>
            }
            footer={<></>}
        >
            <Row gutter={12} style={{ maxHeight: 645 }}>
                <Col span={12} className="columns-list">
                    <Space direction="vertical" size={15} className="w-100">
                        <Radio.Group
                            value={currentTabs}
                            onChange={(e) => setCurrentTabs(e.target.value)}
                        >
                            <Radio.Button value="active">
                                Active Columns
                            </Radio.Button>
                            <Radio.Button value="archive">
                                Archived Columns
                            </Radio.Button>
                        </Radio.Group>

                        <Input placeholder="Search Fields" className="w-100" />
                    </Space>

                    <div className="m-t-md custom-column-list">
                        <Row gutter={[12, 12]}>
                            <Col span={24}>
                                <Typography.Text strong>
                                    System Fields
                                </Typography.Text>
                            </Col>
                            <Col span={24}>
                                <Checkbox value={"Id"}>Id</Checkbox>
                            </Col>
                        </Row>

                        <Row gutter={[12, 12]} className="m-t-md">
                            <Col span={24}>
                                <Typography.Text strong>
                                    Default
                                </Typography.Text>
                            </Col>
                            <Col span={24}>
                                <Checkbox value={"Title"}>Title</Checkbox>
                            </Col>
                            <Col span={24}>
                                <Checkbox value={"Duration"}>Duration</Checkbox>
                            </Col>
                            <Col span={24}>
                                <Checkbox value={"Owner"}>Owner</Checkbox>
                            </Col>
                            <Col span={24}>
                                <Checkbox value={"Availability"}>
                                    Availability
                                </Checkbox>
                            </Col>
                            <Col span={24}>
                                <Checkbox value={"Start Date"}>
                                    Start Date
                                </Checkbox>
                            </Col>
                            <Col span={24}>
                                <Checkbox value={"Location"}>Location</Checkbox>
                            </Col>
                            <Col span={24}>
                                <Checkbox value={"Type"}>Type</Checkbox>
                            </Col>
                            <Col span={24}>
                                <Checkbox value={"Video Conferencing"}>
                                    Video Conferencing
                                </Checkbox>
                            </Col>
                            <Col span={24}>
                                <Checkbox value={"Tags"}>Tags</Checkbox>
                            </Col>

                            <Col span={24}>
                                <Space className="w-100 custom-column-field">
                                    <Checkbox value={"Owner"}>Owner</Checkbox>
                                    <FontAwesomeIcon icon={faTrashAlt} />
                                </Space>
                            </Col>
                        </Row>
                    </div>
                </Col>
                <Col span={12}></Col>
            </Row>
        </Modal>
    );
};

export default ModalManageColumn;
