<?php
// login_ajax.php
require_once "database.php";
require_once "function.php";
header("Content-Type: application/json"); // Since we are sending a JSON response here (not an HTML document), set the MIME Type to application/json

//Because you are posting the data via fetch(), php has to retrieve it elsewhere.
$json_str = file_get_contents('php://input');
//This will store the data into an associative array
$json_obj = json_decode($json_str, true);

//Variables can be accessed as such:
$username = $json_obj['reg_username'];
$password = $json_obj['reg_password'];

$hashpw = password_hash($password, PASSWORD_DEFAULT);
$errorMSG = "Known Error";

// Get the username and make sure that it is alphanumeric with limited other characters.
// You shouldn't allow usernames with unusual characters anyway, but it's always best to perform a sanity check
// since we will be concatenating the string to load files from the filesystem.
// check
if (!preg_match('/^[\w_\-]+$/', $username)) {
    //echo "<hr>" . $username . "is a Invalid username";
    $errorMSG = "Incorrect Username:" . $username . " has special characters";
    json_error_msg(false, $errorMSG);
    // echo json_encode(array(
    //     "success" => false,
    //     "message" => "Incorrect Username: Special characters",
    // ));
    exit;
}

// check duplicated user name
$checkname = $mysqli->prepare("select * from user where username = ?");
if (!$checkname) {
    $errorMSG = "User Query Prep Failed: %s\n" . $mysqli->error;
    json_error_msg(false, $errorMSG);
    exit;

}
$checkname->bind_param('s', $username);
$checkname->execute();
$result = $checkname->get_result();
$row = mysqli_num_rows($result);
if ($row) {
    $errorMSG = "Incorrect Username: Such UserName has already exist!";
    json_error_msg(false, $errorMSG);
    //echo "Cannot create username: ($username), such username already exist";
    exit;
}
$checkname->close();

// insert into db
$stmt = $mysqli->prepare("insert into user (username, pw) values (?, ?)");
if (!$stmt) {
    $errorMSG = "Query Prep Failed: %s\n" . $mysqli->error;
    json_error_msg(false, $errorMSG);
}

$stmt->bind_param('ss', $username, $hashpw);
$stmt->execute();

if (!$stmt->errno) {
    echo json_encode(array(
        "success" => true,
        "message" => "Correct, User has been registered",
    ));
    exit;
} else {
    echo json_encode(array(
        "success" => false,
        "message" => "Incorrect Username or Password",
    ));
    exit;
}
$stmt->close();
