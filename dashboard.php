<?php

session_start();

    if (isset($_GET['signout'])) {
        session_unset();
        session_destroy();
        header("Location: home.php");
        exit;
    }

function getUserSessionData(): array {
    $user = $_SESSION['user'] ?? null;
    if (!$user) {
        return [
            'userId'     => '',
            'email'      => '',
            'fullName'   => '',
            'userType'   => '',
            'department' => '',
            'userStatus' => ''
        ];
    }

    return [
        'userId'     => $user['userId']     ?? '',
        'email'      => $user['email']      ?? '',
        'fullName'   => $user['fullName']   ?? '',
        'userType'   => $user['userType']   ?? '',
        'department' => $user['department'] ?? '',
        'userStatus' => $user['userStatus'] ?? 'inactive'
    ];
}


        // index.php
        $userData = getUserSessionData();
        $userId     = $userData['userId'];
        $email      = $userData['email'];
        $fullName   = $userData['fullName'];
        $userType   = $userData['userType'];
        $department = $userData['department'];
        $userStatus = $userData['userStatus'];


// Include the secure config
include_once("config/config.php"); // Adjust path based on your structure
include_once("includes/controller/head.php");
?>
    <!-- Pass Firebase config to JavaScript -->
    <script>
        window.firebaseConfig = <?php echo json_encode($firebaseConfig); ?>;
    </script>

<?php


// Check user session and status
//if (!$user || $user['userStatus'] !== 'active') {
// ============================================
// 🔥 ROUTE BASED ON AUTHENTICATION STATUS
// ============================================
if (!empty($userId) && $userStatus === 'Active') {
    
        include_once("includes/layout.php");
// 🔥 Route based on user type
    if ($userType === 'Customer') {
        include_once("includes/view/customer/dashboard.php");
    } elseif ($userType === 'BranchStaff') {
        include_once("includes/view/branch/dashboard.php");
    } elseif ($userType === 'office') {
        include_once("includes/view/office/dashboard.php");
    } elseif ($userType === 'Admin') {
        include_once("includes/view/admin/dashboard.php");
    } elseif ($userType === 'SuperAdmin') {
        include_once("includes/view/admin/dashboard.php");
    } else {
        // Fallback for other user types
        //include_once("includes/view/dashboardheader.php");
        include_once("includes/view/login.php");
    }
    
} else {
    // ❌ NOT AUTHENTICATED - Load Login
    include_once("includes/login.php");
}




include_once("includes/controller/script.php");

?>
