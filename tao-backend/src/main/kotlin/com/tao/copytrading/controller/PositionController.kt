package com.tao.copytrading.controller

import com.tao.copytrading.model.dto.PositionDto
import com.tao.copytrading.service.PositionService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/positions")
class PositionController(
    private val positionService: PositionService
) {
    @GetMapping
    fun getPositions(@RequestHeader("X-User-Id") userId: String): ResponseEntity<List<PositionDto>> {
        return ResponseEntity.ok(positionService.getPositions(userId))
    }
}