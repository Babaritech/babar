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

	loadClass('action');
	loadClass('status');
	loadClass('right');

	/* Load SQL Views */

	/* <controller> */

	ob_start();
	system('./find_actions.sh');
	$content = ob_get_clean();

	$actions = explode("\n", $content);
	array_pop($actions);

	$oldActions = Action::searchForAll();
	$oldActionNames = array();

	foreach($oldActions as $oldAction)
	{
		$name = $oldAction->get('name');

		if(!in_array($name, $actions))
		{
			$oldAction->delete();
			echo "Deleting $name<br />\n";
		}
		else
			$oldActionNames[] = $name;
	}

	foreach($actions as $action)
	{
		if(!in_array($action, $oldActionNames))
		{
			echo "Adding $action<br />\n";
			$new = new Action();
			$new->set('name', $action);
			$new->save();
		}
	}

	$actions = Action::searchForAll();
	$statuses = Status::searchForAll();
	$rights = Right::SearchForAll();

	$listRights = array();
	foreach($actions as $action)
		foreach($statuses as $status)
			$listRights[] = $action->get('id').'.'.$status->get('id');

	$oldrights = array();

	foreach($rights as $right)
	{
		$actionId = $right->get('actionId');
		$statusId = $right->get('statusId');

		if(!in_array($actionId.'.'.$statusId, $listRights))
		{
			echo "Deleting ($actionId,$statusId)<br />\n";
			$right->delete();
		}
		else $oldrights[] = $actionId.'.'.$statusId;
	}

	foreach($actions as $action)
	{
		foreach($statuses as $status)
		{
			$actionId = $action->get('id');
			$statusId = $status->get('id');

			if(!in_array($actionId.'.'.$statusId, $oldrights))
			{
				echo "Adding ($actionId,$statusId)<br />\n";
				$new = new Right();
				$new->set('actionId', $actionId);
				$new->set('statusId', $statusId);
				$new->set('right', 'deny');
				$new->save();
			}
		}
	}

	/* </controller> */

?>
