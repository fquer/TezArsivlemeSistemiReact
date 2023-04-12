import axios from 'axios';
import React, { useState, useEffect } from 'react'


export default function Register() {
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordsMatch, setPasswordsMatch] = useState(false);
    const [user, setUser] = useState({
        userName: "",
        userSurname: "",
        userMail: "",
        userTypeId: "6435eca14a91c114ab19f92f",
        userPassword: ""
    })

    const { userName, userSurname, userMail, userPassword } = user

    useEffect(() => {
        setPasswordsMatch(user.userPassword === confirmPassword);
      }, [user.userPassword, confirmPassword]);

    const onInputChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value })
    }

    const onSumbit = async (e) => {
        e.preventDefault();
        if (passwordsMatch) {
            await axios.post("/user/add", user).then(
                function (response) {
                    console.log('response : ', response)
                    if (response.status === 201) {
                        // yonlendirme yap
                        console.log('user olusturuldu.')
                    }
                }
            )
        }
        else {
            alert('Parolalar eşleşmiyor.')
        }
    }

    return (
        <div className="container">
            <div className="row">
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
                            <input type="password" className="form-control" id="password" value={userPassword} name='userPassword' onChange={(e) => onInputChange(e)}/>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="passwordAgain" className="form-label">Parola Yeniden</label>
                            <input type="password" className="form-control" id="passwordAgain" onChange={(e) => setConfirmPassword(e.target.value)}/>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="whoUsing" className="form-label">Kim Kullanıyor ?</label>
                            <select className="form-select" id='whoUsing' name='userTypeId' onChange={(e) => onInputChange(e)}>
                                <option value={'6435eca14a91c114ab19f92f'}>Öğrenci</option>
                                <option value={'6435ed0c4a91c114ab19f930'}>Öğretim Üyesi</option>
                            </select>
                        </div>
                        <button type="submit" className="btn btn-primary">Kayıt Ol!</button>
                    </form>
                </div>
            </div>
        </div>
    )
}
