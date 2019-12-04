<?php

class StringHelper
{
    /// Validate username
    /// @p_Username      : Username being checked
    /// @p_ErrorResponse : Error which is returned
    public static function ValidateUsername(string $p_Username, array &$p_ErrorResponse) : bool
    {
        if (preg_match('/[\'^!£$%&*()}{@#~?><>,|=_+¬-]/', $p_Username))
        {
            $p_ErrorResponse["error"] = 1;
            $p_ErrorResponse["error_message"] = "Username cannot contain special characters!";

            return false;
        }
        else if (empty($p_Username) || strlen($p_Username) < 3)
        {
            $p_ErrorResponse["error"] = 1;
            $p_ErrorResponse["error_message"] = "Username must longer than 3 characters!";

            return false;
        }
        else if (strlen($p_Username) > 30)
        {
            $p_ErrorResponse["error"] = 1;
            $p_ErrorResponse["error_message"] = "Username must not be larger than 30 characters!";

            return false;
        }

        return true;
    }

    /// Validate Password
    /// @p_Password      : Password being checked
    /// @p_ErrorResponse : Error which is returned
    public static function ValidatePassword(string $p_Password, &$p_ErrorResponse) : bool
    {
        if (!preg_match('/[0-9]/', $p_Password))
        {
            $p_ErrorResponse["error"] = 2;
            $p_ErrorResponse["error_message"] = "Password must atleast contain a number!";

            return false;
        }
        else if (empty($p_Password) || strlen($p_Password) < 3)
        {
            $p_ErrorResponse["error"] = 2;
            $p_ErrorResponse["error_message"] = "Password must longer than 3 characters!";

            return false;
        }
        else if (strlen($p_Password) > 30)
        {
            $p_ErrorResponse["error"] = 2;
            $p_ErrorResponse["error_message"] = "Password must not be larger than 30 characters!";

            return false;
        }

        return true;
    }

    /// Validate confirm password
    /// @p_ConfirmPassword : Confirm Password being checked against password
    /// @p_Password        : Passeing being checked against confirm password
    /// @p_ErrorResponse   : Error which is returned
    public static function ValidateConfirmPassword(string $p_ConfirmPassword, string $p_Password, &$p_ErrorResponse) : bool
    {
        if ($p_ConfirmPassword !== $p_Password)
        {
            $p_ErrorResponse["error"] = 3;
            $p_ErrorResponse["error_message"] = "Confirm password does not match!";
            
            return false;
        }

        return true;
    }

    /// Hash password
    /// @p_Username : Username
    /// @p_Passowrd : Password
    public static function HashPassword($p_Username, $p_Password) : string
    {
        return sha1($p_Username.":".$p_Password);
    }
}

?>