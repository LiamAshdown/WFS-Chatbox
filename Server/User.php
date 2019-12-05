<?php

require_once("Session.php");
require_once("Database/Database.php");
require_once("Configuration/Config.php");
require_once("Response/Response.php");
Configuration::LoadFile($_SERVER['DOCUMENT_ROOT']."/lashdown/Config.ini");
Database::Connect(Configuration::GetEntry("DATABASE_HOST"), Configuration::GetEntry("DATABASE_USERNAME"), Configuration::GetEntry("DATABASE_PASSWORD"), Configuration::GetEntry("DATABASE_NAME"));
Session::BuildSession();

class UserBuilder
{
    /// Check if user is logged in
    static public function IsUserLoggedIn()
    {
        return Session::GetBool("logged_in");
    }

    /// Check if account exists
    /// @p_Username : Username being checked
    static public function DoesAccountExist($p_Username)
    {
        /// Check if username exists in the database
        $l_PreparedStatement = Database::PrepareStatement("SELECT username FROM users WHERE username = ?");
        $l_PreparedStatement->BindParameter("s", $p_Username);
        $l_PreparedStatement->Execute();

        /// If we have an result - username exists in the database
        if ($l_Result = $l_PreparedStatement->GetResult())
        {
            return true;
        }

        return false;
    }

    /// Create new user
    /// @p_Username : Username
    /// @p_Password : Password
     static public function CreateUser($p_Username, $p_Password)
    {
        $l_PreparedStatement = Database::PrepareStatement("INSERT INTO users(username, password, session_id, last_login, date_joined) VALUES (?, ?, ?, NOW(), NOW())");
        $l_PreparedStatement->BindParameter("s", $p_Username);
        $l_PreparedStatement->BindParameter("s", $p_Password);
        $l_PreparedStatement->BindParameter("s", Session::GetSessionId());
        $l_PreparedStatement->Execute();

        Session::SetValue("logged_in", "true");
        Session::SetValue("user", new User(Database::GetConnection()->insert_id, ucfirst($p_Username), Session::GetSessionId()));
    }

    /// Attempt to login
    /// @p_Username : Username
    /// @p_Password : Password
    static public function TryLogin($p_Username,$p_Password)
    {
        $l_PreparedStatement = Database::PrepareStatement("SELECT id, username, session_id FROM users WHERE username = ? and password = ?");
        $l_PreparedStatement->BindParameter("s", $p_Username);
        $l_PreparedStatement->BindParameter("s", $p_Password);
        $l_PreparedStatement->Execute();

        /// if we have a result - account details are correct
        if ($l_Result = $l_PreparedStatement->GetResult())
        {
            $l_Row = $l_Result->GetRow();

            Session::SetValue("logged_in", "true");
            Session::SetValue("user", new User($l_Row[0], ucfirst($l_Row[1]), $l_Row[2]));

            /// Also update the session
            $l_PreparedStatement = Database::PrepareStatement("UPDATE users SET session_id = ? WHERE username = ?");
            $l_PreparedStatement->BindParameter("s", Session::GetSessionId());
            $l_PreparedStatement->BindParameter("s", $p_Username);
            $l_PreparedStatement->Execute();

            return true;
        }

        return false;
    }

    /// Logout user
    /// @p_NewSession : Whether being replaced by a new session
    static public function Logout($p_NewSession)
    {
        if (!$p_NewSession)
        {
            self::SendSystemMessage(Session::GetValue("user")->GetUsername()." has left the chat");
            Database::DirectQuery("DELETE FROM user_list WHERE id =".Session::GetValue("user")->GetId());

        }
    
        Session::UnSetValue("logged_in");
        Session::UnSetValue("user");
    }

    /// Join the chat
    static public function JoinChat()
    {
        $l_PreparedStatement = Database::PrepareStatement("SELECT username FROM user_list WHERE username = ?");
        $l_PreparedStatement->BindParameter("s", Session::GetValue("user")->GetUsername());
        $l_PreparedStatement->Execute();

        if ($l_PreparedStatement->GetResult() === null)
        {
            $l_PreparedStatement = Database::PrepareStatement("INSERT INTO user_list (id, username) VALUES (?, ?) ON DUPLICATE KEY UPDATE id = VALUES(id)");
            $l_PreparedStatement->BindParameter("i", Session::GetValue("user")->GetId());
            $l_PreparedStatement->BindParameter("s", Session::GetValue("user")->GetUsername());
            $l_PreparedStatement->Execute();

            self::SendSystemMessage(Session::GetValue("user")->GetUsername()." has joined the chat");
        }
    
    }

