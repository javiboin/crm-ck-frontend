import SimpleAbm from '../../components/common/SimpleAbm'
import categoriesApi from '../../api/categories'

const Categories = () => <SimpleAbm title='Categorías' api={categoriesApi} dataKey='categories' />

export default Categories