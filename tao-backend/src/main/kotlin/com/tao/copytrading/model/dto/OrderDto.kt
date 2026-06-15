package com.tao.copytrading.model.dto

import java.math.BigDecimal

data class OrderDto(
    val id: String,
    val type: String,
    val businessType: String,
    val status: String,
    val amount: BigDecimal?,
    val fee: BigDecimal?,
    val accountId: String?,
    val accountName: String?,
    val leaderId: String?,
    val leaderName: String?,
    val copyTradeId: String?,
    val txHash: String?,
    val createdAt: String?
)

data class OrderFilter(
    val type: String? = null,
    val businessType: String? = null,
    val status: String? = null,
    val accountId: String? = null,
    val startDate: String? = null,
    val endDate: String? = null
)
