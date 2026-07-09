

<?php
// includes/views/customer/profile.php
// 🔥 Customer Profile View

if (session_status() === PHP_SESSION_NONE) session_start();
$user = $_SESSION['user'] ?? [];
$fullName = $user['fullName'] ?? 'Customer';
$email = $user['email'] ?? '';
$userCode = $user['userCode'] ?? '';
?>

<div class="container-fluid py-4 customer-profile">
    
    <!-- ============================================ -->
    <!-- 🔥 PAGE HEADER                               -->
    <!-- ============================================ -->
    <div class="row mb-4">
        <div class="col-12">
            <div class="profile-header-card p-4 rounded-3 shadow-sm">
                <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                    <div>
                        <h3 class="mb-1 fw-bold text-white">
                            <i class="bi bi-person-circle me-2"></i>My Profile
                        </h3>
                        <p class="mb-0 text-white-50">
                            Manage your personal information and account settings
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- ============================================ -->
    <!-- 🔥 PROFILE AVATAR & BASIC INFO               -->
    <!-- ============================================ -->
    <div class="row mb-4">
        <div class="col-12">
            <div class="card border-0 shadow-sm">
                <div class="card-body p-4">
                    <div class="row align-items-center">
                        <div class="col-md-4 text-center mb-3 mb-md-0">
                            <div class="profile-avatar-wrapper position-relative d-inline-block">
                                <img id="profileAvatar" 
                                     src="assets/img/userimg/udefault.png" 
                                     alt="Avatar" 
                                     class="profile-avatar rounded-circle shadow">
                                <label for="profileImageInput" class="avatar-edit-btn" title="Change Photo">
                                    <i class="bi bi-camera-fill"></i>
                                </label>
                                <input type="file" id="profileImageInput" class="d-none" accept="image/png, image/jpeg, image/jpg, image/webp">
                            </div>
                            <h4 class="fw-bold mt-3 mb-1" id="profileDisplayName">--</h4>
                            <div class="text-muted small mb-2" id="profileDisplayCode">--</div>
                            <div id="profileDisplayBadges">
                                <!-- Badges populated by JS -->
                            </div>
                        </div>
                        <div class="col-md-8">
                            <div class="profile-quick-stats">
                                <div class="quick-stat">
                                    <div class="quick-stat-icon bg-success bg-opacity-10 text-success">
                                        <i class="bi bi-check-circle"></i>
                                    </div>
                                    <div class="quick-stat-info">
                                        <div class="quick-stat-value" id="profileStatRedeemed">0</div>
                                        <div class="quick-stat-label">Redeemed</div>
                                    </div>
                                </div>
                                <div class="quick-stat">
                                    <div class="quick-stat-icon bg-pink bg-opacity-10 text-pink">
                                        <i class="bi bi-gift"></i>
                                    </div>
                                    <div class="quick-stat-info">
                                        <div class="quick-stat-value" id="profileStatGifts">0</div>
                                        <div class="quick-stat-label">Gifts</div>
                                    </div>
                                </div>
                                <div class="quick-stat">
                                    <div class="quick-stat-icon bg-warning bg-opacity-10 text-warning">
                                        <i class="bi bi-wallet2"></i>
                                    </div>
                                    <div class="quick-stat-info">
                                        <div class="quick-stat-value" id="profileStatWallet">0</div>
                                        <div class="quick-stat-label">In Wallet</div>
                                    </div>
                                </div>
                                <div class="quick-stat">
                                    <div class="quick-stat-icon bg-primary bg-opacity-10 text-primary">
                                        <i class="bi bi-cash-stack"></i>
                                    </div>
                                    <div class="quick-stat-info">
                                        <div class="quick-stat-value" id="profileStatSavings">Rs. 0</div>
                                        <div class="quick-stat-label">Total Savings</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- ============================================ -->
    <!-- 🔥 PERSONAL INFORMATION (Editable)           -->
    <!-- ============================================ -->
    <div class="row mb-4">
        <div class="col-12">
            <div class="card border-0 shadow-sm">
                <div class="card-header bg-white border-0 py-3 px-4">
                    <h5 class="fw-bold mb-0">
                        <i class="bi bi-person-fill me-2 text-primary"></i>Personal Information
                    </h5>
                </div>
                <div class="card-body p-4">
                    <form id="profileForm" novalidate>
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label class="form-label fw-semibold">
                                    Full Name <span class="text-danger">*</span>
                                </label>
                                <input type="text" class="form-control" id="profileFullName" required>
                                <div class="invalid-feedback">Please enter your name.</div>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label fw-semibold">Phone Number</label>
                                <input type="tel" class="form-control" id="profilePhone" placeholder="e.g. 03001234567">
                                <small class="text-muted">Optional, for account recovery</small>
                            </div>
                        </div>

                        <!-- Image Upload Status -->
                        <div id="profileUploadStatus" class="d-none mt-3">
                            <div class="d-flex align-items-center gap-2">
                                <div class="spinner-border spinner-border-sm text-primary" role="status"></div>
                                <span id="profileUploadText">Uploading image...</span>
                            </div>
                            <div class="progress mt-2" style="height: 4px;">
                                <div class="progress-bar bg-primary progress-bar-striped progress-bar-animated" 
                                     id="profileUploadProgress" role="progressbar" style="width: 0%"></div>
                            </div>
                        </div>

                        <!-- Save Button -->
                        <div class="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                            <button type="button" class="btn btn-outline-secondary" id="btnResetProfile">
                                <i class="bi bi-arrow-counterclockwise me-1"></i> Reset
                            </button>
                            <button type="submit" class="btn btn-primary" id="btnSaveProfile">
                                <i class="bi bi-check-circle me-1"></i> Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <!-- ============================================ -->
    <!-- 🔥 ACCOUNT INFORMATION (Read-Only)           -->
    <!-- ============================================ -->
    <div class="row mb-4">
        <div class="col-12">
            <div class="card border-0 shadow-sm">
                <div class="card-header bg-white border-0 py-3 px-4">
                    <h5 class="fw-bold mb-0">
                        <i class="bi bi-shield-lock me-2 text-primary"></i>Account Information
                    </h5>
                </div>
                <div class="card-body p-4">
                    <div class="account-info-grid">
                        <div class="account-info-item">
                            <div class="info-label">
                                <i class="bi bi-envelope"></i> Email Address
                            </div>
                            <div class="info-value">
                                <span id="profileEmail">--</span>
                                <span class="info-badge bg-light text-muted">Read-only</span>
                            </div>
                        </div>
                        <div class="account-info-item">
                            <div class="info-label">
                                <i class="bi bi-hash"></i> User Code
                            </div>
                            <div class="info-value">
                                <code id="profileUserCode">--</code>
                                <span class="info-badge bg-light text-muted">System Generated</span>
                            </div>
                        </div>
                        <div class="account-info-item">
                            <div class="info-label">
                                <i class="bi bi-patch-check"></i> Verification Status
                            </div>
                            <div class="info-value" id="profileVerification">
                                --
                            </div>
                        </div>
                        <div class="account-info-item">
                            <div class="info-label">
                                <i class="bi bi-calendar-check"></i> Member Since
                            </div>
                            <div class="info-value" id="profileJoinDate">
                                --
                            </div>
                        </div>
                        <div class="account-info-item">
                            <div class="info-label">
                                <i class="bi bi-clock-history"></i> Last Login
                            </div>
                            <div class="info-value" id="profileLastLogin">
                                --
                            </div>
                        </div>
                        <div class="account-info-item">
                            <div class="info-label">
                                <i class="bi bi-shield-check"></i> Account Status
                            </div>
                            <div class="info-value" id="profileAccountStatus">
                                --
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- ============================================ -->
    <!-- 🔥 SECURITY SECTION                          -->
    <!-- ============================================ -->
    <div class="row">
        <div class="col-12">
            <div class="card border-0 shadow-sm">
                <div class="card-header bg-white border-0 py-3 px-4">
                    <h5 class="fw-bold mb-0">
                        <i class="bi bi-key-fill me-2 text-primary"></i>Security
                    </h5>
                </div>
                <div class="card-body p-4">
                    <div class="security-options">
                        <div class="security-option">
                            <div class="security-option-icon bg-warning bg-opacity-10 text-warning">
                                <i class="bi bi-key"></i>
                            </div>
                            <div class="security-option-info">
                                <h6 class="mb-1 fw-bold">Change Password</h6>
                                <p class="mb-0 small text-muted">
                                    Update your account password for security
                                </p>
                            </div>
                            <button type="button" class="btn btn-outline-primary" id="btnChangePassword">
                                <i class="bi bi-arrow-right"></i>
                            </button>
                        </div>
                        <div class="security-option">
                            <div class="security-option-icon bg-info bg-opacity-10 text-info">
                                <i class="bi bi-shield-lock"></i>
                            </div>
                            <div class="security-option-info">
                                <h6 class="mb-1 fw-bold">Active Sessions</h6>
                                <p class="mb-0 small text-muted">
                                    You are currently logged in on this device
                                </p>
                            </div>
                            <span class="badge bg-success">Active</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- 🔥 Success Modal -->
