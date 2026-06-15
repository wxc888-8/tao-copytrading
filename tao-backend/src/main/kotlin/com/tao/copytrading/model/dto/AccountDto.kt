package com.tao.copytrading.model.dto

import jakarta.validation.constraints.NotBlank
import java.math.BigDecimal

data class AccountDto(
    val id: String,
    val address: String,
    val name: String?,
    val network: String,
    val status: String,
    val balance: BigDecimal?,
    val staked: BigDecimal?,
    val createdAt: String?
)

data class ImportAccountRequest(
    @field:NotBlank val privateKey: String,
    val name: String? = null,
    val network: String = "bittensor"
)

data class UpdateAccountRequest(
    val name: String? = null,
    val status: String? = null
)

data class AccountDetailDto(
    val id: String,
    val address: String,
    val name: String?,
    val network: String,
    val status: String,
    val balance: BigDecimal?,
    val staked: BigDecimal?,
    val subnetPower: BigDecimal?,
    val transactions: List<TransactionDto> = emptyList()
)

data class TransactionDto(
    val id: String,
    val type: String,
    val amount: BigDecimal?,
    val status: String,
    val fee: BigDecimal?,
    val txHash: String?,
    val createdAt: String?
)
