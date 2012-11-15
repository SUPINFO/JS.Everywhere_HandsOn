define(function(require, exports, module) {

	var todoAdapter = require("./todo-adapter").todoAdapter,
		Mustache = require("../lib/mustache");

	$(document).ready( function() {
		$.get("templates/_todo.html", function(template) {
			todoAdapter.getAllTodos( function(err, todos) {
				var notification;
				if(err) { 
					notification += "<li>" + err + "</li>"; 
				}
				if(todos) {
					displayTodos(todos, template);
					if(err) {
						notification += "<li>Displayed Todos are from local storage.</li>";
					} else if(!navigator.onLine) {
						notification = "<li>You are offline. Displayed Todos are from local storage.</li>";
					}
				}
				if(notification) $("body > .information").html(notification).show();
			});

			var addTodoLink = $(".todos > a.add-todo");
			if(navigator.onLine) {
				addTodoLink.click( function() {
					displayAddTodoForm();
				});
				todoAdapter.subscribeToStream( function(todo) {
					displayTodo(todo, template);
				}, function(e) {
					$("body > .information").append("<li>Todos stream is closed.</li>").show();
				});
			} else {
				addTodoLink.hide();
			}

			function displayAddTodoForm() {
				$.facebox({
					ajax: "templates/_addTodo.html", 
					callback: function() {
						$("#addTodoButton").click( function() {
							addTodo({
								title: $("#addTodoForm input[name='title']").val(),
								description: $("#addTodoForm textarea[name='description']").val(),
								deadLine: $("#addTodoForm input[name='deadLine']").val()
							});
						});
					}
				});
			}

			function addTodo(todo) {
				if(todo.title) {
					todoAdapter.addTodo(todo);
					$(document).trigger('close.facebox');
					if(!todoAdapter.isConnectedToStream()) {
						displayTodo(todo, template);
					}
				} else {
					$('#error-message').html("You have to enter a name for your todo!");
				}
			}
		}, "html");

		function displayTodos(todos, template) {
			todos.forEach( function(todo) {
				displayTodo(todo, template);
			});
		}

		function displayTodo(todo, template) {
			var todoHtml = Mustache.render(template, todo);
			$(".todos").prepend(todoHtml);
		}

	});

});