import axios from 'axios';
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

export default function Register() {
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordsMatch, setPasswordsMatch] = useState(false);
    const [showStatus, setShowStatus] = useState(false);
    const [statusMessage, setStatusMessage] = useState("Kayıt Başarılı!");
    const [user, setUser] = useState({
        userName: "",
        userSurname: "",
        userMail: "",
        userPassword: ""
    })

    const { userName, userSurname, userMail, userPassword } = user

    useEffect(() => {
        setPasswordsMatch(user.userPassword === confirmPassword);
      }, [user.userPassword, confirmPassword]);

    const onInputChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value })
    }

    const navigate = useNavigate();
    const onSumbit = async (e) => {
        e.preventDefault();
        if (passwordsMatch) {
            await axios.post("/user/add", user)
            .then( (response) => {
                if (response.status === 201) {
                    document.getElementById("registerContainer").style.opacity = "0.25"
                    setStatusMessage("Kayıt Başarılı!")
                    setShowStatus(true)
                    setTimeout(() => {
                        navigate('/login');
                    }, 1000)
                }
                else {
                    alert('Kullanici olusturulamadi!')
                }
            }
            ).catch( (err) => {
                if (err.response.status === 409) {
                    setStatusMessage("Bu e-mail adresi zaten kullanılıyor!")
                }
                else {
                    setStatusMessage('Kullanici olusturulamadi!')
                }

                document.getElementById("registerContainer").style.opacity = "0.25"
                setShowStatus(true)
                setTimeout(() => {
                    setShowStatus(false)
                    document.getElementById("registerContainer").style.opacity = "1"
                }, 2500)
            })
        }
        else {
            alert('Parolalar eşleşmiyor.')
        }
    }

    return (
        <div className="container">
            {
                showStatus ?
                <div className="d-flex justify-content-center align-items-center" style={{position: "absolute",zIndex: "1", transform: "translate(-50%, -50%)", top: "50%", left: "50%", width: "90%", height: "90%"}}>
                    <div className="text-center">
                        {statusMessage === "Kayıt Başarılı!" ? <i className="fa fa-check-circle-o fa-5x" aria-hidden="true"></i> : <i className="fa fa-times-circle fa-5x" aria-hidden="true"></i>}
                        <h1>{statusMessage}</h1>
                    </div>
                </div> 
                :
                null
            }
            <div id='registerContainer' className="row">
                <div className="col-md-6 mx-auto">
                    <div className='mb-5 mt-5'>
                        <h1 className='text-center'>Tezlerini özgürce yayınla!</h1>
                    </div>
                    <form onSubmit={(e) => onSumbit(e)}>
                        <div className='row gx-3'>
                            <div className="col mb-3">
                                <label htmlFor="name" className="form-label">Ad</label>
                                <input  required type={"text"} className="form-control" value={userName} name='userName' onChange={(e) => onInputChange(e)}/>
                            </div>
                            <div className="col mb-3">
                                <label htmlFor="surname" className="form-label">Soyad</label>
                                <input type="text" className="form-control" id="surname" value={userSurname} name='userSurname' onChange={(e) => onInputChange(e)}/>
                            </div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email adresi</label>
                            <input type="email" className="form-control" id="email" aria-describedby="emailHelp" value={userMail} name='userMail' onChange={(e) => onInputChange(e)}/>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Parola</label>
                            <input type="password" className="form-control" id="password" minLength="8" value={userPassword} name='userPassword' onChange={(e) => onInputChange(e)}/>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="passwordAgain" className="form-label">Parola Yeniden</label>
                            <input type="password" className="form-control" id="passwordAgain" minLength="8" onChange={(e) => setConfirmPassword(e.target.value)}/>
                        </div>
                        <button type="submit" className="btn btn-primary">Kayıt Ol!</button>
                        <div className='mb-5 mt-5'>
                            <span>Zaten üye misin? <a style={{color: "rgb(102, 178, 255)", fontWeight: 'bold'}} href="/login">Giriş Yap!</a></span>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
