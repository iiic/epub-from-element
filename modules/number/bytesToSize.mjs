export class append
{
	constructor ( n = Number )
	{
		const FUNCTION_NAME = 'bytesToSize';

		if ( typeof n()[ FUNCTION_NAME ] !== 'function' ) {

			Object.defineProperty( n.prototype, FUNCTION_NAME, {
				value: function ( /** @type {Number} */ decimals = 2, /** @type {String} */ lang = 'en' )
				{
					const BASE = 1024;
					const RIDGE = '\u{00A0}'; // NO-BREAK SPACE
					const BYTES = {
						en: 'Bytes',
						cs: 'Bitů',
					};
					const SIZES = [ BYTES[ lang ], 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB' ]; // @todo : add abbr title for units
					const getMeasurementUnit = Math.floor( Math.log( n( this ) ) / Math.log( BASE ) );
					if ( this === 0 ) {
						return '0' + RIDGE + BYTES[ lang ];
					}
					return parseFloat( ( n( this ) / Math.pow( BASE, getMeasurementUnit ) ).toFixed( decimals ) ) + RIDGE + SIZES[ getMeasurementUnit ];
				},
				writable: false,
				configurable: false,
				enumerable: false,
			} );
		}
	}
}
