package com.tao.copytrading.repository

import com.tao.copytrading.model.entity.Leader
import org.springframework.data.jpa.repository.JpaRepository

interface LeaderRepository : JpaRepository<Leader, String> {
    fun findByUserId(userId: String): List<Leader>
}
