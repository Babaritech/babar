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

	loadClass('drink');
	loadClass('customer');
	loadClass('token');

	/* Load SQL Views */

	/* <controller> */

	Token::purge();

	/* <functions> */

	function listDrinks()
	{
		return Drink::searchForAll();
	}

	function infoDrink($id)
	{
		if(is_null($id))
			Functions::setResponse(400);

		try 
		{
			return new Drink($id);
		} 
		catch (RuntimeException $e)
		{
			Functions::setResponse(404);
		}
	}

	function addDrink()
	{
		$data = Functions::getJSONData();
		$c = new Drink();

		foreach($c->getFields() as $field)
		{
			$value = Functions::elt($data, $field['name']); 

			if (is_null($value))
				Functions::setResponse(400);

			$c->set($field['name'], $value);
		}

		$c->save();

		return $c;	
	}

	function updateDrink($id)
	{
		if(is_null($id))
			Functions::setResponse(400);

		$data = Functions::getJSONData();

		try
		{
			$c = new Drink($id);

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

	function deleteDrink($id)
	{
		if(is_null($id))
			Functions::setResponse(400);

		try 
		{
			$c = new Drink($id);
			$c->delete();

			return true;
		} 
		catch (RuntimeException $e)
		{
			Functions::setResponse(404);
		}

	}

	function infoFields()
	{
		$c = new Drink();
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
		$data = addDrink();
		break;

	case 'update':
		$data = updateDrink(Functions::get('id'));
		break;

	case 'info':
		$data = infoDrink(Functions::get('id'));
		break;
	
	case 'delete':
		$data = deleteDrink(Functions::get('id'));
		break;

	case 'customer_history':
		$data = getCustomerHistory(Functions::get('id'));
		break;

	case 'list':
		$data = listDrinks();
		break;

	default:
		Functions::setResponse(400);
	}

	/* </controller> */
	
	loadview('json', $data);
?>
