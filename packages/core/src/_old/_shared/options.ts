type BaseField<T> = {
	value        : T
	required?    : boolean
	type         : string
	label        : string
	description? : string
}

type BooleanField = BaseField<boolean> & { type: 'boolean' }
type TextField = BaseField<string> & { type: 'text' }
type NumberField = BaseField<number> & { type: 'number' }
type RangeField = BaseField<number> & {
	type : 'range'
	min  : number
	max  : number
}
type ArrayField = BaseField<number | string | boolean> & { type: 'array' }
type ArrayNumberField = BaseField<number> & { type: 'array-number' }
type ArrayStringField = BaseField<string> & { type: 'array-string' }

type SelectField = BaseField<string | number | boolean> & {
	type    : 'select'
	options : {
		value : string | number | boolean
		label : string
	}[]
}

// type FunctionField = BaseField<( () => void ) | null> & { type: 'function' }
// type FunctionArrayField = BaseField<( () => void )[] | ( () => void ) | null> & { type: 'function|array' }

export type Options = Record<
	string,
	| BooleanField
	| TextField
	| NumberField
	| SelectField
	| RangeField
	| ArrayField
	| ArrayNumberField
	| ArrayStringField
>
export type OptionsValue = string | number | boolean | number[] | string[] | boolean[] | ( string | number | boolean )[]
export type LibraryOptions = {
	name         : string
	url          : string
	description? : string
	options      : Options
}
