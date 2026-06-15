import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Layout, Menu, Dropdown, Button, Switch, Avatar, Space, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import { useAppStore } from '@/stores/appStore'
import { useAuthStore } from '@/stores/authStore'
import type { MenuProps } from 'antd'
import {
  DashboardOutlined,
  WalletOutlined,
  UserSwitchOutlined,
  FileTextOutlined,
  CopyOutlined,
  ShoppingCartOutlined,
  PieChartOutlined,
  BarChartOutlined,
  SettingOutlined,
  NodeIndexOutlined,
  TeamOutlined,
  BellOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MoonOutlined,
  SunOutlined,
  LogoutOutlined,
  UserOutlined,
  FieldNumberOutlined,
} from '@ant-design/icons'

const { Header, Sider, Content } = Layout

export default function MainLayout() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const {
    sidebarCollapsed,
    toggleSidebar,
    theme: themeMode,
    setTheme,
    language,
    setLanguage,
  } = useAppStore()
  const { userInfo, logout } = useAuthStore()
  const isAdmin = userInfo?.role === 'admin'

  const menuItems: MenuProps['items'] = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: t('nav.dashboard'),
    },
    {
      key: '/accounts',
      icon: <WalletOutlined />,
      label: t('nav.accounts'),
    },
    {
      key: '/leaders',
      icon: <UserSwitchOutlined />,
      label: t('nav.leaders'),
    },
    {
      key: '/templates',
      icon: <FileTextOutlined />,
      label: t('nav.templates'),
    },
    {
      key: '/copy-trades',
      icon: <CopyOutlined />,
      label: t('nav.copyTrades'),
    },
    {
      key: '/limit-prices',
      icon: <FieldNumberOutlined />,
      label: t('nav.limitPrices'),
    },
    {
      key: '/orders',
      icon: <ShoppingCartOutlined />,
      label: t('nav.orders'),
    },
    {
      key: '/positions',
      icon: <PieChartOutlined />,
      label: t('nav.positions'),
    },
    {
      key: 'statistics',
      icon: <BarChartOutlined />,
      label: t('nav.statistics'),
      children: [
        {
          key: '/statistics',
          label: t('nav.globalStats'),
        },
        {
          key: '/statistics/leader',
          label: t('nav.leaderStats'),
        },
      ],
    },
    ...(isAdmin
      ? [
          {
            key: 'settings' as const,
            icon: <SettingOutlined />,
            label: t('nav.settings'),
            children: [
              {
                key: '/settings/proxy',
                icon: <NodeIndexOutlined />,
                label: t('nav.proxy'),
              },
              {
                key: '/settings/nodes',
                icon: <NodeIndexOutlined />,
                label: t('nav.nodes'),
              },
              {
                key: '/settings/users',
                icon: <TeamOutlined />,
                label: t('nav.users'),
              },
              {
                key: '/settings/announcements',
                icon: <BellOutlined />,
                label: t('nav.announcements'),
              },
            ],
          },
        ]
      : []),
  ]

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
    },
  ]

  const handleUserMenuClick: MenuProps['onClick'] = (info) => {
    if (info.key === 'logout') {
      handleLogout()
    }
  }

  const toggleThemeMode = () => {
    setTheme(themeMode === 'dark' ? 'light' : 'dark')
  }

  const cycleLanguage = () => {
    const langOrder = ['zh-CN', 'en-US']
    const currentIdx = langOrder.indexOf(language)
    const nextLang = langOrder[(currentIdx + 1) % langOrder.length] as 'zh-CN' | 'en-US'
    setLanguage(nextLang)
    i18n.changeLanguage(nextLang)
  }

  // Compute selected keys: match the current pathname
  const selectedKeys = [location.pathname]

  // Default open submenus based on current path
  const defaultOpenKeys = ['statistics', 'settings']

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={sidebarCollapsed}
        theme={themeMode === 'dark' ? 'dark' : 'light'}
        width={240}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 100,
          borderRight: themeMode === 'dark' ? '1px solid #1f2937' : '1px solid #e5e7eb',
        }}
      >
        <div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderBottom: themeMode === 'dark' ? '1px solid #1f2937' : '1px solid #e5e7eb',
          }}
        >
          <Typography.Title
            level={4}
            style={{
              margin: 0,
              color: themeMode === 'dark' ? '#e5e7eb' : '#1f2937',
              whiteSpace: 'nowrap',
            }}
          >
            {sidebarCollapsed ? 'T' : 'TAO System'}
          </Typography.Title>
        </div>
        <Menu
          theme={themeMode === 'dark' ? 'dark' : 'light'}
          mode="inline"
          selectedKeys={selectedKeys}
          defaultOpenKeys={defaultOpenKeys}
          items={menuItems}
          onClick={({ key }) => {
            if (key === 'statistics' || key === 'settings') return
            navigate(key)
          }}
        />
      </Sider>
      <Layout
        style={{
          marginLeft: sidebarCollapsed ? 80 : 240,
          transition: 'margin-left 0.2s',
        }}
      >
        <Header
          style={{
            padding: '0 24px',
            background: themeMode === 'dark' ? '#161B22' : '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: themeMode === 'dark' ? '1px solid #1f2937' : '1px solid #e5e7eb',
            height: 64,
            position: 'sticky',
            top: 0,
            zIndex: 99,
          }}
        >
          <Space>
            <Button
              type="text"
              icon={sidebarCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={toggleSidebar}
              style={{ fontSize: 16, width: 40, height: 40 }}
            />
          </Space>
          <Space size="middle">
            <Switch
              checkedChildren={<MoonOutlined />}
              unCheckedChildren={<SunOutlined />}
              checked={themeMode === 'dark'}
              onChange={toggleThemeMode}
            />
            <Button type="text" onClick={cycleLanguage}>
              {language}
            </Button>
            <Dropdown
              menu={{ items: userMenuItems, onClick: handleUserMenuClick }}
              placement="bottomRight"
            >
              <Space style={{ cursor: 'pointer' }}>
                <Avatar icon={<UserOutlined />} />
                <span>{userInfo?.username || 'User'}</span>
              </Space>
            </Dropdown>
          </Space>
        </Header>
        <Content
          style={{
            margin: 24,
            minHeight: 280,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}
