import React, { useState, useEffect, useRef } from "react";
import ThesisCardLoading from "../components/ThesisCardLoading";
import axios from 'axios'
import ThesisCard from '../components/ThesisCard'
import "../css/home-style.css"
import calculateUploadDates from "../utils/UploadDateConverter";

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
              console.log(calculateUploadDates(response.data[0].thesisUploadDate))
              setIsLoading(false)
          }

          fetchData();
          isMountedRef.current = true;
      }
  }, [])

  

  return (
    <div className="p-4 container">
      <h2>Güncel Yayınlanan Tezler</h2>
      <div className="justify-content-center">
        {isLoading ? 
          <ThesisCardLoading hasButtons = {false} cardCount = {4}/>
        :
        <div className="row">
          {theses.map((key, index) => (
              <ThesisCard key = {index + "Card"} index = {index} id = {key.id} previewImage = {key.thesisFile.previewImage} thesisName = {key.thesisFile.thesisName} thesisTitle = {key.thesisTitle} thesisUploadDate = {calculateUploadDates(key.thesisUploadDate)}/>
          ))}
        </div>
        }
      </div>
    </div>
  )
}
