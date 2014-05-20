var eventsList = [];
var resourcesList = [];

$(document).ready(function() {

	// page is now ready, initialize the calendar...

	$('#events-overlayed').css('top', $( window ).height()-150);

	var date = new Date();
	var d = date.getDate();
	var m = date.getMonth();
	var y = date.getFullYear();
	
	eventsList = [
			{
				id: nextEventId++,
				title: 'All Day Event',
				start: new Date(y, m, 1),
				end: new Date(y, m, 2),
				allDay: true,
				resources: [],
				incompatibleEvents: []
			},
			{
				id: nextEventId++,
				title: 'Long Event',
				start: new Date(y, m, d-5),
				end: new Date(y, m, d-2),
				allDay: true,
				resources: [],
				incompatibleEvents: []
			},
			{
				id: nextEventId++,
				title: 'Repeating Event',
				start: new Date(y, m, d-3, 16, 0),
				end: new Date(y, m, d, 0),
				allDay: false,
				resources: [],
				incompatibleEvents: []
			},
			{
				id: nextEventId++,
				title: 'Repeating Event',
				start: new Date(y, m, d+4, 16, 0),
				end: new Date(y, m, d+4,20,0),
				allDay: false,
				resources: [],
				incompatibleEvents: []
			},
			{
				id: nextEventId++,
				title: 'Meeting',
				start: new Date(y, m, d, 10, 30),
				end: new Date(y, m, d ,14, 0),
				allDay: false,
				resources: [],
				incompatibleEvents: []
			},
			{
				id: nextEventId++,
				title: 'Lunch',
				start: new Date(y, m, d, 12, 0),
				end: new Date(y, m, d, 14, 0),
				allDay: false,
				resources: [],
				incompatibleEvents: []
			},
			{
				id: nextEventId++,
				title: 'Birthday Party',
				start: new Date(y, m, d+1, 19, 0),
				end: new Date(y, m, d+1, 22, 30),
				allDay: false,
				resources: [],
				incompatibleEvents: []
			},
			{
				id: nextEventId++,
				title: 'Click for Google',
				start: new Date(y, m, 28),
				end: new Date(y, m, 29),
				url: 'http://google.com/',
				allDay: true,
				resources: [],
				incompatibleEvents: []
			}
		];
	resourcesList = [
		{ 
			id: nextResourceId++,
			description: "Professor de IHC/EDJ",
			name:"Licinio Roque"
		},
		{
			id: nextResourceId++,
			description: "Costuma cheirar a lasanha.",
			name: "Sala G.5.2" 
		}];
	
	$('#calendar').fullCalendar({
		// put your options and callbacks here

		theme: true,
		aspectRatio: 1.1,
		editable: true,
		header: {
				left: 'prev,today,next',
				center: 'title',
				right: 'month,agendaWeek,agendaDay'
			},
		events: eventsList, //add events to Calendar
		eventClick: function(event) {
			editEvent(event);
		},
		eventResizeStop:  function (event) {
			console.log("event modified: " + event.title);
			verifyIncompatibilities();
		},
		eventDragStop:  function (event) {
			console.log("event modified: " + event.title);
			verifyIncompatibilities();
		}
	})

	$('#calendar').fullCalendar('changeView', 'agendaWeek' );

	resourcesList.forEach(createResource);
	//eventsList.forEach(createEvent)
	listEventsInMenu();

});

function createEvent(elem) {
	$("<li id=evt-" + elem.id + " class='event-item ui-draggable'>")
		.text(elem.title).appendTo('#menu-events-list ul');
	setDraggableEvents();
}

function createResource(elem) {
	$("<li id=rsc-" + elem.id + " class='resource-item ui-draggable'>")
		.text(elem.name).appendTo('#menu-resources-list ul');
	setDraggableResources();
}

function addEvent(name) {
	$('#add-event-modal').modal('show');
	$('#add-resource-modal').modal('hide');
	$('#edit-event-modal').modal('hide');
	$('#edit-resource-modal').modal('hide');
	// $('<a/>', {
	// 	text: name
	// }).appendTo('#left-menu');
}

function addResource(name) {
	$('#add-resource-modal').modal('show');
	$('#add-event-modal').modal('hide');
	$('#edit-event-modal').modal('hide');
	$('#edit-resource-modal').modal('hide');
	// $('<a/>', {
	// 	text: name
	// }).appendTo('#left-menu');
}

