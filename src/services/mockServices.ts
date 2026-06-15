import {
  mockAccounts,
  mockLeaders,
  mockTemplates,
  mockCopyTrades,
  mockOrders,
  mockPositions,
  mockDashboardOverview,
  mockSystemStatus,
  mockGlobalStats,
  mockNotifications,
  mockProxyConfigs,
  mockNodes,
  mockLimitPriceRules,
  getMockAccountDetail,
  getMockLeaderDetail,
  getMockLeaderStats,
} from './mockData'

import type {
  Account, AccountDetail, Leader, CopyTemplate, CopyTrade, Order, Position,
  DashboardOverview, SystemStatus, GlobalStats, LeaderStats,
  ProxyConfig, NodeInfo, Notification, LimitPriceRule,
} from '@/types'

import type { LeaderDetail } from './mockData'

function delay<T>(data: T, ms = 300 + Math.random() * 200): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), ms)
  })
}

// ============ Dashboard ============

export function fetchDashboardOverview(): Promise<DashboardOverview> {
  return delay(mockDashboardOverview)
}

export function fetchRecentOrders(limit = 5): Promise<Order[]> {
  return delay(mockOrders.slice(0, limit))
}

export function fetchSystemStatus(): Promise<SystemStatus> {
  return delay(mockSystemStatus)
}

// ============ Accounts ============

export function fetchAccounts(): Promise<Account[]> {
  return delay(mockAccounts)
}

export function fetchAccountDetail(id: string): Promise<AccountDetail | undefined> {
  return delay(getMockAccountDetail(id))
}

// ============ Leaders ============

export function fetchLeaders(): Promise<Leader[]> {
  return delay(mockLeaders)
}

export function fetchLeaderDetail(id: string): Promise<LeaderDetail | undefined> {
  return delay(getMockLeaderDetail(id))
}

// ============ Templates ============

export function fetchTemplates(): Promise<CopyTemplate[]> {
  return delay(mockTemplates)
}

// ============ Copy Trades ============

export function fetchCopyTrades(): Promise<CopyTrade[]> {
  return delay(mockCopyTrades)
}

// ============ Orders ============

export function fetchOrders(filters?: Record<string, any>): Promise<Order[]> {
  let result = [...mockOrders]

  if (filters) {
    if (filters.status) {
      result = result.filter(o => o.status === filters.status)
    }
    if (filters.type) {
      result = result.filter(o => o.type === filters.type)
    }
    if (filters.businessType) {
      result = result.filter(o => o.businessType === filters.businessType)
    }
    if (filters.accountId) {
      result = result.filter(o => o.accountId === filters.accountId)
    }
    if (filters.dateRange && Array.isArray(filters.dateRange)) {
      const [start, end] = filters.dateRange
      if (start) {
        result = result.filter(o => new Date(o.createdAt) >= new Date(start))
      }
      if (end) {
        result = result.filter(o => new Date(o.createdAt) <= new Date(end))
      }
    }
  }

  return delay(result)
}

// ============ Positions ============

export function fetchPositions(): Promise<Position[]> {
  return delay(mockPositions)
}

// ============ Statistics ============

export function fetchGlobalStats(): Promise<GlobalStats> {
  return delay(mockGlobalStats)
}

export function fetchLeaderStats(leaderId: string): Promise<LeaderStats> {
  return delay(getMockLeaderStats(leaderId))
}

// ============ Settings ============

export function fetchProxyConfigs(): Promise<ProxyConfig[]> {
  return delay(mockProxyConfigs)
}

export function fetchNodes(): Promise<NodeInfo[]> {
  return delay(mockNodes)
}

export function fetchNotifications(): Promise<Notification[]> {
  return delay(mockNotifications)
}

// ============ Limit Price ============
export function fetchLimitPriceRules(): Promise<LimitPriceRule[]> {
  return delay(mockLimitPriceRules)
}
