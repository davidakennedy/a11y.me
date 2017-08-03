/**
 * File: main.js.
 *
 * A few utility functions.
 */
( function() {
	// Test for JavaScript.
	var html = document.documentElement;
	if ( html.className === 'no-js' ) {
		html.className = html.className.replace( 'no-js', 'js' );
	}

	// Helps with accessibility for keyboard only users.
	// Learn more: https://git.io/vWdr2 (Thanks Underscores!)
	var isIe = /(trident|msie)/i.test( navigator.userAgent );

	if ( isIe && document.getElementById && window.addEventListener ) {
		window.addEventListener( 'hashchange', function() {
			var id = location.hash.substring( 1 ),
				element;

			if ( ! ( /^[A-z0-9_-]+$/.test( id ) ) ) {
				return;
			}

			element = document.getElementById( id );

			if ( element ) {
				if ( ! ( /^(?:a|select|input|button|textarea)$/i.test( element.tagName ) ) ) {
					element.tabIndex = -1;
				}

				element.focus();
			}
		}, false );
	}
} )();