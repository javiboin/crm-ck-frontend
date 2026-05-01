import { useState } from 'react'
import { Layout, Menu, Button, Typography } from 'antd'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import {
    DashboardOutlined,
    ShoppingCartOutlined,
    InboxOutlined,
    AppstoreOutlined,
    LogoutOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined
} from '@ant-design/icons'
import { useAuth } from '../../context/AuthContext'

const { Sider, Content, Header } = Layout
const { Text } = Typography

const menuItems = [
    {
        key: '/dashboard',
        icon: <DashboardOutlined />,
        label: 'Dashboard'
    },
    {
        key: '/stock',
        icon: <AppstoreOutlined />,
        label: 'Stock'
    },
    {
        key: '/sales',
        icon: <ShoppingCartOutlined />,
        label: 'Ventas'
    },
    {
        key: '/shipments',
        icon: <InboxOutlined />,
        label: 'Entradas'
    },
    {
        key: 'abm',
        icon: <AppstoreOutlined />,
        label: 'ABM',
        children: [
            { key: '/abm/brands', label: 'Marcas' },
            { key: '/abm/categories', label: 'Categorías' },
            { key: '/abm/colors', label: 'Colores' },
            { key: '/abm/genders', label: 'Géneros' },
            { key: '/abm/models', label: 'Modelos' },
            { key: '/abm/suppliers', label: 'Proveedores' },
            { key: '/abm/payment-types', label: 'Tipos de pago' }
        ]
    }
]

const MainLayout = () => {
    const [collapsed, setCollapsed] = useState(false)
    const { logout } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    const onMenuClick = ({ key }) => {
        navigate(key)
    }

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider
                collapsible
                collapsed={collapsed}
                trigger={null}
                width={220}
            >
                <div style={{
                    padding: '16px',
                    textAlign: 'center',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: collapsed ? 14 : 18,
                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                    marginBottom: 8
                }}>
                    {collapsed ? 'CK' : 'CRM-CK'}
                </div>
                <Menu
                    theme='dark'
                    mode='inline'
                    selectedKeys={[location.pathname]}
                    items={menuItems}
                    onClick={onMenuClick}
                />
            </Sider>
            <Layout>
                <Header style={{
                    background: '#fff',
                    padding: '0 24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: '1px solid #f0f0f0'
                }}>
                    <Button
                        type='text'
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        size='large'
                    />
                    <Button
                        type='text'
                        icon={<LogoutOutlined />}
                        onClick={logout}
                        size='large'
                    >
                        Salir
                    </Button>
                </Header>
                <Content style={{
                    margin: '24px',
                    padding: '24px',
                    background: '#fff',
                    borderRadius: 8,
                    minHeight: 'calc(100vh - 112px)'
                }}>
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    )
}

export default MainLayout