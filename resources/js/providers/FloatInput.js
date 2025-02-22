import React, { useState, useEffect } from "react";
import { Input } from "antd";
import $ from "jquery";
const FloatInput = (props) => {
    const [focus, setFocus] = useState(false);
    let {
        label,
        value,
        placeholder,
        type,
        required,
        disabled,
        readOnly,
        addonAfter,
        className,
        allowClear,
        maxLength,
        prefix,
    } = props;

    if (!placeholder) placeholder = label;

    const isOccupied = focus || (value && value !== "" && value.length !== 0);

    const labelClass = isOccupied ? "label as-label" : "label as-placeholder";

    const requiredMark = required ? (
        <span className="text-danger">*</span>
    ) : null;

    useEffect(() => {
        // console.log(props)
        $(".float-label").removeClass("hide");
    }, []);

    return (
        <div
            className={`float-label ${className ? className : ""}`}
            onBlur={() => setFocus(false)}
            onFocus={() => setFocus(true)}
        >
            <Input
                prefix={prefix}
                onChange={(e) => props.onChange(e.target.value)}
                type={type}
                value={value}
                size="large"
                autoComplete="off"
                disabled={disabled}
                readOnly={readOnly}
                addonAfter={addonAfter}
                allowClear={allowClear ? allowClear : false}
                maxLength={maxLength}
                onBlur={(e) => {
                    if (props.onBlurInput) {
                        props.onBlurInput(e.target.value);
                    }
                }}
            />
            <label className={labelClass}>
                {isOccupied ? label : placeholder} {requiredMark}
            </label>
        </div>
    );
};

export default FloatInput;
