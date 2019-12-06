<?php
require_once("Server/User.php");
?>

<!DOCTYPE html>

<head>
    <meta charset="UTF-8">
    <title>Chatbox</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <link rel="stylesheet" href="css/site.css">
    <script src="js/utility.js"></script>
    <script src="js/ajax.js"></script>
</head>

<body>
    <?php 
    if (UserBuilder::IsUserLoggedIn()) 
    { 
        require("Views/Messenger.php"); 

        UserBuilder::JoinChat();
    }
    else 
    {
        require("Views/Login.php");
    }
    ?>
</body>
</html>