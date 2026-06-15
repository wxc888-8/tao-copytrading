package com.tao.copytrading.controller

import com.tao.copytrading.model.dto.*
import com.tao.copytrading.service.StatisticsService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/statistics")
class StatisticsController(
    private val statisticsService: StatisticsService
) {
    @GetMapping("/global")
    fun getGlobalStats(@RequestHeader("X-User-Id") userId: String): ResponseEntity<GlobalStatsDto> {
        return ResponseEntity.ok(statisticsService.getGlobalStats(userId))
    }

    @GetMapping("/leader/{leaderId}")
    fun getLeaderStats(
        @RequestHeader("X-User-Id") userId: String,
        @PathVariable leaderId: String
    ): ResponseEntity<LeaderStatsDto> {
        return ResponseEntity.ok(statisticsService.getLeaderStats(userId, leaderId))
    }
}