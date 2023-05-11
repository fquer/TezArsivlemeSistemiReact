import React, { useEffect, useState, useRef } from 'react'
import InputSelect from "./InputSelect";
import { thesisDetailDropdownsLabels as mainClassLabels } from "../utils/ThesisUtil.js"

export default function DynamicDropdowns(props) {
    const { mainClass, data, onInputChange, isHaveDefaultValue, searchActive } = props

    const isMountedRef = useRef(false);

    const [dropdowns, setDropdowns] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    async function createDropdowns() {
        const years = Array.from({ length: 50 }, (_, index) => 2023 - index);
        const dropdowns = []

        for await (const key of Object.keys(mainClassLabels)) {
            dropdowns.push(<div className="col-4" key={mainClassLabels[key].id + "DivKey"}>
                            <InputSelect key={mainClassLabels[key].id + "Key"}
                                        defaultValue = {isHaveDefaultValue ? mainClass[mainClassLabels[key].id] : null} // baslangic deger
                                        inputData = {data[key]}
                                        inputName = {mainClassLabels[key].id}
                                        inputTitle = {mainClassLabels[key].label}
                                        inputOnChange = {onInputChange}
                                        searchActive = {searchActive} /></div>)
        }

        dropdowns.push(
            <div className="col-4" key="yil">
                <div className="mb-3" key="yil">
                    <label className="form-label">Tez Yazılma Tarihi</label>
                    <select className="form-select" name='thesisWrittenYear' onChange={onInputChange} defaultValue={isHaveDefaultValue ? mainClass.thesisWrittenYear : null}>
                        {searchActive ? <option key="defSecim" value="">Yazılma Yılı Seçiniz</option> : null}
                        {years.map((year) => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                </div>
            </div>
        )
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
