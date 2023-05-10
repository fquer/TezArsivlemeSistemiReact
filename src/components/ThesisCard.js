import React from 'react'

export default function ThesisCard(props) {
    const { index, id, previewImage, thesisName, thesisTitle, thesisTopic, thesisUploadDate, children } = props

    let previewHeight, cardWidth, cardHeight;
    if (children) {
        previewHeight = "92%"
        cardWidth = "15rem"
        cardHeight = "18rem"
    }
    else {
        previewHeight = "95%"
        cardWidth = "13rem"
        cardHeight = "15rem"
    }

    return (
    <div className="thesisCard card col m-4 justify-content-between gx-0" key={index} id={index} style={{backgroundColor: "#F2CC8F", overflow: "hidden", width: cardWidth, height: cardHeight}}>
        <a key={index} href={"/thesis/" + id} style={{textDecoration: "none", color: "inherit", height: "78%"}}>
            <div className='topic' style={{height: children ? "90%" : "100%"}}>
                <p className='topicText'>{thesisTopic}</p>
            </div>

            <img className="thesisPreview img-responsive" src={previewImage} alt={thesisName} style={{height: previewHeight}}></img>
            <div className="card-body pl-3 pr-3 pt-2 pb-0">
                <h5 className="card-title mb-0">{thesisTitle}</h5>
                <p style={{fontSize: "10px"}}>{thesisUploadDate}</p>
            </div>

        </a>
        {children}
    </div>
    )
}
