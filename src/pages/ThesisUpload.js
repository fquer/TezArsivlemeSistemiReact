import React, { useState, useEffect, useRef } from "react";
import { Spinner } from "react-bootstrap";
import { useNavigate, useParams  } from 'react-router-dom';
import axios from 'axios';
import InputText from "../components/InputText";
import InputSelect from "../components/InputSelect";

export default function ThesisUpload() {
    const { id } = useParams();

    const [thesis, setThesis] = useState({
        thesisTitle: "",
        thesisTopic: "",
        thesisLanguage: "",
        thesisGroup: "",
        thesisUniversity: "",
        thesisInstitute: "",
        thesisMainField: "",
        thesisChildrenField: "",
        thesisType: ""
    })

    const thesisDetailDropdownsLabels = {
        thesisUniversities: ["Üniversite", "thesisUniversity"],
        thesisInstitutes: ["Enstitü", "thesisInstitute"],
        thesisMainFields: ["Ana Bilim Dalı", "thesisMainField"],
        thesisChildrenFields: ["Alt Bilim Dalı", "thesisChildrenField"],
        thesisLanguages: ["Tez Dili", "thesisLanguage"],
        thesisGroups: ["Grubu", "thesisGroup"],
        thesisTypes: ["Tez Tipi", "thesisType"]
    }

    const [thesisDetailDropdowns, setThesisDetailDropdowns] = useState([]);
    async function createThesisDetailDropdowns(data) {
        const updatedThesis = { ...thesis };
        const dropdowns = []

        const checkUserForThesis = async () => {
            if (id) {
                const response = await axios.get("/thesis/" + id)
                updatedThesis["thesisTitle"] = response.data.thesisTitle
                updatedThesis["thesisTopic"] = response.data.thesisTopic
                return response.data   
            }
            return null;
        }
        const editedThesisResponse = await checkUserForThesis();

        for (const key of Object.keys(thesisDetailDropdownsLabels)) {
            updatedThesis[thesisDetailDropdownsLabels[key][1]] = data[key][0].id
            dropdowns.push(<div className="col-4" key={thesisDetailDropdownsLabels[key][1] + "DivKey"}>
                            <InputSelect key={thesisDetailDropdownsLabels[key][1] + "Key"}
                                        defaultValue = {editedThesisResponse ? editedThesisResponse[thesisDetailDropdownsLabels[key][1]].id : null}
                                        inputData = {data[key]}
                                        inputName = {thesisDetailDropdownsLabels[key][1]}
                                        inputTitle = {thesisDetailDropdownsLabels[key][0]}
                                        inputOnChange = {onInputChange}/></div>)
        }
        
        setThesis(updatedThesis);
        setThesisDetailDropdowns(dropdowns)
        setIsLoading(false)
    }

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
    useEffect(() => {
        if (!isMountedRef.current && canAccessPage) {
            const fetchData = async () => {
                const response = await axios.get("/thesisDetail/getAll")
                createThesisDetailDropdowns(response.data)
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
            formData.append(key, thesis[key]);
        }
        formData.append('userId', localStorage.getItem('userID'))

        if (id) {
            const fileCheckbox = document.getElementById("fileCheckbox")
            let url;
            if (fileCheckbox.checked) {
                formData.append("thesisFile", file)
                url = "/thesis/" + id
            }
            else {
                url = "/thesis/" + id
            }
            await axios.put(url, formData).then(
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

    const { thesisTitle, thesisTopic } = thesis
    return (
        <div className="container">
            {isLoading ? 
            <div className="d-flex justify-content-center align-items-center" style={{height: "100vh", backgroundColor: "white"}}>
                <Spinner animation="border" variant="primary" color="#162d46" /> 
            </div>
            : 
            <div>
                {isUploading === true ? 
                <div className="d-flex justify-content-center align-items-center" style={{position: "absolute",zIndex: "1", transform: "translate(-50%, -50%)", top: "50%", left: "50%", width: "90%", height: "90%"}}>
                    <div className="text-center">
                        <Spinner animation="border" variant="primary" /> 
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
                                    <div className="col">
                                        <InputText inputLabel = "Tez Başlığı" inputName = "thesisTitle" inputValue = {thesisTitle} inputOnChange = {onInputChange}/>
                                    </div>
                                    <div className="col">
                                        <InputText inputLabel = "Tez Konusu" inputName = "thesisTopic" inputValue = {thesisTopic} inputOnChange = {onInputChange}/>
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    {thesisDetailDropdowns}
                                </div>
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
