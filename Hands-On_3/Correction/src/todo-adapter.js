var todoAdapter = {

	addTodo: function(todo) {
		restClient.addTodo(todo, function(err, todoId) {
			if(!err) {
				localTodoStorage.addSyncTodo(todo, todoId);
			} else {
				console.log(err);
			}
		});
	},

	getAllTodos: function(callback) {
		if(navigator.onLine) {
			restClient.getAllTodos( function(err, todos) {
				if(!err) {
					todos.forEach( function(todo, index) {
						if(!localTodoStorage.getTodo(index)) {
							localTodoStorage.addSyncTodo(todo, index);
						}
					});
					callback(todos);
				} else {
					console.log(err);
				}
			});
		} else {
			callback(localTodoStorage.getAllTodos());
		}
	}

};