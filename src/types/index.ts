// ============ Auth ============
export interface LoginRequest {
  username: string
  password: string
}

export interface UserInfo {
  id: string
  username: string
  role: string
  email?: string
  avatar?: string
}

export interface LoginResponse {
  token: string
  userInfo: UserInfo
}

// ============ Account ============
export interface Account {
  id: string
  address: string
  name: string
  network: string
  status: AccountStatus
  balance?: string
  staked?: string
  createdAt: string
}

export type AccountStatus = 'active' | 'disabled' | 'error'

export interface Transaction {
  id: string
  type: 'stake' | 'unstake' | 'transfer' | 'swap'
  amount: string
  status: string
  fee?: string
  txHash?: string
  createdAt: string
}

export interface AccountDetail extends Account {
  privateKeyEncrypted: string
  subnetPower?: string
  transactions?: Transaction[]
}

// ============ Leader ============
export interface Leader {
  id: string
  address: string
  name: string
  remark?: string
  status: 'active' | 'disabled'
  winRate?: number
  totalPnl?: string
  totalOrders?: number
}

// ============ Copy Template ============
export interface CopyTemplate {
  id: string
  name: string
  copyType: 'ratio' | 'fixed'
  copyRatio?: number
  fixedAmount?: string
  dailyLossLimit?: string
  maxOpsPerDay: number
  slippageTolerance: number
  stakeRiskThreshold?: string
  status: 'active' | 'disabled'
  createdAt: string
}

// ============ Copy Trade ============
export interface CopyTrade {
  id: string
  accountId: string
  accountName?: string
  leaderId: string
  leaderName?: string
  templateId: string
  templateName?: string
  status: 'active' | 'paused' | 'disabled'
  createdAt: string
}

// ============ Order ============
export interface Order {
  id: string
  type: 'buy' | 'sell'
  businessType: 'stake' | 'transfer' | 'swap' | 'redeem'
  status: OrderStatus
  amount: string
  fee?: string
  accountId: string
  accountName?: string
  leaderId?: string
  leaderName?: string
  copyTradeId?: string
  txHash?: string
  createdAt: string
}

export type OrderStatus =
  | 'pending'
  | 'executing'
  | 'completed'
  | 'failed'
  | 'cancelled'

// ============ Position ============
export interface Position {
  id: string
  accountId: string
  accountName?: string
  assetType: 'tao_balance' | 'subnet_stake'
  balance: string
  staked: string
  subnetPower?: string
  updatedAt: string
}

// ============ Statistics ============
export interface GlobalStats {
  totalAssets: string
  totalPnl: string
  totalStaked: string
  totalFees: string
  accountCount: number
  activeCopyCount: number
  totalOrders: number
  winRate: number
}

export interface LeaderStats {
  leaderId: string
  totalOrders: number
  winRate: number
  totalPnl: string
  avgProfit: string
  totalStaked: string
  periodLabel: string
}

export interface CopyTradeStats {
  copyTradeId: string
  totalOrders: number
  totalPnl: string
  dailyPnl: string
  weeklyPnl: string
  monthlyPnl: string
  maxDrawdown: string
}

// ============ Dashboard ============
export interface DashboardOverview {
  totalAssets: string
  accountCount: number
  activeCopyCount: number
  pnl: string
  todayPnl: string
  totalOrders: number
}

export interface SystemStatus {
  nodeConnected: boolean
  nodeLatency: number
  proxyStatus: 'online' | 'offline' | 'error'
  lastBlock: number
  uptime: number
}

// ============ Proxy & Node ============
export interface ProxyConfig {
  id: string
  name: string
  host: string
  port: number
  protocol: 'http' | 'socks5'
  status: 'online' | 'offline' | 'error'
  latency: number
}

export interface NodeInfo {
  id: string
  url: string
  type: 'RPC' | 'WSS'
  status: 'online' | 'offline' | 'degraded'
  latency: number
  lastBlock?: number
  location?: string
}

// ============ Common ============
export interface PageResponse<T> {
  content: T[]
  total: number
  page: number
  size: number
}

// ============ Limit Price ============
export interface LimitPriceRule {
  id: string
  accountId: string
  accountName?: string
  subnetName: string
  action: 'stake' | 'redeem'
  targetPrice: string
  currentPrice: string
  status: 'active' | 'triggered' | 'paused'
  createdAt: string
}

export interface Notification {
  id: string
  type: 'order' | 'system' | 'alert'
  title: string
  message: string
  severity: 'info' | 'warning' | 'error'
  read: boolean
  createdAt: string
}
