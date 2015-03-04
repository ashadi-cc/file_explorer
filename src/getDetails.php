<?php
	include_once '../config.php';
	include_once 'icon.php';
		
	$result = new stdClass();
	$result->success = true;
	$result->data = array();
	
	$path = BASE_PATH;
	$node = isset($_REQUEST['node']) ? $_REQUEST['node'] : 'doc';
	$view = isset($_REQUEST['view'])?$_REQUEST['view']:'detail';
	
	
	$directory = $path.$node;
	$list_folders = array();
	$list_files = array();
	if (is_dir($directory)){
		$d = dir($directory);
		while($f = $d->read()){
			 if($f == '.' || $f == '..' || substr($f, 0, 1) == '.') continue;
			 $filename = $directory . '/' . $f;			 
			 $lastmod = filemtime($filename)*1000;
			 
			 if(is_dir($directory.'/'.$f)){
			 	$list_folders[] = array(
			 		'file_icon'		=> getIcon($view,'folder',$path.$node.'/'.$f),
			 		'file_dir' 		=> $node.'/'.$f,
			 		'file_name'		=> $f,
			 		'file_id'		=> str_replace(' ','_',$f),
			 		'file_size'		=> 0,
			 		'file_type'		=> 'Folder',
			 		'file_modified'	=> $lastmod
			 	);
			 }else{
			 	$size = filesize($filename);
			 	$extension = pathinfo($filename,PATHINFO_EXTENSION);			 	 
			 	$list_files [] = array(
			 		'file_icon'		=> getIcon($view,$extension,$path.$node.'/'.$f),
			 		'file_dir' 		=> $node.'/'.$f,
			 		'file_name'		=> $f,
			 		'file_id'		=> str_replace(' ','_',$f),
			 		'file_size'		=> $size,
			 		'file_type'		=> 'File ' . strtoupper($extension),
			 		'file_modified'	=> $lastmod
			 	);			 	
			 }
			 			 
		}
	}
	
	foreach ($list_folders as $folder){
		$result->data[] = $folder;
	}
	
	foreach ($list_files as $file){
		$result->data[] = $file;
	}
		
	echo json_encode($result);
	
?>