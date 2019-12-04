<?php

require_once("Session.php");
require_once("Database/Database.php");
require_once("Configuration/Config.php");
Configuration::LoadFile($_SERVER['DOCUMENT_ROOT']."\Chatbox\Config.ini");
Database::Connect(Configuration::GetEntry("DATABASE_HOST"), Configuration::GetEntry("DATABASE_USERNAME"), "", Configuration::GetEntry("DATABASE_NAME"));
Session::BuildSession();

class UserBuilder
{
    /// Check if user is logged in
    static public function IsUserLoggedIn() : bool
    {
        return Session::GetValue("logged_in") !== null;
    }

    /// Check if account exists
    /// @p_Username : Username being checked
    static public function DoesAccountExist(string $p_Username) : bool
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
    static public function CreateUser(string $p_Username, string $p_Password) : void
    {
        $l_PreparedStatement = Database::PrepareStatement("INSERT INTO users(username, password, session_id, last_login, date_joined) VALUES (?, ?, ?, NOW(), NOW())");
        $l_PreparedStatement->BindParameter("s", $p_Username);
        $l_PreparedStatement->BindParameter("s", $p_Password);
        $l_PreparedStatement->BindParameter("s", Session::GetSessionId());
        $l_PreparedStatement->Execute();

        Session::SetValue("logged_in", "true");
        Session::SetValue("user", new User(Database::GetConnection()->insert_id, $p_Username, Session::GetSessionId()));
    }

    /// Attempt to login
    /// @p_Username : Username
    /// @p_Password : Password
    static public function TryLogin(string $p_Username, string $p_Password) : bool
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
            Session::SetValue("user", new User($l_Row[0], $l_Row[1], $l_Row[2]));

            /// Also update the session
            $l_PreparedStatement = Database::PrepareStatement("UPDATE users SET session_id = ? WHERE username = ?");
            $l_PreparedStatement->BindParameter("s", Session::GetSessionId());
            $l_PreparedStatement->BindParameter("s", $p_Username);
            $l_PreparedStatement->Execute();

            return true;
        }

        return false;
    }

    /// Join the chat
    static public function JoinChat()
    {
        $l_PreparedStatement = Database::PrepareStatement("INSERT INTO user_list (id, username) VALUES (?, ?) ON DUPLICATE KEY UPDATE id = ?");
        $l_PreparedStatement->BindParameter("s", Session::GetValue("user")->GetId());
        $l_PreparedStatement->BindParameter("s", Session::GetValue("user")->GetUsername());
        $l_PreparedStatement->BindParameter("s", Session::GetValue("user")->GetId());
        $l_PreparedStatement->Execute();
    }

    /// Get users in chat
    static public function GetUserList() : array
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
    static public function GetMessages() : array
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
}

class User
{
    /// Constructor
    /// @p_Id        : Id
    /// @p_Username  : Username
    /// @p_SessionId : Session Id
    public function __construct(int $p_Id, string $p_Username, string $p_SessionId)
    {
        $this->m_Id        = $p_Id;
        $this->m_Username  = $p_Username;
        $this->m_SessionId = $p_SessionId;
    }

    //////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////

    public function GetUsername() { return $this->m_Username;   }
    public function GetId()       { return $this->m_Id;         }

    //////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////

    private $m_Id;
    private $m_Username;
    private $m_SessionId;
}

?>