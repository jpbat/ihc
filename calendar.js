$(document).ready(function() {

	// page is now ready, initialize the calendar...

	var date = new Date();
	var d = date.getDate();
	var m = date.getMonth();
	var y = date.getFullYear();

	$('#calendar').fullCalendar({
		// put your options and callbacks here

		theme: true,
		aspectRatio: 1.8,
		editable: true,
		events: [
			{
				title: 'All Day Event',
				start: new Date(y, m, 1)
			},
			{
				title: 'Long Event',
				start: new Date(y, m, d-5),
				end: new Date(y, m, d-2)
			},
			{
				id: 5,
				title: 'Repeating Event',
				start: new Date(y, m, d-3, 16, 0),
				allDay: false
			},
			{
				id: 999,
				title: 'Repeating Event',
				start: new Date(y, m, d+4, 16, 0),
				allDay: false
			},
			{
				title: 'Meeting',
				start: new Date(y, m, d, 10, 30),
				allDay: false
			},
			{
				title: 'Lunch',
				start: new Date(y, m, d, 12, 0),
				end: new Date(y, m, d, 14, 0),
				allDay: false
			},
			{
				title: 'Birthday Party',
				start: new Date(y, m, d+1, 19, 0),
				end: new Date(y, m, d+1, 22, 30),
				allDay: false
			},
			{
				title: 'Click for Google',
				start: new Date(y, m, 28),
				end: new Date(y, m, 29),
				url: 'http://google.com/'
			}
		]
	})

	$('#calendar').fullCalendar('changeView', 'agendaWeek' );

	$('.toggle-menu').jPushMenu();

});

function addResource(name) {
	$('<a/>', {
		text: name
	}).appendTo('#right-menu');
}

function addEvent(name) {
	$('#add-event-modal').modal('show');
	// $('<a/>', {
	// 	text: name
	// }).appendTo('#left-menu');
}

function addResource(name) {
	$('#add-resource-modal').modal('show');
	// $('<a/>', {
	// 	text: name
	// }).appendTo('#left-menu');
}

$(function () {
	$('#date-time-begin').datetimepicker();
	$('#date-time-end').datetimepicker();
});

$(function() {
    $( "#resources-list a" ).draggable({
      appendTo: "body",
      helper: "clone"
    });
    $( "#new-event-resources" ).droppable({
      activeClass: "ui-state-default",
      hoverClass: "ui-state-hover",
      accept: ":not(.ui-sortable-helper)",
      drop: function( event, ui ) {
        $( this ).find( ".placeholder" ).remove();
        $( "<a></a>" ).text( ui.draggable.text() ).appendTo( this );
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

	if (start > end) {
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
	$('#date-time-begin input').val("");
	$('#date-time-end input').val("");
	$('#event-name').val("");

	/* add the event and hide the modal */
	$('#calendar').fullCalendar('renderEvent', newEvent);
	$('#add-event-modal').modal('hide');
}
