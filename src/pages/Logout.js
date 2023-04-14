import React, { useEffect } from 'react'

export default function Logout(props) {

    useEffect(() => {
        console.log(props)
        props.setIsLoggedIn(false)
        localStorage.setItem('userID', "")
    })

    return (
    <div className="container">
        <div className="row">
            <div className="col-md-6 mx-auto">
                <div className='mb-5 mt-5 text-center'>
                    <h1 className=''>Oturum sonlandırıldı.</h1>
                </div>
                <div className='mb-5 mt-5 text-center'>
                    <span>Tezlerini yönetmek için tekrar <a href="/login">giriş yap.</a></span>
                </div>
            </div>
        </div>
    </div>
    )
}
