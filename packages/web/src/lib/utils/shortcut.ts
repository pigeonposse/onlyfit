export type ShortcutParams = {
	/** macos keyboard: [option] */
	alt?      : boolean
	/** macos keyboard: [control ^] [command ⌘] */
	control?  : boolean
	shift?    : boolean
	code      : string[]
	callback? : () => Promise<void> | void
}

const shortcuts = new Set<ShortcutParams>()

const isModifierPressed = ( e: KeyboardEvent, modifier: string ): boolean =>
	modifier === 'Control'
		? e.ctrlKey || e.metaKey
		: modifier === 'Alt'
			? e.altKey
			: modifier === 'Shift'
				? e.shiftKey
				: false

const matches = ( e: KeyboardEvent, params: ShortcutParams ): boolean =>
	( !params.alt || isModifierPressed( e, 'Alt' ) )
	&& ( !params.control || isModifierPressed( e, 'Control' ) )
	&& ( !params.shift || isModifierPressed( e, 'Shift' ) )
	&& params.code.includes( e.code )

const keyDownHandler = async ( e: KeyboardEvent ) => {

	for ( const shortcut of shortcuts ) {

		if ( matches( e, shortcut ) ) {

			e.preventDefault()
			await shortcut.callback?.()
			break

		}

	}

}

let initialized       = false
const ensureListeners = () => {

	if ( initialized || typeof window === 'undefined' ) return
	window.addEventListener( 'keydown', keyDownHandler )
	initialized = true

}

export const createShortcuts = <P extends ShortcutParams[] | ShortcutParams>( params: P ) => {

	const list = Array.isArray( params ) ? params : [ params ]

	return {
		start : () => {

			ensureListeners()
			list.forEach( shortcut => shortcuts.add( shortcut ) )

		},
		stop : () => {

			list.forEach( shortcut => shortcuts.delete( shortcut ) )

		},
	}

}
