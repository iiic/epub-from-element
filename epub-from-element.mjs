/**
* @private
* @module EPubFromElementPrivate
* @classdesc Creates ePub export for e-readers from selected html element(s) - private part
* @author ic < ic.czech@gmail.com >
* @see https://iiic.dev/epub-from-element
* @license https://creativecommons.org/licenses/by-sa/4.0/legalcode.cs CC BY-SA 4.0
* @since Q3 2021
* @version 0.2
* @readonly
*/
const EPubFromElementPrivate = class
{

	static ANCHOR_NODE_NAME = 'A';
	static LINK_NODE_NAME = 'LINK';
	static B_NODE_NAME = 'B';
	static BR_NODE_NAME = 'BR';
	static BUTTON_NODE_NAME = 'BUTTON';
	static DIALOG_NODE_NAME = 'DIALOG';
	static DIV_NODE_NAME = 'DIV';
	static P_NODE_NAME = 'P';
	static STRONG_NODE_NAME = 'STRONG';
	static H1_NODE_NAME = 'H1';

	static MINUS = '-';
	static NBSP = ' ';
	static DOT = '.';
	static KEYCODE_ESC = 27;

	static CLICK_EVENT_NAME = 'click';
	static KEYUP_EVENT_NAME = 'keyup';

	static CONTENT_TYPE = 'application/json; charset=utf-8';

	static ATTRIBUTES = {
		DIALOG_ROLE: {
			NAME: 'role',
			VALUE: 'alertdialog',
		},
		ARIA_LABELLEDBY: {
			NAME: 'aria-labelledby',
			VALUE_SUFFIX: '-label',
		},
		ARIA_DESCRIBEDBY: {
			NAME: 'aria-describedby',
			VALUE_SUFFIX: '-description',
		},
		CONTENT_ROLE: {
			NAME: 'role',
			VALUE: 'document',
		},
		CONTENT_TABINDEX: {
			NAME: 'tabindex',
			VALUE: 0,
		},
		TOGGLER_ATTRIBUTE: {
			NAME: 'data-on',
			VALUE_PREFIX: 'tap:',
			CLOSE_SUFFIX: 'close',
		}
	};

	/**
	* @public
	* @description colors used for browser's console output
	*/
	static CONSOLE = {
		CLASS_NAME: 'color: gray',
		METHOD_NAME: 'font-weight: normal; color: green',
		INTEREST_PARAMETER: 'font-weight: normal; font-size: x-small; color: blue',
		EVENT_TEXT: 'color: orange',
		WARNING: 'color: red',
	};

	/**
	 * @public
	 * @type {Object}
	 * @description default settings… can be overwritten
	 */
	settings = {
		exportElementQuerySelectors: [ '[itemtype="https://schema.org/Article"]' ],
		toggleEPubElementId: 'epub',
		togglePrintElementId: 'print',
		resultsElementId: 'epub-response',
		ePubServerSideEndpoints: [ '/epub-print-script.php' ],
		ePubTempPathPrefix: '',
		ePub: {
			fileName: '',
			title: '',
			author: '',
			language: '',
			license: '',
			publisher: '',
		},
		structure: [
			'title',
			'br',
			'fileName',
			'fileSize',
			'br',
			'download',
			'nbsp',
			'share',
			'nbsp',
			'inlineCloseButton',
			'closeButton',
		],
		resultSnippetBehaviour: {
			allowLineBreak: true,
			makeResultElementSemantic: true,
		},
		serverSideHeaders: {
			fileName: 'X-Article-File-Name',
			title: 'X-Article-Title',
			author: 'X-Article-Author',
			language: 'X-Article-Language',
			license: 'X-Article-License',
			publisher: 'X-Article-Publisher',
		},
		texts: {
			title: 'Your article in ePub format is ready',
			fileName: 'File name',
			fileSize: 'File size',
			download: 'Download ePub',
			downloadTitle: 'Download ePub file into this device',
			share: 'Share link to ePub file',
			shareTitle: 'Share link to ePub file for another device',
			closeButton: 'x',
			closeButtonTitle: 'Close popup',
			inlineCloseButton: 'Close',
			textValueDelimiter: ': ',
			ePubAvailableOnUrl: 'Your article in ePub forma is available on: '
		},
		resultSnippetElements: {
			title: EPubFromElementPrivate.STRONG_NODE_NAME,
			fileName: EPubFromElementPrivate.P_NODE_NAME,
			fileSize: EPubFromElementPrivate.P_NODE_NAME,
			download: EPubFromElementPrivate.ANCHOR_NODE_NAME,
			share: EPubFromElementPrivate.BUTTON_NODE_NAME,
			inlineCloseButton: EPubFromElementPrivate.BUTTON_NODE_NAME,
			closeButton: EPubFromElementPrivate.BUTTON_NODE_NAME,
		},
		CSSStyleSheets: [
			{ href: '/epub-from-element.css', integrity: 'sha256-3dujCJSgkpcb6zbg2ZUAG6wT3b9AOQe/QqHgqWP6Jzo=' }
		],
		modulesImportPath: 'https://iiic.dev/js/modules',
		autoRun: true,
	};

	/**
	 * @public
	 * @type {HTMLElement}
	 */
	resultsElement = HTMLElement;

	/**
	 * @public
	 * @type {Function}
	 */
	importWithIntegrity;

	async initImportWithIntegrity ( /** @type {Object} */ settings = null )
	{

		console.groupCollapsed( '%c EPubFromElementPrivate %c initImportWithIntegrity %c(' + ( settings === null ? 'without settings' : 'with settings' ) + ')',
			EPubFromElement.CONSOLE.CLASS_NAME,
			EPubFromElement.CONSOLE.METHOD_NAME,
			EPubFromElement.CONSOLE.INTEREST_PARAMETER
		);
		console.debug( { arguments } );
		console.groupEnd();

		return new Promise( ( /** @type { Function } */ resolve ) =>
		{

			/** @type {Object} */
			const ip = settings && settings.modulesImportPath ? settings.modulesImportPath : this.settings.modulesImportPath;

			import( ip + '/importWithIntegrity.mjs' ).then( ( /** @type {Module} */ module ) =>
			{

				/** @type {Function} */
				this.importWithIntegrity = module.importWithIntegrity;

				resolve( true );
			} ).catch( () =>
			{
				const SKIP_SECURITY_URL = '#skip-security-test-only'
				if ( window.location.hash === SKIP_SECURITY_URL ) {
					console.warn( '%c EPubFromElementPrivate %c initImportWithIntegrity %c without security!',
						EPubFromElement.CONSOLE.CLASS_NAME,
						EPubFromElement.CONSOLE.METHOD_NAME,
						EPubFromElement.CONSOLE.WARNING
					);
					this.importWithIntegrity = (/** @type {String} */ path ) =>
					{
						return new Promise( ( /** @type {Function} */ resolve ) =>
						{
							import( path ).then( ( /** @type {Module} */ module ) =>
							{
								resolve( module );
							} );
						} );
					};
					resolve( true );
				} else {
					throw 'Security Error : Import with integrity module is missing! You can try to skip this error by adding ' + SKIP_SECURITY_URL + ' hash into website URL';
				}
			} );
		} );
	}

	async initBytesToSize ()
	{
		console.log( '%c EPubFromElementPrivate %c initBytesToSize',
			EPubFromElement.CONSOLE.CLASS_NAME,
			EPubFromElement.CONSOLE.METHOD_NAME
		);

		return this.importWithIntegrity(
			this.settings.modulesImportPath + '/number/bytesToSize.mjs',
			'sha256-aeAqkn2ZLpS0wCBjztGPqS2nd1f2HPbx+dCJGucIy3s='
		).then( ( /** @type {Module} */ bytesToSize ) =>
		{
			new bytesToSize.append( Number );
			return true;
		} );
	}

	async setSettings ( /** @type {Object} */ inObject )
	{
		console.groupCollapsed( '%c EPubFromElement %c setSettings',
			EPubFromElement.CONSOLE.CLASS_NAME,
			EPubFromElement.CONSOLE.METHOD_NAME
		);
		console.debug( { arguments } );
		console.groupEnd();

		return new Promise( ( /** @type {Function} */ resolve ) =>
		{
			if ( inObject.modulesImportPath ) {
				this.settings.modulesImportPath = inObject.modulesImportPath;
			}
			this.importWithIntegrity(
				this.settings.modulesImportPath + '/object/deepAssign.mjs',
				'sha256-qv6PwXwb5wOy4BdBQVGgGUXAdHKXMtY7HELWvcvag34='
			).then( ( /** @type {Module} */ deepAssign ) =>
			{
				new deepAssign.append( Object );
				this.settings = Object.deepAssign( this.settings, inObject ); // multi level assign
				resolve( true );
			} ).catch( () =>
			{
				Object.assign( this.settings, inObject ); // single level assign
				resolve( true );
			} );
		} );
	}

	static async addCSSStyleSheets ( /** @type {Array} */ CSSStyleSheets )
	{
		console.groupCollapsed( '%c EPubFromElementPrivate %c addCSSStyleSheets',
			EPubFromElement.CONSOLE.CLASS_NAME,
			EPubFromElement.CONSOLE.METHOD_NAME
		);
		console.debug( { arguments } );
		console.groupEnd();

		return new Promise( ( /** @type {Function} */ resolve ) =>
		{
			const usedStyleSheets = new Set();
			[ ...document.styleSheets ].forEach( ( /** @type {CSSStyleSheet} */ css ) =>
			{
				if ( css.disabled === false ) {
					usedStyleSheets.add( css.href );
				}
			} );
			CSSStyleSheets.forEach( ( /** @type {Object} */ assignment ) =>
			{
				let url = URL;
				if ( assignment.href.startsWith( 'https://', 0 ) || assignment.href.startsWith( 'http://', 0 ) ) {
					url = new URL( assignment.href );
				} else {
					url = new URL( assignment.href, window.location.protocol + '//' + window.location.hostname );
				}
				if ( !usedStyleSheets.has( url.href ) ) {
					fetch( url.href, {
						method: 'HEAD',
						credentials: 'omit',
						cache: 'force-cache',
						referrerPolicy: 'no-referrer',
						redirect: 'manual',
						mode: 'cors'
					} ).then( ( /** @type {Response} */ response ) =>
					{
						if ( response.ok ) {
							return true;
						} else {
							throw 'error';
						}
					} ).then( () =>
					{

						/** @type {HTMLLinkElement} */
						const link = document.createElement( EPubFromElementPrivate.LINK_NODE_NAME );

						link.href = url.href;
						link.rel = 'stylesheet';
						link.setAttribute( 'crossorigin', 'anonymous' );
						if ( assignment.integrity ) {
							link.integrity = assignment.integrity;
						}
						document.head.appendChild( link );
					} ).catch( () =>
					{
						resolve( false );
					} );
				}
			} );
			resolve( true );
		} );
	}

	async prepareFetches ( /** @type {String} */ jsonToSend )
	{
		const promises = [];

		this.settings.ePubServerSideEndpoints.forEach( ( /** @type {String} */ endpoint ) =>
		{
			promises.push(
				fetch( endpoint, {
					method: 'POST',
					headers: new Headers( {
						'Content-Type': this.CONTENT_TYPE,
						[ this.settings.serverSideHeaders.title ]: escape( this.settings.ePub.title ),
						[ this.settings.serverSideHeaders.fileName ]: escape( this.settings.ePub.fileName ),
						[ this.settings.serverSideHeaders.author ]: escape( this.settings.ePub.author ),
						[ this.settings.serverSideHeaders.language ]: escape( this.settings.ePub.language ),
						[ this.settings.serverSideHeaders.license ]: escape( this.settings.ePub.license ),
						[ this.settings.serverSideHeaders.publisher ]: escape( this.settings.ePub.publisher ),
					} ),
					body: jsonToSend,
					cache: 'no-cache',
					referrer: 'no-referrer',
					mode: 'cors',
				} ).then( ( /** @type {Response} */ response ) =>
				{
					return response.blob();
				} )
			);
		} );
		return promises;
	}

	initOpenClosePopupFunctionality ()
	{
		console.debug( '%c EPubFromElementPrivate %c initOpenClosePopupFunctionality',
			EPubFromElement.CONSOLE.CLASS_NAME,
			EPubFromElement.CONSOLE.METHOD_NAME
		);

		if ( this.resultsElement.nodeName === EPubFromElement.DIALOG_NODE_NAME ) {
			document.querySelectorAll( '[' + EPubFromElementPrivate.ATTRIBUTES.TOGGLER_ATTRIBUTE.NAME + ']' ).forEach( (/** @type {HTMLElement} */ element ) =>
			{
				if ( element.getAttribute( EPubFromElementPrivate.ATTRIBUTES.TOGGLER_ATTRIBUTE.NAME ).substr( 0, EPubFromElementPrivate.ATTRIBUTES.TOGGLER_ATTRIBUTE.VALUE_PREFIX.length ) === EPubFromElementPrivate.ATTRIBUTES.TOGGLER_ATTRIBUTE.VALUE_PREFIX ) {
					const tapAction = element.getAttribute( EPubFromElementPrivate.ATTRIBUTES.TOGGLER_ATTRIBUTE.NAME ).substr( EPubFromElementPrivate.ATTRIBUTES.TOGGLER_ATTRIBUTE.VALUE_PREFIX.length ).split( EPubFromElementPrivate.DOT );

					/** @type {HTMLDialogElement} */
					let dialog = ( document.getElementById( tapAction[ 0 ] ) );

					if ( !dialog ) {

						/** @type {HTMLDialogElement} */
						dialog = ( element.parentElement );

					}

					if ( tapAction[ 1 ] && tapAction[ 1 ] === EPubFromElementPrivate.ATTRIBUTES.TOGGLER_ATTRIBUTE.CLOSE_SUFFIX ) {
						element.addEventListener( EPubFromElementPrivate.CLICK_EVENT_NAME, ( /** @type {MouseEvent} */ ) =>
						{
							dialog.close();
						}, {
							capture: false,
							once: false,
							passive: true,
						} );
					} else {
						element.addEventListener( EPubFromElementPrivate.CLICK_EVENT_NAME, ( /** @type {MouseEvent} */ ) =>
						{
							dialog.show();
						}, {
							capture: false,
							once: false,
							passive: true,
						} );
					}
				}
			} );
			document.querySelectorAll( EPubFromElementPrivate.DIALOG_NODE_NAME ).forEach( ( /** @type {HTMLDialogElement} */ dialog ) =>
			{
				dialog.addEventListener( EPubFromElementPrivate.KEYUP_EVENT_NAME, ( /** @type {KeyboardEvent} */ event ) =>
				{
					if ( event.keyCode === EPubFromElementPrivate.KEYCODE_ESC ) {
						dialog.close();
					}
				}, {
					capture: false,
					once: false,
					passive: true,
				} );
			} );
		}
	}

	elCreator = {
		br: ( /** @type {String} */ name ) =>
		{
			return new Promise( ( /** @type {Function} */ resolve ) =>
			{
				if ( this.settings.resultSnippetBehaviour.allowLineBreak ) {
					this.resultsElement.lastElementChild.appendChild( document.createElement( EPubFromElementPrivate.BR_NODE_NAME ) );
				}
				resolve( true );
			} );
		},
		nbsp: ( /** @type {String} */ name ) =>
		{
			return new Promise( ( /** @type {Function} */ resolve ) =>
			{
				this.resultsElement.lastElementChild.appendChild( document.createTextNode( EPubFromElementPrivate.NBSP ) );
				resolve( true );
			} );
		},
		title: ( /** @type {String} */ name ) =>
		{
			return new Promise( ( /** @type {Function} */ resolve ) =>
			{

				/** @type {String} */
				const tag = this.settings.resultSnippetElements[ name ];

				if ( tag ) {

					/** @type {HTMLElement} */
					const el = document.createElement( tag );

					el.appendChild( document.createTextNode( this.settings.texts.title ) );
					el.id = this.resultsElement.id + EPubFromElementPrivate.ATTRIBUTES.ARIA_LABELLEDBY.VALUE_SUFFIX;
					this.resultsElement.lastElementChild.appendChild( el );
				}
				resolve( true );
			} );
		},
		fileName: ( /** @type {String} */ name ) =>
		{
			return new Promise( ( /** @type {Function} */ resolve ) =>
			{

				/** @type {String} */
				const tag = this.settings.resultSnippetElements[ name ];

				if ( tag ) {

					/** @type {HTMLElement} */
					const el = document.createElement( tag );

					el.appendChild( document.createTextNode(
						this.settings.texts.fileName
						+ this.settings.texts.textValueDelimiter
						+ this.settings.ePub.fileName
					) );
					this.resultsElement.lastElementChild.appendChild( el );
				}
				resolve( true );
			} );
		},
		fileSize: ( /** @type {String} */ name, { size: size } ) =>
		{
			return new Promise( ( /** @type {Function} */ resolve ) =>
			{

				/** @type {String} */
				const tag = this.settings.resultSnippetElements[ name ];

				if ( tag ) {

					/** @type {HTMLElement} */
					const el = document.createElement( tag );

					this.initBytesToSize().then( () =>
					{
						el.appendChild( document.createTextNode(
							this.settings.texts.fileSize
							+ this.settings.texts.textValueDelimiter
							+ Number( size ).bytesToSize()
						) );
					} );

					this.resultsElement.lastElementChild.appendChild( el );
				}
				resolve( true );
			} );
		},
		download: ( /** @type {String} */ name, /** @type {Blob} */ ePubFile ) =>
		{
			return new Promise( ( /** @type {Function} */ resolve ) =>
			{

				/** @type {String} */
				const tag = this.settings.resultSnippetElements[ name ];

				if ( tag ) {

					/** @type {HTMLElement} */
					const el = document.createElement( tag );

					if ( el.nodeName === EPubFromElementPrivate.ANCHOR_NODE_NAME ) {
						el.href = window.URL.createObjectURL( ePubFile );
						el.rel = 'alternate';
						el.type = ePubFile.type;
						el.download = this.settings.ePub.fileName;
						el.title = this.settings.texts.downloadTitle;
						if ( this.settings.ePub.language ) {
							el.hreflang = this.settings.ePub.language;
						}
						const content = document.createElement( EPubFromElementPrivate.B_NODE_NAME );
						content.appendChild( document.createTextNode( this.settings.texts.download ) );
						el.appendChild( content );
						this.resultsElement.lastElementChild.appendChild( el );
					} else {
						// @feature request
					}
				}
				resolve( true );
			} );
		},
		share: ( /** @type {String} */ name, /** @type {Blob} */ ePubFile ) =>
		{
			return new Promise( ( /** @type {Function} */ resolve ) =>
			{

				/** @type {String} */
				const tag = this.settings.resultSnippetElements[ name ];

				if ( tag ) {

					/** @type {HTMLElement} */
					const el = document.createElement( tag );

					if ( el.nodeName === EPubFromElementPrivate.BUTTON_NODE_NAME ) {
						// sharing .epub file currently not working in Chrome :(

						// const filesArray = [ new File(
						// 	[ ePubFile ],
						// 	this.settings.ePub.fileName,
						// 	{ type: ePubFile.type }
						// ) ];
						// if ( navigator.canShare && navigator.canShare( { files: filesArray } ) ) {
						// 	el.addEventListener( 'click', function ( /** @type {MouseEvent} */ event )
						// 	{
						// 		navigator.share( {
						// 			text: '…',
						// 			files: filesArray,
						// 			title: '…',
						// 			url: '…'
						// 		} );
						// 	}, false );
						// }

						if ( navigator.canShare && this.settings.ePubTempPathPrefix ) {
							el.appendChild( document.createTextNode( this.settings.texts.share ) );
							el.title = this.settings.texts.shareTitle;
							el.addEventListener( EPubFromElementPrivate.CLICK_EVENT_NAME, ( /** @type {MouseEvent} */ event ) =>
							{

								/** @type {String} */
								const path = this.settings.ePubTempPathPrefix + this.settings.ePub.fileName;

								navigator.share( {
									title: this.settings.ePub.title,
									text: this.settings.texts.ePubAvailableOnUrl + path,
									url: path,
								} );
							}, {
								capture: false,
								once: false,
								passive: true,
							} );
							this.resultsElement.lastElementChild.appendChild( el );
						}
					} else {
						// @feature request
					}
				}
				resolve( true );
			} );
		},
		inlineCloseButton: ( /** @type {String} */ name ) =>
		{
			return new Promise( ( /** @type {Function} */ resolve ) =>
			{

				/** @type {String} */
				const tag = this.settings.resultSnippetElements[ name ];

				if ( tag ) {

					/** @type {HTMLElement} */
					const el = document.createElement( tag );

					el.appendChild( document.createTextNode( this.settings.texts.inlineCloseButton ) );
					el.title = this.settings.texts.closeButtonTitle;
					el.setAttribute( EPubFromElementPrivate.ATTRIBUTES.TOGGLER_ATTRIBUTE.NAME, EPubFromElementPrivate.ATTRIBUTES.TOGGLER_ATTRIBUTE.VALUE_PREFIX
						+ this.resultsElement.id
						+ EPubFromElementPrivate.DOT
						+ EPubFromElementPrivate.ATTRIBUTES.TOGGLER_ATTRIBUTE.CLOSE_SUFFIX
					);

					this.resultsElement.lastElementChild.appendChild( el );
				}
				resolve( true );
			} );
		},
		closeButton: ( /** @type {String} */ name ) =>
		{
			return new Promise( ( /** @type {Function} */ resolve ) =>
			{

				/** @type {String} */
				const tag = this.settings.resultSnippetElements[ name ];

				if ( tag ) {

					/** @type {HTMLElement} */
					const el = document.createElement( tag );

					el.appendChild( document.createTextNode( this.settings.texts.closeButton ) );
					el.title = this.settings.texts.closeButtonTitle;
					el.setAttribute( EPubFromElementPrivate.ATTRIBUTES.TOGGLER_ATTRIBUTE.NAME, EPubFromElementPrivate.ATTRIBUTES.TOGGLER_ATTRIBUTE.VALUE_PREFIX
						+ this.resultsElement.id
						+ EPubFromElementPrivate.DOT
						+ EPubFromElementPrivate.ATTRIBUTES.TOGGLER_ATTRIBUTE.CLOSE_SUFFIX
					);

					this.resultsElement.appendChild( el );
				}
				resolve( true );
			} );
		},
	}

};

