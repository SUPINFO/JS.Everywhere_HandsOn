define(function(require, exports, module) {

	var todosStream = {

		subscribe: function(onmessage, onerror) {
			this._eventSource = new EventSource(CONFIG.HOST + "/stream");
			this._eventSource.onmessage = function(e) {
				console.log(e);
				onmessage(JSON.parse(e.data));
			};
			this._eventSource.onerror = onerror;
		},

		unsubscribe: function() {
			this._eventSource.close();
		},

		isConnected: function() {
			return Boolean(this._eventSource && this._eventSource.readyState === EventSource.OPEN);
		}

	};

	exports.todosStream = todosStream;

});