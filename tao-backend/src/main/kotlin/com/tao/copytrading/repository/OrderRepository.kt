package com.tao.copytrading.repository

import com.tao.copytrading.model.entity.Order
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.JpaSpecificationExecutor

interface OrderRepository : JpaRepository<Order, String>, JpaSpecificationExecutor<Order> {
    fun findByUserId(userId: String): List<Order>
}
