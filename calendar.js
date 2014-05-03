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
    $( "#catalog li" ).draggable({
      appendTo: "body",
      helper: "clone"
    });
    $( "#cart ol" ).droppable({
      activeClass: "ui-state-default",
      hoverClass: "ui-state-hover",
      accept: ":not(.ui-sortable-helper)",
      drop: function( event, ui ) {
        $( this ).find( ".placeholder" ).remove();
        $( "<li></li>" ).text( ui.draggable.text() ).appendTo( this );
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
      