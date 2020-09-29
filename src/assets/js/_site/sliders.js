const $ = jQuery.noConflict();

'use strict';
const Sliders = {
	/*-------------------------------------------------------------------------------
		# Cache dom and strings
	-------------------------------------------------------------------------------*/
	$domSlider: $('.js-slider'),

	/*-------------------------------------------------------------------------------
		# Initialize
	-------------------------------------------------------------------------------*/
	init: function() {
		// slider
		this.$domSlider.slick({
			infinite: true,
			slidesToShow: 4,
			slidesToScroll: 1,
			speed: 1000,
			arrows: false,
			responsive: [
				{
					breakpoint: 991,
					settings: {
						slidesToShow: 3
					}
				},
				{
					breakpoint: 767,
					settings: {
						slidesToShow: 2
					}
				}
			]
		});
	}
};

export default Sliders;