/**
* @public
* @module EPubFromElement
* @classdesc Creates ePub export for e-readers from selected html element(s)
* @author ic < ic.czech@gmail.com >
* @see https://iiic.dev/epub-from-element
* @license https://creativecommons.org/licenses/by-sa/4.0/legalcode.cs CC BY-SA 4.0
* @since Q3 2021
* @version 0.2
*/
export class EPubFromElement extends EPubFromElementPrivate
{
	#private;

	constructor ( /** @type {HTMLScriptElement | null} */ settingsElement = null )
	{
		console.groupCollapsed( '%c EPubFromElement',
			EPubFromElement.CONSOLE.CLASS_NAME
		);
		console.debug( '%c' + 'constructor',
			EPubFromElement.CONSOLE.METHOD_NAME,
			[ { arguments } ]
		);

		const parent = super();
		this.#private = parent;

		/** @type {Object} */
		const settings = settingsElement ? JSON.parse( settingsElement.text ) : null;

		parent.initImportWithIntegrity( settings ).then( () =>
		{
			if ( settings ) {
				this.setSettings( settings ).then( () =>
				{
					if ( this.settings.autoRun ) {
						this.run();
					}
				} );
			} else if ( this.settings.autoRun ) {
				this.run();
			}
		} );

		console.groupEnd();
	}

