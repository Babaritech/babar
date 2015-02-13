<?php

	if(!defined('MODEL'))
		die('Fatal error: MODEL constant not defined');

    define('DEBUG', true);

	header('Access-Control-Allow-Origin: *');
	header('Access-Control-Allow-Methods: GET,POST');
	header('Access-Control-Allow-Header: Content-Type, Authorization, X-Requested-With');

    require_once(MODEL.'basic.php');

?>
