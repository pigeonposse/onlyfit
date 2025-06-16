import mime from 'mime'

export * from './mime'
import { convert } from './convert'
import { env }     from './env'

const mineExport = {
	getType          : mime.getType.bind( mime ),
	getAllExtensions : mime.getAllExtensions.bind( mime ),
	getExtension     : mime.getExtension.bind( mime ),
}
export const allUtils = {
	mime : mineExport,
	env,
	convert,
}
