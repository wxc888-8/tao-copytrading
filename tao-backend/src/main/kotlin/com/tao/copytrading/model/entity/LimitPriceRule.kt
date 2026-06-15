package com.tao.copytrading.model.entity

import jakarta.persistence.*
import org.hibernate.annotations.CreationTimestamp
import org.hibernate.annotations.UpdateTimestamp
import java.math.BigDecimal
import java.time.LocalDateTime

@Entity
@Table(name = "limit_price_rules")
data class LimitPriceRule(
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    val id: String = "",
    
    @Column(nullable = false, length = 64)
    val userId: String = "",
    
    @Column(nullable = false, length = 64)
    val accountId: String = "",
    
    @Column(nullable = false, length = 50)
    val subnetName: String = "",
    
    @Column(nullable = false, length = 20)
    val action: String = "",
    
    @Column(nullable = false, precision = 30, scale = 10)
    val targetPrice: BigDecimal = BigDecimal.ZERO,
    
    @Column(precision = 30, scale = 10)
    val currentPrice: BigDecimal = BigDecimal.ZERO,
    
    @Column(length = 20)
    val status: String = "active",
    
    @CreationTimestamp
    @Column(updatable = false)
    val createdAt: LocalDateTime? = null,
    
    @UpdateTimestamp
    val updatedAt: LocalDateTime? = null
)
