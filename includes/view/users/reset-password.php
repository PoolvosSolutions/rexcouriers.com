
<!-- includes/views/users/reset-password.php -->
<div class="container-fluid py-4 reset-password-wrapper">
    <!-- Page Header -->
    <div class="row mb-4">
        <div class="col-12">
            <div class="page-header-card d-flex flex-column flex-md-row justify-content-between align-items-center p-4 rounded-3 shadow-sm">
                <div class="header-title mb-3 mb-md-0">
                    <h3 class="mb-1 fw-bold text-white"><i class="bi bi-shield-lock me-2"></i>Reset Password</h3>
                    <p class="mb-0 text-white-50">Securely update passwords for your account or other users.</p>
                </div>
            </div>
        </div>
    </div>

    <!-- Tabs -->
    <ul class="nav nav-tabs mb-4" id="resetTabs" role="tablist">
        <li class="nav-item" role="presentation">
            <button class="nav-link active" id="self-tab" data-bs-toggle="tab" data-bs-target="#self-reset" type="button" role="tab">
                <i class="bi bi-person-lock me-1"></i> Change My Password
            </button>
        </li>
        <li class="nav-item" role="presentation">
            <button class="nav-link" id="admin-tab" data-bs-toggle="tab" data-bs-target="#admin-reset" type="button" role="tab">
                <i class="bi bi-envelope-at me-1"></i> Send Reset Email to User
            </button>
        </li>
    </ul>

    <div class="tab-content" id="resetTabsContent">
        <!-- Tab 1: Self Reset -->
        <div class="tab-pane fade show active" id="self-reset" role="tabpanel">
            <div class="card border-0 shadow-sm">
                <div class="card-body p-4 p-md-5">
                    <form id="selfResetForm" novalidate>
                        <div class="alert alert-info mb-4">
                            <i class="bi bi-info-circle me-2"></i>
                            For security, you must have logged in recently to change your password. If you've been inactive for too long, use the "Send Reset Email" tab instead.
                        </div>
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label for="currentPassword" class="form-label fw-semibold">Current Password <span class="text-danger">*</span></label>
                                <div class="input-group">
                                    <input type="password" class="form-control" id="currentPassword" required>
                                    <button class="btn btn-outline-secondary btn-toggle-pw" type="button"><i class="bi bi-eye"></i></button>
                                </div>
                            </div>
                            <div class="col-md-6"></div>
                            <div class="col-md-6">
                                <label for="newPassword" class="form-label fw-semibold">New Password <span class="text-danger">*</span></label>
                                <div class="input-group">
                                    <input type="password" class="form-control" id="newPassword" required>
                                    <button class="btn btn-outline-secondary btn-toggle-pw" type="button"><i class="bi bi-eye"></i></button>
                                </div>
                                <div class="password-strength mt-1" style="height: 4px; background: #e9ecef; border-radius: 2px;">
                                    <div class="strength-bar" style="height: 100%; width: 0; transition: width 0.3s;"></div>
                                </div>
                                <small class="text-muted mt-1 d-block" id="pwHint">Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special</small>
                            </div>
                            <div class="col-md-6">
                                <label for="confirmNewPassword" class="form-label fw-semibold">Confirm New Password <span class="text-danger">*</span></label>
                                <input type="password" class="form-control" id="confirmNewPassword" required>
                            </div>
                            <div class="col-12 mt-4">
                                <button type="submit" class="btn btn-indigo px-5" id="btnSaveSelfReset">
                                    <i class="bi bi-check-circle-fill me-1"></i> Update Password
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        <!-- Tab 2: Admin Reset Email -->
        <div class="tab-pane fade" id="admin-reset" role="tabpanel">
            <div class="card border-0 shadow-sm">
                <div class="card-body p-4 p-md-5">
                    <form id="adminResetForm" novalidate>
                        <div class="alert alert-warning mb-4">
                            <i class="bi bi-envelope me-2"></i>
                            This will send a secure password reset link to the user's email. The link expires after 1 hour.
                        </div>
                        <div class="row g-3">
                            <div class="col-md-8">
                                <label for="resetEmail" class="form-label fw-semibold">User Email <span class="text-danger">*</span></label>
                                <input type="email" class="form-control" id="resetEmail" placeholder="e.g. user@example.com" required>
                                <div class="invalid-feedback">Valid email required.</div>
                            </div>
                            <div class="col-md-4 d-flex align-items-end">
                                <button type="submit" class="btn btn-indigo w-100" id="btnSendResetEmail">
                                    <i class="bi bi-send me-1"></i> Send Reset Link
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Success Modal -->
<div class="modal fade" id="successModalReset" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-sm">
        <div class="modal-content border-0 shadow-lg">
            <div class="modal-body text-center p-5">
                <div class="mb-4"><i class="bi bi-check-circle-fill text-success" style="font-size: 4rem;"></i></div>
                <h4 class="fw-bold mb-2">Success!</h4>
                <p class="text-muted mb-4" id="successMessageReset">Action completed.</p>
                <button type="button" class="btn btn-success w-100" data-bs-dismiss="modal">Done</button>
            </div>
        </div>
    </div>
</div>

<!-- Error Modal -->
<div class="modal fade" id="errorModalReset" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-sm">
        <div class="modal-content border-0 shadow-lg">
            <div class="modal-body text-center p-5">
                <div class="mb-4"><i class="bi bi-exclamation-triangle-fill text-danger" style="font-size: 4rem;"></i></div>
                <h4 class="fw-bold mb-2">Error!</h4>
                <p class="text-muted mb-4" id="errorMessageReset">Something went wrong.</p>
                <button type="button" class="btn btn-danger w-100" data-bs-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>

