<?php
// ============================================
// login.php - Authentication Entry Point
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
        setcookie(
            session_name(),
            '',
            time() - 42000,
            $params["path"],
            $params["domain"],
            $params["secure"],
            $params["httponly"]
        );
    }
    
    session_destroy();
    header("Location: login.php?_=" . time());
    exit;
}

// ============================================
// 🔥 SESSION DATA HELPER FUNCTION
// ============================================
function getUserSessionData(): array {
    $user = $_SESSION['user'] ?? null;
    if (!$user) {
        return [
            'userId'       => '', 'email' => '', 'fullName' => '', 
            'userType'     => '', 'userStatus' => '', 'userCode' => '',
            'merchantCode' => '', 'merchantName' => '', 'branchCode' => '', 'branchName' => ''
        ];
    }

    return [
        'userId'       => $user['userId']       ?? '',
        'email'        => $user['email']        ?? '',
        'fullName'     => $user['fullName']     ?? '',
        'userType'     => $user['userType']     ?? '',
        'userStatus'   => $user['userStatus']   ?? '',
        'userCode'     => $user['userCode']     ?? '',
        'merchantCode' => $user['merchantCode'] ?? '', 
        'merchantName' => $user['merchantName'] ?? '',
        'branchCode'   => $user['branchCode']   ?? '',
        'branchName'   => $user['branchName']   ?? ''
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
$merchantCode = $userData['merchantCode'];
$merchantName = $userData['merchantName'];
$branchCode   = $userData['branchCode'];
$branchName   = $userData['branchName'];

// ============================================
// 🔥 AUTHENTICATION CHECK - MUST BE FIRST!
// ============================================
// Check if user is already logged in BEFORE any HTML output
if (!empty($userId) && $userStatus === 'Active') {
    // ✅ USER IS LOGGED IN - Redirect to dashboard immediately
    header("Location: dashboard.php?_=" . time());
    exit; // Always exit after redirect
}

// ============================================
// 🔥 USER NOT LOGGED IN - Show Login Page
// ============================================
// Only include config and HTML AFTER confirming user needs to login
include_once("config/config.php");
include_once("includes/controller/head.php");
?>

<!-- 🔥 Pass Firebase Config to JavaScript -->
<script>
    window.firebaseConfig = <?php echo json_encode($firebaseConfig); ?>;
</script>

<!-- 🔥 Pass Session Data to JavaScript -->
<script>
    window.sessionData = {
        userId:       <?php echo json_encode($userId); ?>,
        email:        <?php echo json_encode($email); ?>,
        fullName:     <?php echo json_encode($fullName); ?>,
        userType:     <?php echo json_encode($userType); ?>,
        userStatus:   <?php echo json_encode($userStatus); ?>,
        userCode:     <?php echo json_encode($userCode); ?>,
        merchantCode: <?php echo json_encode($merchantCode); ?>,
        merchantName: <?php echo json_encode($merchantName); ?>,
        branchCode:   <?php echo json_encode($branchCode); ?>,
        branchName:   <?php echo json_encode($branchName); ?>
    };

    // 🔥 Auto-populate sessionStorage from PHP session
    if (window.sessionData.userId) {
        Object.keys(window.sessionData).forEach(function(key) {
            if (window.sessionData[key]) {
                sessionStorage.setItem(key, window.sessionData[key]);
            }
        });
    }
</script>

<?php
// 🔥 Load Login Page (No header/breadcrumb for login)
include_once("includes/login.php");

// ============================================
// 🔥 INCLUDE SCRIPTS
// ============================================
include_once("includes/controller/script.php");
?>