import api from './axios'

const getAll = () => api.get('/supplier-shipments')
const getById = (id) => api.get(`/supplier-shipments/${id}`)
const create = (data) => api.post('/supplier-shipments', data)
const cancel = (id) => api.patch(`/supplier-shipments/${id}/cancel`)

export default { getAll, getById, create, cancel }