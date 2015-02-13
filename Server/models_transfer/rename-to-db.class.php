<?php

	if(!defined('MODEL')) die('This page should not be accessed that way');

	if(!defined(BASIC_LOADED)) require_once(MODEL.'basic.php');
	createConst(__FILE__);

	class DB
	{
		private static $database = NULL;
		private static $MYSQL_HOST = 'localhost';
		private static $MYSQL_USER = 'root';
		private static $MYSQL_PWD = '<YOUR PASSWORD GOES HERE>';
		private static $MYSQL_DB = 'babar';
		public static $no_invoke = TRUE;

		public static function initDB()
		{
			if(!is_null(self::$database)) return;

			try
			{
				self::$database = new PDO('mysql:host='.self::$MYSQL_HOST.
					';dbname='.self::$MYSQL_DB,
					self::$MYSQL_USER,
					self::$MYSQL_PWD,
					array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET character_set_results = 'utf8', character_set_client = 'utf8', character_set_connection = 'utf8', character_set_database = 'utf8', character_set_server = 'utf8'") );
			}
			catch(Exception $e)
			{
				print('Fatal error : Unable to connect to mysql database');
				exit(1);
			}
		}

		public static function getDB()
		{
			if(is_null(self::$database)) self::initDB();

			return self::$database;
		}
	}

?>
