package com.tao.copytrading.model.entity

import jakarta.persistence.*
import org.hibernate.annotations.CreationTimestamp
import org.hibernate.annotations.UpdateTimestamp
import java.math.BigDecimal
import java.time.LocalDateTime

@Entity
@Table(name = "positions")
data class Position(
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    val id: String = "",
    
    @Column(nullable = false, length = 64)
    val accountId: String = "",
    
    @Column(nullable = false, length = 30)
    val assetType: String = "",
    
    @Column(precision = 30, scale = 10)
    val balance: BigDecimal = BigDecimal.ZERO,
    
    @Column(precision = 30, scale = 10)
    val staked: BigDecimal = BigDecimal.ZERO,
    
    @Column(precision = 30, scale = 10)
    val subnetPower: BigDecimal? = null,
    
    @UpdateTimestamp
    val updatedAt: LocalDateTime? = null
)
