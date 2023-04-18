import React, { useState, useEffect, useRef } from "react";
import { Spinner } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import InputText from "../components/InputText";
import InputSelect from "../components/InputSelect";

export default function ThesisUpload() {
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
    function createThesisDetailDropdowns(data) {
        const updatedThesis = { ...thesis };
        const dropdowns = []
        for (const key of Object.keys(thesisDetailDropdownsLabels)) {
            updatedThesis[thesisDetailDropdownsLabels[key][1]] = data[key][0].id
            dropdowns.push(<InputSelect key={thesisDetailDropdownsLabels[key][1] + "Key"} inputData = {data[key]} inputName = {thesisDetailDropdownsLabels[key][1]} inputTitle = {thesisDetailDropdownsLabels[key][0]} inputOnChange = {onInputChange}/>)
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
            navigate('/');
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
    
    const [file, setFile] = useState()
    const handleFileInputChange = (e) => {
        setFile(e.target.files[0])
    };

    const onSumbit = async (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        for (let key in thesis) {
            formData.append(key, thesis[key]);
        }
        formData.append("thesisFile", file)
        formData.append('userId', localStorage.getItem('userID'))
        await axios.post("/thesis/add", formData).then(
            function (response) {
                if (response.status === 200) {
                    // yonlendirme yap
                    console.log('tez olusturuldu : ', response)
                }
            }
        )

    }

    const { thesisTitle, thesisTopic } = thesis
    return (
        <div className="container">
            {isLoading ? 
            <div className="d-flex justify-content-center align-items-center" style={{height: "100vh"}}>
                <div className="text-center">
                    <Spinner animation="border" variant="primary" /> 
                </div>
            </div>
            : 
            <div className="row">
                <div className="col-md-6 mx-auto">
                    <div className='mb-5 mt-5'>
                        <h3 className='text-center'>Tezini yükle!</h3>
                    </div>
                    <form onSubmit={(e) => onSumbit(e)}>
                        <div className="mb-3">
                            <label htmlFor="fileInput" className="form-label">Dosya Seçiniz</label>
                            <input type="file" className="form-control" id="fileInput" name='thesisFile' onChange={(e) => handleFileInputChange(e)}/>
                        </div>
                        <InputText inputLabel = "Tez Başlığı" inputName = "thesisTitle" inputValue = {thesisTitle} inputOnChange = {onInputChange}/>
                        <InputText inputLabel = "Tez Konusu" inputName = "thesisTopic" inputValue = {thesisTopic} inputOnChange = {onInputChange}/>
                        {thesisDetailDropdowns}
                        <button type="submit" className="btn btn-primary">Yükle</button>
                    </form>
                </div>
            </div>
            }
        </div>
    )
}
