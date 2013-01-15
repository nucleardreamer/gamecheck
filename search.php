<?php
header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
header('Content-type: application/json');

$console = $_GET['console'];
$page = $_GET['page'];
$time = $_GET['cache'];

function grepit( $pattern, $input, $flags = 0 )
{
    $keys = preg_grep( '/('.$pattern.')/i', array_keys( $input ), $flags );
    $vals = array();
    foreach ( $keys as $key )
    {
        $vals[] = array('name'=>$key,'data' => $input[$key]);
    }
    return $vals;
}
//print_r(json_encode(grepit($search,$test)));
        // create curl resource 
		
$ch = curl_init(); 

curl_setopt($ch, CURLOPT_URL, 'http://videogames.pricecharting.com/console/'.$console.'?sort-by=name&page='.$page.'&per-page=30&format=json&time='.$time); 

curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1); 

$output = curl_exec($ch); 

print_r($output);

curl_close($ch);   

?>