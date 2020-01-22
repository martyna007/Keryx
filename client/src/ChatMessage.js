import React from 'react'

export default ({ name, message }) =>
  <div className="messageContainer">
    <p><strong>{name}</strong> {message}</p>
  </div>