<?php

	if(!defined('MODEL')) die('This page should not be accessed that way');

	if(!defined(BASIC_LOADED)) require_once(MODEL.'basic.php');
	createConst(__FILE__);

	class Functions
	{
		public static function setResponse($code)
		{
			$test = floor($code/100);

			http_response_code($code);

			if($test >= 4) exit();
		}

		public static function hash($login, $password)
		{
			$l = strtoupper($login);
			$hMD5 = $l.md5($l.$password);
			return sha1($hMD5.$password.strrev($hMD5));
		}

		public static function randomHash()
		{
			return sha1(time().((string) rand()));
		}

		public static function redirect($url)
		{
			header('Location: '.$url);
			exit;
		}

		public static function pError($error)
		{
			echo '<p class="error">'.$error.'</p>';
		}

		public static function pMessage($message)
		{
			echo '<p class="message">'.$message.'</p>';
		}

		public static function secure($s)
		{
			return htmlentities($s, ENT_QUOTES, 'UTF-8');
		}

		public static function createInput($type, $name='', $value='', $useOldValue=false, $oldValue='', $class='', $id='', $more='')
		{
			$res = '<input type="'.$type.'" ';

			if(!empty($name)) $res.= 'name="'.$name.'" ';

			$v = ($useOldValue) ? (isset($_POST[$name])) ? $_POST[$name] : $oldValue : $value;
			if(!empty($v)) $res .= 'value="'.htmlentities($v, ENT_COMPAT, 'UTF-8').'" ';

			if(!empty($class)) $res .= 'class="'.$class.'" ';
			if(!empty($id)) $res .= 'id="'.$id.'" ';
			if(!empty($more)) $res .= $more;

			$res .= ' />';

			return $res;
		}

		public static function createSelect($name, $options, $selectedOption = '', $useOldValue = false, $oldValue='', $class='', $id='', $more='')
		{
			$res = "\n".'<select name="'.$name.'"';

			if(!empty($class)) $res .= ' class="'.$class.'"';
			if(!empty($id)) $res .= ' id="'.$id.'"';
			if(!empty($more)) $res .= ' '.$more;
			$res .= ">\n";

			$val = ($useOldValue) ? (isset($_POST[$name])) ? $_POST[$name] : $oldValue : $selectedOption;
			$mode = (is_array($val)) ? 'array' : 'string';

			foreach($options as $optionValue => $optionText)
			{
				$isSelected = ($mode == 'array') ? in_array($optionValue, $val) : ($optionValue==$val);
				$res .= '<option value="'.$optionValue.'"';
				if($isSelected && $useOldValue) $res .= ' selected=selected';
				$res .= '>'.Functions::secure($optionText).'</option>'."\n";
			}

			$res .= '</select>'."\n";

			return $res;
		}

		public static function createUniqueCheckbox($name, $value=false, $useOldValue=false, $oldValue=false, $class='', $id='', $more='')
		{
			$val = ($useOldValue) ?  (isset($_POST[$name])) ? ((bool) $_POST[$name]) : ((bool) $oldValue) : ((bool) $value);

			$res = '<input type="checkbox" name="'.$name.'"';

			if($val) $res .= ' checked=checked';
			if(!empty($class)) $res .= ' class="'.$class.'"';
			if(!empty($id)) $res .= ' id="'.$id.'"';
			if(!empty($more)) $res .= ' '.$more;

			$res .= ' />';

			echo $res;
		}

		public static function createTextarea($name, $value='', $useOldValue=false, $oldValue='', $class='', $id='', $more='')
		{
			$res = '<textarea name="'.$name.'"';
			if(!empty($class)) $res .= ' class="'.$class.'"';
			if(!empty($id)) $res .= ' id="'.$id.'"';
			if(!empty($more)) $res .= ' '.$more;

			$v = ($useOldValue) ? (isset($_POST[$name])) ? $_POST[$name] : $oldValue : $value;
			$v = htmlentities($v, ENT_NOQUOTES, 'UTF-8');
			$res .= '>'.$v.'</textarea>';

			return $res;
		}

		public static function validId($id, $allowZero=false)
		{
			if(!is_numeric($id) || floor($id) != $id || $id<0) return false;
			return ($id>0 || $allowZero);
		}

		public static function post($index)
		{
			return (isset($_POST[$index])) ? $_POST[$index] : null;
		}

		public static function get($index)
		{
			return (isset($_GET[$index])) ? $_GET[$index] : null;
		}

		public static function reduce($txt, $n)
		{
			if(strlen($txt) > ($n))
				return (substr($txt, 0, $n-3).'...');
			else
				return $txt;
		}

		public static function sanitize($string)
		{
			return strtolower($string);
		}

		public static function var_dump($v)
		{
			echo '<pre>';
			var_dump($v);
			echo '</pre>';
		}
	}

?>
