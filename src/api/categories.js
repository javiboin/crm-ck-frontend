import api from './axios'

const getAll = () => api.get('/categories')
const create = (data) => api.post('/categories', data)
const update = (id, data) => api.put(`/categories/${id}`, data)
const remove = (id) => api.delete(`/categories/${id}`)

export default { getAll, create, update, remove }