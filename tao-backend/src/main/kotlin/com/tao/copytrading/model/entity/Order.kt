package com.tao.copytrading.model.entity

import jakarta.persistence.*
import org.hibernate.annotations.CreationTimestamp
import java.math.BigDecimal
import java.time.LocalDateTime

@Entity
@Table(name = "orders")
data class Order(
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    val id: String = "",
    
    @Column(nullable = false, length = 20)
    val type: String = "",
    
    @Column(nullable = false, length = 30)
    val businessType: String = "",
    
    @Column(length = 20)
    val status: String = "pending",
    
    @Column(precision = 30, scale = 10)
    val amount: BigDecimal? = null,
    
    @Column(precision = 30, scale = 10)
    val fee: BigDecimal? = null,
    
    @Column(length = 64)
    val accountId: String? = null,
    
    @Column(length = 64)
    val leaderId: String? = null,
    
    @Column(length = 64)
    val copyTradeId: String? = null,
    
    @Column(length = 64)
    val userId: String? = null,
    
    @Column(length = 100)
    val txHash: String? = null,
    
    @CreationTimestamp
    @Column(updatable = false)
    val createdAt: LocalDateTime? = null
)
