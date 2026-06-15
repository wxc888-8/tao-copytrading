import dayjs from 'dayjs'
import type {
  Account, AccountStatus, Leader,
  CopyTemplate, CopyTrade, Order, OrderStatus, Position,
  DashboardOverview, SystemStatus, GlobalStats, LeaderStats,
  ProxyConfig, NodeInfo, Notification, LimitPriceRule,
  AccountDetail,
} from '@/types'

// ============ 补充类型定义 ============

export interface Transaction {
  id: string
  type: 'stake' | 'unstake' | 'transfer' | 'swap'
  amount: string
  status: string
  txHash: string
  createdAt: string
}

export interface LeaderDetail extends Leader {
  totalStaked: string
  avgProfit: string
  maxDrawdown: string
  transactions?: Transaction[]
  historicalPerformance?: { period: string; pnl: string; winRate: number }[]
}

// ============ 辅助函数 ============

function subAddress(index: number): string {
  const addresses = [
    '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
    '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty',
    '5FLkJ1qXbC6LsiP2A3oFD3Kqv5RsDCByKq1TbL4JhqF5KVJ1',
    '5DAAnrj7VHTznn2AWBemMuyBwZWs6FNFjdyVX1UuebKdTuVH',
    '5HGjWAeFDfFCWPsjFrfQvTg9C7VfJfPcM9J8oDgYDLD9Vd9G',
    '5CJCHZ9PcvLZYfLMSREK3AvsHGtCJcNiGEbR1fZgQbJFjz1W',
    '5EhvLJpEaFBFSf5U5B4KBdMiJ3A4KXH5PkKFn8jC3nKPzkak',
    '5GZ8PqJfKZzQH3gRQqGqGp8WqGqGp8WqGqGp8WqGqGp8WqGqG',
  ]
  return addresses[index % addresses.length]
}

function randomStatus<T extends string>(states: T[]): T {
  return states[Math.floor(Math.random() * states.length)]
}

function randomAmount(min: number, max: number, decimals = 4): string {
  return (Math.random() * (max - min) + min).toFixed(decimals)
}

// ============ Mock Accounts ============

export const mockAccounts: Account[] = [
  {
    id: 'acc-001',
    address: subAddress(0),
    name: '主账户',
    network: 'subnet-01',
    status: 'active',
    balance: '12500.5000',
    staked: '50000.0000',
    createdAt: dayjs().subtract(30, 'day').toISOString(),
  },
  {
    id: 'acc-002',
    address: subAddress(1),
    name: '测试账户',
    network: 'subnet-02',
    status: 'active',
    balance: '3200.7500',
    staked: '10000.0000',
    createdAt: dayjs().subtract(20, 'day').toISOString(),
  },
  {
    id: 'acc-003',
    address: subAddress(2),
    name: '备用账户',
    network: 'subnet-01',
    status: 'disabled',
    balance: '500.0000',
    staked: '0.0000',
    createdAt: dayjs().subtract(15, 'day').toISOString(),
  },
  {
    id: 'acc-004',
    address: subAddress(3),
    name: '跟单账户',
    network: 'subnet-03',
    status: 'active',
    balance: '8900.2500',
    staked: '25000.0000',
    createdAt: dayjs().subtract(10, 'day').toISOString(),
  },
  {
    id: 'acc-005',
    address: subAddress(4),
    name: '归档账户',
    network: 'subnet-01',
    status: 'disabled',
    balance: '0.0000',
    staked: '0.0000',
    createdAt: dayjs().subtract(60, 'day').toISOString(),
  },
]

// ============ Mock Leaders ============

export const mockLeaders: Leader[] = [
  {
    id: 'leader-001',
    address: subAddress(5),
    name: 'Alpha Trader',
    remark: '高频交易策略',
    status: 'active',
    winRate: 78.5,
    totalPnl: '+15230.0000',
    totalOrders: 342,
  },
  {
    id: 'leader-002',
    address: subAddress(6),
    name: 'Beta Staker',
    remark: '低风险质押策略',
    status: 'active',
    winRate: 95.2,
    totalPnl: '+8900.5000',
    totalOrders: 56,
  },
  {
    id: 'leader-003',
    address: subAddress(7),
    name: 'Gamma Arbitrage',
    remark: '套利交易策略',
    status: 'disabled',
    winRate: 62.8,
    totalPnl: '-1200.0000',
    totalOrders: 189,
  },
  {
    id: 'leader-004',
    address: subAddress(0),
    name: 'Delta Stake',
    remark: '长期质押策略',
    status: 'active',
    winRate: 100.0,
    totalPnl: '+5600.7500',
    totalOrders: 12,
  },
]

