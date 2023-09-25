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

    <h1 style="padding-bottom:1rem">Read XML</h1>

    <!-- Login Form -->
    <form action="upload.php" method="post" enctype="multipart/form-data">
    Enter URL to XML file:<br/>
    <input type="input" name="linkToXML" id="fileToUpload">
    <input type="submit" value="READ" name="submit">
    </form>

  </div>
</div>


  </body>
</html>