	async getEPub ()
	{
		let htmlForPrint = '';
		this.settings.exportElementQuerySelectors.forEach( function ( /** @type {String} */ selector )
		{
			const element = document.querySelector( selector );
			if ( element ) {
				htmlForPrint += element.innerHTML;
			}
		} );

		/** @type {Array} */
		const promises = await this.prepareFetches( JSON.stringify( htmlForPrint ) );

		return Promise.any( promises ).then( ( /** @type {Blob} */ firstFile ) =>
		{
			return firstFile;
		} );
	}

	checkRequirements ()
	{
		console.debug( '%c EPubFromElement %c checkRequirements',
			EPubFromElement.CONSOLE.CLASS_NAME,
			EPubFromElement.CONSOLE.METHOD_NAME
		);

		if ( !this.settings.resultsElementId ) {
			throw new Error( 'Result\'s element id is missing' );
		}
		if ( !this.settings.ePubServerSideEndpoints || !this.settings.ePubServerSideEndpoints.length ) {
			throw new Error( 'Endpoint(s) creating epub on server side is missing. Creating epub only on client side it\'s not currently supported' );
		}
		if ( !this.settings.exportElementQuerySelectors || !this.settings.exportElementQuerySelectors.length ) {
			throw new Error( 'Element(s) for export into epub is missing' );
		}
	}

