
import {
	Core,
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

import type { Options } from 'yargs'

export * from '@onlyfit/core'

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
const defaultConfigPaths = jsExtensions.map( e => pkg.name + '.config.' + e )
export class Cli {

	args
	#basePath
	#instance
	options

	constructor( options: CliOptions ) {

		this.args      = options.args
		this.#basePath = options.basePath
		this.options   = options
		const cli      = yargs( this.args )

		this.#instance = cli
			.scriptName( pkg.name )
			.version( pkg.version )
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
			: defaultConfigPaths

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

	async #run() {

		const argv   = await this.#instance.parseAsync()
		const config = await this.getConfig( argv.config )
		if ( !config ) throw new Error( argv.config ? 'No config found at ' + argv.config : 'No config found at: ' + defaultConfigPaths.join( ', ' ) )
		const core = new Core( {
			debug  : argv.debug,
			plugin : config.plugin as Record<string, Plugin>,
		} )

		for ( const key in config.plugin ) {

			// console.log( key, config.plugin )
			const {
				data, optimizer, converter, convertedValidExtensions, optimizedValidExtensions,
			} = await core.get( key )

			if ( !data.converter?.fn && !data.optimizer?.fn ) continue

			this.#instance.command(
				key,
				data.data?.description || 'Convert/Optimize your file using ' + key,
				yargs => {

					console.debug( {
						command     : key,
						commandData : data,
					} )

					if ( data.converter?.fn ) yargs.command(
						'convert <input> <output>',
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
						async argv => {

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

							const from    = core.utils.mime.getType( inPath )
							const to      = core.utils.mime.getType( outPath )
							const failmsg = () => '- Valid types: ' + data.converter?.mimetypes?.join( ', ' ) + '\n- Valid extensions: ' + convertedValidExtensions?.join( ', ' )
							if ( !from ) throw new Error( 'No input file type exists.\n' + failmsg() )
							if ( !to ) throw new Error( 'No output file type exists.\n' + failmsg() )
							console.debug( {
								inPath,
								outPath,
								from,
								to,
								options,
							} )

							const input = await this.options.transformInput( { path: inPath } )

							const res = await converter?.( {
								input,
								from,
								to,
								options : options as Any,
							} )

							if ( !res ) throw new Error( 'No output generated for ' + inPath + ' using ' + key + ' converter' )

							await this.options.transformOutput( {
								path  : outPath,
								input : res,
							} )

						},
					)

					if ( data.optimizer?.fn ) yargs.command(
						'optimize <input> <output>',
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
						async argv => {

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
							const failmsg = () => '- Valid types: ' + data.optimizer?.mimetypes?.join( ', ' ) + '\n- Valid extensions: ' + optimizedValidExtensions?.join( ', ' )
							if ( !type ) throw new Error( 'No input file type exists.\n' + failmsg() )

							const input = await this.options.transformInput( { path: inPath } )
							const res   = await optimizer?.( {
								input,
								type    : type,
								options : options as Any,
							} )
							if ( !res ) throw new Error( 'No output generated for ' + inPath + ' using ' + key + ' optimizer' )

							await this.options.transformOutput( {
								path  : outPath,
								input : res,
							} )

						},
					)
					yargs.fail( ( m, e ) => {

						if ( m && e ) console.error( m )

					} )

					return yargs

				},
				async () => {

					this.#instance.showHelp( 'log' )

				},
			)

		}

		this.#instance
			.strict()
			.showHelpOnFail( false )

		const finalArgs = await this.#instance.parseAsync()
		console.debug( { parsedArgs: finalArgs } )
		if ( !finalArgs._[0] ) this.#instance.showHelp( 'log' )

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
