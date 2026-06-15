import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Button, Card, Form, Select, message } from 'antd'
import { fetchAccounts, fetchLeaders, fetchTemplates, createCopyTrade } from '@/services/mockServices'
import type { Account, Leader, CopyTemplate } from '@/types'

interface FormValues {
  accountId: string
  leaderId: string
  templateId: string
}

export default function CopyTradeForm() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [form] = Form.useForm<FormValues>()
  const [accounts, setAccounts] = useState<Account[]>([])
  const [leaders, setLeaders] = useState<Leader[]>([])
  const [templates, setTemplates] = useState<CopyTemplate[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchAccounts().then(setAccounts)
    fetchLeaders().then(setLeaders)
    fetchTemplates().then(setTemplates)
  }, [])

  const handleFinish = async (values: FormValues) => {
    setLoading(true)
    try {
      await createCopyTrade(values)
      message.success('创建成功')
      navigate('/copy-trades')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-xl font-semibold">{t('copyTrade.create')}</h2>
      </div>
      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          style={{ maxWidth: 600 }}
        >
          <Form.Item
            name="accountId"
            label={t('copyTrade.selectAccount')}
            rules={[{ required: true, message: '请选择账户' }]}
          >
            <Select placeholder="请选择账户">
              {accounts.map((account) => (
                <Select.Option key={account.id} value={account.id}>
                  {account.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="leaderId"
            label={t('copyTrade.selectLeader')}
            rules={[{ required: true, message: '请选择 Leader' }]}
          >
            <Select placeholder="请选择 Leader">
              {leaders.map((leader) => (
                <Select.Option key={leader.id} value={leader.id}>
                  {leader.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="templateId"
            label={t('copyTrade.selectTemplate')}
            rules={[{ required: true, message: '请选择模板' }]}
          >
            <Select placeholder="请选择模板">
              {templates.map((tmpl) => (
                <Select.Option key={tmpl.id} value={tmpl.id}>
                  {tmpl.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              {t('common.save')}
            </Button>
            <Button className="ml-2" onClick={() => navigate(-1)}>
              {t('common.cancel')}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}
