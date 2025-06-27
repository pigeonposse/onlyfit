
import { PluginConfig } from 'svgo'

import {
	description,
	homepage,
} from '../package.json'

import type {
	Plugin,
	PluginOptions,
} from '@onlyfit/core'

// active: [
// 			'removeDoctype',
// 			'removeComments',
// 			'removeMetadata',
// 			'removeTitle',
// 			'removeDesc',
// 			'removeUselessDefs',
// 			'removeXMLNS',
// 			'convertStyleToAttrs',
// 			'minifyStyles',
// 		]

type OnlyStrings<T> = T extends string ? T : never
type StringPluginConfigs = OnlyStrings<PluginConfig>
type PluginOptionsValue = PluginOptions[keyof PluginOptions]

type PartialOptions = {
	[K in StringPluginConfigs]?: PluginOptionsValue
}

const options: PartialOptions = {

	// REMOVE
	removeDoctype : {
		type        : 'boolean',
		value       : true,
		label       : 'Remove Doctype',
		description : 'Remove <!DOCTYPE svg> declaration.',
	},
	removeXMLNS : {
		type        : 'boolean',
		value       : true,
		label       : 'Remove XML Namespace',
		description : 'Removes xmlns attribute.',
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
		value       : true,
		label       : 'Remove Title',
		description : 'Removes <title> tag.',
	},
	removeDesc : {
		type        : 'boolean',
		value       : true,
		label       : 'Remove Description',
		description : 'Removes <desc> tag.',
	},
	removeDimensions : {
		type        : 'boolean',
		value       : false,
		label       : 'Remove Dimensions',
		description : 'Removes width/height attributes (useful for responsive SVGs).',
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
	removeViewBox : {
		type        : 'boolean',
		value       : true,
		label       : 'Remove ViewBox',
		description : 'Removes viewBox attribute.',
	},

	removeEmptyAttrs : {
		type        : 'boolean',
		value       : true,
		label       : 'Remove Empty Attributes',
		description : 'Removes empty attributes.',
	},
	removeEmptyText : {
		type        : 'boolean',
		value       : true,
		label       : 'Remove Empty Text',
		description : 'Removes empty text elements.',
	},
	removeEmptyContainers : {
		type        : 'boolean',
		value       : false,
		label       : 'Remove Empty Containers',
		description : 'Removes empty containers (e.g. <g> with no children).',
	},
	removeHiddenElems : {
		type        : 'boolean',
		value       : false,
		label       : 'Remove Hidden Elements',
		description : 'Removes elements with the display attribute set to none.',
	},
	removeNonInheritableGroupAttrs : {
		type        : 'boolean',
		value       : false,
		label       : 'Remove Non-Inheritable Group Attributes',
		description : 'Removes attributes that are not inherited.',
	},
	removeOffCanvasPaths : {
		type        : 'boolean',
		value       : false,
		label       : 'Remove Off-Canvas Paths',
		description : 'Removes paths that are completely off canvas.',
	},
	removeRasterImages : {
		type        : 'boolean',
		value       : false,
		label       : 'Remove Raster Images',
		description : 'Removes raster images (e.g. PNG, JPEG, GIF).',
	},
	removeScripts : {
		type        : 'boolean',
		value       : false,
		label       : 'Remove Script Element',
		description : 'Removes <script> element.',
	},
	removeStyleElement : {
		type        : 'boolean',
		value       : false,
		label       : 'Remove Style Element',
		description : 'Removes <style> element.',
	},
	removeUnknownsAndDefaults : {
		type        : 'boolean',
		value       : false,
		label       : 'Remove Unknowns and Defaults',
		description : 'Removes elements with unknown names and default attributes.',
	},
	removeUnusedNS : {
		type        : 'boolean',
		value       : false,
		label       : 'Remove Unused Namespaces',
		description : 'Removes unused namespaces.',
	},
	removeUselessStrokeAndFill : {
		type        : 'boolean',
		value       : false,
		label       : 'Remove Useless Stroke and Fill',
		description : 'Removes stroke and fill attributes if they have no value.',
	},
	removeXlink : {
		type        : 'boolean',
		value       : false,
		label       : 'Remove Xlink Attributes',
		description : 'Removes xlink attributes.',
	},

	// cleanup
	cleanupIds : {
		type        : 'boolean',
		value       : false,
		label       : 'Cleanup IDs',
		description : 'Remove IDs from SVG elements.',
	},
	cleanupAttrs : {
		type        : 'boolean',
		value       : false,
		label       : 'Cleanup Attributes',
		description : 'Remove redundant attributes from SVG elements.',
	},
	cleanupEnableBackground : {
		type        : 'boolean',
		value       : false,
		label       : 'Cleanup Enable Background',
		description : 'Remove enable-background attribute from SVG elements.',
	},
	cleanupNumericValues : {
		type        : 'boolean',
		value       : false,
		label       : 'Cleanup Numeric Values',
		description : 'Remove numeric values from SVG elements.',
	},
	cleanupListOfValues : {
		type        : 'boolean',
		value       : false,
		label       : 'Cleanup List of Values',
		description : 'Remove list of values from SVG elements.',
	},

	// CONVERT

	convertStyleToAttrs : {
		type        : 'boolean',
		value       : true,
		label       : 'Convert Style to Attributes',
		description : 'Moves styles from style blocks into attributes.',
	},
	convertColors : {
		type        : 'boolean',
		value       : false,
		label       : 'Convert Colors',
		description : 'Converts color names to shorter hex or rgb notation.',
	},
	convertPathData : {
		type        : 'boolean',
		value       : false,
		label       : 'Convert Path Data',
		description : 'Optimize path data by reducing precision.',
	},
	convertEllipseToCircle : {
		type        : 'boolean',
		value       : false,
		label       : 'Convert Ellipse to Circle',
		description : 'Convert ellipse to circle.',
	},
	convertOneStopGradients : {
		type        : 'boolean',
		value       : false,
		label       : 'Convert One-Stop Gradients',
		description : 'Convert one-stop gradients to linear or radial gradients.',
	},
	convertShapeToPath : {
		type        : 'boolean',
		value       : false,
		label       : 'Convert Shape to Path',
		description : 'Convert <shape> elements to <path> elements.',
	},
	convertTransform : {
		type        : 'boolean',
		value       : false,
		label       : 'Convert Transform',
		description : 'Convert transforms to inline attributes.',
	},

	// others
	collapseGroups : {
		type        : 'boolean',
		value       : false,
		label       : 'Collapse Groups',
		description : 'Merge multiple <g> groups into one.',
	},
	sortDefsChildren : {
		type        : 'boolean',
		value       : false,
		label       : 'Sort Defs Children',
		description : 'Sort <defs> children.',
	},
	minifyStyles : {
		type        : 'boolean',
		value       : true,
		label       : 'Minify Styles',
		description : 'Minify CSS in style elements and style attributes.',
	},
	mergePaths : {
		type        : 'boolean',
		value       : false,
		label       : 'Merge Paths',
		description : 'Merge adjacent paths.',
	},
	mergeStyles : {
		type        : 'boolean',
		value       : false,
		label       : 'Merge Styles',
		description : 'Merge adjacent styles.',
	},
	moveElemsAttrsToGroup : {
		type        : 'boolean',
		value       : false,
		label       : 'Move Elems Attrs to Group',
		description : 'Move attributes of group elements to group.',
	},
	moveGroupAttrsToElems : {
		type        : 'boolean',
		value       : false,
		label       : 'Move Group Attrs to Elems',
		description : 'Move attributes of elements to group elements.',
	},
}

const onlyfitPlugin = ( ): Plugin<PluginOptions, typeof options> =>
	async utils => {

		const lib = () => {

			if ( utils.env.isBrowser ) return import( './browser' )
			return import( './index' )

		}
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

					const { optimize } = await lib()

					const res = await optimize(
						utils.convert.arrayBuffer2string( input ),
						{
							plugins : Object.entries( options || {} )
								.filter( ( [ _, enabled ] ) => enabled === true )
								.map( ( [ name ] ) => name ) as PluginConfig[],
							multipass : true,
						},
					)

					return utils.convert.string2arrayBuffer( res.data )

				},
			},
		}

	}
export default onlyfitPlugin
