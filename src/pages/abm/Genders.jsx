import SimpleAbm from '../../components/common/SimpleAbm'
import gendersApi from '../../api/genders'

const Genders = () => <SimpleAbm title='Géneros' api={gendersApi} dataKey='genders' />

export default Genders