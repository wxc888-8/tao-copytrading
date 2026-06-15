import api from './api'

import type {
  Account, AccountDetail, Leader, CopyTemplate, CopyTrade, Order, Position,
  DashboardOverview, SystemStatus, GlobalStats, LeaderStats,
  ProxyConfig, NodeInfo, Notification, LimitPriceRule, UserInfo,
  LoginRequest, LoginResponse,
} from '@/types'

// ============ Auth ============
export function login(data: LoginRequest): Promise<LoginResponse> {
  return api.post('/auth/login', data) as any
}

export function register(data: { username: string; password: string; email?: string }): Promise<LoginResponse> {
  return api.post('/auth/register', data) as any
}

export function fetchUserInfo(): Promise<UserInfo> {
  return api.get('/auth/userinfo') as any
}

// ============ Dashboard ============

export function fetchDashboardOverview(): Promise<DashboardOverview> {
  return api.get('/dashboard/overview') as any
}

export function fetchRecentOrders(limit = 5): Promise<Order[]> {
  return api.get('/dashboard/recent-orders', { params: { limit } }) as any
}

export function fetchSystemStatus(): Promise<SystemStatus> {
  // Backend doesn't have this endpoint yet, keep mock temporarily
  return import('./mockData').then(m => Promise.resolve(m.mockSystemStatus))
}

// ============ Accounts ============

export function fetchAccounts(): Promise<Account[]> {
  return api.get('/accounts') as any
}

export function fetchAccountDetail(id: string): Promise<AccountDetail | undefined> {
  return api.get(`/accounts/${id}`) as any
}

export function importAccount(data: { address: string; privateKey: string; name?: string }): Promise<Account> {
  return api.post('/accounts/import', data) as any
}

export function updateAccount(id: string, data: Partial<Account>): Promise<Account> {
  return api.put(`/accounts/${id}`, data) as any
}

export function deleteAccount(id: string): Promise<void> {
  return api.delete(`/accounts/${id}`) as any
}

// ============ Leaders ============

export function fetchLeaders(): Promise<Leader[]> {
  return api.get('/leaders') as any
}

export function fetchLeaderDetail(id: string): Promise<Leader | undefined> {
  return api.get(`/leaders/${id}`) as any
}

export function createLeader(data: { address: string; name?: string; remark?: string }): Promise<Leader> {
  return api.post('/leaders', data) as any
}

export function deleteLeader(id: string): Promise<void> {
  return api.delete(`/leaders/${id}`) as any
}

// ============ Templates ============

export function fetchTemplates(): Promise<CopyTemplate[]> {
  return api.get('/templates') as any
}

export function fetchTemplate(id: string): Promise<CopyTemplate> {
  return api.get(`/templates/${id}`) as any
}

export function createTemplate(data: Partial<CopyTemplate>): Promise<CopyTemplate> {
  return api.post('/templates', data) as any
}

export function updateTemplate(id: string, data: Partial<CopyTemplate>): Promise<CopyTemplate> {
  return api.put(`/templates/${id}`, data) as any
}

export function deleteTemplate(id: string): Promise<void> {
  return api.delete(`/templates/${id}`) as any
}

// ============ Copy Trades ============

export function fetchCopyTrades(): Promise<CopyTrade[]> {
  return api.get('/copy-trades') as any
}

export function createCopyTrade(data: { accountId: string; leaderId: string; templateId: string }): Promise<CopyTrade> {
  return api.post('/copy-trades', data) as any
}

export function updateCopyTradeStatus(id: string, status: string): Promise<CopyTrade> {
  return api.put(`/copy-trades/${id}/status`, { status }) as any
}

export function deleteCopyTrade(id: string): Promise<void> {
  return api.delete(`/copy-trades/${id}`) as any
}

// ============ Orders ============

export function fetchOrders(filters?: Record<string, any>): Promise<Order[]> {
  const params: Record<string, any> = {}
  if (filters) {
    if (filters.status) params.status = filters.status
    if (filters.type) params.type = filters.type
    if (filters.businessType) params.businessType = filters.businessType
    if (filters.accountId) params.accountId = filters.accountId
    if (filters.dateRange && Array.isArray(filters.dateRange)) {
      if (filters.dateRange[0]) params.startDate = filters.dateRange[0]
      if (filters.dateRange[1]) params.endDate = filters.dateRange[1]
    }
  }
  return api.get('/orders', { params }) as any
}

export function fetchOrderDetail(id: string): Promise<Order> {
  return api.get(`/orders/${id}`) as any
}

// ============ Positions ============

export function fetchPositions(): Promise<Position[]> {
  return api.get('/positions') as any
}

// ============ Statistics ============

export function fetchGlobalStats(): Promise<GlobalStats> {
  return api.get('/statistics/global') as any
}

export function fetchLeaderStats(leaderId: string): Promise<LeaderStats> {
  return api.get(`/statistics/leader/${leaderId}`) as any
}

// ============ Limit Price ============

export function fetchLimitPriceRules(): Promise<LimitPriceRule[]> {
  return api.get('/limit-prices') as any
}

export function createLimitPriceRule(data: {
  accountId: string; subnetName: string; action: string; targetPrice: string
}): Promise<LimitPriceRule> {
  return api.post('/limit-prices', data) as any
}

export function updateLimitPriceStatus(id: string, status: string): Promise<LimitPriceRule> {
  return api.put(`/limit-prices/${id}/status`, { status }) as any
}

export function deleteLimitPriceRule(id: string): Promise<void> {
  return api.delete(`/limit-prices/${id}`) as any
}

// ============ Settings (Keep mock for now - no backend endpoints) ============

export function fetchProxyConfigs(): Promise<ProxyConfig[]> {
  return import('./mockData').then(m => Promise.resolve(m.mockProxyConfigs))
}

export function fetchNodes(): Promise<NodeInfo[]> {
  return import('./mockData').then(m => Promise.resolve(m.mockNodes))
}

export function fetchNotifications(): Promise<Notification[]> {
  return import('./mockData').then(m => Promise.resolve(m.mockNotifications))
}
