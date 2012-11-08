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

	describe("setTodos", function() {

		beforeEach(function() {
			localStorage.clear();
		});

		it("should add the Todos inside the local storage", function() {
			// Given
			var newTodos = [simpleTodo1, simpleTodo2];

			// When
			todoStorage.setTodos(newTodos);

			// Then
			expect(localStorage.length).toBe(1);
			expect(localStorage.getItem("Todos")).toBe(JSON.stringify(newTodos));
		});

		it("should replace the Todos inside the local storage", function() {
			// Given
			var newTodos = [simpleTodo1];
			localStorage.setItem("Todos", JSON.stringify([simpleTodo2]));

			// When
			todoStorage.setTodos(newTodos);

			// Then
			expect(localStorage.length).toBe(1);
			expect(localStorage.getItem("Todos")).toBe(JSON.stringify(newTodos));
		});

	});

	describe("addTodo", function() {

		beforeEach(function() {
			localStorage.clear();
		});

		it("should add a Todo inside the local storage when empty", function() {
			// When
			todoStorage.addTodo(simpleTodo1);

			// Then
			expect(localStorage.length).toBe(1);
			expect(localStorage.getItem("Todos")).toBe(JSON.stringify([simpleTodo1]));
		});

		it("should add a Todo inside the local storage when not empty", function() {
			// Given
			localStorage.setItem("Todos", JSON.stringify([simpleTodo2]));

			// When
			todoStorage.addTodo(simpleTodo1);

			// Then
			expect(localStorage.length).toBe(1);
			expect(localStorage.getItem("Todos")).toBe(JSON.stringify([simpleTodo2, simpleTodo1]));
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
			todos = todoStorage.getAllTodos();

			// Then
			expect(todos.length).toBe(0);
		});

		it("should retrieve one Todo when the local storage contains one", function() {
			// Given
			var todos;
			localStorage.setItem("Todos", JSON.stringify([simpleTodo1]));

			// When
			todos = todoStorage.getAllTodos();

			// Then
			expect(todos.length).toBe(1);
			expect(JSON.stringify(todos[0])).toBe(JSON.stringify(simpleTodo1));
		});

		it("should retrieve two Todos when the local storage contains two", function() {
			// Given
			var todos;
			localStorage.setItem("Todos", JSON.stringify([simpleTodo1, simpleTodo2]));

			// When
			todos = todoStorage.getAllTodos();

			// Then
			expect(todos.length).toBe(2);
			expect(JSON.stringify(todos[0])).toBe(JSON.stringify(simpleTodo1));
			expect(JSON.stringify(todos[1])).toBe(JSON.stringify(simpleTodo2));
		});

	});

});