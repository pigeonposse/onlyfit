import { Plugin } from '../plugin'

export type CoreOptions<K extends string = string> = {
	debug? : boolean
	plugin : Record<K, Plugin>
}
