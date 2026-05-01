import { useEffect, useState } from 'react'
import { Table, Tag, Typography, Input, Button, Space } from 'antd'
import { PlusOutlined, SearchOutlined } from '@ant-design/icons'
import productsApi from '../api/products'

const { Title } = Typography

const Stock = () => {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')

    const fetchProducts = async () => {
        try {
            const { data } = await productsApi.getAll()
            console.log('data', data)
            setProducts(data.products || [])
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProducts()
    }, [])

    const filtered = products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase())
    )

    const columns = [
        {
            title: 'Nombre',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: 'Talle',
            dataIndex: 'size',
            key: 'size'
        },
        {
            title: 'Precio',
            dataIndex: 'price',
            key: 'price',
            render: (price) => `$${Number(price).toLocaleString('es-AR')}`
        },
        {
            title: 'Stock',
            dataIndex: 'stock',
            key: 'stock',
            render: (stock) => (
                <Tag color={stock === 0 ? 'red' : stock <= 3 ? 'orange' : 'green'}>
                    {stock === 0 ? 'Sin stock' : stock <= 3 ? `Bajo (${stock})` : stock}
                </Tag>
            )
        }
    ]

    return (
        <div>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 24
            }}>
                <Title level={3} style={{ margin: 0 }}>Stock de productos</Title>
                <Button type='primary' size='large' icon={<PlusOutlined />}>
                    Nuevo producto
                </Button>
            </div>
            <Input
                placeholder='Buscar producto...'
                prefix={<SearchOutlined />}
                size='large'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ marginBottom: 16, maxWidth: 400 }}
            />
            <Table
                dataSource={filtered}
                columns={columns}
                rowKey='id'
                loading={loading}
                pagination={{ pageSize: 15 }}
            />
        </div>
    )
}

export default Stock