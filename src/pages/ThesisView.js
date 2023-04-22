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

    const transform = (slot) => ({
        ...slot,
        // These slots will be empty
        Print: () => <></>,
        Open: () => <></>,
        Download: () => <></>,
        EnterFullScreen: () => <></>,
        SwitchTheme: () => <></>,
    });

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
            <Spinner animation="border" variant="primary" /> 
        </div>
        :
        <div className='d-flex flex-column' style={{overflow: "hidden", height: "90vh"}}>
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.min.js">
                <Toolbar>{renderDefaultToolbar(transform)}</Toolbar>
                <div className='flex-fil' style={{overflow: "auto"}}>
                    <Viewer fileUrl={thesisData.thesisFile.fileUrl} plugins={[toolbarPluginInstance]}></Viewer>
                </div>
            </Worker>
        </div>
        }
    </div>
    )
}
