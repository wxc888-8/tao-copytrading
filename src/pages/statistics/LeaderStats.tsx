import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, Select, Row, Col, Progress, Skeleton, Typography, Tag, Divider } from 'antd'
import {
  OrderedListOutlined, RiseOutlined, BankOutlined,
  ArrowUpOutlined, ArrowDownOutlined,
  TrophyOutlined,
} from '@ant-design/icons'
import { fetchLeaders, fetchLeaderStats } from '@/services/mockServices'
import type { Leader, LeaderStats } from '@/types'
import dayjs from 'dayjs'

function formatAmount(value: string | number): string {
  const num = typeof value === 'string' ? parseFloat(value) : value
  if (isNaN(num)) return String(value)
  return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 })
}

function isPositive(value: string): boolean {
  return parseFloat(value) >= 0
}

export default function LeaderStatsPage() {
  const { t } = useTranslation()
  const [leaders, setLeaders] = useState<Leader[]>([])
  const [selectedLeaderId, setSelectedLeaderId] = useState<string | undefined>()
  const [stats, setStats] = useState<LeaderStats | null>(null)
  const [loadingLeaders, setLoadingLeaders] = useState(true)
  const [loadingStats, setLoadingStats] = useState(false)

  useEffect(() => {
    fetchLeaders().then((res) => {
      setLeaders(res)
      setLoadingLeaders(false)
    })
  }, [])

  useEffect(() => {
    if (!selectedLeaderId) return
    setLoadingStats(true)
    fetchLeaderStats(selectedLeaderId).then((res) => {
      setStats(res)
      setLoadingStats(false)
    })
  }, [selectedLeaderId])

  const selectedLeader = leaders.find((l) => l.id === selectedLeaderId)

  return (
    <div style={{ padding: 24 }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <Typography.Title level={4} style={{ margin: 0, color: 'var(--text-primary)' }}>
          {t('statistics.leaderStats')}
        </Typography.Title>
        <Typography.Text style={{ color: 'var(--text-tertiary)', fontSize: 14 }}>
          {dayjs().format('YYYY-MM-DD')}
        </Typography.Text>
      </div>

      {/* Leader Selector */}
      <Card
        style={{
          borderRadius: 16,
          border: '1px solid var(--border-color)',
          background: 'var(--card-bg)',
          marginBottom: 24,
        }}
        styles={{ body: { padding: '16px 24px' } }}
      >
        <Row align="middle" gutter={16}>
          <Col flex="auto">
            <Typography.Text style={{ color: 'var(--text-secondary)', fontSize: 14, marginRight: 12 }}>
              {t('leader.title')}
            </Typography.Text>
            <Select
              style={{ width: 320 }}
              placeholder={t('leader.selectCategory')}
              loading={loadingLeaders}
              value={selectedLeaderId}
              onChange={setSelectedLeaderId}
              size="large"
              options={leaders.map((l) => ({
                label: `${l.name} (${l.address.slice(0, 8)}...)`,
                value: l.id,
              }))}
            />
          </Col>
          {selectedLeader && (
            <Col>
              <Tag color="blue" style={{ borderRadius: 8, fontSize: 13, padding: '2px 12px' }}>
                {selectedLeader.name}
              </Tag>
            </Col>
          )}
        </Row>
      </Card>

      {!selectedLeaderId && !loadingLeaders && (
        <Card
          style={{
            borderRadius: 16,
            border: '1px solid var(--border-color)',
            background: 'var(--card-bg)',
            textAlign: 'center',
            padding: 60,
          }}
          styles={{ body: { padding: 0 } }}
        >
          <TrophyOutlined style={{ fontSize: 48, color: 'var(--text-tertiary)', marginBottom: 16, display: 'block' }} />
          <Typography.Text style={{ color: 'var(--text-tertiary)', fontSize: 15 }}>
            请选择一个 Leader 查看统计数据
          </Typography.Text>
        </Card>
      )}

      {loadingStats && (
        <Row gutter={[20, 20]}>
          {[1, 2, 3, 4, 5].map((i) => (
            <Col xs={24} sm={12} lg={6} key={i}>
              <Card style={{ borderRadius: 16, background: 'var(--card-bg)' }}>
                <Skeleton active paragraph={{ rows: 1 }} />
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {stats && !loadingStats && (
        <>
          {/* Stat Cards */}
          <Row gutter={[20, 20]}>
            {[
              {
                key: 'totalOrders',
                label: t('statistics.totalOrders'),
                value: stats.totalOrders.toLocaleString(),
                icon: <OrderedListOutlined />,
                color: '#1677FF',
                bgColor: 'rgba(22, 119, 255, 0.1)',
                gradient: 'linear-gradient(135deg, rgba(22, 119, 255, 0.15), rgba(22, 119, 255, 0.02))',
              },
              {
                key: 'winRate',
                label: t('statistics.winRate'),
                value: stats.winRate.toFixed(1) + '%',
                icon: <TrophyOutlined />,
                color: stats.winRate >= 60 ? '#00B96B' : '#FAAD14',
                bgColor: stats.winRate >= 60 ? 'rgba(0, 185, 107, 0.1)' : 'rgba(250, 173, 20, 0.1)',
                gradient: stats.winRate >= 60
                  ? 'linear-gradient(135deg, rgba(0, 185, 107, 0.15), rgba(0, 185, 107, 0.02))'
                  : 'linear-gradient(135deg, rgba(250, 173, 20, 0.15), rgba(250, 173, 20, 0.02))',
              },
              {
                key: 'totalPnl',
                label: t('statistics.totalPnl'),
                value: (isPositive(stats.totalPnl) ? '+' : '') + formatAmount(stats.totalPnl),
                icon: <RiseOutlined />,
                color: isPositive(stats.totalPnl) ? '#00B96B' : '#FF4D4F',
                bgColor: isPositive(stats.totalPnl) ? 'rgba(0, 185, 107, 0.1)' : 'rgba(255, 77, 79, 0.1)',
                gradient: isPositive(stats.totalPnl)
                  ? 'linear-gradient(135deg, rgba(0, 185, 107, 0.15), rgba(0, 185, 107, 0.02))'
                  : 'linear-gradient(135deg, rgba(255, 77, 79, 0.15), rgba(255, 77, 79, 0.02))',
              },
              {
                key: 'avgProfit',
                label: t('statistics.avgProfit'),
                value: formatAmount(stats.avgProfit),
                icon: <RiseOutlined />,
                color: isPositive(stats.avgProfit) ? '#00B96B' : '#FF4D4F',
                bgColor: isPositive(stats.avgProfit) ? 'rgba(0, 185, 107, 0.1)' : 'rgba(255, 77, 79, 0.1)',
                gradient: isPositive(stats.avgProfit)
                  ? 'linear-gradient(135deg, rgba(0, 185, 107, 0.15), rgba(0, 185, 107, 0.02))'
                  : 'linear-gradient(135deg, rgba(255, 77, 79, 0.15), rgba(255, 77, 79, 0.02))',
              },
              {
                key: 'totalStaked',
                label: t('statistics.totalStaked'),
                value: formatAmount(stats.totalStaked),
                icon: <BankOutlined />,
                color: '#722ED1',
                bgColor: 'rgba(114, 46, 209, 0.1)',
                gradient: 'linear-gradient(135deg, rgba(114, 46, 209, 0.15), rgba(114, 46, 209, 0.02))',
              },
            ].map((cfg) => {
              const isPnl = cfg.key === 'totalPnl'
              return (
                <Col xs={24} sm={12} lg={6} key={cfg.key}>
                  <Card
                    hoverable
                    style={{
                      borderRadius: 16,
                      border: '1px solid var(--border-color)',
                      background: cfg.gradient,
                      backdropFilter: 'blur(12px)',
                    }}
                    className="dashboard-stat-card"
                    styles={{ body: { padding: 24 } }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
                      <div style={{
                        width: 44, height: 44, borderRadius: 12,
                        background: cfg.bgColor, display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        fontSize: 20, color: cfg.color,
                      }}>
                        {cfg.icon}
                      </div>
                      {isPnl && (
                        <div style={{
                          width: 28, height: 28, borderRadius: 8,
                          background: isPositive(stats.totalPnl) ? 'rgba(0, 185, 107, 0.15)' : 'rgba(255, 77, 79, 0.15)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 14,
                          color: isPositive(stats.totalPnl) ? '#00B96B' : '#FF4D4F',
                        }}>
                          {isPositive(stats.totalPnl) ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                        </div>
                      )}
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text-tertiary)', marginBottom: 8, fontWeight: 500 }}>
                      {cfg.label}
                    </div>
                    <div style={{
                      fontSize: 24, fontWeight: 600, fontFamily: 'var(--font-mono)',
                      fontVariantNumeric: 'tabular-nums',
                      color: isPnl ? cfg.color : 'var(--text-primary)',
                      lineHeight: 1.2,
                    }}>
                      {cfg.value}
                    </div>
                  </Card>
                </Col>
              )
            })}
          </Row>

          {/* Bottom: Win Rate Ring + Period Info */}
          <Row gutter={20} style={{ marginTop: 24 }}>
            <Col xs={24} lg={8}>
              <Card
                style={{
                  borderRadius: 16,
                  border: '1px solid var(--border-color)',
                  background: 'var(--card-bg)',
                  height: '100%',
                }}
                styles={{ body: { padding: 28, textAlign: 'center' } }}
              >
                <Typography.Text style={{ color: 'var(--text-tertiary)', fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 20 }}>
                  {t('statistics.winRate')}
                </Typography.Text>
                <Progress
                  type="dashboard"
                  percent={stats.winRate}
                  strokeColor={{
                    '0%': stats.winRate >= 60 ? '#00B96B' : '#FAAD14',
                    '100%': stats.winRate >= 60 ? '#36D399' : '#FFD666',
                  }}
                  size={140}
                  format={(pct) => (
                    <div>
                      <div style={{ fontSize: 28, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
                        {pct?.toFixed(1)}
                      </div>
                      <div style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>%</div>
                    </div>
                  )}
                />
                <Divider style={{ borderColor: 'var(--border-color)', margin: '16px 0' }} />
                <div style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{stats.totalOrders}</span> {t('statistics.totalOrders')}
                </div>
              </Card>
            </Col>

            <Col xs={24} lg={16}>
              <Card
                style={{
                  borderRadius: 16,
                  border: '1px solid var(--border-color)',
                  background: 'var(--card-bg)',
                  height: '100%',
                }}
                styles={{ body: { padding: 28 } }}
              >
                <Typography.Text style={{ color: 'var(--text-tertiary)', fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 24 }}>
                  {t('statistics.totalPnl')} Performance
                </Typography.Text>

                {[
                  {
                    label: t('statistics.totalPnl'),
                    value: parseFloat(stats.totalPnl),
                    max: Math.max(Math.abs(parseFloat(stats.totalPnl)), 1),
                  },
                  {
                    label: t('statistics.avgProfit'),
                    value: parseFloat(stats.avgProfit),
                    max: Math.max(Math.abs(parseFloat(stats.avgProfit)), 1),
                  },
                  {
                    label: t('statistics.totalStaked'),
                    value: parseFloat(stats.totalStaked),
                    max: Math.max(parseFloat(stats.totalStaked), 1),
                  },
                ].map((item) => {
                  const isNeg = item.value < 0
                  const pct = Math.min(Math.abs(item.value) / item.max * 100, 100)
                  return (
                    <div key={item.label} style={{ marginBottom: 16 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <span style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{item.label}</span>
                        <span style={{
                          color: isNeg ? '#FF4D4F' : 'var(--text-primary)',
                          fontFamily: 'var(--font-mono)', fontWeight: 600,
                        }}>
                          {isNeg ? '' : '+'}{formatAmount(item.value)}
                        </span>
                      </div>
                      <div style={{
                        width: '100%', height: 6, borderRadius: 3,
                        background: 'var(--border-color)', overflow: 'hidden',
                      }}>
                        <div style={{
                          width: `${pct}%`, height: '100%', borderRadius: 3,
                          background: isNeg ? '#FF4D4F' : '#00B96B',
                          transition: 'width 1s ease',
                        }} />
                      </div>
                    </div>
                  )
                })}
              </Card>
            </Col>
          </Row>
        </>
      )}
    </div>
  )
}