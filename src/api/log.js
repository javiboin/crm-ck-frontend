import api from './axios'

const getLog = (params) => api.get('/log', { params })

export default { getLog }