    /// Get users in chat
    static public function GetUserList()
    {
        $l_PreparedStatement = Database::PrepareStatement("SELECT id, username FROM user_list");
        $l_PreparedStatement->Execute();
        
        if ($l_Result = $l_PreparedStatement->GetResult())
        {
            $l_UserList = array();

            do
            {
                $l_Row = $l_Result->GetRow();

                $l_User             = array();
                $l_User["id"]       = $l_Row[0];
                $l_User["username"] = $l_Row[1];

                $l_UserList[] = $l_User;

            }while ($l_Result->GetNextRow());

            return $l_UserList;
        }

        return array();
    }

    /// Get messages which are less than a day old
    static public function GetMessages()
    {
        $l_PreparedStatement = Database::PrepareStatement("SELECT id, username, message, date_sent FROM messages WHERE date_sent > timestampadd(hour, -24, now())");
        $l_PreparedStatement->Execute();

        if ($l_Result = $l_PreparedStatement->GetResult())
        {
            $l_MessageList = array();

            do
            {
                $l_Row = $l_Result->GetRow();

                $l_Message             = array();
                $l_Message["id"]       = $l_Row[0];
                $l_Message["username"] = $l_Row[1];
                $l_Message["message"]  = $l_Row[2];
                $l_Message["date"]     = $l_Row[3];

                $l_MessageList[] = $l_Message;

            }while ($l_Result->GetNextRow());

            return $l_MessageList;
        }

        return array();
    }

    /// Send message to database
    /// @p_Message : Message being inserted to database
    static public function SendMessage($p_Message)
    {
        if (self::ParseCommand($p_Message))
        {
            return;
        }

        $l_PreparedStatement = Database::PrepareStatement("INSERT INTO messages(id, username, message, date_sent) VALUES(?, ?, ?, NOW())");
        $l_PreparedStatement->BindParameter("i", Session::GetValue("user")->GetId());
        $l_PreparedStatement->BindParameter("s", Session::GetValue("user")->GetUsername());
        $l_PreparedStatement->BindParameter("s", $p_Message);
        $l_PreparedStatement->Execute();

        ResponseBuilder::MessageSent(MESSAGE_ERROR_SUCCESS);
    }

    /// Send system message to database
    /// @p_Message : Message being inserted to database
    static public function SendSystemMessage($p_Message)
    {
        $l_PreparedStatement = Database::PrepareStatement("INSERT INTO messages(id, username, message, date_sent) VALUES(?, ?, ?, NOW())");
        $l_PreparedStatement->BindParameter("i", 0);
        $l_PreparedStatement->BindParameter("s", "SYSTEM");
        $l_PreparedStatement->BindParameter("s", $p_Message);
        $l_PreparedStatement->Execute();
    }

    /// Validate if current session matches the session in database
    static public function ValidateSession()
    {
        $l_PreparedStatement = Database::PrepareStatement("SELECT session_id FROM users WHERE username = ?");
        $l_PreparedStatement->BindParameter("s", Session::GetValue("user")->GetUsername());
        $l_PreparedStatement->Execute();

        if ($l_Result = $l_PreparedStatement->GetResult())
        {
            $l_Row = $l_Result->GetRow();

            /// If session does not match - log off user
            if (Session::GetSessionId() != $l_Row[0])
            {
                self::Logout(true);

                return false;
            }
        }

        return true;
    }

    /// Check whether the message has a command if so execute it
    static public function ParseCommand($p_Message)
    {
        if ($p_Message === "/logout")
        {
            self::Logout(false);

            ResponseBuilder::MessageSent(MESSAGE_ERROR_LOGOUT);

            return true;
        }

        return false;
    }
}

class User
{
    /// Constructor
    /// @p_Id        : Id
    /// @p_Username  : Username
    /// @p_SessionId : Session Id
    public function __construct($p_Id, $p_Username, $p_SessionId)
    {
        $this->m_Id        = $p_Id;
        $this->m_Username  = $p_Username;
        $this->m_SessionId = $p_SessionId;
    }

    //////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////

    public function GetUsername()  { return $this->m_Username;   }
    public function GetId()        { return $this->m_Id;         }
    public function GetSessionId() { return $this->m_SessionId; }

    //////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////

    private $m_Id;
    private $m_Username;
    private $m_SessionId;
}

?>