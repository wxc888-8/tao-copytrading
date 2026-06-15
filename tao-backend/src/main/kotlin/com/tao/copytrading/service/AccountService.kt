package com.tao.copytrading.service

import com.tao.copytrading.model.dto.*
import com.tao.copytrading.model.entity.Account
import com.tao.copytrading.repository.AccountRepository
import org.springframework.stereotype.Service
import java.math.BigDecimal

@Service
class AccountService(
    private val accountRepository: AccountRepository
) {
    fun getAccounts(userId: String): List<AccountDto> {
        return accountRepository.findByUserId(userId).map { it.toDto() }
    }

    fun getAccount(id: String): AccountDetailDto {
        val account = accountRepository.findById(id).orElseThrow { RuntimeException("账户不存在") }
        return account.toDetailDto()
    }

    fun importAccount(userId: String, request: ImportAccountRequest): AccountDto {
        val account = Account(
            userId = userId,
            address = request.privateKey.take(48),
            name = request.name,
            privateKeyEncrypted = "encrypted:" + request.privateKey.takeLast(20),
            network = request.network
        )
        return accountRepository.save(account).toDto()
    }

    fun updateAccount(id: String, request: UpdateAccountRequest): AccountDto {
        val account = accountRepository.findById(id).orElseThrow { RuntimeException("账户不存在") }
        val updated = account.copy(
            name = request.name ?: account.name,
            status = request.status ?: account.status
        )
        return accountRepository.save(updated).toDto()
    }

    fun deleteAccount(id: String) {
        accountRepository.deleteById(id)
    }

    private fun Account.toDto() = AccountDto(
        id = id, address = address, name = name, network = network,
        status = status, balance = BigDecimal.ZERO, staked = BigDecimal.ZERO,
        createdAt = createdAt?.toString()
    )

    private fun Account.toDetailDto() = AccountDetailDto(
        id = id, address = address, name = name, network = network,
        status = status, balance = BigDecimal.ZERO, staked = BigDecimal.ZERO,
        subnetPower = BigDecimal.ZERO
    )
}
