import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Card, Descriptions, Table, Button, Typography, Spin, Tag } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import type { Leader } from '@/types'
import { fetchLeaderDetail } from '@/services/mockServices'

export default function LeaderDetail() {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [data, setData] = useState<Leader | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    fetchLeaderDetail(id).then((res) => {
      setData(res ?? null)
      setLoading(false)
    })
  }, [id])

  if (loading) {
    return <Spin style={{ display: 'block', marginTop: 40 }} />
  }

  if (!data) {
    return <Typography.Text type="danger">{t('common.error')}</Typography.Text>
  }

  const statusLabel: Record<string, string> = {
    active: t('common.enabled'),
    disabled: t('common.disabled_'),
  }

  const pnlColor = (pnl: string | undefined) => {
    if (!pnl) return undefined
    return pnl.startsWith('+') ? 'green' : 'red'
  }

  const transactionColumns = [
    {
      title: t('common.type'),
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: t('common.amount'),
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: t('common.time'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text: string) => new Date(text).toLocaleString(),
    },
    {
      title: t('common.status'),
      dataIndex: 'status',
      key: 'status',
    },
  ]

  return (
    <div>
      <Button
        type="link"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate('/leaders')}
        style={{ marginBottom: 16, padding: 0 }}
      >
        {t('common.back')}
      </Button>

      <Typography.Title level={4} style={{ marginBottom: 16 }}>
        {t('leader.detail')}
      </Typography.Title>

      <Card style={{ marginBottom: 24 }}>
        <Descriptions column={2} bordered size="small">
          <Descriptions.Item label={t('leader.address')}>
            <Typography.Text copyable>{data.address}</Typography.Text>
          </Descriptions.Item>
          <Descriptions.Item label={t('leader.name')}>{data.name}</Descriptions.Item>
          <Descriptions.Item label={t('common.status')}>
            {statusLabel[data.status] || data.status}
          </Descriptions.Item>
          <Descriptions.Item label={t('leader.winRate')}>
            {data.winRate != null ? `${data.winRate.toFixed(1)}%` : '-'}
          </Descriptions.Item>
          <Descriptions.Item label={t('leader.totalPnl')}>
            <span style={{ color: pnlColor(data.totalPnl) }}>{data.totalPnl || '-'}</span>
          </Descriptions.Item>
          <Descriptions.Item label={t('leader.totalOrders')}>
            {data.totalOrders ?? '-'}
          </Descriptions.Item>
          <Descriptions.Item label="质押总量">-</Descriptions.Item>
        </Descriptions>
      </Card>

      {data.totalOrders ? (
        <>
          <Typography.Title level={5} style={{ marginBottom: 12 }}>
            {t('leader.historyOrders')}
          </Typography.Title>
          <Table
            rowKey="id"
            columns={transactionColumns}
            dataSource={[]}
            pagination={false}
          />
        </>
      ) : null}
    </div>
  )
}