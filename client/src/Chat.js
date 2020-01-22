import React from 'react';
import PropTypes from 'prop-types';
import { Client } from '@stomp/stompjs';

class Chat extends React.Component {
  static defaultProps = {
    onConnect: () => { },
    onDisconnect: () => { },
    getRetryInterval: (count) => { return 1000 * count },
    options: {},
    headers: {},
    subscribeHeaders: {},
    autoReconnect: true,
    debug: false,
    heartbeat: 10000
  }

  static propTypes = {
    url: PropTypes.string.isRequired,
    /**
     * Additional options to pass to the underlying SockJS constructor.
     *
     * @see [SockJS-options](https://github.com/sockjs/sockjs-client#sockjs-client-api)
     */
    options: PropTypes.object,
    topics: PropTypes.array.isRequired,
    onConnect: PropTypes.func,
    onDisconnect: PropTypes.func,
    /**
     * Gets called to find the time interval for next retry. Defaults to a function returing retryCount seconds.
     *
     * @param {number} retryCount number of retries for the current disconnect
     */
    getRetryInterval: PropTypes.func,
    /**
     * Callback when a message is recieved.
     *
     * @param {(string|Object)} msg message received from server, if JSON format then object
     * @param {string} topic the topic on which the message was received
     */
    onMessage: PropTypes.func.isRequired,
    headers: PropTypes.object,
    subscribeHeaders: PropTypes.object,
    autoReconnect: PropTypes.bool,
    heartbeat: PropTypes.number,
    heartbeatIncoming: PropTypes.number,
    heartbeatOutgoing: PropTypes.number,
    onConnectFailure: PropTypes.func
  }


  constructor(props) {
    super(props)

    this.state = {
      connected: false,
      explicitDisconnect: false
    }

    this.subscriptions = [];
    this.retryCount = 0
  }

  //   componentDidMount() {
  //     // this.client = new Client();

  //     // this.client.configure({
  //     //   brokerURL: 'ws://localhost:8443/chat',
  //     //   onConnect: () => {
  //     //     console.log('onConnect');

  //     //     this.client.subscribe('/topic/public', message => {
  //     //       console.log(message);
  //     //     });

  //     //     this.client.subscribe('/topic/greetings', message => {
  //     //       alert(message);
  //     //     });
  //     //   },
  //     //   // Helps during debugging, remove in production
  //     //   debug: (str) => {
  //     //     console.log(str);
  //     //   }
  //     // });

  //     // this.client.activate();
  //     console.log(this.props);
  //   }

  //   onMessage = (msg, topic) => {
  //     this.setState(prevState => ({
  //       messages: [...prevState.messages, msg]
  //     }));
  //   }

  //   sendMessage = (msg, selfMsg) => {
  //     try {
  //       this.client.onSendMessage("/app/all", JSON.stringify(selfMsg));
  //       return true;
  //     } catch(e) {
  //       return false;
  //     }
  //   }

  //   submitName = nameString => {
  //     this.setState({
  //       logged: true
  //     });


  //     this.client.connectHeaders = { login: this.state.name, passcode: 'passcode' };

  //     this.client.onConnect = function (frame) {
  //       console.log('connected', frame);
  //       // Do something, all subscribes must be done is this callback
  //       // This is needed because this will be executed after a (re)connect
  //       let idRandom = Math.random();
  //       console.log(idRandom);
  //       var subscription = this.client.subscribe('/topic/public', this.addMessage, { id: idRandom });
  //       console.log(this.client);
  //     };

  //     this.client.onStompError = function (frame) {
  //       // Will be invoked in case of error encountered at Broker
  //       // Bad login/passcode typically will cause an error
  //       // Complaint brokers will set `message` header with a brief message. Body may contain details.
  //       // Compliant brokers will terminate the connection after any error
  //       console.log('Broker reported error: ' + frame.headers['message']);
  //       console.log('Additional details: ' + frame.body);
  //     };

  //     this.client.activate();

  //     console.log(this.client);

  //   }
  //   addMessage = message => {
  //     this.setState(prevState => ({
  //       messages: [...prevState.messages, message]
  //     }))
  //     console.log(message);
  //   }
  //   submitMessage = messageString => {
  //     const message = { name: this.state.name, message: messageString }
  //     this.client.publish({ destination: '/topic/public', body: messageString })
  //     this.addMessage(message)
  //   }
  //   exitChat = () => {
  //     this.client.deactivate();
  //   }

  //   render() {
  //     if (this.state.logged) {
  //       return (
  //         <div>
  //           <h4>{this.state.name}</h4>
  //           {this.state.messages.map((message, index) =>
  //             <ChatMessage
  //               key={index}
  //               message={message.message}
  //               name={message.name}
  //             />
  //           )}
  //           <ChatInput
  //             onSubmitMessage={messageString => this.submitMessage(messageString)}
  //           />
  //         </div>
  //       )
  //     } else {
  //       return (
  //         <form
  //           action="."
  //           required
  //           onSubmit={e => {
  //             e.preventDefault()
  //             this.submitName()
  //           }}
  //         >
  //           <input
  //             type="text"
  //             placeholder={'What is your name?'}
  //             value={this.state.name}
  //             required
  //             autoFocus
  //             onChange={e => this.setState({ name: e.target.value })}
  //           />
  //           <input type="submit" value={'Login'} />
  //         </form>
  //       )
  //     }
  //   }
  // }