	async makeResultsElementSemantic ()
	{
		console.debug( '%c EPubFromElement %c makeResultsElementSemantic',
			EPubFromElement.CONSOLE.CLASS_NAME,
			EPubFromElement.CONSOLE.METHOD_NAME
		);

		return new Promise( ( /** @type {Function} */ resolve ) =>
		{
			if ( this.settings.resultSnippetBehaviour.makeResultElementSemantic ) {
				this.resultsElement.setAttribute(
					EPubFromElement.ATTRIBUTES.DIALOG_ROLE.NAME,
					EPubFromElement.ATTRIBUTES.DIALOG_ROLE.VALUE
				);
				this.resultsElement.setAttribute(
					EPubFromElement.ATTRIBUTES.ARIA_LABELLEDBY.NAME,
					this.resultsElement.id + EPubFromElement.ATTRIBUTES.ARIA_LABELLEDBY.VALUE_SUFFIX
				);
				this.resultsElement.setAttribute(
					EPubFromElement.ATTRIBUTES.ARIA_DESCRIBEDBY.NAME,
					this.resultsElement.id + EPubFromElement.ATTRIBUTES.ARIA_DESCRIBEDBY.VALUE_SUFFIX
				);
			}
			resolve( true );
		} );
	}

	async preparePopupWith ( /** @type {Blob} */ epub )
	{
		console.debug( '%c EPubFromElement %c preparePopupWith',
			EPubFromElement.CONSOLE.CLASS_NAME,
			EPubFromElement.CONSOLE.METHOD_NAME
		);

		return new Promise( ( /** @type {Function} */ resolve ) =>
		{
			this.settings.structure.forEach( ( /** @type {String} */ method ) =>
			{
				if ( method in this.elCreator ) {
					this.elCreator[ method ]( method, epub );
				}
			} );
			resolve( true );
		} );
	}

