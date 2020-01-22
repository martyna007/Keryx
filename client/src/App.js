import React, { Component } from 'react'
import './App.css'
import ChatWrapper from './ChatWrapper'

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-container">
          <header className="App-header">
            <h1 className="App-title">keryx</h1>
          </header>
          <ChatWrapper />
        </div>
      </div>
    )
  }
}

export default App