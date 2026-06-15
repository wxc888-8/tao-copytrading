import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Card, Descriptions, Table, Button, Badge, Typography, Spin } from 'antd'
import type { BadgeProps } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import type { AccountDetail as AccountDetailType } from '@/types'
import { fetchAccountDetail } from '@/services/mockServices'

const txnTypeMap: Record<string, string> = {
  stake: '质押',
  unstake: '赎回',
  transfer: '划转',
  swap: '兑换',
}

export default function AccountDetail() {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [data, setData] = useState<AccountDetailType | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    fetchAccountDetail(id).then((res) => {
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

  const statusBadge = (status: string) => {
    const map: Record<string, { color: string; text: string }> = {
      active: { color: 'green', text: t('common.enabled') },
      disabled: { color: 'default', text: t('common.disabled_') },
      error: { color: 'red', text: t('common.error') },
    }
    return map[status] ?? { color: 'default', text: status }
  }

  const transactionColumns = [
    {
      title: t('common.type'),
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => txnTypeMap[type] || type,
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
        onClick={() => navigate('/accounts')}
        style={{ marginBottom: 16, padding: 0 }}
      >
        {t('common.back')}
      </Button>

      <Typography.Title level={4} style={{ marginBottom: 16 }}>
        {t('account.detail')}
      </Typography.Title>

      <Card style={{ marginBottom: 24 }}>
        <Descriptions column={2} bordered size="small">
          <Descriptions.Item label={t('account.address')}>
            <Typography.Text copyable>{data.address}</Typography.Text>
          </Descriptions.Item>
          <Descriptions.Item label={t('account.name')}>{data.name}</Descriptions.Item>
          <Descriptions.Item label={t('account.network')}>{data.network}</Descriptions.Item>
          <Descriptions.Item label={t('common.status')}>
            <Badge status={statusBadge(data.status).color as BadgeProps['status']} text={statusBadge(data.status).text} />
          </Descriptions.Item>
          <Descriptions.Item label={t('account.balance')}>{data.balance}</Descriptions.Item>
          <Descriptions.Item label={t('account.staked')}>{data.staked}</Descriptions.Item>
          <Descriptions.Item label={t('account.subnetPower')}>{data.subnetPower || '-'}</Descriptions.Item>
        </Descriptions>
      </Card>

      <Typography.Title level={5} style={{ marginBottom: 12 }}>
        {t('account.transactions')}
      </Typography.Title>
      <Table
        rowKey="id"
        columns={transactionColumns}
        dataSource={data.transactions || []}
        pagination={false}
      />
    </div>
  )
}
