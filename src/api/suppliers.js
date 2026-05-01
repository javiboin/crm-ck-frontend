import api from './axios'

const getAll = () => api.get('/suppliers')

export default { getAll }