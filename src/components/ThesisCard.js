import React, { useState } from "react";
import { Spinner } from 'react-bootstrap'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

export default function ThesisCard(props) {
    const { index, id, previewImage, thesisName, thesisTitle, thesisUploadDate, children, thesisLanguage, thesisType, thesisWrittenYear, thesisAdvisor } = props

    const deleteThesis = async (e, thesisId, index) => {
        e.preventDefault();
        setShowStatus(true)
        const response = await axios.delete("/thesis/" + thesisId)
        console.log(response)
        if (response.status === 200) {
            document.getElementById(index).remove();
        }
        else {
            alert("tez silinemedi!")
        }
    }
    
    const navigate = useNavigate();
    const editThesis = async (e, id) => {
        e.preventDefault();
        navigate("/thesis/edit/" + id)
    }

    const [showStatus, setShowStatus] = useState(false);

    return (
    <div className="thesisCardHome col-5 mx-2 my-2" key={index} id={index}>
        {
        showStatus ?
        <div className="" style={{position: "relative", top: "45%", height: "0px"}}>
            <div className="text-center">
                <Spinner animation="border" className='bootstrapSpinner' /> 
            </div>
        </div> 
        :
        null
        }
        <a key={index} href={"/thesis/" + id} style={{textDecoration: "none", color: "inherit", opacity: showStatus ? "0.25" : "1"}}>
            <div className='d-flex justify-content-between m-3'>
                <img className="img-responsive" src={previewImage} alt={thesisName} style={{width: "29%", borderRadius: "7px", height: "80% "}}></img>
                <div className='d-flex row justify-content-between ps-5'>
                    <p className=" fs-6 text-capitalize tezBaslikUser" style={{fontWeight: "700"}}>{thesisTitle}</p>
                    <div className='row'>
                        <div className='col-12'>
                            <p className='baslik mb-0 text-truncate'>Danışman</p>
                            <p className=" pt-1 fs-6 bold text-capitalize mt-0">{thesisAdvisor}</p>
                        </div>
                        
                    </div>
                    <div className='row'>
                        <div className='col-4'>
                        <p className='baslik mb-0'>Dili</p>
                            <p className='text-capitalize text-truncate'>{thesisLanguage}</p>
                        </div>
                        <div className='col-4 px-0'>
                            <p className='baslik mb-0'>Tez Tipi</p>
                            <p className=" fs-6 text-capitalize text-truncate">{thesisType}</p>
                        </div>
                        <div className='col-4'>
                            <p className='baslik mb-0'>Yazılma Yılı</p>
                            <p className=" pt-1 fs-6 bold text-capitalize mt-0 text-truncate">{thesisWrittenYear}</p>
                        </div>
                    </div>
                    <div className='row' style={{zIndex: "1"}}>
                        <div className='col-6'>
                            <span style={{fontSize: "10px"}} className=' mt-1'>{thesisUploadDate}</span>
                        </div>
                        <div className='col-3'>
                        <button className="btn" onClick={(e) => {editThesis(e, id)}}><i className="fa fa-pencil-square-o" aria-hidden="true"></i></button>
                        </div>
                        <div className='col-3'>
                        <button className="btn" onClick={(e) => {deleteThesis(e, id, index)}}><i className="fa fa-trash-o" aria-hidden="true"></i></button>
                        </div>
                    </div>
                </div>
            </div>
        </a>
    </div>
    )
}
