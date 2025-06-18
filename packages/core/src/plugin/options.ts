import type { Prettify } from '../utils/types'

type BaseField<T> = Prettify<( {
	value?    : T
	required? : false
} | {
	value     : T
	required? : boolean
} ) & {
	label        : string
	description? : string
}>

type SelectBaseFile<T> = BaseField<T> & { options : {
	value : T
	label : string
}[] }

type OptionsMap = {
	boolean : BaseField<boolean>
	string  : BaseField<string>
	number  : BaseField<number>
	range  : BaseField<number> & {
		min : number
		max : number
	}
	array        : BaseField<number[] | string[] | boolean[] | ( string | number | boolean )[]>
	arrayNumber  : BaseField<number[]>
	arrayString  : BaseField<string[]>
	select       : SelectBaseFile<string | number | boolean>
	selectString : SelectBaseFile<string>
	selectNumber : SelectBaseFile<number>
}

// type OptionsValidValues = {
// 	[ key in keyof OptionsMap ] : OptionsMap[ key ]['value']
// }[ keyof OptionsMap ]

export type PluginOptionsValue = Prettify<{
	[ key in keyof OptionsMap ] : OptionsMap[ key ] & { type: key }
}[ keyof OptionsMap ]>

export type PluginOptions = Record<string, PluginOptionsValue> | Readonly<Record<string, PluginOptionsValue>>

type InferValue<T extends PluginOptionsValue> =
	T extends { options: { value: infer V }[] }
		? V
		: OptionsMap[T['type']]['value']

export type PluginOptionsInfer<T extends PluginOptions> = {
	[K in keyof T]: T[K]['required'] extends true
		? InferValue<T[K]>
		: InferValue<T[K]> | undefined
}

