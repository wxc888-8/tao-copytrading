import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Card, Table, Button, Modal, Form, Select, Tag, InputNumber, Typography, Space, message, Badge,
} from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { fetchLimitPriceRules, fetchAccounts } from '@/services/mockServices'
import type { LimitPriceRule, Account } from '@/types'
import dayjs from 'dayjs'

export default function LimitPricePage() {
  const { t } = useTranslation()
  const [data, setData] = useState<LimitPriceRule[]>([])
  const [accounts, setAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [form] = Form.useForm()

  useEffect(() => {
    Promise.all([
      fetchLimitPriceRules(),
      fetchAccounts(),
    ]).then(([rules, accts]) => {
      setData(rules)
      setAccounts(accts)
      setLoading(false)
    })
  }, [])

  const handleAdd = async () => {
    try {
      const values = await form.validateFields()
      const account = accounts.find((a) => a.id === values.accountId)
      const newRule: LimitPriceRule = {
        id: 'lp-' + Date.now(),
        accountId: values.accountId,
        accountName: account?.name || '',
        subnetName: values.subnetName,
        action: values.action,
        targetPrice: values.targetPrice,
        currentPrice: '0',
        status: 'active',
        createdAt: new Date().toISOString(),
      }
      setData((prev) => [newRule, ...prev])
      message.success('创建成功')
      form.resetFields()
      setModalOpen(false)
    } catch {
      // validation failed
    }
  }

  const statusConfig: Record<string, { color: string; label: string }> = {
    active: { color: '#1677FF', label: t('limitPrice.active') },
    triggered: { color: '#00B96B', label: t('limitPrice.triggered') },
    paused: { color: '#8B949E', label: t('limitPrice.paused') },
  }

  const columns = [
    {
      title: t('limitPrice.account'),
      dataIndex: 'accountName',
      key: 'accountName',
    },
    {
      title: t('limitPrice.subnet'),
      dataIndex: 'subnetName',
      key: 'subnetName',
      render: (val: string) => (
        <Tag color="purple" style={{ borderRadius: 8 }}>{val}</Tag>
      ),
    },
    {
      title: t('limitPrice.action'),
      dataIndex: 'action',
      key: 'action',
      render: (act: string) => (
        <Tag color={act === 'stake' ? 'blue' : 'orange'} style={{ borderRadius: 8 }}>
          {act === 'stake' ? t('limitPrice.actionStake') : t('limitPrice.actionRedeem')}
        </Tag>
      ),
    },
    {
      title: t('limitPrice.targetPrice'),
      dataIndex: 'targetPrice',
      key: 'targetPrice',
      render: (val: string) => (
        <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
          $ {val}
        </span>
      ),
    },
    {
      title: t('limitPrice.currentPrice'),
      dataIndex: 'currentPrice',
      key: 'currentPrice',
      render: (val: string) => (
        <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
          $ {val}
        </span>
      ),
    },
    {
      title: t('limitPrice.status'),
      dataIndex: 'status',
      key: 'status',
      render: (st: string) => {
        const cfg = statusConfig[st] || { color: 'default', label: st }
        return <Badge color={cfg.color} text={cfg.label} />
      },
    },
    {
      title: t('common.action'),
      key: 'action',
      render: (_: unknown, record: LimitPriceRule) => (
        <Space>
          <Button
            type="link"
            size="small"
            onClick={() => {
              setData((prev) =>
                prev.map((item) =>
                  item.id === record.id
                    ? { ...item, status: item.status === 'paused' ? 'active' : 'paused' as const }
                    : item
                )
              )
              message.success(record.status === 'paused' ? '已启用' : '已暂停')
            }}
          >
            {record.status === 'paused' ? t('common.enabled') : t('common.disabled')}
          </Button>
          <Button
            type="link"
            size="small"
            danger
            onClick={() => {
              setData((prev) => prev.filter((item) => item.id !== record.id))
              message.success('已删除')
            }}
          >
            {t('common.delete')}
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <Typography.Title level={4} style={{ margin: 0, color: 'var(--text-primary)' }}>
            {t('limitPrice.title')}
          </Typography.Title>
          <Typography.Text style={{ color: 'var(--text-tertiary)', fontSize: 14 }}>
            {t('limitPrice.priceNote')}
          </Typography.Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalOpen(true)}>
          {t('limitPrice.add')}
        </Button>
      </div>

      <Card
        style={{
          borderRadius: 16,
          border: '1px solid var(--border-color)',
          background: 'var(--card-bg)',
        }}
        styles={{ body: { padding: 0 } }}
      >
        <Table
          rowKey="id"
          columns={columns}
          dataSource={data}
          loading={loading}
          pagination={false}
        />
      </Card>

      <Modal
        title={t('limitPrice.add')}
        open={modalOpen}
        onOk={handleAdd}
        onCancel={() => { form.resetFields(); setModalOpen(false) }}
        okText={t('common.confirm')}
        cancelText={t('common.cancel')}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="accountId"
            label={t('limitPrice.account')}
            rules={[{ required: true, message: t('limitPrice.selectAccount') }]}
          >
            <Select
              placeholder={t('limitPrice.selectAccount')}
              options={accounts.map((a) => ({ label: a.name, value: a.id }))}
            />
          </Form.Item>

          <Form.Item
            name="subnetName"
            label={t('limitPrice.subnet')}
            rules={[{ required: true, message: '请输入子网名称' }]}
          >
            <Select
              placeholder={t('limitPrice.subnetPlaceholder')}
              options={[
                { label: 'subnet-1', value: 'subnet-1' },
                { label: 'subnet-2', value: 'subnet-2' },
                { label: 'subnet-3', value: 'subnet-3' },
                { label: 'subnet-4', value: 'subnet-4' },
              ]}
            />
          </Form.Item>

          <Form.Item
            name="action"
            label={t('limitPrice.action')}
            rules={[{ required: true, message: '请选择操作类型' }]}
          >
            <Select
              options={[
                { label: t('limitPrice.actionStake'), value: 'stake' },
                { label: t('limitPrice.actionRedeem'), value: 'redeem' },
              ]}
            />
          </Form.Item>

          <Form.Item
            name="targetPrice"
            label={t('limitPrice.targetPrice')}
            rules={[{ required: true, message: t('limitPrice.pricePlaceholder') }]}
          >
            <InputNumber
              min={0}
              step={0.01}
              prefix="$"
              style={{ width: '100%' }}
              placeholder={t('limitPrice.pricePlaceholder')}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}