// assets/js/login.js - FIXED VERSION
import { FirebaseAuth, FirebaseDB } from "./firebase/firebase-crud.js";

$(document).ready(function() {
    console.log("🔐 [Login.js] Loaded and initialized.");
    
    if ($('#rexLoginForm').length === 0) {
        console.log("⚠️ Login form not found on this page.");
        return;
    }

    // Password toggle
    $('#togglePassword').on('click', function() {
        const passwordInput = $('#loginPassword');
        const icon = $(this).find('i');
        const type = passwordInput.attr('type') === 'password' ? 'text' : 'password';
        passwordInput.attr('type', type);
        icon.toggleClass('bi-eye-fill bi-eye-slash-fill');
    });

    // Form submission
    $('#rexLoginForm').on('submit', async function(e) {
        e.preventDefault();
        console.log("🚀 Form submitted, starting login process...");
        
        const $btn = $('#btnLogin');
        const $btnText = $btn.find('.btn-text');
        const $btnLoader = $btn.find('.btn-loader');

        const email = $('#loginEmail').val().trim();
        const password = $('#loginPassword').val();

        if (!email || !password) {
            showErrorModal("Please enter both email and password.");
            return;
        }

        $btn.prop('disabled', true);
        $btnText.addClass('d-none');
        $btnLoader.removeClass('d-none');

        try {
            // Step 1: Firebase Auth
            console.log("🔥 Step 1: Authenticating with Firebase...");
            const userCredential = await FirebaseAuth.login(email, password);
            const uid = userCredential.user.uid;
            console.log("✅ Firebase Auth successful. UID:", uid);

            // Step 2: Fetch user data
            console.log("📥 Step 2: Fetching user profile from DB...");
            const dbUser = await FirebaseDB.get(`users/${uid}`); 
            console.log("📥 DB User Data:", dbUser);

            if (!dbUser) {
                throw new Error("User profile not found in database.");
            }

            // 🔥 FIX #1: Check BOTH 'status' and 'userStatus' fields (case-insensitive)
            const userStatus = (dbUser.status || dbUser.userStatus || '').toLowerCase();
            console.log("🔍 User status:", userStatus);
            
            if (userStatus !== 'active') {
                throw new Error("Your account is inactive or suspended. Status: " + userStatus);
            }

            // 🔥 FIX #2: Get userType from either field
            let rawUserType = dbUser.userType || dbUser.type || 'customer';
            let formattedUserType = rawUserType.charAt(0).toUpperCase() + rawUserType.slice(1);
            console.log("🏷️ User Type:", formattedUserType);

            // Step 3: Sync to PHP session
            console.log("🔄 Step 3: Syncing session with PHP backend...");
            const syncResponse = await $.ajax({
                url: 'config/session_sync.php',
                type: 'POST',
                dataType: 'json',
                data: {
                    userId: uid,
                    email: dbUser.email || email,
                    fullName: dbUser.fullName || '',
                    userType: formattedUserType,
                    userStatus: 'Active',
                    userCode: dbUser.userCode || '',
                    merchantCode: dbUser.merchantCode || '',
                    merchantName: dbUser.merchantName || '',
                    branchCode: dbUser.branchCode || '',
                    branchName: dbUser.branchName || ''
                }
            });

            if (syncResponse.success) {
                console.log("✅ Login successful!");
                showSuccessModal(formattedUserType);
                
                setTimeout(() => {
                    window.location.href = 'dashboard.php?_=' + Date.now();
                }, 2000);
            } else {
                throw new Error(syncResponse.message || "Failed to sync session.");
            }

        } catch (error) {
            console.error("❌ Login Error:", error);
            
            let friendlyMessage = "An unexpected error occurred.";
            
            if (error.code) {
                switch (error.code) {
                    case 'auth/invalid-email':
                        friendlyMessage = "Invalid email address.";
                        break;
                    case 'auth/user-disabled':
                        friendlyMessage = "Account disabled.";
                        break;
                    case 'auth/user-not-found':
                    case 'auth/wrong-password':
                    case 'auth/invalid-credential':
                        friendlyMessage = "Invalid email or password. Please check and try again.";
                        break;
                    case 'auth/too-many-requests':
                        friendlyMessage = "Too many attempts. Wait a moment.";
                        break;
                    default:
                        friendlyMessage = error.message;
                }
            } else if (error.message) {
                friendlyMessage = error.message;
            }

            showErrorModal(friendlyMessage);
        } finally {
            $btn.prop('disabled', false);
            $btnText.removeClass('d-none');
            $btnLoader.addClass('d-none');
        }
    });

    function showErrorModal(message) {
        $('#loginErrorMessageText').text(message);
        const modalElement = document.getElementById('loginErrorModal');
        if (modalElement) {
            new bootstrap.Modal(modalElement).show();
        } else {
            alert(message);
        }
    }

    function showSuccessModal(userType) {
        $('#redirectUserTypeText').text(`Welcome, ${userType}!`);
        const modalElement = document.getElementById('loginSuccessModal');
        if (modalElement) {
            new bootstrap.Modal(modalElement).show();
        }
    }
});