<?php

	include_once '../config.php';
	
	$action = $_POST['action']; 
	$node = $_POST['node'];
	$path = BASE_PATH;
	
	$result = new stdClass();
	$result->success = false;
	$result->msg = ''; 
	
	function valid_name($text){
		 $except = array('\\', '/', ':', '*', '?', '"', '<', '>', '|', ' ');
		 $new_text = str_replace($except,'',$text);
		 if($new_text == $text) {
		 	return 'valid';
		 }else{
		 	return 'invalid folder or file name, the name does not allow contain '. implode($except,","). 'character';
		 }
		 
	}
	
	 function rrmdir($dir) { 
	   if (is_dir($dir)) { 
	     $objects = scandir($dir); 
	     foreach ($objects as $object) { 
	       if ($object != "." && $object != "..") { 
	         if (filetype($dir."/".$object) == "dir") rrmdir($dir."/".$object); else unlink($dir."/".$object); 
	       } 
	     } 
	     reset($objects); 
	     rmdir($dir); 
	   }else{
	   		unlink($dir); 
	   }
	 } 	
	
	function full_copy( $source, $target ) {
		if(!file_exists($target)){
			if ( is_dir( $source ) ) {
				@mkdir( $target );
				$d = dir( $source );
				while ( FALSE !== ( $entry = $d->read() ) ) {
					if ( $entry == '.' || $entry == '..' ) {
						continue;
					}
					$Entry = $source . '/' . $entry; 
					if ( is_dir( $Entry ) ) {
						full_copy( $Entry, $target . '/' . $entry );
						continue;
					}
					copy( $Entry, $target . '/' . $entry );
				}
		 
				$d->close();
			}else {
				copy( $source, $target );
			}
			return true;
						
		}else{
			return false;
		}
	}

	
	switch($action){
		
		case 'new':
				$text = $_POST['text_item']; 
				$status = valid_name($text);
				if($status=='valid'){
					$dir = $path.$node.'/'.$text;
					$success = @mkdir($dir); 
					if($success){
						$result->success = true;	
					}else{
						$result->msg = 'Error when created new folder, perhaps the folder name already exist';	
					}					
				}else{
					$result->success = false;
					$result->msg = $status;
				}
				
			break;
		
		case 'delete':
				$dir = $path.$node;
				rrmdir($dir);
				$result->success = true;
			break;
		
		case 'rename':
			$text = $_POST['text_item']; 
			$status = valid_name($text);
			if($status=='valid'){
				$new_name = $_POST['parentNode'] . '/' . $_POST['text_item'];
				$old_name = $path . $node;
				$new_name = $path . $new_name;
				$success = @rename($old_name,$new_name);
				if($success){
					$result->success = true;
				}else{
					$result->msg = 'Error when renaming the folder/file ';
				}				
			}else{
				$result->success = false;
				$result->msg = $status;				
			}
			break;
			
		case 'copy':
			$target = $_POST['target'];
			
			if(full_copy($path.$node,$path.$target)){
				$result->success = true;					
			}else{
				$result->msg = 'File or folder already exist';
			}
			
			break;
			
		case 'cut':
			$target = $_POST['target'];
			
			if(full_copy($path.$node,$path.$target)){
				$result->success = true;
				rrmdir($path.$node);					
			}else{
				$result->msg = 'File or folder already exist';
			}
						
			break;
	}
	
	
	echo json_encode($result);
	

?>