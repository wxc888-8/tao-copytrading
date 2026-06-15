import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Button, Card, Table, Tag, Space, Popconfirm, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { fetchTemplates } from '@/services/mockServices'
import type { CopyTemplate } from '@/types'

export default function TemplateList() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [data, setData] = useState<CopyTemplate[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    fetchTemplates()
      .then(setData)
      .finally(() => setLoading(false))
  }, [])

  const columns = [
    {
      title: t('template.name'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t('template.copyType'),
      dataIndex: 'copyType',
      key: 'copyType',
      render: (type: string) =>
        type === 'ratio' ? (
          <Tag color="blue">{t('template.copyTypeRatio')}</Tag>
        ) : (
          <Tag color="orange">{t('template.copyTypeFixed')}</Tag>
        ),
    },
    {
      title: '比例/金额',
      key: 'ratioOrFixed',
      render: (_: unknown, record: CopyTemplate) =>
        record.copyType === 'ratio'
          ? `${(record.copyRatio ?? 0) * 100}%`
          : record.fixedAmount ?? '-',
    },
    {
      title: t('template.dailyLossLimit'),
      dataIndex: 'dailyLossLimit',
      key: 'dailyLossLimit',
      render: (val: string | undefined) => val ?? '-',
    },
    {
      title: t('template.maxOpsPerDay'),
      dataIndex: 'maxOpsPerDay',
      key: 'maxOpsPerDay',
    },
    {
      title: t('template.slippageTolerance'),
      dataIndex: 'slippageTolerance',
      key: 'slippageTolerance',
      render: (val: number) => `${val}%`,
    },
    {
      title: t('common.status'),
      dataIndex: 'status',
      key: 'status',
      render: (status: string) =>
        status === 'active' ? (
          <Tag color="green">{t('common.enabled')}</Tag>
        ) : (
          <Tag color="default">{t('common.disabled_')}</Tag>
        ),
    },
    {
      title: t('common.action'),
      key: 'action',
      render: (_: unknown, record: CopyTemplate) => (
        <Space>
          <Button
            type="link"
            size="small"
            onClick={() => navigate(`/templates/${record.id}/edit`)}
          >
            {t('common.edit')}
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
        <h2 className="text-xl font-semibold">{t('template.title')}</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/templates/new')}>
          {t('template.createTemplate')}
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