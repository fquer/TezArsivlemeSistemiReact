import React, { useEffect, useState } from 'react'
import '../css/navbar-style.css'

export default function Navbar(props) {

  const [userID, setUserID] = useState("")
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    setUserID(localStorage.getItem('userID'))
    setIsLoggedIn(props.isLoggedIn)
  })

  function addProfileNavbar() {
    if (userID !== "" && isLoggedIn === true) {
      return (
        <ul className="dropdown-menu dropdown-menu-lg-start" style={{right: "0", left: "auto", backgroundColor: "#415A77"}}>
          <li><a className="dropdown-item" href="/profile/settings">Hesap Ayarları</a></li>
          <li><a className="dropdown-item" href="/logout">Oturumu Sonlandır</a></li>
        </ul>
      )
    }
    else {
      return (
        <ul className="dropdown-menu dropdown-menu-lg-start" style={{right: "0", left: "auto", backgroundColor: "#415A77"}}>
          <li><a className="dropdown-item" href="/login">Giriş Yap</a></li>
        </ul>
      )
    }
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-light fixed-top mb-3" style={{backgroundColor: "#415A77"}}>
      <a className="navbar-brand" style={{marginLeft: "10px"}} href="/">Tez Arşivleme Sistemi</a>
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item">
            <a className="nav-link" href="/thesis/upload"><i className="fa fa-upload" aria-hidden="true"></i> Tez Yükle</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/thesis/mytheses"><i className="fa fa-bookmark" aria-hidden="true"></i> Tezlerim </a>
          </li>
        </ul>
        <div className="dropdown" style={{marginLeft: "auto", marginRight: "10px"}}>
          <a href="#" className="nav-link dropdown-toggle" data-toggle="dropdown"><i className="fa fa-user" aria-hidden="true"></i> Profilim</a>
          {addProfileNavbar()}
        </div>
      </div>
    </nav>
  )
}
