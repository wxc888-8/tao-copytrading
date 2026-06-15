import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Table, Button, Modal, Form, Input, Select, Tag, Badge, message, Space,
} from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { fetchNodes } from '@/services/mockServices'
import type { NodeInfo } from '@/types'

interface NodeFormData {
  url: string
  type: 'RPC' | 'WSS'
}

export default function NodeMonitorPage() {
  const { t } = useTranslation()
  const [data, setData] = useState<NodeInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [form] = Form.useForm<NodeFormData>()

  const loadData = () => {
    setLoading(true)
    fetchNodes().then((res) => {
      setData(res)
      setLoading(false)
    })
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleAdd = () => {
    form.resetFields()
    setModalOpen(true)
  }

  const handleDelete = (record: NodeInfo) => {
    setData((prev) => prev.filter((item) => item.id !== record.id))
    message.success(t('common.delete') + ' ' + t('common.success'))
  }

  const handleModalOk = () => {
    form.validateFields().then((values) => {
      const newItem: NodeInfo = {
        id: `node-${Date.now()}`,
        ...values,
        status: 'offline',
        latency: 0,
      }
      setData((prev) => [...prev, newItem])
      message.success(t('common.create') + ' ' + t('common.success'))
      setModalOpen(false)
      form.resetFields()
    })
  }

  const typeColor: Record<string, string> = {
    RPC: 'geekblue',
    WSS: 'green',
  }

  const statusBadge: Record<string, 'success' | 'error' | 'warning'> = {
    online: 'success',
    offline: 'error',
    degraded: 'warning',
  }

  const columns = [
    {
      title: t('settings.nodeUrl'),
      dataIndex: 'url',
      key: 'url',
      ellipsis: true,
    },
    {
      title: t('settings.nodeType'),
      dataIndex: 'type',
      key: 'type',
      render: (_: unknown, record: NodeInfo) => (
        <Tag color={typeColor[record.type]}>{record.type}</Tag>
      ),
    },
    {
      title: t('common.status'),
      dataIndex: 'status',
      key: 'status',
      render: (_: unknown, record: NodeInfo) => (
        <Badge status={statusBadge[record.status]} text={t(`common.${record.status}`)} />
      ),
    },
    {
      title: `${t('settings.latency')}(ms)`,
      dataIndex: 'latency',
      key: 'latency',
      render: (val: number) => (val ? `${val}ms` : '-'),
    },
    {
      title: t('dashboard.lastBlock'),
      dataIndex: 'lastBlock',
      key: 'lastBlock',
      render: (val: number | undefined) => val ?? '-',
    },
    {
      title: t('settings.location'),
      dataIndex: 'location',
      key: 'location',
      render: (val: string | undefined) => val || '-',
    },
    {
      title: t('common.action'),
      key: 'action',
      render: (_: unknown, record: NodeInfo) => (
        <Space>
          <Button type="link" size="small" danger onClick={() => handleDelete(record)}>
            {t('common.delete')}
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2>{t('settings.nodes')}</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          {t('settings.addNode')}
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
        title={t('settings.addNode')}
        open={modalOpen}
        onOk={handleModalOk}
        onCancel={() => {
          setModalOpen(false)
          form.resetFields()
        }}
        destroyOnClose
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item
            name="url"
            label={t('settings.nodeUrl')}
            rules={[
              { required: true, message: t('login.placeholder') + t('settings.nodeUrl') },
              { type: 'url', message: t('common.error') },
            ]}
          >
            <Input placeholder="wss://example.com" />
          </Form.Item>
          <Form.Item
            name="type"
            label={t('settings.nodeType')}
            rules={[{ required: true, message: t('login.placeholder') + t('settings.nodeType') }]}
          >
            <Select
              options={[
                { label: 'RPC', value: 'RPC' },
                { label: 'WSS', value: 'WSS' },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
