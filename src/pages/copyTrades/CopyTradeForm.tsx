import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Button, Card, Form, Select, message } from 'antd'
import { mockAccounts, mockLeaders, mockTemplates } from '@/services/mockData'

interface FormValues {
  accountId: string
  leaderId: string
  templateId: string
}

export default function CopyTradeForm() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [form] = Form.useForm<FormValues>()

  const handleFinish = (values: FormValues) => {
    console.log('Save copy trade:', values)
    message.success('创建成功')
    navigate('/copy-trades')
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
              {mockAccounts.map((account) => (
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
              {mockLeaders.map((leader) => (
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
              {mockTemplates.map((tmpl) => (
                <Select.Option key={tmpl.id} value={tmpl.id}>
                  {tmpl.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
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
