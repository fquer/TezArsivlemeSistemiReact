import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ThesisUpload() {
    const navigate = useNavigate();

    useEffect(() => {
        const userID = localStorage.getItem('userID')
        console.log(userID)
        if (userID === "") {
            navigate('/');
        }
    }, [navigate])

    const [thesis, setThesis] = useState({
        thesisTitle: "",
        thesisTopic: "",
        thesisTypeId: "6439662e7a88c576f8bef561",
        userId: localStorage.getItem('userID')
    })

    const [file, setFile] = useState()

    const { thesisFile, thesisTitle, thesisTopic } = thesis

    const onInputChange = (e) => {
        setThesis({ ...thesis, [e.target.name]: e.target.value })
    }

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

        await axios.post("/thesis/add", formData).then(
            function (response) {
                console.log('response : ', response)
                if (response.status === 200) {
                    // yonlendirme yap
                    console.log('tez olusturuldu.')
                }
            }
        )

    }

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-6 mx-auto">
                    <div className='mb-5 mt-5'>
                        <h3 className='text-center'>Tezini yükle!</h3>
                    </div>
                    <form onSubmit={(e) => onSumbit(e)}>
                        <div className="mb-3">
                            <label htmlFor="fileInput" className="form-label">Dosya Seçiniz</label>
                            <input type="file" className="form-control" id="fileInput" value={thesisFile} name='thesisFile' onChange={(e) => handleFileInputChange(e)}/>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="title" className="form-label">Tez Başlığı</label>
                            <input type="text" className="form-control" id="title" value={thesisTitle} name='thesisTitle' onChange={(e) => onInputChange(e)}/>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="topic" className="form-label">Tez Konusu</label>
                            <input type="text" className="form-control" id="topic" value={thesisTopic} name='thesisTopic' onChange={(e) => onInputChange(e)}/>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="type" className="form-label">Tez Türü</label>
                            <select className="form-select" id='type' name='thesisTypeId' onChange={(e) => onInputChange(e)}>
                                <option value={'6439662e7a88c576f8bef561'}>Yüksek Lisans</option>
                                <option value={'643966737a88c576f8bef562'}>Doktora</option>
                            </select>
                        </div>
                        <button type="submit" className="btn btn-primary">Yükle</button>
                    </form>
                </div>
            </div>
        </div>
    )
}
