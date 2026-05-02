import api from './axios'

const getAll = () => api.get('/models')
const create = (data) => api.post('/models', data)
const update = (id, data) => api.put(`/models/${id}`, data)
const remove = (id) => api.delete(`/models/${id}`)

export default { getAll, create, update, remove }