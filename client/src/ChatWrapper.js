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

    onMessageReceive = (msg, topic) => {
        this.setState(prevState => ({
            messages: [...prevState.messages, msg]
        }));
    }

    sendMessage = (selfMsg) => {
        console.log(selfMsg);
        try {
            this.clientRef.sendMessage('/topic/public', JSON.stringify(selfMsg));
            return true;
        } catch (e) {
            return false;
        }
    }

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
                <form
                    action="."
                    required
                    onSubmit={e => {
                        e.preventDefault()
                        this.submitName()
                    }}>
                    <input
                        type="text"
                        placeholder={'What is your name?'}
                        value={this.state.username}
                        required
                        autoFocus
                        onChange={e => this.setState({ username: e.target.value })}
                    />
                    <input type="submit" value={'Login'} />
                </form>
            )
        } else {
            console.log(this.state.messages);
            return (
                <div>
                    {/* <TalkBox topic="react-websocket-template" currentUserId={ this.randomUserId }
                    currentUser={ this.randomUserName } messages={ this.state.messages }
                    onSendMessage={ this.sendMessage } connected={ this.state.clientConnected }/> */}
                    <h4>{this.state.username}</h4>
                    {this.state.messages.map((message, index) =>
                        <ChatMessage
                            key={index}
                            message={message}
                            name={message}
                        />
                    )}
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