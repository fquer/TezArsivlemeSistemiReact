import React, { useState, useEffect, useRef } from "react";
import ThesisCardLoading from "../components/ThesisCardLoadingHome";
import axios from 'axios'
import ThesisCard from '../components/ThesisCardHome'
import "../css/home-style.css"
import calculateUploadDates from "../utils/UploadDateConverter";
import document from '../images/document.png';

export default function Home() {
  const isMountedRef = useRef(false);
  const [theses, setTheses] = useState();
  const [isLoading, setIsLoading] = useState(true);

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
              console.log(response.data)
              setIsLoading(false)
          }

          fetchData();
          isMountedRef.current = true;
      }
  }, [])

  

  return (
    <div className="container overflow-hidden mt-4">
      <h2 className="mb-4">Güncel Yayınlanan Tezler</h2>
      <div className="row d-flex justify-content-center">
        {isLoading ? 
          <ThesisCardLoading hasButtons = {false} cardCount = {4}/>
        :
          theses.map((key, index) => (
              <ThesisCard key = {index + "Card"} 
              index = {index} id = {key.id} 
              previewImage = {key.thesisFile.previewImage} 
              thesisName = {key.thesisFile.thesisName} 
              thesisTitle = {key.thesisTitle} 
              thesisUploadDate = {calculateUploadDates(key.thesisUploadDate)}
              author = {key.user.userName + " " + key.user.userSurname}
              thesisType = {key.thesisType.thesisTypeName}
              thesisUniversity = {key.thesisUniversity.thesisUniversityName}/>
          ))
        }
        </div>
        <div className="row d-flex justify-content-center mt-5">
          <div className="col-5 altBilgi align-items-center">
            <p className='baslik p-5 mb-0 fs-4 text-center'>Sen de tezlerini <a href="/thesis/upload" style={{color: "rgb(102, 178, 255)"}}>yükle!</a></p>
          </div>
          <div className="col-5 altBilgi align-items-center">
            <p className='baslik p-5 mb-0 fs-4 text-center'>Özgürce istediğin tezleri <a href="/thesis/search" style={{color: "rgb(102, 178, 255)"}}>araştır!</a></p>
          </div>
        </div>
    </div>
  )
}
