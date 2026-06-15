package com.tao.copytrading.model.entity

import jakarta.persistence.*
import org.hibernate.annotations.CreationTimestamp
import org.hibernate.annotations.UpdateTimestamp
import java.time.LocalDateTime

@Entity
@Table(name = "accounts")
data class Account(
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    val id: String = "",
    
    @Column(nullable = false, length = 64)
    val userId: String = "",
    
    @Column(nullable = false, unique = true, length = 64)
    val address: String = "",
    
    @Column(length = 100)
    val name: String? = null,
    
    @Column(nullable = false, columnDefinition = "TEXT")
    val privateKeyEncrypted: String = "",
    
    @Column(length = 20)
    val network: String = "bittensor",
    
    @Column(length = 20)
    val status: String = "active",
    
    @CreationTimestamp
    @Column(updatable = false)
    val createdAt: LocalDateTime? = null,
    
    @UpdateTimestamp
    val updatedAt: LocalDateTime? = null
)