<div class="modal fade" id="profileSuccessModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-sm">
        <div class="modal-content border-0 shadow-lg">
            <div class="modal-body text-center p-5">
                <div class="mb-3">
                    <i class="bi bi-check-circle-fill text-success" style="font-size: 4rem;"></i>
                </div>
                <h4 class="fw-bold mb-2">Saved!</h4>
                <p class="text-muted mb-4" id="profileSuccessMessage">Your profile has been updated.</p>
                <button type="button" class="btn btn-success w-100" data-bs-dismiss="modal">Done</button>
            </div>
        </div>
    </div>
</div>

<!-- 🔥 Error Modal -->
<div class="modal fade" id="profileErrorModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-sm">
        <div class="modal-content border-0 shadow-lg">
            <div class="modal-body text-center p-4">
                <div class="mb-3">
                    <i class="bi bi-exclamation-triangle-fill text-danger" style="font-size: 3rem;"></i>
                </div>
                <h5 class="fw-bold mb-2">Error!</h5>
                <p class="text-muted mb-3" id="profileErrorMessage">Something went wrong.</p>
                <button type="button" class="btn btn-danger w-100" data-bs-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>

<!-- 🔥 Change Password Info Modal -->
<div class="modal fade" id="changePasswordModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow-lg">
            <div class="modal-header bg-primary text-white border-0">
                <h5 class="modal-title">
                    <i class="bi bi-key me-2"></i>Change Password
                </h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body p-4">
                <div class="text-center mb-3">
                    <div class="password-icon-wrapper mx-auto">
                        <i class="bi bi-shield-lock"></i>
                    </div>
                </div>
                <p class="text-muted text-center mb-3">
                    For security reasons, password changes are handled through a secure email link.
                </p>
                <div class="alert alert-info small">
                    <i class="bi bi-info-circle me-1"></i>
                    Click the button below to receive a password reset email at your registered address.
                </div>
                <div class="mb-3">
                    <label class="form-label fw-semibold">Your Email</label>
                    <input type="email" class="form-control bg-light" id="passwordResetEmail" readonly>
                </div>
            </div>
            <div class="modal-footer border-0">
                <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-primary" id="btnSendPasswordReset">
                    <i class="bi bi-envelope me-1"></i> Send Reset Link
                </button>
            </div>
        </div>
    </div>
</div>


