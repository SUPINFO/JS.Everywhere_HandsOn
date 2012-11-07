describe("Todo Adapter", function() {

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
				spyOn(localTodoStorage, "addSyncTodo");
				spyOn(localTodoStorage, "addUnsyncTodo");
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
				expect(localTodoStorage.addSyncTodo).toHaveBeenCalledWith(goodTodo, todoId);
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
				expect(localTodoStorage.addSyncTodo).not.toHaveBeenCalled();
			});
		});

		describe("getAllTodos", function() {

			var todos = [
				{ title: "Simple Todo 1", description: "description", deadLine: "2012_12_12" },
				{ title: "Simple Todo 2", description: "description", deadLine: "2012_12_12" }
			];

			beforeEach(function() {
				spyOn(restClient, "getAllTodos");
				spyOn(localTodoStorage, "addSyncTodo");
				spyOn(localTodoStorage, "getTodo");
			});

			it("must add all todos to localStorage when all are unkonwn", function() {
				// Given
				var getAllTodosCallback = jasmine.createSpy("getAllTodosCallback");
				restClient.getAllTodos.andCallFake( function(callback) {
					callback(null, todos);
				});
				localTodoStorage.getTodo.andReturn(null);

				// When
				todoAdapter.getAllTodos(getAllTodosCallback);

				// Then
				expect(getAllTodosCallback).toHaveBeenCalledWith(todos);
				expect(localTodoStorage.addSyncTodo.calls.length).toEqual(2);
				expect(localTodoStorage.addSyncTodo).toHaveBeenCalledWith(todos[0], 0);
				expect(localTodoStorage.addSyncTodo).toHaveBeenCalledWith(todos[1], 1);
			});

			it("must add only one todos to localStorage when just one is unkonwn", function() {
				// Given
				var getAllTodosCallback = jasmine.createSpy("getAllTodosCallback");
				restClient.getAllTodos.andCallFake( function(callback) {
					callback(null, todos);
				});
				localTodoStorage.getTodo.andCallFake( function(todoId) {
					return todoId === 0;
				});

				// When
				todoAdapter.getAllTodos(getAllTodosCallback);

				// Then
				expect(getAllTodosCallback).toHaveBeenCalledWith(todos);
				expect(localTodoStorage.addSyncTodo).toHaveBeenCalledWith(todos[1], 1);
			});

		});
	});
});