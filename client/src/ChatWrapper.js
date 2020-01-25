import React from 'react';
import Chat from './Chat';
import ChatInput from './ChatInput';
import ChatMessage from './ChatMessage';

const url = 'ws://localhost:8443/chat'

class ChatWrapper extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            clientConnected: false,
            logged: false,
            messages: []
        };
    }

    onMessageReceive = (msg, headers) => {
        let msgObj = {
            username: headers.user,
            message: msg,
            time: new Date().toLocaleString()
        }
        this.setState(prevState => ({
            messages: [...prevState.messages, msgObj]
        }));
    }

    sendMessage = (selfMsg) => {
        try {
            this.clientRef.sendMessage('/topic/public', JSON.stringify(selfMsg), { user: this.state.username });
            return true;
        } catch (e) {
            return false;
        }
    }
    // old code
    // submitMessage = messageString => {
    //     const message = { name: this.state.name, message: messageString }
    //     this.client.publish({ destination: '/topic/public', body: messageString })
    //     this.addMessage(message)
    // }

    submitName = nameString => {
        this.setState({
            logged: true
        });
    }

    render() {
        if (!this.state.logged) {
            return (
                <div className="chatContainer">
                <div className="chatBody"></div>
                    <form
                        className="customForm"
                        action="."
                        required
                        onSubmit={e => {
                            e.preventDefault()
                            this.submitName()
                        }}>
                        <input
                            className="customInput"
                            type="text"
                            placeholder={'What is your name?'}
                            value={this.state.username}
                            required
                            autoFocus
                            onChange={e => this.setState({ username: e.target.value })}
                        />
                        <input className="customButton" type="submit" value={'Login'} />
                    </form>
                </div>
            )
        } else {
            return (
                <div className="chatContainer">
                    <div className="chatBody">
                        {/* <h4>{this.state.username}</h4> */}
                        {this.state.messages.map((msg, index) =>
                            <ChatMessage
                                key={index}
                                message={msg.message}
                                name={msg.username}
                                time={msg.time}
                                owner={msg.username === this.state.username ? true : false}
                            />
                        )}
                    </div>

                    <ChatInput
                        onSubmitMessage={messageString => this.sendMessage(messageString)}
                    />
                    <Chat url={url} topics={['/topic/public', '/topic/blah']}
                        onMessage={this.onMessageReceive} ref={(client) => { this.clientRef = client }}
                        onConnect={() => { this.setState({ clientConnected: true }) }}
                        onDisconnect={() => { this.setState({ clientConnected: false }) }} />
                </div>
            );
        }
    }
}

export default ChatWrapper