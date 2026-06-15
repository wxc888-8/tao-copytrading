package com.tao.copytrading.controller

import com.tao.copytrading.model.dto.*
import com.tao.copytrading.service.TemplateService
import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/templates")
class TemplateController(
    private val templateService: TemplateService
) {
    @GetMapping
    fun getTemplates(@RequestHeader("X-User-Id") userId: String): ResponseEntity<List<CopyTemplateDto>> {
        return ResponseEntity.ok(templateService.getTemplates(userId))
    }

    @GetMapping("/{id}")
    fun getTemplate(@PathVariable id: String): ResponseEntity<CopyTemplateDto> {
        return ResponseEntity.ok(templateService.getTemplate(id))
    }

    @PostMapping
    fun createTemplate(
        @RequestHeader("X-User-Id") userId: String,
        @Valid @RequestBody request: CreateTemplateRequest
    ): ResponseEntity<CopyTemplateDto> {
        return ResponseEntity.ok(templateService.createTemplate(userId, request))
    }

    @PutMapping("/{id}")
    fun updateTemplate(
        @PathVariable id: String,
        @RequestBody request: UpdateTemplateRequest
    ): ResponseEntity<CopyTemplateDto> {
        return ResponseEntity.ok(templateService.updateTemplate(id, request))
    }

    @DeleteMapping("/{id}")
    fun deleteTemplate(@PathVariable id: String): ResponseEntity<Void> {
        templateService.deleteTemplate(id)
        return ResponseEntity.noContent().build()
    }
}