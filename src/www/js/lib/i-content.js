var total_height, start_top, column_height;
var screen_type = "desktop";
screen_type = (screen.width == 1920) ? "fullHD" : "desktop";
if(screen_type == "desktop") {
	//Desktop
	total_height = 246;
	start_top = 114;
	column_height = 20;
}
else {
	//Full HD
	total_height = 491;
	start_top = 230;
	column_height = 30;
}

Util.weekdays = new Array("søndag", "mandag", "tirsdag", "onsdag", "torsdag", "fredag", "lørdag");


Util.reposition = function() {
	if(screen_type == "desktop") {
		if(document.documentElement.clientHeight > 540) {
			document.body.style.paddingTop = Math.round(document.documentElement.clientHeight - 540)/2 +"px";
		}
		else {
			document.body.style.paddingTop = 0 +"px";
		}
	}
	if(screen_type == "fullHD") {
		if(document.documentElement.clientHeight > 1080) {
			document.body.style.paddingTop = Math.round(document.documentElement.clientHeight - 1080)/2 +"px";
		}
		else {
			document.body.style.paddingTop = 0 +"px";
		}
	}
}
window.onresize = Util.reposition;



Util.Objects["page"] = new function() {
	this.init = function(page) {
		if(screen_type == "fullHD"){
			u.addClass(document.body, "fullHD");
		}
		if(navigator.userAgent.toLowerCase().match(/iphone/)) {
			window.scrollTo(0, 1);
			if(window.navigator.standalone) {
				u.addClass(document.body, "standalone");
			}
		}

		if(screen_type == "desktop") {
			if(document.documentElement.clientHeight > 540) {
				document.body.style.paddingTop = Math.round(document.documentElement.clientHeight - 540)/2 +"px";
			}
			else {
				document.body.style.paddingTop = 0 +"px";
			}
		}
		if(screen_type == "fullHD") {
			if(document.documentElement.clientHeight > 1080) {
				document.body.style.paddingTop = Math.round(document.documentElement.clientHeight - 1080)/2 +"px";
			}
			else {
				document.body.style.paddingTop = 0 +"px";
			}
		}


		var header = u.ge("p", u.ge("header", page));
		var weekday = u.weekdays[new Date().getDay()];
		var date = new Date().getDate()+"."+(new Date().getMonth()+1)+"."+new Date().getFullYear();
		header.innerHTML = "NOMECO "+weekday+" D. "+date;

		page.picked = function(event) {
			u.e.kill(event);
		}
		u.e.drag(page, page, true);

	}
}

Util.Objects["clock"] = new function() {
	this.init = function(clock) {
		clock.p = u.ge("p", clock);
		clock.set = function() {
			var m = new Date().getMinutes();
			var h = new Date().getHours()
			var time = h+":"+ (m < 10 ? "0"+m : m);
			this.p.innerHTML = time;
			u.t.setTimer(this, this.set, "10000");
		}
		clock.set();
	}
}

Util.Objects["ticker"] = new function() {
	this.init = function(ticker) {
		ticker.p = u.ge("p", ticker);
		ticker.set = function() {
			var ticker, ticks, i;

			// position ticker
			this.p.style.left = this.offsetWidth + "px";

			// request ticker feed (external file)
			if(u.nomeco && typeof(u.nomeco.ticker) == "string") {
				u.XMLRequest(u.nomeco.ticker, this, false, false, "GET");
			}
			// ticker as array
			else if(u.nomeco && typeof(u.nomeco.ticker) == "object") {
				ticks = "";
				for(i = 0; ticker = u.nomeco.ticker[i]; i++) {
					ticks += ticker + (i+1 < u.nomeco.ticker.length ? "<span>|</span>" : "");
				}
				// set ticker
				this.p.innerHTML = ticks;
				// start moving
				this.move();
			}
		}

		// response on external ticker request
		ticker.XMLResponse = function(response) {
			// replace linebreaks
			ticks = response.innerHTML.replace(/\n/g, "<span>|</span>");
			// set ticker
			this.p.innerHTML = ticks;
			// start moving
			this.move();
		}

		// move ticker
		ticker.move = function() {
			// continue moving
			if(this.p.offsetLeft > -(this.p.offsetWidth)) {
				this.p.style.left = this.p.offsetLeft - 2 + "px";
				u.t.setTimer(this, this.move, 50);
			}
			// or reload
			else {
				this.p.innerHTML = "";
				this.set();
				
			}
			
		}
		ticker.set();
	}
}
Util.Objects["slide0102"] = new function() {
	this.init = function(content) {

		var start, done, handled, left
		start = this.getPositions(u.ge("start", content));
		done = this.getPositions(u.ge("done", content), start);
		handled = this.getPositions(u.ge("handled", content));
		left = this.getPositions(u.ge("left", content));
	}
	this.getPositions = function(e, on){
		var col_value = (isNaN(parseInt(e.innerHTML.replace(".", "")))) ? 0 : parseInt(e.innerHTML.replace(".", ""));
		if (col_value == 0){
			e.style.display = "none";
			return e;
		}
		var ch = u.get_height(parseInt(e.innerHTML));
		if(ch < column_height) {
			ch = column_height;
		}
		if(on) {
			e.style.top = u.get_offset(ch)-on.offsetHeight+'px';
		}
		else {
			e.style.top = u.get_offset(ch)+'px';
		}
		e.style.paddingTop = ch-column_height+'px';
		return e;
	}
}

Util.get_height = function (value) {
	value = Math.round((value/1000) * total_height);
	return value;
}
Util.get_offset = function (value){
	value = total_height - value + start_top;
	return value;
}

