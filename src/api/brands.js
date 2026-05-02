import api from './axios'

const getAll = () => api.get('/brands')
const create = (data) => api.post('/brands', data)
const update = (id, data) => api.put(`/brands/${id}`, data)
const remove = (id) => api.delete(`/brands/${id}`)

export default { getAll, create, update, remove }