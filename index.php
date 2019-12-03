<?php
require_once("Server/Session.php");
require_once("Server/Database/Database.php");
require_once("Server/User.php");
require_once("Server/Configuration/Config.php");

Configuration::LoadFile("Config.ini");
Database::Connect(Configuration::GetEntry("DATABASE_HOST"), Configuration::GetEntry("DATABASE_USERNAME"), "carbon12", Configuration::GetEntry("DATABASE_NAME"));
Session::BuildSession();
?>

<!DOCTYPE html>

<head>
    <meta charset="UTF-8">
    <title>Chatbox</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="css/site.css">
</head>

<body>

    <?php 
    if (UserBuilder::IsUserLoggedIn()) 
    { 
        require("Views/Messenger.php"); 
    }
    else 
    {
        require("Views/Login.php");
    }
    ?>
    

    <script src="js/site.js"></script>
</body>
</html>