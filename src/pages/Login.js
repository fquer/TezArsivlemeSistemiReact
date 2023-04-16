import axios from 'axios';
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

export default function Login(props) {
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
        console.log(userID)
        if (userID !== "") {
            navigate('/');
        }
    }, [navigate])

    const onSumbit = async (e) => {
        e.preventDefault();
        await axios.post("/user/login", user).then(
            function (response) {
                console.log('response : ', response)
                if (response.status === 200) {
                    // yonlendirme yap
                    console.log('login olundu.')
                    console.log(response.data)
                    console.log('loginsss ', props)
                    props.setIsLoggedIn(true)
                    localStorage.setItem('userID', response.data.id)
                    //navigate('/');
                }
            }
        )
    }

    return (
        <div className="container">
            <div className="row">
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
                        <button type="submit" className="btn btn-primary">Giriş Yap</button>
                        <div className='mb-5 mt-5'>
                            <span>Üyeliğin yok mu ? <a href="/register">Üye Ol!</a></span>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
