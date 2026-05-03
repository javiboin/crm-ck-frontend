import { useEffect, useState } from 'react'
import { Table, Tag, Typography, Select, DatePicker, Row, Col, Button, message } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import logApi from '../api/log'
import dayjs from 'dayjs'

const { Title } = Typography
const { RangePicker } = DatePicker

const Log = () => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [filters, setFilters] = useState({
        type: undefined,
        status: undefined,
        from: undefined,
        to: undefined
    })

    const fetchData = async (params = {}) => {
        setLoading(true)
        try {
            const { data } = await logApi.getLog(params)
            setData(data.log)
        } catch (error) {
            message.error('Error al cargar el log')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const onDateChange = (dates) => {
        if (dates) {
            setFilters(prev => ({
                ...prev,
                from: dates[0].toISOString(),
                to: dates[1].toISOString()
            }))
        } else {
            setFilters(prev => ({ ...prev, from: undefined, to: undefined }))
        }
    }

    const onSearch = () => {
        const params = {}
        if (filters.type) params.type = filters.type
        if (filters.status) params.status = filters.status
        if (filters.from) params.from = filters.from
        if (filters.to) params.to = filters.to
        fetchData(params)
    }

    const onReset = () => {
        setFilters({ type: undefined, status: undefined, from: undefined, to: undefined })
        fetchData()
    }

    const columns = [
        {
            title: 'Fecha',
            dataIndex: 'date',
            key: 'date',
            render: (date) => dayjs(date).format('DD/MM/YYYY HH:mm')
        },
        {
            title: 'Tipo',
            dataIndex: 'type',
            key: 'type',
            render: (type) => (
                <Tag color={type === 'sale' ? 'green' : 'blue'}>
                    {type === 'sale' ? 'Venta' : 'Entrada'}
                </Tag>
            )
        },
        {
            title: 'Detalle',
            dataIndex: 'detail',
            key: 'detail',
            ellipsis: true
        },
        {
            title: 'Referencia',
            key: 'reference',
            render: (_, record) => record.type === 'sale'
                ? record.paymentType
                : record.supplier
        },
        {
            title: 'Monto',
            dataIndex: 'amount',
            key: 'amount',
            render: (amount, record) => (
                <span style={{
                    color: record.type === 'sale' ? '#52c41a' : '#f5222d',
                    fontWeight: 'bold'
                }}>
                    {record.type === 'sale' ? '+' : '-'}${Number(amount).toLocaleString('es-AR')}
                </span>
            )
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
        }
    ]

    return (
        <div>
            <Title level={3} style={{ marginBottom: 24 }}>Log de operaciones</Title>

            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={12} lg={6}>
                    <Select
                        placeholder='Tipo de operación'
                        style={{ width: '100%' }}
                        size='large'
                        allowClear
                        value={filters.type}
                        onChange={(v) => setFilters(prev => ({ ...prev, type: v }))}
                    >
                        <Select.Option value='sale'>Venta</Select.Option>
                        <Select.Option value='shipment'>Entrada</Select.Option>
                    </Select>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Select
                        placeholder='Estado'
                        style={{ width: '100%' }}
                        size='large'
                        allowClear
                        value={filters.status}
                        onChange={(v) => setFilters(prev => ({ ...prev, status: v }))}
                    >
                        <Select.Option value='active'>Activa</Select.Option>
                        <Select.Option value='cancelled'>Anulada</Select.Option>
                    </Select>
                </Col>
                <Col xs={24} lg={8}>
                    <RangePicker
                        style={{ width: '100%' }}
                        size='large'
                        onChange={onDateChange}
                        format='DD/MM/YYYY'
                    />
                </Col>
                <Col xs={24} sm={12} lg={2}>
                    <Button
                        type='primary'
                        size='large'
                        icon={<SearchOutlined />}
                        onClick={onSearch}
                        block
                    >
                        Filtrar
                    </Button>
                </Col>
                <Col xs={24} sm={12} lg={2}>
                    <Button size='large' onClick={onReset} block>
                        Limpiar
                    </Button>
                </Col>
            </Row>

            <Table
                dataSource={data}
                columns={columns}
                rowKey='id'
                loading={loading}
                pagination={{ pageSize: 20 }}
            />
        </div>
    )
}

export default Log