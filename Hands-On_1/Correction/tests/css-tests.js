/* Todos : .todo */
module("Todos");

var todos = $(".todo");

test("Todos must have a 200px width.", function() {
	equal(todos.css("width"), "200px");
});

test("Todos elements must have a 200px height.", function() {
	equal(todos.css("height"), "200px");
});

test("Todos elements must be floating.", function() {
	equal(todos.css("float"), "left");
});

test("Todos elements must have centered text.", function() {
	equal(todos.css("text-align"), "center");
});

test("Todos elements must have a no-repeated 200px post-it as background image.", function() {
	ok(/.*images\/post\-it.png/.test(todos.css("background-image")));
	equal(todos.css("background-size"), "200px");
	equal(todos.css("background-repeat"), "no-repeat");
});


/* Todos Header : .todo > header */
module("Todos Header");

var todosHeader = $(".todo > header");

test("Todos header must have centered text.", function() {
	equal(todosHeader.css("text-align"), "center");
});

test("Todos header must have bold font weight.", function() {
	equal(todosHeader.css("font-weight"), "bold");
});

test("Todos header must have a 10 pixel top internal margin.", function() {
	equal(todosHeader.css("padding-top"), "10px");
});

test("Todos header must have a 20 pixel left & right internal margin.", function() {
	equal(todosHeader.css("padding-left"), "20px");
	equal(todosHeader.css("padding-right"), "20px");
});


/* Todos Content : .todo > p */
module("Todos Content");

var todosContent = $(".todo > p");

test("Todos content must be centered.", function() {
	equal(todosContent.css("text-align"), "center");
});

test("Todos content area must have a 80px height.", function() {
	equal(todosContent.css("height"), "80px");
});

test("Todos content area must be scrollable.", function() {
	equal(todosContent.css("overflow-y"), "scroll");
});

test("Todos content must have a 20 pixel left & right internal margin.", function() {
	equal(todosContent.css("padding-left"), "20px");
	equal(todosContent.css("padding-right"), "20px");
});


/* Todos Footer : .todo > footer */
module("Todos Footer");

var todosFooter = $(".todo > footer");

test("Todos footer must have a 10px top internal margin.", function() {
	equal(todosFooter.css("padding-top"), "10px");
});

test("Todos footer must be in italic.", function() {
	equal(todosFooter.css("font-style"), "italic");
});

test("Todos footer must be rotated 3 degrees counterclockwise.", function() {
	equal(todosFooter.css("transform"), "matrix(0.9986295347545738, -0.05233595624294383, 0.05233595624294383, 0.9986295347545738, 0, 0)");
});

test("Todos footer must have a 20 pixel left & right internal margin.", function() {
	equal(todosContent.css("padding-left"), "20px");
	equal(todosContent.css("padding-right"), "20px");
});

