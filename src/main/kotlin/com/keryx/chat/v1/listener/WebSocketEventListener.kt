package com.keryx.chat.v1.listener

import com.keryx.chat.v1.entity.Message
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.event.EventListener
import org.springframework.messaging.simp.SimpMessageSendingOperations
import org.springframework.messaging.simp.stomp.StompHeaderAccessor
import org.springframework.stereotype.Component
import org.springframework.web.socket.messaging.SessionDisconnectEvent

@Component
class WebSocketEventListener {
    private val logger = LoggerFactory.getLogger(WebSocketEventListener::class.java)

    @Autowired
    private val messagingTemplate: SimpMessageSendingOperations? = null

    @EventListener
    fun handleWebSocketDisconnectListener(event: SessionDisconnectEvent) {
        val headerAccessor = StompHeaderAccessor.wrap(event.message)
        val username = headerAccessor.sessionAttributes!!["username"] as String?
        if (username != null) {
            val message = Message(username, "User has left the chat", Message.MessageType.LEAVE)

            messagingTemplate?.convertAndSend("/topic/public", message)
        }
    }
}
