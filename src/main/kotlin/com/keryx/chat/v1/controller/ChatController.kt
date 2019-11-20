package com.keryx.chat.v1.controller

import com.keryx.chat.v1.entity.Message
import org.springframework.messaging.handler.annotation.MessageMapping
import org.springframework.messaging.handler.annotation.Payload
import org.springframework.messaging.handler.annotation.SendTo
import org.springframework.messaging.simp.SimpMessageHeaderAccessor
import org.springframework.stereotype.Controller

@Controller
@MessageMapping("/v1")
class GreetingController {

    @MessageMapping("/addUser")
    @SendTo("/topic/public")
    public fun addUser(@Payload message: Message, headerAccessor: SimpMessageHeaderAccessor): Message {
        headerAccessor.sessionAttributes?.put("username", message.author)

        return message
    }

    @MessageMapping("/sendMessage")
    @SendTo("/topic/public")
    public fun addMessage(@Payload message: Message): Message {
        return message;
    }
}