	initResultsElement ()
	{
		console.debug( '%c EPubFromElement %c initresultsElement',
			EPubFromElement.CONSOLE.CLASS_NAME,
			EPubFromElement.CONSOLE.METHOD_NAME
		);

		this.resultsElement = document.getElementById( this.settings.resultsElementId );
		const contentElement = document.createElement( EPubFromElement.DIV_NODE_NAME );
		if ( this.settings.resultSnippetBehaviour.makeResultElementSemantic ) {
			contentElement.setAttribute( EPubFromElement.ATTRIBUTES.CONTENT_ROLE.NAME, EPubFromElement.ATTRIBUTES.CONTENT_ROLE.VALUE );
			contentElement.setAttribute( EPubFromElement.ATTRIBUTES.CONTENT_TABINDEX.NAME, EPubFromElement.ATTRIBUTES.CONTENT_TABINDEX.VALUE );
		}
		this.resultsElement.appendChild( contentElement );
	}

	showResult ()
	{
		console.debug( '%c EPubFromElement %c showResult',
			EPubFromElement.CONSOLE.CLASS_NAME,
			EPubFromElement.CONSOLE.METHOD_NAME,
		);

		if ( this.resultsElement.nodeName === EPubFromElement.DIALOG_NODE_NAME ) {
			this.resultsElement.show();
			return;
		}

		this.resultsElement.hidden = false;
	}

