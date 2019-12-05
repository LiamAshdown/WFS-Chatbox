<div id="login-box" class ="middle-of-screen">
    <form id="register-form" method="post">
        <h1>Register an account</h1>

        <label>Username</label>
        <input type="text" id="register-username" name="register-username" oninput="ValidateUsername(this.value);">
        <div class="requirement" id="requirement-username"></div>

        <label>Password</label>
        <input type="password" id="register-password" name="register-password" oninput="ValidatePassword(this.value);">
        <div class="requirement" id="requirement-password"></div>

        <label>Confirm Password</label>
        <input type="password" id="register-confirmpassword" name="register-confirmpassword" oninput="ValidateConfirmPassword(this.value);">
        <div class="requirement" id="requirement-confirmpassword"></div>

        <input type="submit" value="REGISTER">
        <p>Already registered? <a href ="javascript:;" onclick="ShowElement('register-form', 'login-form')"><br>Sign In</a></p>
    </form>
    <form id="login-form" method="post">
        <h1>Login</h1>

        <div class="requirement" id="requirement-login"></div>

        <label>Username</label>
        <input type="text" id="login-username" name="login-username">

        <label>Password</label>
        <input type="password" id="login-password" name="login-password">

        <input type="submit" value="LOGIN">
        <p>Not registered? <a href ="javascript:;" onclick="ShowElement('login-form', 'register-form')"><br>Create an account</a></p>
    </form>
</div>

<script src="js/login.js"></script>