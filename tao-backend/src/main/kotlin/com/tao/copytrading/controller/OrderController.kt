package com.tao.copytrading.controller

import com.tao.copytrading.model.dto.*
import com.tao.copytrading.service.OrderService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/orders")
class OrderController(
    private val orderService: OrderService
) {
    @GetMapping
    fun getOrders(
        @RequestHeader("X-User-Id") userId: String,
        @RequestParam(required = false) type: String?,
        @RequestParam(required = false) businessType: String?,
        @RequestParam(required = false) status: String?,
        @RequestParam(required = false) accountId: String?,
        @RequestParam(required = false) startDate: String?,
        @RequestParam(required = false) endDate: String?
    ): ResponseEntity<List<OrderDto>> {
        val filter = OrderFilter(type, businessType, status, accountId, startDate, endDate)
        return ResponseEntity.ok(orderService.getOrders(userId, filter))
    }

    @GetMapping("/{id}")
    fun getOrder(@PathVariable id: String): ResponseEntity<OrderDto> {
        return ResponseEntity.ok(orderService.getOrder(id))
    }
}