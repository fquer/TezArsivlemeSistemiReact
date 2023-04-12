import React, { Component } from 'react'

export default class Navbar extends Component {
  render() {
    return (
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <a className="navbar-brand" style={{marginLeft: "10px"}} href="#">Tez Arşivleme Sistemi</a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item active">
              <a className="nav-link" href="#">Ana Sayfa</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Tez Yükle</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Tezlerim</a>
            </li>
          </ul>
          <ul className="navbar-nav" style={{marginLeft: "auto"}}>
            <li className="nav-item">
              <a className="nav-link" href="#">Profilim</a>
            </li>
          </ul>
        </div>
      </nav>
    )
  }
}
