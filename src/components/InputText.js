import React from 'react'

export default function InputText(props) {
  return (
    <div className="mb-3">
        <label htmlFor={props.inputValue + "ID"} className="form-label">{props.inputLabel}</label>
        <input type="text" className="form-control" id={props.inputValue + "ID"} value={props.inputValue} name={props.inputName} onChange={(e) => props.inputOnChange(e)} required = {props.isRequired ? true : false}/>
    </div>
  )
}
