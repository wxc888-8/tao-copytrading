package com.tao.copytrading.controller

import com.tao.copytrading.model.dto.*
import com.tao.copytrading.service.OrderService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/dashboard")
class DashboardController(
    private val orderService: OrderService
) {
    @GetMapping("/overview")
    fun getOverview(@RequestHeader("X-User-Id") userId: String): ResponseEntity<Map<String, Any>> {
        val orders = orderService.getOrders(userId, OrderFilter())
        return ResponseEntity.ok(
            mapOf(
                "totalAssets" to "0.00",
                "accountCount" to 0,
                "activeCopyCount" to 0,
                "pnl" to "0.00",
                "todayPnl" to "0.00",
                "totalOrders" to orders.size
            )
        )
    }

    @GetMapping("/recent-orders")
    fun getRecentOrders(
        @RequestHeader("X-User-Id") userId: String,
        @RequestParam(defaultValue = "10") limit: Int
    ): ResponseEntity<List<OrderDto>> {
        val orders = orderService.getOrders(userId, OrderFilter())
        return ResponseEntity.ok(orders.take(limit))
    }
}