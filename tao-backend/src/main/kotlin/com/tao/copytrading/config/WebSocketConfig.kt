package com.tao.copytrading.config

import org.springframework.context.annotation.Configuration
import org.springframework.web.socket.config.annotation.EnableWebSocket
import org.springframework.web.socket.config.annotation.WebSocketConfigurer
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry
import org.springframework.web.socket.handler.TextWebSocketHandler

@Configuration
@EnableWebSocket
class WebSocketConfig : WebSocketConfigurer {

    override fun registerWebSocketHandlers(registry: WebSocketHandlerRegistry) {
        registry.addHandler(object : TextWebSocketHandler() {}, "/ws/positions")
            .setAllowedOrigins("*")
        registry.addHandler(object : TextWebSocketHandler() {}, "/ws/orders")
            .setAllowedOrigins("*")
        registry.addHandler(object : TextWebSocketHandler() {}, "/ws/notifications")
            .setAllowedOrigins("*")
    }
}