  componentDidMount() {
    this.connectToServer()
  }

  componentWillUnmount() {
    this.disconnect()
  }

  shouldComponentUpdate(nextProps, nextState) {
    return false
  }

  componentDidUpdate(nextProps) {
    if (this.state.connected) {
      // Subscribe to new topics
      // difference(nextProps.topics, this.props.topics)
      //   .forEach((newTopic) => {
      //     this.subscribeTopic(newTopic)
      //   })

      // // Unsubscribe from old topics
      // difference(this.props.topics, nextProps.topics)
      //   .forEach((oldTopic) => {
      //     this.unsubscribeFromTopic(oldTopic)
      //   })
    }
  }

  render() {
    return null
  }

  initStompClient = () => {
    // Websocket held by stompjs can be opened only once
    //this.client = Stomp.over(new SockJS(this.props.url, null, this.props.options))
    this.client = new Client();
    
      this.client.configure({
        brokerURL: this.props.url
      });

      this.client.activate();
      console.log(this.client);
      console.log(this.props);

    this.client.heartbeatOutgoing = this.props.heartbeat
    this.client.heartbeatIncoming = this.props.heartbeat

    if (Object.keys(this.props).includes('heartbeatIncoming')) {
      this.client.heartbeatIncoming = this.props.heartbeatIncoming
    }
    if (Object.keys(this.props).includes('heartbeatOutgoing')) {
      this.client.heartbeatOutgoing = this.props.heartbeatOutgoing
    }
  }

  cleanUp = () => {
    this.setState({ connected: false })
    this.retryCount = 0
    this.subscriptions.clear()
  }

  subscribeTopic = (topic) => {
    if (!this.subscriptions.has(topic)) {
      let sub = this.client.subscribe(topic, (msg) => {
        this.props.onMessage(this.processMessage(msg.body), msg.headers.destination)
      }, this.props.subscribeHeaders)
      this.subscriptions.set(topic, sub)
    }
  }

  processMessage = (msgBody) => {
    try {
      return JSON.parse(msgBody)
    } catch (e) {
      return msgBody
    }
  }

  unsubscribeFromTopic = (topic) => {
    let sub = this.subscriptions.get(topic)
    sub.unsubscribe()
    this.subscriptions.delete(topic)
  }

  connectToServer = () => {
    this.initStompClient()
    this.client.onConnect(this.props.headers, () => {
      this.setState({ connected: true })
      this.props.topics.forEach((topic) => {
        this.subscribeTopic(topic)
      })
      this.props.onConnect()
    }, (error) => {
      if (error) {
        if (Object.keys(this.props).includes('onConnectFailure')) {
          this.props.onConnectFailure(error)
        } else {
          console.log(error.stack)
        }
      }
      if (this.state.connected) {
        this.cleanUp()
        // onDisconnect should be called only once per connect
        this.props.onDisconnect()
      }
      if (this.props.autoReconnect && !this.state.explicitDisconnect) {
        this.timeoutId = setTimeout(this.connectToServer, this.props.getRetryInterval(this.retryCount++))
      }
    })
  }

  /**
   * Connect to the server if not connected. Under normal circumstances component
   * will automatically try to connect to server. This method is mostly useful
   * after component is explicitly disconnected via {@link SockJsClient#disconnect}.
   *
   * @public
   */
  connect = () => {
    this.setState({ explicitDisconnect: false })
    if (!this.state.connected) {
      this.connectToServer()
    }
  }

  /**
   * Disconnect STOMP client and disable all reconnect.
   *
   * @public
   */
  disconnect = () => {
    // On calling disconnect explicitly no effort will be made to reconnect
    // Clear timeoutId in case the component is trying to reconnect
    if (this.timeoutId) {
      clearTimeout(this.timeoutId)
      this.timeoutId = null
    }
    this.setState({ explicitDisconnect: true })
    if (this.state.connected) {
      this.subscriptions.forEach((subid, topic) => {
        this.unsubscribeFromTopic(topic)
      })
      this.client.disconnect(() => {
        this.cleanUp()
        this.props.onDisconnect()
      })
    }
  }

  /**
   * Send message to the specified topic.
   *
   * @param {string} topic target topic to send message
   * @param {string} msg message to send
   * @param {Object} [opt_headers={}] additional headers for underlying STOMP client
   * @public
   */
  sendMessage = (topic, msg, opt_headers = {}) => {
    if (this.state.connected) {
      this.client.publish(topic, opt_headers, msg)
    } else {
      throw new Error('Send error: Chat is disconnected')
    }
  }
}

export default Chat