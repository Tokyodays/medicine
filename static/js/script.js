function class__Client__(window) {
	var className = "Client";
	var profile_table_id, medicine_table_id, timetable_table_id;

	var F = window[className] = function(window){
		if (this.constructor !== F)
			this.constructor = F;
	};

	F.clientId = '986043373287.apps.googleusercontent.com';
	F.apiKey = 'AIzaSyBz7BeNy5Gq1CfAF-g44gdgglSvqczyZ2Y';
	F.scopes = 'https://www.googleapis.com/auth/fusiontables';
	F.databaseName = {
		"profile": "profile.medicines-note",
		"list" : "list.medicines-note",
		"today" : "today.medicines-note"
	};

	F.sex_object = {
		1: "男性",
		2: "女性"
	};

	F.time_object = {
		1: "朝",
		2: "昼",
		3: "晩",
		4: "就寝前"
	};

	F.timing_object = {
		1: "食前",
		2: "食直前",
		3: "食直後",
		4: "食後",
		5: "食間",
		6: "就寝前"
	};

	F.drink_object = {
		0: "飲んでない",
		1: "飲んだ"
	};

	F.getInstance = function(){
		var _instance = void 0;
		return function(frame){
			return _instance !== void 0
				? _instance : (_instance = new F(frame));
		}
	}();

	var FP = F.prototype;

	// Initialize the client, set onclick listeners.
	F.initialize = function(){
		gapi.client.setApiKey(F.apiKey);
		window.setTimeout(function() { Client.auth(true); }, 1);
	}

	// Run OAuth 2.0 authorization.
	F.auth = function(immediate) {
		gapi.auth.authorize({
		  client_id: F.clientId,
		  scope: F.scopes,
		  immediate: immediate
		}, this.handleAuthResult);
	}

	// Handle the results of the OAuth 2.0 flow.
	F.handleAuthResult = function(authResult) {
		var authorizeButton = $('#authorize-button');
		if (authResult) {
			createTable();
		} else {
		  authorizeButton.onclick = function() { this.auth(false); return false; };
		}
	}

	// Run a request to create a new Fusion Table.
	F.createTable = function() {
		var profileTableResource = [];
		profileTableResource.push('{');
		profileTableResource.push('"name": "' + F.databaseName["profile"] + '",');
		profileTableResource.push('"columns": [');
		profileTableResource.push('{ "name": "name", "type": "STRING" },');
		profileTableResource.push('{ "name": "sex", "type": "NUMBER" },');
		profileTableResource.push('{ "name": "birthday", "type": "DATETIME" },');
		profileTableResource.push('{ "name": "sideEffect", "type": "STRING" },');
		profileTableResource.push('{ "name": "allergy", "type": "STRING" },');
		profileTableResource.push('{ "name": "illness", "type": "STRING" },');
		profileTableResource.push('{ "name": "notCapable", "type": "STRING" },');
		profileTableResource.push('{ "name": "attentionUse", "type": "STRING" },');
		profileTableResource.push('{ "name": "otc", "type": "STRING" },');
		profileTableResource.push('{ "name": "useMedical", "type": "STRING" },');
		profileTableResource.push('{ "name": "medicalInstitution", "type": "STRING" }');
		profileTableResource.push('],');
		profileTableResource.push('"isExportable": true');
		profileTableResource.push('}');

		var listTableResource = [];
		listTableResource.push('{');
		listTableResource.push('"name": "' + F.databaseName["list"] + '",');
		listTableResource.push('"columns": [');
		listTableResource.push('{ "name": "startDate", "type": "DATETIME" },');
		listTableResource.push('{ "name": "nomikata", "type": "NUMBER" },');
		listTableResource.push('{ "name": "name", "type": "STRING" },');
		listTableResource.push('{ "name": "number", "type": "STRING" },');
		listTableResource.push('{ "name": "parDay", "type": "NUMBER" },');
		listTableResource.push('{ "name": "nokori", "type": "NUMBER" },');
		listTableResource.push('{ "name": "appendex", "type": "STRING" }');
		listTableResource.push('],');
		listTableResource.push('"isExportable": true');
		listTableResource.push('}');

		var todayTableResource = [];
		todayTableResource.push('{');
		todayTableResource.push('"name": "' + F.databaseName["today"] + '",');
		todayTableResource.push('"columns": [');
		todayTableResource.push('{ "name": "date", "type": "DATETIME" },');
		todayTableResource.push('{ "name": "nomikata", "type": "NUMBER" },');
		todayTableResource.push('{ "name": "name", "type": "STRING" },');
		todayTableResource.push('{ "name": "ryou", "type": "STRING" },');
		todayTableResource.push('{ "name": "kosuu", "type": "NUMBER" },');
		todayTableResource.push('{ "name": "nondakadouka", "type": "NUMBER" }');
		todayTableResource.push('],');
		todayTableResource.push('"isExportable": true');
		todayTableResource.push('}');

		this.runClientRequest({
			path: '/fusiontables/v1/tables',
			body: profileTableResource.join(''),
			method: 'POST'
		}, function(resp){
			var output = JSON.stringify(resp);
			console.log(output);
		})
	}


    // Send an SQL query to Fusion Tables.
    F.query = function(query, _callback) {
    	var that = this;
        var lowerCaseQuery = query.toLowerCase();
        var path = '/fusiontables/v1/query';
        var callback = function(element) {
          return function(resp) {
            var output = JSON.stringify(resp);
            that._callback(output);
          };
        }
        if (lowerCaseQuery.indexOf('select') != 0 &&
            lowerCaseQuery.indexOf('show') != 0 &&
            lowerCaseQuery.indexOf('describe') != 0) {

          var body = 'sql=' + encodeURIComponent(query);
          this.runClientRequest({
            path: path,
            body: body,
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Content-Length': body.length
            },
            method: 'POST'
          }, callback('insert-data-output'));

        } else {
          this.runClientRequest({
            path: path,
            params: { 'sql': query }
          }, callback('select-data-output'));
        }
      }

      // Execute the client request.
      F.runClientRequest = function(request, callback) {
        var restRequest = gapi.client.request(request);
        restRequest.execute(callback);
      }

} class__Client__(window);


$(function(){
	$(".navbar .nav li").each(function(){
		$(this).removeClass("active");
		var _url = $(this).find("a").attr("href").split(".")[0];

		if(window.location.pathname.indexOf(_url) != -1) {
			$(this).addClass("active");
		}
		if(window.location.pathname == "/" && _url.indexOf("index") != -1) {
			$(this).addClass("active");
		}
	})

	Boolean($('#profile_edit #birthday').length) && $('#profile_edit #birthday').datepicker();

})


function setInitialize(){
	Client.initialize();
}