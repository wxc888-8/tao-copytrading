package com.tao.copytrading.model.entity

import jakarta.persistence.*
import org.hibernate.annotations.CreationTimestamp
import org.hibernate.annotations.UpdateTimestamp
import java.time.LocalDateTime

@Entity
@Table(name = "users")
data class User(
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    val id: String = "",
    
    @Column(unique = true, nullable = false, length = 50)
    val username: String = "",
    
    @Column(nullable = false)
    val password: String = "",
    
    @Column(length = 100)
    val email: String? = null,
    
    @Column(nullable = false, length = 20)
    val role: String = "user",
    
    @Column(nullable = false, length = 20)
    val status: String = "active",
    
    @CreationTimestamp
    @Column(updatable = false)
    val createdAt: LocalDateTime? = null,
    
    @UpdateTimestamp
    val updatedAt: LocalDateTime? = null
)
