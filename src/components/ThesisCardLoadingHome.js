import React from 'react'

export default function ThesisCardLoading(props) {
    const { cardCount } = props

    const loadingCards = []
    for(let i = 0; i < cardCount; i++){
        loadingCards.push(<div key={i} className="thesisCardHome thesisCardLoadingHome card col-5 mx-2 my-2" ></div>)
    }

  return (
    <div className="row d-flex justify-content-center">
        { loadingCards }
    </div>
  )
}
