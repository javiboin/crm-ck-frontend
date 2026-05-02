import SimpleAbm from '../../components/common/SimpleAbm'
import colorsApi from '../../api/colors'

const Colors = () => <SimpleAbm title='Colores' api={colorsApi} dataKey='colors' />

export default Colors