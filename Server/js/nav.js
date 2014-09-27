$(document).ready(function() {
   
    $("#menu ul > li").hover(function() {
	$('ul', this).slideToggle();
    }, function() {
	$('ul', this).fadeOut();
    });
   
});