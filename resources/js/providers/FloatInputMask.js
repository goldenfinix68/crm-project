import React, { useState, useEffect } from "react";

import { CheckCircleFilled, CloseCircleOutlined } from "@ant-design/icons";
import $ from "jquery";
import InputMask from "react-input-mask";

const FloatInputMask = (props) => {
    const [focus, setFocus] = useState(false);
    let {
        label,
        value,
        placeholder,
        required,
        maskType,
        maskLabel,
        validateStatus,
    } = props;

    if (!placeholder) placeholder = label;
    if (validateStatus === undefined) {
        validateStatus = false;
    }
    const isOccupied = focus || (value && value.length !== 0);

    const labelClass = isOccupied ? "label as-label" : "label as-placeholder";

    const requiredMark = required ? (
        <span className="text-danger">*</span>
    ) : null;

    const [classPlaceholder, setClassPlaceholder] = useState(
        "placeholder-" + maskLabel
    );
    const [classPlaceholderSuccess, setClassPlaceholderSuccess] = useState();
    const [classPlaceholderError, setClassPlaceholderError] = useState();

    useEffect(() => {
        setClassPlaceholderSuccess("mask-success-" + maskLabel);
        setClassPlaceholderError("mask-error-" + maskLabel);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props]);

    useEffect(() => {
        if (!validateStatus) {
            if (value !== undefined && value !== null) {
                let val = props.value ? props.value.substring(0, 1) : "";
                let val_last = props.value ? props.value.slice(-1) : "_";
                if (props.value !== "") {
                    if (props.value !== "" && val_last !== "_") {
                        $(`.${classPlaceholderSuccess}`).removeClass("hide");
                        $(`.${classPlaceholderError}`).addClass("hide");
                        setClassPlaceholder("mask-success-" + maskLabel);
                    } else {
                        setClassPlaceholder("mask-input-antd-error-border");
                        $(`.${classPlaceholderSuccess}`).addClass("hide");
                        $(`.${classPlaceholderError}`).removeClass("hide");
                    }
                } else {
                    $(`.${classPlaceholderSuccess}`).addClass("hide");
                    $(`.${classPlaceholderError}`).removeClass("hide");
                }
            }
        } else {
            setClassPlaceholder("mask-input-antd-error-border");
            $(`.${classPlaceholderSuccess}`).addClass("hide");
            $(`.${classPlaceholderError}`).removeClass("hide");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props]);

    return (
        <div
            className="float-label"
            onBlur={() => setFocus(false)}
            onFocus={() => setFocus(true)}
        >
            <InputMask
                alwaysShowMask={false}
                onChange={(e) => props.onChange(e.target.value)}
                mask={maskType ? maskType : "9999 9999 9999 9999"}
                value={value}
                className={`mask-input mask-input-antd ` + classPlaceholder}
                onBlur={(e) => {
                    if (props.onBlurInput) {
                        props.onBlurInput(e.target.value);
                    }
                }}
            />
            <span
                className={
                    "maskhasfeedback " + classPlaceholderSuccess + " hide"
                }
            >
                <CheckCircleFilled />
            </span>
            <span
                className={
                    "maskhasfeedback-error " + classPlaceholderError + " hide"
                }
            >
                <CloseCircleOutlined />
            </span>
            <label className={labelClass}>
                {isOccupied ? label : placeholder} {requiredMark}
            </label>
        </div>
    );
};

export default FloatInputMask;
