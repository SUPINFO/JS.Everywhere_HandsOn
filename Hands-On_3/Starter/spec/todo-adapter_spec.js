describe("Todo Adapter", function() {

	var todos = [
		{ title: "Simple Todo 1", description: "description", deadLine: "2012_12_12" },
		{ title: "Simple Todo 2", description: "description", deadLine: "2012_12_12" }
	];

	describe("online", function() {

		beforeEach( function() {
			window.navigator = { onLine: true };
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

			it("must add Todo to the server and to the localStorage", function() {
				// Given
				var todoId = 1;
				restClient.addTodo.andCallFake( function(todo, callback) {
					callback(null, todoId);
				});

				// When
				todoAdapter.addTodo(goodTodo);

				// Then
				expect(restClient.addTodo).toHaveBeenCalledWith(goodTodo, jasmine.any(Function));
				expect(todoStorage.addTodo).toHaveBeenCalledWith(goodTodo);
			});

			it("must not add Todo to the localStorage if add to the server failed", function() {
				// Given
				restClient.addTodo.andCallFake( function(todo, callback) {
					callback("Server error", null);
				});

				// When
				todoAdapter.addTodo(badTodo);

				// Then
				expect(restClient.addTodo).toHaveBeenCalledWith(badTodo, jasmine.any(Function));
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
			window.navigator = { onLine: false };
		});

		describe("getAllTodos", function() {

			var getAllTodosCallback;

			beforeEach(function() {
				spyOn(restClient, "getAllTodos");
				getAllTodosCallback = jasmine.createSpy("getAllTodosCallback");
			});

			it("must retrieve the Todos from the localStorage when offline", function() {
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
});
