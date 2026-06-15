package com.tao.copytrading.model.dto

data class GlobalStatsDto(
    val totalAssets: String,
    val totalPnl: String,
    val totalStaked: String,
    val totalFees: String,
    val accountCount: Int,
    val activeCopyCount: Int,
    val totalOrders: Int,
    val winRate: Double
)

data class LeaderStatsDto(
    val leaderId: String,
    val totalOrders: Int,
    val winRate: Double,
    val totalPnl: String,
    val avgProfit: String,
    val totalStaked: String
)
