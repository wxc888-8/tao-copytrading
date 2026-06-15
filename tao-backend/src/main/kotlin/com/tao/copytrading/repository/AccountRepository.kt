package com.tao.copytrading.repository

import com.tao.copytrading.model.entity.Account
import org.springframework.data.jpa.repository.JpaRepository

interface AccountRepository : JpaRepository<Account, String> {
    fun findByUserId(userId: String): List<Account>
    fun findByUserIdAndStatus(userId: String, status: String): List<Account>
}
