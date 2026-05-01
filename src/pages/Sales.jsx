import { useEffect, useState } from 'react'
import { Table, Button, Modal, Form, InputNumber, Select, Typography, message, Tag, Space } from 'antd'
import { PlusOutlined, StopOutlined } from '@ant-design/icons'
import salesApi from '../api/sales'
import paymentTypesApi from '../api/paymentTypes'
import productsApi from '../api/products'

const { Title } = Typography

const Sales = () => {
    const [sales, setSales] = useState([])
    const [products, setProducts] = useState([])
    const [paymentTypes, setPaymentTypes] = useState([])
    const [loading, setLoading] = useState(true)
    const [modalOpen, setModalOpen] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [items, setItems] = useState([{ product_id: null, quantity: 1, discount_amount: 0 }])
    const [form] = Form.useForm()

    const fetchData = async () => {
        try {
            const [salesRes, productsRes, paymentTypesRes] = await Promise.all([
                salesApi.getAll(),
                productsApi.getAll(),
                paymentTypesApi.getAll()
            ])
            setSales(salesRes.data.sales)
            setProducts(productsRes.data.products)
            setPaymentTypes(paymentTypesRes.data.paymentTypes)
        } catch (error) {
            message.error('Error al cargar datos')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const addItem = () => {
        setItems([...items, { product_id: null, quantity: 1, discount_amount: 0 }])
    }

    const removeItem = (index) => {
        setItems(items.filter((_, i) => i !== index))
    }

    const updateItem = (index, field, value) => {
        const updated = [...items]
        updated[index][field] = value
        setItems(updated)
    }

    const onSubmit = async (values) => {
        if (items.some(i => !i.product_id)) {
            message.error('Seleccioná un producto en cada fila')
            return
        }
        setSubmitting(true)
        try {
            await salesApi.create({ ...values, items })
            message.success('Venta registrada correctamente')
            setModalOpen(false)
            form.resetFields()
            setItems([{ product_id: null, quantity: 1, discount_amount: 0 }])
            fetchData()
        } catch (error) {
            message.error(error.response?.data?.error || 'Error al registrar venta')
        } finally {
            setSubmitting(false)
        }
    }

    const onCancel = async (id) => {
        try {
            await salesApi.cancel(id)
            message.success('Venta anulada correctamente')
            fetchData()
        } catch (error) {
            message.error(error.response?.data?.error || 'Error al anular venta')
        }
    }

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 60
        },
        {
            title: 'Total',
            dataIndex: 'total_amount',
            key: 'total_amount',
            render: (v) => `$${Number(v).toLocaleString('es-AR')}`
        },
        {
            title: 'Descuento',
            dataIndex: 'discount_amount',
            key: 'discount_amount',
            render: (v) => `$${Number(v).toLocaleString('es-AR')}`
        },
        {
            title: 'Final',
            dataIndex: 'final_amount',
            key: 'final_amount',
            render: (v) => `$${Number(v).toLocaleString('es-AR')}`
        },
        {
            title: 'Estado',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={status === 'active' ? 'green' : 'red'}>
                    {status === 'active' ? 'Activa' : 'Anulada'}
                </Tag>
            )
        },
        {
            title: 'Fecha',
            dataIndex: 'sold_at',
            key: 'sold_at',
            render: (date) => new Date(date).toLocaleDateString('es-AR')
        },
        {
            title: 'Acciones',
            key: 'actions',
            render: (_, record) => (
                record.status === 'active' && (
                    <Button
                        danger
                        icon={<StopOutlined />}
                        onClick={() => onCancel(record.id)}
                    >
                        Anular
                    </Button>
                )
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
                <Title level={3} style={{ margin: 0 }}>Ventas</Title>
                <Button
                    type='primary'
                    size='large'
                    icon={<PlusOutlined />}
                    onClick={() => setModalOpen(true)}
                >
                    Nueva venta
                </Button>
            </div>

            <Table
                dataSource={sales}
                columns={columns}
                rowKey='id'
                loading={loading}
                pagination={{ pageSize: 15 }}
            />

            <Modal
                title='Registrar venta'
                open={modalOpen}
                onCancel={() => setModalOpen(false)}
                footer={null}
                width={700}
            >
                <Form form={form} layout='vertical' onFinish={onSubmit}>
                    <Form.Item
                        label='Tipo de pago'
                        name='payment_type_id'
                        rules={[{ required: true, message: 'Seleccioná un tipo de pago' }]}
                    >
                        <Select size='large' placeholder='Seleccioná tipo de pago'>
                            {paymentTypes.map(pt => (
                                <Select.Option key={pt.id} value={pt.id}>{pt.name}</Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item label='Descuento general' name='discount_amount' initialValue={0}>
                        <InputNumber
                            size='large'
                            min={0}
                            prefix='$'
                            style={{ width: '100%' }}
                        />
                    </Form.Item>

                    <Title level={5}>Productos</Title>

                    {items.map((item, index) => (
                        <Space key={index} style={{ display: 'flex', marginBottom: 8 }} align='start'>
                            <Select
                                size='large'
                                placeholder='Producto'
                                style={{ width: 280 }}
                                value={item.product_id}
                                onChange={(v) => updateItem(index, 'product_id', v)}
                                showSearch
                                optionFilterProp='children'
                            >
                                {products.map(p => (
                                    <Select.Option key={p.id} value={p.id}>
                                        {p.name} — Stock: {p.stock}
                                    </Select.Option>
                                ))}
                            </Select>
                            <InputNumber
                                size='large'
                                min={1}
                                value={item.quantity}
                                onChange={(v) => updateItem(index, 'quantity', v)}
                                placeholder='Cantidad'
                                style={{ width: 100 }}
                            />
                            <InputNumber
                                size='large'
                                min={0}
                                value={item.discount_amount}
                                onChange={(v) => updateItem(index, 'discount_amount', v)}
                                placeholder='Descuento'
                                prefix='$'
                                style={{ width: 130 }}
                            />
                            {items.length > 1 && (
                                <Button danger onClick={() => removeItem(index)}>-</Button>
                            )}
                        </Space>
                    ))}

                    <Button
                        type='dashed'
                        onClick={addItem}
                        block
                        icon={<PlusOutlined />}
                        style={{ marginBottom: 16 }}
                    >
                        Agregar producto
                    </Button>

                    <Button
                        type='primary'
                        htmlType='submit'
                        size='large'
                        block
                        loading={submitting}
                    >
                        Registrar venta
                    </Button>
                </Form>
            </Modal>
        </div>
    )
}

export default Sales