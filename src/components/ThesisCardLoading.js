import React from 'react'

export default function ThesisCardLoading(props) {
    const { hasButtons, cardCount } = props
    let cardStyle = null;
    if (hasButtons) {
        cardStyle = {
            width: "15rem",
            height: "17rem"
        }
    }
    else {
        cardStyle = {
            width: "13rem",
            height: "15rem"
        }
    }

    const loadingCards = []
    for(let i = 0; i < cardCount; i++){
        loadingCards.push(<div key={i} className="thesisCard thesisCardLoading card col m-4 justify-content-between gx-0" style={cardStyle}></div>)
    }

  return (
    <div className={hasButtons ? "row row-cols-2 row-cols-lg-5 g-2 g-lg-3 mt-3 p-3" : "row"}>
        { loadingCards }
    </div>
  )
}