$(function () {
	$('#date-time-begin').datetimepicker();
	$('#date-time-end').datetimepicker();
	$('#edit-time-begin').datetimepicker();
	$('#edit-time-end').datetimepicker();
});

// ######################################################################
// Drag and drop
function setDraggableResources() {
	$( "#menu-resources-list li" ).draggable({
	  appendTo: "body",
	  helper: "clone",
	  cursor: "move",
	  start: function(e, ui) {
		  $(ui.helper).addClass("dragging-resource-item");
		 }
	});
}

$(function() {
	setDraggableResources();
	$( "#new-event-resources" ).droppable({
	  activeClass: "area-to-drag-resource-element",
	  hoverClass: "ui-state-hover",
	  accept: function(d) { 
			if(d.hasClass("resource-item")){ 
				return true;
			}
		},
	  drop: function( event, ui ) {
		$( this ).find( ".placeholder" ).remove();
		$( "<span id='" + $(ui.draggable).attr("id") + "' class='dragged-resource-item'></span>" ).text( ui.draggable.text() ).append( '<span class="object-item-remove-btn btn-xs glyphicon glyphicon-remove" onclick="removeItem(this)"></span>' ).appendTo( this );
	  }
	}).sortable({
	  items: "li:not(.placeholder)",
	  sort: function() {
		// gets added unintentionally by droppable interacting with sortable
		// using connectWithSortable fixes this, but doesn't allow you to customize active/hoverClass options
		$( this ).removeClass( "ui-state-default" );
	  }
	});
	$( "#edit-event-resources" ).droppable({
	  activeClass: "area-to-drag-resource-element",
	  hoverClass: "ui-state-hover",
	  accept: function(d) { 
			if(d.hasClass("resource-item")){ 
				return true;
			}
		},
	  drop: function( event, ui ) {
		$( this ).find( ".placeholder" ).remove();
		$( "<span id='" + $(ui.draggable).attr("id") + "' class='dragged-resource-item'></span>" ).text( ui.draggable.text() ).append( '<span class="object-item-remove-btn btn-xs glyphicon glyphicon-remove" onclick="removeItem(this)"></span>' ).appendTo( this );
	  }
	}).sortable({
	  items: "li:not(.placeholder)",
	  sort: function() {
		// gets added unintentionally by droppable interacting with sortable
		// using connectWithSortable fixes this, but doesn't allow you to customize active/hoverClass options
		$( this ).removeClass( "ui-state-default" );
	  }
	});
});

function setDraggableEvents() {
	$( "#menu-events-list li" ).draggable({
	  appendTo: "body",
	  helper: "clone",
	  cursor: "move",
	  start: function(e, ui) {
		  $(ui.helper).addClass("dragging-event-item");
		 }
	});
}

$(function() {
	setDraggableEvents();
	$( "#new-event-incompatible-events" )
	.dblclick(function(){
		 console.log( "Hello World!" );
	}).droppable({
	  activeClass: "area-to-drag-event-element",
	  hoverClass: "ui-state-hover ",
	  accept: function(d) { 
			if(d.hasClass("event-item")){ 
				return true;
			}
		},
	  drop: function( event, ui ) {
		$( this ).find( ".placeholder" ).remove();
		$( "<span id='" + $(ui.draggable).attr("id") + "' class='dragged-event-item'></span>" ).text( ui.draggable.text() ).append( "<span class='object-item-remove-btn btn-xs glyphicon glyphicon-remove' onclick='removeItem(this)'></span>" ).appendTo( this );
	  }
	}).sortable({
	  items: "li:not(.placeholder)",
	  sort: function() {
		// gets added unintentionally by droppable interacting with sortable
		// using connectWithSortable fixes this, but doesn't allow you to customize active/hoverClass options
		$( this ).removeClass( "ui-state-default" );
	  }
	});
	$( "#edit-event-incompatible-events" ).droppable({
	  activeClass: "area-to-drag-event-element",
	  hoverClass: "ui-state-hover ",
	  accept: function(d) { 
			if(d.hasClass("event-item")){ 
				return true;
			}
		},
	  drop: function( event, ui ) {
		$( this ).find( ".placeholder" ).remove();
		$( "<span id='" + $(ui.draggable).attr("id") + "' class='dragged-event-item'></span>" ).text( ui.draggable.text() ).append( "<span class='object-item-remove-btn btn-xs glyphicon glyphicon-remove' onclick='removeItem(this)'></span>" ).appendTo( this );
	  }
	}).sortable({
	  items: "li:not(.placeholder)",
	  sort: function() {
		// gets added unintentionally by droppable interacting with sortable
		// using connectWithSortable fixes this, but doesn't allow you to customize active/hoverClass options
		$( this ).removeClass( "ui-state-default" );
	  }
	});
});

