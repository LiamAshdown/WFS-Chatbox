<?php
require_once("Utility/Time.php");

class Session
{
    /// Create a new session if not exist
    public static function BuildSession()
    {
        session_start();

        if (self::DoesSessionExit() === false)
        {
            self::CreateSession();
        }
    }

    /// Get value from session
    /// @p_Text : Text session
    public static function GetValue($p_Text)
    {
        /// Only time this happens is when BuildSession has not been declared before GetValue
        if (self::DoesSessionExit() == false)
        {
            trigger_error("Internal Server Error: Cannot retrieve session value! Session has not been started!");
        }

        /// Check if value is set and is not empty (prevent malicious attacks?)
        if (isset($_SESSION[$p_Text]) && !empty($_SESSION[$p_Text]))
        {    
            return $_SESSION[$p_Text];
        }

        return null;
    }

    /// Get Value from session
    /// @p_Text : Text Session
    public static function GetBool($p_Text)
    {
        /// Only time this happens is when BuildSession has not been declared before GetValue
        if (self::DoesSessionExit() == false)
        {
            trigger_error("Internal Server Error: Cannot retrieve session value! Session has not been started!");
        }

        /// Check if value is set and is not empty (prevent malicious attacks?)
        if (isset($_SESSION[$p_Text]) && !empty($_SESSION[$p_Text]))
        {
            return $_SESSION[$p_Text] == ("true" || "1") ? true : false;
        }

        return false;
    }

    /// Set value for session
    /// @p_Text  : Text session
    /// @p_Value : Value session
    public static function SetValue($p_Text, $p_Value)
    {
        /// Only time this happens is when BuildSession has not been declared before SetValue
        if (self::DoesSessionExit() == false)
        {
            trigger_error("Internal Server Error: Cannot set session value! session has not been started!");
        }

        $_SESSION[$p_Text] = $p_Value;
    }

    /// Unset value for session
    /// @p_Text : Text Session
    public static function UnSetValue($p_Text)
    {
        /// Check if value is set and is not empty (prevent malicious attacks?)
        if (isset($_SESSION[$p_Text]))
        {    
            unset($_SESSION[$p_Text]);
        }
    }

    /// Get Session Id
    public static function GetSessionId()
    {
        return session_id();
    }

    //////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////

    /// Check if a session already exists
    private static function DoesSessionExit()
    {
        return session_status() != PHP_SESSION_NONE;
    }

    /// Create new session
    private static function CreateSession()
    {
        $_SESSION["session_id"]       = session_id();
        $_SESSION["session_creation"] = Time::GetDateTime();
    }
}

?>