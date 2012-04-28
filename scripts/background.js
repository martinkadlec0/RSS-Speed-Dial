require(['ajax.mod', 'mustache', 'text!item.tpl', 'domReady!'], function(AJAX, Mustache, template, d) {

	var
		c  = AJAX.create(),
		sd = opera.contexts.speeddial,
		b = d.body
	;

	sd.title = 'iDNES';
	loadRSS();
	setInterval(loadRSS, 15e4);
	setInterval(scrollWindow, 1e4);

	function loadRSS() {
		c.getData('http://feeds.feedburner.com/FavoriteBrowser', handleSuccess, handleError, false);
	}

	function handleSuccess(e) {
		var data = { items: [] };
		[].forEach.call(e.XML.querySelectorAll('item'), function(val, i) {
			data.items[i] = { 
				title: val.querySelector('title').textContent, 
				date: val.querySelector('pubDate').textContent,
				url: val.querySelector('link').textContent
			};
		});
		sd.url = data.items[0].url;
		b.innerHTML = Mustache.render(template, data);
	}

	function handleError(e) {
		console.log(e.text);
		b.innerHTML = 'Error: RSS is not loaded';
	}

	function scrollWindow() {
		if (b.firstElementChild) {
			b.appendChild(d.body.firstElementChild);
			sd.url = b.firstElementChild.dataset.url;
		}
	}
});
