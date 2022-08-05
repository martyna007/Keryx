import React, { Component } from 'react'
import PropTypes from 'prop-types'

class ChatInput extends Component {
  static propTypes = {
    onSubmitMessage: PropTypes.func.isRequired,
  }
  state = {
    message: '',
  }

  render() {
    return (
      <form
        className="customForm"
        action="."
        required
        onSubmit={e => {
          e.preventDefault()
          this.props.onSubmitMessage(this.state.message)
          this.setState({ message: '' })
        }}
      >
        <input
          className="customInput"
          type="text"
          placeholder={'Enter message...'}
          value={this.state.message}
          required
          autoFocus
          onChange={e => this.setState({ message: e.target.value })}
        />
        <input className="customButton" type="submit" value={'Send'} />
      </form>
    )
  }
}

export default ChatInput