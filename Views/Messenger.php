
<div class="chat-box middle-of-screen">
    <!-- Message Box -->
    <div id="chatter">
        <ul>
            <script>GetMessages();</script>
        </ul>
    </div>
        
    <!-- User Box -->
    <div id="users">
        <ul>
            <script>GetUsers();</script>
        </ul>
    </div>

    <!-- Input Box -->
    <form id="messenger-form" method="post">
        <input type="text" id="send-message" name="SendMessage" placeholder="Enter message..." autofocus>
        <input type="submit" value="Send">
    </form>
</div>