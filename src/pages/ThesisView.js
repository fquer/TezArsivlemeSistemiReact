import React, { useEffect, useState, useRef } from 'react'
import { useNavigate, useParams  } from 'react-router-dom';
import axios from 'axios';
import { Spinner } from 'react-bootstrap';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import '@react-pdf-viewer/core/lib/styles/index.css';

export default function ThesisView() {
    const { toolbarPluginInstance } = defaultLayoutPlugin()
    const { renderDefaultToolbar, Toolbar } = toolbarPluginInstance;

    const [showDetails, setShowDetails] = useState(false)
    const transform = (slot) => ({
        ...slot,
        // These slots will be empty
        Print: () => <></>,
        Open: () => <button id='showDetailsBtn' onClick={showDetailsClick} style={{borderRadius: "7px", border: "none"}}>Ayrıntıları Göster</button>,
        Download: () => <></>,
        EnterFullScreen: () => <></>,
        SwitchTheme: () => <></>,
        ShowSearchPopover: () => <></>,
        ShowPropertiesMenuItem: () => <></>
    });

    async function showDetailsClick() {
        const showDetailsBtn =  document.getElementById("showDetailsBtn")
        if (showDetailsBtn.innerText == "Ayrıntıları Göster") {
            showDetailsBtn.innerText = "Ayrıntıları Gizle"
            setShowDetails(true)
        }
        else {
            showDetailsBtn.innerText = "Ayrıntıları Göster"
            setShowDetails(false)
        }
    }

    const { id } = useParams();
    const isMountedRef = useRef(false);
    const [isLoading, setIsLoading] = useState(true)
    const [thesisData, setThesisData] = useState()
    useEffect(() => {
        if (!isMountedRef.current) {
            const fetchData = async () => {
                const response = await axios.get("/thesis/" + id)
                console.log(response.data)
                const responseFile = await axios.get("/file/download/file/" + response.data.thesisFile.fileId, { responseType: 'arraybuffer' })
                const fileBlob = new Blob([responseFile.data], { type: 'application/pdf' });
                const fileUrl = URL.createObjectURL(fileBlob);
                response.data.thesisFile['fileUrl'] = fileUrl
                console.log(response.data)
                setThesisData(response.data)
                setIsLoading(false)
            }
            fetchData()
            isMountedRef.current = true; 
        }
    }, [])

    return (
    <div>
        {isLoading ?
        <div className="d-flex justify-content-center align-items-center" style={{height: "100vh", backgroundColor: "white"}}>
            <Spinner animation="border" className='bootstrapSpinner' /> 
        </div>
        :
        <div>
            <div className='row container mt-3 p-5' style={{display: showDetails ? "flex" : "none"}}>
                <p className='baslik'>Tez Başlığı</p>
                <p className='text-capitalize'>{thesisData.thesisTitle}</p>
                <div className='col-3'>
                    <p className='baslik'>Yüklenme Tarihi</p>
                    <p className='text-capitalize'>{thesisData.thesisUploadDate}</p>
                </div>
                <div className='col-3'>
                    <p className='baslik'>Danışman</p>
                    <p className='text-capitalize'>{thesisData.thesisAdvisor}</p>
                </div>
                <div className='col-3'>
                    <p className='baslik'>Tez Yazılma Yılı</p>
                    <p className='text-capitalize'>{thesisData.thesisWrittenYear}</p>
                </div>
                <div className='col-3'>
                    <p className='baslik'>Tez Tipi</p>
                    <p className='text-capitalize'>{thesisData.thesisType.thesisTypeName}</p>
                </div>
            </div>
            <div className='d-flex flex-column mt-1' style={{overflow: "hidden", height: "90vh"}}>
                <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.min.js">
                    <Toolbar>{renderDefaultToolbar(transform)}</Toolbar>
                    <div className='flex-fil mt-1' style={{overflow: "auto"}}>
                        <Viewer fileUrl={thesisData.thesisFile.fileUrl} plugins={[toolbarPluginInstance]}></Viewer>
                    </div>
                </Worker>
            </div>
        </div>
        }
    </div>
    )
}
