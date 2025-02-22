import React, { useState, useEffect } from "react";
import { Input } from "antd";

const FloatInputPassword = (props) => {
    const [focus, setFocus] = useState(false);
    let { label, value, placeholder, type, required } = props;

    if (!placeholder) placeholder = label;

    const isOccupied = focus || (value && value.length !== 0);

    const labelClass = isOccupied ? "label as-label" : "label as-placeholder";

    const requiredMark = required ? (
        <span className="text-danger">*</span>
    ) : null;

    useEffect(() => {
        // console.log(props)
    }, [props]);

    return (
        <div
            className="float-label"
            onBlur={() => setFocus(false)}
            onFocus={() => setFocus(true)}
        >
            <Input.Password
                onChange={props.onChange}
                type={type}
                value={value}
                size="large"
                autoComplete="new-password"
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

export default FloatInputPassword;
