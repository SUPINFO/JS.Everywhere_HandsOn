var localTodoStorage = {

	addUnsyncTodo: function(todo) {
		var lastIndex = localStorage.getItem("Todo:lastIndex"),
			newId = ++lastIndex;

		localStorage.setItem("Todo:tmp:lastIndex", newId);
		localStorage.setItem("Todo:tmp:" + newId, JSON.stringify(todo));
	},

	addSyncTodo: function(todo, todoId) {
		localStorage.setItem("Todo:" + todoId, JSON.stringify(todo));
	},

	getAllTodos: function() {
		var results = [],
			i = 0,
			todo = localStorage.getItem("Todo:" + i);

		while(todo) {
			results.push(JSON.parse(todo));
			todo = localStorage.getItem("Todo:" + (++i));
		}

		return results;
	},

	getTodo: function(todoId) {
		var strTodo = localStorage.getItem("Todo:" + todoId);
		return strTodo ? JSON.parse(strTodo) : strTodo;
	}

};