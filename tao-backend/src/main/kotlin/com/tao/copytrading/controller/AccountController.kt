package com.tao.copytrading.controller

import com.tao.copytrading.model.dto.*
import com.tao.copytrading.service.AccountService
import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/accounts")
class AccountController(
    private val accountService: AccountService
) {
    @GetMapping
    fun getAccounts(@RequestHeader("X-User-Id") userId: String): ResponseEntity<List<AccountDto>> {
        return ResponseEntity.ok(accountService.getAccounts(userId))
    }

    @GetMapping("/{id}")
    fun getAccount(@PathVariable id: String): ResponseEntity<AccountDetailDto> {
        return ResponseEntity.ok(accountService.getAccount(id))
    }

    @PostMapping("/import")
    fun importAccount(
        @RequestHeader("X-User-Id") userId: String,
        @Valid @RequestBody request: ImportAccountRequest
    ): ResponseEntity<AccountDto> {
        return ResponseEntity.ok(accountService.importAccount(userId, request))
    }

    @PutMapping("/{id}")
    fun updateAccount(
        @PathVariable id: String,
        @RequestBody request: UpdateAccountRequest
    ): ResponseEntity<AccountDto> {
        return ResponseEntity.ok(accountService.updateAccount(id, request))
    }

    @DeleteMapping("/{id}")
    fun deleteAccount(@PathVariable id: String): ResponseEntity<Void> {
        accountService.deleteAccount(id)
        return ResponseEntity.noContent().build()
    }
}