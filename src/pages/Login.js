import axios from 'axios';
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

export default function Login(props) {
    const [showStatus, setShowStatus] = useState(false);
    const [statusMessage, setStatusMessage] = useState("");

    const [user, setUser] = useState({
        userMail: "",
        userPassword: ""
    })

    const { userMail, userPassword } = user

    const onInputChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value })
    }

    const navigate = useNavigate();

    useEffect(() => {
        const userID = localStorage.getItem('userID')
        if (userID !== "") {
            navigate('/');
        }
    }, [navigate])

    const onSumbit = async (e) => {
        e.preventDefault();
        await axios.post("/user/login", user).then(
            function (response) {
                if (response.status === 200) {
                    props.setIsLoggedIn(true)
                    localStorage.setItem('userID', response.data.id)
                }
            }
        ).catch((err) => {
            document.getElementById("loginContainer").style.opacity = "0.25"
            setShowStatus(true)
            setTimeout(() => {
                setShowStatus(false)
                document.getElementById("loginContainer").style.opacity = "1"
            }, 2500)

            if (err.response.status === 401) {
                setStatusMessage("E-mail adresi yada parola hatalı!")
            }
            else {
                setStatusMessage("Giris yapilamiyor!")
            }
        })
    }

    const resetPassword = async () => {
        navigate('/resetPassword');
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
            <div className="row" id='loginContainer'>
                <div className="col-md-6 mx-auto">
                    <div className='mb-5 mt-5'>
                        <h1 className='text-center'>Giriş Yap</h1>
                    </div>
                    <form onSubmit={(e) => onSumbit(e)}>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email adresi</label>
                            <input type="email" className="form-control" id="email" aria-describedby="emailHelp" value={userMail} name='userMail' onChange={(e) => onInputChange(e)}/>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Parola</label>
                            <input type="password" className="form-control" id="password" value={userPassword} name='userPassword' onChange={(e) => onInputChange(e)}/>
                        </div>
                        <div className='row'>
                            <div className='col-3'>
                                <button type="submit" className="btn btn-primary">Giriş Yap</button>
                            </div>
                            <div className='col-3 mt-1'>
                                <a onClick={resetPassword} style={{color: "rgb(102, 178, 255)", fontWeight: 'bold'}} href='#'>Şifremi Unuttum</a>
                            </div>
                        </div>
                        
                        <div className='mb-5 mt-5'>
                            <span>Üyeliğin yok mu ? <a style={{color: "rgb(102, 178, 255)", fontWeight: 'bold'}} href="/register">Üye Ol!</a></span>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
