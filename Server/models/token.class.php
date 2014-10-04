<?php
    
    if(!defined('MODEL')) die('This page should not be accessed that way');

    if(!defined(BASIC_LOADED)) require_once(MODEL.'basic.php');
    createConst(__FILE__);
    
    loadClass('model');
    
    class Token extends Model
	{
		public static function purge()
		{
			$whereClause = 'action_count=0 OR (action_count=-1 AND expiration<:time)';
			$params = array(array('id'=>':time', 'value'=>time()));

			$tokens = Token::search($whereClause, $params);

			foreach($tokens as $token)
			{
				$token->delete();
			}
		}
    }

?>
