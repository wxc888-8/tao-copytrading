package com.tao.copytrading.controller

import com.tao.copytrading.model.dto.*
import com.tao.copytrading.service.LeaderService
import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/leaders")
class LeaderController(
    private val leaderService: LeaderService
) {
    @GetMapping
    fun getLeaders(@RequestHeader("X-User-Id") userId: String): ResponseEntity<List<LeaderDto>> {
        return ResponseEntity.ok(leaderService.getLeaders(userId))
    }

    @GetMapping("/{id}")
    fun getLeader(@PathVariable id: String): ResponseEntity<LeaderDto> {
        return ResponseEntity.ok(leaderService.getLeader(id))
    }

    @PostMapping
    fun createLeader(
        @RequestHeader("X-User-Id") userId: String,
        @Valid @RequestBody request: CreateLeaderRequest
    ): ResponseEntity<LeaderDto> {
        return ResponseEntity.ok(leaderService.createLeader(userId, request))
    }

    @PutMapping("/{id}")
    fun updateLeader(
        @PathVariable id: String,
        @RequestBody request: UpdateLeaderRequest
    ): ResponseEntity<LeaderDto> {
        return ResponseEntity.ok(leaderService.updateLeader(id, request))
    }

    @DeleteMapping("/{id}")
    fun deleteLeader(@PathVariable id: String): ResponseEntity<Void> {
        leaderService.deleteLeader(id)
        return ResponseEntity.noContent().build()
    }
}