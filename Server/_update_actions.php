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

	/* </controller> */

?>
