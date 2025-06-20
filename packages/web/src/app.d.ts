/// <reference types="@svaio/pwa/types" />
/// <reference types="@svaio/media/types" />

// reference WORKS! 🌈

declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
	const PKG: typeof import( '../../../package.json' )
	const APP_PKG: typeof import( './package.json' )
	const LOGO_ASCII: string
}

export {}
