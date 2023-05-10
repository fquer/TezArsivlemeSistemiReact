import React, { useState, useEffect, useRef } from "react";
import { Spinner } from 'react-bootstrap'
import axios from 'axios'
import InputText from "../components/InputText";
import { thesisDetail } from "../utils/ThesisUtil.js"
import DynamicDropdowns from "../components/DynamicDropdowns";

export default function ThesisSearch() {
    const isMountedRef = useRef(false);
    const [thesis, setThesis] = useState(thesisDetail)
    const [dropdownDetailData, setDropdownDetailData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSearchResultLoading, setIsSearchResultLoading] = useState(true);
    const [thesesList, setThesesList] = useState(null);

    useEffect(() => {
        if (!isMountedRef.current) {
  
            // tez datalari
            const fetchData = async () => {
                const dropdownDeatil = await axios.get("/thesisDetail/getAll")
                setDropdownDetailData(dropdownDeatil.data)
                setIsLoading(false)
            }
  
            fetchData();
            isMountedRef.current = true;
        }
    }, [])

    const onInputChange = (e) => {
        setThesis(prevThesis => ({ ...prevThesis, [e.target.name]: e.target.value }))
    }

    const onSumbit = async (e) => {
        setIsSearchResultLoading(true)
        e.preventDefault();
        console.log(thesis)
        const response = await axios.post("/thesis/findThesis", thesis)
        console.log("response : ", response.data)
        setThesesList(response.data)
        setIsSearchResultLoading(false)
    }

  return (
    <div>
        {
            isLoading ?
            <div className="d-flex justify-content-center align-items-center" style={{height: "100vh"}}>
                <div className="text-center">
                    <Spinner animation="border" variant="primary" /> 
                </div>
            </div>
            :
            <div className="mt-5">
                <form onSubmit={(e) => onSumbit(e)}>
                    <div className="container">
                        <h1 className="mb-5">Tez Araması</h1>
                        <div className="row mb-3">
                            <div className="col">
                                <InputText inputLabel = "Tez Başlığı" inputName = "thesisTitle" inputValue = {thesis.thesisTitle} inputOnChange = {onInputChange} isRequired = {false}/>
                            </div>
                            <div className="col">
                                <InputText inputLabel = "Tez Konusu" inputName = "thesisTopic" inputValue = {thesis.thesisTopic} inputOnChange = {onInputChange} isRequired = {false}/>
                            </div>
                            
                            <div className="col-1">
                                <button type="button" className="btn btn-primary mb-3" data-toggle="collapse" data-target="#advancedSearch">
                                    Gelişmiş Arama <span className="fa fa-chevron-down"></span>
                                </button>
                            </div>
                        </div>
                        
                        

                        <div id="advancedSearch" className="collapse">
                            <DynamicDropdowns mainClass = {thesis}
                                            data = {dropdownDetailData}
                                            onInputChange = {onInputChange}
                                            searchActive = { true } />
                        </div>
                        <div className="row">
                            <div className="col">
                            <button type="submit" className="btn btn-primary">Ara</button>
                            </div>
                        </div>
                    </div>
                </form>
                {
                    isSearchResultLoading ?
                    null
                    :
                    thesesList.lenght === 0 ? 
                    <div>sonuc bulunamadi</div>
                    : 
                    <div className="container">
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th scope="col">Tez Başlığı</th>
                                    <th scope="col">Tez Konusu</th>
                                    <th scope="col">Üniversite</th>
                                    <th scope="col">Enstitü</th>
                                    <th scope="col">Ana Bilim Dalı</th>
                                    <th scope="col">Alt Bilim Dalı</th>
                                    <th scope="col">Tez Dili</th>
                                    <th scope="col">Tez Grubu</th>
                                    <th scope="col">Tez Tipi</th>
                                    <th scope="col">Dosya</th>
                                </tr>
                            </thead>
                            <tbody>
                                {thesesList.map((key, index) => (
                                    <tr>
                                        <td>{key.thesisTitle}</td>
                                        <td>{key.thesisTopic}</td>
                                        <td>{key.thesisUniversity.thesisUniversityName}</td>
                                        <td>{key.thesisInstitute.thesisInstituteName}</td>
                                        <td>{key.thesisMainField.thesisMainFieldName}</td>
                                        <td>{key.thesisChildrenField.thesisChildrenFieldName}</td>
                                        <td>{key.thesisLanguage.thesisLanguageName}</td>
                                        <td>{key.thesisGroup.thesisGroupName}</td>
                                        <td>{key.thesisType.thesisTypeName}</td>
                                        <td style={{textAlign: "center"}}><a href={"/thesis/" + key.id}><i className="fa fa-file-text" aria-hidden="true"></i></a></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                }
            </div>
        }
        
    </div>
  )
}
