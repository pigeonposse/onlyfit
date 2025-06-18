
import { PluginConfig } from 'svgo'

import {
	description,
	homepage,
} from '../package.json'

import type {
	Plugin,
	PluginOptions,
} from '@onlyfit/core'

const options = {
	cleanupAttrs : {
		type        : 'boolean',
		value       : true,
		label       : 'Cleanup Attributes',
		description : 'Remove redundant attributes from SVG elements.',
	},
	removeDoctype : {
		type        : 'boolean',
		value       : true,
		label       : 'Remove Doctype',
		description : 'Remove <!DOCTYPE svg> declaration.',
	},
	removeXMLProcInst : {
		type        : 'boolean',
		value       : true,
		label       : 'Remove XML Processing Instruction',
		description : 'Removes XML instructions like <?xml ... ?>.',
	},
	removeComments : {
		type        : 'boolean',
		value       : true,
		label       : 'Remove Comments',
		description : 'Remove comments inside SVG.',
	},
	removeMetadata : {
		type        : 'boolean',
		value       : true,
		label       : 'Remove Metadata',
		description : 'Removes <metadata> tag.',
	},
	removeTitle : {
		type        : 'boolean',
		value       : false,
		label       : 'Remove Title',
		description : 'Removes <title> tag.',
	},
	removeDesc : {
		type        : 'boolean',
		value       : false,
		label       : 'Remove Description',
		description : 'Removes <desc> tag.',
	},
	removeUselessDefs : {
		type        : 'boolean',
		value       : true,
		label       : 'Remove Useless Defs',
		description : 'Removes elements in <defs> without id or reference.',
	},
	removeEditorsNSData : {
		type        : 'boolean',
		value       : true,
		label       : 'Remove Editors NS Data',
		description : 'Removes metadata added by editors like Inkscape.',
	},
	collapseGroups : {
		type        : 'boolean',
		value       : true,
		label       : 'Collapse Groups',
		description : 'Merge multiple <g> groups into one.',
	},
	convertStyleToAttrs : {
		type        : 'boolean',
		value       : true,
		label       : 'Convert Style to Attributes',
		description : 'Moves styles from style blocks into attributes.',
	},
	convertColors : {
		type        : 'boolean',
		value       : true,
		label       : 'Convert Colors',
		description : 'Converts color names to shorter hex or rgb notation.',
	},
	convertPathData : {
		type        : 'boolean',
		value       : true,
		label       : 'Convert Path Data',
		description : 'Optimize path data by reducing precision.',
	},
	removeDimensions : {
		type        : 'boolean',
		value       : false,
		label       : 'Remove Dimensions',
		description : 'Removes width/height attributes (useful for responsive SVGs).',
	},
} as const satisfies PluginOptions

const onlyfitPlugin = ( ): Plugin<PluginOptions, typeof options> =>
	async utils => {

		return {
			data : {
				description,
				url : homepage,
			},
			optimizer : {
				options,
				mimetypes : [ 'image/svg+xml' ],

				fn : async ( {
					input, options,
				} ) => {

					const { optimize } = await import( './index' )
					const config       = { plugins : Object.entries( options )
						.filter( ( [ _, enabled ] ) => enabled === true )
						.map( ( [ name ] ) => name ) as PluginConfig[] }
					const res          = await optimize( utils.convert.arrayBuffer2string( input ), config )

					return utils.convert.string2arrayBuffer( res.data )

				},
			},
		}

	}
export default onlyfitPlugin
