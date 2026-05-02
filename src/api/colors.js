import api from './axios'

const getAll = () => api.get('/colors')
const create = (data) => api.post('/colors', data)
const update = (id, data) => api.put(`/colors/${id}`, data)
const remove = (id) => api.delete(`/colors/${id}`)

export default { getAll, create, update, remove }