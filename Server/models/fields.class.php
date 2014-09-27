<?php 

	if(!defined('MODEL')) die('This page should not be accessed that way');

	if(!defined(BASIC_LOADED)) require_once(MODEL.'basic.php');
	createConst(__FILE__);

	abstract class Fields
	{
		public static function initFields(Model $object)
		{
			$className = strtolower(get_class($object));

			switch($className)
			{

			case 'customer' :

				$object->addField('customer_id', PDO::PARAM_INT, true);
				$object->addField('surname');
				$object->addField('name');
				$object->addField('nickname');
				$object->addField('sex');
				$object->addField('status');
				$object->addField('weight');
				$object->addField('height');
				$object->addField('picture');

				break;

			case 'status' :
				$object->addField('name', PDO::PARAM_STR, true);
				$object->addField('overdraft');

				break;

			case 'drink':
				$object->addField('drink_id', PDO::PARAM_INT, true);
				$object->addField('name');
				$object->addField('price');
				$object->addField('volume');
				$object->addField('alcohol');
				$object->addField('hidden', PDO::PARAM_INT);

				break;
			
			case 'entry':

				$object->addField('entry_id', PDO::PARAM_INT, true);
				$object->addField('customer_id');
				$object->addField('amount');
				$object->addField('date');

				break;

			case 'manager':
				$object->addField('login', PDO::PARAM_STR, true);
				$object->addField('pass');

				break;

			case 'balance':
				$object->addField('customer_id', PDO::PARAM_INT, true);
				$object->addField('balance');

				break;

			case 'sell':
				$object->addField('sell_id', PDO::PARAM_INT, true);
				$object->addField('customer_id');
				$object->addField('drink_id');
				$object->addField('quantity');
				$object->addField('price');
				$object->addField('date');

				break;

			default:
				if (DEBUG) echo ('Fatal error : Unable to load fields for class '.$className.' !');
				exit;
				break;
			}
		}

		public static function getSQLTableName($tableName)
		{
			$tables = array(
				'customer' 	=> 	'customers',
				'status' 	=> 	'status',
				'drink' 	=> 	'drinks',
				'manager' 	=> 	'managers',
				'balance' 	=> 	'balances',
				'entry'		=>	'entries',
						   );

			if (isset($tables[$tableName]))
				return $tables[$tableName];
			else
				if (DEBUG) echo ('Fatal error : Unable to load the table name for class '.$className.' !');

			return;
			
		}

		public static function toCamelCaseNaming($sqlName)
		{
			$camelCaseName = $sqlName;
			while(($c = strpos($camelCaseName, '_'))!==FALSE)
			{
				$camelCaseName = substr($camelCaseName, 0, $c).strtoupper($camelCaseName[$c+1]).substr($camelCaseName, $c+2);
			}

			return $camelCaseName;
		}

		public static function toSqlNaming($camelCaseName)
		{
			$sql_name = $camelCaseName;

			for($x=0; $x<strlen($sql_name); $x++)
			{
				$c = $sql_name[$x];
				if(self::isChar($c) && strtoupper($c)==$c)
				{
					$sql_name = substr($sql_name, 0, $x).'_'.strtolower($c).substr($sql_name, $x+1);
				}
			}

			return $sql_name;
		}

		private static function isChar($c)
		{
			$o = ord($c);
			return (($o>=ord('A') && $o<=ord('Z')) || ($o>=ord('a') && $o<=ord('z')));
		}
	}

?>
