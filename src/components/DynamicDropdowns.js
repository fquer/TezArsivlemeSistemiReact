import React, { useEffect, useState, useRef } from 'react'
import InputSelect from "./InputSelect";
import { thesisDetailDropdownsLabels as mainClassLabels } from "../utils/ThesisUtil.js"

export default function DynamicDropdowns(props) {
    const { mainClass, data, onInputChange, isHaveDefaultValue } = props

    const isMountedRef = useRef(false);

    const [dropdowns, setDropdowns] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    async function createDropdowns() {
        const dropdowns = []

        for await (const key of Object.keys(mainClassLabels)) {
            dropdowns.push(<div className="col-4" key={mainClassLabels[key].id + "DivKey"}>
                            <InputSelect key={mainClassLabels[key].id + "Key"}
                                        defaultValue = {isHaveDefaultValue ? mainClass[mainClassLabels[key].id] : null} // baslangic deger
                                        inputData = {data[key]}
                                        inputName = {mainClassLabels[key].id}
                                        inputTitle = {mainClassLabels[key].label}
                                        inputOnChange = {onInputChange}/></div>)
        }
        setDropdowns(dropdowns)
        setIsLoading(false)
    }

    useEffect(() => {
        if (!isMountedRef.current) {
            createDropdowns()
            isMountedRef.current = true;
        }
    }, [])

    if (isLoading) {
        return (
            <div></div>
        )
    }
    else {
        return (
            <div className='row mb-3'>
                { dropdowns }
            </div>
        )
    }
}
