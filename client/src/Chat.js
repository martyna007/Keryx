import React from 'react';
import PropTypes from 'prop-types';
import { Client } from '@stomp/stompjs';

class Chat extends React.Component {
  static defaultProps = {
    onConnect: () => { },
    onDisconnect: () => { },
    headers: {},
    subscribeHeaders: {},
    autoReconnect: true,
    heartbeat: 10000
  }

  static propTypes = {
    url: PropTypes.string.isRequired,
    topics: PropTypes.array.isRequired,
    onConnect: PropTypes.func,
    onDisconnect: PropTypes.func,
    /**
     * Callback when a message is received.
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
  }

  componentDidMount() {
    this.connectToServer()
  }

  componentWillUnmount() {
    this.disconnect()
  }

  shouldComponentUpdate(nextProps, nextState) {
    return false
  }
  //delete or add new feature
  // componentDidUpdate(nextProps) {
  //   if (this.state.connected) {
  //     // Subscribe to new topics
  //     // difference(nextProps.topics, this.props.topics)
  //     //   .forEach((newTopic) => {
  //     //     this.subscribeTopic(newTopic)
  //     //   })

  //     // // Unsubscribe from old topics
  //     // difference(this.props.topics, nextProps.topics)
  //     //   .forEach((oldTopic) => {
  //     //     this.unsubscribeFromTopic(oldTopic)
  //     //   })
  //   }
  // }

  initStompClient = () => {
    // Websocket held by stompjs can be opened only once
    this.client = new Client();

    this.client.configure({
      brokerURL: this.props.url
    });

    this.client.activate();

    this.client.heartbeatIncoming = this.props.heartbeat
    this.client.heartbeatOutgoing = this.props.heartbeat

    if (Object.keys(this.props).includes('heartbeatIncoming')) {
      this.client.heartbeatIncoming = this.props.heartbeatIncoming
    }
    if (Object.keys(this.props).includes('heartbeatOutgoing')) {
      this.client.heartbeatOutgoing = this.props.heartbeatOutgoing
    }
  }

  cleanUp = () => {
    this.setState({ connected: false })
    this.subscriptions.clear()
  }

  subscribeTopic = (topic) => {
    if (!this.subscriptions.includes(topic)) {
      // eslint-disable-next-line
      let sub = this.client.subscribe(topic, (msg) => {
        this.props.onMessage(this.processMessage(msg.body), msg.headers)
      }, this.props.subscribeHeaders)
      //todo adding new topic
      //console.log(topic, sub);
      //this.subscriptions.set(topic, sub)
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
  connectCallBack(frame) {
    this.setState({ connected: true })
  }
  errorCallback(error) {
    //todo error handling
  }

  connectToServer = () => {
    this.initStompClient()
    this.client.onConnect = (frame) => {

      this.setState({ connected: true })
      this.props.topics.forEach((topic) => {
        this.subscribeTopic(topic)
      })
      this.props.onConnect();
    };

    this.client.onStompError = (frame) => {
      //error handling
      if (Object.keys(frame.body).includes('onConnectFailure')) {
        this.props.onConnectFailure(frame.headers['message'])
      } else {
        //console.log(frame)
      }
    };
    if (this.state.connected) {
      this.cleanUp()
      // onDisconnect should be called only once per connect
      this.props.onDisconnect()
    }
    if (this.props.autoReconnect && !this.state.explicitDisconnect) {
      //retry?
    }
  }

  connect = () => {
    this.setState({ explicitDisconnect: false })
    if (!this.state.connected) {
      this.connectToServer()
    }
  }

  disconnect = () => {
    // On calling disconnect explicitly no effort will be made to reconnect
    this.setState({ explicitDisconnect: true })
    if (this.state.connected) {
      this.subscriptions.forEach((subid, topic) => {
        this.unsubscribeFromTopic(topic)
      })
      this.client.deactivate(() => {
        this.cleanUp()
        this.props.onDisconnect()
      })
    }
  }

  sendMessage = (topic, msg, opt_headers = {}) => {
    if (this.state.connected) {
      this.client.publish({ destination: topic, headers: opt_headers, body: msg })
    } else {
      throw new Error('Send error: Chat is disconnected')
    }
  }
  
  render() {
    return null
  }
}

export default Chat