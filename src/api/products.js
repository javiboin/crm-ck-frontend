import api from './axios'

const getAll = () => api.get('/products')
const getById = (id) => api.get(`/products/${id}`)
const create = (data) => api.post('/products', data)
const update = (id, data) => api.put(`/products/${id}`, data)
const remove = (id) => api.delete(`/products/${id}`)

export default { getAll, getById, create, update, remove }