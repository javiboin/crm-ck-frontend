import SimpleAbm from '../../components/common/SimpleAbm'
import brandsApi from '../../api/brands'

const Brands = () => <SimpleAbm title='Marcas' api={brandsApi} dataKey='brands' />

export default Brands