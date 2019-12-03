<?php

class ResultSet
{
    /// Constructor
    /// @p_Result : Statement Result
    public function __construct($p_Result)
    {
        $this->m_Result      = $p_Result;
        $this->m_RowCount    = $this->m_Result->num_rows;
        $this->m_RowPosition = 0;

        /// Fetch all the rows and store into an array
        while ($l_Itr = $this->m_Result->fetch_row())
        {
            $this->m_Rows[] = $l_Itr;
        }
    }
    /// Deconstructor
    public function __deconstruct()
    {

    }

    //////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////

    ///////////////////////////////////////////
    //            	GENERAL
    ///////////////////////////////////////////

    /// Get Next Row
    public function GetNextRow()
    {
        if (!$this->NextRow())
        {
            return false;
        }

        return true;
    }
    
    ///////////////////////////////////////////
    //            GETTERS/SETTERS
    ///////////////////////////////////////////

    /// Get row in result set
    public function GetRow() { return $this->m_Rows[$this->m_RowPosition]; }

    /// Get Row count
    public function GetRowCount() { return $this->m_RowCount; }

    /// Check if we can get next row
    private function NextRow()
    {
        $this->m_RowPosition++;

        if ($this->m_RowPosition >= $this->m_RowCount)
        {
            return false;
        }

        return true;
    }

    //////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////

    private $m_Result;
    private $m_RowCount;
    private $m_RowPosition;
    private $m_Rows;
}

?>