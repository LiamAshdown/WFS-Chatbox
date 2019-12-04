<?php
require_once("Server/Database/Database.php");
require_once("Server/User.php");
require_once("Server/Configuration/Config.php");
?>

<!DOCTYPE html>

<head>
    <meta charset="UTF-8">
    <title>Chatbox</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <link rel="stylesheet" href="css/site.css">

    <script src="js/site.js"></script>
    <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/2.0.2/jquery.min.js"></script>
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

<script src="js/site.js"></script>
</body>
</html>