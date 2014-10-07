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

	loadClass('right');
	loadClass('token');

	/* Load SQL Views */

	/* <controller> */

	Token::purge();

	/* <functions> */

	function listRights()
	{
		$rightList = Right::searchForAll();
		$retList = array();

		return $rightList;
	}

	function infoRight($id)
	{
		if(is_null($id))
			Functions::setResponse(400);

		try 
		{
			return new Right($id);
		} 
		catch (RuntimeException $e)
		{
			Functions::setResponse(404);
		}
	}

	function addRight()
	{
		$data = Functions::getJSONData();
		$s = new Right();

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

	function updateRight($id)
	{
		if(is_null($id))
			Functions::setResponse(400);

		$data = Functions::getJSONData();

		try
		{
			$s = new Right($id);

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

	function deleteRight($id)
	{
		if(is_null($id))
			Functions::setResponse(400);

		try 
		{
			$s = new Right($id);
			$s->delete();

			return true;
		} 
		catch (RuntimeException $e)
		{
			Functions::setResponse(404);
		}

	}

	function searchRight($actionId, $statusId)
	{
		if(is_null($actionId) || is_null($statusId))
			Functions::setResponse(400);

		$whereClause = 'action_id=:action_id AND status_id=:status_id';
		$params = array(
						array('id'=>':action_id', 'value'=>$actionId),
						array('id'=>':status_id', 'value'=>$statusId),
					);

		$result = Right::search($whereClause, $params);

		if(!count($result))
			Functions::setResponse(404);

		return $result[0];
	}

	function infoFields()
	{
		$s = new Right();
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
		$data = addRight();
		break;

	case 'update':
		$data = updateRight(Functions::get('id'));
		break;

	case 'info':
		$data = infoRight(Functions::get('id'));
		break;
	
	case 'delete':
		$data = deleteRight(Functions::get('id'));
		break;

	case 'search':
		$data = searchRight(Functions::get('actionId'), Functions::get('statusId'));
		break;

	case 'list':
		$data = listRights();
		break;

	default:
		Functions::setResponse(400);
	}

	/* </controller> */
	
	loadview('json', $data);
?>
