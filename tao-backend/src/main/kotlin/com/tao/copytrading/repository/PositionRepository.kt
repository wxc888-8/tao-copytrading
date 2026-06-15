package com.tao.copytrading.repository

import com.tao.copytrading.model.entity.Position
import org.springframework.data.jpa.repository.JpaRepository

interface PositionRepository : JpaRepository<Position, String> {
    fun findByAccountIdIn(accountIds: List<String>): List<Position>
}
