import React from 'react'

export default function InputSelect(props) {
    const options = [];

    const data = props.inputData
    data.forEach(option => {
        options.push(<option value={option.id}>{option[props.inputName + "Name"]}</option>) 
    });

    return (
    <div className="mb-3">
        <label htmlFor={props.inputName + "Id"} className="form-label">{props.inputTitle}</label>
        <select className="form-select" id={props.inputName + "Id"} name={props.inputName} onChange={(e) => props.inputOnChange(e)}>
            {options}
        </select>
    </div>
    )
}
