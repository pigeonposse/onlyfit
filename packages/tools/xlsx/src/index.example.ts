
import {
	joinPath,
	getCurrentDir,
	writeFile,
	ensureDir,
} from '@dovenv/core/utils'
import * as XLSX from 'xlsx'

import {
	Compress,
	Convert,
	TYPES,
} from '.'

const buildDir = joinPath( getCurrentDir( import.meta.url ), '..', 'build' )
const run      = async () => {

	console.log( 'Iniciando ejemplo de conversion de archivos Excel...' )

	const write = async ( name: string, i:Buffer ) =>
		await writeFile( joinPath( buildDir, name ), i )

	await ensureDir( buildDir )

	const initialData = [
		[
			'ID',
			'Producto',
			'Cantidad',
			'Precio Unitario',
		],
		[
			1,
			'Laptop',
			10,
			1200,
		],
		[
			2,
			'Teclado Mecánico',
			25,
			80,
		],
		[
			3,
			'Monitor 27"',
			15,
			350,
		],
		[
			4,
			'Ratón Gaming',
			40,
			50,
		],
		[
			5,
			'Auriculares',
			30,
			100,
		],
		...Array( 5000 ).fill( 0 ).map( ( _, i ) => [
			i + 6,
			`Producto Genérico ${i + 6}`,
			Math.floor( Math.random() * 1000 ),
			parseFloat( ( Math.random() * 500 ).toFixed( 2 ) ),
		] ),
	]

	const initialWorkbook = XLSX.utils.book_new()
	const initialSheet    = XLSX.utils.aoa_to_sheet( initialData )
	XLSX.utils.book_append_sheet( initialWorkbook, initialSheet, 'DatosGenerados' )

	const initialXLSXBuffer = XLSX.write( initialWorkbook, {
		type     : 'buffer',
		bookType : 'xlsx',
	} )
	console.log( `\nTamaño del archivo XLSX inicial generado: ${initialXLSXBuffer.byteLength} bytes` )
	await write( 'original_data.xlsx', initialXLSXBuffer )
	console.log( 'Archivo "original_data.xlsx" guardado para referencia.' )

	const compressor = new Compress( initialXLSXBuffer, 'xlsx' )
	const converter  = new Convert( initialXLSXBuffer )

	console.log( `\nCompression test...` )
	const arrayBuffer = await compressor.run()
	await write( 'original_data_compressed.xlsx', initialXLSXBuffer )
	console.log( `Size: ${arrayBuffer.byteLength} bytes` )
	console.log( `File: "original_data_compressed.xlsx"` )

	for ( const type of Object.values( TYPES ) ) {

		console.log( `\nConvert to ${type}...` )
		const arrayBuffer = await converter.to( type )
		await write( `recompressed_data.${type}`, Buffer.from( arrayBuffer ) )

		console.log( `Size: ${arrayBuffer.byteLength} bytes` )
		console.log( `File: "recompressed_data.${type}"` )

	}

}

run()
