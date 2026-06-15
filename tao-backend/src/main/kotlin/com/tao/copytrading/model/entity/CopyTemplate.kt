package com.tao.copytrading.model.entity

import jakarta.persistence.*
import org.hibernate.annotations.CreationTimestamp
import java.math.BigDecimal
import java.time.LocalDateTime

@Entity
@Table(name = "copy_templates")
data class CopyTemplate(
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    val id: String = "",
    
    @Column(nullable = false, length = 64)
    val userId: String = "",
    
    @Column(nullable = false, length = 100)
    val name: String = "",
    
    @Column(nullable = false, length = 20)
    val copyType: String = "ratio",
    
    @Column(precision = 10, scale = 4)
    val copyRatio: BigDecimal? = null,
    
    @Column(precision = 30, scale = 10)
    val fixedAmount: BigDecimal? = null,
    
    @Column(precision = 30, scale = 10)
    val dailyLossLimit: BigDecimal? = null,
    
    val maxOpsPerDay: Int = 10,
    
    @Column(precision = 5, scale = 4)
    val slippageTolerance: BigDecimal = BigDecimal("0.005"),
    
    @Column(length = 50)
    val stakeRiskThreshold: String? = null,
    
    @Column(length = 20)
    val status: String = "active",
    
    @CreationTimestamp
    @Column(updatable = false)
    val createdAt: LocalDateTime? = null
)
