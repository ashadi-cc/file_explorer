<?php
	include_once '../config.php';
	$node = $_POST['node'];
	$dir = BASE_PATH;
	
	$save_path = $dir.$node.'/';
	$valid_chars_regex = '.A-Z0-9_ !@#$%^&()+={}\[\]\',~`-';
	$extension_whitelist = explode(',',ALLOWED_FILE_TYPE);	// Allowed file extensions
	$MAX_FILENAME_LENGTH = 260;
	$max_file_size_in_bytes = 2147483647; // 2GB in bytes
	$upload_name = 'Filedata';	

	$POST_MAX_SIZE = ini_get('post_max_size');
	$unit = strtoupper(substr($POST_MAX_SIZE, -1));
	$multiplier = ($unit == 'M' ? 1048576 : ($unit == 'K' ? 1024 : ($unit == 'G' ? 1073741824 : 1)));

	if ((int)$_SERVER['CONTENT_LENGTH'] > $multiplier*(int)$POST_MAX_SIZE && $POST_MAX_SIZE) {
		//header("HTTP/1.1 500 Internal Server Error"); // This will trigger an uploadError event in SWFUpload
		//echo "POST exceeded maximum allowed size.";
		HandleError('POST exceeded maximum allowed size.');
	}	
		
// Other variables	
	$file_name = '';
	$file_extension = '';
	$uploadErrors = array(
        0=>'There is no error, the file uploaded with success',
        1=>'The uploaded file exceeds the upload_max_filesize directive in php.ini',
        2=>'The uploaded file exceeds the MAX_FILE_SIZE directive that was specified in the HTML form',
        3=>'The uploaded file was only partially uploaded',
        4=>'No file was uploaded',
        6=>'Missing a temporary folder'
	);

// Validate the upload
	if (!isset($_FILES[$upload_name])) {
		HandleError('No upload found in \$_FILES for ' . $upload_name);
	} else if (isset($_FILES[$upload_name]["error"]) && $_FILES[$upload_name]["error"] != 0) {
		HandleError($uploadErrors[$_FILES[$upload_name]["error"]]);
	} else if (!isset($_FILES[$upload_name]["tmp_name"]) || !@is_uploaded_file($_FILES[$upload_name]["tmp_name"])) {
		HandleError('Upload failed is_uploaded_file test.');
	} else if (!isset($_FILES[$upload_name]['name'])) {
		HandleError('File has no name.');
	}

// Validate the file size (Warning: the largest files supported by this code is 2GB)
	$file_size = @filesize($_FILES[$upload_name]["tmp_name"]);
	if (!$file_size || $file_size > $max_file_size_in_bytes) {
		HandleError('File exceeds the maximum allowed size');
	}
	
	if ($file_size <= 0) {
		HandleError('File size outside allowed lower bound');
	}

// Validate file name (for our purposes we'll just remove invalid characters)
	$file_name = preg_replace('/[^'.$valid_chars_regex.']|\.+$/i', "", basename($_FILES[$upload_name]['name']));
	if (strlen($file_name) == 0 || strlen($file_name) > $MAX_FILENAME_LENGTH) {
		HandleError('Invalid file name');
	}

// Validate that we won't over-write an existing file
	if (file_exists($save_path . $file_name)) {
		HandleError('A file with this name already exists');
	}
	

// Validate file extension
	$path_info = pathinfo($_FILES[$upload_name]['name']);
	$file_extension = $path_info["extension"];
	$is_valid_extension = false;
	foreach ($extension_whitelist as $extension) {
		if (strcasecmp($file_extension, $extension) == 0) {
			$is_valid_extension = true;
			break;
		}
	}
	if (!$is_valid_extension) {
		HandleError("Invalid file extension");
		exit(0);
	}
	
	if (!@move_uploaded_file($_FILES[$upload_name]["tmp_name"], $save_path.$file_name)) {
		HandleError("File could not be saved.");
	}

	die('{"success":true}');

	/* Handles the error output. This error message will be sent to the uploadSuccess event handler.  The event handler
	will have to check for any error messages and react as needed. */
	function HandleError($message) {
		die('{success:false,error:'.json_encode($message).'}');
	}	
	
	
?>