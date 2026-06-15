package com.tao.copytrading.controller

import com.tao.copytrading.model.dto.*
import com.tao.copytrading.service.CopyTradeService
import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/copy-trades")
class CopyTradeController(
    private val copyTradeService: CopyTradeService
) {
    @GetMapping
    fun getCopyTrades(@RequestHeader("X-User-Id") userId: String): ResponseEntity<List<CopyTradeDto>> {
        return ResponseEntity.ok(copyTradeService.getCopyTrades(userId))
    }

    @PostMapping
    fun createCopyTrade(
        @RequestHeader("X-User-Id") userId: String,
        @Valid @RequestBody request: CreateCopyTradeRequest
    ): ResponseEntity<CopyTradeDto> {
        return ResponseEntity.ok(copyTradeService.createCopyTrade(userId, request))
    }

    @PutMapping("/{id}/status")
    fun updateStatus(
        @PathVariable id: String,
        @RequestBody body: Map<String, String>
    ): ResponseEntity<CopyTradeDto> {
        return ResponseEntity.ok(copyTradeService.updateStatus(id, body["status"] ?: "active"))
    }

    @DeleteMapping("/{id}")
    fun deleteCopyTrade(@PathVariable id: String): ResponseEntity<Void> {
        copyTradeService.deleteCopyTrade(id)
        return ResponseEntity.noContent().build()
    }
}