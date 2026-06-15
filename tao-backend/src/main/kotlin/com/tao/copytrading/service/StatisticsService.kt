package com.tao.copytrading.service

import com.tao.copytrading.model.dto.*
import com.tao.copytrading.repository.*
import org.springframework.stereotype.Service
import java.math.BigDecimal
import java.math.RoundingMode

@Service
class StatisticsService(
    private val accountRepository: AccountRepository,
    private val orderRepository: OrderRepository,
    private val leaderRepository: LeaderRepository
) {
    fun getGlobalStats(userId: String): GlobalStatsDto {
        val orders = orderRepository.findByUserId(userId)
        val accounts = accountRepository.findByUserId(userId)
        val completed = orders.filter { it.status == "completed" }
        val totalPnl = completed.mapNotNull { it.amount }.sumOf { it.toDouble() }
        val totalFees = completed.mapNotNull { it.fee }.sumOf { it.toDouble() }
        val winCount = completed.count { (it.amount ?: BigDecimal.ZERO) >= BigDecimal.ZERO }
        
        return GlobalStatsDto(
            totalAssets = BigDecimal.ZERO.setScale(2).toString(),
            totalPnl = BigDecimal(totalPnl).setScale(2, RoundingMode.HALF_UP).toString(),
            totalStaked = BigDecimal.ZERO.setScale(2).toString(),
            totalFees = BigDecimal(totalFees).setScale(2, RoundingMode.HALF_UP).toString(),
            accountCount = accounts.size,
            activeCopyCount = 0,
            totalOrders = orders.size,
            winRate = if (completed.isEmpty()) 0.0 else (winCount.toDouble() / completed.size * 100)
        )
    }

    fun getLeaderStats(userId: String, leaderId: String): LeaderStatsDto {
        val orders = orderRepository.findByUserId(userId)
            .filter { it.leaderId == leaderId }
        val completed = orders.filter { it.status == "completed" }
        val totalPnl = completed.mapNotNull { it.amount }.sumOf { it.toDouble() }
        val winCount = completed.count { (it.amount ?: BigDecimal.ZERO) >= BigDecimal.ZERO }
        
        return LeaderStatsDto(
            leaderId = leaderId,
            totalOrders = orders.size,
            winRate = if (completed.isEmpty()) 0.0 else (winCount.toDouble() / completed.size * 100),
            totalPnl = BigDecimal(totalPnl).setScale(2, RoundingMode.HALF_UP).toString(),
            avgProfit = if (completed.isEmpty()) "0.00" else BigDecimal(totalPnl / completed.size).setScale(2, RoundingMode.HALF_UP).toString(),
            totalStaked = BigDecimal.ZERO.setScale(2).toString()
        )
    }
}
