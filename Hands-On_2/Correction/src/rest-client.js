var HOST = "http://sheltered-oasis-7703.herokuapp.com";

var restClient = {

	getTodos: function(callback) {
		$.ajax({
			url: HOST + "/todos"
		}).done(function(data) {
			var todos;
			if(typeof data === "object") {
				todos = data.todos;
			} else {
				todos = JSON.parse(data).todos;
			}
			callback(null, todos);
		}).fail(function() {
			callback("GET /todos error", null);
		});
	},

	addTodo: function(todo, callback) {
		$.ajax({
			url: HOST + "/todos",
			contentType: "application/json",
			data: JSON.stringify(todo),
			type: "POST"
		}).done(function(data, state, jqxhr) {
			callback(null, getTodoId(data));
		}).fail(function() {
			callback("POST /todos error", null);
		});

		function getTodoId(data) {
			var strTodoId = JSON.parse(data).todoId;
			return Number(strTodoId);
		}
	}

};