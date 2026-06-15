package com.tao.copytrading.service

import com.tao.copytrading.model.dto.*
import com.tao.copytrading.repository.AccountRepository
import com.tao.copytrading.repository.PositionRepository
import org.springframework.stereotype.Service

@Service
class PositionService(
    private val positionRepository: PositionRepository,
    private val accountRepository: AccountRepository
) {
    fun getPositions(userId: String): List<PositionDto> {
        val accounts = accountRepository.findByUserId(userId)
        val accountIds = accounts.map { it.id }
        val positions = positionRepository.findByAccountIdIn(accountIds)
        val accountMap = accounts.associateBy { it.id }
        return positions.map { pos ->
            PositionDto(
                id = pos.id, accountId = pos.accountId,
                accountName = accountMap[pos.accountId]?.name,
                assetType = pos.assetType, balance = pos.balance,
                staked = pos.staked, subnetPower = pos.subnetPower,
                updatedAt = pos.updatedAt?.toString()
            )
        }
    }
}
