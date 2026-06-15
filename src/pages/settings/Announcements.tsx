import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Table, Button, Modal, Form, Input, Select, Tag, Badge, message, Space, Typography,
} from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { fetchNotifications } from '@/services/mockServices'
import type { Notification } from '@/types'

interface AnnounceFormData {
  title: string
  content: string
  severity: 'info' | 'warning' | 'error'
}

export default function AnnouncementsPage() {
  const { t } = useTranslation()
  const [data, setData] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [form] = Form.useForm<AnnounceFormData>()

  const loadData = () => {
    setLoading(true)
    fetchNotifications().then((res) => {
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

  const handleToggleRead = (record: Notification) => {
    setData((prev) =>
      prev.map((item) =>
        item.id === record.id ? { ...item, read: !item.read } : item
      )
    )
    message.success(t('common.status') + ' ' + t('common.success'))
  }

  const handleDelete = (record: Notification) => {
    setData((prev) => prev.filter((item) => item.id !== record.id))
    message.success(t('common.delete') + ' ' + t('common.success'))
  }

  const handleModalOk = () => {
    form.validateFields().then((values) => {
      const newItem: Notification = {
        id: `notif-${Date.now()}`,
        type: 'system',
        title: values.title,
        message: values.content,
        severity: values.severity,
        read: false,
        createdAt: dayjs().toISOString(),
      }
      setData((prev) => [newItem, ...prev])
      message.success(t('common.create') + ' ' + t('common.success'))
      setModalOpen(false)
      form.resetFields()
    })
  }

  const severityColor: Record<string, string> = {
    info: 'blue',
    warning: 'orange',
    error: 'red',
  }

  const columns = [
    {
      title: t('settings.title'),
      dataIndex: 'title',
      key: 'title',
      render: (_: unknown, record: Notification) => (
        <Space>
          <Typography.Text strong={!record.read} type={record.read ? 'secondary' : undefined}>
            {record.title}
          </Typography.Text>
          {!record.read && <Badge status="processing" />}
        </Space>
      ),
    },
    {
      title: t('settings.content'),
      dataIndex: 'message',
      key: 'message',
      ellipsis: true,
      width: 300,
    },
    {
      title: t('common.status'),
      key: 'severity',
      dataIndex: 'severity',
      render: (_: unknown, record: Notification) => (
        <Tag color={severityColor[record.severity]}>
          {t(`common.${record.severity}`)}
        </Tag>
      ),
    },
    {
      title: t('common.startDate'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (val: string) => dayjs(val).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: t('common.action'),
      key: 'action',
      render: (_: unknown, record: Notification) => (
        <Space>
          <Button type="link" size="small" onClick={() => handleToggleRead(record)}>
            {record.read ? t('common.active') : t('common.disabled')}
          </Button>
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
        <h2>{t('settings.announcements')}</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          {t('settings.addAnnouncement')}
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
        title={t('settings.addAnnouncement')}
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
            name="title"
            label={t('settings.title')}
            rules={[{ required: true, message: t('login.placeholder') + t('settings.title') }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="content"
            label={t('settings.content')}
            rules={[{ required: true, message: t('login.placeholder') + t('settings.content') }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item
            name="severity"
            label={t('common.status')}
            rules={[{ required: true, message: t('login.placeholder') + t('common.status') }]}
          >
            <Select
              options={[
                { label: t('common.info'), value: 'info' },
                { label: t('common.warning'), value: 'warning' },
                { label: t('common.error'), value: 'error' },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
