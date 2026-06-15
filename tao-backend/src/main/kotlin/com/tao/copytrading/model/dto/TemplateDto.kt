package com.tao.copytrading.model.dto

import jakarta.validation.constraints.NotBlank
import java.math.BigDecimal

data class CopyTemplateDto(
    val id: String,
    val name: String,
    val copyType: String,
    val copyRatio: BigDecimal?,
    val fixedAmount: BigDecimal?,
    val dailyLossLimit: BigDecimal?,
    val maxOpsPerDay: Int,
    val slippageTolerance: BigDecimal,
    val stakeRiskThreshold: String?,
    val status: String,
    val createdAt: String?
)

data class CreateTemplateRequest(
    @field:NotBlank val name: String,
    val copyType: String = "ratio",
    val copyRatio: BigDecimal? = null,
    val fixedAmount: BigDecimal? = null,
    val dailyLossLimit: BigDecimal? = null,
    val maxOpsPerDay: Int = 10,
    val slippageTolerance: BigDecimal = BigDecimal("0.005"),
    val stakeRiskThreshold: String? = null,
    val status: String = "active"
)

data class UpdateTemplateRequest(
    val name: String? = null,
    val copyType: String? = null,
    val copyRatio: BigDecimal? = null,
    val fixedAmount: BigDecimal? = null,
    val dailyLossLimit: BigDecimal? = null,
    val maxOpsPerDay: Int? = null,
    val slippageTolerance: BigDecimal? = null,
    val stakeRiskThreshold: String? = null,
    val status: String? = null
)
