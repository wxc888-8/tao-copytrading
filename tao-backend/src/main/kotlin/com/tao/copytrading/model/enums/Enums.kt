package com.tao.copytrading.model.enums

enum class CopyType { RATIO, FIXED }
enum class OrderType { BUY, SELL }
enum class BusinessType { STAKE, TRANSFER, SWAP, REDEEM }
enum class OrderStatus { PENDING, EXECUTING, COMPLETED, FAILED, CANCELLED }
enum class AssetType { TAO_BALANCE, SUBNET_STAKE }
enum class LeaderCategory { STAKE, TRADE }
enum class LimitPriceAction { STAKE, REDEEM }
enum class LimitPriceStatus { ACTIVE, TRIGGERED, PAUSED }
