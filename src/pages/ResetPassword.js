import React, { useState } from 'react'
import axios from 'axios'
import { Spinner } from 'react-bootstrap';

export default function ResetPassword() {
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccessful, setIsSuccessful] = useState(false);

    const onSumbit = async (e) => {
        e.preventDefault()
        console.log("Nasilsi")
        setIsLoading(true)
        axios.get('/user/resetPassword?email=' + document.getElementById('email').value)
        .then((response) => {
            if (response.status === 200) {
                console.log("sifre sifirlandi")
                setIsSuccessful(true)
                document.getElementById('responseText').innerText = "Şifre sıfırlama bilgileri e-mail adresinize gönderildi."
            }
            setIsLoading(false)
        })
        .catch((err) => {
            if (err.response.status === 403) {
                console.log("kullanici bulunamadi")
                document.getElementById('responseText').innerText = "Bu e-mail'e ait kullanıcı bulunamadı!"
            }
            setIsSuccessful(false)
            setIsLoading(false)
        })
    }

  return (
    <div>
        {
            isLoading ?
            <div className="d-flex justify-content-center align-items-center" style={{position: "absolute",zIndex: "1", transform: "translate(-50%, -50%)", top: "50%", left: "50%", width: "90%", height: "90%"}}>
                <div className="text-center">
                    <Spinner animation="border" variant="primary" /> 
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
                            <div className='col-3'>
                                <button type="submit" className="btn btn-primary">Şifreyi sıfırla</button>
                            </div>
                            <div className='col mt-1'>
                                <p style={{color: isSuccessful ? "green": "red"}} id='responseText'></p>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
    )
}