function saveEvent() {

	$("#new-event-errors").empty();

	var start = $('#date-time-begin input').val();
	var end = $('#date-time-end input').val();
	var name = $('#event-name').val();

	/* checking validity of stuff*/
	if (start.length == 0) {
		$("#new-event-errors").append("<div class='alert alert-danger alert-dismissable'><button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;</button>Please fill in start date.</div>");
		console.log("Please fill in start date.")
		return;
	}
	
	if (end.length == 0) {
		$("#new-event-errors").append("<div class='alert alert-danger alert-dismissable'><button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;</button>Please fill in end date.</div>");
		console.log("Please fill in end date.")
		return;
	}

	if (new Date(start) > new Date(end)) {
		$("#new-event-errors").append("<div class='alert alert-danger alert-dismissable'><button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;</button>Start date should be before end date.</div>");
		console.log("start date should be before end date.")
		return;
	}

	if (name.length == 0) {
		$("#new-event-errors").append("<div class='alert alert-danger alert-dismissable'><button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;</button>Please add a title to the event.</div>");
		console.log("Please add a title to the event.")
		return;
	}

	newEvent = {
		id: nextEventId++,
		title: name,
		start: new Date(start),
		end: new Date(end),
		allDay: false,
		resources: [],
		incompatibleEvents: []
	}

	// Add resources to the event
	$('#new-event-resources').children('span').each( function(i) {
		id = $(this).attr('id').replace("rsc-","");
		if ($.inArray( id, newEvent.resources ) == -1) {
			newEvent.resources.push(id);
		}
	});
	// Add incompatible events to the event
	$('#new-event-incompatible-events').children('span').each( function(i) {
		id = $(this).attr('id').replace("evt-","");
		if ($.inArray( id, newEvent.incompatibleEvents ) == -1) {
			newEvent.incompatibleEvents.push(id);
		}
	});

	/* clean all fields */
	clearEventFields();

	/* add event to global list */
	eventsList.push(newEvent);

	/* Add to Menu List */
	createEvent(newEvent);

	/* add the event to DOM and hide the modal */
	$('#calendar').fullCalendar('renderEvent', newEvent);
	$('#add-event-modal').modal('hide');

	verifyIncompatibilities();
}

function saveResource() {

	$("#new-resource-errors").empty();

	var description = $('#new-resource-description').val();
	var name = $('#new-resource-name').val();

	console.log("description: " + description);
	console.log("name: " + name);

	/* checking validity of stuff*/
	if (name.length == 0) {
		$("#new-resource-errors").append("<div class='alert alert-danger alert-dismissable'><button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;</button>Please add a name to the resource.</div>");
		console.log("Please add a name to the resource.")
		return;
	}

	newResource = {
		name: name,
		id: nextResourceId++,
		description: description,
	}

	/* clean all fields */
	clearNewResourceFields();

	/* add event to global list */
	resourcesList.push(newResource);

	/* Add to Menu List */
	createResource(newResource);

	/* add the event to DOM and hide the modal */
	$('#add-resource-modal').modal('hide');
}


$('#search-resource').keyup(function(){
	//Remove all before list to avoid append
	
	$('#menu-resources-list ul').empty();

	//Append to menu list
	listResourcesInMenu(this.value);
});

$('#search-event').on({

	keyup: function(){
		$('#menu-events-list ul').empty();
		listEventsInMenu(this.value);
	}
});

function listEventsInMenu(searchWord){
	$('#menu-events-list ul').empty();
	if(!searchWord){
		eventsList.forEach(createEvent);
	}
	else
	{
	eventsList.forEach(function(elem){
			if (elem.title.toLowerCase().indexOf(searchWord.toLowerCase()) > -1) 
			{
				createEvent(elem);
			}
		});
	}	
}

