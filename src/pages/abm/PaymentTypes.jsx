import SimpleAbm from '../../components/common/SimpleAbm'
import paymentTypesApi from '../../api/paymentTypes'

const PaymentTypes = () => <SimpleAbm title='Medios de Pago' api={paymentTypesApi} dataKey='paymentTypes' />

export default PaymentTypes