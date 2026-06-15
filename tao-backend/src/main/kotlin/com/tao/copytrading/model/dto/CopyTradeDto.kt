package com.tao.copytrading.model.dto

import jakarta.validation.constraints.NotBlank

data class CopyTradeDto(
    val id: String,
    val accountId: String,
    val accountName: String?,
    val leaderId: String,
    val leaderName: String?,
    val templateId: String,
    val templateName: String?,
    val status: String,
    val createdAt: String?
)

data class CreateCopyTradeRequest(
    @field:NotBlank val accountId: String,
    @field:NotBlank val leaderId: String,
    @field:NotBlank val templateId: String
)