	setEPubMetadata ()
	{
		console.debug( '%c EPubFromElement %c setEPubMetadata',
			EPubFromElement.CONSOLE.CLASS_NAME,
			EPubFromElement.CONSOLE.METHOD_NAME,
		);

		Object.keys( this.settings.ePub ).forEach( ( /** @type {String} */ key ) =>
		{
			if ( !this.settings.ePub[ key ] ) {
				let result = '';
				switch ( key ) {
					case 'fileName':
						result = window.location.href.replace( window.location.origin, '' );
						result = result.replaceAll( '/', '-' )
							.replaceAll( EPubFromElement.DOT, '-' )
							.replaceAll( '?', '-' )
							.replaceAll( '&', '-' )
							.replaceAll( '#', '-' );
						if ( result[ 0 ] === EPubFromElement.MINUS ) {
							result = window.location.hostname + result;
						}
						result += '.epub';
						break;
					case 'title':
						result = document.title;
						if ( !result ) {
							const title = document.querySelector( EPubFromElement.H1_NODE_NAME );
							if ( title ) {
								result = title.textContent;
							}
						}
						break;
					case 'author':
						const author = document.querySelector( 'article [itemprop="author"]' );
						if ( author ) {
							result = author.textContent;
						}
						break;
					case 'language':
						result = document.lastElementChild.lang;
						break;
					case 'license':
						const licence = document.querySelector( 'article .license' );
						if ( licence ) {
							result = licence.textContent;
						}
						break;
					case 'publisher':
						const publisher = document.querySelector( '[role="banner"]' );
						if ( publisher ) {
							result = publisher.textContent;
						}
						break;
				}
				this.settings.ePub[ key ] = result;
			}
		} );
	}