function listResourcesInMenu(searchWord){
	$('#menu-resources-list ul').empty();
	if(!searchWord){
		resourcesList.forEach(createResource);
	}
	else
	{
	resourcesList.forEach(function(elem){
			if (elem.name.toLowerCase().indexOf(searchWord.toLowerCase()) > -1) 
			{
				createResource(elem);
			}
		});
	}	
}
function clearNewResourceFields() {
	$("#new-event-errors").empty();
	$('#new-resource-description').val("");
	$('#new-resource-name').val("");
}

function clearEventFields() {
	$('#new-event-errors').empty();
	$('#event-name').val("");
	$('#date-time-begin input').val("");
	$('#date-time-end input').val("");
	$('#new-event-resources').empty();
	$('#new-event-resources').append('<div class="placeholder">Drop resources here...</div>');
	$('#new-event-incompatible-events').empty();
	$('#new-event-incompatible-events').append('<div class="placeholder">Drop incompatible events here...</div>');
}

function editEvent(ev) {
	edited_event = ev;
	$('#edit-event-title').html(ev.title);
	$('#edit-event-name').val(ev.title);
	$('#edit-event-start').val(ev.start);
	$('#edit-event-end').val(ev.end);
	$('#event-id').val(ev.id);

	$('#edit-event-resources').empty();
	if (ev.resources.length != 0) {
		$.each(ev.resources, function( key, value ) {
			resource = $.grep( resourcesList, function(e){ 
					return e.id == value;
			})[0]
			$('#edit-event-resources').append( 
				'<span id="rsc-' + resource.id + '" class="dragged-resource-item">' + resource.name + 
				'<span class="object-item-remove-btn btn-xs glyphicon glyphicon-remove" onclick="removeItem(this)"></span></span>' );
		});
	}
	else
	{
		$('#edit-event-resources').append('<div class="placeholder">Drop resources here...</div>');
	}

	$('#edit-event-incompatible-events').empty();
	if (ev.incompatibleEvents.length != 0) {
		$.each(ev.incompatibleEvents, function( key, value ) {
			incompatibleEvent = $.grep( eventsList, function(e){ 
					return e.id == value;
			})[0]
			$('#edit-event-incompatible-events').append( 
				'<span id="evt-' + incompatibleEvent.id + '" class="dragged-event-item">' + incompatibleEvent.title + 
				'<span class="object-item-remove-btn btn-xs glyphicon glyphicon-remove" onclick="removeItem(this)"></span></span>' );
		});
	}
	else 
	{
		$('#edit-event-incompatible-events').append('<div class="placeholder">Drop incompatible events here...</div>');
	}

	$("#edit-event-errors").empty();

	$('#add-resource-modal').modal('hide');
	$('#add-event-modal').modal('hide');
	$('#edit-resource-modal').modal('hide');
	$('#edit-event-modal').modal('show');
}

function editResource(ev) {
	console.log(ev);
	edited_resource = ev;
	$('#edit-resource-name').val(ev.name);
	$('#edit-resource-description').val(ev.description);
	$('#resource-id').val(ev.id);

	$('#add-resource-modal').modal('hide');
	$('#add-event-modal').modal('hide');
	$('#edit-event-modal').modal('hide');
	$('#edit-resource-modal').modal('show');
}

function saveEditedResource() {

	$("#edit-resource-errors").empty();

	var description = $('#edit-resource-description').val();
	var name = $('#edit-resource-name').val();
	console.log(name);
	/* checking validity of stuff*/
	if (name.length == 0) {
		$("#edit-resources-errors").append("<div class='alert alert-danger alert-dismissable'><button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;</button>Please add a name to the resource.</div>");
		console.log("error, no name")
		return;
	}
	/* save in global array */
	var aux = $.grep(resourcesList, function(e){ 
			return e.id == edited_resource.id;
		})[0];

	aux.name = name;
	aux.description = description;

	/* clean all fields */
	clearEditedResourceFields();

	/* add the event and hide the modal */
	$('#edit-resource-modal').modal('hide');
	listResourcesInMenu();
}

//TODO DO THIS
function clearEditedResourceFields(){
	$('#edit-event-incompatible-events').empty();
	$('#edit-event-resources').empty();
	$('#new-event-resources').empty();
	$('#new-event-incompatible-events').empty();
}

