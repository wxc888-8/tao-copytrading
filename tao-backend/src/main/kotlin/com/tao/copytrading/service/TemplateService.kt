package com.tao.copytrading.service

import com.tao.copytrading.model.dto.*
import com.tao.copytrading.model.entity.CopyTemplate
import com.tao.copytrading.repository.CopyTemplateRepository
import org.springframework.stereotype.Service

@Service
class TemplateService(
    private val templateRepository: CopyTemplateRepository
) {
    fun getTemplates(userId: String): List<CopyTemplateDto> {
        return templateRepository.findByUserId(userId).map { it.toDto() }
    }

    fun getTemplate(id: String): CopyTemplateDto {
        val template = templateRepository.findById(id).orElseThrow { RuntimeException("模板不存在") }
        return template.toDto()
    }

    fun createTemplate(userId: String, request: CreateTemplateRequest): CopyTemplateDto {
        val template = CopyTemplate(
            userId = userId,
            name = request.name,
            copyType = request.copyType,
            copyRatio = request.copyRatio,
            fixedAmount = request.fixedAmount,
            dailyLossLimit = request.dailyLossLimit,
            maxOpsPerDay = request.maxOpsPerDay,
            slippageTolerance = request.slippageTolerance,
            stakeRiskThreshold = request.stakeRiskThreshold,
            status = request.status
        )
        return templateRepository.save(template).toDto()
    }

    fun updateTemplate(id: String, request: UpdateTemplateRequest): CopyTemplateDto {
        val template = templateRepository.findById(id).orElseThrow { RuntimeException("模板不存在") }
        val updated = template.copy(
            name = request.name ?: template.name,
            copyType = request.copyType ?: template.copyType,
            copyRatio = request.copyRatio ?: template.copyRatio,
            fixedAmount = request.fixedAmount ?: template.fixedAmount,
            dailyLossLimit = request.dailyLossLimit ?: template.dailyLossLimit,
            maxOpsPerDay = request.maxOpsPerDay ?: template.maxOpsPerDay,
            slippageTolerance = request.slippageTolerance ?: template.slippageTolerance,
            stakeRiskThreshold = request.stakeRiskThreshold ?: template.stakeRiskThreshold,
            status = request.status ?: template.status
        )
        return templateRepository.save(updated).toDto()
    }

    fun deleteTemplate(id: String) {
        templateRepository.deleteById(id)
    }

    private fun CopyTemplate.toDto() = CopyTemplateDto(
        id = id, name = name, copyType = copyType, copyRatio = copyRatio,
        fixedAmount = fixedAmount, dailyLossLimit = dailyLossLimit,
        maxOpsPerDay = maxOpsPerDay, slippageTolerance = slippageTolerance,
        stakeRiskThreshold = stakeRiskThreshold, status = status,
        createdAt = createdAt?.toString()
    )
}
