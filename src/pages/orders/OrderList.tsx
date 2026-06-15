import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Table, Card, Space, Select, Button, DatePicker, Tag, Typography } from 'antd'
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
import type { Order, OrderStatus } from '@/types'
import { fetchOrders } from '@/services/mockServices'

const { RangePicker } = DatePicker

const typeOptions = [
  { label: '全部', value: '' },
  { label: '买入', value: 'buy' },
  { label: '卖出', value: 'sell' },
]

const businessTypeOptions = [
  { label: '全部', value: '' },
  { label: '质押', value: 'stake' },
  { label: '划转', value: 'transfer' },
  { label: '兑换', value: 'swap' },
  { label: '赎回', value: 'redeem' },
]

const statusOptions: { label: string; value: OrderStatus | '' }[] = [
  { label: '全部', value: '' },
  { label: '待处理', value: 'pending' },
  { label: '执行中', value: 'executing' },
  { label: '已完成', value: 'completed' },
  { label: '失败', value: 'failed' },
  { label: '已取消', value: 'cancelled' },
]

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

const typeColorMap: Record<string, string> = {
  buy: 'green',
  sell: 'red',
}

const typeLabelMap: Record<string, string> = {
  buy: '买入',
  sell: '卖出',
}

const businessTypeLabelMap: Record<string, string> = {
  stake: '质押',
  transfer: '划转',
  swap: '兑换',
  redeem: '赎回',
}

export default function OrderList() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [type, setType] = useState('')
  const [businessType, setBusinessType] = useState('')
  const [status, setStatus] = useState<OrderStatus | ''>('')
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(null)

  const loadOrders = useCallback(async () => {
    setLoading(true)
    try {
      const filters: Record<string, unknown> = {}
      if (type) filters.type = type
      if (businessType) filters.businessType = businessType
      if (status) filters.status = status
      if (dateRange && dateRange[0] && dateRange[1]) {
        filters.dateRange = [
          dateRange[0].startOf('day').toISOString(),
          dateRange[1].endOf('day').toISOString(),
        ]
      }
      const data = await fetchOrders(filters)
      setOrders(data)
    } finally {
      setLoading(false)
    }
  }, [type, businessType, status, dateRange])

  useEffect(() => {
    loadOrders()
  }, [loadOrders])

  const handleReset = () => {
    setType('')
    setBusinessType('')
    setStatus('')
    setDateRange(null)
  }

  const columns = [
    {
      title: '订单编号',
      dataIndex: 'id',
      key: 'id',
      ellipsis: true,
      width: 100,
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 80,
      render: (val: string) => (
        <Tag color={typeColorMap[val]}>{typeLabelMap[val] || val}</Tag>
      ),
    },
    {
      title: '业务类型',
      dataIndex: 'businessType',
      key: 'businessType',
      width: 100,
      render: (val: string) => <Tag>{businessTypeLabelMap[val] || val}</Tag>,
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      width: 130,
      render: (val: string) => (
        <span style={{ fontFamily: 'monospace' }}>{val}</span>
      ),
    },
    {
      title: '手续费',
      dataIndex: 'fee',
      key: 'fee',
      width: 110,
      render: (val?: string) => val ?? '-',
    },
    {
      title: '操作账户',
      dataIndex: 'accountName',
      key: 'accountName',
      width: 110,
      ellipsis: true,
    },
    {
      title: '触发 Leader',
      dataIndex: 'leaderName',
      key: 'leaderName',
      width: 120,
      render: (val?: string) => val ?? '-',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 90,
      render: (val: OrderStatus) => (
        <Tag color={statusColorMap[val]}>{statusLabelMap[val]}</Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 170,
      render: (val: string) => dayjs(val).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (_: unknown, record: Order) => (
        <Button type="link" size="small" onClick={() => navigate(`/orders/${record.id}`)}>
          查看详情
        </Button>
      ),
    },
  ]

  return (
    <div>
      <Typography.Title level={4} style={{ marginBottom: 16 }}>
        {t('order.title')}
      </Typography.Title>

      <Card size="small" style={{ marginBottom: 16 }}>
        <Space wrap>
          <Select
            style={{ width: 120 }}
            value={type}
            options={typeOptions}
            onChange={setType}
            placeholder="订单类型"
          />
          <Select
            style={{ width: 120 }}
            value={businessType}
            options={businessTypeOptions}
            onChange={setBusinessType}
            placeholder="业务类型"
          />
          <Select
            style={{ width: 120 }}
            value={status}
            options={statusOptions}
            onChange={setStatus}
            placeholder="状态"
          />
          <RangePicker
            value={dateRange}
            onChange={(dates) => setDateRange(dates as [Dayjs | null, Dayjs | null] | null)}
          />
          <Button type="primary" icon={<SearchOutlined />} onClick={loadOrders}>
            {t('common.search')}
          </Button>
          <Button icon={<ReloadOutlined />} onClick={handleReset}>
            {t('common.reset')}
          </Button>
        </Space>
      </Card>

      <Table
        columns={columns}
        dataSource={orders}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (total) => `共 ${total} 条` }}
        scroll={{ x: 1200 }}
      />
    </div>
  )
}