function saveEditedEvent() {

	$("#edit-event-errors").empty();

	var start = $('#edit-time-begin input').val();
	var end = $('#edit-time-end input').val();
	var name = $('#edit-event-name').val();

	/* checking validity of stuff*/
	if (start.length == 0) {
		$("#edit-event-errors").append("<div class='alert alert-danger alert-dismissable'><button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;</button>Please fill in start date.</div>");
		console.log("Please fill in start date.")
		return;
	}
	
	if (end.length == 0) {
		$("#edit-event-errors").append("<div class='alert alert-danger alert-dismissable'><button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;</button>Please fill in end date.</div>");
		console.log("Please fill in end date.")
		return;
	}

	if (new Date(start) > new Date(end)) {
		$("#edit-event-errors").append("<div class='alert alert-danger alert-dismissable'><button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;</button>Start date should be before end date.</div>");
		console.log("start date should be before end date.")
		return;
	}
	if (name.length == 0) {
		$("#edit-event-errors").append("<div class='alert alert-danger alert-dismissable'><button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;</button>Please add a title to the event.</div>");
		console.log("Please add a title to the event.")
		return;
	}

	edited_event.title = name;
	edited_event.start = new Date(start);
	edited_event.end = new Date(end);
	edited_event.resources = [];
	edited_event.incompatibleEvents = [];

	// Modifies resources in the event
	$('#edit-event-resources').children('span').each( function(i) {
		id = $(this).attr('id').replace("rsc-","");
		if ($.inArray( id, edited_event.resources ) == -1) {
			edited_event.resources.push(id);
		}
	});
	// Modifies incompatible events in the event
	$('#edit-event-incompatible-events').children('span').each( function(i) {
		id = $(this).attr('id').replace("evt-","");
		if ($.inArray( id, edited_event.incompatibleEvents ) == -1) {
			edited_event.incompatibleEvents.push(id);
		}
	});

	/* clean all fields */
	clearEventFields();

	/* add the event and hide the modal */
	$('#calendar').fullCalendar('updateEvent', edited_event);

	listEventsInMenu();
	$('#edit-event-modal').modal('hide');
	verifyIncompatibilities();
}

/* Double click Edit Stuff  */
$("#menu-resources-list").on("dblclick","li",function(){
	var li = this;
	
	editResource(
		$.grep(
			resourcesList, function(e){ 
				return e.id == li.id.replace("rsc-","");
		})[0]
	)}
);

$("#menu-events-list").on("dblclick","li", function(){
	var li = this;
	
	editEvent(
		$.grep(eventsList, function(e){ 
			return e.id == li.id.replace("evt-","");
		})[0]

	)
});

function removeItem(elem) {
	var item = $(elem).parent();
	var itemArea = $(item).parent();
	item.remove();
	if ( $(itemArea).children().length == 0 ) {
		if ( $(itemArea).attr('id') == 'new-event-resources' || $(itemArea).attr('id') == 'edit-event-resources' ) {
			itemArea.append('<div class="placeholder">Drop resources here...</div>');
		}
		else
		{
			itemArea.append('<div class="placeholder">Drop incompatible events here...</div>');
		}
	}
}

$(function() {
	$(".panel-heading a[title]").tooltips();
});

function verifyIncompatibilities() {

	console.log("starting to verify incompatibilities");
	var notified = false;

	// to loop sequencially, not using enumeration (enumeration doesn't guarantee order)
	for (var i = 0; i < (eventsList.length - 1) ; i++) {
		//console.log(eventsList[i]);
		var e1 = eventsList[i];

		for (var j = i+1; j < eventsList.length ; j++) {
			var e2 = eventsList[j];
			
			if (!(e1.end <= e2.start || e1.start >= e2.end)) {
				// estao sobrepostos
				// testar recursos
				console.log(e1.title + " is overlaped with " + e2.title);
				$.each(e1.resources, function(key,value) {
					if ($.inArray( value, e2.resources ) > -1 && !notified) {
						// eventos incompativeis!!!
						addIncompatibleNotification(e1.title + " and " + e2.title + " cannot occur simultaneously due to resources limitation.");
						notified = true;
					};
				});

				// testar eventos incomp.
				$.each(e1.incompatibleEvents, function(key,value) {
					if ($.inArray( value, e2.incompatibleEvents ) > -1 && !notified) {
						// eventos incompativeis!!!
						addIncompatibleNotification(e1.title + " and " + e2.title + " cannot occur simultaneously due to being incompatible.");
						notified = true;
					};
				});
			};
		};
	};
};

function addIncompatibleNotification(text) {
	$('#events-overlayed').empty()
	$('#events-overlayed').append("<div class='alert alert-danger alert-dismissable'><button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;</button>" + text + "</div>");
}
