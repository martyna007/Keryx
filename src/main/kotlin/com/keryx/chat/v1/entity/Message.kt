package com.keryx.chat.v1.entity

import java.time.LocalDateTime

class Message(val author: String, val text: String, val type: MessageType) {
    var createTime: LocalDateTime = LocalDateTime.now()

    enum class MessageType {
        JOIN,
        LEAVE,
        CHAT
    }

    override fun toString(): String {
        return "Message(author='$author', text='$text', type=$type, createTime=$createTime)"
    }
}


