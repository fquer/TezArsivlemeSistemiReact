import React from 'react'

export default function ThesisCard(props) {
    const { index, id, previewImage, thesisName, thesisTitle, thesisTopic, children } = props
    return (
    <div className="thesisCard card col m-4 justify-content-between gx-0" key={index} id={index} style={{backgroundColor: "#F2F5F8", overflow: "hidden"}}>
        <a key={index} href={"/thesis/" + id} style={{textDecoration: "none", color: "inherit", height: "78%"}}>

            <img className="thesisPreview img-responsive" src={previewImage} alt={thesisName}></img>
            <div className="card-body pl-3 pr-3 pt-1 pb-0">
                <h5 className="card-title">{thesisTitle}</h5>
                <p className="card-text">{thesisTopic}</p>
            </div>

        </a>
        {children}
    </div>
    )
}
