import api from './axios'

const getAll = () => api.get('/suppliers')
const create = (data) => api.post('/suppliers', data)
const update = (id, data) => api.put(`/suppliers/${id}`, data)
const remove = (id) => api.delete(`/suppliers/${id}`)

export default { getAll, create, update, remove }