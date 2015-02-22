<?php

	/* Init constants */

	define('INDEX', true);
	define('MODEL', 'models/');	// Path to models
	define('VIEW', 'views/');	// Path to views
	require_once('init.php');

	/* Load utils */

	loadClass('functions');
	loadClass('db');

	/* Load models */

	loadClass('right');
	loadClass('action');
	loadClass('status');

	/* Load SQL Views */


	/* <controller> */


	/* <functions> */

	if(isset($_GET['name'], $_GET['checked']))
	{
		$name = explode('-',$_GET['name']);
		$right = ($_GET['checked']=='true') ? 'allow' : 'deny';

		$st = $name[1];
		$ac = $name[3];

		$whereClause = 'action_id = :ac AND status_id = :st';
		$params = array (
			array('id'=>':ac', 'value'=>$ac),
			array('id'=>':st', 'value'=>$st)
				);

		$result = Right::search($whereClause, $params);

		if(!count($result))
			Functions::setResponse(404);

		$ri = $result[0];
		$ri->set('right', $right);
		$ri->save();
	}

	$rights = Right::searchForAll();
	$actions = Action::searchForAll();
	$status = Status::searchForAll();

	$aArr = array();
	$sArr = array();
	$rArr = array();

	foreach($actions as $a)
	{
		$aArr[$a->get('id')] = $a->get('name');
		$rArr[$a->get('id')] = array();
	}

	foreach($status as $s)
	{
		$sArr[$s->get('id')] = $s->get('name');
	}

	foreach($rights as $r)
	{
		$rArr[$r->get('actionId')][$r->get('statusId')] = $r->get('right');
	}

?>
<html>
	<head>
		<script>
			function update(elt)
			{
				location.href = '?name='+elt.name+'&checked='+elt.checked;
			}
		</script>
	</head>
	<body>
		<table cols=<?php echo count($status)+1; ?>>
			<tr>
				<td></td>
				<?php

					foreach($sArr as $name)
						echo "<td style='padding-left:10px; padding-right:10px'><b>$name</b></td>\n";

				?>
			</tr>
			<?php

					foreach($actions as $a)
					{
						$aid = $a->get('id');

						echo "<tr>\n";
						echo "<td><b>";
						echo $aArr[$aid];
						echo "</b></td>\n";

						foreach($sArr as $sid=>$sname)
						{
							echo "\t<td><input type='checkbox' name='status-$sid-action-$aid'";
							if($rArr[$aid][$sid]=='allow')
								echo " checked=checked";
							echo " onClick='update(this)'/></td>\n";
						}

						echo "</tr>\n";
					}
			
			?>
		</table>
	</body>
</html>
