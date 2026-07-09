<?php
// ============================================
// home.PHP - Main Entry Point
// ============================================
session_start();

// 🔥 PREVENT CACHING
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");
header("Expires: 0");

// ============================================
// 🔥 HANDLE SIGNOUT
// ============================================
if (isset($_GET['signout'])) {
    $_SESSION = array();
    if (ini_get("session.use_cookies")) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000, $params["path"], $params["domain"], $params["secure"], $params["httponly"]);
    }
    session_destroy();
    header("Location: home.php?_=" . time());
    exit;
}

// ============================================
// 🔥 SESSION DATA HELPER FUNCTION
// ============================================
function getUserSessionData(): array {
    $user = $_SESSION['user'] ?? null;
    if (!$user) {
        return [
            'userId' => '', 'email' => '', 'fullName' => '', 'userType' => '', 
            'userStatus' => '', 'userCode' => '', 'merchantCode' => '', 
            'merchantName' => '', 'branchCode' => '', 'branchName' => ''
        ];
    }

    return [
        'userId'       => $user['userId']       ?? '',
        'email'        => $user['email']        ?? '',
        'fullName'     => $user['fullName']     ?? '',
        'userType'     => $user['userType']     ?? '',
        'userStatus'   => $user['userStatus']   ?? '',
        'userCode'     => $user['userCode']     ?? '',
        'merchantCode' => $user['merchantCode'] ?? '', // 🔥 ADDED
        'merchantName' => $user['merchantName'] ?? '', // 🔥 ADDED
        'branchCode'   => $user['branchCode']   ?? '', // 🔥 ADDED
        'branchName'   => $user['branchName']   ?? ''  // 🔥 ADDED
    ];
}

// ============================================
// 🔥 EXTRACT USER DATA
// ============================================
$userData     = getUserSessionData();
$userId       = $userData['userId'];
$email        = $userData['email'];
$fullName     = $userData['fullName'];
$userType     = $userData['userType'];
$userStatus   = $userData['userStatus'];
$userCode     = $userData['userCode'];
$merchantCode = $userData['merchantCode']; // 🔥 ADDED
$merchantName = $userData['merchantName']; // 🔥 ADDED
$branchCode   = $userData['branchCode'];   // 🔥 ADDED
$branchName   = $userData['branchName'];   // 🔥 ADDED

// ============================================
// 🔥 INCLUDE CONFIG & HEAD
// ============================================
include_once("config/config.php");
include_once("includes/controller/head.php"); // Outputs <head> and opens <body>
?>

<!-- 🔥 Pass Firebase Config & Session Data to JavaScript -->
<script>
    window.firebaseConfig = <?php echo json_encode($firebaseConfig); ?>;
    window.sessionData = {
        userId: <?php echo json_encode($userId); ?>,
        email: <?php echo json_encode($email); ?>,
        fullName: <?php echo json_encode($fullName); ?>,
        userType: <?php echo json_encode($userType); ?>,
        userStatus: <?php echo json_encode($userStatus); ?>,
        userCode: <?php echo json_encode($userCode); ?>,
        merchantCode: <?php echo json_encode($merchantCode); ?>,
        merchantName: <?php echo json_encode($merchantName); ?>,
        branchCode: <?php echo json_encode($branchCode); ?>,
        branchName: <?php echo json_encode($branchName); ?>
    };

    if (window.sessionData.userId) {
        Object.keys(window.sessionData).forEach(function(key) {
            if (window.sessionData[key]) sessionStorage.setItem(key, window.sessionData[key]);
        });
    }
</script>

<?php
// ============================================
// 🔥 ROUTE BASED ON AUTHENTICATION STATUS
// ============================================
if (!empty($userId) && $userStatus === 'Active') {

} else {
}
// Include the header
include_once("includes/view/public/header.php");
// Include the slider
include_once("includes/view/public/slider.php");

// Include the services
include_once("includes/view/public/services.php");

// Include about us
include_once("includes/view/public/aboutus.php");
// Include contact us
include_once("includes/view/public/contactus.php");
// Include footer
include_once("includes/view/public/footer.php");

// ============================================
// 🔥 INCLUDE SCRIPTS
// ============================================
include_once("includes/controller/script.php");
?>