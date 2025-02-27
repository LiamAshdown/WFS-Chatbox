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
else if (isset($_POST["send-message"]) && !empty($_POST["send-message"]))
{
    $l_Message = $_POST["send-message"];
    UserBuilder::SendMessage($l_Message);
}
else if (isset($_GET["ValidateSession"]))
{
    /// Since Messenger.php gets called every second, it's ideal to validate the session during this interval
    if (!UserBuilder::ValidateSession())
    {
        ResponseBuilder::InvalidSession();
    }
    else 
    {
        ResponseBuilder::ValidSession();
    }
}

?>