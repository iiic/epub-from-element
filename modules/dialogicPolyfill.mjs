/**
* @name DialogicPolyfill
* @description
* Polyfill for dialog element (Q4 2019 is native support only in Chrome and Opera)
* @author ic < ic.czech@gmail.com >
* @see https://iiic.dev/dialogic-polyfill
* @license https://creativecommons.org/licenses/by-sa/4.0/legalcode.cs CC BY-SA 4.0
* @since Q4 2019
* @version 0.2
*/
( () =>
{

	/** @type {HTMLDialogElement|HTMLUnknownElement} */
	const dialog = ( document.createElement( 'DIALOG' ) );

	const OPEN_STATUS = 'open';
	const SHOW_FUNCTION = 'show';
	const CLOSE_FUNCTION = 'close';
	if (
		dialog instanceof HTMLUnknownElement &&
		!( OPEN_STATUS in dialog && SHOW_FUNCTION in dialog && CLOSE_FUNCTION in dialog )
	) {
		Object.defineProperty( HTMLUnknownElement.prototype, OPEN_STATUS, {
			value: false,
			writable: true,
			configurable: false,
			enumerable: false,
		} );
		Object.defineProperty( HTMLUnknownElement.prototype, SHOW_FUNCTION, {
			value: function ()
			{
				this.style.display = 'block';
				this[ OPEN_STATUS ] = true;
				this.setAttribute( OPEN_STATUS, '' );
				this.querySelector( 'button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])' ).focus();
			},
			writable: false,
			configurable: false,
			enumerable: false,
		} );
		Object.defineProperty( HTMLUnknownElement.prototype, CLOSE_FUNCTION, {
			value: function ()
			{
				this.style.display = 'none';
				this[ OPEN_STATUS ] = false;
				this.removeAttribute( OPEN_STATUS );
			},
			writable: false,
			configurable: false,
			enumerable: false,
		} );
	}
} )();