// ============ Mock Templates ============

export const mockTemplates: CopyTemplate[] = [
  {
    id: 'template-1',
    name: '保守跟单模板',
    copyType: 'ratio',
    copyRatio: 0.3,
    dailyLossLimit: '1000',
    maxOpsPerDay: 5,
    slippageTolerance: 0.5,
    status: 'active',
    createdAt: dayjs().subtract(3, 'day').format('YYYY-MM-DDTHH:mm:ss'),
  },
  {
    id: 'template-2',
    name: '激进跟单模板',
    copyType: 'ratio',
    copyRatio: 1.0,
    dailyLossLimit: '10000',
    maxOpsPerDay: 20,
    slippageTolerance: 1,
    status: 'active',
    createdAt: dayjs().subtract(5, 'day').format('YYYY-MM-DDTHH:mm:ss'),
  },
  {
    id: 'template-3',
    name: '固定金额模板',
    copyType: 'fixed',
    fixedAmount: '100',
    dailyLossLimit: '2000',
    maxOpsPerDay: 10,
    slippageTolerance: 0.3,
    status: 'disabled',
    createdAt: dayjs().subtract(7, 'day').format('YYYY-MM-DDTHH:mm:ss'),
  },
]

// ============ Mock Copy Trades ============

export const mockCopyTrades: CopyTrade[] = [
  {
    id: 'ct-001',
    accountId: 'acc-001',
    accountName: '主账户',
    leaderId: 'leader-001',
    leaderName: 'Alpha Trader',
    templateId: 'tpl-001',
    templateName: '标准比例跟单',
    status: 'active',
    createdAt: dayjs().subtract(20, 'day').toISOString(),
  },
  {
    id: 'ct-002',
    accountId: 'acc-004',
    accountName: '跟单账户',
    leaderId: 'leader-002',
    leaderName: 'Beta Staker',
    templateId: 'tpl-002',
    templateName: '保守比例跟单',
    status: 'active',
    createdAt: dayjs().subtract(15, 'day').toISOString(),
  },
  {
    id: 'ct-003',
    accountId: 'acc-001',
    accountName: '主账户',
    leaderId: 'leader-004',
    leaderName: 'Delta Stake',
    templateId: 'tpl-003',
    templateName: '固定金额跟单',
    status: 'paused',
    createdAt: dayjs().subtract(10, 'day').toISOString(),
  },
  {
    id: 'ct-004',
    accountId: 'acc-002',
    accountName: '测试账户',
    leaderId: 'leader-003',
    leaderName: 'Gamma Arbitrage',
    templateId: 'tpl-001',
    templateName: '标准比例跟单',
    status: 'disabled',
    createdAt: dayjs().subtract(5, 'day').toISOString(),
  },
]

// ============ Mock Orders ============

const orderStatuses: OrderStatus[] = ['pending', 'executing', 'completed', 'failed', 'cancelled']

