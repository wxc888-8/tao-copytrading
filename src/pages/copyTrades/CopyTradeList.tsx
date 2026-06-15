import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Button, Card, Table, Badge, Space, Popconfirm, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { fetchCopyTrades } from '@/services/mockServices'
import type { CopyTrade } from '@/types'

const statusConfig: Record<string, { color: string; text: string }> = {
  active: { color: 'green', text: 'running' },
  paused: { color: 'orange', text: 'paused' },
  disabled: { color: 'default', text: 'disabled_' },
}

export default function CopyTradeList() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [data, setData] = useState<CopyTrade[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    fetchCopyTrades()
      .then(setData)
      .finally(() => setLoading(false))
  }, [])

  const toggleStatus = (record: CopyTrade) => {
    setData((prev) =>
      prev.map((item) =>
        item.id === record.id
          ? { ...item, status: item.status === 'active' ? 'paused' : ('active' as const) }
          : item,
      ),
    )
    message.success(
      record.status === 'active' ? '跟单已暂停' : '跟单已恢复',
    )
  }

  const columns = [
    {
      title: t('copyTrade.account'),
      dataIndex: 'accountName',
      key: 'accountName',
    },
    {
      title: t('copyTrade.leader'),
      dataIndex: 'leaderName',
      key: 'leaderName',
    },
    {
      title: t('copyTrade.template'),
      dataIndex: 'templateName',
      key: 'templateName',
    },
    {
      title: t('common.status'),
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const config = statusConfig[status]
        return (
          <Badge
            color={config.color}
            text={t(`common.${config.text}` as any)}
          />
        )
      },
    },
    {
      title: t('common.remark') === '备注' ? '创建时间' : 'Created Time',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (val: string) => dayjs(val).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: t('common.action'),
      key: 'action',
      render: (_: unknown, record: CopyTrade) => (
        <Space>
          <Button type="link" size="small" onClick={() => toggleStatus(record)}>
            {record.status === 'active' ? t('common.paused') : t('common.active')}
          </Button>
          <Popconfirm
            title="确认删除"
            onConfirm={() => {
              setData((prev) => prev.filter((item) => item.id !== record.id))
              message.success('删除成功')
            }}
          >
            <Button type="link" size="small" danger>
              {t('common.delete')}
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">{t('copyTrade.title')}</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/copy-trades/new')}>
          {t('copyTrade.create')}
        </Button>
      </div>
      <Card>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={data}
          loading={loading}
          pagination={false}
        />
      </Card>
    </div>
  )
}
