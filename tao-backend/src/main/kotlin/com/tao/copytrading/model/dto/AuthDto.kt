package com.tao.copytrading.model.dto

import jakarta.validation.constraints.NotBlank

data class LoginRequest(
    @field:NotBlank val username: String,
    @field:NotBlank val password: String
)

data class RegisterRequest(
    @field:NotBlank val username: String,
    @field:NotBlank val password: String,
    val email: String? = null
)

data class AuthResponse(
    val token: String,
    val userInfo: UserDto
)

data class UserDto(
    val id: String,
    val username: String,
    val email: String? = null,
    val role: String
)
