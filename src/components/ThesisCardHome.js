import React from 'react'

export default function ThesisCard(props) {
    const { index, id, previewImage, thesisName, thesisTitle, thesisUploadDate, children, author, thesisType, thesisUniversity } = props

    return (
    <div className="thesisCardHome col-5 mx-2 my-2" key={index} id={index}>
        <a key={index} href={"/thesis/" + id} style={{textDecoration: "none", color: "inherit", height: "100%", width: "100%"}}>
            <div className='d-flex justify-content-between m-3'>
                <img className="img-responsive" src={previewImage} alt={thesisName} style={{width: "29%", borderRadius: "7px"}}></img>
                <div className='d-flex row justify-content-between ps-5'>
                    <p className=" fs-6 text-uppercase tezBaslik" style={{fontWeight: "700"}}>{thesisTitle}</p>
                    <p className='baslik mb-0'>Üniversite</p>
                    <p className=" pt-1 fs-6 bold text-capitalize mt-0" style={{whiteSpace: "nowrap"}}>{thesisUniversity}</p>
                    
                    
                    <div className='row'>
                        <div className='col-8'>
                        <p className='baslik mb-0'>Yazar</p>
                            <p className='text-capitalize' style={{whiteSpace: "nowrap"}}>{author}</p>
                        </div>
                        <div className='col-4 px-0'>
                            <p className='baslik mb-0'>Tez Tipi</p>
                            <p className=" fs-6 text-capitalize" style={{whiteSpace: "nowrap"}}>{thesisType}</p>
                            
                        </div>
                    </div>
                    <span style={{fontSize: "10px", whiteSpace: "nowrap"}} className=' mt-1' >{thesisUploadDate}</span>
                </div>
            </div>
        </a>
        {children}
    </div>
    )
}
