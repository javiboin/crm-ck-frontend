import { useEffect, useState } from 'react'
import { Table, Button, Modal, Form, InputNumber, Select, Typography, message, Tag, Space } from 'antd'
import { PlusOutlined, StopOutlined } from '@ant-design/icons'
import shipmentsApi from '../api/shipments'
import suppliersApi from '../api/suppliers'
import productsApi from '../api/products'

const { Title } = Typography

const Shipments = () => {
    const [shipments, setShipments] = useState([])
    const [products, setProducts] = useState([])
    const [suppliers, setSuppliers] = useState([])
    const [loading, setLoading] = useState(true)
    const [modalOpen, setModalOpen] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [items, setItems] = useState([{ product_id: null, quantity: 1, unit_cost: 0 }])
    const [form] = Form.useForm()

    const fetchData = async () => {
        try {
            const [shipmentsRes, productsRes, suppliersRes] = await Promise.all([
                shipmentsApi.getAll(),
                productsApi.getAll(),
                suppliersApi.getAll()
            ])
            setShipments(shipmentsRes.data.supplierShipments)
            setProducts(productsRes.data.products)
            setSuppliers(suppliersRes.data.suppliers)
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
        setItems([...items, { product_id: null, quantity: 1, unit_cost: 0 }])
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
            await shipmentsApi.create({ ...values, items })
            message.success('Entrada registrada correctamente')
            setModalOpen(false)
            form.resetFields()
            setItems([{ product_id: null, quantity: 1, unit_cost: 0 }])
            fetchData()
        } catch (error) {
            message.error(error.response?.data?.error || 'Error al registrar entrada')
        } finally {
            setSubmitting(false)
        }
    }

    const onCancel = async (id) => {
        try {
            await shipmentsApi.cancel(id)
            message.success('Entrada anulada correctamente')
            fetchData()
        } catch (error) {
            message.error(error.response?.data?.error || 'Error al anular entrada')
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
            title: 'Proveedor',
            dataIndex: 'supplier_id',
            key: 'supplier_id',
            render: (id) => suppliers.find(s => s.id === id)?.name || id
        },
        {
            title: 'Costo de envío',
            dataIndex: 'shipping_cost',
            key: 'shipping_cost',
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
            dataIndex: 'received_at',
            key: 'received_at',
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
                <Title level={3} style={{ margin: 0 }}>Entradas de mercadería</Title>
                <Button
                    type='primary'
                    size='large'
                    icon={<PlusOutlined />}
                    onClick={() => setModalOpen(true)}
                >
                    Nueva entrada
                </Button>
            </div>

            <Table
                dataSource={shipments}
                columns={columns}
                rowKey='id'
                loading={loading}
                pagination={{ pageSize: 15 }}
            />

            <Modal
                title='Registrar entrada de mercadería'
                open={modalOpen}
                onCancel={() => setModalOpen(false)}
                footer={null}
                width={700}
            >
                <Form form={form} layout='vertical' onFinish={onSubmit}>
                    <Form.Item
                        label='Proveedor'
                        name='supplier_id'
                        rules={[{ required: true, message: 'Seleccioná un proveedor' }]}
                    >
                        <Select size='large' placeholder='Seleccioná proveedor'>
                            {suppliers.map(s => (
                                <Select.Option key={s.id} value={s.id}>{s.name}</Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item label='Costo de envío' name='shipping_cost' initialValue={0}>
                        <InputNumber
                            size='large'
                            min={0}
                            prefix='$'
                            style={{ width: '100%' }}
                        />
                    </Form.Item>

                    <Form.Item label='Fecha de recepción' name='received_at'>
                        <input type='datetime-local' style={{ width: '100%', padding: '8px', borderRadius: 6, border: '1px solid #d9d9d9' }} />
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
                                value={item.unit_cost}
                                onChange={(v) => updateItem(index, 'unit_cost', v)}
                                placeholder='Costo unit.'
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
                        Registrar entrada
                    </Button>
                </Form>
            </Modal>
        </div>
    )
}

export default Shipments