import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ConfigProvider, theme, App as AntApp } from 'antd'
import { useAppStore } from '@/stores/appStore'
import { useAuthStore } from '@/stores/authStore'
import MainLayout from '@/layouts/MainLayout'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import Dashboard from '@/pages/Dashboard'
import AccountList from '@/pages/accounts/AccountList'
import AccountDetail from '@/pages/accounts/AccountDetail'
import LeaderList from '@/pages/leaders/LeaderList'
import LeaderDetail from '@/pages/leaders/LeaderDetail'
import TemplateList from '@/pages/templates/TemplateList'
import TemplateForm from '@/pages/templates/TemplateForm'
import CopyTradeList from '@/pages/copyTrades/CopyTradeList'
import CopyTradeForm from '@/pages/copyTrades/CopyTradeForm'
import LimitPrices from '@/pages/LimitPrices'
import OrderList from '@/pages/orders/OrderList'
import OrderDetail from '@/pages/orders/OrderDetail'
import PositionsPage from '@/pages/positions/PositionsPage'
import GlobalStats from '@/pages/statistics/GlobalStats'
import LeaderStats from '@/pages/statistics/LeaderStats'
import ProxyConfig from '@/pages/settings/ProxyConfig'
import NodeMonitor from '@/pages/settings/NodeMonitor'
import UserManagement from '@/pages/settings/UserManagement'
import Announcements from '@/pages/settings/Announcements'
import { useEffect } from 'react'
import './i18n'

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)
  if (!isLoggedIn) return <Navigate to="/login" replace />
  return <>{children}</>
}

export default function App() {
  const themeMode = useAppStore((s) => s.theme)
  const loadFromStorage = useAuthStore((s) => s.loadFromStorage)

  useEffect(() => {
    loadFromStorage()
  }, [loadFromStorage])

  return (
    <ConfigProvider
      theme={{
        algorithm: themeMode === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: '#1677FF',
          colorSuccess: '#00B96B',
          colorError: '#FF4D4F',
          borderRadius: 6,
        },
      }}
    >
      <AntApp>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <MainLayout />
                </PrivateRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="accounts" element={<AccountList />} />
              <Route path="accounts/:id" element={<AccountDetail />} />
              <Route path="leaders" element={<LeaderList />} />
              <Route path="leaders/:id" element={<LeaderDetail />} />
              <Route path="templates" element={<TemplateList />} />
              <Route path="templates/new" element={<TemplateForm />} />
              <Route path="templates/:id/edit" element={<TemplateForm />} />
              <Route path="copy-trades" element={<CopyTradeList />} />
              <Route path="copy-trades/new" element={<CopyTradeForm />} />
              <Route path="limit-prices" element={<LimitPrices />} />
              <Route path="orders" element={<OrderList />} />
              <Route path="orders/:id" element={<OrderDetail />} />
              <Route path="positions" element={<PositionsPage />} />
              <Route path="statistics" element={<GlobalStats />} />
              <Route path="statistics/leader" element={<LeaderStats />} />
              <Route path="settings/proxy" element={<ProxyConfig />} />
              <Route path="settings/nodes" element={<NodeMonitor />} />
              <Route path="settings/users" element={<UserManagement />} />
              <Route path="settings/announcements" element={<Announcements />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AntApp>
    </ConfigProvider>
  )
}
