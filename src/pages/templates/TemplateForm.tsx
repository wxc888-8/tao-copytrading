import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Button, Card, Form, Input, InputNumber, Radio, Space, Switch, message,
} from 'antd'
import { fetchTemplate, createTemplate, updateTemplate } from '@/services/mockServices'
import type { CopyTemplate } from '@/types'

interface FormValues {
  name: string
  copyType: 'ratio' | 'fixed'
  copyRatio?: number
  fixedAmount?: string
  dailyLossLimit?: string
  maxOpsPerDay: number
  slippageTolerance: number
  stakeRiskThreshold?: string
  status: boolean
}

export default function TemplateForm() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { id } = useParams()
  const [form] = Form.useForm<FormValues>()
  const [loading, setLoading] = useState(false)
  const isEdit = Boolean(id)
  const copyType = Form.useWatch('copyType', form)

  useEffect(() => {
    if (isEdit && id) {
      fetchTemplate(id).then((template) => {
        if (template) {
          form.setFieldsValue({
            name: template.name,
            copyType: template.copyType,
            copyRatio: template.copyRatio,
            fixedAmount: template.fixedAmount,
            dailyLossLimit: template.dailyLossLimit,
            maxOpsPerDay: template.maxOpsPerDay,
            slippageTolerance: template.slippageTolerance,
            stakeRiskThreshold: template.stakeRiskThreshold,
            status: template.status === 'active',
          })
        }
      })
    }
  }, [isEdit, id, form])

  const handleFinish = async (values: FormValues) => {
    setLoading(true)
    try {
      const payload = {
        name: values.name,
        copyType: values.copyType,
        copyRatio: values.copyType === 'ratio' ? values.copyRatio : undefined,
        fixedAmount: values.copyType === 'fixed' ? values.fixedAmount : undefined,
        dailyLossLimit: values.dailyLossLimit,
        maxOpsPerDay: values.maxOpsPerDay,
        slippageTolerance: values.slippageTolerance,
        stakeRiskThreshold: values.stakeRiskThreshold,
        status: values.status ? 'active' : 'disabled',
      } as any
      if (isEdit && id) {
        await updateTemplate(id, payload)
      } else {
        await createTemplate(payload)
      }
      message.success(isEdit ? '编辑成功' : '创建成功')
      navigate('/templates')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-xl font-semibold">
          {isEdit ? t('template.editTemplate') : t('template.createTemplate')}
        </h2>
      </div>
      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          initialValues={{
            copyType: 'ratio',
            copyRatio: 0.5,
            maxOpsPerDay: 10,
            slippageTolerance: 0.5,
            status: true,
          }}
          style={{ maxWidth: 600 }}
        >
          <Form.Item
            name="name"
            label={t('template.name')}
            rules={[{ required: true, message: '请输入模板名称' }]}
          >
            <Input placeholder="请输入模板名称" />
          </Form.Item>

          <Form.Item
            name="copyType"
            label={t('template.copyType')}
            rules={[{ required: true }]}
          >
            <Radio.Group>
              <Radio value="ratio">{t('template.copyTypeRatio')}</Radio>
              <Radio value="fixed">{t('template.copyTypeFixed')}</Radio>
            </Radio.Group>
          </Form.Item>

          {copyType === 'ratio' && (
            <Form.Item
              name="copyRatio"
              label={t('template.copyRatio')}
              rules={[{ required: true, message: '请输入跟单比例' }]}
            >
              <InputNumber<number>
                min={0}
                max={100}
                formatter={(value) => `${value}%`}
                parser={(value) => (value ? parseFloat(value.replace('%', '')) : 0) as unknown as undefined}
                style={{ width: 200 }}
              />
            </Form.Item>
          )}

          {copyType === 'fixed' && (
            <Form.Item
              name="fixedAmount"
              label={t('template.fixedAmount')}
              rules={[{ required: true, message: '请输入固定金额' }]}
            >
              <InputNumber min={0} style={{ width: 200 }} placeholder="请输入固定金额" />
            </Form.Item>
          )}

          <Form.Item name="dailyLossLimit" label={t('template.dailyLossLimit')}>
            <InputNumber min={0} style={{ width: 200 }} />
          </Form.Item>

          <Form.Item
            name="maxOpsPerDay"
            label={t('template.maxOpsPerDay')}
            rules={[{ required: true, message: '请输入每日最大操作次数' }]}
          >
            <InputNumber min={1} max={9999} style={{ width: 200 }} />
          </Form.Item>

          <Form.Item
            name="slippageTolerance"
            label={t('template.slippageTolerance')}
            rules={[{ required: true, message: '请输入滑点容忍度' }]}
          >
            <InputNumber<number>
              min={0.01}
              max={1}
              step={0.01}
              formatter={(value) => `${value}%`}
              parser={(value) => (value ? parseFloat(value.replace('%', '')) : 0) as unknown as undefined}
              style={{ width: 200 }}
            />
          </Form.Item>

          <Form.Item name="stakeRiskThreshold" label={t('template.stakeRiskThreshold')}>
            <Input placeholder="请输入质押风控阈值" style={{ width: 200 }} />
          </Form.Item>

          <Form.Item name="status" label={t('common.status')} valuePropName="checked">
            <Switch
              checkedChildren={t('common.enabled')}
              unCheckedChildren={t('common.disabled_')}
            />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                {t('common.save')}
              </Button>
              <Button onClick={() => navigate(-1)}>{t('common.cancel')}</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}