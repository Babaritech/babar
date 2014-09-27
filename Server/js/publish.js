var regUrl = /(?:(?:ht|f)tp(?:s?)\:\/\/|~\/|\/)?(?:\w+:\w+@)?(?:(?:[-\w]+\.)+(?:com|org|net|gov|mil|biz|info|mobi|name|aero|jobs|museum|travel|[a-z]{2}))(?::[\d]{1,5})?(?:(?:(?:\/(?:[-\w~!$+|.,=]|%[a-f\d]{2})+)+|\/)+|\?|#)?(?:(?:\?(?:[-\w~!$+|.,*:]|%[a-f\d{2}])+=?(?:[-\w~!$+|.,*:=]|%[a-f\d]{2})*)(?:&(?:[-\w~!$+|.,*:]|%[a-f\d{2}])+=?(?:[-\w~!$+|.,*:=]|%[a-f\d]{2})*)*)*(?:#(?:[-\w~!$+|.,*:=]|%[a-f\d]{2})*)?/i;

function resetSelect(selectElement)
{
    selectElement.selectedIndex=0;
}

function insertBBCode()
{
    var ta = document.getElementById('content_area');
    var	nb = arguments.length, sStart = ta.selectionStart, sEnd = ta.selectionEnd;
    var noSelection = (sStart == sEnd);
    
    var before = ta.value.substring(0, sStart);
    var selection = (noSelection) ? '' : ta.value.substring(sStart, sEnd);
    var after = ta.value.substring(sEnd);
    
    var value, cur;
    
    if(!nb) return;
    
    if(nb==1)
    {
	value = before + arguments[0] + after;
	cur = (before + arguments[0]).length;
    }
    
    if(nb==2)
    {
	value = before + arguments[0] + selection + arguments[1] + after;
	if(!noSelection)
	    cur = (before + arguments[0] + selection + arguments[1]).length;
	else
	    cur = (before + arguments[0]).length;
    }
    
    if(nb==3)
    {
	var arg0 = '', arg1 = '', reg = arguments[2], test = reg.test(selection);
	arg0 = test ? selection : prompt('Argument (URL...)'); if(arg0==null) arg0='';
	arg1 = (!test && selection.length) ? selection : prompt('Texte à afficher', (selection.length) ? selection : arg0); if(arg1==null) arg1='';
	
	var insert = arguments[0].replace('?', arg0) + arg1 + arguments[1];
	value = before+insert+after;
	cur = (before+insert).length;
    }
    
    ta.value = value;
    ta.setSelectionRange(cur, cur);
    ta.focus()
    return;	
}