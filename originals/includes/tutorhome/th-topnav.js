window.thTopNavInit = function( $ ) {	
	
	window.thTopNav = {
		
		$th: {
			topNav:			$( 'div.th-topnav' ),
			topNavSects: 	$( 'div.th-topnav ul.ou-sections' ),
			menuIcon:		$( '#menu-icon' )
		},
		
		menuHoverTimeout: {},
		menuBlurTimeout: {},
		menuBlur: true,
		
		init: function() {
	
			var menuIconBindType = ( $.isTouchDevice() ) ? 'touchstart' : 'click';
			
			thTopNav.$th.menuIcon.bind( menuIconBindType, function() {
				if ( !! thTopNav.$th.menuIcon.data( 'isToggling' ) ) {
					return;
				}
				
				thTopNav.$th.menuIcon.data( 'isToggling', true );
				
				if ( thTopNav.$th.topNavSects.is( ':visible' ) ) {
					thTopNav.$th.topNavSects.children( 'li' )
						.animate( {
							opacity: 0
						}, 360, 'easeOutExpo', function() {
							thTopNav.$th.topNavSects.children( 'li' ).css( 'opacity', 1 );
							thTopNav.$th.menuIcon.data( 'isToggling', false );
						} );
					
					setTimeout( function() {
						thTopNav.$th.topNavSects.slideUp( 250, 'easeOutCirc' );
					}, 90 );
				} else {
					thTopNav.$th.topNavSects.children( 'li' ).css( 'opacity', 0 );
					
					thTopNav.$th.topNavSects.slideDown( 250, 'easeOutCirc' );
					
					setTimeout( function() {
						thTopNav.$th.topNavSects.children( 'li' )
							.animate( {
								opacity: 1
							}, 290, 'easeOutExpo', function() {
								thTopNav.$th.menuIcon.data( 'isToggling', false );
							} );
					}, 160 );
				}
				
				$(this).toggleClass( 'active' );	
			} );
			
			thTopNav.$th.topNavSects.find( '> li > a' ).click( function() {
				if ( !! thTopNav.$th.menuIcon.data( 'isToggling' ) ) {
					return false;
				}
			} );
			
			thTopNav.$th.topNav
				.attr( 'role', 'navigation' )
				.find( '> div > ul' )
					.attr( 'role', 'menubar' );
			
			thTopNav.$th.topNavSects
				.children( 'li' )
					.attr( 'role', 'menuitem' )
					.children( 'ul' )
						.attr( 'role', 'menu' )
						.attr( 'aria-hidden', 'true' );
			
			thTopNav.$th.topNavSects
				.children( 'li:has(> ul)' )
					.attr( 'aria-haspopup', 'true' );
			
			thTopNav.$th.topNav.accessibleDropDown();
			
			if ( $.isTouchDevice() ) {
				if ( ! window.location.hash ) {
					$( 'html, body' ).scrollTop( 0 );
				}
				
				$( 'body' ).on( 'touchstart', function( e ) {
					if ( ! thTopNav.$th.topNavSects.has( e.target ).size() ) {
						thTopNav._hideAllDropdowns();
					}
				} );
				
			}
			
			$( document ).keydown( function( e ) {
				switch ( e.keyCode ) {
					case 27:
						// Escape
						thTopNav._hideAllDropdowns();
						break;
				}
			} );
			
			$( 'table tr:even' ).addClass( 'zebraEven' );
			
		},
		
		_showDropdown: function( $this, animate ) {
			var $ul	= $this.children( 'ul[role="menu"]' );
			
			$this.addClass( 'hover' );
			$ul.css( 'left', 0 ); // To match the CSS rules
			
			if ( $ul.size() > 0 ) {
				if ( animate ) {
					$ul
						.css( { 'opacity': 0 } )
						.animate( { 'opacity': 1 }, 150 );
				}
				
				$ul.attr( 'aria-hidden', 'false' );
					
				var	boundaryPadding = 10, // Number of px from the edge of the Top Nav to wrap menu
					$topNav = $( 'div.th-topnav' ),
					topNavOffset = $topNav.offset().left,
					topNavWidth = $topNav.width(),
					topNavBoundaryRight = topNavOffset + topNavWidth,
					menuOffset = $this.offset().left,
					menuWidth = $ul.width(),
					menuBoundaryRight = menuOffset + menuWidth,
					boundaryThreshold = topNavBoundaryRight - boundaryPadding,
					boundaryOffset = 0 - ( menuWidth - $this.width() );
										
				if ( menuBoundaryRight >= boundaryThreshold ) {
					$ul.css( 'left', boundaryOffset );
				}
			}
		},
		
		_hideDropdown: function( $this ) {
			var $ul	= $this.children( 'ul[role="menu"]' );
			
			$this.removeClass( 'hover' );
			
			$ul
				.attr( 'aria-hidden', 'true' )
				.css( 'left', '-9999em' ) // To match the CSS rules
		},
		
		_hideAllDropdowns: function() {
			thTopNav.$th.topNavSects.find( 'ul[role="menu"][aria-hidden="false"]' )
				.attr( 'aria-hidden', 'true' )
				.css( 'left', '-9999em' ) // To match the CSS rules
				.parent()
					.removeClass( 'hover' );
		}
		
	};
	
	thTopNav.init();
};


