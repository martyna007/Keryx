import React from 'react'

export default ({ name, message, time, owner }) =>
  <div className={"messageContainer "+ (owner ? "" : "leftSide")}>
    <div className="name"><strong>{name}</strong></div>
    <div className="body">
      <p>{message}</p>
      <div className="time">{time}</div>
    </div>
  </div>