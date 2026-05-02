import { useEffect, useState } from 'react'
import { Table, Button, Modal, Form, Input, Select, Typography, message, Popconfirm, Space } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import modelsApi from '../../api/models'
import brandsApi from '../../api/brands'

const { Title } = Typography

const Models = () => {
    const [data, setData] = useState([])
    const [brands, setBrands] = useState([])
    const [loading, setLoading] = useState(true)
    const [modalOpen, setModalOpen] = useState(false)
    const [editing, setEditing] = useState(null)
    const [submitting, setSubmitting] = useState(false)
    const [form] = Form.useForm()

    const fetchData = async () => {
        try {
            const [modelsRes, brandsRes] = await Promise.all([
                modelsApi.getAll(),
                brandsApi.getAll()
            ])
            setData(modelsRes.data.models)
            setBrands(brandsRes.data.brands)
        } catch (error) {
            message.error('Error al cargar datos')
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
                await modelsApi.update(editing.id, values)
                message.success('Modelo actualizado correctamente')
            } else {
                await modelsApi.create(values)
                message.success('Modelo creado correctamente')
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
            await modelsApi.remove(id)
            message.success('Modelo eliminado correctamente')
            fetchData()
        } catch (error) {
            message.error(error.response?.data?.error || 'Error al eliminar')
        }
    }

    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
        { title: 'Nombre', dataIndex: 'name', key: 'name' },
        {
            title: 'Marca',
            dataIndex: 'brand_id',
            key: 'brand_id',
            render: (id) => brands.find(b => b.id === id)?.name || id
        },
        {
            title: 'Acciones',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button icon={<EditOutlined />} onClick={() => openEdit(record)}>Editar</Button>
                    <Popconfirm
                        title='¿Estás seguro de eliminar este modelo?'
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
                <Title level={3} style={{ margin: 0 }}>Modelos</Title>
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
                title={editing ? 'Editar modelo' : 'Nuevo modelo'}
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
                    <Form.Item
                        label='Marca'
                        name='brand_id'
                        rules={[{ required: true, message: 'Seleccioná una marca' }]}
                    >
                        <Select size='large' placeholder='Seleccioná una marca'>
                            {brands.map(b => (
                                <Select.Option key={b.id} value={b.id}>{b.name}</Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Button type='primary' htmlType='submit' size='large' block loading={submitting}>
                        {editing ? 'Actualizar' : 'Crear'}
                    </Button>
                </Form>
            </Modal>
        </div>
    )
}

export default Models