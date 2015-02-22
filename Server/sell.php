<?php

	/* Init constants */

	define('INDEX', true);
	define('MODEL', 'models/');	// Path to models
	define('VIEW', 'views/');	// Path to views
	require_once('init.php');

	/* Load utils */

	loadClass('functions');
	loadClass('db');

	/* Load models */

	loadClass('sell');
	loadClass('customer');
	loadClass('status');
	loadClass('token');

	/* Load SQL Views */

	loadClass('balance');	

	/* <controller> */

	Token::purge();

	/* <functions> */

	function listSells()
	{
		$sellList = Sell::searchForAll();
		$retList = array();

		return $sellList;
	}

	function infoSell($id)
	{
		if(is_null($id))
			Functions::setResponse(400);

		try 
		{
			return new Sell($id);
		} 
		catch (RuntimeException $e)
		{
			Functions::setResponse(404);
		}
	}

	function addSell()
	{
		$data = Functions::getJSONData();
		$s = new Sell();

		foreach($s->getFields() as $field)
		{
			$value = Functions::elt($data, $field['name']); 

			if (is_null($value))
				Functions::setResponse(400);

			$s->set($field['name'], $value);
		}

		$c = new Customer($s->get('customerId'));
		$st = new Status($c->get('statusId'));
		$overdraft = $st->get('overdraft');
		$b = new Balance($c->get('id'));
		$balance = $b->get('balance');

		if($balance < $overdraft)
		{
			echo 'Balance for this customer is less than his/her overdraft';
			Functions::setResponse(400);
		}

		$s->save();

		return $s;	
	}

	function addSellNegative()
	{
		$data = Functions::getJSONData();
		$s = new Sell();

		foreach($s->getFields() as $field)
		{
			$value = Functions::elt($data, $field['name']); 

			if (is_null($value))
				Functions::setResponse(400);

			$s->set($field['name'], $value);
		}

		$s->save();

		return $s;	
	}

	function updateSell($id)
	{
		if(is_null($id))
			Functions::setResponse(400);

		$data = Functions::getJSONData();

		try
		{
			$s = new Sell($id);

			foreach($s->getFields() as $field)
			{
				$value = Functions::elt($data, $field['name']);

				if(is_null($value))
					Functions::setResponse(400);

				$s->set($field['name'], $value);
			}

			$s->set('id', $id);
			$s->save();

			return true;
		}
		catch (RuntimeException $e)
		{
			Functions::setResponse(404);
		}	
	}

	function deleteSell($id)
	{
		if(is_null($id))
			Functions::setResponse(400);

		try 
		{
			$s = new Sell($id);
			$s->delete();

			return true;
		} 
		catch (RuntimeException $e)
		{
			Functions::setResponse(404);
		}

	}

	function getCustomerHistory($id)
	{
		if(is_null($id))
			Functions::setResponse(400);

		try
		{
			$c = new Customer($id);
			$whereClause = 'customer_id = :cid';
			$params = array( array('id' => ':cid', 'value' => $id, 'type' => PDO::PARAM_INT) );

			return Sell::search($whereClause, $params);
		}
		catch (RuntimeException $e)
		{
			if(!isset($c))
				Functions::setResponse(404);

		}
	}

	function infoFields()
	{
		$s = new Sell();
		return $s->getFields();
	}

	/* </functions> */	

	$action = Functions::get('action');
	Functions::checkRights(__FILE__, $action, Functions::get('token'));

	switch($action)
	{

	case 'fields_info':
		$data = infoFields();
		break;

	case 'new':
		$data = addSell();
		break;

	case 'new-negative':
		$data = addSellNegative();
		break;

	case 'update':
		$data = updateSell(Functions::get('id'));
		break;

	case 'info':
		$data = infoSell(Functions::get('id'));
		break;

	case 'delete':
		$data = deleteSell(Functions::get('id'));
		break;

	case 'list':
		$data = listSells();
		break;

	case 'customer_history':
		$data = getCustomerHistory(Functions::get('id'));
		break;

	default:
		Functions::setResponse(400);
	}

	/* </controller> */

	loadview('json', $data);
?>
