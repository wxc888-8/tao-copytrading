package com.tao.copytrading.service

import com.tao.copytrading.model.dto.*
import com.tao.copytrading.model.entity.LimitPriceRule
import com.tao.copytrading.repository.AccountRepository
import com.tao.copytrading.repository.LimitPriceRuleRepository
import org.springframework.stereotype.Service

@Service
class LimitPriceService(
    private val ruleRepository: LimitPriceRuleRepository,
    private val accountRepository: AccountRepository
) {
    fun getRules(userId: String): List<LimitPriceRuleDto> {
        val accounts = accountRepository.findByUserId(userId).associateBy { it.id }
        return ruleRepository.findByUserId(userId).map { rule ->
            LimitPriceRuleDto(
                id = rule.id, accountId = rule.accountId,
                accountName = accounts[rule.accountId]?.name,
                subnetName = rule.subnetName, action = rule.action,
                targetPrice = rule.targetPrice, currentPrice = rule.currentPrice,
                status = rule.status, createdAt = rule.createdAt?.toString()
            )
        }
    }

    fun createRule(userId: String, request: CreateLimitPriceRequest): LimitPriceRuleDto {
        val rule = LimitPriceRule(
            userId = userId,
            accountId = request.accountId,
            subnetName = request.subnetName,
            action = request.action,
            targetPrice = request.targetPrice
        )
        val saved = ruleRepository.save(rule)
        return LimitPriceRuleDto(
            id = saved.id, accountId = saved.accountId,
            accountName = null, subnetName = saved.subnetName,
            action = saved.action, targetPrice = saved.targetPrice,
            currentPrice = saved.currentPrice, status = saved.status,
            createdAt = saved.createdAt?.toString()
        )
    }

    fun updateStatus(id: String, status: String): LimitPriceRuleDto {
        val rule = ruleRepository.findById(id).orElseThrow { RuntimeException("限价规则不存在") }
        val updated = ruleRepository.save(rule.copy(status = status))
        return LimitPriceRuleDto(
            id = updated.id, accountId = updated.accountId,
            accountName = null, subnetName = updated.subnetName,
            action = updated.action, targetPrice = updated.targetPrice,
            currentPrice = updated.currentPrice, status = updated.status,
            createdAt = updated.createdAt?.toString()
        )
    }

    fun deleteRule(id: String) {
        ruleRepository.deleteById(id)
    }
}
