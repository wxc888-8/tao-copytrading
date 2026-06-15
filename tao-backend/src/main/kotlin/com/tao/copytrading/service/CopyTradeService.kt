package com.tao.copytrading.service

import com.tao.copytrading.model.dto.*
import com.tao.copytrading.model.entity.CopyTrade
import com.tao.copytrading.repository.CopyTradeRepository
import org.springframework.stereotype.Service

@Service
class CopyTradeService(
    private val copyTradeRepository: CopyTradeRepository
) {
    fun getCopyTrades(userId: String): List<CopyTradeDto> {
        return copyTradeRepository.findByUserId(userId).map { it.toDto() }
    }

    fun createCopyTrade(userId: String, request: CreateCopyTradeRequest): CopyTradeDto {
        val copyTrade = CopyTrade(
            userId = userId,
            accountId = request.accountId,
            leaderId = request.leaderId,
            templateId = request.templateId
        )
        return copyTradeRepository.save(copyTrade).toDto()
    }

    fun updateStatus(id: String, status: String): CopyTradeDto {
        val ct = copyTradeRepository.findById(id).orElseThrow { RuntimeException("跟单配置不存在") }
        val updated = ct.copy(status = status)
        return copyTradeRepository.save(updated).toDto()
    }

    fun deleteCopyTrade(id: String) {
        copyTradeRepository.deleteById(id)
    }

    private fun CopyTrade.toDto() = CopyTradeDto(
        id = id, accountId = accountId, accountName = null,
        leaderId = leaderId, leaderName = null,
        templateId = templateId, templateName = null,
        status = status, createdAt = createdAt?.toString()
    )
}
