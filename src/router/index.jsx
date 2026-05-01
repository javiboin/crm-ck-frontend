import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import MainLayout from '../components/layouts/MainLayout'
import Login from '../pages/Login'
import Dashboard from '../pages/Dashboard'
import Stock from '../pages/Stock'
import Sales from '../pages/Sales'
import Shipments from '../pages/Shipments'
import Brands from '../pages/abm/Brands'
import Categories from '../pages/abm/Categories'
import Colors from '../pages/abm/Colors'
import Genders from '../pages/abm/Genders'
import Models from '../pages/abm/Models'
import Suppliers from '../pages/abm/Suppliers'
import PaymentTypes from '../pages/abm/PaymentTypes'

const PrivateRoute = ({ children }) => {
    const { token, loading } = useAuth()

    if (loading) return null

    return token ? children : <Navigate to='/login' />
}

const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/login' element={<Login />} />
                <Route
                    path='/'
                    element={
                        <PrivateRoute>
                            <MainLayout />
                        </PrivateRoute>
                    }
                >
                    <Route index element={<Navigate to='/dashboard' />} />
                    <Route path='dashboard' element={<Dashboard />} />
                    <Route path='stock' element={<Stock />} />
                    <Route path='sales' element={<Sales />} />
                    <Route path='shipments' element={<Shipments />} />
                    <Route path='abm/brands' element={<Brands />} />
                    <Route path='abm/categories' element={<Categories />} />
                    <Route path='abm/colors' element={<Colors />} />
                    <Route path='abm/genders' element={<Genders />} />
                    <Route path='abm/models' element={<Models />} />
                    <Route path='abm/suppliers' element={<Suppliers />} />
                    <Route path='abm/payment-types' element={<PaymentTypes />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default AppRouter