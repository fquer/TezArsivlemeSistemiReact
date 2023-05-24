import React, { useState, useEffect, useRef } from "react";
import { Spinner } from 'react-bootstrap'
import axios from 'axios'
import InputText from "../components/InputText";
import { thesisDetail } from "../utils/ThesisUtil.js"
import DynamicDropdowns from "../components/DynamicDropdowns";
import moment from "moment/moment";

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

    const onBasicSumbit = async (e) => {
        setIsSearchResultLoading(true)
        e.preventDefault();
        const generalSeachWord = document.getElementById('generalSearch').value
        console.log(generalSeachWord)
        const response = await axios.get("/thesis/findThesisBasic?generalSearchWord=" + generalSeachWord)
        console.log("response : ", response.data)
        setThesesList(response.data)
        setIsSearchResultLoading(false)
    }

    const [activeTab, setActiveTab] = useState("tab1");

    const toggleTab = (tab) => {
        if (activeTab !== tab) {
        setActiveTab(tab);
        }
    };

  return (
    <div>
        {
            isLoading ?
            <div className="d-flex justify-content-center align-items-center" style={{height: "100vh"}}>
                <div className="text-center">
                    <Spinner animation="border" className='bootstrapSpinner' /> 
                </div>
            </div>
            :
            <div className="mt-5 container">
                <div>
                    <h1 className="mb-5">Tez Araması</h1>

                    <ul className="nav nav-tabs">
                        <li className="nav-item">
                            <a className={`nav-link ${activeTab === "tab1" ? "active" : ""}`} onClick={() => toggleTab("tab1")} href="#">
                                Basit Tarama
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className={`nav-link ${activeTab === "tab2" ? "active" : ""}`} onClick={() => toggleTab("tab2")} href="#">
                                Gelişmiş Tarama
                            </a>
                        </li>
                    </ul>
                    <div className="tab-content">
                        <div className={`tab-pane ${activeTab === "tab1" ? "active" : ""}`}>
                            <form onSubmit={(e) => onBasicSumbit(e)}>
                                <div className="row mt-5 mb-5">
                                    <label className="mb-2" htmlFor="generalSearch">Aranacak Kelime</label>
                                    <div className="col-11">
                                        <input type="text" className="form-control" id="generalSearch" name="generalSearch"/>
                                    </div>
                                    <div className="col-1">
                                        <button type="submit" className="btn btn-primary">Ara</button>
                                    </div>
                                </div>
                            </form>
                        </div>

                        <div className={`tab-pane ${activeTab === "tab2" ? "active" : ""}`}>
                            
                            <form onSubmit={(e) => onSumbit(e)}>
                                <div className="mt-5">
                                    <div className="row mb-3">
                                        <div className="col-9">
                                            <InputText inputLabel = "Tez Başlığı" inputName = "thesisTitle" inputValue = {thesis.thesisTitle} inputOnChange = {onInputChange} isRequired = {false}/>
                                        </div>
                                        <div className="col-3">
                                            <InputText inputLabel = "Danışman İsim Soyisim" inputName = "thesisAdvisor" inputValue = {thesis.thesisAdvisor} inputOnChange = {onInputChange} isRequired = {false}/>
                                        </div>
                                    </div>
                                    
                                    <div>
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

                        </div>

                    </div>
                </div>
                
                {
                    isSearchResultLoading ?
                    null
                    :
                    thesesList.lenght === 0 ? 
                    <div>sonuc bulunamadi</div>
                    : 
                    <div className="container">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col">Tez Başlığı</th>
                                    <th scope="col">Yazar</th>
                                    <th scope="col">Üniversite</th>
                                    <th scope="col">Enstitü</th>
                                    <th scope="col">Ana Bilim Dalı</th>
                                    <th scope="col">Alt Bilim Dalı</th>
                                    <th scope="col">Tez Dili</th>
                                    <th scope="col">Tez Grubu</th>
                                    <th scope="col">Tez Tipi</th>
                                    <th scope="col">Yazılma Yılı</th>
                                    <th scope="col">Sisteme Yüklenme Tarihi</th>
                                    <th scope="col">Danışman</th>
                                    <th scope="col">Dosya</th>
                                </tr>
                            </thead>
                            <tbody>
                                {thesesList.map((key, index) => (
                                    <tr key={index}>
                                        <td className="text-capitalize">{key.thesisTitle}</td>
                                        <td className="text-capitalize">{key.user.userName + " " + key.user.userSurname}</td>
                                        <td className="text-capitalize">{key.thesisUniversity.thesisUniversityName}</td>
                                        <td className="text-capitalize">{key.thesisInstitute.thesisInstituteName}</td>
                                        <td className="text-capitalize">{key.thesisMainField.thesisMainFieldName}</td>
                                        <td className="text-capitalize">{key.thesisChildrenField.thesisChildrenFieldName}</td>
                                        <td className="text-capitalize">{key.thesisLanguage.thesisLanguageName}</td>
                                        <td className="text-capitalize">{key.thesisGroup.thesisGroupName}</td>
                                        <td className="text-capitalize">{key.thesisType.thesisTypeName}</td>
                                        <td className="text-capitalize">{key.thesisWrittenYear}</td>
                                        <td className="text-capitalize">{moment(key.thesisUploadDate).format('l')}</td>
                                        <td className="text-capitalize">{key.thesisAdvisor}</td>
                                        <td className="text-capitalize" style={{textAlign: "center"}}><a href={"/thesis/" + key.id}><i className="fa fa-file-text" aria-hidden="true"></i></a></td>
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
