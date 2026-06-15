package com.tao.copytrading.repository

import com.tao.copytrading.model.entity.CopyTrade
import org.springframework.data.jpa.repository.JpaRepository

interface CopyTradeRepository : JpaRepository<CopyTrade, String> {
    fun findByUserId(userId: String): List<CopyTrade>
}
