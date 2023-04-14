import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import InputText from "../components/InputText";

export default function ThesisUpload() {
    const navigate = useNavigate();

    useEffect(() => {
        const userID = localStorage.getItem('userID')
        console.log(userID)
        if (userID === "") {
            navigate('/');
        }
    }, [navigate])

    const [thesis, setThesis] = useState({
        thesisTitle: "",
        thesisTopic: "",
        thesisLanguage: "",
        thesisGroup: "",
        thesisUniversity: "",
        thesisInstitute: "",
        thesisMainField: "",
        thesisChildrenField: "",
        thesisTypeId: "6439662e7a88c576f8bef561"
    })

    const [file, setFile] = useState()

    const { thesisFile, thesisTitle, thesisTopic, thesisLanguage, thesisGroup, thesisUniversity, thesisInstitute, thesisMainField, thesisChildrenField } = thesis

    const onInputChange = (e) => {
        setThesis({ ...thesis, [e.target.name]: e.target.value })
    }

    const handleFileInputChange = (e) => {
        setFile(e.target.files[0])
    };

    const onSumbit = async (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        for (let key in thesis) {
            console.log(thesis[key])
            formData.append(key, thesis[key]);
        }
        formData.append("thesisFile", file)
        formData.append('userId', localStorage.getItem('userID'))
        await axios.post("/thesis/add", formData).then(
            function (response) {
                console.log('response : ', response)
                if (response.status === 200) {
                    // yonlendirme yap
                    console.log('tez olusturuldu.')
                }
            }
        )

    }

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-6 mx-auto">
                    <div className='mb-5 mt-5'>
                        <h3 className='text-center'>Tezini yükle!</h3>
                    </div>
                    <form onSubmit={(e) => onSumbit(e)}>
                        <div className="mb-3">
                            <label htmlFor="fileInput" className="form-label">Dosya Seçiniz</label>
                            <input type="file" className="form-control" id="fileInput" value={thesisFile} name='thesisFile' onChange={(e) => handleFileInputChange(e)}/>
                        </div>

                        <InputText inputLabel = "Tez Başlığı" inputName = "thesisTitle" inputValue = {thesisTitle} inputOnChange = {onInputChange}/>
                        <InputText inputLabel = "Tez Konusu" inputName = "thesisTopic" inputValue = {thesisTopic} inputOnChange = {onInputChange}/>
                        <InputText inputLabel = "Tez Dili" inputName = "thesisLanguage" inputValue = {thesisLanguage} inputOnChange = {onInputChange}/>
                        <InputText inputLabel = "Tez Grubu" inputName = "thesisGroup" inputValue = {thesisGroup} inputOnChange = {onInputChange}/>
                        <InputText inputLabel = "Üniversite" inputName = "thesisUniversity" inputValue = {thesisUniversity} inputOnChange = {onInputChange}/>
                        <InputText inputLabel = "Enstitü" inputName = "thesisInstitute" inputValue = {thesisInstitute} inputOnChange = {onInputChange}/>
                        <InputText inputLabel = "Ana Bilim Dalı" inputName = "thesisMainField" inputValue = {thesisMainField} inputOnChange = {onInputChange}/>
                        <InputText inputLabel = "Alt Bilim Dalı" inputName = "thesisChildrenField" inputValue = {thesisChildrenField} inputOnChange = {onInputChange}/>

                        <div className="mb-3">
                            <label htmlFor="type" className="form-label">Tez Türü</label>
                            <select className="form-select" id='type' name='thesisTypeId' onChange={(e) => onInputChange(e)}>
                                <option value={'6439662e7a88c576f8bef561'}>Yüksek Lisans</option>
                                <option value={'643966737a88c576f8bef562'}>Doktora</option>
                            </select>
                        </div>
                        <button type="submit" className="btn btn-primary">Yükle</button>
                    </form>
                </div>
            </div>
        </div>
    )
}
