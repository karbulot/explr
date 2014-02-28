var api = api || {};

if (!window.localStorage.artists) {
	window.localStorage.artists = {};
}

d3.csv("../static/countries.csv", function(err, data) {
	alias = d3.nest()
		.key(function(d) {
			return d.tag.toLowerCase();
		})
		.map(data);

	cname = d3.nest()
		.key(function(d) {
			return d.name.toLowerCase();
		})
		.map(data);

	api.getCountry = function(artist, callback) {
		var ls = window.localStorage;
		var running = true;
		if (ls.artists[artist]) {
			return ls.artists[artist].country_code;
		} else {

			// Get artists country code here, from last.fm or whatever
			console.log(alias);

			api.lastfm.send("artist.gettoptags", [["artist", artist]], function(err,
				responseData2) {
				// Return if something failed
				if (err || !responseData2.toptags.tag) {
					console.error("Couldn't get top tags from lastfm", err, responseData2);
					return;
				}
				//console.log(responseData2)
				responseData2.toptags.tag.forEach(function(t, i) {

					if (running) {

						if (cname[t.name.toLowerCase()]) {
							//console.log("Match!", artist, t.name, alias[t.name][0].id)

							callback({
								"artist": artist,
								"id": cname[t.name.toLowerCase()][0].id,
								"tag": t.name
							});
							running = false;

						} else {
							if (alias[t.name.toLowerCase()]) {
								//console.log("Match!", artist, t.name, alias[t.name][0].id)

								callback({
									"artist": artist,
									"id": alias[t.name.toLowerCase()][0].id,
									"tag": t.name
								});
								running = false;
							} else running = false;
						}
					}

				})
			});
		}
	}
})



api.getTags = function(artist, callback) {
	var ls = window.localStorage;
	if (ls.artists[artist]) {
		return ls.artists[artist].tags;
	} else {
		// Get artists tags here, from last.fm or whatever
	}
}