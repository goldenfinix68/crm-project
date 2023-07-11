import React, { useState } from "react";
import { DatePicker } from "antd";

import moment from "moment";
const FloatDatePickerForm = (props) => {
    const [focus, setFocus] = useState(false);
    let {
        label,
        value,
        placeholder,
        // type,
        required,
        format,
        picker,
        disabled,
        suffixIcon,
    } = props;

    if (!placeholder) placeholder = label;

    const isOccupied = focus || (value && value.length !== 0);

    const labelClass = isOccupied ? "label as-label" : "label as-placeholder";
    const requiredMark = required ? (
        <span className="text-danger">*</span>
    ) : null;
    return (
        <div
            className="float-label float-label-date-picker"
            onBlur={() => setFocus(false)}
            onFocus={() => setFocus(true)}
        >
            <DatePicker
                onChange={(dates, dateString) => {
                    props.onChange(dates, dateString);
                }}
                value={value ? moment(value) : ""}
                size="large"
                placeholder={[""]}
                style={{ width: "100%" }}
                className="input-date-picker"
                format={format ? format : "MM/DD/YYYY"}
                onBlur={props.onBlurInput}
                picker={picker ? picker : "date"}
                disabled={disabled ? disabled : false}
                suffixIcon={suffixIcon ? suffixIcon : ""}
            />
            <label className={labelClass}>
                {isOccupied ? label : placeholder} {requiredMark}
            </label>
        </div>
    );
};

export default FloatDatePickerForm;
