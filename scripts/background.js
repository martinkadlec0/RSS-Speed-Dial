// load all dependencies
require(['ajax.mod', 'mustache', 'text!item.tpl', 'domReady!'], function(AJAX, Mustache, template, d) {

	var
		c  = AJAX.create(),				// use AJAX library to create new connection
		sd = opera.contexts.speeddial,
		b = d.body
	;

	loadRSS();
	setInterval(loadRSS, 15e4);         // load RSS file 150 seconds
	setInterval(scrollWindow, 1e4);     // load next RSS item every 10 seconds

	function loadRSS() {
		try {
			c.getData('http://feeds.feedburner.com/FavoriteBrowser', handleSuccess, handleError, false);
		} catch(e) {
			console.log('RSS Error: You are probably offline. Retry in 150s.');
		}
	}

	function handleSuccess(e) {

		// Prepare data object for Mustache
		var data = { items: [] };
		[].forEach.call(e.XML.querySelectorAll('item'), function(val, i) {
			data.items[i] = { 
				title: val.querySelector('title').textContent, 
				date: val.querySelector('pubDate').textContent,
				url: val.querySelector('link').textContent
			};
		});

		// set url and title of speed dial item
		sd.url = data.items[0].url;
		sd.title = e.XML.querySelector('channel title').textContent;

		// render Mustache template
		b.innerHTML = Mustache.render(template, data);
	}

	function handleError(e) {
		// File couldn't be loaded
		console.log(e.text);
		b.innerHTML = 'Error: RSS is not loaded';
	}

	function scrollWindow() {
		// Move first element to last position - moves the second one to top
		if (b.firstElementChild) {
			b.appendChild(d.body.firstElementChild);
			sd.url = b.firstElementChild.dataset.url;
		}
	}
});
