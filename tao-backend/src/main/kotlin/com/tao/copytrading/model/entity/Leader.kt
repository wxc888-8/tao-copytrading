package com.tao.copytrading.model.entity

import jakarta.persistence.*
import org.hibernate.annotations.CreationTimestamp
import java.time.LocalDateTime

@Entity
@Table(name = "leaders")
data class Leader(
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    val id: String = "",
    
    @Column(nullable = false, length = 64)
    val userId: String = "",
    
    @Column(nullable = false, unique = true, length = 64)
    val address: String = "",
    
    @Column(length = 100)
    val name: String? = null,
    
    @Column(length = 500)
    val remark: String? = null,
    
    @Column(length = 20)
    val status: String = "active",
    
    @CreationTimestamp
    @Column(updatable = false)
    val createdAt: LocalDateTime? = null
)
