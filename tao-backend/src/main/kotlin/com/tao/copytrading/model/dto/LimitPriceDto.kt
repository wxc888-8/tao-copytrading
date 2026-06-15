package com.tao.copytrading.model.dto

import jakarta.validation.constraints.NotBlank
import java.math.BigDecimal

data class LimitPriceRuleDto(
    val id: String,
    val accountId: String,
    val accountName: String?,
    val subnetName: String,
    val action: String,
    val targetPrice: BigDecimal,
    val currentPrice: BigDecimal,
    val status: String,
    val createdAt: String?
)

data class CreateLimitPriceRequest(
    @field:NotBlank val accountId: String,
    @field:NotBlank val subnetName: String,
    @field:NotBlank val action: String,
    @field:NotBlank val targetPrice: BigDecimal
)
