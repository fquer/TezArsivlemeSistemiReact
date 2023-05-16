import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import '../css/thesisUser-style.css'
import ThesisCard from "../components/ThesisCard";
import ThesisCardTools from "../components/ThesisCardTools";
import ThesisCardLoading from "../components/ThesisCardLoading";
import calculateUploadDates from "../utils/UploadDateConverter";

export default function ThesisUser() {
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
    const [theses, setTheses] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [thesisCount, setThesisCount] = useState(0);
    useEffect(() => {
        if (!isMountedRef.current && canAccessPage) {

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
                const response = await axios.get("/thesis/getAllByUserId/" + localStorage.getItem('userID'))
                setThesisCount(response.data.length)
                for (const thesis of response.data) {
                    await fetchPreviewImage(thesis)
                }
                setTheses(response.data)
                setIsLoading(false)
            }

            fetchData();
            isMountedRef.current = true;
        }
    }, [canAccessPage])
    
    return (
        <div>
            {thesisCount == 0 ?
            <div className="d-flex justify-content-center align-items-center" style={{height: "90vh"}}>
                <span style={{fontSize: "25px"}}>Yüklü tez bulunamadı. <a href="/thesis/upload">Tez yükle!</a></span>
            </div>
            :
            isLoading ? 
            <ThesisCardLoading hasButtons = {true} cardCount = {thesisCount}/>
            :
            <div className="row row-cols-2 row-cols-lg-5 g-2 g-lg-3 mt-3 p-3">
                {theses.map((key, index) => (
                    <ThesisCard key = {index + "Card"} index = {index} id = {key.id} previewImage = {key.thesisFile.previewImage} thesisName = {key.thesisFile.thesisName} thesisTitle = {key.thesisTitle} thesisUploadDate = {calculateUploadDates(key.thesisUploadDate)}>
                        <ThesisCardTools index = {index} id = {key.id} />
                    </ThesisCard>
                ))}
            </div>
            }
        </div>
    )
}
