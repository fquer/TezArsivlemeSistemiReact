import React from 'react'

export default function ThesisLastCard(props) {
    const { id, index, previewImage, thesisName, thesisTitle, thesisTopic } = props
  return (
    <div className="card col-2 m-4 gx-0" key={index} id={index} style={{backgroundColor: "#F2CC8F", overflow: "hidden"}}>
        <a key={index} href={"/thesis/" + id} style={{textDecoration: "none", color: "inherit", height: "78%"}}>
            <div className='topic'>
                <p className='topicText'>{thesisTopic}</p>
            </div>

            <img className="img-responsive" src={previewImage} alt={thesisName} style={{height: "90%"}}></img>
            <div className="card-body pl-3 pr-3 pt-2 pb-0">
                <h5 className="card-title">{thesisTitle}</h5>
            </div>

        </a>
    </div>
  )
}
