describe("Local Todo Storage", function() {

	var simpleTodo1 = {
		title: "Test1",
		description: "This is a first simple todo",
		deadLine: "2012-12-12"
	}, simpleTodo2 = {
		title: "Test2",
		description: "This is a second simple todo",
		deadLine: "2012-12-14"
	};

	describe("addSyncTodo", function() {

		beforeEach(function() {
			localStorage.clear();
		});

		it("should add a Todo inside the local storage", function() {
			// Given
			var todoId = 2;

			// When
			localTodoStorage.addSyncTodo(simpleTodo1, todoId);

			// Then
			expect(localStorage.length).toBe(1);
			expect(localStorage.getItem("Todo:"+todoId)).toBe(JSON.stringify(simpleTodo1));
		});

	});

	describe("addUnsyncTodo", function() {

		beforeEach(function() {
			localStorage.clear();
		});

		it("should add a Todo inside the local storage", function() {
			// When
			localTodoStorage.addUnsyncTodo(simpleTodo1);

			// Then
			expect(localStorage.length).toBe(2);
			expect(localStorage.getItem("Todo:tmp:1")).toBe(JSON.stringify(simpleTodo1));
			expect(localStorage.getItem("Todo:tmp:lastIndex")).toEqual("1");
		});

	});

	describe("getAllTodos", function() {

		beforeEach(function() {
			localStorage.clear();
		});

		it("should retrieve zero Todos when the local storage is empty", function() {
			// Given
			var todos;

			// When
			todos = localTodoStorage.getAllTodos();

			// Then
			expect(todos.length).toBe(0);
		});

		it("should retrieve one Todo when the local storage contains one", function() {
			// Given
			var todos;
			localStorage.setItem("Todo:0", JSON.stringify(simpleTodo1));

			// When
			todos = localTodoStorage.getAllTodos();

			// Then
			expect(todos.length).toBe(1);
			expect(JSON.stringify(todos[0])).toBe(JSON.stringify(simpleTodo1));
		});

		it("should retrieve two Todos when the local storage contains two", function() {
			// Given
			var todos;
			localStorage.setItem("Todo:0", JSON.stringify(simpleTodo1));
			localStorage.setItem("Todo:1", JSON.stringify(simpleTodo2));

			// When
			todos = localTodoStorage.getAllTodos();

			// Then
			expect(todos.length).toBe(2);
			expect(JSON.stringify(todos[0])).toBe(JSON.stringify(simpleTodo1));
			expect(JSON.stringify(todos[1])).toBe(JSON.stringify(simpleTodo2));
		});

	});

	describe("getTodo", function() {

		beforeEach(function() {
			localStorage.clear();
		});

		it("should return a todo by ID when exists", function() {
			// Given
			var todo, todoId = 1;
			localStorage.setItem("Todo:" + todoId, JSON.stringify(simpleTodo1));

			// When
			todo = localTodoStorage.getTodo(todoId);

			// Then
			expect(JSON.stringify(todo)).toBe(JSON.stringify(simpleTodo1));
		});

		it("should return null when a todo doesn't exist", function() {
			// Given
			var todo, todoId = 1;
			localStorage.setItem("Todo:" + todoId, JSON.stringify(simpleTodo1));

			// When
			todo = localTodoStorage.getTodo(todoId + 1);

			// Then
			expect(todo).toBe(null);
		});

	});

});