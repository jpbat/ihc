$(document).ready(function() {

    // page is now ready, initialize the calendar...

    $('#calendar').fullCalendar({
        // put your options and callbacks here
        theme: true,
        aspectRatio: 1.8
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
	$('<a/>', {
		text: name
	}).appendTo('#left-menu');
}