// chatboot iframe generator
// author : Jean-Philippe Beaudet@s3r3nity
// copyrigth: Erudite Science 
// v 0.0.1
//////////////////////////////

(function($){

	// if document element is present in html
	console.log('chatboot listening on http://localhost:3000')
	if ($('#chatboot').length){
		var html = [
		'<iframe name="chatboot" id="chatboot" src="http://localhost:3000" ',
		'frameborder="0" border="0" cellspacing="0"',
		'style="border-style: none;width: 100%; height: 100%;">',
		'</iframe>'
		].join('')
		$('#chatboot').html(html)
	}
	
})(jQuery);