Util.Objects["slide03"] = new function() {
	this.init = function(e) {
		var total, pluk, ialt;
		total = this.getPositions(u.ge("total", e));
		pluk = this.getPositions(u.ge("pluk", e));
		ialt = this.getPositions(u.ge("ialt", e));
	}
	this.getPositions = function (e) {
		var col_value = (isNaN(parseInt(e.innerHTML.replace(".", "")))) ? 0 : parseInt(e.innerHTML.replace(".", ""));
		if(col_value == 0){
			e.style.display = "none";
			return e;
		}
		var ch = Math.round(col_value/25000* total_height);	
		if(ch < column_height) {
			ch = column_height;
		}
		e.style.top = (total_height-ch+start_top)+'px';
		e.style.paddingTop = ch-column_height+'px';
		return e;
	}
}

Util.Objects["slide04"] = new function() {
	this.init = function(e) {
		var i, div;
//		e.presentation = u.ge("presentation", e);
//		e.presentation.e = e
//		e.presentation.div = u.ges("div", e.presentation)
		e.divs = u.ges("div", u.ge("columnsw", e));
		for(i = 0; div = e.divs[i]; i++) {
			if(div.innerHTML == "") {
				div.style.background = "#dce3e2";
			}
		}
//		u.bug("fiska");
//		u.bug(u.ges("worker", e).length);
//		u.bug(u.ges("worker", e)[0].offsetWidth + ":" + u.ge("stempel", e).offsetWidth + ":" + e.offsetWidth);

		e.view_width = u.ge("workers",e).offsetWidth - u.ge("stempel", e).offsetWidth-1;
		e.worker_width = u.ges("worker", e)[0].offsetWidth+(screen_type == "desktop" ? 2 : 5);
//		u.bug("ww:" + e.view_width)
		e.workers_in_view = Math.floor(e.view_width / e.worker_width);
		e.view_offset = u.ge("columnsw", e).offsetLeft;
		e.views_required = Math.ceil(e.worker_width * u.ges("worker", e).length / e.view_width);
		u.ge("columnsw", e).style.width = Math.ceil(e.worker_width * u.ges("worker", e).length)+"px";
//		u.bug(e.workers_in_view + ":::" + e.views_required);

		e.pane = 0;
		e.updateSchedule = function() {
			u.t.resetTimer(this.e.timer);
			if(this.pane < this.views_required) {
//				u.e.transform(u.ge("columnsw", e), -(this.pane * e.view_width) + e.view_offset, 0);
				u.ge("columnsw", this).style.left = -(this.pane * this.view_width) + this.view_offset + "px";
//				u.e.transition(u.ge("columnsw", this), "all 0.5s ease-out");
//				u.e.transform(u.ge("columnsw", this), -(this.pane * this.view_width) + this.view_offset , 0);

				this.e.timer = u.t.setTimer(this, this.updateSchedule, 7000);
				this.pane++;
			}
			else {
				this.pane = 0;
				this.e.timer = u.t.setTimer(this, this.swipedLeft, 7000);
			}
		}
	}
}

Util.validValue = function (t) {
	var t_value = t
	if(isNaN(t)){
		t_value = 0;
	}
	return t_value;
}

Util.Objects["slide06"] = new function() {
	this.init = function(e) {
		var counts, lines, error_counts, errors, total_height, column_height, error_height, error, line_height, line, i, error_count;

		if(screen_type == "desktop") {
			//Desktop
			total_height = 213;
			column_height = 108;
			error_height = 10;
			line_height = 20;
		}
		else {
			//Full HD
			total_height = 432;
			column_height = 215;
			error_height = 20;
			line_height = 30;
		}

		e.diagram = u.ge("diagram", e);
		e.diagram.e = e;
		counts = u.ges("count", e);
		lines = u.ges("lines", e);
		error_counts = u.ges("error_count", e);
		errors = u.ges("errors", e);
		for(i = 0; line = lines[i]; i++) {
			var non_value = u.validValue(parseInt(line.innerHTML.replace(".", "")))
			var line_h = Math.round((parseInt(line.innerHTML.replace(".", "")))/1000*column_height);
			if(line_h > line_height) {
				line.style.paddingTop = line_h-line_height+'px';
			}
			else {
				line_h = line_height;
			}
			var extra_height = 0;
			if(non_value == 0){
				line.style.display = "none";
				extra_height = 20;
			}
			counts[i].style.paddingTop = (total_height+extra_height - line_h-line_height) + "px";
		}
		for(i = 0; error_count = error_counts[i]; i++) {
			with (error = errors[i]) {
				error.style.height = Math.round(parseInt(error_count.innerHTML))*error_height+'px';
			}
		}

		workers = u.ges("worker", e);
		e.view_width = u.ge("view",e).offsetWidth;
		e.worker_width = workers[0].offsetWidth+(screen_type == "desktop" ? 1 : 3);
		e.workers_in_view = Math.floor(e.view_width / e.worker_width);
		e.views_required = Math.ceil(e.worker_width * workers.length / e.view_width);
		e.diagram.style.width = Math.ceil(e.worker_width * workers.length)+"px";

		e.pane = 0;

		e.updateSchedule = function() {
			u.t.resetTimer(this.e.timer);
			if(this.pane < this.views_required) {
//				u.e.transition(this.diagram, "all 0.5s ease-out");
//				u.e.transform(this.diagram, -(this.pane * this.view_width), 0);
				this.diagram.style.left = -(this.pane * this.view_width) + "px";
				this.e.timer = u.t.setTimer(this, this.updateSchedule, 7000);
				this.pane++;
			}
			else {
				this.pane = 0;
				this.e.timer = u.t.setTimer(this, this.swipedLeft, 7000);
			}
		}

	}
}
