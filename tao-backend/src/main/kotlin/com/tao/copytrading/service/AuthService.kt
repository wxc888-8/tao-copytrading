package com.tao.copytrading.service

import com.tao.copytrading.model.dto.*
import com.tao.copytrading.model.entity.User
import com.tao.copytrading.repository.UserRepository
import com.tao.copytrading.security.JwtTokenProvider
import org.springframework.stereotype.Service

@Service
class AuthService(
    private val userRepository: UserRepository,
    private val jwtTokenProvider: JwtTokenProvider
) {
    fun login(request: LoginRequest): AuthResponse {
        val user = userRepository.findByUsername(request.username)
            .orElseThrow { RuntimeException("用户名或密码错误") }
        if (user.password != request.password) {
            throw RuntimeException("用户名或密码错误")
        }
        if (user.status != "active") {
            throw RuntimeException("账户已被禁用")
        }
        val token = jwtTokenProvider.generateToken(user.id, user.username, user.role)
        return AuthResponse(token, UserDto(user.id, user.username, user.email, user.role))
    }

    fun register(request: RegisterRequest): AuthResponse {
        if (userRepository.existsByUsername(request.username)) {
            throw RuntimeException("用户名已存在")
        }
        val user = User(
            username = request.username,
            password = request.password,
            email = request.email,
            role = "user"
        )
        val saved = userRepository.save(user)
        val token = jwtTokenProvider.generateToken(saved.id, saved.username, saved.role)
        return AuthResponse(token, UserDto(saved.id, saved.username, saved.email, saved.role))
    }

    fun getCurrentUser(userId: String): UserDto {
        val user = userRepository.findById(userId).orElseThrow { RuntimeException("用户不存在") }
        return UserDto(user.id, user.username, user.email, user.role)
    }
}
