<?php

    require_once('init.php');	// Init Framework
    
    
    /* Init constants */
    
    define('INDEX', true);
    define('MODEL', 'models/');	// Path to models
    define('VIEW', 'views/');	// Path to views
    
    
    /* Load utils */
    
    loadClass('functions');
	loadClass('db');

	/* Load models */

	loadClass('customer');

	/* Load SQL Views */

	/* <controller> */

	/* <functions> */

	function listCustomer($id)
	{
		if(!is_null($id))
			return new Customer($id);
		else
			return Customer::searchForAll();
	}

	/* </functions> */	

	$action = Functions::get('action');

	switch($action)
	{

	case 'list':
	default:

		$data = listCustomer(Functions::get('id'));

		break;
	}

	/* </controller> */
	
	loadview('json', $data);
?>
