import React from 'react'
import { Spinner } from 'react-bootstrap'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

export default function ThesisCardTools(props) {

    const { index, id } = props
    const navigate = useNavigate();

    const deleteThesis = async (thesisId, index) => {
        document.getElementById(index + "Loading").style.display = "block";
        const response = await axios.delete("/thesis/" + thesisId)
        console.log(response)
        if (response.status === 200) {
            document.getElementById(index).remove();
        }
        else {
            alert("tez silinemedi!")
        }
    }
    
    const editThesis = async (id) => {
        navigate("/thesis/edit/" + id)
    }

    return (
    <div style={{height: "35px"}} className="d-flex">
        <div className="me-auto mt-2">
            <Spinner id={index + "Loading"} animation="border" className='bootstrapSpinner' style={{display: "none", width: "20px", height: "20px", marginLeft: "10px"}} /> 
        </div>
        <div className="">
            <button className="btn" onClick={() => {editThesis(id)}}><i className="fa fa-pencil-square-o" aria-hidden="true"></i></button>
        </div>
        <div className="">
            <button className="btn" onClick={() => {deleteThesis(id, index)}}><i className="fa fa-trash-o" aria-hidden="true"></i></button>
        </div>
    </div>
    )
}
