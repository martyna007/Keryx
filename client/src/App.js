import React, { Component } from 'react'
import './App.css'
import logo from './logo-keryx.png'
import ChatWrapper from './ChatWrapper'

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-container">
          <header className="App-header" style={{ backgroundImage: `url(${logo})` }}>
            {/* <img src={logo} alt={"logo keryx"}/> */}
          </header>
          <ChatWrapper />
        </div>
      </div>
    )
  }
}

export default App