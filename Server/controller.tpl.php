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

	/* <controller> */

	/* </controller> */
	
	loadview('json', $data);
?>
