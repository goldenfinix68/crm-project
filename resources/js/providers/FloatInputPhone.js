import React, { useState, useEffect } from "react";
import { Input } from "antd";
import $ from "jquery";
const FloatInputPhone = (props) => {
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
  } = props;

  if (!placeholder) placeholder = label;

  const isOccupied = focus || (value && value.length !== 0);

  const labelClass = isOccupied ? "label as-label" : "label as-placeholder";

  const requiredMark = required ? <span className="text-danger">*</span> : null;

  useEffect(() => {
    // console.log(props)
    $(".float-label").removeClass("hide");
  }, []);

  // const [formatVaL, setformatVaL] = useState(value);

  return (
    <div
      className={`float-label ${className ? className : ""}`}
      onBlur={() => setFocus(false)}
      onFocus={() => setFocus(true)}
    >
      <Input
        onChange={(e) => {
          props.onChange(e.target.value);
        }}
        type={type}
        value={value}
        size="large"
        autoComplete="off"
        disabled={disabled}
        readOnly={readOnly}
        addonAfter={addonAfter}
        allowClear={allowClear ? allowClear : false}
        maxLength={maxLength ? maxLength : 12}
        onBlur={(e) => {
          if (props.onBlurInput) {
            props.onBlurInput(e.target.value);
          }
        }}
        // onKeyUp={(event) => {
        //   if (
        //     event.key != "Backspace" &&
        //     (value.length === 3 || value.length === 7)
        //   ) {
        //     console.log("onKeyUp", event.key);
        //     // console.log("onKeyUp", event.target.value);
        //     value += "-";

        //     setformatVaL(value);
        //   }
        // }}
      />
      <label className={labelClass}>
        {isOccupied ? label : placeholder} {requiredMark}
      </label>
    </div>
  );
};

export default FloatInputPhone;
