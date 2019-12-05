<?php
require_once('PreparedStatement.php');

class Database 
{
    /// Constructor
    public function __construct()
    {
        self::$m_Connection = null;
    }
    /// Deconstructor
    public function __deconstruct()
    {
        self::Close();
    }

	//////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////

    ///////////////////////////////////////////
    //            	 GENERAL
    ///////////////////////////////////////////

    /// Connect to database
    /// @p_Localhost : Host
    /// @p_Username  : Username
    /// @p_Password  : Password
    /// @p_Database  : Database
    public static function Connect($p_LocalHost, $p_Username, $p_Password, $p_Database)
    {
        if (self::$m_Connection === null)
        {
            self::$m_Connection = mysqli_connect($p_LocalHost, $p_Username, $p_Password, $p_Database);

            /// PHP will catch the error and display to webpage
            /// Reason why I do exit is because the chatbox becomes useless without database connection
            if (!self::$m_Connection)
            {
                exit();
            }
        }
    }

    /// Returns a prepared statement
    /// @p_Query : Query being prepared
    public static function PrepareStatement($p_Query)
    {
        try 
        {
            $l_Statement = self::$m_Connection->prepare($p_Query);

            if (!$l_Statement)
            {
                throw new TaskException("[Database/PrepareStatement]: Failed to prepare statement: (" . self::$m_Connection->errno . ") " . self::$m_Connection->error);
            }

            return new PreparedStatement($l_Statement);
        }
        catch (TaskException $p_Exception)
        {
            echo $p_Exception;
            exit();
        }
    }

    /// Directly execute to database
    /// @p_Query : Query being prepared
    public static function DirectQuery($p_Query)
    {
        try 
        {
            if (!self::$m_Connection->query($p_Query))
            {
                throw new TaskException("[Database/DirectQuery]: Failed to query! Error: ".self::$m_Connection->error);
            }
        }
        catch (TaskException $p_Exception)
        {
            echo $p_Exception;
            exit();
        }
    }

    /// Directly execute to database with result set
    /// @p_Query : Query being executed
    public static function DirectQueryWithResult(string $p_Query)
    {
        try
        {
            if ($l_Result = self::$m_Connection->query($p_Query, MYSQLI_USE_RESULT))
            {
                return $l_Result;
            }
            else
            {
                throw new TaskException("[Database/DirectQueryWithResult]: Failed to query! Error: ".self::$m_Connection->error);
            }
        }
        catch (TaskException $p_Exception)
        {
            echo $p_Exception;
            exit();
        }
    }

    public static function Close()
    {
        if (self::$m_Connection)
        {
            self::$m_Connection->close();
        }
    }

    ///////////////////////////////////////////
    //            GETTERS/SETTERS
    ///////////////////////////////////////////

    /// Get Read Database connection
    public static function GetConnection() { return self::$m_Connection; }

	//////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////

    private static $m_Connection; ///< MySQLI connection
}

?>