import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Spinner } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import '../css/thesisUser-style.css'

export default function ThesisUser() {
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
    const [theses, setTheses] = useState();
    const [isLoading, setIsLoading] = useState(true);
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
            {isLoading ? 
            <div className="d-flex justify-content-center align-items-center" style={{height: "100vh"}}>
                <div className="text-center">
                    <Spinner animation="border" variant="primary" /> 
                </div>
            </div>
            :
            <div className="row row-cols-2 row-cols-lg-5 g-2 g-lg-3 mt-3">
                {theses.map((key, index) => (
                    <div className="thesisCard card col m-3" key={index}>
                        <img className="thesisPreview" src={key.thesisFile.previewImage}></img>
                        <div className="card-body p-3">
                            <h5 className="card-title">{key.thesisTitle}</h5>
                            <p className="card-text">{key.thesisTopic}</p>
                        </div>
                    </div>
                ))}
            </div>
            }
        </div>
    )
}
