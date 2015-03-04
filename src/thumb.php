<?php
 include_once 'class/easyphpthumbnail.class.php';
 
 
 
 function createThumbnail($fileName,$size = 64){
 	
 	$path = '../images/thumb';
 	$thumb = new easyphpthumbnail;
 	$thumb->Thumbwidth = $size;
 	//$thumb -> Thumblocation = $path .'/medium/';
 	//$thumb -> Thumbfilename = 'mynewfilename.jpg';
 	//$thumb -> Createthumb($fileName,'file');
 	$thumb->Createthumb($fileName);
 	
 }
 
 $img = isset($_GET['img'])?$_GET['img']:0;
 $size = isset($_GET['size'])?$_GET['size']:0;
 
 if($img && $size){
 	createThumbnail($img,$size);
 }
 
 
 
?>