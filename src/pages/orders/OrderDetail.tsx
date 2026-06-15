import { useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Card, Descriptions, Tag, Button, Typography, Empty, Space, message } from 'antd'
import { ArrowLeftOutlined, CopyOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { mockOrders } from '@/services/mockData'
import type { OrderStatus } from '@/types'

const statusColorMap: Record<OrderStatus, string> = {
  pending: 'default',
  executing: 'processing',
  completed: 'success',
  failed: 'error',
  cancelled: 'default',
}

const statusLabelMap: Record<OrderStatus, string> = {
  pending: '待处理',
  executing: '执行中',
  completed: '已完成',
  failed: '失败',
  cancelled: '已取消',
}

const typeLabelMap: Record<string, string> = {
  buy: '买入',
  sell: '卖出',
}

const typeColorMap: Record<string, string> = {
  buy: 'green',
  sell: 'red',
}

const businessTypeLabelMap: Record<string, string> = {
  stake: '质押',
  transfer: '划转',
  swap: '兑换',
  redeem: '赎回',
}

function handleCopy(txHash: string) {
  navigator.clipboard.writeText(txHash).then(() => {
    message.success('已复制交易哈希')
  })
}

export default function OrderDetail() {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const order = useMemo(() => mockOrders.find((o) => o.id === id), [id])

  if (!order) {
    return (
      <div>
        <Button
          type="link"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/orders')}
          style={{ padding: 0, marginBottom: 16 }}
        >
          返回列表
        </Button>
        <Empty description="订单不存在" />
      </div>
    )
  }

  return (
    <div>
      <Button
        type="link"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate('/orders')}
        style={{ padding: 0, marginBottom: 16 }}
      >
        返回列表
      </Button>

      <Typography.Title level={4} style={{ marginBottom: 16 }}>
        {t('order.detail')}
      </Typography.Title>

      <Card>
        <Descriptions column={2} bordered size="small">
          <Descriptions.Item label={t('order.orderId')}>{order.id}</Descriptions.Item>
          <Descriptions.Item label={t('order.type')}>
            <Tag color={typeColorMap[order.type]}>{typeLabelMap[order.type]}</Tag>
          </Descriptions.Item>

          <Descriptions.Item label={t('order.businessType')}>
            <Tag>{businessTypeLabelMap[order.businessType]}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label={t('common.status')}>
            <Tag color={statusColorMap[order.status]}>
              {statusLabelMap[order.status]}
            </Tag>
          </Descriptions.Item>

          <Descriptions.Item label={t('order.amount')}>
            <span style={{ fontFamily: 'monospace' }}>{order.amount}</span>
          </Descriptions.Item>
          <Descriptions.Item label={t('order.fee')}>
            {order.fee ?? '-'}
          </Descriptions.Item>

          <Descriptions.Item label={t('order.account')}>
            {order.accountName || order.accountId}
          </Descriptions.Item>
          <Descriptions.Item label={t('order.leader')}>
            {order.leaderName || '-'}
          </Descriptions.Item>

          <Descriptions.Item label="跟单配置" span={2}>
            {order.copyTradeId ? order.copyTradeId : '无'}
          </Descriptions.Item>

          <Descriptions.Item label={t('order.txHash')} span={2}>
            {order.txHash ? (
              <Space>
                <span style={{ fontFamily: 'monospace', fontSize: 12 }}>
                  {order.txHash}
                </span>
                <Button
                  type="link"
                  size="small"
                  icon={<CopyOutlined />}
                  onClick={() => handleCopy(order.txHash!)}
                />
              </Space>
            ) : (
              '-'
            )}
          </Descriptions.Item>

          <Descriptions.Item label={t('order.createdTime')} span={2}>
            {dayjs(order.createdAt).format('YYYY-MM-DD HH:mm:ss')}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  )
}