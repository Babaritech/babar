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

	loadClass('totalentries');
	loadClass('totalsells');
	loadClass('balance');

	/* <controller> */

	/* <functions> */

	function testUniqueness($nickname, $email)
	{
		
		$whereClause = 'nickname=:nickname OR email=:email';
		$params = array(
						array('id' => ':nickname', 'value' => $nickname),
						array('id' => ':email', 'value' => $email)
					);

		$test = Customer::search($whereClause, $params);

		return count($test)==0;
	}

	/* </functions> */

	/* <Actions> */

	function listCustomers()
	{
		$customerList = Customer::searchForAll();
		$retList = array();

		foreach($customerList as $customer)
		{
			$retList[] = array(
								'id' => $customer->get('id'),
								'firstname' => $customer->get('firstname'),
								'lastname' => $customer->get('lastname'),
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

	function addCustomer()
	{
		$data = Functions::getJSONData();
		$c = new Customer();

		foreach($c->getFields() as $field)
		{
			$value = Functions::elt($data, $field['name']); 

			if (is_null($value))
				Functions::setResponse(400);

			$c->set($field['name'], $value);
		}

	
		if(!testUniqueness($c->get('nickname'), $c->get('email')))
			Functions::setResponse(409);

		$c->save();

		return $c;	
	}

	function updateCustomer($id)
	{
		if(is_null($id))
			Functions::setResponse(400);

		$data = Functions::getJSONData();

		try
		{
			$c = new Customer($id);

			foreach($c->getFields() as $field)
			{
				$value = Functions::elt($data, $field['name']);

				if(is_null($value))
					Functions::setResponse(400);

				$c->set($field['name'], $value);
			}

			$c->set('id', $id);
			if(!testUniqueness($c->get('nickname'), $c->get('email')))
				Functions::setResponse(409);
			
			$c->save();

			return true;
		}
		catch (RuntimeException $e)
		{
			Functions::setResponse(404);
		}	
	}

	function deleteCustomer($id)
	{
		if(is_null($id))
			Functions::setResponse(400);

		try 
		{
			$c = new Customer($id);
			$c->delete();

			return true;
		} 
		catch (RuntimeException $e)
		{
			Functions::setResponse(404);
		}

	}

	function getTotalEntries($id)
	{
		if(is_null($id))
			Functions::setResponse(400);

		try
		{
			$c = new Customer($id);
			$te = new TotalEntries($id);

			return $te;
		}
		catch (RuntimeException $e)
		{
			if(!isset($c)) Functions::setResponse(404);
			else return array('customer_id' => $id, 'total' => 0);
		}
	}

	function getTotalSells($id)
	{
		if(is_null($id))
			Functions::setResponse(400);

		try
		{
			$c = new Customer($id);
			$ts = new TotalSells($id);

			return $ts;
		}
		catch (RuntimeException $e)
		{
			if(!isset($c)) Functions::setResponse(404);
			else return array('customer_id' => $id, 'total' => 0);
		}
	}

	function getBalance($id)
	{
		if(is_null($id))
			Functions::setResponse(400);

		try
		{
			$c = new Customer($id);
			$b = new Balance($id);

			return $b;
		}
		catch (RuntimeException $e)
		{
			if(!isset($c)) Functions::setResponse(404);
			else return array('customer_id' => $id, 'balance' => 0);
		}
	}
	
	function infoFields()
	{
		$c = new Customer();
		return $c->getFields();
	}

	/* </functions> */	

	$action = Functions::get('action');

	switch($action)
	{

	case 'fields_info':
		$data = infoFields();
		break;

	case 'new':
		$data = addCustomer();
		break;

	case 'update':
		$data = updateCustomer(Functions::get('id'));
		break;

	case 'info':
		$data = infoCustomer(Functions::get('id'));
		break;
	
	case 'delete':
		$data = deleteCustomer(Functions::get('id'));
		break;

	case 'total_entries':
		$data = getTotalEntries(Functions::get('id'));
		break;

	case 'total_sells':
		$data = getTotalSells(Functions::get('id'));
		break;

	case 'balance':
		$data = getBalance(Functions::get('id'));
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
