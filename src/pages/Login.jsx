import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Input, Button, Card, Typography, message } from 'antd'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

const { Title } = Typography

const Login = () => {
    const [loading, setLoading] = useState(false)
    const { login } = useAuth()
    const navigate = useNavigate()

    const onFinish = async (values) => {
        setLoading(true)
        try {
            const { data } = await api.post('/auth/login', values)
            login(data.token)
            navigate('/dashboard')
        } catch (error) {
            message.error('Credenciales inválidas')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#f0f2f5'
        }}>
            <Card style={{ width: 400 }}>
                <Title level={3} style={{ textAlign: 'center', marginBottom: 32 }}>
                    CRM-CK
                </Title>
                <Form layout='vertical' onFinish={onFinish}>
                    <Form.Item
                        label='Email'
                        name='email'
                        rules={[
                            { required: true, message: 'El email es requerido' },
                            { type: 'email', message: 'Email inválido' }
                        ]}
                    >
                        <Input size='large' placeholder='tu@email.com' />
                    </Form.Item>
                    <Form.Item
                        label='Contraseña'
                        name='password'
                        rules={[{ required: true, message: 'La contraseña es requerida' }]}
                    >
                        <Input.Password size='large' placeholder='••••••••' />
                    </Form.Item>
                    <Form.Item>
                        <Button
                            type='primary'
                            htmlType='submit'
                            size='large'
                            block
                            loading={loading}
                        >
                            Ingresar
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    )
}

export default Login