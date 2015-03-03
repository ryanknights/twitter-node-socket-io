(function (window, document)
{	
	/**
	* Create a new socket connection
	**/	

	var socket = io.connect();

	/**
	* Initialise map
	**/	

	var	map = new google.maps.Map(document.getElementById('map-canvas'), // Initialise the map
	{
		center: { lat: 51.481138, lng: 1.753449},
		zoom: 3		
	});

	/**
	* Reference the DOM elements we will be using
	**/	

	var keywordInput  = document.querySelector('[data-input-keyword]'),
		keywordSubmit = document.querySelector('[data-submit-keyword]'),
		keywordText   = document.querySelector('[data-text-keyword]');

	/**
	* Setup event listeners for the socket which are passed FROM the server
	**/
	
	socket.on('connected', function (currentKeyword) // Socket has successfuly connected
	{
		keywordSubmit.disabled = false; // Remove the disabled attribute from the keyword submit button

		if (currentKeyword !== null) // If a keyword has been passed from the server
		{
			keywordText.innerHTML = 'Current stream => ' + currentKeyword; // Display what we are streaming			
		}
	});

	socket.on('twitter-stream', function (tweet) // Socket has recieved a new tweet
	{	
		/**
		* Create new marker using the tweets location
		**/

		var marker = new google.maps.Marker(
		{
			position : new google.maps.LatLng(tweet.lng,tweet.lat)
		});

		/**
		* Create info window using the tweets details
		**/

		var contentString = '<h4><a href="http://twitter.com/'+ tweet.name + '">' + tweet.name + '</a></h4>' +
							'<p>' + tweet.text + '</p>';

		var infowindow = new google.maps.InfoWindow(
		{
			content : contentString
		});

		/**
		* Setup click event to display info window on marker click
		**/

		google.maps.event.addListener(marker, 'click', function ()
		{
			infowindow.open(map, marker);
		});

		/**
		* Add new marker to the map
		**/

		marker.setMap(map);
	});

	socket.on('keyword-changed', function (keyword) // Socket has recieved notifciation that the keyword has been changed
	{
		keywordText.innerHTML = 'Current stream => ' + keyword; // Display the new keyword
		keywordInput.value = ''; // Remove any current value in the input field
	});		

	/**
	* Setup event listeners that will pass data FROM the socket TO the server
	**/

	keywordSubmit.addEventListener('click', function (e) // On click of the submit button
	{	
		e.preventDefault(); // Prevent default actions
		socket.emit('keyword-change', keywordInput.value); // Emit a message to the server requesting the keyword be changed to the inputs current value
		
	}, false);	

}(window, document));