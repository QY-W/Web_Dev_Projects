<?php
require_once "database.php";
require_once "function.php";
// login_ajax.php
//ini_set("session.cookie_httponly", 1);
//session_start();
header("Content-Type: application/json"); // Since we are sending a JSON response here (not an HTML document), set the MIME Type to application/json
//Because you are posting the data via fetch(), php has to retrieve it elsewhere.
$json_str = file_get_contents('php://input');
//This will store the data into an associative array
$json_obj = json_decode($json_str, true);

//Variables can be accessed as such:
$username = $json_obj['username'];
$password = $json_obj['password'];
$hashpw = password_hash($password, PASSWORD_DEFAULT);
$errorMSG = "Known Error";
//This is equivalent to what you previously did with $_POST['username'] and $_POST['password']

// Use a prepared statement
$checkname = $mysqli->prepare("SELECT COUNT(*), id, pw FROM user WHERE username=?");
if (!$checkname) {
    $errorMSG = "User Query Prep Failed:" . $mysqli->error;
    json_error_msg(false, $errorMSG);
    exit;
}
$checkname->bind_param('s', $username);
$checkname->execute();
// Bind the results
$checkname->bind_result($cnt, $user_id, $pwd_hash);
$checkname->fetch();

// Compare the submitted password to the actual password hash
if ($cnt) {
    if ($cnt == 1 && password_verify($password, $pwd_hash)) {
        // Login succeeded!
        ini_set("session.cookie_httponly", 1);
        session_start();
        $_SESSION['user_id'] = $user_id;
        $_SESSION['user_name'] = $username;
        // CSRF put in token here
        $tokenval = bin2hex(openssl_random_pseudo_bytes(32));
        $_SESSION['token'] = $tokenval;

        echo json_encode(array(
            "success" => true,
            "message" => "Success, you are login now",
            "token" => $tokenval,
            "username" => $username,
            "userid" => $user_id,

        ));
        exit;
    } else {
        echo json_encode(array(
            "success" => false,
            "message" => "Incorrect Password or Existed username.",

        ));
        exit;
    }
} else {
    echo json_encode(array(
        "success" => false,
        "message" => "Username Not Exist",
    ));
    // header('refresh:5, url = login_page.php');
    exit;
}

$checkname->close();
