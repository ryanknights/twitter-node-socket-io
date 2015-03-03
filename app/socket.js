module.exports = function (io, twit)
{	
	/**
	* Returns a new Twit stream for the passed keyword with the events attached
	**/

	function createStream (keyword)
	{
		var stream = twit.stream('statuses/filter', {track : keyword}); // Defines a new stream tracked by the keyword

		stream.on('tweet', function (data) // When the stream gets a tweet
		{
			if (data.coordinates && data.coordinates !== null) // If the tweet has geolocation information
			{
				var tweet = {"text" : data.text, "name" : data.user.screen_name, "lat": data.coordinates.coordinates[0],"lng": data.coordinates.coordinates[1]}; // Define a new object with the information we want to pass to the client
				
				io.sockets.emit('twitter-stream', tweet); // Emit our new tweet to ALL connected clients
			}
		});

		stream.on('connect', function () // Log a new connection to the stream
		{
			console.log('Connected to twitter stream using keyword => ' + keyword);
		});

		stream.on('disconnect', function () // Log a disconnection from the stream
		{
			console.log('Disconnected from twitter stream using keyword => ' + keyword);
		});

		return stream; // Return the stream
	}

	var stream         = null, // Define global stream holder as we will only ever have ONE active stream
		currentKeyword = null, // Hold the current keyword we are streaming
		currentSockets = 0; // Counter to determine number of open sockets

	io.sockets.on('connection', function (socket) // On a new client connection
	{	
		currentSockets++; // Increase the current sockets counter
		socket.emit('connected', currentKeyword); // Emit an event to THIS client passing the current keyword in case we are already up and running
		console.log('Socket Connected'); // Log a message 

		if (currentKeyword !== null && stream === null) // If our currentKeyword has a value and we have no running stream 
		{												// we assume all clients had disconnected, so let's restart our stream based on the last active keyword
			stream = createStream(currentKeyword);
		}

		socket.on('disconnect', function () // On a socket disconnection
		{
			currentSockets--; // Decrease the current sockets counter
			console.log('Socket Disconnected'); // Log a message

			if (stream !== null && currentSockets <= 0) // If the stream is running and we now have no connected clients
			{	
				stream.stop(); // Stop the stream
				stream = null; // Reset the stream holder back to null
				currentSockets = 0; // Reset the current sockets counter
				console.log('No active sockets, disconnecting from stream'); // Log a message
			}
		});
		
		socket.on('keyword-change', function (keyword) // On a keyword change request from the client
		{	
			if (stream !== null) // If the stream is currently running
			{	
				stream.stop(); // Stop the current stream
				console.log('Stream Stopped'); // Log a message
			}
			
			stream = createStream(keyword); // Create a new stream using the keyword passed from the client

			currentKeyword = keyword; // Set the currentKeyword holder to the passed keyword

			io.sockets.emit('keyword-changed', currentKeyword); // Emit an event to ALL clients passing through the new keyword

			console.log('Stream restarted with keyword => ' + currentKeyword); // Log a message
		});
	});
}