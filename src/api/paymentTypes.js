import api from './axios'

const getAll = () => api.get('/payment-types')
const create = (data) => api.post('/payment-types', data)
const update = (id, data) => api.put(`/payment-types/${id}`, data)
const remove = (id) => api.delete(`/payment-types/${id}`)

export default { getAll, create, update, remove }