var url = "ws://localhost:8443/chat";
var client = Stomp.client(url);

var headers = {
      login: 'Martyna',
      passcode: 'mypasscode'
    };

    var error_callback = function(error) {
      // display the error's message header:
      console.log(error.headers.message);
      console.log('error');
    };

      var connect_callback = function(res) {
      console.log('connected?', res);
        // called back after the client is connected and authenticated to the STOMP server
      };

      client.connect(headers, connect_callback, error_callback);
//var myWebSocket;
//    function connectToWS() {
//
//        url = "ws://localhost:8443/chat";
//        client = Stomp.client(url);
//
//
//        username = {
//            username: 'Mike',
//        };
//
//
//    if(username) {
//        client.connect(username, onConnected)
//    }
//}
//
//function onCon() {
//            console.log("Connection with " + url + " estabilished")
//            // client.subscribe('/v1/topic/public', onMessageReceived());
//            client.subscribe('/topic/public', onMessageReceived);
//
//            console.log("Subscribed!")
//}
//
//function onConnected() {
//    // client.subscribe('/v1/topic/public', onMessageReceived);
//    onCon();
//    client.send("/app/v1/addUser",
//        {},
//        JSON.stringify({author: "Steve", text: "Lorem", type: 'JOIN'})
//    )
//}
//
//function sendMessage() {
//
//
//    client.send("/app/v1/sendMessage",
//        {},
//        JSON.stringify({author: "Steve", text: "Lorem", type: 'CHAT'})
//    )
//}
//
//function onMessageReceived(payload) {
//    console.log(payload)
//    console.log(JSON.parse(payload.body))
//    var message = JSON.parse(payload.body);
//
//    console.log(message)
//
//    if(message.type === 'JOIN') {
//        message.content = message.sender + ' joined!';
//    } else if (message.type === 'LEAVE') {
//        message.content = message.sender + ' left!';
//    } else {
//        message.connect = "Lorem"
//    }
//    console.log(message);
//}
