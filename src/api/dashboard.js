import api from './axios'

const getMetrics = () => api.get('/dashboard')

export default { getMetrics }