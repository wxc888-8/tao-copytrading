import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Table, Button, Modal, Form, Input, Select, Tag, Badge, message, Space,
} from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'

interface User {
  id: string
  username: string
  role: string
  status: 'active' | 'disabled'
  createdAt: string
}

interface UserFormData {
  username: string
  password: string
  role: string
}

const mockUsers: User[] = [
  {
    id: 'user-001',
    username: 'admin',
    role: '管理员',
    status: 'active',
    createdAt: dayjs().subtract(30, 'day').toISOString(),
  },
  {
    id: 'user-002',
    username: 'trader01',
    role: '交易员',
    status: 'active',
    createdAt: dayjs().subtract(20, 'day').toISOString(),
  },
  {
    id: 'user-003',
    username: 'viewer01',
    role: '观察员',
    status: 'disabled',
    createdAt: dayjs().subtract(15, 'day').toISOString(),
  },
  {
    id: 'user-004',
    username: 'operator01',
    role: '操作员',
    status: 'active',
    createdAt: dayjs().subtract(10, 'day').toISOString(),
  },
]

export default function UserManagementPage() {
  const { t } = useTranslation()
  const [data, setData] = useState<User[]>(mockUsers)
  const [modalOpen, setModalOpen] = useState(false)
  const [form] = Form.useForm<UserFormData>()

  const handleAdd = () => {
    form.resetFields()
    setModalOpen(true)
  }

  const handleDelete = (record: User) => {
    setData((prev) => prev.filter((item) => item.id !== record.id))
    message.success(t('common.delete') + ' ' + t('common.success'))
  }

  const handleToggleStatus = (record: User) => {
    const newStatus = record.status === 'active' ? 'disabled' : 'active'
    setData((prev) =>
      prev.map((item) =>
        item.id === record.id ? { ...item, status: newStatus } : item
      )
    )
    message.success(t('common.status') + ' ' + t('common.success'))
  }

  const handleModalOk = () => {
    form.validateFields().then((values) => {
      const newItem: User = {
        id: `user-${Date.now()}`,
        username: values.username,
        role: values.role,
        status: 'active',
        createdAt: dayjs().toISOString(),
      }
      setData((prev) => [...prev, newItem])
      message.success(t('common.create') + ' ' + t('common.success'))
      setModalOpen(false)
      form.resetFields()
    })
  }

  const columns = [
    {
      title: t('settings.username'),
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: t('settings.role'),
      dataIndex: 'role',
      key: 'role',
      render: (val: string) => <Tag>{val}</Tag>,
    },
    {
      title: t('common.status'),
      dataIndex: 'status',
      key: 'status',
      render: (_: unknown, record: User) => (
        <Badge
          status={record.status === 'active' ? 'success' : 'default'}
          text={t(`common.${record.status === 'active' ? 'enabled' : 'disabled_'}`)}
        />
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
      render: (_: unknown, record: User) => (
        <Space>
          <Button type="link" size="small" onClick={() => handleToggleStatus(record)}>
            {record.status === 'active' ? t('common.disabled') : t('common.active')}
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
        <h2>{t('settings.users')}</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          {t('settings.addUser')}
        </Button>
      </div>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={data}
        pagination={false}
      />

      <Modal
        title={t('settings.addUser')}
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
            name="username"
            label={t('settings.username')}
            rules={[{ required: true, message: t('login.placeholder') + t('settings.username') }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label={t('login.password')}
            rules={[{ required: true, message: t('login.placeholder') + t('login.password') }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="role"
            label={t('settings.role')}
            rules={[{ required: true, message: t('login.placeholder') + t('settings.role') }]}
          >
            <Select
              options={[
                { label: t('settings.role'), value: t('settings.role') },
                { label: '管理员', value: '管理员' },
                { label: '交易员', value: '交易员' },
                { label: '观察员', value: '观察员' },
                { label: '操作员', value: '操作员' },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
