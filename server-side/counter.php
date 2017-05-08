<?php

$key = $_GET["key"];
$callback = $_GET["callback"];

if (!isset($max)) {
  $max = 10;
} else {
  $max = intval($max);
}

$filename = $key . ".counter";

//die("here");

// if file read fails, return -1
$read_death =  $callback . "('" . $key . "', -1)";

$file = fopen($filename, "r") or die($read_death);
$filecontents = fread($file,filesize($filename));
fclose($file);

// echo $filecontents . "\n";
$curval = intval($filecontents);

echo $callback . "('" . $key . "', " . $curval . ")";
$nextval = ($curval + 1) % $max;

$file = fopen($filename, "w") or die();
fwrite($file, strval( $nextval) );
fclose($file);



?>