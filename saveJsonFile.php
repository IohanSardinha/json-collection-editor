<?php 
	$fileName = $_GET['collection'];
	$index = $_GET['index'];
	$redirect = $_GET['redirect'];
	$json = $_GET['json'];

	header('Content-type: text/javascript');

	if(!isset($fileName) || !isset($redirect) || !isset($json) || !isset($index)){
		echo "failed";
	}
	else{

		try{

			$collection = json_decode(file_get_contents($fileName));

			$collectionName = array_keys(json_decode(file_get_contents($fileName),true))[0];
			
			$collection->{$collectionName}[$index] = json_decode($json);

			$file = fopen($fileName, "w");

			fwrite($file, json_encode($collection, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE ));

			fclose($file);
			
			echo "success";

		}catch(Exception $ex)
		{
			echo "failed";
		}
	}

 ?>	
