<!doctype html>
<html lang="en">
  <head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- Bootstrap CSS -->
<link href="//maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" rel="stylesheet" id="bootstrap-css">
<script src="//maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>

  <title>XXE - Demo</title>
  </head>
  <body>
    
<div style="margin:0; position:absolute; top:50%; left:50%; transform:translate(-50%, -50%);">
  <div id="formContent" style="padding:2rem; text-align:left">
    <!-- Tabs Titles -->

    <h1 style="padding-bottom:1rem">Parsed XML Data</h1>

    <?php 
    libxml_disable_entity_loader (false);

    # print_r($_FILES);
    if (isset($_POST['linkToXML'])) {
	$buffer = file_get_contents($_POST['linkToXML']);

	try{
		$dom=new DOMDocument('1.0');
		$dom->loadXml($buffer, LIBXML_NOENT);
		$data = $dom->textContent;
		echo $data."<br/>";
	}
	catch(customException $e){
		# echo 'Error: ' . $e->errorMessage();
		echo $buffer;
		error_log("Error: ", $e->errorMessage(), $buffer);
	}
	// -------------------------------------------SAFE
	# $xmlfile = simplexml_load_string($buffer);	
	# print_r($xmlfile);
	# foreach($xmlfile as $val){
	#  		echo $val . "<br/>";
	#  	}
	// -------------------------------------------SAFE
    }
    else{
    	echo "Please provide link to a valid XML file.";
    }
	?> 

    <a href="/index.php">Go Back</a>
  </div>
</div>


  </body>
</html>
