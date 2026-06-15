import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Table, Button, Input, Modal, Form, Space, Badge, message, Typography } from 'antd'
import type { BadgeProps } from 'antd'
import { PlusOutlined, SearchOutlined } from '@ant-design/icons'
import type { Account } from '@/types'
import { fetchAccounts } from '@/services/mockServices'

export default function AccountList() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [data, setData] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [form] = Form.useForm()

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetchAccounts()
      setData(res)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  )

  const handleImport = async () => {
    try {
      const values = await form.validateFields()
      console.log('Import account:', values)
      message.success(t('account.importAccount') + ' ' + t('common.save') + ' ' + t('common.success', '').replace(/^/, ''))
      form.resetFields()
      setModalOpen(false)
    } catch {
      // validation failed
    }
  }

  const statusBadge = (status: string) => {
    const map: Record<string, { color: string; text: string }> = {
      active: { color: 'green', text: t('common.enabled') },
      disabled: { color: 'default', text: t('common.disabled_') },
      error: { color: 'red', text: t('common.error') },
    }
    const item = map[status] ?? { color: 'default' as const, text: status }
    return <Badge status={item.color as BadgeProps['status']} text={item.text} />
  }

  const columns = [
    {
      title: t('account.address'),
      dataIndex: 'address',
      key: 'address',
      ellipsis: true,
      render: (text: string, record: Account) => (
        <Typography.Text
          copyable
          ellipsis
          style={{ maxWidth: 200, cursor: 'pointer' }}
          onClick={() => navigate(`/accounts/${record.id}`)}
        >
          {text}
        </Typography.Text>
      ),
    },
    {
      title: t('account.name'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t('account.balance'),
      dataIndex: 'balance',
      key: 'balance',
    },
    {
      title: t('account.staked'),
      dataIndex: 'staked',
      key: 'staked',
    },
    {
      title: t('account.network'),
      dataIndex: 'network',
      key: 'network',
    },
    {
      title: t('common.status'),
      dataIndex: 'status',
      key: 'status',
      render: (_: unknown, record: Account) => statusBadge(record.status),
    },
    {
      title: t('common.action'),
      key: 'action',
      render: (_: unknown, record: Account) => (
        <Space>
          <Button type="link" size="small" onClick={() => navigate(`/accounts/${record.id}`)}>
            {t('common.edit')}
          </Button>
          <Button type="link" size="small">
            {record.status === 'active' ? t('common.disable') : t('common.enable')}
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Typography.Title level={4} style={{ margin: 0 }}>{t('account.title')}</Typography.Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalOpen(true)}>
          {t('account.importAccount')}
        </Button>
      </div>

      <div style={{ marginBottom: 16 }}>
        <Input
          placeholder={t('account.name')}
          prefix={<SearchOutlined />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: 300 }}
          allowClear
        />
      </div>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={filteredData}
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={t('account.importAccount')}
        open={modalOpen}
        onOk={handleImport}
        onCancel={() => { form.resetFields(); setModalOpen(false) }}
        okText={t('common.confirm')}
        cancelText={t('common.cancel')}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="privateKey"
            label={t('account.privateKey')}
            rules={[{ required: true, message: t('account.privateKeyPlaceholder') }]}
          >
            <Input.Password placeholder={t('account.privateKeyPlaceholder')} />
          </Form.Item>
          <Form.Item
            name="name"
            label={t('account.accountName')}
            rules={[{ required: true, message: t('account.namePlaceholder') }]}
          >
            <Input placeholder={t('account.namePlaceholder')} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
