import api from './axios'

const getAll = () => api.get('/payment-types')

export default { getAll }