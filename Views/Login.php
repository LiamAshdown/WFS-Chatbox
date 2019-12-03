<div class="login-box middle-of-screen">

    <form id="register-form" method="post">
        <h1>Register an account</h1>
        <label>Username</label>
        <div class="input-box">
            <input type="text" id="register-username" oninput="ValidateUsername(this.value);">
            <div class="requirement" id = "requirement-username"></div>
        </div>
        <label>Password</label>
        <input type="password" name="register-password">
        <label>Confirm Password</label>
        <input type="password" name="register-confirmpassword">
        <button>REGISTER</button>
        <p>Already registered? <a href ="javascript:;" onclick="ShowElement('register-form', 'login-form')"><br>Sign In</a></p>
    </form>
    <form id="login-form" method="post">
        <h1>Login</h1>
        <label>Username</label>
        <input type="text" name="register-username">
        <label>Password</label>
        <input type="password" name="register-password">
        <button>LOGIN</button>
        <p>Not registered? <a href ="javascript:;" onclick="ShowElement('login-form', 'register-form')"><br>Create an account</a></p>
    </form>
</div>