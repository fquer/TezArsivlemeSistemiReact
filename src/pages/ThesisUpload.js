import React, { useState, useEffect, useRef } from "react";
import { Spinner } from "react-bootstrap";
import { useNavigate, useParams  } from 'react-router-dom';
import axios from 'axios';
import InputText from "../components/InputText";
import DynamicDropdowns from "../components/DynamicDropdowns";
import { thesisDetail, thesisDetailDropdownsLabels } from "../utils/ThesisUtil.js"

export default function ThesisUpload() {
    const { id } = useParams();
    const [thesis, setThesis] = useState(thesisDetail)

    const [canAccessPage, setCanAccessPage] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        const userID = localStorage.getItem('userID')
        if (userID === "") {
            navigate('/login');
        }
        else {
            setCanAccessPage(true)
        }
    }, [navigate])

    const isMountedRef = useRef(false);
    const [isLoading, setIsLoading] = useState(true);
    const [dropdownDetailData, setDropdownDetailData] = useState(null);
    const [isHaveDefaultValue, setIsHaveDefaultValue] = useState(false);
    useEffect(() => {
        if (!isMountedRef.current && canAccessPage) {
            const fetchData = async () => {
                const response = await axios.get("/thesisDetail/getAll") // dropdown kategorilerini al
                if (id) { // eger duzenlenecek tez dolduruyorsak default value al
                    const updatedThesis = { ...thesis };
                    const response = await axios.get("/thesis/" + id)
                    console.log("Response : ", response)
                    for await (const key of Object.keys(updatedThesis)) {
                        console.log(response.data[key])
                        updatedThesis[key] = response.data[key].id
                    }

                    updatedThesis["thesisTitle"] = response.data.thesisTitle
                    updatedThesis["thesisWrittenYear"] = response.data.thesisWrittenYear
                    updatedThesis["thesisAdvisor"] = response.data.thesisAdvisor.split('-')[1].trim()

                    setThesis(updatedThesis)
                    setIsHaveDefaultValue(true)
                }
                else {
                    const updatedThesis = { ...thesis };
                    for await (const key of Object.keys(thesisDetailDropdownsLabels)) {
                        updatedThesis[thesisDetailDropdownsLabels[key].id] = response.data[key][0].id
                    }
                    updatedThesis["thesisWrittenYear"] = "2023"
                    setThesis(updatedThesis)
                }
                setDropdownDetailData(response.data)
                setIsLoading(false)
            }
            fetchData();
            isMountedRef.current = true;
        }
    }, [canAccessPage])
    
    useEffect(() => {
        console.log("Thesis updated:", thesis);
    }, [thesis]);
    
    const onInputChange = (e) => {
        setThesis(prevThesis => ({ ...prevThesis, [e.target.name]: e.target.value }))
    }

    const handleFileCheckbox = (e) => {
        const fileLabel = document.getElementById("fileInputLabel")
        const fileInput = document.getElementById("fileInput")

        if (e.target.checked) {
            fileLabel.innerHTML = "Dosya Seçiniz"
            fileInput.disabled = false
        }
        else {
            fileLabel.innerHTML = "Tez Dosyasını Değiştir"
            fileInput.disabled = true
        }
    }
    
    const [file, setFile] = useState()
    const handleFileInputChange = (e) => {
        setFile(e.target.files[0])
    };

    const [isUploading, setIsUploading] = useState()
    const onSumbit = async (e) => {
        e.preventDefault();
        setIsUploading(true)
        document.getElementById("uploadContainer").style.opacity = "0.25"
        
        const formData = new FormData();
        for (let key in thesis) {
            if (key == "thesisAdvisor") {
                formData.append(key, document.getElementById("unvan").value + thesis[key]);
            }
            else {
                formData.append(key, thesis[key]);
            }
        }
        formData.append('userId', localStorage.getItem('userID'))

        if (id) {
            const fileCheckbox = document.getElementById("fileCheckbox")
            if (fileCheckbox.checked) {
                formData.append("thesisFile", file)
            }
            await axios.put("/thesis/" + id, formData).then(
                function (response) {
                    if (response.status === 200) {
                        console.log('tez guncellendi : ', response)
                        setIsUploading(false)
                    }
                }
            )
        }
        else {
            formData.append("thesisFile", file)
            await axios.post("/thesis/add", formData).then(
                function (response) {
                    if (response.status === 200) {
                        console.log('tez olusturuldu : ', response)
                        setIsUploading(false)
                    }
                }
            )
        }
    }

    useEffect(() => {
        if (isUploading === false) {
            setTimeout(() => {
                navigate("/thesis/mytheses")
            }, 1000);
        }
    },[isUploading])

    const { thesisTitle, thesisAdvisor } = thesis
    return (
        <div className="container">
            {isLoading ? 
            <div className="d-flex justify-content-center align-items-center" style={{height: "100vh"}}>
                <div className="text-center">
                    <Spinner animation="border" className='bootstrapSpinner' /> 
                </div>
            </div>
            : 
            <div>
                {isUploading === true ? 
                <div className="d-flex justify-content-center align-items-center" style={{position: "absolute",zIndex: "1", transform: "translate(-50%, -50%)", top: "50%", left: "50%", width: "90%", height: "90%"}}>
                    <div className="text-center">
                        <Spinner animation="border" className='bootstrapSpinner' /> 
                    </div>
                </div> 
                : 
                <div>
                    {isUploading === false ?
                    <div className="d-flex justify-content-center align-items-center" style={{position: "absolute",zIndex: "1", transform: "translate(-50%, -50%)", top: "50%", left: "50%", width: "90%", height: "90%"}}>
                        <div className="text-center">
                            <i className="fa fa-check-circle-o fa-5x" aria-hidden="true"></i>
                            <h1>{id ? "Teziniz Güncellendi!" : "Teziniz Oluşturuldu!"}</h1>
                        </div>
                    </div> 
                    :
                    null
                    }
                </div>
                }
                <div id="uploadContainer">
                    <div className="col-md-12 px-auto">
                        <div className='mb-5 mt-5'>
                            <h3 className='text-center'>{id ? "Tezini Düzenle" : "Tezini yükle!"}</h3>
                        </div>
                        <form onSubmit={(e) => onSumbit(e)}>
                            <div className="container">
                                <div className="row mb-3 justify-content-center">
                                    <div className="col-6">
                                        <label id="fileInputLabel" className="form-label">{id ? "Tez Dosyasını Değiştir" : "Dosya Seçiniz"}</label>
                                        { id ? <input type="checkbox" id="fileCheckbox" className="m-2" onChange={(e) => handleFileCheckbox(e)}/> : null }
                                        <input type="file" className="form-control" id="fileInput" name='thesisFile' onChange={(e) => handleFileInputChange(e)} required={id ? false : true} disabled={id ? true : false} />
                                    </div>
                                    
                                </div>
                                <div className="row mb-3">
                                    
                                </div>
                                <div className="row mb-3">
                                <div className="col-7">
                                        <InputText inputLabel = "Tez Başlığı" inputName = "thesisTitle" inputValue = {thesisTitle} inputOnChange = {onInputChange} isRequired = {true}/>
                                    </div>
                                    <div className="col-2">
                                        <label className="form-label">Danışman Ünvanı</label>
                                        <select className="form-select" id="unvan">
                                            <option value="Dr.Öğr.Üyesi - ">Dr.Öğr.Üyesi</option>
                                            <option value="Doç.Dr. - ">Doç.Dr.</option>
                                            <option value="Prof.Dr. - ">Prof.Dr.</option>
                                        </select>
                                    </div>
                                    <div className="col-3">
                                        <InputText inputLabel = "Danışman İsim Soyisim" inputName = "thesisAdvisor" inputValue = {thesisAdvisor} inputOnChange = {onInputChange} isRequired = {true}/>
                                    </div>
                                </div>
                                
                                
                                <DynamicDropdowns mainClass = {thesis}
                                                data = {dropdownDetailData}
                                                onInputChange = {onInputChange}
                                                isHaveDefaultValue = {isHaveDefaultValue}/>
                                
                                
                                
                            </div>
                            <button type="submit" className="btn btn-primary">Yükle</button>
                        </form>
                    </div>
                </div>
            </div>
            }
        </div>
    )
}
