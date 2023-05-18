import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Spinner } from 'react-bootstrap';

export default function ResetPasswordSubmit() {
    const [isSuccessful, setIsSuccessful] = useState(false);
    const [passwordObj, setPasswordObj] = useState({
        password: "",
        passwordAgain: ""
    })

    const { password, passwordAgain } = passwordObj

    const { id } = useParams();
    const isMountedRef = useRef(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isCanSeePage, setIsCanSeePage] = useState(false);
    useEffect(() => {
        if (!isMountedRef.current) {
            axios.get("/user/resetPasswordCheckToken?token=" + id)
            .then((response) => {
                if (response.status == 200) {
                    setIsCanSeePage(true)
                }
                setIsLoading(false)
            })
            .catch((err) => {
                console.log(err)
                setIsLoading(false)
            })
            isMountedRef.current = true; 
        }
    }, [])

    const onInputChange = (e) => {
        setPasswordObj({ ...passwordObj, [e.target.name]: e.target.value })
    }

    const onSumbit = (e) => {
        e.preventDefault();
        if (password === passwordAgain) {
            axios.get("/user/resetPasswordWithToken?token=" + id + "&newPassword=" + passwordObj.password).then(
                function (response) {
                    if (response.status === 200) {
                        setIsSuccessful(true)
                    }
                }
            ).catch((err) => {
                setIsSuccessful(false)
                if (err.response.status === 401) {
                    alert("Bu link artik gecersizdir!")
                }
                else {
                    alert("Bir hata olustu!")
                }
            })
        }
        else {
            alert("Parolalar uyuşmuyor!")
        }
    }

  return (
    
    <div className="container">
        {isLoading ?
        <div className="d-flex justify-content-center align-items-center" style={{height: "100vh"}}>
            <div className="text-center">
                <Spinner animation="border" className='bootstrapSpinner'/> 
            </div>
        </div>
        :
        <div>
            {isCanSeePage ?
            <div className="row">
                <div className="col-md-6 mx-auto">
                    <div className='mb-5 mt-5'>
                        <h1 className='text-center'>Şifre Sıfırlama</h1>
                    </div>
                    <form onSubmit={(e) => onSumbit(e)}>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Parola</label>
                            <input type="password" className="form-control" id="password" minLength="8" value={password} name='password' onChange={(e) => onInputChange(e)}/>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Parola Tekrar</label>
                            <input type="password" className="form-control" id="passwordAgain" minLength="8" value={passwordAgain} name='passwordAgain' onChange={(e) => onInputChange(e)}/>
                        </div>
                        <div className='row'>
                            <div className='col-3'>
                                <button type="submit" className="btn btn-primary">Onayla</button>
                            </div>
                            <div className='col mt-1'>
                                {isSuccessful ? <p className='successfulText'>Şifreniz başarıyla sıfırlandı!</p> : null}
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            :
            <div className="d-flex justify-content-center align-items-center" style={{position: "absolute",zIndex: "1", transform: "translate(-50%, -50%)", top: "50%", left: "50%", width: "90%", height: "90%"}}>
                <div className="text-center">
                    <i className="fa fa-times-circle fa-5x" aria-hidden="true"></i>
                    <h1>Bu bağlantı artık geçersizdir!</h1>
                </div>
            </div> 
            }
        </div>
        
        }
    </div>
  )
}
