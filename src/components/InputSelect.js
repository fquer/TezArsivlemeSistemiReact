import React from 'react'

export default function InputSelect(props) {
    return (
    <div className="mb-3">
        <label className="form-label">{props.inputTitle}</label>
        <select className="form-select" name={props.inputName} onChange={(e) => props.inputOnChange(e)}>
            {
            props.inputData.map((option, index) => (
                <option value={option.id} key={index} >{option[props.inputName + "Name"]}</option>
            ))
            }
        </select>
    </div>
    )
}
