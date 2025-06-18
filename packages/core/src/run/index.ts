
import { CoreData }    from './data'
import { CoreFilters } from './filters'

export class Core<Keys extends string = string> extends CoreData<Keys> {

	async init() {

		const data = await this.getAll()
		// @ts-ignore
		const filter = new CoreFilters<Keys>( data )
		return {
			filter,
			plugin : data,
		}

	}

}
