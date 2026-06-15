package com.tao.copytrading.repository

import com.tao.copytrading.model.entity.CopyTemplate
import org.springframework.data.jpa.repository.JpaRepository

interface CopyTemplateRepository : JpaRepository<CopyTemplate, String> {
    fun findByUserId(userId: String): List<CopyTemplate>
}
