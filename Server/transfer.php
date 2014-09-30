<?php

	mysql_connect('localhost', 'root', 'b4rm1sql');
	mysql_select_db('babar');

	$customers = mysql_query('SELECT * FROM customers WHERE 1');
	$drinks = mysql_query('SELECT * FROM drinks WHERE 1');
	$entries = mysql_query('SELECT * FROM entries WHERE 1');
	$sells = mysql_query('SELECT * FROM sells WHERE 1');
	$status = mysql_query('SELECT * FROM status WHERE 1');

	echo '<pre>';

	while($customer = mysql_fetch_array($customers))
	{
		print_r($customer);
	}
