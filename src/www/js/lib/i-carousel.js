//var content = new Array(1,2,3,4,5,6);

Util.Objects["carousel"] = new function() {
	this.init = function(e) {

		e.content = u.nomeco ? u.nomeco.slides : new Array(location.href);
		e.display_width = e.offsetWidth;
		e.display_height = e.offsetHeight;
		e.timer = false;

		// global update schedule
		e.updateSchedule = function(slide) {
			u.t.resetTimer(e.timer);

//			u.bug("update" + (slide ? slide.className : ""));
			// invoke slide independent schedule if it exists
			if(slide && typeof(slide.updateSchedule) == "function") {
				//
//				u.bug("local")
				slide.updateSchedule();
			}
			// see if current slide has a schedule
			else if(e.current_slide && typeof(e.current_slide.updateSchedule) == "function") {
				//
	//			u.bug("current")
				e.current_slide.updateSchedule();
			}
			// or run basic update scheme
			else {
//				u.bug("global")
				e.timer = u.t.setTimer(e.current_slide, e.next, 7000)
			}
		}

		// keep track of index
		e.setIndexBase = function(base) {
			this.prev_index = base > 0 ? base-1 : e.content.length-1;
			this.current_index = base;
			this.next_index = base < e.content.length-1 ? base+1 : 0;
		}
		// start at begining
		e.setIndexBase(0);

		// no slides preloaded
		e.prev_slide = false;
		e.current_slide = false;
		e.next_slide = false;

		// goto previous slide
		e.prev = function() {
			// move prev slide
			u.e.transition(this.e.prev_slide, "all 0.5s ease-out");
			u.e.transform(this.e.prev_slide, 0, 0);
			// move current slide
			u.e.transition(this.e.current_slide, "all 0.5s ease-out");
			u.e.transform(this.e.current_slide, e.display_width, 0);
			// set new slide relations
			this.e.next_slide = this.e.current_slide;
			this.e.current_slide = this.e.prev_slide;
			this.e.prev_slide = false;
			this.e.setIndexBase(this.e.prev_index);
		}
		// goto next slide
		e.next = function() {
			// move current slide
			u.e.transition(this.e.current_slide, "all 0.5s ease-out");
			u.e.transform(this.e.current_slide, -(e.display_width), 0);
			// move next slide
			u.e.transition(this.e.next_slide, "all 0.5s ease-out");
			u.e.transform(this.e.next_slide, 0, 0);

			// set new slide relations
			this.e.prev_slide = this.e.current_slide;
			this.e.current_slide = this.e.next_slide;
			this.e.next_slide = false
			this.e.setIndexBase(this.e.next_index);
		}



		// loads new slides
		e.loadSlide = function() {

			if(!this.prev_slide || !this.current_slide || !this.next_slide) {
				// create new dom object
				var dom = document.createElement("div");
				dom.className = "slide";
				dom.e = e;
				this.appendChild(dom);

				// create responder for Ajax (HXL) response
				dom.XMLResponse = function(response) {
					var slide = u.ge("slide", response);
					this.className = slide.className;
					this.innerHTML = slide.innerHTML;
					u.init(this);
				}

				dom.swipedLeft = e.next;
				dom.swipedRight = e.prev;

				// reset timer when slide is picked
				dom.picked = function() {
					u.t.resetTimer(this.e.timer);
				}
				// clean up on transition end
				dom.transitioned = function() {
					// if transition comes from primary slide (controlling the timeline)
					if(this == this.e.current_slide) {
						// invoke slide update schedule 
						this.e.updateSchedule(this);
						// check if new slides are required
						this.e.loadSlide();

						// remove used slides (cleaning up)
						var i, slide, slides = u.ges("slide", this.e);
						for(i = 0; slide = slides[i]; i++) {
							if(slide != this.e.current_slide && slide != this.e.prev_slide && slide != this.e.next_slide) {
								this.e.removeChild(slide);
							}
						}
					}
				}
				u.e.swipe(dom, new Array(-960, 0, 1920, e.display_height));

				// load slides
				if(!this.prev_slide) {
					this.prev_slide = dom;
					u.e.transform(dom, -(e.display_width), 0);
					u.XMLRequest(this.content[this.prev_index], dom, false, false, "GET");
				}
				else if(!this.current_slide) {
					this.current_slide = dom;
					u.e.transform(dom, 0, 0);
					u.XMLRequest(this.content[this.current_index], dom, false, false, "GET");
				}
				else if(!this.next_slide) {
					this.next_slide = dom;
					u.e.transform(dom, e.display_width, 0);
					u.XMLRequest(this.content[this.next_index], dom, false, false, "GET");
				}
				// any missing slides
				if(!this.current_slide || !this.next_slide) {
					this.loadSlide();
				}
			}
		}

		var prev = u.ge("prev");
		var next = u.ge("next");
		if(prev && next) {
			prev.e = e;
			next.e = e;
			prev.clicked = e.prev;
			next.clicked = e.next;
			u.e.click(prev);
			u.e.click(next);
		}

		e.loadSlide();
		u.addClass(e, "ready");
//		e.updateSchedule(e.current_slide);

		// wait a bit to ensure all elements have been initiolized
		e.timer = u.t.setTimer(e, e.updateSchedule, 1000);

	}
}

