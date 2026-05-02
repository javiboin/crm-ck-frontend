import { useEffect, useState } from 'react'
import { Table, Button, Modal, Form, Input, Typography, message, Popconfirm, Space } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import suppliersApi from '../../api/suppliers'

const { Title } = Typography

const Suppliers = () => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [modalOpen, setModalOpen] = useState(false)
    const [editing, setEditing] = useState(null)
    const [submitting, setSubmitting] = useState(false)
    const [form] = Form.useForm()

    const fetchData = async () => {
        try {
            const { data } = await suppliersApi.getAll()
            setData(data.suppliers)
        } catch (error) {
            message.error('Error al cargar proveedores')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const openCreate = () => {
        setEditing(null)
        form.resetFields()
        setModalOpen(true)
    }

    const openEdit = (record) => {
        setEditing(record)
        form.setFieldsValue(record)
        setModalOpen(true)
    }

    const onSubmit = async (values) => {
        setSubmitting(true)
        try {
            if (editing) {
                await suppliersApi.update(editing.id, values)
                message.success('Proveedor actualizado correctamente')
            } else {
                await suppliersApi.create(values)
                message.success('Proveedor creado correctamente')
            }
            setModalOpen(false)
            form.resetFields()
            fetchData()
        } catch (error) {
            message.error(error.response?.data?.error || 'Error al guardar')
        } finally {
            setSubmitting(false)
        }
    }

    const onDelete = async (id) => {
        try {
            await suppliersApi.remove(id)
            message.success('Proveedor eliminado correctamente')
            fetchData()
        } catch (error) {
            message.error(error.response?.data?.error || 'Error al eliminar')
        }
    }

    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
        { title: 'Nombre', dataIndex: 'name', key: 'name' },
        { title: 'Teléfono', dataIndex: 'phone', key: 'phone' },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        { title: 'Dirección', dataIndex: 'address', key: 'address' },
        {
            title: 'Acciones',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button icon={<EditOutlined />} onClick={() => openEdit(record)}>Editar</Button>
                    <Popconfirm
                        title='¿Estás seguro de eliminar este proveedor?'
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
                <Title level={3} style={{ margin: 0 }}>Proveedores</Title>
                <Button type='primary' size='large' icon={<PlusOutlined />} onClick={openCreate}>
                    Nuevo
                </Button>
            </div>

            <Table
                dataSource={data}
                columns={columns}
                rowKey='id'
                loading={loading}
                pagination={{ pageSize: 15 }}
            />

            <Modal
                title={editing ? 'Editar proveedor' : 'Nuevo proveedor'}
                open={modalOpen}
                onCancel={() => setModalOpen(false)}
                footer={null}
            >
                <Form form={form} layout='vertical' onFinish={onSubmit}>
                    <Form.Item
                        label='Nombre'
                        name='name'
                        rules={[{ required: true, message: 'El nombre es requerido' }]}
                    >
                        <Input size='large' />
                    </Form.Item>
                    <Form.Item label='Teléfono' name='phone'>
                        <Input size='large' />
                    </Form.Item>
                    <Form.Item label='Email' name='email'>
                        <Input size='large' />
                    </Form.Item>
                    <Form.Item label='Dirección' name='address'>
                        <Input size='large' />
                    </Form.Item>
                    <Button type='primary' htmlType='submit' size='large' block loading={submitting}>
                        {editing ? 'Actualizar' : 'Crear'}
                    </Button>
                </Form>
            </Modal>
        </div>
    )
}

export default Suppliers