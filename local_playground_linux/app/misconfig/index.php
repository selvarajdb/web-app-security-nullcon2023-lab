<!DOCTYPE html>
<html>
<head>
    <title>LFI</title>
</head>
<body>
    <h1>How are you doing today! Are we on the same page?</h1>
    <?php
        // Get the page parameter from the URL
        $page = $_GET['page'];
        
        // Include the requested page
        include($page);
    ?>
</body>
</html>
