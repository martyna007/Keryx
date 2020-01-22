import React, { Component } from 'react'
import logo from './logo.svg'
import './App.css'
import ChatWrapper from './ChatWrapper'

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="chat-logo" alt="logo" />
          <h1 className="App-title">Welcome to Keryx!</h1>
        </header>
        <ChatWrapper />
      </div>
    )
  }
}

export default App