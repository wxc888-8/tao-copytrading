import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Form, Input, Button, Card, Typography, message, Divider } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { login as loginApi } from '@/services/mockServices'

export default function Login() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)
  const [loading, setLoading] = useState(false)

  const onFinish = async (values: { username: string; password: string }) => {
    setLoading(true)
    try {
      const res = await loginApi(values)
      setAuth(res.token, res.userInfo)
      message.success(t('login.success'))
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
          {t('login.title')}
        </Typography.Title>
        <Form onFinish={onFinish} size="large">
          <Form.Item
            name="username"
            rules={[{ required: true, message: t('login.placeholder') + t('login.username') }]}
          >
            <Input prefix={<UserOutlined />} placeholder={t('login.username')} />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: t('login.placeholder') + t('login.password') }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder={t('login.password')} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              {t('login.login')}
            </Button>
          </Form.Item>
        </Form>
        <Divider style={{ borderColor: 'rgba(255,255,255,0.06)', color: '#8b949e', fontSize: 13 }}>
          {t('common.or')}
        </Divider>
        <div style={{ textAlign: 'center' }}>
          <Link to="/register" style={{ color: '#1677FF' }}>
            {t('login.registerNow')}
          </Link>
        </div>
      </Card>
    </div>
  )
}