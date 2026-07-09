<?php
// includes/view/admin/adduser.php
// 🔥 Add User Form - Rexcouris
?>

<div class="container-fluid py-4 adduser-page">
    
    <!-- Page Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
            <h3 class="mb-1"><i class="bi bi-person-plus-fill text-danger me-2"></i>Add New User</h3>
            <p class="text-muted mb-0 small">Create a new user account with specific role and access permissions</p>
        </div>
        <button type="button" class="btn btn-outline-secondary" onclick="loadView('users')">
            <i class="bi bi-arrow-left me-1"></i> Back to List
        </button>
    </div>

    <!-- 🔥 SECURITY NOTICE -->
    <div class="alert alert-info border-0 shadow-sm mb-4" role="alert">
        <div class="d-flex align-items-start">
            <i class="bi bi-shield-lock-fill me-2 mt-1"></i>
            <div>
                <strong class="d-block mb-1">User Account Creation</strong>
                <small class="text-muted">
                    User accounts are linked to Firebase Authentication. Ensure you assign the correct role and permissions. 
                    For <strong>Customer</strong> users, you must link them to an existing customer profile. 
                    For <strong>Branch/Rider</strong> users, you must assign them to a branch.
                </small>
            </div>
        </div>
    </div>

    <!-- 🔥 MAIN FORM -->
    <form id="addUserForm" novalidate>
        
        <!-- ============================================ -->
        <!-- SECTION 1: USER TYPE SELECTION               -->
        <!-- ============================================ -->
        <div class="rex-form-card mb-4">
            <div class="rex-form-card-header">
                <h5 class="mb-0"><i class="bi bi-person-badge me-2"></i>Select User Role <span class="text-danger">*</span></h5>
                <small class="text-muted d-block mt-1">Choose the role that defines this user's access level</small>
            </div>
            <div class="rex-form-card-body">
                <div class="user-type-grid">
                    
                    <div class="user-type-item">
                        <input class="form-check-input user-type-radio" type="radio" name="userType" id="typeSuperAdmin" value="SuperAdmin">
                        <label class="user-type-label" for="typeSuperAdmin">
                            <i class="bi bi-shield-lock-fill"></i>
                            <strong>Super Admin</strong>
                            <small>Full system access</small>
                        </label>
                    </div>

                    <div class="user-type-item">
                        <input class="form-check-input user-type-radio" type="radio" name="userType" id="typeAdmin" value="Admin">
                        <label class="user-type-label" for="typeAdmin">
                            <i class="bi bi-person-gear"></i>
                            <strong>Admin</strong>
                            <small>Branch & operations</small>
                        </label>
                    </div>

                    <div class="user-type-item">
                        <input class="form-check-input user-type-radio" type="radio" name="userType" id="typeOffice" value="Office">
                        <label class="user-type-label" for="typeOffice">
                            <i class="bi bi-building"></i>
                            <strong>Office Staff</strong>
                            <small>Office operations</small>
                        </label>
                    </div>

                    <div class="user-type-item">
                        <input class="form-check-input user-type-radio" type="radio" name="userType" id="typeBranch" value="Branch">
                        <label class="user-type-label" for="typeBranch">
                            <i class="bi bi-geo-alt-fill"></i>
                            <strong>Branch Staff</strong>
                            <small>Branch operations</small>
                        </label>
                    </div>

                    <div class="user-type-item">
                        <input class="form-check-input user-type-radio" type="radio" name="userType" id="typeRider" value="Rider">
                        <label class="user-type-label" for="typeRider">
                            <i class="bi bi-bicycle"></i>
                            <strong>Rider</strong>
                            <small>Delivery operations</small>
                        </label>
                    </div>

                    <div class="user-type-item">
                        <input class="form-check-input user-type-radio" type="radio" name="userType" id="typeCustomer" value="Customer">
                        <label class="user-type-label" for="typeCustomer">
                            <i class="bi bi-person-badge-fill"></i>
                            <strong>Customer</strong>
                            <small>Portal access</small>
                        </label>
                    </div>

                </div>
            </div>
        </div>

        <!-- ============================================ -->
        <!-- SECTION 2: BASIC INFORMATION                 -->
        <!-- ============================================ -->
        <div class="rex-form-card mb-4">
            <div class="rex-form-card-header">
                <h5 class="mb-0"><i class="bi bi-person-vcard me-2"></i>Basic Information</h5>
            </div>
            <div class="rex-form-card-body">
                <div class="row g-3">
                    
                    <!-- Full Name -->
                    <div class="col-md-6">
                        <div class="form-floating rex-floating-group">
                            <input type="text" class="form-control" id="fullName" required 
                                   placeholder="Full Name">
                            <label for="fullName"><i class="bi bi-person me-2"></i>Full Name <span class="text-danger">*</span></label>
                        </div>
                    </div>

                    <!-- Email (Username) -->
                    <div class="col-md-6">
                        <div class="form-floating rex-floating-group">
                            <input type="email" class="form-control" id="userEmail" required 
                                   placeholder="email@example.com">
                            <label for="userEmail"><i class="bi bi-envelope me-2"></i>Email Address (Login ID) <span class="text-danger">*</span></label>
                        </div>
                        <small class="text-muted mt-1 d-block">This will be used as the login username</small>
                    </div>

                    <!-- Contact Number -->
                    <div class="col-md-4">
                        <div class="form-floating rex-floating-group">
                            <div class="input-group">
                                <span class="input-group-text rex-dialing-code">+92</span>
                                <input type="tel" class="form-control" id="contactNumber" 
                                       placeholder="3001234567" maxlength="10">
                            </div>
                            <label for="contactNumber"><i class="bi bi-phone me-2"></i>Contact Number</label>
                        </div>
                    </div>

                    <!-- CNIC Number -->
                    <div class="col-md-4">
                        <div class="form-floating rex-floating-group">
                            <input type="text" class="form-control" id="cnicNumber" 
                                   placeholder="12345-1234567-1" maxlength="15">
                            <label for="cnicNumber"><i class="bi bi-person-badge me-2"></i>CNIC Number</label>
                        </div>
                    </div>

                    <!-- Designation -->
                    <div class="col-md-4">
                        <div class="form-floating rex-floating-group">
                            <input type="text" class="form-control" id="designation" 
                                   placeholder="Designation">
                            <label for="designation"><i class="bi bi-briefcase me-2"></i>Designation / Job Title</label>
                        </div>
                    </div>

                </div>
            </div>
        </div>

        <!-- ============================================ -->
        <!-- SECTION 3: LINKED ENTITY (CONDITIONAL)       -->
        <!-- ============================================ -->
        
        <!-- 🔥 BRANCH SELECTION (Shows for Branch & Rider) -->
        <div class="rex-form-card mb-4 d-none" id="branchSection">
            <div class="rex-form-card-header">
                <h5 class="mb-0"><i class="bi bi-geo-alt me-2"></i>Branch Assignment <span class="text-danger">*</span></h5>
                <small class="text-muted d-block mt-1">Assign this user to a specific branch</small>
            </div>
            <div class="rex-form-card-body">
                <div class="row g-3">
                    <div class="col-md-6">
                        <div class="form-floating rex-floating-group">
                            <select class="form-select" id="branchSelect">
                                <option value="" disabled selected>Select Branch</option>
                                <!-- Will be populated dynamically -->
                            </select>
                            <label for="branchSelect"><i class="bi bi-building me-2"></i>Branch <span class="text-danger">*</span></label>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="branch-info-card" id="branchInfoCard">
                            <div class="branch-info-placeholder">
                                <i class="bi bi-info-circle"></i>
                                <p class="mb-0">Select a branch to see details</p>
                            </div>
                            <div class="branch-info-content d-none" id="branchInfoContent">
                                <div class="branch-info-row">
                                    <span class="label">Branch Code:</span>
                                    <span class="value" id="branchCode">-</span>
                                </div>
                                <div class="branch-info-row">
                                    <span class="label">City:</span>
                                    <span class="value" id="branchCity">-</span>
                                </div>
                                <div class="branch-info-row">
                                    <span class="label">Contact:</span>
                                    <span class="value" id="branchContact">-</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 🔥 CUSTOMER SELECTION (Shows for Customer type) -->
        <div class="rex-form-card mb-4 d-none" id="customerSection">
            <div class="rex-form-card-header">
                <h5 class="mb-0"><i class="bi bi-person-badge me-2"></i>Link to Customer Profile <span class="text-danger">*</span></h5>
                <small class="text-muted d-block mt-1">Select the customer profile this user will be linked to</small>
            </div>
            <div class="rex-form-card-body">
                <div class="row g-3">
                    <div class="col-md-6">
                        <div class="form-floating rex-floating-group">
                            <select class="form-select" id="customerSelect">
                                <option value="" disabled selected>Search & Select Customer</option>
                                <!-- Will be populated dynamically -->
                            </select>
                            <label for="customerSelect"><i class="bi bi-search me-2"></i>Customer <span class="text-danger">*</span></label>
                        </div>
                        <small class="text-muted mt-1 d-block">Type to search by name, account #, or contact</small>
                    </div>
                    <div class="col-md-6">
                        <div class="customer-info-card" id="customerInfoCard">
                            <div class="customer-info-placeholder">
                                <i class="bi bi-info-circle"></i>
                                <p class="mb-0">Select a customer to see details</p>
                            </div>
                            <div class="customer-info-content d-none" id="customerInfoContent">
                                <div class="customer-info-header">
                                    <i class="bi bi-person-circle"></i>
                                    <div>
                                        <h6 class="mb-0" id="customerDisplayName">-</h6>
                                        <small class="text-muted" id="customerAccountNumber">-</small>
                                    </div>
                                </div>
                                <div class="customer-info-row">
                                    <span class="label">Type:</span>
                                    <span class="value" id="customerType">-</span>
                                </div>
                                <div class="customer-info-row">
                                    <span class="label">Contact:</span>
                                    <span class="value" id="customerContact">-</span>
                                </div>
                                <div class="customer-info-row">
                                    <span class="label">Province:</span>
                                    <span class="value" id="customerProvince">-</span>
                                </div>
                                <div class="customer-info-row">
                                    <span class="label">Status:</span>
                                    <span class="value" id="customerStatus">-</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- ============================================ -->
        <!-- SECTION 4: CREDENTIALS                       -->
        <!-- ============================================ -->
        <div class="rex-form-card mb-4">
            <div class="rex-form-card-header d-flex justify-content-between align-items-center">
                <h5 class="mb-0"><i class="bi bi-key me-2"></i>Login Credentials</h5>
                <button type="button" class="btn btn-sm btn-outline-primary" id="btnGeneratePassword">
                    <i class="bi bi-magic me-1"></i> Generate Strong Password
                </button>
            </div>
            <div class="rex-form-card-body">
                <div class="row g-3">
                    
                    <!-- Password -->
                    <div class="col-md-6">
                        <div class="form-floating rex-floating-group rex-password-wrapper">
                            <input type="password" class="form-control" id="userPassword" required 
                                   placeholder="Password" minlength="8">
                            <label for="userPassword"><i class="bi bi-lock me-2"></i>Password <span class="text-danger">*</span></label>
                            <button type="button" class="rex-password-toggle" data-target="userPassword" aria-label="Toggle password visibility">
                                <i class="bi bi-eye-fill"></i>
                            </button>
                        </div>
                        
                        <!-- Password Strength Meter -->
                        <div class="password-strength-meter mt-2">
                            <div class="strength-bar">
                                <div class="strength-fill" id="strengthFill"></div>
                            </div>
                            <div class="d-flex justify-content-between mt-1">
                                <small class="text-muted" id="strengthText">Password strength</small>
                                <small class="text-muted" id="strengthLevel">-</small>
                            </div>
                        </div>

                        <!-- Password Requirements -->
                        <div class="password-requirements mt-3">
                            <small class="fw-semibold d-block mb-2">Password must contain:</small>
                            <div class="requirement-item" id="reqLength">
                                <i class="bi bi-circle"></i> At least 8 characters
                            </div>
                            <div class="requirement-item" id="reqUpper">
                                <i class="bi bi-circle"></i> One uppercase letter
                            </div>
                            <div class="requirement-item" id="reqLower">
                                <i class="bi bi-circle"></i> One lowercase letter
                            </div>
                            <div class="requirement-item" id="reqNumber">
                                <i class="bi bi-circle"></i> One number
                            </div>
                            <div class="requirement-item" id="reqSpecial">
                                <i class="bi bi-circle"></i> One special character (!@#$%^&*)
                            </div>
                        </div>
                    </div>

                    <!-- Confirm Password -->
                    <div class="col-md-6">
                        <div class="form-floating rex-floating-group rex-password-wrapper">
                            <input type="password" class="form-control" id="confirmPassword" required 
                                   placeholder="Confirm Password">
                            <label for="confirmPassword"><i class="bi bi-lock-fill me-2"></i>Confirm Password <span class="text-danger">*</span></label>
                            <button type="button" class="rex-password-toggle" data-target="confirmPassword" aria-label="Toggle password visibility">
                                <i class="bi bi-eye-fill"></i>
                            </button>
                        </div>

                        <!-- Match Indicator -->
                        <div class="password-match-indicator mt-2" id="matchIndicator">
                            <i class="bi bi-circle" id="matchIcon"></i>
                            <small id="matchText">Passwords do not match</small>
                        </div>

                        <!-- Security Tips -->
                        <div class="security-tips mt-4">
                            <small class="fw-semibold d-block mb-2"><i class="bi bi-shield-check me-1"></i>Security Tips:</small>
                            <ul class="small text-muted mb-0">
                                <li>Never share passwords via email or chat</li>
                                <li>Use a unique password for each account</li>
                                <li>Change password every 90 days</li>
                                <li>Enable 2FA when available</li>
                            </ul>
                        </div>
                    </div>

                </div>
            </div>
        </div>

        <!-- ============================================ -->
        <!-- SECTION 5: ACCESS SETTINGS                   -->
        <!-- ============================================ -->
        <div class="rex-form-card mb-4">
            <div class="rex-form-card-header">
                <h5 class="mb-0"><i class="bi bi-shield-check me-2"></i>Access Settings</h5>
            </div>
            <div class="rex-form-card-body">
                <div class="row g-3">
                    
                    <!-- Account Status -->
                    <div class="col-md-4">
                        <div class="form-floating rex-floating-group">
                            <select class="form-select" id="userStatus">
                                <option value="Active" selected>Active</option>
                                <option value="Inactive">Inactive</option>
                                <option value="Suspended">Suspended</option>
                            </select>
                            <label for="userStatus"><i class="bi bi-toggle-on me-2"></i>Account Status</label>
                        </div>
                    </div>

                    <!-- Force Password Change -->
                    <div class="col-md-4">
                        <div class="rex-switch-group h-100">
                            <label class="rex-switch">
                                <input type="checkbox" id="forcePasswordChange" checked>
                                <span class="rex-switch-slider"></span>
                            </label>
                            <span class="rex-switch-label">Force Password Change<br><small class="text-muted">On first login</small></span>
                        </div>
                    </div>

                    
                    <!-- Notes -->
                    <div class="col-12">
                        <div class="form-floating rex-floating-group">
                            <textarea class="form-control" id="userNotes" placeholder="Notes" style="height: 80px"></textarea>
                            <label for="userNotes"><i class="bi bi-sticky me-2"></i>Internal Notes</label>
                        </div>
                    </div>

                </div>
            </div>
        </div>

        <!-- ============================================ -->
        <!-- FORM ACTIONS                                 -->
        <!-- ============================================ -->
        <div class="rex-form-actions">
            <button type="button" class="btn btn-outline-secondary" onclick="loadView('users')">
                <i class="bi bi-x-circle me-1"></i> Cancel
            </button>
            <button type="submit" class="btn btn-rex-primary" id="btnSaveUser">
                <span class="btn-text"><i class="bi bi-check-circle me-1"></i> Create User Account</span>
                <span class="btn-loader d-none">
                    <span class="spinner-border spinner-border-sm me-2"></span> Creating...
                </span>
            </button>
        </div>

    </form>
</div>

<!-- SUCCESS MODAL -->
<div class="modal fade" id="userSuccessModal" tabindex="-1" data-bs-backdrop="static">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow">
            <div class="modal-body text-center p-5">
                <div class="success-icon-wrapper mb-4"><i class="bi bi-check-circle-fill"></i></div>
                <h3 class="fw-bold mb-2">User Account Created!</h3>
                <p class="text-muted mb-1" id="successMessage">New user has been created successfully.</p>
                <div class="credentials-card mt-3 mb-4">
                    <div class="credentials-row">
                        <span class="label">Email:</span>
                        <span class="value" id="successEmail">-</span>
                    </div>
                    <div class="credentials-row">
                        <span class="label">Role:</span>
                        <span class="value" id="successRole">-</span>
                    </div>
                    <div class="credentials-row">
                        <span class="label">Status:</span>
                        <span class="value" id="successStatus">-</span>
                    </div>
                </div>
                <div class="alert alert-warning small text-start" role="alert">
                    <i class="bi bi-exclamation-triangle-fill me-1"></i>
                    <strong>Important:</strong> Share the credentials securely with the user. They will be required to change the password on first login.
                </div>
                <div class="d-flex gap-2 justify-content-center">
                    <button type="button" class="btn btn-outline-secondary" id="btnAddAnotherUser">
                        <i class="bi bi-plus-circle me-1"></i> Add Another
                    </button>
                    <button type="button" class="btn btn-rex-primary" id="btnViewUserList">
                        <i class="bi bi-list-ul me-1"></i> View All Users
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- ERROR MODAL -->
<div class="modal fade" id="userErrorModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow">
            <div class="modal-header bg-danger text-white border-0">
                <h5 class="modal-title"><i class="bi bi-exclamation-triangle-fill me-2"></i>Error</h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body py-4">
                <p id="userErrorMessage" class="mb-0 fs-5 text-center">Something went wrong.</p>
            </div>
            <div class="modal-footer border-0 justify-content-center">
                <button type="button" class="btn btn-secondary px-4" data-bs-dismiss="modal">Try Again</button>
            </div>
        </div>
    </div>
</div>