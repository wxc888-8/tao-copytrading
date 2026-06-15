import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Table, Button, Modal, Form, Input, InputNumber, Radio, Tag, Badge, message, Space,
} from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { fetchProxyConfigs } from '@/services/mockServices'
import type { ProxyConfig } from '@/types'

interface ProxyFormData {
  name: string
  host: string
  port: number
  protocol: 'http' | 'socks5'
}

export default function ProxyConfigPage() {
  const { t } = useTranslation()
  const [data, setData] = useState<ProxyConfig[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingRecord, setEditingRecord] = useState<ProxyConfig | null>(null)
  const [form] = Form.useForm<ProxyFormData>()

  const loadData = () => {
    setLoading(true)
    fetchProxyConfigs().then((res) => {
      setData(res)
      setLoading(false)
    })
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleAdd = () => {
    setEditingRecord(null)
    form.resetFields()
    setModalOpen(true)
  }

  const handleEdit = (record: ProxyConfig) => {
    setEditingRecord(record)
    form.setFieldsValue({
      name: record.name,
      host: record.host,
      port: record.port,
      protocol: record.protocol,
    })
    setModalOpen(true)
  }

  const handleDelete = (record: ProxyConfig) => {
    setData((prev) => prev.filter((item) => item.id !== record.id))
    message.success(t('common.delete') + ' ' + t('common.success'))
  }

  const handleTestConnection = (record: ProxyConfig) => {
    message.loading({ content: t('common.running'), key: record.id })
    setTimeout(() => {
      message.success({ content: `${record.name} ${t('common.online')} (${record.latency}ms)`, key: record.id })
    }, 1000)
  }

  const handleModalOk = () => {
    form.validateFields().then((values) => {
      if (editingRecord) {
        setData((prev) =>
          prev.map((item) =>
            item.id === editingRecord.id
              ? { ...item, ...values, latency: item.latency, status: item.status }
              : item
          )
        )
        message.success(t('common.edit') + ' ' + t('common.success'))
      } else {
        const newItem: ProxyConfig = {
          id: `proxy-${Date.now()}`,
          ...values,
          status: 'offline',
          latency: 0,
        }
        setData((prev) => [...prev, newItem])
        message.success(t('common.create') + ' ' + t('common.success'))
      }
      setModalOpen(false)
      setEditingRecord(null)
      form.resetFields()
    })
  }

  const protocolColor: Record<string, string> = {
    http: 'blue',
    socks5: 'purple',
  }

  const statusBadge: Record<string, 'success' | 'error' | 'default'> = {
    online: 'success',
    offline: 'default',
    error: 'error',
  }

  const columns = [
    {
      title: t('settings.proxyName'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t('settings.host'),
      dataIndex: 'host',
      key: 'host',
    },
    {
      title: t('settings.port'),
      dataIndex: 'port',
      key: 'port',
    },
    {
      title: t('settings.protocol'),
      dataIndex: 'protocol',
      key: 'protocol',
      render: (_: unknown, record: ProxyConfig) => (
        <Tag color={protocolColor[record.protocol]}>{record.protocol.toUpperCase()}</Tag>
      ),
    },
    {
      title: t('common.status'),
      dataIndex: 'status',
      key: 'status',
      render: (_: unknown, record: ProxyConfig) => (
        <Badge status={statusBadge[record.status]} text={t(`common.${record.status}`)} />
      ),
    },
    {
      title: t('settings.latency'),
      dataIndex: 'latency',
      key: 'latency',
      render: (val: number) => (val ? `${val}ms` : '-'),
    },
    {
      title: t('common.action'),
      key: 'action',
      render: (_: unknown, record: ProxyConfig) => (
        <Space>
          <Button type="link" size="small" onClick={() => handleEdit(record)}>
            {t('common.edit')}
          </Button>
          <Button type="link" size="small" danger onClick={() => handleDelete(record)}>
            {t('common.delete')}
          </Button>
          <Button type="link" size="small" onClick={() => handleTestConnection(record)}>
            {t('common.search')}
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2>{t('settings.proxy')}</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          {t('settings.addProxy')}
        </Button>
      </div>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={false}
      />

      <Modal
        title={editingRecord ? t('common.edit') + ' ' + t('settings.proxy') : t('settings.addProxy')}
        open={modalOpen}
        onOk={handleModalOk}
        onCancel={() => {
          setModalOpen(false)
          setEditingRecord(null)
          form.resetFields()
        }}
        destroyOnClose
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item
            name="name"
            label={t('settings.proxyName')}
            rules={[{ required: true, message: t('login.placeholder') + t('settings.proxyName') }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="host"
            label={t('settings.host')}
            rules={[{ required: true, message: t('login.placeholder') + t('settings.host') }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="port"
            label={t('settings.port')}
            rules={[{ required: true, message: t('login.placeholder') + t('settings.port') }]}
          >
            <InputNumber style={{ width: '100%' }} min={1} max={65535} />
          </Form.Item>
          <Form.Item
            name="protocol"
            label={t('settings.protocol')}
            rules={[{ required: true }]}
          >
            <Radio.Group>
              <Radio value="http">HTTP</Radio>
              <Radio value="socks5">SOCKS5</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
