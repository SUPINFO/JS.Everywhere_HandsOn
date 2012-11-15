describe("New todos stream", function() {

	var STREAM_URL = CONFIG.HOST + "/stream";

	var simpleTodos = [
			{ title: "Todo 1", description: "A first Todo", deadLine: "2013-10-01" },
			{ title: "Todo 2", description: "A second Todo", deadLine: "2014-10-01" }
		],
		lastEventSourceCreated;

	function mockEventSource() {
		var MockedEventSource = function(url) {
			this.url = url;
			this.readyState = EventSource.OPEN;
			this.onmessage = function(data) {};
			this.onerror = function() {};
			this.close = function() { this.readyState = EventSource.CLOSED; };
			lastEventSourceCreated = this;
		};

		MockedEventSource.OPEN = EventSource.OPEN;
		MockedEventSource.CONNECTING = EventSource.CONNECTING;
		MockedEventSource.CLOSED = EventSource.CLOSED;
		
		EventSource = MockedEventSource;
	}

	mockEventSource();

	describe("subscribe", function() {

		var messageHandler, errorHandler;

		beforeEach( function() {
			// Given
			messageHandler = jasmine.createSpy("messageHandler");
			errorHandler = jasmine.createSpy("errorHandler");
			todosStream.subscribe(messageHandler, errorHandler);
		});

		it(" must use an opened EventSource object with the good stream URL", function() {
			// Then
			expect(lastEventSourceCreated).toBeDefined();
			expect(lastEventSourceCreated.url).toBe(STREAM_URL);
			expect(lastEventSourceCreated.readyState).toBe(EventSource.OPEN);
		});

		it(" must call onmessage handler when a new message is received", function() {
			// When
			lastEventSourceCreated.onmessage({ data: JSON.stringify(simpleTodos[0]) });

			// Then
			expect(messageHandler).toHaveBeenCalledWith(simpleTodos[0]);
			expect(errorHandler).not.toHaveBeenCalled();
		});

		it(" must call onmessage handler twice when two new messages is received", function() {
			// When
			lastEventSourceCreated.onmessage({ data: JSON.stringify(simpleTodos[0]) });
			lastEventSourceCreated.onmessage({ data: JSON.stringify(simpleTodos[1]) });

			// Then
			expect(errorHandler).not.toHaveBeenCalled();
			expect(messageHandler.callCount).toBe(2);

			var firstCallArg = messageHandler.calls[0].args[0];
			var secondCallArg = messageHandler.calls[1].args[0];

			expect(JSON.stringify(firstCallArg)).toBe(JSON.stringify(simpleTodos[0]));
			expect(JSON.stringify(secondCallArg)).toBe(JSON.stringify(simpleTodos[1]));
		});

		it(" must call onerror handler when a connection is closed", function() {
			// Given
			var errorEvent = { readyState: EventSource.CLOSED };

			// When
			lastEventSourceCreated.onerror(errorEvent);

			// Then
			expect(errorHandler).toHaveBeenCalledWith(errorEvent);
			expect(messageHandler).not.toHaveBeenCalled();
		});

	});

	describe("unsubscribe", function() {

		it(" must close the EventSource if open", function() {
			// Given
			todosStream.subscribe(function() {}, function() {});

			// When
			todosStream.unsubscribe();

			// Then
			expect(lastEventSourceCreated.readyState).toBe(EventSource.CLOSED);
		});

	});

	describe("isConnected", function() {

		it(" must return false when not created", function() {
			// When
			todosStream._eventSource = null;

			// Then
			expect(todosStream.isConnected()).toBe(false);
		});

		it(" must return true when connected", function() {
			// When
			todosStream.subscribe(function() {}, function() {});

			// Then
			expect(todosStream.isConnected()).toBe(true);
		});

		it(" must return false when closed", function() {
			// When
			todosStream.subscribe(function() {}, function() {});
			lastEventSourceCreated.readyState = EventSource.CLOSED;

			// Then
			expect(todosStream.isConnected()).toBe(false);
		});

		it(" must return false when connecting", function() {
			// When
			todosStream.subscribe(function() {}, function() {});
			lastEventSourceCreated.readyState = EventSource.CONNECTING;

			// Then
			expect(todosStream.isConnected()).toBe(false);
		});

	});

});
