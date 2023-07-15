import React, { useState } from "react";
import { DatePicker } from "antd";

import moment from "moment";
const FloatDatePicker = (props) => {
    const [focus, setFocus] = useState(false);
    let {
        label,
        value,
        placeholder,
        required,
        dropdownClassName,
        format,
        picker,
        disabled,
        allowClear,
        className,
        showTime,
    } = props;

    if (!placeholder) placeholder = label;

    const isOccupied = focus || (value && value.length !== 0);

    const labelClass = isOccupied ? "label as-label" : "label as-placeholder";

    const requiredMark = required ? (
        <span className="text-danger">*</span>
    ) : null;

    return (
        <div
            className={`float-label ${className ?? ""}`}
            onBlur={() => setFocus(false)}
            onFocus={() => setFocus(true)}
        >
            <DatePicker
                onChange={props.onChange}
                defaultValue={value ? moment(value) : ""}
                value={value ? moment(value) : ""}
                size="large"
                disabled={disabled}
                placeholder={[""]}
                style={{ width: "100%" }}
                className="input-date-picker"
                dropdownClassName={dropdownClassName ?? ""}
                format={format ? format : "DD/MM/YYYY"}
                allowClear={allowClear ? allowClear : false}
                onBlur={props.onBlurInput}
                picker={picker ? picker : ""}
            />
            <label className={labelClass}>
                {isOccupied ? label : placeholder} {requiredMark}
            </label>
        </div>
    );
};

export default FloatDatePicker;
