import React, { useState, useEffect, useRef } from "react";
import { Spinner } from 'react-bootstrap'
import axios from 'axios'
import ThesisCard from '../components/ThesisCard'
import "../css/home-style.css"
import InputText from "../components/InputText";
import { thesisDetail } from "../utils/ThesisUtil.js"
import DynamicDropdowns from "../components/DynamicDropdowns";

export default function Home() {
  const isMountedRef = useRef(false);
  const [theses, setTheses] = useState();
  const [thesis, setThesis] = useState(thesisDetail)
  const [isLoading, setIsLoading] = useState(true);
  const [dropdownDetailData, setDropdownDetailData] = useState(null);

  useEffect(() => {
      if (!isMountedRef.current) {

          // tezlerin onizleme sayfalarini al
          const fetchPreviewImage = async (thesis) => {
              if (thesis.thesisFile.previewImageId) {
                  const responsePreviewImage = await axios.get("/file/download/preview/" + thesis.thesisFile.previewImageId, { responseType: 'arraybuffer' })
                  const imageBlob = new Blob([responsePreviewImage.data], { type: 'image/jpeg' });
                  const imageUrl = URL.createObjectURL(imageBlob);
                  thesis.thesisFile['previewImage'] = imageUrl
              }
              else {
                  thesis.thesisFile['previewImage'] = "https://st3.depositphotos.com/23594922/31822/v/600/depositphotos_318221368-stock-illustration-missing-picture-page-for-website.jpg"
              }
          }
          
          // tez datalari
          const fetchData = async () => {
              const response = await axios.get("/thesis/getLast")
              for (const thesis of response.data) {
                  await fetchPreviewImage(thesis)
              }
              setTheses(response.data)
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
    e.preventDefault();
    console.log(thesis)
    const response = await axios.post("/thesis/findThesis", thesis)
    console.log("response : ", response.data)
  }

  return (
    <div>
      {isLoading ? 
      <div className="d-flex justify-content-center align-items-center" style={{height: "100vh"}}>
          <div className="text-center">
              <Spinner animation="border" variant="primary" /> 
          </div>
      </div>
      :
      <div>
        <div className="p-4">
          <h2>Güncel Yayınlanan Tezler</h2>
          <div className="row">
              {theses.map((key, index) => (
                  <ThesisCard key = {index + "Card"} index = {index} id = {key.id} previewImage = {key.thesisFile.previewImage} thesisName = {key.thesisFile.thesisName} thesisTitle = {key.thesisTitle} thesisTopic = {key.thesisTopic}/>
              ))}
          </div>
          <h2>Tez Arama</h2>
          <form onSubmit={(e) => onSumbit(e)}>
            <div className="container">
              <div className="row mb-3">
                  <div className="col">
                      <InputText inputLabel = "Tez Başlığı" inputName = "thesisTitle" inputValue = {thesis.thesisTitle} inputOnChange = {onInputChange} isRequired = {false}/>
                  </div>
                  <div className="col">
                      <InputText inputLabel = "Tez Konusu" inputName = "thesisTopic" inputValue = {thesis.thesisTopic} inputOnChange = {onInputChange} isRequired = {false}/>
                  </div>
              </div>
              
              <button type="button" className="btn btn-primary mb-3" data-toggle="collapse" data-target="#advancedSearch">
                Gelişmiş Arama <span className="fa fa-chevron-down"></span>
              </button>

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
        </div>
      </div>
      }
    </div>
  )
}
