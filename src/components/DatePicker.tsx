import "react-datepicker/dist/react-datepicker.css";

import React from "react";
import DatePicker from "react-datepicker";

// CSS Modules, react-datepicker-cssmodules.css
// import 'react-datepicker/dist/react-datepicker-cssmodules.css';

/*
    react-datepicker doesn't use deprecated moment and is pretty nice
    out of the box.
 */
const MyDatePicker = (props) => {
    return (
        <DatePicker
            id={props.id}
            name={props.name}
            selected={props.selected}
            onChange={props.onChange}
            onBlur={props.onBlur}
            className={"form-input"}
        />
    );
};

export default MyDatePicker;
