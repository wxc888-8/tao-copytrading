package com.tao.copytrading.model.dto

import jakarta.validation.constraints.NotBlank

data class LeaderDto(
    val id: String,
    val address: String,
    val name: String?,
    val remark: String?,
    val status: String,
    val winRate: Double?,
    val totalPnl: String?,
    val totalOrders: Int?
)

data class CreateLeaderRequest(
    @field:NotBlank val address: String,
    val name: String? = null,
    val remark: String? = null
)

data class UpdateLeaderRequest(
    val name: String? = null,
    val remark: String? = null,
    val status: String? = null
)