export const mockOrders: Order[] = [
  {
    id: 'ord-001',
    type: 'buy',
    businessType: 'stake',
    status: 'completed',
    amount: '5000.0000',
    fee: '0.5000',
    accountId: 'acc-001',
    accountName: '主账户',
    leaderId: 'leader-001',
    leaderName: 'Alpha Trader',
    copyTradeId: 'ct-001',
    txHash: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890',
    createdAt: dayjs().subtract(5, 'hour').toISOString(),
  },
  {
    id: 'ord-002',
    type: 'buy',
    businessType: 'stake',
    status: 'completed',
    amount: '2000.0000',
    fee: '0.2000',
    accountId: 'acc-004',
    accountName: '跟单账户',
    leaderId: 'leader-002',
    leaderName: 'Beta Staker',
    copyTradeId: 'ct-002',
    txHash: '0x2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef12345678901',
    createdAt: dayjs().subtract(3, 'hour').toISOString(),
  },
  {
    id: 'ord-003',
    type: 'sell',
    businessType: 'redeem',
    status: 'completed',
    amount: '1000.0000',
    fee: '0.1000',
    accountId: 'acc-001',
    accountName: '主账户',
    leaderId: 'leader-001',
    leaderName: 'Alpha Trader',
    copyTradeId: 'ct-001',
    txHash: '0x3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef123456789012',
    createdAt: dayjs().subtract(2, 'hour').toISOString(),
  },
  {
    id: 'ord-004',
    type: 'buy',
    businessType: 'swap',
    status: 'pending',
    amount: '500.0000',
    accountId: 'acc-002',
    accountName: '测试账户',
    createdAt: dayjs().subtract(30, 'minute').toISOString(),
  },
  {
    id: 'ord-005',
    type: 'sell',
    businessType: 'transfer',
    status: 'executing',
    amount: '800.0000',
    fee: '0.0800',
    accountId: 'acc-004',
    accountName: '跟单账户',
    txHash: '0x4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890123',
    createdAt: dayjs().subtract(15, 'minute').toISOString(),
  },
  {
    id: 'ord-006',
    type: 'buy',
    businessType: 'stake',
    status: 'completed',
    amount: '3000.0000',
    fee: '0.3000',
    accountId: 'acc-001',
    accountName: '主账户',
    leaderId: 'leader-004',
    leaderName: 'Delta Stake',
    copyTradeId: 'ct-003',
    txHash: '0x5e6f7890abcdef1234567890abcdef1234567890abcdef12345678901234',
    createdAt: dayjs().subtract(1, 'day').toISOString(),
  },
  {
    id: 'ord-007',
    type: 'buy',
    businessType: 'swap',
    status: 'failed',
    amount: '200.0000',
    fee: '0.0200',
    accountId: 'acc-003',
    accountName: '备用账户',
    createdAt: dayjs().subtract(2, 'day').toISOString(),
  },
  {
    id: 'ord-008',
    type: 'sell',
    businessType: 'redeem',
    status: 'cancelled',
    amount: '1500.0000',
    accountId: 'acc-002',
    accountName: '测试账户',
    createdAt: dayjs().subtract(3, 'day').toISOString(),
  },
  {
    id: 'ord-009',
    type: 'buy',
    businessType: 'transfer',
    status: 'completed',
    amount: '100.0000',
    fee: '0.0100',
    accountId: 'acc-001',
    accountName: '主账户',
    txHash: '0x6f7890abcdef1234567890abcdef1234567890abcdef123456789012345',
    createdAt: dayjs().subtract(4, 'day').toISOString(),
  },
  {
    id: 'ord-010',
    type: 'sell',
    businessType: 'stake',
    status: 'pending',
    amount: '2500.0000',
    accountId: 'acc-004',
    accountName: '跟单账户',
    leaderId: 'leader-002',
    leaderName: 'Beta Staker',
    copyTradeId: 'ct-002',
    createdAt: dayjs().subtract(5, 'day').toISOString(),
  },
]

// ============ Mock Positions ============

export const mockPositions: Position[] = [
  {
    id: 'pos-001',
    accountId: 'acc-001',
    accountName: '主账户',
    assetType: 'tao_balance',
    balance: '12500.5000',
    staked: '50000.0000',
    updatedAt: dayjs().subtract(10, 'minute').toISOString(),
  },
  {
    id: 'pos-002',
    accountId: 'acc-001',
    accountName: '主账户',
    assetType: 'subnet_stake',
    balance: '0.0000',
    staked: '30000.0000',
    subnetPower: '8500.0000',
    updatedAt: dayjs().subtract(10, 'minute').toISOString(),
  },
  {
    id: 'pos-003',
    accountId: 'acc-002',
    accountName: '测试账户',
    assetType: 'tao_balance',
    balance: '3200.7500',
    staked: '10000.0000',
    updatedAt: dayjs().subtract(20, 'minute').toISOString(),
  },
  {
    id: 'pos-004',
    accountId: 'acc-002',
    accountName: '测试账户',
    assetType: 'subnet_stake',
    balance: '0.0000',
    staked: '8000.0000',
    subnetPower: '2200.0000',
    updatedAt: dayjs().subtract(20, 'minute').toISOString(),
  },
  {
    id: 'pos-005',
    accountId: 'acc-004',
    accountName: '跟单账户',
    assetType: 'tao_balance',
    balance: '8900.2500',
    staked: '25000.0000',
    updatedAt: dayjs().subtract(5, 'minute').toISOString(),
  },
  {
    id: 'pos-006',
    accountId: 'acc-004',
    accountName: '跟单账户',
    assetType: 'subnet_stake',
    balance: '0.0000',
    staked: '15000.0000',
    subnetPower: '4200.0000',
    updatedAt: dayjs().subtract(5, 'minute').toISOString(),
  },
  {
    id: 'pos-007',
    accountId: 'acc-003',
    accountName: '备用账户',
    assetType: 'tao_balance',
    balance: '500.0000',
    staked: '0.0000',
    updatedAt: dayjs().subtract(1, 'day').toISOString(),
  },
  {
    id: 'pos-008',
    accountId: 'acc-005',
    accountName: '归档账户',
    assetType: 'tao_balance',
    balance: '0.0000',
    staked: '0.0000',
    updatedAt: dayjs().subtract(30, 'day').toISOString(),
  },
]

