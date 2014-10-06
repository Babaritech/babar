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

			case 'action':
				$object->addField('id', PDO::PARAM_INT, true);
				$object->addField('name');
				break;

			case 'right':
				$object->addField('id', PDO::PARAM_INT, true);
				$object->addField('action_id');
				$object->addField('status_id');
				$object->addField('right');
				break;

			case 'customer' :

				$object->addField('id', PDO::PARAM_INT, true);
				$object->addField('status_id', PDO::PARAM_INT);
				$object->addField('firstname');
				$object->addField('lastname');
				$object->addField('nickname');
				$object->addField('password');
				$object->addField('email');

				break;

			case 'status' :
				$object->addField('id', PDO::PARAM_INT, true);
				$object->addField('name');
				$object->addField('overdraft');

				break;

			case 'drink':
				$object->addField('id', PDO::PARAM_INT, true);
				$object->addField('brand');
				$object->addField('name');
				$object->addField('price');

				break;
			
			case 'entry':

				$object->addField('id', PDO::PARAM_INT, true);
				$object->addField('customer_id');
				$object->addField('debitant_id');
				$object->addField('amount');
				$object->addField('date');

				break;

			case 'sell':
				$object->addField('id', PDO::PARAM_INT, true);
				$object->addField('customer_id');
				$object->addField('drink_id');
				$object->addField('quantity');
				$object->addField('price');
				$object->addField('brand');
				$object->addField('name');
				$object->addField('date');

				break;

			case 'token':
				$object->addField('id', PDO::PARAM_INT, true);
				$object->addField('customer_id');
				$object->addField('value');
				$object->addField('expiration');
				$object->addField('action_count');
				break;

			// SQL Views

			case 'totalentries':
				$object->addField('customer_id', PDO::PARAM_INT, true);
				$object->addField('total');
				break;

			case 'totalsells':
				$object->addField('customer_id', PDO::PARAM_INT, true);
				$object->addField('total');
				break;

			case 'balance':
				$object->addField('customer_id', PDO::PARAM_INT, true);
				$object->addField('balance');
				break;
			
			default:
				if (DEBUG) echo ('Fatal error : Unable to load fields for class '.$className.' !');
				Functions::setResponse(500);
				break;
			}
		}

		public static function getSQLTableName($tableName)
		{
			$tables = array(
				'action'		=>	'actions',
				'customer' 		=> 	'customers',
				'status' 		=> 	'status',
				'drink' 		=> 	'drinks',
				'entry'			=>	'entries',
				'right'			=>	'rights',
				'sell'			=>	'sells',
				'token'			=>	'tokens',

				'totalentries'	=>	'total_entries',
				'totalsells'	=>	'total_sells',
				'balance'		=>	'balances'
						   );

			if (isset($tables[$tableName]))
				return $tables[$tableName];
			else
			{
				if (DEBUG) echo ('Fatal error : Unable to load the table name for class '.$className.' !');
				Functions::setResponse(500);
			}

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
