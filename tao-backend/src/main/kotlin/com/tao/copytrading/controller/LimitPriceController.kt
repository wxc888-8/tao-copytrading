package com.tao.copytrading.controller

import com.tao.copytrading.model.dto.*
import com.tao.copytrading.service.LimitPriceService
import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/limit-prices")
class LimitPriceController(
    private val limitPriceService: LimitPriceService
) {
    @GetMapping
    fun getRules(@RequestHeader("X-User-Id") userId: String): ResponseEntity<List<LimitPriceRuleDto>> {
        return ResponseEntity.ok(limitPriceService.getRules(userId))
    }

    @PostMapping
    fun createRule(
        @RequestHeader("X-User-Id") userId: String,
        @Valid @RequestBody request: CreateLimitPriceRequest
    ): ResponseEntity<LimitPriceRuleDto> {
        return ResponseEntity.ok(limitPriceService.createRule(userId, request))
    }

    @PutMapping("/{id}/status")
    fun updateStatus(
        @PathVariable id: String,
        @RequestBody body: Map<String, String>
    ): ResponseEntity<LimitPriceRuleDto> {
        return ResponseEntity.ok(limitPriceService.updateStatus(id, body["status"] ?: "active"))
    }

    @DeleteMapping("/{id}")
    fun deleteRule(@PathVariable id: String): ResponseEntity<Void> {
        limitPriceService.deleteRule(id)
        return ResponseEntity.noContent().build()
    }
}