// ============ Mock Dashboard Overview ============

export const mockDashboardOverview: DashboardOverview = {
  totalAssets: '125000.0000',
  accountCount: 5,
  activeCopyCount: 2,
  pnl: '+15230.0000',
  todayPnl: '+350.5000',
  totalOrders: 342,
}

// ============ Mock System Status ============

export const mockSystemStatus: SystemStatus = {
  nodeConnected: true,
  nodeLatency: 45,
  proxyStatus: 'online',
  lastBlock: 23456789,
  uptime: 86400 * 3, // 3 days in seconds
}

// ============ Mock Global Stats ============

export const mockGlobalStats: GlobalStats = {
  totalAssets: '125000.0000',
  totalPnl: '+15230.0000',
  totalStaked: '113000.0000',
  totalFees: '1250.5000',
  accountCount: 5,
  activeCopyCount: 2,
  totalOrders: 342,
  winRate: 78.5,
}

// ============ Mock Notifications ============

export const mockNotifications: Notification[] = [
  {
    id: 'notif-001',
    type: 'order',
    title: '订单执行成功',
    message: '质押订单 ord-005 已成功执行',
    severity: 'info',
    read: false,
    createdAt: dayjs().subtract(1, 'hour').toISOString(),
  },
  {
    id: 'notif-002',
    type: 'alert',
    title: '节点掉线',
    message: 'WSS 节点 wss://tao-rpc-1 连接中断',
    severity: 'error',
    read: false,
    createdAt: dayjs().subtract(2, 'hour').toISOString(),
  },
  {
    id: 'notif-003',
    type: 'system',
    title: '系统更新',
    message: '系统已升级至 v2.1.0',
    severity: 'info',
    read: true,
    createdAt: dayjs().subtract(1, 'day').toISOString(),
  },
]

// ============ Mock Limit Price Rules ============

export const mockLimitPriceRules: LimitPriceRule[] = [
  {
    id: 'lp-001',
    accountId: 'acc-001',
    accountName: '主账户',
    subnetName: 'subnet-1',
    action: 'redeem',
    targetPrice: '350.00',
    currentPrice: '285.60',
    status: 'active',
    createdAt: dayjs().subtract(2, 'day').toISOString(),
  },
  {
    id: 'lp-002',
    accountId: 'acc-002',
    accountName: '测试账户',
    subnetName: 'subnet-3',
    action: 'stake',
    targetPrice: '180.00',
    currentPrice: '165.20',
    status: 'active',
    createdAt: dayjs().subtract(5, 'day').toISOString(),
  },
  {
    id: 'lp-003',
    accountId: 'acc-001',
    accountName: '主账户',
    subnetName: 'subnet-2',
    action: 'redeem',
    targetPrice: '520.00',
    currentPrice: '523.80',
    status: 'triggered',
    createdAt: dayjs().subtract(1, 'day').toISOString(),
  },
]

// ============ Mock Proxy Configs ============

export const mockProxyConfigs: ProxyConfig[] = [
  {
    id: 'proxy-001',
    name: '主代理',
    host: '192.168.1.100',
    port: 1080,
    protocol: 'socks5',
    status: 'online',
    latency: 23,
  },
  {
    id: 'proxy-002',
    name: '备用代理',
    host: '192.168.1.101',
    port: 3128,
    protocol: 'http',
    status: 'online',
    latency: 45,
  },
  {
    id: 'proxy-003',
    name: '海外代理',
    host: '10.0.0.50',
    port: 1080,
    protocol: 'socks5',
    status: 'error',
    latency: 0,
  },
]

// ============ Mock Nodes ============

