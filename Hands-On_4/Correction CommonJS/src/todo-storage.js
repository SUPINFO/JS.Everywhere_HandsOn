define(function(require, exports, module) {

	var todoStorage = {

		setTodos: function(todos) {
			localStorage.setItem("Todos", JSON.stringify(todos));
		},

		addTodo: function(todo) {
			var localTodos = JSON.parse(localStorage.getItem("Todos"));
			if(localTodos) {
				localTodos.push(todo);
			} else {
				localTodos = [todo];
			}
			localStorage.setItem("Todos", JSON.stringify(localTodos));
		},

		getAllTodos: function() {
			var localTodos = JSON.parse(localStorage.getItem("Todos"));
			return localTodos ? localTodos : [];
		}

	};

	exports.todoStorage = todoStorage;

});