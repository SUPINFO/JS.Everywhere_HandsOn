describe("REST Client", function() {

	var API_URI = "http://sheltered-oasis-7703.herokuapp.com/todos";

	var callback, request;

	beforeEach(function() {
		jasmine.Ajax.useMock();
	});

	describe("getAllTodos", function() {

		beforeEach(function() {
			// Given
			callback = jasmine.createSpy('callback');

			// When
			restClient.getAllTodos(callback);
			request = mostRecentAjaxRequest();
		});

		it("must send a GET request to /todos", function() {
			// Then
			expect(request.method).toBe("GET");
			expect(request.url).toBe(API_URI);
		});

		it("must return todos and no error when succeed", function() {
			// Then
			request.response(TestResponses.getAllTodos.success);

			expect(callback).toHaveBeenCalled();

			var error = callback.mostRecentCall.args[0];
			var todos = callback.mostRecentCall.args[1];

			expect(error).toBeNull();
			expect(todos).not.toBeNull();
			expect(todos.length).toBe(2);
		});

		it("must return an error message without todos when failed", function() {
			// Then
			request.response(TestResponses.getAllTodos.fail);

			expect(callback).toHaveBeenCalled();

			var error = callback.mostRecentCall.args[0];
			var todos = callback.mostRecentCall.args[1];

			expect(todos).toBeNull();
			expect(error).toBe("GET /todos error");
		});

	});

	describe("addTodo", function() {

		var sampleTodo = {
			title: "Todo Test",
			description: "This is a simple todo",
			deadLine: "2012-12-25"
		};

		beforeEach(function() {
			// Given
			callback = jasmine.createSpy('callback');

			// When
			restClient.addTodo(sampleTodo, callback);
			request = mostRecentAjaxRequest();
		});

		it("must send a POST request to /todos with application/json Content-Type header", function() {
			// Then
			expect(request.method).toBe("POST");
			expect(request.requestHeaders["Content-Type"]).toBe("application/json");
			expect(request.url).toBe(API_URI);
			expect(request.params).toBe(JSON.stringify(sampleTodo));
		});

		it("must return an ID when succeed", function() {
			// Then
			request.response(TestResponses.addTodo.success);

			expect(callback).toHaveBeenCalled();

			var error = callback.mostRecentCall.args[0];
			var todoId = callback.mostRecentCall.args[1];

			expect(error).toBeNull();
			expect(todoId).toBe(123);
		});

		it("must return an error message and no ID when failed", function() {
			//Then
			request.response(TestResponses.addTodo.fail);

			expect(callback).toHaveBeenCalled();

			var error = callback.mostRecentCall.args[0];
			var todoId = callback.mostRecentCall.args[1];

			expect(todoId).toBeNull();
			expect(error).toBe("POST /todos error");
		});
	});
});
