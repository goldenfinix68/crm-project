import React, { useState } from "react";
import { Select } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/pro-regular-svg-icons";

const FloatSelect = (props) => {
    let {
        label,
        value,
        placeholder,
        required,
        options,
        disabled,
        multi = false,
        dropdownClassName,
        allowClear,
        loading,
        readOnly,
        className = "",
        showSearch = true,
    } = props;
    const [focus, setFocus] = useState(false);

    if (!placeholder) placeholder = label;

    const isOccupied = focus || (value && value.length !== 0);

    const labelClass = isOccupied ? "label as-label" : "label as-placeholder";

    const multiClass = multi
        ? "float-label float-select-multi"
        : "float-label float-select";

    const requiredMark = required ? (
        <span className="text-danger">*</span>
    ) : null;

    // console.log(props);
    return (
        <div
            className={`${multiClass} ${className}`}
            onBlur={(e) => setFocus(false)}
            onFocus={() => setFocus(true)}
        >
            <Select
                style={{ width: "100%" }}
                defaultValue={value}
                readOnly={readOnly}
                value={value}
                // onChange={props.onChange}
                onChange={(e, option) => {
                    props.onChange(e, option);
                }}
                size="large"
                allowClear={allowClear ?? allowClear}
                showSearch={showSearch}
                disabled={disabled ? disabled : false}
                mode={multi}
                popupClassName={dropdownClassName ?? ""}
                onSelect={(e) => {
                    if (props.onBlurInput) {
                        props.onBlurInput(e);
                    }
                }}
                onBlur={(e) => {
                    if (props.onBlur) {
                        props.onBlur(e);
                    }
                }}
                filterOption={(input, option) => {
                    return (
                        option.search
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                    );
                }}
                loading={loading}
                suffixIcon={<FontAwesomeIcon icon={faChevronDown} />}
            >
                {options.map((item, key) => {
                    return (
                        <Select.Option
                            key={key}
                            value={item.value}
                            data-json={item.json}
                            search={item.label}
                        >
                            {" "}
                            {item.label}
                        </Select.Option>
                    );
                })}
            </Select>
            <label className={labelClass}>
                {isOccupied ? label : placeholder} {requiredMark}
            </label>
        </div>
    );
};

export default FloatSelect;
