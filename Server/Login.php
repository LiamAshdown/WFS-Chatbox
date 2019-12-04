<?php

require_once("User.php");
require_once("Utility/StringHelper.php");

/// Check if first variable is a register or login
if (isset($_POST["register-username"]) && !empty($_POST["register-username"]))
{
    $l_Username        = $_POST["register-username"];
    $l_Password        = $_POST["register-password"];
    $l_ConfirmPassword = $_POST["register-confirmpassword"];
    $l_ErrorMessage    = array();

    /// Validate the inputs
    if (!StringHelper::ValidateUsername($l_Username, $l_ErrorMessage))
    {
        ResponseBuilder::ValidationError($l_ErrorMessage);
        return;
    }

    if (!StringHelper::ValidatePassword($l_Password, $l_ErrorMessage))
    {
        ResponseBuilder::ValidationError($l_ErrorMessage);
        return;
    }

    if (!StringHelper::ValidateConfirmPassword($l_ConfirmPassword, $l_Password, $l_ErrorMessage))
    {
        ResponseBuilder::ValidationError($l_ErrorMessage);
        return;
    }
    
    if (UserBuilder::DoesAccountExist($l_Username))
    {
        ResponseBuilder::AccountAlreadyExists();
    }
    else ///< Create an account
    {
        UserBuilder::CreateUser($l_Username, StringHelper::HashPassword($l_Username, $l_Password));
        ResponseBuilder::AccountCreated();
    }
}
else if (isset($_POST["login-username"]) && !empty($_POST["login-username"]))
{
    $l_Username = $_POST["login-username"];
    $l_Password = $_POST["login-password"];

    if (UserBuilder::TryLogin($l_Username, StringHelper::HashPassword($l_Username, $l_Password)))
    {
        ResponseBuilder::LoggedIn();
    }
    else
    {
        ResponseBuilder::IncorrectDetails();
    }
}
?>