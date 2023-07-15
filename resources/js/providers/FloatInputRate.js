import React, { useState, useEffect } from "react";
import { InputNumber } from "antd";

const FloatInputRate = (props) => {
    const [focus, setFocus] = useState(false);
    let {
        label,
        value,
        placeholder,
        required,
        disabled,
        id,
        onBlurInput,
        step,
        readOnly,
        type,
    } = props;

    if (!placeholder) placeholder = label;

    const isOccupied = focus || (value && value !== "" && value.length !== 0);

    const labelClass = isOccupied ? "label as-label" : "label as-placeholder";

    const requiredMark = required ? (
        <span className="text-danger">*</span>
    ) : null;

    useEffect(() => {
        // console.log(props)
    }, [props]);
    return (
        <div
            className={`float-label input-number ${props.className ?? ""}`}
            onBlur={() => setFocus(false)}
            onFocus={() => setFocus(true)}
        >
            <InputNumber
                onChange={props.onChange}
                value={value}
                size="large"
                autoComplete="off"
                stringMode
                type={type}
                step={step ?? "0.00"}
                // formatter={(value) => formatterNumber(value)}
                // parser={(value) => parserNumber(value)}
                style={{ width: "100%" }}
                className="input-rate"
                addonAfter={props.addonAfter ?? ""}
                disabled={disabled}
                id={id ?? ""}
                onBlur={(e) => {
                    if (onBlurInput) {
                        onBlurInput(e);
                    }
                }}
                readOnly={readOnly}
            />
            <label className={labelClass}>
                {isOccupied ? label : placeholder} {requiredMark}
            </label>
        </div>
    );
};

export default FloatInputRate;
