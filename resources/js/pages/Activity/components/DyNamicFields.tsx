import React, { useEffect } from "react";
import { DatePicker, Form, Input, InputNumber, Select } from "antd";

import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

interface DynamicFields {
    data: any;
    customFieldsData: any;
    setCustomFieldsData: any;
}

const DynamicFields: React.FC<DynamicFields> = (props) => {
    const { data, customFieldsData, setCustomFieldsData } = props;

    const handleChangeCustomField = (value: any) => {
        let arrData = [...customFieldsData];

        let findObjKey: any = "";
        customFieldsData.map((item: any, key: React.Key) => {
            if (item.field_mame === data.name) {
                findObjKey = key;
            }
        });

        if (findObjKey !== "") {
            arrData[findObjKey] = {
                ...arrData[findObjKey],
                value: value,
            };
        } else {
            arrData.push({
                field_mame: data.name,
                field_id: data.id,
                value: value,
            });
        }

        setCustomFieldsData(arrData);
    };

    const handleSwitchCustomFieldType = (value: any) => {
        switch (value?.type) {
            case "Text":
                return (
                    <Input
                        placeholder={data?.label}
                        onBlur={(e) => {
                            handleChangeCustomField(e.target.value);
                        }}
                    />
                );
            case "Text Area":
                return (
                    <Input.TextArea
                        placeholder={data?.label}
                        rows={3}
                        onBlur={(e) => {
                            handleChangeCustomField(e.target.value);
                        }}
                    />
                );
            case "Integer":
                return (
                    <InputNumber
                        placeholder={data?.label}
                        className="select-custom-width"
                        onChange={(e) => {
                            handleChangeCustomField(e);
                        }}
                    />
                );
            case "Select":
                let opt = JSON.parse(data?.values_option);
                return (
                    <Select
                        placeholder={data?.label}
                        className="select-custom-width"
                        showSearch
                        onChange={(e) => {
                            handleChangeCustomField(e);
                        }}
                    >
                        {opt.length > 0 &&
                            opt.map((item: any, key: React.Key) => {
                                return (
                                    <Select.Option
                                        key={key}
                                        value={item}
                                        search={item}
                                    >
                                        {item}
                                    </Select.Option>
                                );
                            })}
                    </Select>
                );
            case "Multi Select":
                let optMulti = JSON.parse(data?.values_option);
                return (
                    <Select
                        placeholder={data?.label}
                        className="w-100"
                        showSearch
                        mode="multiple"
                        onChange={(e) => {
                            handleChangeCustomField(e);
                        }}
                    >
                        {optMulti.length > 0 &&
                            optMulti.map((item: any, key: React.Key) => {
                                return (
                                    <Select.Option
                                        key={key}
                                        value={item}
                                        search={item}
                                    >
                                        {item}
                                    </Select.Option>
                                );
                            })}
                    </Select>
                );
            case "Decimal":
                return (
                    <Input
                        placeholder={data?.label}
                        className="select-custom-width"
                        onBlur={(e) => {
                            handleChangeCustomField(e.target.value);
                        }}
                    />
                );
            case "Date":
                return (
                    <DatePicker
                        format={"MMM DD, YYYY"}
                        placeholder={data?.label}
                        className="w-100"
                        onChange={(e) => {
                            if (e) {
                                let val = dayjs(e).format("YYYY/MM/DD");
                                handleChangeCustomField(val);
                            }
                        }}
                    />
                );
            case "Date Time":
                return (
                    <DatePicker
                        showTime
                        format={"MMM, DD YYYY HH:mm A"}
                        placeholder={data?.label}
                        className="w-100"
                        onChange={(e) => {
                            if (e) {
                                let val = dayjs(e).format("YYYY/MM/DD HH:mm A");
                                handleChangeCustomField(val);
                            }
                        }}
                    />
                );
            case "Email":
                return (
                    <Input
                        placeholder={data?.label}
                        className="select-custom-width"
                        onBlur={(e) => {
                            handleChangeCustomField(e.target.value);
                        }}
                    />
                );
            case "Phone":
                return (
                    <Input
                        placeholder={data?.label}
                        className="select-custom-width"
                        onBlur={(e) => {
                            handleChangeCustomField(e.target.value);
                        }}
                    />
                );
            case "URL":
                return (
                    <Input
                        placeholder={data?.label}
                        className="select-custom-width"
                        onBlur={(e) => {
                            handleChangeCustomField(e.target.value);
                        }}
                    />
                );
            case "Big Integer":
                return (
                    <Input
                        placeholder={data?.label}
                        className="select-custom-width"
                        onBlur={(e) => {
                            handleChangeCustomField(e.target.value);
                        }}
                    />
                );
            case "Percentage":
                return (
                    <Input
                        placeholder={data?.label}
                        className="select-custom-width"
                        onBlur={(e) => {
                            handleChangeCustomField(e.target.value);
                        }}
                    />
                );
            case "Boolean":
                return (
                    <Input
                        placeholder={data?.label}
                        className="select-custom-width"
                        onBlur={(e) => {
                            handleChangeCustomField(e.target.value);
                        }}
                    />
                );
            case "Currency":
                return (
                    <Input
                        placeholder={data?.label}
                        className="select-custom-width"
                        onBlur={(e) => {
                            handleChangeCustomField(e.target.value);
                        }}
                    />
                );
            default:
                return (
                    <Input
                        placeholder={data?.label}
                        onBlur={(e) => {
                            handleChangeCustomField(e.target.value);
                        }}
                    />
                );
        }
    };

    return (
        <Form.Item
            name={data?.name}
            rules={[
                {
                    required: data?.required === "1" ? true : false,
                    message: "This field is required",
                },
            ]}
        >
            {handleSwitchCustomFieldType(data)}
        </Form.Item>
    );
};

export default DynamicFields;
