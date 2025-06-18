import { Core }    from '.'
import fonteditor  from '../../../tools/fonteditor/src/plugin'
import imagemagick from '../../../tools/imagemagick/src/plugin'

const instance = ( new Core( { plugin : {
	fonteditor  : fonteditor(),
	// @ts-ignore
	imagemagick : imagemagick(),
} } ) )

const core = await instance.init()
const data = await core.filter.getConverterCombinations( {
	from : 'image/jpeg',
	to   : 'text/html',
	max  : 1,
} )
for ( const item of data ) {

	console.log( 'Combinarition' )
	for ( const i of item )
		console.log( `  ${i.data.from} -> ${i.data.to} (${i.plugin})` )

}