( function( $ ) {
	$.extend( {
		isTouchDevice: function() { 
			try {  
				document.createEvent( 'TouchEvent' );
				return true;  
			} catch (e) {  
				return false;  
			}  
		}
	} );
		   
	$.fn.accessibleDropDown = function() {
		return this.each( function() {
			var $this = $(this);
			
			if ( $.isTouchDevice() ) {
				$this.find( 'ul:first > li' )
					.on( 'touchstart', function( e ) {
						var $this 	= $(this),
							 $ul	= $this.children( 'ul[role="menu"]' );
						
						if ( $ul.size() == 0 || window.matchMedia( 'only screen and (max-width: 640px)' ).matches ) {
							window.location.href = $( e.target ).attr( 'href' );
							return false;
						}
						
						if ( ! $(this).is( '.hover' ) ) {
							thTopNav._hideAllDropdowns();
							thTopNav._showDropdown( $this, true );
							
						} else {
							window.location.href = $( e.target ).attr( 'href' );
						}
						
						return false;
					} );
			}
			else {
				$this.find( 'ul:first > li' )
					.on( 'mouseenter mouseleave', function( e, eventType ) {
						var $this = $(this);
						var type = ( !! eventType ) ? eventType : 'default';
						var animate = ( type != 'tab' );
						
						if ( e.type == 'mouseenter' ) {	
							clearTimeout( thTopNav.menuBlurTimeout );
						
							if ( ! thTopNav.menuBlur ) {
								thTopNav._showDropdown( $this, animate );
							}
							else {
								thTopNav.menuHoverTimeout = setTimeout( function() {
									thTopNav._showDropdown( $this, animate );
								}, 300 );
							}
	
							thTopNav.menuBlur = false;
						}
						else {
							thTopNav.menuBlurTimeout = setTimeout( function() {
								thTopNav.menuBlur = true;
							}, 10 );
					
							clearTimeout( thTopNav.menuHoverTimeout );
							thTopNav._hideDropdown( $this );
						}
					} );
				
				$( 'a', $this )
					.focus( function() {
						$(this).parentsUntil( thTopNav.$th.topNav, 'li' ).trigger( 'mouseenter', [ 'tab' ] );
					} )
					.blur( function() {
						$(this).parentsUntil( thTopNav.$th.topNav, 'li' ).mouseleave();
					} );
			}
		} );
	};
	
	
	// http://gsgd.co.uk/sandbox/jquery/easing/
		
	$.easing.jswing=$.easing.swing;
	$.extend($.easing,{def:"easeOutQuad",swing:function(e,a,c,b,d){return $.easing[$.easing.def](e,a,c,b,d)},easeInQuad:function(e,a,c,b,d){return b*(a/=d)*a+c},easeOutQuad:function(e,a,c,b,d){return-b*(a/=d)*(a-2)+c},easeInOutQuad:function(e,a,c,b,d){return 1>(a/=d/2)?b/2*a*a+c:-b/2*(--a*(a-2)-1)+c},easeInCubic:function(e,a,c,b,d){return b*(a/=d)*a*a+c},easeOutCubic:function(e,a,c,b,d){return b*((a=a/d-1)*a*a+1)+c},easeInOutCubic:function(e,a,c,b,d){return 1>(a/=d/2)?b/2*a*a*a+c:
	b/2*((a-=2)*a*a+2)+c},easeInQuart:function(e,a,c,b,d){return b*(a/=d)*a*a*a+c},easeOutQuart:function(e,a,c,b,d){return-b*((a=a/d-1)*a*a*a-1)+c},easeInOutQuart:function(e,a,c,b,d){return 1>(a/=d/2)?b/2*a*a*a*a+c:-b/2*((a-=2)*a*a*a-2)+c},easeInQuint:function(e,a,c,b,d){return b*(a/=d)*a*a*a*a+c},easeOutQuint:function(e,a,c,b,d){return b*((a=a/d-1)*a*a*a*a+1)+c},easeInOutQuint:function(e,a,c,b,d){return 1>(a/=d/2)?b/2*a*a*a*a*a+c:b/2*((a-=2)*a*a*a*a+2)+c},easeInSine:function(e,a,c,b,d){return-b*Math.cos(a/
	d*(Math.PI/2))+b+c},easeOutSine:function(e,a,c,b,d){return b*Math.sin(a/d*(Math.PI/2))+c},easeInOutSine:function(e,a,c,b,d){return-b/2*(Math.cos(Math.PI*a/d)-1)+c},easeInExpo:function(e,a,c,b,d){return 0==a?c:b*Math.pow(2,10*(a/d-1))+c},easeOutExpo:function(e,a,c,b,d){return a==d?c+b:b*(-Math.pow(2,-10*a/d)+1)+c},easeInOutExpo:function(e,a,c,b,d){return 0==a?c:a==d?c+b:1>(a/=d/2)?b/2*Math.pow(2,10*(a-1))+c:b/2*(-Math.pow(2,-10*--a)+2)+c},easeInCirc:function(e,a,c,b,d){return-b*(Math.sqrt(1-(a/=d)*
	a)-1)+c},easeOutCirc:function(e,a,c,b,d){return b*Math.sqrt(1-(a=a/d-1)*a)+c},easeInOutCirc:function(e,a,c,b,d){return 1>(a/=d/2)?-b/2*(Math.sqrt(1-a*a)-1)+c:b/2*(Math.sqrt(1-(a-=2)*a)+1)+c},easeInElastic:function(e,a,c,b,d){e=1.70158;var f=0,g=b;if(0==a)return c;if(1==(a/=d))return c+b;f||(f=0.3*d);g<Math.abs(b)?(g=b,e=f/4):e=f/(2*Math.PI)*Math.asin(b/g);return-(g*Math.pow(2,10*(a-=1))*Math.sin((a*d-e)*2*Math.PI/f))+c},easeOutElastic:function(e,a,c,b,d){e=1.70158;var f=0,g=b;if(0==a)return c;if(1==
	(a/=d))return c+b;f||(f=0.3*d);g<Math.abs(b)?(g=b,e=f/4):e=f/(2*Math.PI)*Math.asin(b/g);return g*Math.pow(2,-10*a)*Math.sin((a*d-e)*2*Math.PI/f)+b+c},easeInOutElastic:function(e,a,c,b,d){e=1.70158;var f=0,g=b;if(0==a)return c;if(2==(a/=d/2))return c+b;f||(f=d*0.3*1.5);g<Math.abs(b)?(g=b,e=f/4):e=f/(2*Math.PI)*Math.asin(b/g);return 1>a?-0.5*g*Math.pow(2,10*(a-=1))*Math.sin((a*d-e)*2*Math.PI/f)+c:0.5*g*Math.pow(2,-10*(a-=1))*Math.sin((a*d-e)*2*Math.PI/f)+b+c},easeInBack:function(e,a,c,b,d,f){void 0==
	f&&(f=1.70158);return b*(a/=d)*a*((f+1)*a-f)+c},easeOutBack:function(e,a,c,b,d,f){void 0==f&&(f=1.70158);return b*((a=a/d-1)*a*((f+1)*a+f)+1)+c},easeInOutBack:function(e,a,c,b,d,f){void 0==f&&(f=1.70158);return 1>(a/=d/2)?b/2*a*a*(((f*=1.525)+1)*a-f)+c:b/2*((a-=2)*a*(((f*=1.525)+1)*a+f)+2)+c},easeInBounce:function(e,a,c,b,d){return b-$.easing.easeOutBounce(e,d-a,0,b,d)+c},easeOutBounce:function(e,a,c,b,d){return(a/=d)<1/2.75?b*7.5625*a*a+c:a<2/2.75?b*(7.5625*(a-=1.5/2.75)*a+0.75)+c:a<2.5/2.75?
	b*(7.5625*(a-=2.25/2.75)*a+0.9375)+c:b*(7.5625*(a-=2.625/2.75)*a+0.984375)+c},easeInOutBounce:function(e,a,c,b,d){return a<d/2?0.5*$.easing.easeInBounce(e,2*a,0,b,d)+c:0.5*$.easing.easeOutBounce(e,2*a-d,0,b,d)+0.5*b+c}});

	
} )( jQuery );