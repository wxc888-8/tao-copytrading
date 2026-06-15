package com.tao.copytrading.model.entity

import jakarta.persistence.*
import org.hibernate.annotations.CreationTimestamp
import java.time.LocalDateTime

@Entity
@Table(name = "copy_trades")
data class CopyTrade(
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    val id: String = "",
    
    @Column(nullable = false, length = 64)
    val userId: String = "",
    
    @Column(nullable = false, length = 64)
    val accountId: String = "",
    
    @Column(nullable = false, length = 64)
    val leaderId: String = "",
    
    @Column(nullable = false, length = 64)
    val templateId: String = "",
    
    @Column(length = 20)
    val status: String = "active",
    
    @CreationTimestamp
    @Column(updatable = false)
    val createdAt: LocalDateTime? = null
)
