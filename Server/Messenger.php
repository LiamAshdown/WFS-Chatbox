<?php

require_once("User.php");
require_once("Response/Response.php");
require_once("Database/Database.php");
require_once("Configuration/Config.php");
require_once("Utility/StringHelper.php");

/// Get User list in chat room
if (isset($_GET["GetUserList"]))
{
    $l_UserList = UserBuilder::GetUserList();

    if (!empty($l_UserList))
    {
        ResponseBuilder::UserList($l_UserList);
    }
}
else if (isset($_GET["GetMessages"]))
{
    $l_MessageList = UserBuilder::GetMessages();

    if (!empty($l_MessageList))
    {
        ResponseBuilder::MessageList($l_MessageList);
    }
}

?>