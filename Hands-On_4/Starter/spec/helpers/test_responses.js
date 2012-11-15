var TestResponses = {
	getAllTodos: {
		success: {
			status: 200,
			responseText: JSON.stringify({
				todos: [
					{
						title: "Gift for Daddy",
						description: "Buy a gift for the birthday of my daddy",
						deadLine: "2012-11-29"
					},{
						title: "PPT Hands-on",
						description: "Write a PowerPoint for the SUPINFO Hands on during the JS everywhere",
						deadLine: "2012-11-17"
					}
				]
			})
		},
		fail: {
			status: 500,
			responseText: 'Server error'
		}
	},
	addTodo: {
		success: {
			status: 201,
			responseHeaders: { "Location": "/todos/123" },
			responseText: '{ "todoId": "123" }'
		},
		fail: {
			status: 500,
			responseText: 'Server error'
		}
	}
};