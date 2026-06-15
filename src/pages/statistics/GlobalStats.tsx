import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, Row, Col, Progress, Skeleton, Typography, Tag, Divider } from 'antd'
import {
  WalletOutlined, RiseOutlined, BankOutlined,
  PercentageOutlined, OrderedListOutlined,
  ArrowUpOutlined, ArrowDownOutlined,
  SwapOutlined,
} from '@ant-design/icons'
import dayjs from 'dayjs'
import { fetchGlobalStats } from '@/services/mockServices'
import type { GlobalStats } from '@/types'

function formatAmount(value: string | number): string {
  const num = typeof value === 'string' ? parseFloat(value) : value
  if (isNaN(num)) return String(value)
  return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 })
}

export default function GlobalStatsPage() {
  const { t } = useTranslation()
  const [data, setData] = useState<GlobalStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchGlobalStats().then((res) => {
      setData(res)
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <div style={{ padding: 24 }}>
        <Row gutter={[20, 20]}>
          {[1, 2, 3, 4, 5].map((i) => (
            <Col xs={24} sm={12} lg={6} key={i}>
              <Card style={{ borderRadius: 16, background: 'var(--card-bg)' }}>
                <Skeleton active paragraph={{ rows: 1 }} />
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    )
  }

  if (!data) return null

  const pnlNum = parseFloat(data.totalPnl)
  const pnlPositive = pnlNum >= 0

  const statCards = [
    {
      key: 'totalAssets',
      label: t('statistics.totalAssets'),
      value: formatAmount(data.totalAssets) + ' TAO',
      icon: <WalletOutlined />,
      color: '#1677FF',
      bgColor: 'rgba(22, 119, 255, 0.1)',
      gradient: 'linear-gradient(135deg, rgba(22, 119, 255, 0.15), rgba(22, 119, 255, 0.02))',
    },
    {
      key: 'totalPnl',
      label: t('statistics.totalPnl'),
      value: (pnlPositive ? '+' : '') + formatAmount(data.totalPnl) + ' TAO',
      icon: <RiseOutlined />,
      color: pnlPositive ? '#00B96B' : '#FF4D4F',
      bgColor: pnlPositive ? 'rgba(0, 185, 107, 0.1)' : 'rgba(255, 77, 79, 0.1)',
      gradient: pnlPositive
        ? 'linear-gradient(135deg, rgba(0, 185, 107, 0.15), rgba(0, 185, 107, 0.02))'
        : 'linear-gradient(135deg, rgba(255, 77, 79, 0.15), rgba(255, 77, 79, 0.02))',
    },
    {
      key: 'totalStaked',
      label: t('statistics.totalStaked'),
      value: formatAmount(data.totalStaked) + ' TAO',
      icon: <BankOutlined />,
      color: '#722ED1',
      bgColor: 'rgba(114, 46, 209, 0.1)',
      gradient: 'linear-gradient(135deg, rgba(114, 46, 209, 0.15), rgba(114, 46, 209, 0.02))',
    },
    {
      key: 'totalFees',
      label: t('statistics.totalFees'),
      value: formatAmount(data.totalFees) + ' TAO',
      icon: <SwapOutlined />,
      color: '#FA8C16',
      bgColor: 'rgba(250, 140, 22, 0.1)',
      gradient: 'linear-gradient(135deg, rgba(250, 140, 22, 0.15), rgba(250, 140, 22, 0.02))',
    },
    {
      key: 'totalOrders',
      label: t('statistics.totalOrders'),
      value: data.totalOrders.toLocaleString(),
      icon: <OrderedListOutlined />,
      color: '#13C2C2',
      bgColor: 'rgba(19, 194, 194, 0.1)',
      gradient: 'linear-gradient(135deg, rgba(19, 194, 194, 0.15), rgba(19, 194, 194, 0.02))',
    },
  ]

  return (
    <div style={{ padding: 24 }}>
      {/* Header */}
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Typography.Title level={4} style={{ margin: 0, color: 'var(--text-primary)' }}>
            {t('statistics.global')}
          </Typography.Title>
          <Typography.Text style={{ color: 'var(--text-tertiary)', fontSize: 14 }}>
            {dayjs().format('YYYY-MM-DD')}
          </Typography.Text>
        </div>
        <Tag style={{ borderRadius: 12, fontSize: 13, padding: '4px 12px' }}>
          {t('statistics.winRate')}: {data.winRate.toFixed(1)}%
        </Tag>
      </div>

      {/* Stat Cards */}
      <Row gutter={[20, 20]}>
        {statCards.map((cfg) => (
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
                {cfg.key === 'totalPnl' && (
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      background: pnlPositive ? 'rgba(0, 185, 107, 0.15)' : 'rgba(255, 77, 79, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 14,
                      color: pnlPositive ? '#00B96B' : '#FF4D4F',
                    }}
                  >
                    {pnlPositive ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                  </div>
                )}
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-tertiary)', marginBottom: 8, fontWeight: 500 }}>
                {cfg.label}
              </div>
              <div
                style={{
                  fontSize: 24,
                  fontWeight: 600,
                  fontFamily: 'var(--font-mono)',
                  fontVariantNumeric: 'tabular-nums',
                  color: cfg.key === 'totalPnl' ? cfg.color : 'var(--text-primary)',
                  lineHeight: 1.2,
                }}
              >
                {cfg.value}
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Second Row: Win Rate + Summary */}
      <Row gutter={20} style={{ marginTop: 24 }}>
        {/* Win Rate Ring */}
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
              percent={data.winRate}
              strokeColor={{
                '0%': data.winRate >= 60 ? '#00B96B' : '#FAAD14',
                '100%': data.winRate >= 60 ? '#36D399' : '#FFD666',
              }}
              size={160}
              format={(pct) => (
                <div>
                  <div style={{ fontSize: 32, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
                    {pct?.toFixed(1)}
                  </div>
                  <div style={{ fontSize: 14, color: 'var(--text-tertiary)' }}>%</div>
                </div>
              )}
            />
            <Divider style={{ borderColor: 'var(--border-color)', margin: '20px 0' }} />
            <Row gutter={16}>
              <Col span={12}>
                <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 4 }}>{t('statistics.totalOrders')}</div>
                <div style={{ fontSize: 20, fontWeight: 600, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
                  {data.totalOrders.toLocaleString()}
                </div>
              </Col>
              <Col span={12}>
                <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 4 }}>{t('statistics.totalPnl')}</div>
                <div style={{ fontSize: 20, fontWeight: 600, fontFamily: 'var(--font-mono)', color: pnlPositive ? '#00B96B' : '#FF4D4F' }}>
                  {pnlPositive ? '+' : ''}{formatAmount(data.totalPnl)}
                </div>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Summary Breakdown */}
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
              {t('statistics.totalAssets')} Breakdown
            </Typography.Text>

            {[
              { label: t('statistics.totalStaked'), value: parseFloat(data.totalStaked), color: '#722ED1', max: parseFloat(data.totalAssets) },
              { label: t('statistics.totalFees'), value: parseFloat(data.totalFees), color: '#FA8C16', max: parseFloat(data.totalAssets) },
            ].map((item) => {
              const pct = Math.min((item.value / (item.max || 1)) * 100, 100)
              return (
                <div key={item.label} style={{ marginBottom: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{item.label}</span>
                    <span style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                      {formatAmount(item.value)} TAO
                    </span>
                  </div>
                  <div style={{
                    width: '100%', height: 8, borderRadius: 4,
                    background: 'var(--border-color)', overflow: 'hidden',
                  }}>
                    <div style={{
                      width: `${pct}%`, height: '100%', borderRadius: 4,
                      background: item.color,
                      transition: 'width 1s ease',
                    }} />
                  </div>
                  <div style={{ textAlign: 'right', fontSize: 12, color: 'var(--text-tertiary)', marginTop: 4 }}>
                    {pct.toFixed(1)}% of total
                  </div>
                </div>
              )
            })}
          </Card>
        </Col>
      </Row>
    </div>
  )
}