export const mockNodes: NodeInfo[] = [
  {
    id: 'node-001',
    url: 'wss://subnet-01.tao.network',
    type: 'WSS',
    status: 'online',
    latency: 35,
    lastBlock: 23456789,
    location: 'us-east',
  },
  {
    id: 'node-002',
    url: 'https://subnet-01.tao.network/rpc',
    type: 'RPC',
    status: 'online',
    latency: 42,
    lastBlock: 23456789,
    location: 'us-west',
  },
  {
    id: 'node-003',
    url: 'wss://subnet-02.tao.network',
    type: 'WSS',
    status: 'degraded',
    latency: 120,
    lastBlock: 23456788,
    location: 'eu-central',
  },
  {
    id: 'node-004',
    url: 'https://subnet-03.tao.network/rpc',
    type: 'RPC',
    status: 'offline',
    latency: 0,
    location: 'ap-southeast',
  },
]

// ============ Mock Leader Stats ============

export const mockLeaderStats: LeaderStats[] = [
  {
    leaderId: 'leader-001',
    totalOrders: 342,
    winRate: 78.5,
    totalPnl: '+15230.0000',
    avgProfit: '+44.5300',
    totalStaked: '85000.0000',
    periodLabel: 'all_time',
  },
  {
    leaderId: 'leader-002',
    totalOrders: 56,
    winRate: 95.2,
    totalPnl: '+8900.5000',
    avgProfit: '+158.9400',
    totalStaked: '45000.0000',
    periodLabel: 'all_time',
  },
  {
    leaderId: 'leader-003',
    totalOrders: 189,
    winRate: 62.8,
    totalPnl: '-1200.0000',
    avgProfit: '-6.3500',
    totalStaked: '15000.0000',
    periodLabel: 'all_time',
  },
  {
    leaderId: 'leader-004',
    totalOrders: 12,
    winRate: 100.0,
    totalPnl: '+5600.7500',
    avgProfit: '+466.7300',
    totalStaked: '52000.0000',
    periodLabel: 'all_time',
  },
]

// ============ 辅助函数 ============

export function getMockAccountDetail(id: string): AccountDetail | undefined {
  const account = mockAccounts.find(a => a.id === id)
  if (!account) return undefined

  const accountTransactions: Transaction[] = [
    {
      id: 'txn-001',
      type: 'stake',
      amount: '5000.0000',
      status: 'completed',
      txHash: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890',
      createdAt: dayjs().subtract(5, 'hour').toISOString(),
    },
    {
      id: 'txn-002',
      type: 'unstake',
      amount: '1000.0000',
      status: 'completed',
      txHash: '0x2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef12345678901',
      createdAt: dayjs().subtract(2, 'hour').toISOString(),
    },
    {
      id: 'txn-003',
      type: 'transfer',
      amount: '500.0000',
      status: 'completed',
      txHash: '0x3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef123456789012',
      createdAt: dayjs().subtract(1, 'day').toISOString(),
    },
  ]

  return {
    ...account,
    privateKeyEncrypted: 'encrypted_' + account.id + '_key_data',
    subnetPower: account.id === 'acc-001' ? '8500.0000' : undefined,
    transactions: accountTransactions,
  }
}

export function getMockLeaderDetail(id: string): LeaderDetail | undefined {
  const leader = mockLeaders.find(l => l.id === id)
  if (!leader) return undefined

  const mockHistoricalData = [
    { period: '1d', pnl: '+120.5000', winRate: 80.0 },
    { period: '7d', pnl: '+850.0000', winRate: 75.0 },
    { period: '30d', pnl: '+3200.0000', winRate: 78.5 },
  ]

  const leaderTransactions: Transaction[] = [
    {
      id: 'ltxn-001',
      type: 'stake',
      amount: '10000.0000',
      status: 'completed',
      txHash: '0x4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890123',
      createdAt: dayjs().subtract(7, 'day').toISOString(),
    },
    {
      id: 'ltxn-002',
      type: 'swap',
      amount: '2000.0000',
      status: 'completed',
      txHash: '0x5e6f7890abcdef1234567890abcdef1234567890abcdef12345678901234',
      createdAt: dayjs().subtract(3, 'day').toISOString(),
    },
  ]

  return {
    ...leader,
    totalStaked: '85000.0000',
    avgProfit: '+44.5300',
    maxDrawdown: '-8.5',
    transactions: leaderTransactions,
    historicalPerformance: mockHistoricalData,
  }
}

export function getMockLeaderStats(leaderId: string): LeaderStats {
  const stats = mockLeaderStats.find(s => s.leaderId === leaderId)
  return stats ?? {
    leaderId,
    totalOrders: 0,
    winRate: 0,
    totalPnl: '0.0000',
    avgProfit: '0.0000',
    totalStaked: '0.0000',
    periodLabel: 'all_time',
  }
}
