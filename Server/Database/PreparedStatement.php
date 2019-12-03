<?php

require("Server/Utility/TaskException.php");
require('ResultSet.php');

class PreparedStatement
{
    /// Constructor
    /// @p_Statement : Prepared Statement
    public function __construct($p_Statement)
    {
        $this->m_Statement = $p_Statement;
        $this->m_Result    = null;
        $this->m_Values    = array();
        $this->m_Success   = true;
    }
    /// Deconstructor
    public function __destruct()
    {
        $this->Clear();
    }

    //////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////

    ///////////////////////////////////////////
    //            	GENERAL
    ///////////////////////////////////////////

    /// Bind Parameter to statement
    /// @p_Id    : Data Type
    /// @p_Value : Value
    public function BindParameter(string $p_Id, string $p_Value)
    {
        try 
        {
            $this->Validate($p_Id, $p_Value);

        } catch (Exception $p_Exception)
        {
            trigger_error($p_Exception->getMessage());
        }
    }

    /// Execute the statement to the database
    public function Execute()
    {
        try 
        {    
            $this->Bind();

            if (!$this->m_Statement->execute())
            {
                throw new TaskException("[PreparedStatement/Execute]: Execute Statement failed: (". $this->m_Statement->errno.") ".$this->m_Statement->error);
            }
            else
            {
                $this->m_Result = $this->m_Statement->get_result();
            }
        }  
        catch (Exception $p_Exception)
        {
            trigger_error($p_Exception->getMessage());
        }
    }

    /// Check if statement returned a result
    public function GetResult()
    {
        if ($this->m_Result && $this->m_Result->num_rows)
        {
            return new ResultSet($this->m_Result);
        }

        return null;
    }

    /// Clear the statement
    public function Clear()
    {
        unset($this->m_Ids);
        unset($this->m_Values);

        $this->m_Statement->close();
    }

    /// Validate the Id and value
    /// @p_Id    : Id
    /// @p_Value : Value
    private function Validate($p_Id, $p_Value)
    {
        /// Check the Id is a string
        if (is_string($p_Id))
        {
            /// We only deal with lower case
            strtolower($p_Id);

            /// Id must be one of these values to be acceptable for MySQLI (OOP)
            if ($p_Id !== "i" && $p_Id !== "d" && $p_Id !== "s" && $p_Id !== "b")
            {
                throw new TaskException("[PreparedStatement/Validate]: Id must be a valid data type");
            }
        }
        else
        {
            throw new TaskException("[PreparedStatement/Validate]: Id must be a string!");
        }

        /// Now check whether value is valid
        /// for instance, if our Id is a interger and our value is a string.

        if ($p_Id === "i" && !is_int($p_Value))
        {
            throw new TaskException("[PreparedStatement/Validate]: Id is a integer but the value is not!");
        }
        else if ($p_Id === "d" && !is_double($p_Value))
        {
            throw new TaskException("[PreparedStatement/Validate]: Id is a double but the value is not!");
        }
        /// TODO; Check for blob - I'm not entirely sure how you handle this - is there a proper way?
        else if (($p_Id === "s" || $p_Id === "b") && !is_string($p_Value))
        {
            throw new TaskException("[PreparedStatementValidate]: Id is a string but the value is not!");
        }
        else 
        {
            $this->m_Ids = $this->m_Ids.$p_Id;
            $this->m_Values[] = $p_Value;
            $this->m_Success  = true;
        }
    }

    /// Bind the parameters into PreparedStatement
    private function Bind()
    {
        /// Don't bind if there are no parameters
        if (empty($this->m_Ids) || empty($this->m_Values))
        {
            return;
        }

        try 
        {
            if (!$this->m_Statement->bind_param($this->m_Ids, ...$this->m_Values))
            {
                throw new TaskException("[PreparedStatement/Bind]: Binding Parameters failed: (". $this->m_Statement->errno.")".$this->m_Statement->error);
            }
        } catch (Exception $p_Exception)
        {
            trigger_error($p_Exception->getMessage());
        }
    }

    ///////////////////////////////////////////
    //            GETTERS/SETTERS
    ///////////////////////////////////////////

    public function GetStatement() { return $this->m_Statement; }

    //////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////

    private $m_Statement;
    private $m_Ids;
    private $m_Values;
}

?>