define(function(require, exports, module) {

	var restClient = require("./rest-client").restClient,
		todoStorage = require("./todo-storage").todoStorage,
		todosStream = require("./todos-stream").todosStream;

	var todoAdapter = {

		isOnLine: function() {
			return navigator.onLine;
		},

		addTodo: function(todo) {
			restClient.addTodo(todo, function(err, todoId) {
				if(!err) {
					if(!todosStream.isConnected()) {
						todoStorage.addTodo(todo);
					}
				} else {
					console.log(err);
				}
			});
		},

		getAllTodos: function(callback) {
			if(this.isOnLine()) {
				restClient.getAllTodos( function(err, todos) {
					if(!err) {
						todoStorage.setTodos(todos);
					} else {
						todos = todoStorage.getAllTodos();
					}
					callback(err, todos);
				});
			} else {
				callback(null, todoStorage.getAllTodos());
			}
		},

		subscribeToStream: function(onmessage, onerror) {
			var self = this;
			todosStream.subscribe(function(todo) {
				todoStorage.addTodo(todo);
				onmessage(todo);
				self.isSubscribedToStream = true;
			}, function() {
				self.isSubscribedToStream = false;
			});
		},

		isConnectedToStream: function() {
			return todosStream.isConnected();
		}

	};

	exports.todoAdapter = todoAdapter;

});