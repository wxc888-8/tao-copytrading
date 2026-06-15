package com.tao.copytrading.service

import com.tao.copytrading.model.dto.*
import com.tao.copytrading.model.entity.Leader
import com.tao.copytrading.repository.LeaderRepository
import org.springframework.stereotype.Service

@Service
class LeaderService(
    private val leaderRepository: LeaderRepository
) {
    fun getLeaders(userId: String): List<LeaderDto> {
        return leaderRepository.findByUserId(userId).map { it.toDto() }
    }

    fun getLeader(id: String): LeaderDto {
        val leader = leaderRepository.findById(id).orElseThrow { RuntimeException("Leader不存在") }
        return leader.toDto()
    }

    fun createLeader(userId: String, request: CreateLeaderRequest): LeaderDto {
        val leader = Leader(
            userId = userId,
            address = request.address,
            name = request.name,
            remark = request.remark
        )
        return leaderRepository.save(leader).toDto()
    }

    fun updateLeader(id: String, request: UpdateLeaderRequest): LeaderDto {
        val leader = leaderRepository.findById(id).orElseThrow { RuntimeException("Leader不存在") }
        val updated = leader.copy(
            name = request.name ?: leader.name,
            remark = request.remark ?: leader.remark,
            status = request.status ?: leader.status
        )
        return leaderRepository.save(updated).toDto()
    }

    fun deleteLeader(id: String) {
        leaderRepository.deleteById(id)
    }

    private fun Leader.toDto() = LeaderDto(
        id = id, address = address, name = name, remark = remark,
        status = status, winRate = null, totalPnl = null, totalOrders = null
    )
}
