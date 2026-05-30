import { useEffect, useState } from 'react'
import { Table, Tag, Typography, Input, Button, Modal, Form, Select, InputNumber, message, Popconfirm, Space, Row, Col } from 'antd'
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import productsApi from '../api/products'
import brandsApi from '../api/brands'
import modelsApi from '../api/models'
import categoriesApi from '../api/categories'
import gendersApi from '../api/genders'
import colorsApi from '../api/colors'

const { Title } = Typography

const Stock = () => {
    const [products, setProducts] = useState([])
    const [brands, setBrands] = useState([])
    const [models, setModels] = useState([])
    const [filteredModels, setFilteredModels] = useState([])
    const [categories, setCategories] = useState([])
    const [genders, setGenders] = useState([])
    const [colors, setColors] = useState([])
    const [loading, setLoading] = useState(true)
    const [modalOpen, setModalOpen] = useState(false)
    const [editing, setEditing] = useState(null)
    const [submitting, setSubmitting] = useState(false)
    const [search, setSearch] = useState('')
    const [form] = Form.useForm()

    const fetchProducts = async () => {
        try {
            const [productsRes, brandsRes, modelsRes, categoriesRes, gendersRes, colorsRes] = await Promise.all([
                productsApi.getAll(),
                brandsApi.getAll(),
                modelsApi.getAll(),
                categoriesApi.getAll(),
                gendersApi.getAll(),
                colorsApi.getAll()
            ])
            setProducts(productsRes.data.products)
            setBrands(brandsRes.data.brands)
            setModels(modelsRes.data.models)
            setCategories(categoriesRes.data.categories)
            setGenders(gendersRes.data.genders)
            setColors(colorsRes.data.colors)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProducts()
    }, [])

    const onBrandChange = (brandId) => {
        const filtered = models.filter(m => m.brand_id === brandId)
        setFilteredModels(filtered)
        form.setFieldValue('model_id', undefined)
    }

    const openCreate = () => {
        setEditing(null)
        setFilteredModels([])
        form.resetFields()
        setModalOpen(true)
    }

    const openEdit = (record) => {
        setEditing(record)
        const filtered = models.filter(m => m.brand_id === record.model?.brand_id)
        setFilteredModels(filtered)
        form.setFieldsValue({
            name: record.name,
            model_id: record.model_id,
            size: record.size,
            category_id: record.category_id,
            gender_id: record.gender_id,
            color_id: record.color_id,
            image_url: record.image_url,
            stock: record.stock,
            price: record.price
        })
        setModalOpen(true)
    }

    const onSubmit = async (values) => {
        setSubmitting(true)
        try {
            if (editing) {
                await productsApi.update(editing.id, values)
                message.success('Producto actualizado correctamente')
            } else {
                await productsApi.create(values)
                message.success('Producto creado correctamente')
            }
            setModalOpen(false)
            form.resetFields()
            fetchData()
        } catch (error) {
            message.error(error.response?.data?.error || 'Error al guardar producto')
        } finally {
            setSubmitting(false)
        }
    }

    const onDelete = async (id) => {
        try {
            await productsApi.remove(id)
            message.success('Producto eliminado correctamente')
            fetchData()
        } catch (error) {
            message.error(error.response?.data?.error || 'Error al eliminar producto')
        }
    }

    const filtered = products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase())
    )

    const columns = [
        { title: 'Nombre', dataIndex: 'name', key: 'name' },
        {
            title: 'Modelo',
            key: 'model',
            render: (_, record) => record.model?.name || '-'
        },
        { title: 'Talle', dataIndex: 'size', key: 'size' },
        {
            title: 'Categoría',
            key: 'category',
            render: (_, record) => record.category?.name || '-'
        },
        {
            title: 'Color',
            key: 'color',
            render: (_, record) => record.color?.name || '-'
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
        },
        {
            title: 'Acciones',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button icon={<EditOutlined />} onClick={() => openEdit(record)}>Editar</Button>
                    <Popconfirm
                        title='¿Estás seguro de eliminar este producto?'
                        onConfirm={() => onDelete(record.id)}
                        okText='Sí'
                        cancelText='No'
                    >
                        <Button danger icon={<DeleteOutlined />}>Eliminar</Button>
                    </Popconfirm>
                </Space>
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
                <Button type='primary' size='large' icon={<PlusOutlined />} onClick={openCreate}>
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

            <Modal
                title={editing ? 'Editar producto' : 'Nuevo producto'}
                open={modalOpen}
                onCancel={() => setModalOpen(false)}
                footer={null}
                width={1500}
            // increased width for better data visibility
            >
                <Form form={form} layout='vertical' onFinish={onSubmit}>
                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={12} md={8}>
                            <Form.Item
                                label='Nombre'
                                name='name'
                                rules={[{ required: true, message: 'El nombre es requerido' }]}
                            >
                                <Input size='large' />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={8}>
                            <Form.Item
                                label='Marca'
                                name='brand_id'
                                rules={[{ required: true, message: 'Seleccioná una marca' }]}
                            >
                                <Select
                                    size='large'
                                    placeholder='Seleccioná una marca'
                                    onChange={onBrandChange}
                                >
                                    {brands.map(b => (
                                        <Select.Option key={b.id} value={b.id}>{b.name}</Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={8}>
                            <Form.Item
                                label='Modelo'
                                name='model_id'
                                rules={[{ required: true, message: 'Seleccioná un modelo' }]}
                            >
                                <Select
                                    size='large'
                                    placeholder='Seleccioná un modelo'
                                    disabled={filteredModels.length === 0}
                                >
                                    {filteredModels.map(m => (
                                        <Select.Option key={m.id} value={m.id}>{m.name}</Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={8}>
                            <Form.Item
                                label='Talle'
                                name='size'
                                rules={[{ required: true, message: 'El talle es requerido' }]}
                            >
                                <Input size='large' />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={8}>
                            <Form.Item
                                label='Categoría'
                                name='category_id'
                                rules={[{ required: true, message: 'Seleccioná una categoría' }]}
                            >
                                <Select size='large' placeholder='Seleccioná una categoría'>
                                    {categories.map(c => (
                                        <Select.Option key={c.id} value={c.id}>{c.name}</Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={8}>
                            <Form.Item
                                label='Género'
                                name='gender_id'
                                rules={[{ required: true, message: 'Seleccioná un género' }]}
                            >
                                <Select size='large' placeholder='Seleccioná un género'>
                                    {genders.map(g => (
                                        <Select.Option key={g.id} value={g.id}>{g.name}</Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={8}>
                            <Form.Item
                                label='Color'
                                name='color_id'
                                rules={[{ required: true, message: 'Seleccioná un color' }]}
                            >
                                <Select size='large' placeholder='Seleccioná un color'>
                                    {colors.map(c => (
                                        <Select.Option key={c.id} value={c.id}>{c.name}</Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={8}>
                            <Form.Item label='URL de imagen' name='image_url'>
                                <Input size='large' placeholder='https://...' />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={8}>
                            <Form.Item
                                label='Stock'
                                name='stock'
                                rules={[{ required: true, message: 'El stock es requerido' }]}
                            >
                                <InputNumber size='large' min={0} style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={8}>
                            <Form.Item
                                label='Precio'
                                name='price'
                                rules={[{ required: true, message: 'El precio es requerido' }]}
                            >
                                <InputNumber size='large' min={0} prefix='$' style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Button type='primary' htmlType='submit' size='large' block loading={submitting}>
                                {editing ? 'Actualizar' : 'Crear'}
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </div>
    )
}

export default Stock