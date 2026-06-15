import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Table, Card, Button, Tag, Typography, Modal, Form, Select,
  InputNumber, message, Space,
} from 'antd'
import { RollbackOutlined, SwapOutlined } from '@ant-design/icons'
import type { Position, Account } from '@/types'
import { fetchPositions, fetchAccounts } from '@/services/mockServices'

const assetTypeLabelMap: Record<string, string> = {
  tao_balance: 'TAO 余额',
  subnet_stake: '子网质押',
}

const assetTypeColorMap: Record<string, string> = {
  tao_balance: 'blue',
  subnet_stake: 'purple',
}

export default function PositionsPage() {
  const { t } = useTranslation()

  const [positions, setPositions] = useState<Position[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [redeemModalOpen, setRedeemModalOpen] = useState(false)
  const [transferModalOpen, setTransferModalOpen] = useState(false)
  const [redeemLoading, setRedeemLoading] = useState(false)
  const [transferLoading, setTransferLoading] = useState(false)
  const [accounts, setAccounts] = useState<Account[]>([])
  const [transferForm] = Form.useForm()

  useEffect(() => {
    setLoading(true)
    Promise.all([
      fetchPositions(),
      fetchAccounts(),
    ]).then(([pos, accs]) => {
      setPositions(pos)
      setAccounts(accs)
      setLoading(false)
    })
  }, [])

  const handleBatchRedeem = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请先选择要赎回的仓位')
      return
    }
    setRedeemModalOpen(true)
  }

  const confirmRedeem = async () => {
    setRedeemLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setRedeemLoading(false)
    setRedeemModalOpen(false)
    setSelectedRowKeys([])
    message.success('批量赎回请求已提交')
  }

  const handleTransfer = () => {
    setTransferModalOpen(true)
  }

  const confirmTransfer = async () => {
    try {
      await transferForm.validateFields()
      setTransferLoading(true)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setTransferLoading(false)
      setTransferModalOpen(false)
      transferForm.resetFields()
      message.success('划转请求已提交')
    } catch {
      // validation failed
    }
  }

  const columns = [
    {
      title: '账户名称',
      dataIndex: 'accountName',
      key: 'accountName',
      width: 120,
    },
    {
      title: '资产类型',
      dataIndex: 'assetType',
      key: 'assetType',
      width: 120,
      render: (val: string) => (
        <Tag color={assetTypeColorMap[val]}>{assetTypeLabelMap[val] || val}</Tag>
      ),
    },
    {
      title: '余额',
      dataIndex: 'balance',
      key: 'balance',
      width: 130,
      render: (val: string) => (
        <span style={{ fontFamily: 'monospace' }}>{val}</span>
      ),
    },
    {
      title: '质押量',
      dataIndex: 'staked',
      key: 'staked',
      width: 130,
      render: (val: string) => (
        <span style={{ fontFamily: 'monospace' }}>{val}</span>
      ),
    },
    {
      title: '算力',
      dataIndex: 'subnetPower',
      key: 'subnetPower',
      width: 130,
      render: (val?: string) =>
        val ? (
          <span style={{ fontFamily: 'monospace' }}>{val}</span>
        ) : (
          '-'
        ),
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 170,
      render: (val: string) => {
        // simple relative-time display
        const diff = Date.now() - new Date(val).getTime()
        const minutes = Math.floor(diff / 60000)
        if (minutes < 1) return '刚刚'
        if (minutes < 60) return `${minutes} 分钟前`
        const hours = Math.floor(minutes / 60)
        if (hours < 24) return `${hours} 小时前`
        const days = Math.floor(hours / 24)
        return `${days} 天前`
      },
    },
  ]

  return (
    <div>
      <Typography.Title level={4} style={{ marginBottom: 16 }}>
        {t('position.title')}
      </Typography.Title>

      <Card size="small" style={{ marginBottom: 16 }}>
        <Space>
          <Button
            type="default"
            icon={<RollbackOutlined />}
            onClick={handleBatchRedeem}
          >
            {t('position.batchRedeem')}
          </Button>
          <Button
            type="primary"
            icon={<SwapOutlined />}
            onClick={handleTransfer}
          >
            {t('position.transfer')}
          </Button>
        </Space>
      </Card>

      <Table
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys,
        }}
        columns={columns}
        dataSource={positions}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (total) => `共 ${total} 条` }}
        scroll={{ x: 900 }}
      />

      {/* 批量赎回 Modal */}
      <Modal
        title={t('position.batchRedeem')}
        open={redeemModalOpen}
        onOk={confirmRedeem}
        onCancel={() => setRedeemModalOpen(false)}
        confirmLoading={redeemLoading}
      >
        <p>已选择 {selectedRowKeys.length} 个仓位，确认提交批量赎回？</p>
        {selectedRowKeys.map((key) => {
          const pos = positions.find((p) => p.id === key)
          if (!pos) return null
          return (
            <div key={pos.id} style={{ padding: '4px 0' }}>
              <Tag color={assetTypeColorMap[pos.assetType]}>
                {assetTypeLabelMap[pos.assetType]}
              </Tag>
              <span style={{ fontFamily: 'monospace', marginLeft: 8 }}>
                {pos.staked}
              </span>
              <span style={{ marginLeft: 8, color: '#888' }}>
                ({pos.accountName})
              </span>
            </div>
          )
        })}
      </Modal>

      {/* 划转 Modal */}
      <Modal
        title={t('position.transfer')}
        open={transferModalOpen}
        onOk={confirmTransfer}
        onCancel={() => {
          setTransferModalOpen(false)
          transferForm.resetFields()
        }}
        confirmLoading={transferLoading}
      >
        <Form form={transferForm} layout="vertical">
          <Form.Item
            label="目标账户"
            name="targetAccount"
            rules={[{ required: true, message: '请选择目标账户' }]}
          >
            <Select placeholder="请选择目标账户">
              {accounts.map((acc) => (
                <Select.Option key={acc.id} value={acc.id}>
                  {acc.name} ({acc.id})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="划转金额"
            name="amount"
            rules={[{ required: true, message: '请输入划转金额' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder="请输入金额"
              min={0}
              step={0.0001}
              stringMode
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}