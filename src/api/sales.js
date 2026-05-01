import api from './axios'

const getAll = () => api.get('/sales')
const getById = (id) => api.get(`/sales/${id}`)
const create = (data) => api.post('/sales', data)
const cancel = (id) => api.patch(`/sales/${id}/cancel`)

export default { getAll, getById, create, cancel }