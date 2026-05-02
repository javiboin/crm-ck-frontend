import api from './axios'

const getAll = () => api.get('/genders')
const create = (data) => api.post('/genders', data)
const update = (id, data) => api.put(`/genders/${id}`, data)
const remove = (id) => api.delete(`/genders/${id}`)

export default { getAll, create, update, remove }