
import {
	Core,
	MimeType,
	Plugin,
	PluginOptions,
} from '@onlyfit/core'
import yargs from 'yargs'

import pkg       from '../package.json'
import {
	getAllNumbersInRange,
	joinPath,
	jsExtensions,
} from './utils'

import type {
	Argv,
	Options,
} from 'yargs'

export * from '@onlyfit/core'

type PluginCommandInput = Awaited<Argv['argv']>
type PluginCommandOptions = {
	plugin: {
		key   : string
		value : Awaited<ReturnType<Core['get']>>
	}
	core  : Core
	yargs : Argv
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Any = any
type PluginsDefault = Record<string, Plugin> | Record<string, Readonly<Plugin>>
export type ConfigCliGeneric<P extends PluginsDefault> = { plugin: P }
export type ConfigCli = ConfigCliGeneric<PluginsDefault>

export const defineConfig = <P extends PluginsDefault>( config: ConfigCliGeneric<P> ): ConfigCliGeneric<P> => config

export type CliOptions = {
	/**
	 * Command line arguments
	 */
	args            : string[]
	basePath?       : string
	transformInput  : ( d:{ path: string } ) => Promise<ArrayBuffer>
	transformOutput : ( d:{
		input : ArrayBuffer
		path  : string
	} ) => Promise<void>
}
const ICON = {
	DOT   : '•',
	CHECK : '✓',
	WARN  : '⚠',
	FAIL  : '✗',
} as const
export class Cli {

	args
	#basePath
	#instance
	options
	name = pkg.name
	version = pkg.version
	cmds = {
		run      : 'run',
		check    : 'check',
		optimize : 'optimize',
		convert  : 'convert',
		info     : 'info',
	} as const

	get configPaths() {

		return jsExtensions.map( e => this.name + '.config.' + e )

	}

	constructor( options: CliOptions ) {

		this.args      = options.args
		this.#basePath = options.basePath
		this.options   = options

		const cli = yargs( this.args )

		this.#instance = cli
			.scriptName( this.name )
			.version( this.version )
			.locale( 'en' )
			.wrap( cli.terminalWidth() )
			.updateStrings( { 'Options:': 'Global Options:' } )
			.help( false )
			.option( 'help', {
				desc  : 'Show help',
				alias : 'h',
				type  : 'boolean',
			} )
			.alias( 'v', 'version' )
			.option( 'debug', {
				desc : 'Verbose mode',
				type : 'boolean',
			} )
			.option( 'config', {
				desc : 'Path to config file',
				type : 'string',

			} )

	}

	async getConfig( path?: string ) {

		const paths = path
			? [ path ]
			: this.configPaths

		for ( const path of paths ) {

			try {

				return ( await import( this.#basePath ? joinPath( this.#basePath, path ) : path ) ).default as ConfigCli

			}
			catch {

				continue

			}

		}
		return undefined

	}

	getOptions( data: PluginOptions ): Record<string, Options> {

		const res: Record<string, Options> = {}
		for ( const key in data ) {

			const value        = data[key]
			const sharedValues = {
				required    : value.required,
				default     : value.value,
				description : value.description,
				group       : 'Options:',
			}
			if ( value.type === 'range' ) res[key] = {
				type    : 'number',
				choices : getAllNumbersInRange( value.min, value.max ),
				...sharedValues,
			}
			else if ( value.type === 'select' ) res[key] = {
				type    : 'string',
				choices : value.options.map( e => String( e.value ) ),
				coerce  : v => {

					if ( typeof v === 'boolean' ) return v ? 'true' : 'false'
					if ( !isNaN( Number( v ) ) ) return String( v )
					return v

				},
				...sharedValues,
			}
			else if ( value.type === 'selectString' ) res[key] = {
				type    : 'string',
				choices : value.options.map( e => String( e.value ) ),
				...sharedValues,
			}
			else if ( value.type === 'selectNumber' ) res[key] = {
				type    : 'number',
				choices : value.options.map( e => e.value ),
				...sharedValues,
			}
			else if ( value.type === 'arrayNumber' ) res[key] = {
				type  : 'number',
				array : true,
				...sharedValues,
			}
			else if ( value.type === 'arrayString' ) res[key] = {
				type  : 'string',
				array : true,
				...sharedValues,
			}
			else res[key] = {
				type : value.type,
				...sharedValues,
			}

		}

		return res

	}

	async #runOptimizer( argv: PluginCommandInput, opts:PluginCommandOptions ) {

		const {
			plugin, core, yargs,
		} = opts
		const {
			data, optimizer,
		} = plugin.value
		const key = plugin.key

		if ( argv.help ) {

			yargs.showHelp( 'log' )
			return

		}

		const {
			input: argvInput,
			output: argvOutput,
			$0:__,
			_: _,
			...options
		} = argv

		const inPath  = argvInput as string
		const outPath = argvOutput as string

		if ( !inPath ) throw new Error( 'No input file provided' )
		if ( !outPath ) throw new Error( 'No output file provided' )

		const type    = core.utils.mime.getType( inPath )
		const failmsg = () => '- Valid types: ' + data.optimizer?.mimetypes?.join( ', ' ) + '\n- Valid extensions: ' + optimizer?.data?.extensions?.all?.join( ', ' )
		if ( !type ) throw new Error( 'No input file type exists.\n' + failmsg() )

		const input = await this.options.transformInput( { path: inPath } )
		const res   = await optimizer?.fn?.( {
			input,
			type    : type,
			options : options as Any,
		} )
		if ( !res ) throw new Error( 'No output generated for ' + inPath + ' using ' + key + ' optimizer' )

		await this.options.transformOutput( {
			path  : outPath,
			input : res,
		} )
		console.log( ICON.CHECK + ' Successfully optimized!' )

	}

	async showHelo() {

		this.#instance.showHelp( 'log' )

	}

	async #runConverter(
		argv: PluginCommandInput,
		opts: Omit<PluginCommandOptions, 'plugin'> & { plugin: PluginCommandOptions['plugin'] | {
			plugin : PluginCommandOptions['plugin']
			data: {
				from : MimeType
				to   : MimeType
			}
		}[] },
	) {

		const {
			plugin, core, yargs,
		} = opts

		if ( argv.help ) {

			yargs.showHelp( 'log' )
			return

		}

		const {
			input: argvInput,
			output: argvOutput,
			$0:__,
			_: _,
			...options
		} = argv

		const inPath  = argvInput as string
		const outPath = argvOutput as string

		if ( !inPath ) throw new Error( 'No input file provided' )
		if ( !outPath ) throw new Error( 'No output file provided' )

		const from = core.utils.mime.getType( inPath )
		const to   = core.utils.mime.getType( outPath )

		let res: ArrayBuffer | undefined

		const convertFn = async ( opts: {
			plugin : PluginCommandOptions['plugin']
			data: {
				from? : MimeType
				to?   : MimeType
				input : ArrayBuffer
			}
		} ) => {

			try {

				const { converter } = opts.plugin.value
				const key           = opts.plugin.key
				const failmsg       = ( v?: MimeType[] ) => ICON.DOT + ' Valid types: ' + opts.plugin.value?.data.converter?.mimetypes?.join( ', ' ) + '\n' + ICON.DOT + ' Valid extensions: ' + v?.join( ', ' )
				if ( !opts.data.from ) throw new Error( 'No input file type exists.\n' + failmsg( converter?.data?.from ) )
				if ( !opts.data.to ) throw new Error( 'No output file type exists.\n' + failmsg( converter?.data?.to ) )

				console.debug( {
					from   : opts.data.from,
					to     : opts.data.to,
					plugin : key,
				} )
				res = await converter?.fn?.( {
					input   : opts.data.input,
					from    : opts.data.from,
					to      : opts.data.to,
					options : options as Any,
				} )
				if ( !res ) throw new Error( 'No output generated for ' + inPath + ' using ' + key + ' converter' )
				return res

			}
			catch ( e ) {

				throw new Error( ICON.FAIL + ' ' + opts.plugin.key + ' error: ' + ( e instanceof Error ? e.message : 'Unexpected error' ) )

			}

		}

		console.debug( {
			inPath,
			outPath,
			options,
		} )

		if ( plugin instanceof Array ) {

			let input = await this.options.transformInput( { path: inPath } )

			for ( const combo of plugin ) input = await convertFn( {
				plugin : combo.plugin,
				data   : {
					input,
					...combo.data,
				},
			} )
			res = input

		}
		else {

			const input = await this.options.transformInput( { path: inPath } )
			res         = await convertFn( {
				plugin : plugin,
				data   : {
					input,
					from,
					to,
				},
			} )

		}

		await this.options.transformOutput( {
			path  : outPath,
			input : res,
		} )
		console.log( ICON.CHECK + ' Successfully converted!' )

	}

	#setInfo( d?: {
		all        : MimeType[] | undefined
		extensions : { all: string[] }
	} ) {

		const extInfo = `## Valid extensions\n\n${d?.extensions?.all?.join( ', ' )}`
		// .split( '\n' )
		// .join( '\n  ' )
		const mineInfo = `## Valid types\n\n${d?.all?.join( ', ' )}`
		// .split( '\n' )
		// .join( '\n  ' )
		return `${mineInfo}\n\n${extInfo}`

	}

	#runInfo( argv: PluginCommandInput, opts:PluginCommandOptions ) {

		const {
			plugin, yargs, core,
		} = opts

		const {
			data,
			optimizer,
			converter,
		} = plugin.value
		if ( argv.help ) {

			yargs.showHelp( 'log' )
			return

		}

		if ( data.converter?.fn && !argv.optimize ) {

			const combinations    = converter?.data?.combinations && Object.groupBy( converter.data?.combinations, ( { from } ) => from )
			const combinationList = combinations && Object.entries( combinations )
				.map( ( [ from, list ] ) =>
					!list ? '' : `\n${core.utils.mime.getExtension( from )} → ${( list?.map( ( { to } ) => core.utils.mime.getExtension( to ) ).join( ', ' ) )}`,
				)
				.join( '\n' )
			console.log( `# CONVERSION INFORMATION\n\n## Combinations\n${combinationList || '\nNo combinations found'}\n\n${this.#setInfo( converter?.data )}\n` )

		}
		if ( data.optimizer?.fn && !argv.convert ) {

			console.log( `# OPTIMIZATION INFORMATION\n\n${this.#setInfo( optimizer?.data )}\n` )

		}

	}

	async #setPluginOptions( opts: PluginCommandOptions ) {

		const {
			plugin, yargs,
		} = opts
		const key      = plugin.key
		const { data } = plugin.value

		if ( !data.converter?.fn && !data.optimizer?.fn ) return

		yargs.command(
			key,
			data.data?.description || 'Convert/Optimize your file using ' + key,
			yargs => {

				console.debug( {
					command     : key,
					commandData : data,
				} )

				yargs.command(
					this.cmds.info,
					'Get information about the plugin',
					yargs => {

						yargs.options( {
							optimize : {
								type        : 'boolean',
								description : 'Get only information about the optimizer',
								alias       : 'o',
								group       : 'Options:',
							},
							convert : {
								type  : 'boolean',
								desc  : 'Get only information about the converter',
								alias : 'c',
								group : 'Options:',
							},
						} )

					},
					argv => this.#runInfo( argv, opts ),
				)

				if ( data.converter?.fn ) yargs.command(
					this.cmds.convert + ' <input> <output>',
					'Convert your file with the following options',
					yargs => {

						yargs.positional( 'input', {
							type        : 'string',
							description : 'Input file',
						} )
						yargs.positional( 'output', {
							type        : 'string',
							description : 'Output file',
						} )
						if ( data.converter?.options )
							yargs.options( this.getOptions( data.converter!.options! ) )

						return yargs.showHelpOnFail( true )

					},
					argv => this.#runConverter( argv, opts ),
				)

				if ( data.optimizer?.fn ) yargs.command(
					this.cmds.optimize + ' <input> <output>',
					'Optimize your file with the following options',
					yargs => {

						yargs.positional( 'input', {
							type        : 'string',
							description : 'Input file',
						} )
						yargs.positional( 'output', {
							type        : 'string',
							description : 'Output file',
						} )

						if ( data.optimizer?.options )
							yargs.options( this.getOptions( data.optimizer!.options! ) )

						return yargs.showHelpOnFail( true )

					},
					argv => this.#runOptimizer( argv, opts ),
				)

				return yargs

			},
			async () => {

				this.#instance.showHelp( 'log' )

			},
		)

	}

	async #run() {

		const argv   = await this.#instance.parseAsync()
		const config = await this.getConfig( argv.config )
		if ( !config ) throw new Error( argv.config ? 'No config found at ' + argv.config : 'No config found at: ' + this.configPaths.join( ', ' ) )

		const core    = new Core( {
			debug  : argv.debug,
			plugin : config.plugin as Record<string, Plugin>,
		} )
		const plugins = await core.init( )
		if ( !core.plugins.size ) {

			console.warn( 'NO PLUGINS DETECTED.\n\nYou need to add at least one plugin to use converters and optimizers.\n\nSee plugins list: https://github.com/onlyfit/onlyfit#plugins' )
			return

		}

		this.#instance.command(
			this.cmds.check + ' <extension>',
			'Check if extension is supported',
			async yargs => {

				yargs.options( { to : {
					type        : 'string',
					group       : 'Options:',
					description : 'Check if extension is supported for another extension',
				} } )

			}, async argv => {

				if ( argv.help ) {

					this.#instance.showHelp( 'log' )
					return

				}

				if ( !argv.extension ) throw new Error( 'No extension provided' )
				const from = core.utils.mime.getType( argv.extension as string )
				if ( !from ) throw new Error( `Unsupported extension: ${argv.extension}` )
				const to = !argv.to ? undefined : core.utils.mime.getType( argv.to as string )

				const o = await plugins.filter.getOptimizerPlugins( { type: from } )
				const c = await plugins.filter.getConverterPlugins( {
					from : from,
					to,
				} )
				console.log( `# Checking "${argv.extension}" ("${from}") ${to ? `to "${argv.to}" ("${to}")` : ''}\n` )
				if ( !to ) {

					console.log( `## Available optimizers\n` )
					if ( !o.size ) console.log( `⚠ There are no optimizers available` )
					else o.forEach( ( _value, key ) => console.log( `- ${key}: ${this.name} ${this.cmds.run} ${key} ${this.cmds.info}` ) )
					console.log( '' )

				}

				console.log( `## Available converters\n` )
				if ( !c.size ) console.log( `There are no converters available` )
				else c.forEach( ( _value, key ) => console.log( `- ${key}: ${this.name} ${this.cmds.run} ${key} ${this.cmds.info}` ) )
				console.log( '' )

				if ( !c && to ) {

					const combs = await plugins.filter.getConverterCombinations( {
						from  : from,
						to,
						depth : 3,
						max   : 10,
					} )
					if ( combs ) {

						console.log( `## Available converters (combinations)\n` )
						combs.forEach( ( v, k ) => console.log( `# ${k}\n${v.map( e => `- ${e.plugin}: ${e.data.from} -> ${e.data.to}` ).join( '\n' )}\n` ) )

					}

				}

			} )
		this.#instance.command(
			this.cmds.convert + ' <input> <output>',
			'Convert file to another format',
			yargs => yargs.options( {
				combination : {
					type        : 'boolean',
					group       : 'Options:',
					description : 'Use combinations of plugins to convert',
					alias       : 'c',
				},
				depth : {
					type        : 'number',
					group       : 'Options:',
					description : 'Depth of combinations to check',
				},
			} ),
			async argv => {

				if ( argv.help ) {

					this.#instance.showHelp( 'log' )
					return

				}

				const from = core.utils.mime.getType( argv.input as string )
				if ( !from ) throw new Error( 'Unsupported format in input' )
				const to = core.utils.mime.getType( argv.output as string )
				if ( !to ) throw new Error( 'Unsupported format in output' )

				if ( argv.combination ) {

					console.log( `• Checking combination for convert "${from}" to "${to}"` )
					const combinations = await plugins.filter.getConverterCombination( {
						from,
						to,
						depth : argv.depth || 3,
					} )

					if ( !combinations ) throw new Error( `No plugin combination found for convert "${from}" to "${to}"` )

					console.log( ICON.DOT + ' Conversion using: ' + [ ...new Set( combinations.map( c => c.plugin ) ) ].join( ', ' ) )
					await this.#runConverter( argv, {
						// @ts-ignore
						plugin : combinations
							.map( c => ( {
								...c,
								plugin : {
									key   : c.plugin,
									value : plugins.plugin.get( c.plugin ),
								},
							} ) ),
						core  : core,
						yargs : this.#instance,
					} )
					return

				}
				const plugin = await plugins.filter.getConverterPlugin( {
					from,
					to,
				} )

				if ( !plugin ) throw new Error( `No plugin found for convert "${from}" to "${to}".\nTry to use flag "--combination (-c)" for use combination of plugins.` )
				console.log( ICON.DOT + ' Conversion using: ' + plugin.key )
				await this.#runConverter( argv, {
					plugin,
					core  : core,
					yargs : this.#instance,
				} )

			},
		)
		this.#instance.command(
			this.cmds.optimize + ' <input> <output>',
			'Optimize file',
			async () => {

			},
			async argv => {

				if ( argv.help ) {

					this.#instance.showHelp( 'log' )
					return

				}
				const type = core.utils.mime.getType( argv.input as string )
				if ( !type ) throw new Error( 'Unsupported format in input' )
				const plugin = await plugins.filter.getOptimizerPlugin( { type } )

				if ( !plugin ) throw new Error( 'No plugin found for optimize: ' + argv.input )
				console.log( ICON.DOT + ' Optimization using: ' + plugin.key )
				await this.#runOptimizer( argv, {
					plugin,
					core  : core,
					yargs : this.#instance,
				} )

			},

		)
		this.#instance.command(
			this.cmds.run,
			'Run specific plugin for convert and optimize files',
			async yargs => {

				for ( const [ key, value ] of plugins.filter.data.entries() ) await this.#setPluginOptions( {
					plugin : {
						key,
						value,
					},
					core,
					yargs,
				} )

			}, async argv => {

				const command = argv._[1]

				if ( !command || ( typeof command === 'string' && !core.plugins.has( command ) ) )
					this.#instance.showHelp( 'log' )

			},
		)

		this.#instance
			.strict()
			.showHelpOnFail( false )
		this.#instance.fail( ( m, e ) => {

			if ( m && e ) console.error( m )

		} )
		const finalArgs = await this.#instance.parseAsync()
		console.debug( { parsedArgs: finalArgs } )

		if ( !finalArgs._[0] && core.plugins.size )
			this.#instance.showHelp( 'log' )

	}

	async run() {

		try {

			await this.#run()

		}
		catch ( e ) {

			console.error( e instanceof Error ? e.message : e )

		}

	}

}
