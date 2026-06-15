import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Card, Row, Col, Statistic, Table, Tag, Badge, Skeleton, Typography,
} from 'antd'
import {
  WalletOutlined, TeamOutlined, CopyOutlined, DollarOutlined,
  ArrowUpOutlined, ArrowDownOutlined,
} from '@ant-design/icons'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { fetchDashboardOverview, fetchRecentOrders, fetchSystemStatus } from '@/services/mockServices'
import type { DashboardOverview, Order, SystemStatus } from '@/types'

dayjs.extend(relativeTime)

function formatUptime(seconds: number): string {
  const d = Math.floor(seconds / 86400)
  const h = Math.floor((seconds % 86400) / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const parts: string[] = []
  if (d > 0) parts.push(`${d}d`)
  if (h > 0) parts.push(`${h}h`)
  if (m > 0) parts.push(`${m}m`)
  return parts.join(' ') || '0m'
}

function formatAmount(value: string | number, prefix = ''): string {
  const num = typeof value === 'string' ? parseFloat(value) : value
  if (isNaN(num)) return String(value)
  return `${prefix}${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 })}`
}

const statCards = [
  {
    key: 'totalAssets',
    icon: <WalletOutlined />,
    color: '#1677FF',
    bgColor: 'rgba(22, 119, 255, 0.1)',
    gradient: 'linear-gradient(135deg, rgba(22, 119, 255, 0.15), rgba(22, 119, 255, 0.02))',
  },
  {
    key: 'accountCount',
    icon: <TeamOutlined />,
    color: '#722ED1',
    bgColor: 'rgba(114, 46, 209, 0.1)',
    gradient: 'linear-gradient(135deg, rgba(114, 46, 209, 0.15), rgba(114, 46, 209, 0.02))',
  },
  {
    key: 'activeCopyCount',
    icon: <CopyOutlined />,
    color: '#00B96B',
    bgColor: 'rgba(0, 185, 107, 0.1)',
    gradient: 'linear-gradient(135deg, rgba(0, 185, 107, 0.15), rgba(0, 185, 107, 0.02))',
  },
  {
    key: 'pnl',
    icon: <DollarOutlined />,
    color: '#FF4D4F',
    bgColor: 'rgba(255, 77, 79, 0.1)',
    gradient: 'linear-gradient(135deg, rgba(255, 77, 79, 0.15), rgba(255, 77, 79, 0.02))',
  },
]

export default function Dashboard() {
  const { t } = useTranslation()
  const [overview, setOverview] = useState<DashboardOverview | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [ov, ord, ss] = await Promise.all([
          fetchDashboardOverview(),
          fetchRecentOrders(5),
          fetchSystemStatus(),
        ])
        setOverview(ov)
        setOrders(ord)
        setSystemStatus(ss)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const orderColumns = [
    {
      title: t('order.orderId'),
      dataIndex: 'id',
      key: 'id',
      width: 140,
      render: (id: string) => (
        <Typography.Text copyable style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-secondary)' }}>
          {id.slice(0, 8)}...
        </Typography.Text>
      ),
    },
    {
      title: t('order.type'),
      dataIndex: 'type',
      key: 'type',
      width: 80,
      render: (type: string) => (
        <Tag color={type === 'buy' ? 'green' : 'red'} style={{ borderRadius: 4, fontSize: 12 }}>
          {type === 'buy' ? t('order.typeBuy') : t('order.typeSell')}
        </Tag>
      ),
    },
    {
      title: t('order.businessType'),
      dataIndex: 'businessType',
      key: 'businessType',
      width: 100,
      render: (bt: string) => {
        const bizMap: Record<string, string> = {
          stake: t('order.bizStake'),
          transfer: t('order.bizTransfer'),
          swap: t('order.bizSwap'),
          redeem: t('order.bizRedeem'),
        }
        return <span style={{ color: 'var(--text-secondary)' }}>{bizMap[bt] || bt}</span>
      },
    },
    {
      title: t('order.amount'),
      dataIndex: 'amount',
      key: 'amount',
      width: 130,
      align: 'right' as const,
      render: (amount: string) => (
        <span style={{ fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums', color: 'var(--text-primary)' }}>
          {formatAmount(amount)}
        </span>
      ),
    },
    {
      title: t('common.status'),
      dataIndex: 'status',
      key: 'status',
      width: 90,
      render: (status: string) => {
        const colorMap: Record<string, string> = {
          pending: 'default',
          executing: 'processing',
          completed: 'success',
          failed: 'error',
          cancelled: 'default',
        }
        const statusMap: Record<string, string> = {
          pending: t('order.statusPending'),
          executing: t('order.statusExecuting'),
          completed: t('order.statusCompleted'),
          failed: t('order.statusFailed'),
          cancelled: t('order.statusCancelled'),
        }
        return <Tag color={colorMap[status] || 'default'}>{statusMap[status] || status}</Tag>
      },
    },
    {
      title: t('order.createdTime'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 160,
      render: (time: string) => (
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-tertiary)' }}>
          {dayjs(time).format('MM-DD HH:mm')}
        </span>
      ),
    },
  ]

  if (loading) {
    return (
      <div style={{ padding: 24 }}>
        <Row gutter={[20, 20]}>
          {[1, 2, 3, 4].map((i) => (
            <Col xs={24} sm={12} lg={6} key={i}>
              <Card style={{ borderRadius: 16, background: 'var(--card-bg)' }}>
                <Skeleton active paragraph={{ rows: 1 }} />
              </Card>
            </Col>
          ))}
        </Row>
        <Card style={{ borderRadius: 16, marginTop: 20, background: 'var(--card-bg)' }}>
          <Skeleton active paragraph={{ rows: 6 }} />
        </Card>
        <Card style={{ borderRadius: 16, marginTop: 20, background: 'var(--card-bg)' }}>
          <Skeleton active paragraph={{ rows: 3 }} />
        </Card>
      </div>
    )
  }

  const pnlValue = parseFloat(overview?.pnl || '0')
  const isPositive = pnlValue >= 0

  // Dynamic card colors based on P&L
  const pnlCardConfig = {
    color: isPositive ? '#00B96B' : '#FF4D4F',
    bgColor: isPositive ? 'rgba(0, 185, 107, 0.1)' : 'rgba(255, 77, 79, 0.1)',
    gradient: isPositive
      ? 'linear-gradient(135deg, rgba(0, 185, 107, 0.15), rgba(0, 185, 107, 0.02))'
      : 'linear-gradient(135deg, rgba(255, 77, 79, 0.15), rgba(255, 77, 79, 0.02))',
  }

  const cardConfigs = [
    statCards[0],
    statCards[1],
    statCards[2],
    { ...statCards[3], color: pnlCardConfig.color, bgColor: pnlCardConfig.bgColor, gradient: pnlCardConfig.gradient },
  ]

  const statValues = [
    { value: formatAmount(overview?.totalAssets || '0'), suffix: 'TAO' },
    { value: overview?.accountCount ?? 0, suffix: '' },
    { value: overview?.activeCopyCount ?? 0, suffix: '' },
    { value: formatAmount(overview?.pnl || '0'), suffix: 'TAO', prefix: isPositive ? '+' : '' },
  ]

  return (
    <div style={{ padding: 24 }}>
      {/* Page Header */}
      <div style={{ marginBottom: 24 }}>
        <Typography.Title level={4} style={{ margin: 0, color: 'var(--text-primary)' }}>
          {t('nav.dashboard')}
        </Typography.Title>
        <Typography.Text style={{ color: 'var(--text-tertiary)', fontSize: 14 }}>
          {dayjs().format('YYYY-MM-DD dddd')}
        </Typography.Text>
      </div>

      {/* Row 1: Stat Cards */}
      <Row gutter={[20, 20]}>
        {cardConfigs.map((cfg, idx) => {
          const val = statValues[idx]
          return (
            <Col xs={24} sm={12} lg={6} key={cfg.key}>
              <Card
                hoverable
                style={{
                  borderRadius: 16,
                  border: '1px solid var(--border-color)',
                  background: cfg.gradient,
                  backdropFilter: 'blur(12px)',
                  transition: 'all 0.3s ease',
                }}
                className="dashboard-stat-card"
                styles={{ body: { padding: 24 } }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      background: cfg.bgColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 20,
                      color: cfg.color,
                    }}
                  >
                    {cfg.icon}
                  </div>
                  {idx === 3 && (
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 8,
                        background: isPositive ? 'rgba(0, 185, 107, 0.15)' : 'rgba(255, 77, 79, 0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 14,
                        color: isPositive ? '#00B96B' : '#FF4D4F',
                      }}
                    >
                      {isPositive ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                    </div>
                  )}
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-tertiary)', marginBottom: 8, fontWeight: 500 }}>
                  {t(`dashboard.${cfg.key === 'pnl' ? 'totalPnl' : cfg.key === 'totalAssets' ? 'totalAssets' : cfg.key === 'accountCount' ? 'totalAccounts' : 'activeCopyTrades'}`)}
                </div>
                <div
                  style={{
                    fontSize: 26,
                    fontWeight: 600,
                    fontFamily: 'var(--font-mono)',
                    fontVariantNumeric: 'tabular-nums',
                    color: idx === 3 ? cfg.color : 'var(--text-primary)',
                    lineHeight: 1.2,
                  }}
                >
                  {val.prefix || ''}{val.value}
                  {val.suffix && (
                    <span style={{ fontSize: 14, fontWeight: 400, color: 'var(--text-tertiary)', marginLeft: 4 }}>
                      {val.suffix}
                    </span>
                  )}
                </div>
              </Card>
            </Col>
          )
        })}
      </Row>

      {/* Row 2: Today P&L + Orders in two columns */}
      <Row gutter={20} style={{ marginTop: 20 }}>
        {/* Today P&L Mini Card */}
        <Col xs={24} lg={6}>
          <Card
            style={{
              borderRadius: 16,
              border: '1px solid var(--border-color)',
              background: 'var(--card-bg)',
              height: '100%',
            }}
            styles={{ body: { padding: 24 } }}
          >
            <div style={{ fontSize: 13, color: 'var(--text-tertiary)', marginBottom: 4 }}>
              {t('dashboard.todayPnl')}
            </div>
            <div
              style={{
                fontSize: 28,
                fontWeight: 700,
                fontFamily: 'var(--font-mono)',
                color: isPositive ? '#00B96B' : '#FF4D4F',
                lineHeight: 1.2,
                marginBottom: 12,
              }}
            >
              {isPositive ? '+' : ''}{formatAmount(overview?.todayPnl || '0')} TAO
            </div>
            <div
              style={{
                width: '100%',
                height: 4,
                borderRadius: 2,
                background: 'var(--border-color)',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${Math.min(Math.abs(pnlValue) / 100 * 100, 100)}%`,
                  height: '100%',
                  borderRadius: 2,
                  background: isPositive
                    ? 'linear-gradient(90deg, #00B96B, #36D399)'
                    : 'linear-gradient(90deg, #FF4D4F, #FF7875)',
                  transition: 'width 0.8s ease',
                }}
              />
            </div>
            <div style={{ marginTop: 12, fontSize: 12, color: 'var(--text-tertiary)' }}>
              {t('dashboard.totalOrders')}: <span style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{overview?.totalOrders ?? 0}</span>
            </div>
          </Card>
        </Col>

        {/* Recent Orders Table */}
        <Col xs={24} lg={18}>
          <Card
            style={{
              borderRadius: 16,
              border: '1px solid var(--border-color)',
              background: 'var(--card-bg)',
            }}
            styles={{
              header: {
                borderBottom: '1px solid var(--border-color)',
                padding: '16px 24px',
              },
              body: { padding: 0 },
            }}
            title={
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: 15 }}>
                  {t('dashboard.recentOrders')}
                </span>
                <Tag style={{ borderRadius: 12, fontSize: 12 }}>{orders.length}</Tag>
              </div>
            }
          >
            <Table
              dataSource={orders}
              columns={orderColumns}
              rowKey="id"
              pagination={false}
              size="middle"
              style={{ borderRadius: 16 }}
            />
          </Card>
        </Col>
      </Row>

      {/* Row 3: System Status */}
      <Card
        style={{
          borderRadius: 16,
          border: '1px solid var(--border-color)',
          background: 'var(--card-bg)',
          marginTop: 20,
        }}
        styles={{
          header: {
            borderBottom: '1px solid var(--border-color)',
            padding: '16px 24px',
          },
          body: { padding: 24 },
        }}
        title={
          <span style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: 15 }}>
            {t('dashboard.systemStatus')}
          </span>
        }
      >
        {systemStatus && (
          <Row gutter={[24, 20]}>
            {[
              {
                label: t('dashboard.nodeStatus'),
                value: (
                  <Badge
                    status={systemStatus.nodeConnected ? 'success' : 'error'}
                    text={
                      <span style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                        {systemStatus.nodeConnected ? t('common.online') : t('common.offline')}
                      </span>
                    }
                  />
                ),
              },
              {
                label: t('settings.latency'),
                value: (
                  <span style={{ color: systemStatus.nodeLatency < 200 ? '#00B96B' : systemStatus.nodeLatency < 500 ? '#FAAD14' : '#FF4D4F', fontFamily: 'var(--font-mono)' }}>
                    {systemStatus.nodeLatency} ms
                  </span>
                ),
              },
              {
                label: t('dashboard.proxyStatus'),
                value: (
                  <Badge
                    status={systemStatus.proxyStatus === 'online' ? 'success' : systemStatus.proxyStatus === 'offline' ? 'default' : 'error'}
                    text={
                      <span style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                        {systemStatus.proxyStatus === 'online' ? t('common.online') : systemStatus.proxyStatus === 'offline' ? t('common.offline') : t('common.error')}
                      </span>
                    }
                  />
                ),
              },
              {
                label: t('dashboard.lastBlock'),
                value: (
                  <span style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                    #{systemStatus.lastBlock.toLocaleString()}
                  </span>
                ),
              },
              {
                label: t('dashboard.uptime'),
                value: (
                  <span style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                    {formatUptime(systemStatus.uptime)}
                  </span>
                ),
              },
            ].map((item) => (
              <Col xs={12} sm={8} lg={4} key={item.label}>
                <div style={{ fontSize: 13, color: 'var(--text-tertiary)', marginBottom: 6, fontWeight: 500 }}>
                  {item.label}
                </div>
                <div style={{ fontSize: 15 }}>{item.value}</div>
              </Col>
            ))}
          </Row>
        )}
      </Card>
    </div>
  )
}