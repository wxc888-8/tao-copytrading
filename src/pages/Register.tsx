import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Form, Input, Button, Card, Typography, message } from 'antd'
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { register as registerApi } from '@/services/mockServices'

export default function Register() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)
  const [loading, setLoading] = useState(false)

  const onFinish = async (values: { username: string; password: string; email?: string }) => {
    setLoading(true)
    try {
      const res = await registerApi(values)
      setAuth(res.token, res.userInfo)
      message.success(t('register.success'))
      navigate('/', { replace: true })
    } catch {
      // Error already handled by api interceptor
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0d1117 0%, #161b22 50%, #0d1117 100%)',
      }}
    >
      <Card
        className="login-card"
        style={{
          width: 400,
          borderRadius: 12,
          border: '1px solid rgba(255,255,255,0.06)',
          background: 'rgba(22, 27, 34, 0.8)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }}
      >
        <Typography.Title level={3} style={{ textAlign: 'center', marginBottom: 32, color: '#e6edf3' }}>
          {t('register.title')}
        </Typography.Title>
        <Form onFinish={onFinish} size="large">
          <Form.Item
            name="username"
            rules={[{ required: true, message: t('login.placeholder') + t('login.username') }]}
          >
            <Input prefix={<UserOutlined />} placeholder={t('login.username')} />
          </Form.Item>
          <Form.Item name="email" rules={[{ type: 'email', message: t('register.emailInvalid') }]}>
            <Input prefix={<MailOutlined />} placeholder={t('register.email')} />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              { required: true, message: t('login.placeholder') + t('login.password') },
              { min: 6, message: t('register.passwordMin') },
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder={t('login.password')} />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: t('register.confirmRequired') },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error(t('register.passwordMismatch')))
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder={t('register.confirmPassword')} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              {t('register.register')}
            </Button>
          </Form.Item>
        </Form>
        <div style={{ textAlign: 'center', marginTop: 8 }}>
          <span style={{ color: '#8b949e', fontSize: 14 }}>{t('register.hasAccount')} </span>
          <Link to="/login" style={{ color: '#1677FF' }}>
            {t('login.login')}
          </Link>
        </div>
      </Card>
    </div>
  )
}