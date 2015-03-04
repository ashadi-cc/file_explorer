<?php
	function getIcon($view,$type,$path){
		
		$type = strtolower($type);
		
		if($view =='detail'){
			return 'images/icon/detail/'.$type.'.png';
		}
		
		if($view =='medium'){
			$icon = 'images/icon/medium/'.$type.'.png';
			if($type =='jpg' || $type =='png' || $type =='bmp' || $type =='gif'){
				$icon = 'src/thumb.php?img='.$path.'&size=60';
			}
			return $icon;
		}
		
		if($view =='large'){
			$icon = 'images/icon/large/'.$type.'.png'; 
			if($type =='jpg' || $type =='png' || $type =='bmp' || $type =='gif'){
				$icon = 'src/thumb.php?img='.$path.'&size=80';
			}			
			return $icon;
		}	

		if($view =='extra'){
			$icon = 'images/icon/extra/'.$type.'.png';
			if($type =='jpg' || $type =='png' || $type =='bmp' || $type =='gif'){
				$icon = 'src/thumb.php?img='.$path.'&size=265';
			}			 
			return $icon;
		}			
	}
?>