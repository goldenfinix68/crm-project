import React, { useRef, useState } from "react";
import $ from "jquery";

// fullCalendar
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Button, Checkbox, Col, Radio, Row, Space, Tooltip } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCaretDown,
    faChevronLeft,
    faChevronRight,
    faCircleInfo,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useActivityType } from "../../api/query/activityQuery";
import ComponentActivityTypeIcon from "../Setup/Components/ComponentActivityTypeIcon";

const ActivityCalendar: React.FC = () => {
    const navigate = useNavigate();
    const calendarRef: any = useRef();

    const handCalendarToday = () => {
        const canlendar = calendarRef.current.getApi();
        canlendar.today();
    };

    const handCalendarPrev = () => {
        const canlendar = calendarRef.current.getApi();
        canlendar.prev();
    };

    const handCalendarNext = () => {
        const canlendar = calendarRef.current.getApi();
        canlendar.next();
    };

    const handCalendarGetDate = () => {
        let canlendar = calendarRef.current.getApi();
        var date = canlendar.getDate();
        console.log(date.toISOString());

        // return "asd";
    };

    const [dataFilter, setDataFilter] = useState({
        page: 1,
        page_size: 50,
        search: "",
        sort_field: "id",
        sort_order: "asc",
        // status: "Open",
        type: ["All"],
        date_filter: "",
        favorite_filter: localStorage.activitiesFavorite
            ? localStorage.activitiesFavorite
            : "Activites I am following",
    });

    const { dataType, isLoadingType } = useActivityType();

    const onChangeTypeFilter = (val: any) => {
        let setTypeValue: any = ["All"];
        let listType = dataType?.data.map((item: any) => {
            return item.type;
        });
        if (val === "All") {
            setTypeValue = ["All"];
        } else {
            let findIndex = dataFilter.type.findIndex((item) => item === val);
            if (findIndex !== -1) {
                let updatedData = [...dataFilter.type];
                updatedData.splice(findIndex, 1);
                setTypeValue = updatedData.length > 0 ? updatedData : ["All"];
            } else {
                if (
                    dataFilter.type.length > 0 &&
                    dataFilter.type[0] === "All"
                ) {
                    setTypeValue = [val];
                } else {
                    setTypeValue = [...dataFilter.type];
                    setTypeValue.push(val);
                }
            }

            if (listType.length === setTypeValue.length) {
                setTypeValue = ["All"];
            }
        }
        // console.log("onChangeTypeFilter", setTypeValue);

        let newTypeValue: any = {
            ...dataFilter,
            type: setTypeValue,
        };
        setDataFilter(newTypeValue);
    };

    const setActiveTypeFilter = (val: string) => {
        let checked = false;
        dataFilter.type.findIndex((element) => {
            if (element === val) {
                checked = true;
            }
        });

        return checked ? "ant-radio-button-wrapper-checked-selected" : "";
    };

    return (
        <>
            <Row gutter={12}>
                <Col xs={24} sm={24} md={12}>
                    <Space>
                        <Button onClick={() => handCalendarToday()}>
                            Today
                        </Button>

                        <Radio.Group className="calendar-btn">
                            <Radio.Button onClick={() => handCalendarPrev()}>
                                <FontAwesomeIcon icon={faChevronLeft} />
                            </Radio.Button>
                            <Radio.Button
                                className="calendar-btn-title"
                                // onClick={() => handCalendarGetDate()}
                            >
                                asdasd
                            </Radio.Button>
                            <Radio.Button onClick={() => handCalendarNext()}>
                                <FontAwesomeIcon icon={faChevronRight} />
                            </Radio.Button>
                        </Radio.Group>
                    </Space>
                </Col>
                <Col xs={24} sm={24} md={12} className="text-right">
                    <Space>
                        <Radio.Group className="activity-type-filter">
                            <Radio.Button
                                value="Overdue"
                                onClick={() => navigate("/activities")}
                            >
                                List
                            </Radio.Button>
                            <Radio.Button
                                value="Today"
                                className="ant-radio-button-wrapper-checked-selected"
                            >
                                Calendar
                            </Radio.Button>
                        </Radio.Group>

                        <Radio.Group className="activity-type-filter">
                            <Radio.Button value="Overdue">Day</Radio.Button>
                            <Radio.Button value="Today">Week</Radio.Button>
                            <Radio.Button value="Month">Week</Radio.Button>
                        </Radio.Group>
                    </Space>
                </Col>
            </Row>

            <Row gutter={12} className="m-t-md">
                <Col xs={24} sm={24} md={12}>
                    <Space>
                        <Radio.Group className="activity-type-filter">
                            <Tooltip title="All" placement="bottom">
                                <Radio.Button
                                    value="All"
                                    onClick={() => onChangeTypeFilter("All")}
                                    className={`${setActiveTypeFilter("All")}`}
                                >
                                    All
                                </Radio.Button>
                            </Tooltip>

                            {dataType?.data &&
                                dataType?.data.map(
                                    (item: any, key: React.Key) => {
                                        return (
                                            <Tooltip
                                                title={item?.type}
                                                placement="bottom"
                                                key={key}
                                            >
                                                <Radio.Button
                                                    // className="ant-radio-button-wrapper-checked"
                                                    className={`${setActiveTypeFilter(
                                                        item?.type
                                                    )}`}
                                                    value={item?.type}
                                                    onClick={() =>
                                                        onChangeTypeFilter(
                                                            item?.type
                                                        )
                                                    }
                                                >
                                                    {ComponentActivityTypeIcon(
                                                        item?.icon
                                                    )}
                                                </Radio.Button>
                                            </Tooltip>
                                        );
                                    }
                                )}
                        </Radio.Group>

                        <Button>
                            Selected Users [0]
                            <FontAwesomeIcon
                                icon={faCaretDown}
                                className="m-l-xs"
                            />
                        </Button>
                    </Space>
                </Col>
                <Col xs={24} sm={24} md={12} className="text-right">
                    <Space>
                        <Checkbox>
                            Activities I am following{" "}
                            <Tooltip
                                placement="bottom"
                                title="Any activity, whereas you are added as a teammate (follower) will also appear on calendar irrespective of its owner."
                            >
                                <FontAwesomeIcon
                                    icon={faCircleInfo}
                                    className="m-l-xs"
                                />
                            </Tooltip>
                        </Checkbox>
                        <Checkbox checked={true}>
                            Hide closed Activities
                            <Tooltip
                                placement="bottom"
                                title="Any activity, whereas you are added as a teammate (follower) will also appear on calendar irrespective of its owner."
                            >
                                <FontAwesomeIcon
                                    icon={faCircleInfo}
                                    className="m-l-xs"
                                />
                            </Tooltip>
                        </Checkbox>
                    </Space>
                </Col>
            </Row>
            <FullCalendar
                ref={calendarRef}
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                headerToolbar={{
                    left: "",
                    center: "",
                    right: "",
                }}
                weekends={false}
                // events={eventCalendarData[0].title ? eventCalendarData : []}
                // eventDrop={(info) => {
                //     handleOnEditCalendar(info);
                // }}
                // eventResize={(info) => {
                //     handleOnEditCalendar(info);
                // }}
                droppable={true}
                editable={true}
                // eventContent={<></>}
                // slotDuration={"00:30:00"}
            />
        </>
    );
};

export default ActivityCalendar;