	initPrint ()
	{
		console.debug( '%c EPubFromElement %c initPrint',
			EPubFromElement.CONSOLE.CLASS_NAME,
			EPubFromElement.CONSOLE.METHOD_NAME,
		);

		if ( this.settings.togglePrintElementId ) {

			/** @type {HTMLElement} */
			const printAction = document.getElementById( this.settings.togglePrintElementId );

			if ( printAction ) {
				printAction.addEventListener( EPubFromElement.CLICK_EVENT_NAME, function ()
				{
					window.print();
				}, {
					capture: false,
					once: false,
					passive: true,
				} );
				printAction.disabled = false;
				printAction.hidden = false;
			}
		}
	}

	initGetEPub ()
	{
		console.debug( '%c EPubFromElement %c initGetEPub',
			EPubFromElement.CONSOLE.CLASS_NAME,
			EPubFromElement.CONSOLE.METHOD_NAME,
		);

		if ( this.settings.toggleEPubElementId ) {

			/** @type {HTMLElement} */
			const getEPubAction = document.getElementById( this.settings.toggleEPubElementId );

			if ( getEPubAction ) {
				getEPubAction.addEventListener( EPubFromElement.CLICK_EVENT_NAME, () =>
				{
					getEPubAction.setAttribute(
						EPubFromElement.ATTRIBUTES.TOGGLER_ATTRIBUTE.NAME,
						EPubFromElement.ATTRIBUTES.TOGGLER_ATTRIBUTE.VALUE_PREFIX + this.resultsElement.id
					);
					this.getEPub().then( ( /** @type {Blob} */ epub ) =>
					{
						this.preparePopupWith( epub );
						this.showResult();
						this.initOpenClosePopupFunctionality();
					} );
				}, {
					capture: false,
					once: true,
					passive: true,
				} );
				getEPubAction.disabled = false;
				getEPubAction.hidden = false;
			}
		}
	}

	run ()
	{
		console.groupCollapsed( '%c EPubFromElement %c run',
			EPubFromElement.CONSOLE.CLASS_NAME,
			EPubFromElement.CONSOLE.METHOD_NAME
		);

		this.checkRequirements();
		this.setEPubMetadata();
		this.initPrint();
		this.initResultsElement();
		this.initGetEPub();
		this.makeResultsElementSemantic();
		EPubFromElement.addCSSStyleSheets( this.settings.CSSStyleSheets );

		console.groupEnd();

		return this;
	}
};

new EPubFromElement( document.getElementById( 'epub-from-element-settings' ) );
