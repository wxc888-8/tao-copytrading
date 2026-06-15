package com.tao.copytrading.service

import com.tao.copytrading.model.dto.*
import com.tao.copytrading.model.entity.Order
import com.tao.copytrading.repository.OrderRepository
import jakarta.persistence.criteria.Predicate
import org.springframework.data.jpa.domain.Specification
import org.springframework.stereotype.Service
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

@Service
class OrderService(
    private val orderRepository: OrderRepository
) {
    fun getOrders(userId: String, filter: OrderFilter): List<OrderDto> {
        val spec = Specification<Order> { root, _, cb ->
            val predicates = mutableListOf<Predicate>()
            predicates.add(cb.equal(root.get<String>("userId"), userId))
            filter.type?.let { predicates.add(cb.equal(root.get<String>("type"), it)) }
            filter.businessType?.let { predicates.add(cb.equal(root.get<String>("businessType"), it)) }
            filter.status?.let { predicates.add(cb.equal(root.get<String>("status"), it)) }
            filter.accountId?.let { predicates.add(cb.equal(root.get<String>("accountId"), it)) }
            if (filter.startDate != null && filter.endDate != null) {
                val formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")
                val start = LocalDateTime.parse(filter.startDate, formatter)
                val end = LocalDateTime.parse(filter.endDate, formatter)
                predicates.add(cb.between(root.get("createdAt"), start, end))
            }
            cb.and(*predicates.toTypedArray())
        }
        return orderRepository.findAll(spec).map { it.toDto() }
    }

    fun getOrder(id: String): OrderDto {
        val order = orderRepository.findById(id).orElseThrow { RuntimeException("订单不存在") }
        return order.toDto()
    }

    private fun Order.toDto() = OrderDto(
        id = id, type = type, businessType = businessType, status = status,
        amount = amount, fee = fee, accountId = accountId,
        accountName = null, leaderId = leaderId, leaderName = null,
        copyTradeId = copyTradeId, txHash = txHash,
        createdAt = createdAt?.toString()
    )
}
