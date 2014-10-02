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

	loadClass('status');

	/* Load SQL Views */

	/* <controller> */

	/* <functions> */

	function listStatuses()
	{
		$statusList = Status::searchForAll();
		$retList = array();

		return $statusList;
	}

	function infoStatus($id)
	{
		if(is_null($id))
			Functions::setResponse(400);

		try 
		{
			return new Status($id);
		} 
		catch (RuntimeException $e)
		{
			Functions::setResponse(404);
		}
	}

	function addStatus()
	{
		$data = Functions::getJSONData();
		$s = new Status();

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

	function updateStatus($id)
	{
		if(is_null($id))
			Functions::setResponse(400);

		$data = Functions::getJSONData();

		try
		{
			$s = new Status($id);

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

	function deleteStatus($id)
	{
		if(is_null($id))
			Functions::setResponse(400);

		try 
		{
			$s = new Status($id);
			$s->delete();

			return true;
		} 
		catch (RuntimeException $e)
		{
			Functions::setResponse(404);
		}

	}

	function infoFields()
	{
		$s = new Status();
		return $s->getFields();
	}

	/* </functions> */	

	$action = Functions::get('action');

	switch($action)
	{

	case 'fields_info':
		$data = infoFields();
		break;

	case 'new':
		$data = addStatus();
		break;

	case 'update':
		$data = updateStatus(Functions::get('id'));
		break;

	case 'info':
		$data = infoStatus(Functions::get('id'));
		break;
	
	case 'delete':
		$data = deleteStatus(Functions::get('id'));
		break;

	case 'list':
		$data = listStatuses();
		break;

	default:
		Functions::setResponse(400);
	}

	/* </controller> */
	
	loadview('json', $data);
?>
