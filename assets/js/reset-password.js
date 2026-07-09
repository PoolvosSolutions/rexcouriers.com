
// assets/js/reset-password.js

function initResetPasswordView() {
    console.log("✅ Reset Password View Initialized");

    const $selfForm = $('#selfResetForm');
    const $adminForm = $('#adminResetForm');
    const $btnSelf = $('#btnSaveSelfReset');
    const $btnAdmin = $('#btnSendResetEmail');

    const successModal = new bootstrap.Modal(document.getElementById('successModalReset'));
    const errorModal = new bootstrap.Modal(document.getElementById('errorModalReset'));

    function showSuccess(msg) { $('#successMessageReset').text(msg); successModal.show(); }
    function showError(msg) { $('#errorMessageReset').text(msg); errorModal.show(); }

    // Password Toggle
    $(document).on('click', '.btn-toggle-pw', function() {
        const $input = $(this).closest('.input-group').find('input');
        const $icon = $(this).find('i');
        const isPassword = $input.attr('type') === 'password';
        $input.attr('type', isPassword ? 'text' : 'password');
        $icon.removeClass('bi-eye bi-eye-slash').addClass(isPassword ? 'bi-eye-slash' : 'bi-eye');
    });

    // Password Strength Meter
    $('#newPassword').on('input', function() {
        const val = $(this).val();
        const $bar = $(this).closest('.input-group').next().find('.strength-bar');
        let strength = 0;
        if (val.length >= 8) strength++;
        if (/[A-Z]/.test(val)) strength++;
        if (/[a-z]/.test(val)) strength++;
        if (/\d/.test(val)) strength++;
        if (/[@$!%*?&#]/.test(val)) strength++;

        $bar.css('width', (strength / 5) * 100 + '%').removeClass('medium strong');
        if (strength >= 3) $bar.addClass('medium');
        if (strength >= 5) $bar.addClass('strong');
    });

    // Password Validation Regex
    const pwRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;

    // 🔹 Self Reset Submission
    $selfForm.on('submit', async function(e) {
        e.preventDefault();
        if (!this.checkValidity()) { $selfForm.addClass('was-validated'); return; }

        const current = $('#currentPassword').val();
        const newPw = $('#newPassword').val();
        const confirm = $('#confirmNewPassword').val();

        if (!pwRegex.test(newPw)) { showError('Password does not meet strength requirements.'); return; }
        if (newPw !== confirm) { showError('Passwords do not match.'); return; }
        if (current === newPw) { showError('New password must be different from current password.'); return; }

        $btnSelf.prop('disabled', true).html('<span class="spinner-border spinner-border-sm me-2"></span> Updating...');

        try {
            // Verify current password first (Firebase requires re-auth for recent login)
            const { FirebaseAuth } = window; // Access via global if exposed, or import directly
            // Using direct SDK import for safety in this module
            import('https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js').then(async ({ getAuth, signInWithEmailAndPassword, updatePassword }) => {
                const auth = getAuth();
                const user = auth.currentUser;
                
                if (!user) { showError('You are not logged in.'); return; }

                // Re-authenticate
                await signInWithEmailAndPassword(auth, user.email, current);
                await updatePassword(user, newPw);
                
                showSuccess('Password updated successfully!');
                $selfForm[0].reset();
                $selfForm.removeClass('was-validated');
                $('.strength-bar').css('width', '0%').removeClass('medium strong');
            });
        } catch (error) {
            console.error(error);
            let msg = 'Failed to update password.';
            if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
                msg = 'Current password is incorrect.';
            } else if (error.code === 'auth/requires-recent-login') {
                msg = 'Session expired. Please log out and log back in, or use the email reset method.';
            }
            showError(msg);
        } finally {
            $btnSelf.prop('disabled', false).html('<i class="bi bi-check-circle-fill me-1"></i> Update Password');
        }
    });

    // 🔹 Admin Reset Email Submission
    $adminForm.on('submit', async function(e) {
        e.preventDefault();
        if (!this.checkValidity()) { $adminForm.addClass('was-validated'); return; }

        const email = $('#resetEmail').val().trim().toLowerCase();
        $btnAdmin.prop('disabled', true).html('<span class="spinner-border spinner-border-sm me-2"></span> Sending...');

        try {
            const response = await $.ajax({
                url: 'api/send-password-reset.php',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({ email })
            });

            if (response.success) {
                showSuccess(response.message);
                $adminForm[0].reset();
                $adminForm.removeClass('was-validated');
            } else {
                showError(response.message);
            }
        } catch (error) {
            showError('Network error. Please try again.');
        } finally {
            $btnAdmin.prop('disabled', false).html('<i class="bi bi-send me-1"></i> Send Reset Link');
        }
    });
}

