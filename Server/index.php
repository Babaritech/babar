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
	loadClass('manager');

	/* Load SQL Views */

	loadClass('balance');

	$allBalances = Balance::searchForAll();

	foreach($allBalances as $b)
	{
		$customerId = $b->get('customerId');
		$balance = (float) $b->get('balance');

		try
	   	{
			$customer = new Customer($customerId);
			$customerName = ucfirst($customer->get('surname')).' '.strtoupper($customer->get('name'));
		}
		catch(RuntimeException $e) { }
	
		echo $customerName.' => '.$balance.'<br />';
	}
?>
