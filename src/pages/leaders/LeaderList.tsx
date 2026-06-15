import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Table, Button, Modal, Form, Space, Typography, message, Input } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import type { Leader } from '@/types'
import { fetchLeaders } from '@/services/mockServices'

export default function LeaderList() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [data, setData] = useState<Leader[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [form] = Form.useForm()

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetchLeaders()
      setData(res)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleAdd = async () => {
    try {
      const values = await form.validateFields()
      console.log('Add leader:', values)
      message.success(t('leader.addLeader') + ' ' + t('common.save'))
      form.resetFields()
      setModalOpen(false)
    } catch {
      // validation failed
    }
  }

  const statusLabel: Record<string, string> = {
    active: t('common.enabled'),
    disabled: t('common.disabled_'),
  }

  const pnlColor = (pnl: string | undefined) => {
    if (!pnl) return undefined
    return pnl.startsWith('+') ? 'green' : 'red'
  }

  const columns = [
    {
      title: t('leader.address'),
      dataIndex: 'address',
      key: 'address',
      ellipsis: true,
      render: (text: string, record: Leader) => (
        <Typography.Text
          copyable
          ellipsis
          style={{ maxWidth: 200, cursor: 'pointer' }}
          onClick={() => navigate(`/leaders/${record.id}`)}
        >
          {text}
        </Typography.Text>
      ),
    },
    {
      title: t('leader.name'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t('leader.winRate'),
      dataIndex: 'winRate',
      key: 'winRate',
      render: (val: number) => (val != null ? `${val.toFixed(1)}%` : '-'),
    },
    {
      title: t('leader.totalPnl'),
      dataIndex: 'totalPnl',
      key: 'totalPnl',
      render: (val: string) => (
        <span style={{ color: pnlColor(val) }}>{val || '-'}</span>
      ),
    },
    {
      title: t('leader.totalOrders'),
      dataIndex: 'totalOrders',
      key: 'totalOrders',
      render: (val: number) => val ?? '-',
    },
    {
      title: t('common.status'),
      dataIndex: 'status',
      key: 'status',
      render: (s: string) => statusLabel[s] || s,
    },
    {
      title: t('common.action'),
      key: 'action',
      render: (_: unknown, record: Leader) => (
        <Space>
          <Button type="link" size="small" onClick={() => navigate(`/leaders/${record.id}`)}>
            {t('common.edit')}
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Typography.Title level={4} style={{ margin: 0 }}>{t('leader.title')}</Typography.Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalOpen(true)}>
          {t('leader.addLeader')}
        </Button>
      </div>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={t('leader.addLeader')}
        open={modalOpen}
        onOk={handleAdd}
        onCancel={() => { form.resetFields(); setModalOpen(false) }}
        okText={t('common.confirm')}
        cancelText={t('common.cancel')}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="address"
            label={t('leader.leaderAddress')}
            rules={[{ required: true, message: t('leader.leaderAddress') }]}
          >
            <Input placeholder={t('leader.leaderAddress')} />
          </Form.Item>
          <Form.Item
            name="name"
            label={t('leader.leaderName')}
            rules={[{ required: true, message: t('leader.leaderName') }]}
          >
            <Input placeholder={t('leader.leaderName')} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}