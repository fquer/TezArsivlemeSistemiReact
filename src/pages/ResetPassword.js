import React, { useState } from 'react'
import axios from 'axios'
import { Spinner } from 'react-bootstrap';

export default function ResetPassword() {
    const [isLoading, setIsLoading] = useState(false);

    const onSumbit = async (e) => {
        e.preventDefault()
        const responseText = document.getElementById('responseText')
        setIsLoading(true)
        axios.get('/user/resetPassword?email=' + document.getElementById('email').value)
        .then((response) => {
            if (response.status === 200) {
                console.log("sifre sifirlandi")
                responseText.innerText = "Şifre sıfırlama bilgileri e-mail adresinize gönderildi."
                responseText.style.setProperty("color", "green", "important")
            }
            setIsLoading(false)
        })
        .catch((err) => {
            if (err.response.status === 403) {
                console.log("kullanici bulunamadi")
                responseText.innerText = "Bu e-mail'e ait kullanıcı bulunamadı!"
                responseText.style.setProperty("color", "red", "important")
            }
            setIsLoading(false)
        })
    }

  return (
    <div>
        {
            isLoading ?
            <div className="d-flex justify-content-center align-items-center" style={{position: "absolute",zIndex: "1", transform: "translate(-50%, -50%)", top: "50%", left: "50%", width: "90%", height: "90%"}}>
                <div className="text-center">
                    <Spinner animation="border" className='bootstrapSpinner' /> 
                </div>
            </div> 
            
            :
            null
        }
        <div className="container" style={{opacity: isLoading ? "0.25" : "1"}}>
            <div className="row">
                <div className="col-md-6 mx-auto">
                    <div className='mb-5 mt-5'>
                        <h1 className='text-center'>Şifremi Unuttum</h1>
                    </div>
                    <form onSubmit={(e) => onSumbit(e)}>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email adresi</label>
                            <input type="email" className="form-control" id="email" aria-describedby="emailHelp" name='userMail'/>
                        </div>
                        <div className='row'>
                            <div className='col-4'>
                                <button type="submit" className="btn btn-primary">Sıfırlama Maili Gönder</button>
                            </div>
                            <div className='col mt-1'>
                                <p id='responseText'></p>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
    )
}
