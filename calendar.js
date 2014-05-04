var eventsList = [];
var resourcesList = [];

$(document).ready(function() {

	// page is now ready, initialize the calendar...

	var date = new Date();
	var d = date.getDate();
	var m = date.getMonth();
	var y = date.getFullYear();

	eventsList = [
			{
				id: nextEventId++,
				title: 'All Day Event',
				start: new Date(y, m, 1),
				end: new Date(y, m, 2)
			},
			{
				id: nextEventId++,
				title: 'Long Event',
				start: new Date(y, m, d-5),
				end: new Date(y, m, d-2)
			},
			{
				id: nextEventId++,
				title: 'Repeating Event',
				start: new Date(y, m, d-3, 16, 0),
				end: new Date(y, m, d, 0),
				allDay: false
			},
			{
				id: nextEventId++,
				title: 'Repeating Event',
				start: new Date(y, m, d+4, 16, 0),
				end: new Date(y, m, d+4,20,0),
				allDay: false
			},
			{
				id: nextEventId++,
				title: 'Meeting',
				start: new Date(y, m, d, 10, 30),
				allDay: false
			},
			{
				id: nextEventId++,
				title: 'Lunch',
				start: new Date(y, m, d, 12, 0),
				end: new Date(y, m, d, 14, 0),
				allDay: false
			},
			{
				id: nextEventId++,
				title: 'Birthday Party',
				start: new Date(y, m, d+1, 19, 0),
				end: new Date(y, m, d+1, 22, 30),
				allDay: false
			},
			{
				id: nextEventId++,
				title: 'Click for Google',
				start: new Date(y, m, 28),
				end: new Date(y, m, 29),
				url: 'http://google.com/'
			}
		];
	resourcesList = [
		{ 
			id: nextResourceId++,
			name:"Licinio Roque"
		},
		{
			id: nextResourceId++,
			name: "Sala G.5.2" 
		}];
	
	$('#calendar').fullCalendar({
		// put your options and callbacks here

		theme: true,
		aspectRatio: 1.1,
		editable: true,
		events: eventsList, //add events to Calendar
		eventClick: function(event) {
			editEvent(event);
		}
	})

	$('#calendar').fullCalendar('changeView', 'agendaWeek' );

	resourcesList.forEach(createResource);
	//eventsList.forEach(createEvent)
	listEventsInMenu();

});

function createEvent(elem) {
	$("<li id=evt-'" + elem.id + "' class='event-item ui-draggable'>")
		.text(elem.title).appendTo('#menu-events-list ul');
}

function createResource(elem) {
	$("<li id=rsc-'" + elem.id + "' class='resource-item ui-draggable'>")
		.text(elem.name).appendTo('#menu-resources-list ul');
}

function addEvent(name) {
	$('#add-event-modal').modal('show');
	$('#add-resource-modal').modal('hide');
	// $('<a/>', {
	// 	text: name
	// }).appendTo('#left-menu');
}

function addResource(name) {
	$('#add-resource-modal').modal('show');
	$('#add-event-modal').modal('hide');
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
$(function() {
    $( "#menu-resources-list li" ).draggable({
      appendTo: "body",
      helper: "clone",
      cursor: "move",
      start: function(e, ui) {
		  $(ui.helper).addClass("draggable-resource-item");
		 }
    });
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
        $( "<span class='draggable-resource-item'></span>" ).text( ui.draggable.text() ).append( "<span class='object-item-remove-btn btn-xs glyphicon glyphicon-remove'></span>" ).appendTo( this );
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

$(function() {
    $( "#menu-events-list li" ).draggable({
      appendTo: "body",
      helper: "clone",
      cursor: "move",
      start: function(e, ui) {
		  $(ui.helper).addClass("draggable-event-item");
		 }
    });
    $( "#new-event-incompatible-events" ).droppable({
      activeClass: "area-to-drag-event-element",
      hoverClass: "ui-state-hover ",
      accept: function(d) { 
	        if(d.hasClass("event-item")){ 
	            return true;
	        }
    	},
      drop: function( event, ui ) {
        $( this ).find( ".placeholder" ).remove();
        $( "<span class='draggable-event-item'></span>" ).text( ui.draggable.text() ).append( "<span class='object-item-remove-btn btn-xs glyphicon glyphicon-remove'></span>" ).appendTo( this );
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

	console.log("start: " + start);
	console.log("end: " + end);
	console.log("name: " + name);

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
		allDay: false
	}

	/* clean all fields */
	clearFields();

	/* add event to global list */
	eventsList.push(newEvent);

	/* Add to Menu List */
	createEvent(newEvent);

	/* add the event to DOM and hide the modal */
	$('#calendar').fullCalendar('renderEvent', newEvent);
	$('#add-event-modal').modal('hide');
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

function clearFields() {
	$("#new-event-errors").empty();
	$('#date-time-begin input').val("");
	$('#date-time-end input').val("");
	$('#event-name').val("");
}

function editEvent(ev) {
	console.log(ev);
	edited = ev;
	$('#edit-event-title').html(ev.title);
	$('#edit-event-start').val(ev.start);
	$('#edit-event-end').val(ev.end);
	$('#event-id').val(ev.id);
	$('#edit-event-modal').modal('show');
}

function saveEditedEvent() {

	$("#edit-event-errors").empty();

	var start = $('#edit-time-begin input').val();
	var end = $('#edit-time-end input').val();

	console.log("start: " + start);
	console.log("end: " + end);

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

	edited.start = new Date(start);
	edited.end = new Date(end);

	/* clean all fields */
	clearFields();

	/* add the event and hide the modal */
	$('#calendar').fullCalendar('updateEvent', edited);
	$('#edit-event-modal').modal('hide');
}
