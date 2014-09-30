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

	function listCustomers()
	{
		$customerList = Customer::searchForAll();
		$retList = array();

		foreach($customerList as $customer)
		{
			$retList[] = array(
								'customerId' => $customer->get('customerId'),
								'surname' => $customer->get('surname'),
								'name' => $customer->get('name'),
								'nickname' => $customer->get('nickname'),
							);
		}

		return $retList;
	}

	function infoCustomer($id)
	{
		if(is_null($id))
			Functions::setResponse(400);

		try 
		{
			return new Customer($id);
		} 
		catch (RuntimeException $e)
		{
			Functions::setResponse(404);
		}
	}

	/* </functions> */	

	$action = Functions::get('action');

	switch($action)
	{

	case 'info':
		$data = infoCustomer(Functions::get('id'));
		break;

	case 'list':

		$data = listCustomers();
		break;

	default:
		Functions::setResponse(400);
	}

	/* </controller> */
	
	loadview('json', $data);
?>
