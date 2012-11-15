describe("Todo Adapter", function() {

	var todos = [
		{ title: "Simple Todo 1", description: "description", deadLine: "2012_12_12" },
		{ title: "Simple Todo 2", description: "description", deadLine: "2012_12_12" }
	];

	describe("online", function() {

		beforeEach( function() {
			spyOn(todoAdapter, "isOnLine").andReturn(true);
		});

		describe("subscribeToStream", function() {

			var onMessageHandler, onErrorHandler;

			beforeEach( function() {
				// Given
				onMessageHandler = jasmine.createSpy("onMessageHandler");
				onErrorHandler = jasmine.createSpy("onErrorHandler");

				spyOn(todosStream, "subscribe");
				spyOn(todoStorage, "addTodo");
			});

			it(" must call todosStream.subscribe method" ,function() {
				// When
				todoAdapter.subscribeToStream(onMessageHandler, onErrorHandler);

				// Then
				expect(todosStream.subscribe).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function));
			});

			it(" must call first function in args on new message" ,function() {
				// When
				todoAdapter.subscribeToStream(onMessageHandler, onErrorHandler);
				
				var lastSubscribeCall = todosStream.subscribe.calls[0];
				lastSubscribeCall.args[0](todos[0]);

				// Then
				expect(onMessageHandler).toHaveBeenCalledWith(todos[0]);
			});

			it(" must add one streamed todo to localStorage" ,function() {
				// When
				todoAdapter.subscribeToStream(onMessageHandler, onErrorHandler);
				
				var lastSubscribeCall = todosStream.subscribe.calls[0];
				lastSubscribeCall.args[0](todos[0]);

				// Then
				expect(todoStorage.addTodo).toHaveBeenCalledWith(todos[0]);
			});

			it(" must add two streamed todos to localStorage" ,function() {
				// When
				todoAdapter.subscribeToStream(onMessageHandler, onErrorHandler);
				
				var lastSubscribeCall = todosStream.subscribe.calls[0];
				lastSubscribeCall.args[0](todos[0]);
				lastSubscribeCall.args[0](todos[1]);

				// Then
				expect(todoStorage.addTodo.callCount).toBe(2);
				expect(todoStorage.addTodo.calls[0].args[0]).toBe(todos[0]);
				expect(todoStorage.addTodo.calls[1].args[0]).toBe(todos[1]);
			});

		});

		describe("addTodo", function() {

			var goodTodo = {
					title: "Test",
					description: "This is a simple todo",
					deadLine: "2012-12-12"
				},
				badTodo = { description: "Bad Todo" };

			beforeEach(function() {
				spyOn(restClient, "addTodo");
				spyOn(todoStorage, "addTodo");
			});

			it("must add the new todo to the localStorage if not subscribed to the stream", function() {
				// Given
				var todoId = 1;
				restClient.addTodo.andCallFake( function(todo, callback) {
					callback(null, todoId);
				});
				spyOn(todosStream, "isConnected").andReturn(false);

				// When
				todoAdapter.addTodo(goodTodo);

				// Then
				expect(restClient.addTodo).toHaveBeenCalledWith(goodTodo, jasmine.any(Function));
				expect(todoStorage.addTodo).toHaveBeenCalledWith(goodTodo);
			});

			it("must not add the new todo to the localStorage if subscribed to the stream", function() {
				// Given
				var todoId = 1;
				restClient.addTodo.andCallFake( function(todo, callback) {
					callback(null, todoId);
				});
				spyOn(todosStream, "isConnected").andReturn(true);

				// When
				todoAdapter.addTodo(goodTodo);

				// Then
				expect(restClient.addTodo).toHaveBeenCalledWith(goodTodo, jasmine.any(Function));
				expect(todoStorage.addTodo).not.toHaveBeenCalled();
			});

		});

		describe("getAllTodos", function() {

			var getAllTodosCallback;

			beforeEach(function() {
				spyOn(restClient, "getAllTodos");
				spyOn(todoStorage, "setTodos");
				getAllTodosCallback = jasmine.createSpy("getAllTodosCallback");
			});

			it("must add all todos retrieved by the server to the localStorage", function() {
				// Given
				restClient.getAllTodos.andCallFake( function(callback) {
					callback(null, todos);
				});

				// When
				todoAdapter.getAllTodos(getAllTodosCallback);

				// Then
				expect(getAllTodosCallback).toHaveBeenCalledWith(null, todos);
				expect(todoStorage.setTodos).toHaveBeenCalledWith(todos);
			});

			it("must return an error message and the Todos from localStorage when a server error happens", function() {
				// Given
				var serverErrorMessage = "Server error";

				restClient.getAllTodos.andCallFake( function(callback) {
					callback(serverErrorMessage, null);
				});
				spyOn(todoStorage, "getAllTodos").andReturn(todos);

				// When
				todoAdapter.getAllTodos(getAllTodosCallback);

				// Then
				expect(todoStorage.getAllTodos).toHaveBeenCalledWith();
				expect(getAllTodosCallback).toHaveBeenCalledWith(serverErrorMessage, todos);
			});

		});

	});

	describe("offline", function() {

		beforeEach( function() {
			spyOn(todoAdapter, "isOnLine").andReturn(false);
		});

		describe("getAllTodos", function() {

			var getAllTodosCallback;

			beforeEach(function() {
				spyOn(restClient, "getAllTodos");
				getAllTodosCallback = jasmine.createSpy("getAllTodosCallback");
			});

			it(" must retrieve the Todos from the localStorage when offline", function() {
				// Given
				spyOn(todoStorage, "getAllTodos").andReturn(todos);

				// When
				todoAdapter.getAllTodos(getAllTodosCallback);

				// Then
				expect(restClient.getAllTodos).not.toHaveBeenCalled();
				expect(todoStorage.getAllTodos).toHaveBeenCalled();
				expect(getAllTodosCallback).toHaveBeenCalledWith(null, todos);
			});

		});

	});

	describe("isConnectedToStream", function() {

		beforeEach(function() {
			spyOn(todosStream, "isConnected");
		});

		it(" must return true when todosStream says it's true", function() {
			// Given
			todosStream.isConnected.andReturn(true);

			// When
			var result = todoAdapter.isConnectedToStream();

			// Then
			expect(result).toBe(true);
		});

		it(" must return false when todosStream says it's false", function() {
			// Given
			todosStream.isConnected.andReturn(false);

			// When
			var result = todoAdapter.isConnectedToStream();

			// Then
			expect(result).toBe(false);
		});

	});

});
