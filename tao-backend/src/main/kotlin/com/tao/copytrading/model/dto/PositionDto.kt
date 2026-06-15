package com.tao.copytrading.model.dto

import java.math.BigDecimal

data class PositionDto(
    val id: String,
    val accountId: String,
    val accountName: String?,
    val assetType: String,
    val balance: BigDecimal,
    val staked: BigDecimal,
    val subnetPower: BigDecimal?,
    val updatedAt: String?
)

data class BatchRedeemRequest(
    val positionIds: List<String>
)

data class TransferRequest(
    val fromAccountId: String,
    val toAccountId: String,
    val amount: BigDecimal
)
