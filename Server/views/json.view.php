<?php

	if(!defined('VIEW'))
	{
		print('This view cannot be called as is.');
		exit();
	}

	echo json_encode($args);

?>
