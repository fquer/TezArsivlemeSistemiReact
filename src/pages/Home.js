import React from 'react'

export default function Home() {
  return (
    <div>{localStorage.getItem('userID')}</div>
  )
}
