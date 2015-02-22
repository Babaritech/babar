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

	loadClass('entry');
	loadClass('customer');
	loadClass('token');

	/* Load SQL Views */

	/* <controller> */

	Token::purge();

	/* <functions> */

	function listEntries()
	{
		return Entry::searchForAll();
	}

	function infoEntry($id)
	{
		if(is_null($id))
			Functions::setResponse(400);

		try 
		{
			return new Entry($id);
		} 
		catch (RuntimeException $e)
		{
			Functions::setResponse(404);
		}
	}

	function addEntry()
	{
		$data = Functions::getJSONData();
		$c = new Entry();
		foreach($c->getFields() as $field)
		{
			$value = Functions::elt($data, $field['name']); 

			if (is_null($value))
			{
				echo $field['name'];
				Functions::setResponse(400);
			}

			$c->set($field['name'], $value);
		}

		$c->save();

		return $c;	
	}

	function updateEntry($id)
	{
		if(is_null($id))
			Functions::setResponse(400);

		$data = Functions::getJSONData();

		try
		{
			$c = new Entry($id);

			foreach($c->getFields() as $field)
			{
				$value = Functions::elt($data, $field['name']);

				if(is_null($value))
					Functions::setResponse(400);

				$c->set($field['name'], $value);
			}

			$c->set('id', $id);
			$c->save();

			return true;
		}
		catch (RuntimeException $e)
		{
			Functions::setResponse(404);
		}	
	}

	function deleteEntry($id)
	{
		if(is_null($id))
			Functions::setResponse(400);

		try 
		{
			$c = new Entry($id);
			$c->delete();

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

			return Entry::search($whereClause, $params);
		}
		catch (RuntimeException $e)
		{
			if(!isset($c))
				Functions::setResponse(404);

		}
	}

	function infoFields()
	{
		$c = new Entry();
		return $c->getFields();
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
		$data = addEntry();
		break;

	case 'update':
		$data = updateEntry(Functions::get('id'));
		break;

	case 'info':
		$data = infoEntry(Functions::get('id'));
		break;
	
	case 'delete':
		$data = deleteEntry(Functions::get('id'));
		break;

	case 'customer_history':
		$data = getCustomerHistory(Functions::get('id'));
		break;

	case 'list':
		$data = listEntries();
		break;

	default:
		Functions::setResponse(400);
	}

	/* </controller> */
	
	loadview('json', $data);
?>
