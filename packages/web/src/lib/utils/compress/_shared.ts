import { LazyLoader } from '$utils/_super/loader'

export const deps = new LazyLoader( { onlyfit: () => import( '@onlyfit/core' ) } )
