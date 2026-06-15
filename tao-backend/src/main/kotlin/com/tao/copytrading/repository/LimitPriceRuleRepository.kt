package com.tao.copytrading.repository

import com.tao.copytrading.model.entity.LimitPriceRule
import org.springframework.data.jpa.repository.JpaRepository

interface LimitPriceRuleRepository : JpaRepository<LimitPriceRule, String> {
    fun findByUserId(userId: String): List<LimitPriceRule>
}
