import { useEffect, useState } from 'react'
import { Row, Col, Card, Statistic, Table, Tag, Typography, message } from 'antd'
import {
    LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import dashboardApi from '../api/dashboard'

const { Title } = Typography

const COLORS = ['#1677ff', '#52c41a', '#faad14', '#f5222d', '#722ed1']

const Dashboard = () => {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await dashboardApi.getMetrics()
                setData(data)
            } catch (error) {
                message.error('Error al cargar el dashboard')
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    if (loading) return <div>Cargando...</div>
    if (!data) return null

    const { metrics, charts } = data

    const salesByDayData = charts.salesByDay.map(d => ({
        dia: `Día ${d.day}`,
        total: Number(d.total)
    }))

    const topProductsData = charts.topProducts.map(p => ({
        nombre: p.product.name,
        vendidos: Number(p.total_sold)
    }))

    const bottomProductsData = charts.bottomProducts.map(p => ({
        nombre: p.product.name,
        vendidos: Number(p.total_sold)
    }))

    const paymentTypeData = charts.salesByPaymentType.map(p => ({
        nombre: p.paymentType.name,
        total: Number(p.total)
    }))

    const lowStockColumns = [
        { title: 'Producto', dataIndex: 'name', key: 'name' },
        {
            title: 'Stock',
            dataIndex: 'stock',
            key: 'stock',
            render: (stock) => (
                <Tag color={stock === 0 ? 'red' : 'orange'}>
                    {stock === 0 ? 'Sin stock' : `Bajo (${stock})`}
                </Tag>
            )
        }
    ]

    return (
        <div>
            <Title level={3} style={{ marginBottom: 24 }}>Dashboard</Title>

            {/* Métricas */}
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title='Vendido hoy'
                            value={metrics.todaySales}
                            prefix='$'
                            precision={2}
                            valueStyle={{ color: '#1677ff' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title='Vendido esta semana'
                            value={metrics.weekSales}
                            prefix='$'
                            precision={2}
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title='Vendido este mes'
                            value={metrics.monthSales}
                            prefix='$'
                            precision={2}
                            valueStyle={{ color: '#722ed1' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title='Ventas del mes'
                            value={metrics.monthSalesCount}
                            valueStyle={{ color: '#faad14' }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Gráficas */}
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={24} lg={16}>
                    <Card title='Ventas por día del mes'>
                        <ResponsiveContainer width='100%' height={300}>
                            <LineChart data={salesByDayData}>
                                <CartesianGrid strokeDasharray='3 3' />
                                <XAxis dataKey='dia' />
                                <YAxis />
                                <Tooltip formatter={(v) => `$${v.toLocaleString('es-AR')}`} />
                                <Line type='monotone' dataKey='total' stroke='#1677ff' strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>
                <Col xs={24} lg={8}>
                    <Card title='Ventas por tipo de pago'>
                        <ResponsiveContainer width='100%' height={300}>
                            <PieChart>
                                <Pie
                                    data={paymentTypeData}
                                    dataKey='total'
                                    nameKey='nombre'
                                    cx='50%'
                                    cy='50%'
                                    outerRadius={100}
                                    label={({ nombre, percent }) => `${nombre} ${(percent * 100).toFixed(0)}%`}
                                >
                                    {paymentTypeData.map((_, index) => (
                                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={24} lg={12}>
                    <Card title='Productos más vendidos'>
                        <ResponsiveContainer width='100%' height={300}>
                            <BarChart data={topProductsData}>
                                <CartesianGrid strokeDasharray='3 3' />
                                <XAxis dataKey='nombre' tick={{ fontSize: 11 }} />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey='vendidos' fill='#52c41a' />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>
                <Col xs={24} lg={12}>
                    <Card title='Productos menos vendidos'>
                        <ResponsiveContainer width='100%' height={300}>
                            <BarChart data={bottomProductsData}>
                                <CartesianGrid strokeDasharray='3 3' />
                                <XAxis dataKey='nombre' tick={{ fontSize: 11 }} />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey='vendidos' fill='#f5222d' />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>
            </Row>

            {/* Stock bajo */}
            <Card title='Productos con stock bajo o sin stock'>
                <Table
                    dataSource={metrics.lowStock}
                    columns={lowStockColumns}
                    rowKey='id'
                    pagination={false}
                    locale={{ emptyText: '✅ Todos los productos tienen stock suficiente' }}
                />
            </Card>
        </div>
    )
}

export default Dashboard