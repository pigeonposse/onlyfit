import optimise, { init as initOXI } from '@jsquash/oxipng/optimise'

import {
	createCoreInitializer,
	type InitCoreOptions,
} from '../../_shared/wasm'

export type { InitCoreOptions }
export { optimise }

export const init =  createCoreInitializer( {
	libraryName : '@jsquash/oxipng',
	fn          : initOXI,
	path        : 'codec/pkg/squoosh_oxipng_bg.wasm',
} )

