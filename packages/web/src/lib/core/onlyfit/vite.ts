import { ROUTES_DATA as CRoutes } from './convert/const'
import { ROUTES_DATA as ORoutes } from './optimize/const'

export const getRoutesData = () => ( [ ...CRoutes, ...ORoutes ] )
