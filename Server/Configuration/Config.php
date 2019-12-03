<?php

class Configuration
{
    /// Constructor
    public function __construct()
    {
        $this->m_Entries = null;
    }
    /// Deconstructor
    public function __deconstruct()
    {

    }
    
    //////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////

    /// Load File
    /// @p_File : File being loaded
    static public function LoadFile($p_File) : bool
    {
        if (file_exists($p_File))
        {
            self::$m_Entries = parse_ini_file($p_File);

            return true;
        }
        else
        {
            Logger::GetInstance()->Log(LogLevel::LOG_LEVEL_ASSERT, "Cannot locate file ".$p_File, __FUNCTION__, __LINE__);
            return false;
        }

    }

    /// Get Entry
    /// @p_Key     : Key being looked for
    /// @p_Default : Default value if key is not found
    static public function GetEntry($p_Key, $p_Default = null)
    {
        if (isset(self::$m_Entries[$p_Key]) && !empty(self::$m_Entries[$p_Key]))
        {
            return self::$m_Entries[$p_Key];
        }
        else
        {
            return $p_Default ? $p_Default : null;
        }
    }

    //////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////

    static private $m_Entries;
}

?>