<?php
// includes/view/admin/users.php
// 🔥 User List View - Rexcouris
?>

<div class="container-fluid py-4 userview-page">
    
    <!-- PAGE HEADER -->
    <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
            <h3 class="mb-1"><i class="bi bi-people-fill text-danger me-2"></i>User Management</h3>
            <p class="text-muted mb-0 small">Manage all system users, roles, and access permissions</p>
        </div>
        <button type="button" class="btn btn-rex-primary" onclick="loadView('adduser')">
            <i class="bi bi-person-plus-fill me-1"></i> Add New User
        </button>
    </div>

    <!-- STATS CARDS -->
    <div class="row g-3 mb-4">
        <div class="col-md-3">
            <div class="stat-card stat-total">
                <div class="stat-icon"><i class="bi bi-people"></i></div>
                <div class="stat-info">
                    <div class="stat-value" id="statTotal">0</div>
                    <div class="stat-label">Total Users</div>
                </div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="stat-card stat-active">
                <div class="stat-icon"><i class="bi bi-check-circle"></i></div>
                <div class="stat-info">
                    <div class="stat-value" id="statActive">0</div>
                    <div class="stat-label">Active Users</div>
                </div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="stat-card stat-inactive">
                <div class="stat-icon"><i class="bi bi-x-circle"></i></div>
                <div class="stat-info">
                    <div class="stat-value" id="statInactive">0</div>
                    <div class="stat-label">Inactive Users</div>
                </div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="stat-card stat-admin">
                <div class="stat-icon"><i class="bi bi-shield-lock"></i></div>
                <div class="stat-info">
                    <div class="stat-value" id="statAdmins">0</div>
                    <div class="stat-label">Admin Users</div>
                </div>
            </div>
        </div>
    </div>

    <!-- FILTERS & SEARCH -->
    <div class="filter-card mb-4">
        <div class="filter-header">
            <h6 class="mb-0"><i class="bi bi-funnel me-2"></i>Filters & Search</h6>
            <button type="button" class="btn btn-sm btn-outline-secondary" id="btnClearFilters">
                <i class="bi bi-x-circle me-1"></i> Clear Filters
            </button>
        </div>
        <div class="filter-body">
            <div class="row g-3">
                <div class="col-md-4">
                    <div class="input-group">
                        <span class="input-group-text"><i class="bi bi-search"></i></span>
                        <input type="text" class="form-control" id="searchInput" 
                               placeholder="Search by name, email, or contact...">
                    </div>
                </div>
                <div class="col-md-2">
                    <select class="form-select" id="filterStatus">
                        <option value="">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="suspended">Suspended</option>
                    </select>
                </div>
                <div class="col-md-2">
                    <select class="form-select" id="filterUserType">
                        <option value="">All Roles</option>
                        <option value="SuperAdmin">Super Admin</option>
                        <option value="Admin">Admin</option>
                        <option value="Office">Office Staff</option>
                        <option value="Branch">Branch Staff</option>
                        <option value="Rider">Rider</option>
                        <option value="Customer">Customer</option>
                    </select>
                </div>
                <div class="col-md-2">
                    <select class="form-select" id="filterBranch">
                        <option value="">All Branches</option>
                        <!-- Will be populated dynamically -->
                    </select>
                </div>
                <div class="col-md-2">
                    <select class="form-select" id="filterVerified">
                        <option value="">Email Status</option>
                        <option value="verified">Verified</option>
                        <option value="unverified">Unverified</option>
                    </select>
                </div>
            </div>
        </div>
    </div>

    <!-- PAGINATION CONTROLS (TOP) -->
    <div class="pagination-controls mb-3">
        <div class="d-flex justify-content-between align-items-center">
            <div class="showing-info">
                Showing <span id="showingFrom">0</span> to <span id="showingTo">0</span> of 
                <span id="showingTotal">0</span> users
            </div>
            <div class="items-per-page">
                <label>Items per page:</label>
                <select class="form-select form-select-sm" id="itemsPerPage">
                    <option value="50" selected>50</option>
                    <option value="100">100</option>
                    <option value="200">200</option>
                </select>
            </div>
        </div>
    </div>

    <!-- DATA TABLE -->
    <div class="table-card">
        <div class="table-responsive">
            <table class="table table-hover align-middle mb-0">
                <thead>
                    <tr>
                        <th class="ps-4">User</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Branch / Customer</th>
                        <th>Contact</th>
                        <th>Status</th>
                        <th>Created</th>
                        <th class="text-center pe-4">Actions</th>
                    </tr>
                </thead>
                <tbody id="userTableBody">
                    <tr>
                        <td colspan="8" class="text-center py-5">
                            <div class="spinner-border text-primary" role="status"></div>
                            <p class="mt-3 text-muted">Loading users...</p>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <!-- PAGINATION CONTROLS (BOTTOM) -->
    <div class="pagination-controls mt-3">
        <nav aria-label="User pagination">
            <ul class="pagination justify-content-center mb-0" id="paginationContainer"></ul>
        </nav>
    </div>
</div>

<!-- ============================================ -->
<!-- 🔥 VIEW USER MODAL                           -->
<!-- ============================================ -->
<div class="modal fade" id="viewUserModal" tabindex="-1">
    <div class="modal-dialog modal-lg modal-dialog-scrollable">
        <div class="modal-content">
            <div class="modal-header bg-primary text-white">
                <h5 class="modal-title"><i class="bi bi-person-lines-fill me-2"></i>User Details</h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body p-4">
                
                <!-- User Header Card -->
                <div class="view-user-header mb-4">
                    <div class="user-avatar-large">
                        <i class="bi bi-person-circle"></i>
                    </div>
                    <div class="user-header-info">
                        <h4 class="mb-1" id="viewFullName">-</h4>
                        <div class="user-meta">
                            <span class="role-badge" id="viewRoleBadge">-</span>
                            <span class="status-badge" id="viewStatusBadge">-</span>
                            <span class="text-muted" id="viewEmail">-</span>
                        </div>
                    </div>
                </div>

                <!-- Basic Information -->
                <div class="view-section">
                    <h6 class="section-title"><i class="bi bi-person-vcard me-2"></i>Basic Information</h6>
                    <div class="row g-3">
                        <div class="col-md-6">
                            <div class="info-item">
                                <label>Full Name</label>
                                <span id="viewBasicName">-</span>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="info-item">
                                <label>Email Address</label>
                                <span id="viewBasicEmail">-</span>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="info-item">
                                <label>Contact Number</label>
                                <span id="viewBasicContact">-</span>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="info-item">
                                <label>CNIC Number</label>
                                <span id="viewBasicCnic">-</span>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="info-item">
                                <label>Designation</label>
                                <span id="viewBasicDesignation">-</span>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="info-item">
                                <label>User ID (UID)</label>
                                <span class="uid-display" id="viewBasicUid">-</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Role & Access -->
                <div class="view-section">
                    <h6 class="section-title"><i class="bi bi-shield-lock me-2"></i>Role & Access</h6>
                    <div class="row g-3">
                        <div class="col-md-6">
                            <div class="info-item">
                                <label>User Role</label>
                                <span id="viewRole">-</span>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="info-item">
                                <label>Account Status</label>
                                <span id="viewStatus">-</span>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="info-item">
                                <label>Email Verified</label>
                                <span id="viewEmailVerified">-</span>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="info-item">
                                <label>Force Password Change</label>
                                <span id="viewForcePassword">-</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Branch Assignment (conditional) -->
                <div class="view-section d-none" id="viewBranchSection">
                    <h6 class="section-title"><i class="bi bi-geo-alt me-2"></i>Branch Assignment</h6>
                    <div class="row g-3">
                        <div class="col-md-6">
                            <div class="info-item">
                                <label>Branch Name</label>
                                <span id="viewBranchName">-</span>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="info-item">
                                <label>Branch Code</label>
                                <span id="viewBranchCode">-</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Customer Linkage (conditional) -->
                <div class="view-section d-none" id="viewCustomerSection">
                    <h6 class="section-title"><i class="bi bi-person-badge me-2"></i>Customer Linkage</h6>
                    <div class="row g-3">
                        <div class="col-md-6">
                            <div class="info-item">
                                <label>Customer Name</label>
                                <span id="viewCustomerName">-</span>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="info-item">
                                <label>Account Number</label>
                                <span id="viewCustomerAccount">-</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Activity & Metadata -->
                <div class="view-section">
                    <h6 class="section-title"><i class="bi bi-clock-history me-2"></i>Activity & Metadata</h6>
                    <div class="row g-3">
                        <div class="col-md-6">
                            <div class="info-item">
                                <label>Account Created</label>
                                <span id="viewCreatedAt">-</span>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="info-item">
                                <label>Last Updated</label>
                                <span id="viewLastUpdated">-</span>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="info-item">
                                <label>Last Login</label>
                                <span id="viewLastLogin">-</span>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="info-item">
                                <label>Created By</label>
                                <span id="viewCreatedBy">-</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Notes -->
                <div class="view-section d-none" id="viewNotesSection">
                    <h6 class="section-title"><i class="bi bi-sticky me-2"></i>Internal Notes</h6>
                    <div class="notes-display" id="viewNotes">-</div>
                </div>

            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" id="btnEditFromView">
                    <i class="bi bi-pencil me-1"></i> Edit User
                </button>
            </div>
        </div>
    </div>
</div>

<!-- ============================================ -->
<!-- 🔥 EDIT USER MODAL                           -->
<!-- ============================================ -->
<div class="modal fade" id="editUserModal" tabindex="-1" data-bs-backdrop="static">
    <div class="modal-dialog modal-lg modal-dialog-scrollable">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title"><i class="bi bi-pencil-square me-2"></i>Edit User</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <form id="editUserForm">
                    <input type="hidden" id="editUserId">
                    
                    <!-- Basic Info -->
                    <div class="edit-section">
                        <h6 class="section-title">Basic Information</h6>
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label class="form-label">Full Name <span class="text-danger">*</span></label>
                                <input type="text" class="form-control" id="editFullName" required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Email Address</label>
                                <input type="email" class="form-control" id="editEmail" readonly>
                                <small class="text-muted">Email cannot be changed</small>
                            </div>
                            <div class="col-md-4">
                                <label class="form-label">Contact Number</label>
                                <div class="input-group">
                                    <span class="input-group-text">+92</span>
                                    <input type="tel" class="form-control" id="editContactNumber" maxlength="10">
                                </div>
                            </div>
                            <div class="col-md-4">
                                <label class="form-label">CNIC Number</label>
                                <input type="text" class="form-control" id="editCnicNumber" maxlength="15">
                            </div>
                            <div class="col-md-4">
                                <label class="form-label">Designation</label>
                                <input type="text" class="form-control" id="editDesignation">
                            </div>
                        </div>
                    </div>

                    <!-- Role & Status -->
                    <div class="edit-section">
                        <h6 class="section-title">Role & Access</h6>
                        <div class="row g-3">
                            <div class="col-md-4">
                                <label class="form-label">User Role <span class="text-danger">*</span></label>
                                <select class="form-select" id="editUserType" required>
                                    <option value="SuperAdmin">Super Admin</option>
                                    <option value="Admin">Admin</option>
                                    <option value="Office">Office Staff</option>
                                    <option value="Branch">Branch Staff</option>
                                    <option value="Rider">Rider</option>
                                    <option value="Customer">Customer</option>
                                </select>
                            </div>
                            <div class="col-md-4">
                                <label class="form-label">Account Status</label>
                                <select class="form-select" id="editUserStatus">
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                    <option value="suspended">Suspended</option>
                                </select>
                            </div>
                            <div class="col-md-4">
                                <label class="form-label d-block">Force Password Change</label>
                                <div class="form-check form-switch mt-2">
                                    <input class="form-check-input" type="checkbox" id="editForcePassword">
                                    <label class="form-check-label" for="editForcePassword">Require on next login</label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Branch (conditional) -->
                    <div class="edit-section d-none" id="editBranchSection">
                        <h6 class="section-title">Branch Assignment</h6>
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label class="form-label">Branch</label>
                                <select class="form-select" id="editBranchSelect">
                                    <option value="">Select Branch</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <!-- Customer (conditional) -->
                    <div class="edit-section d-none" id="editCustomerSection">
                        <h6 class="section-title">Customer Linkage</h6>
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label class="form-label">Customer</label>
                                <select class="form-select" id="editCustomerSelect">
                                    <option value="">Select Customer</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <!-- Password Reset -->
                    <div class="edit-section">
                        <h6 class="section-title">
                            <i class="bi bi-key me-2"></i>Password Reset
                            <span class="badge bg-warning text-dark ms-2">Optional</span>
                        </h6>
                        <div class="alert alert-info small">
                            <i class="bi bi-info-circle me-1"></i>
                            Leave blank to keep current password. Enter new password to reset.
                        </div>
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label class="form-label">New Password</label>
                                <input type="password" class="form-control" id="editNewPassword" placeholder="Leave blank to keep current">
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Confirm New Password</label>
                                <input type="password" class="form-control" id="editConfirmPassword" placeholder="Confirm new password">
                            </div>
                        </div>
                    </div>

                    <!-- Notes -->
                    <div class="edit-section">
                        <h6 class="section-title">Internal Notes</h6>
                        <textarea class="form-control" id="editNotes" rows="3"></textarea>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
                    <i class="bi bi-x-circle me-1"></i> Cancel
                </button>
                <button type="button" class="btn btn-rex-primary" id="btnSaveUserEdit">
                    <span class="btn-text"><i class="bi bi-check-circle me-1"></i> Save Changes</span>
                    <span class="btn-loader d-none"><span class="spinner-border spinner-border-sm me-2"></span> Saving...</span>
                </button>
            </div>
        </div>
    </div>
</div>

<!-- ============================================ -->
<!-- 🔥 DELETE CONFIRMATION MODAL                 -->
<!-- ============================================ -->
<div class="modal fade" id="deleteUserModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow">
            <div class="modal-body text-center p-4">
                <div class="delete-icon-wrapper mb-3">
                    <i class="bi bi-exclamation-triangle-fill"></i>
                </div>
                <h4 class="fw-bold mb-2">Delete User?</h4>
                <p class="text-muted mb-1">Are you sure you want to delete this user?</p>
                <p class="fw-semibold text-danger mb-4" id="deleteUserName">-</p>
                <div class="alert alert-warning small text-start">
                    <i class="bi bi-exclamation-triangle me-1"></i>
                    <strong>Warning:</strong> This will disable the user's login access. The user data will be preserved for audit purposes.
                </div>
                <div class="d-flex gap-2 justify-content-center">
                    <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-danger" id="btnConfirmDelete">
                        <i class="bi bi-trash me-1"></i> Delete User
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- SUCCESS & ERROR MODALS -->
<div class="modal fade" id="userEditSuccessModal" tabindex="-1" data-bs-backdrop="static">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow">
            <div class="modal-body text-center p-5">
                <div class="success-icon-wrapper mb-4"><i class="bi bi-check-circle-fill"></i></div>
                <h3 class="fw-bold mb-2">User Updated!</h3>
                <p class="text-muted mb-4">User details have been successfully updated.</p>
                <button type="button" class="btn btn-rex-primary" id="btnCloseEditSuccess">
                    <i class="bi bi-check-circle me-1"></i> OK
                </button>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="userEditErrorModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow">
            <div class="modal-header bg-danger text-white border-0">
                <h5 class="modal-title"><i class="bi bi-exclamation-triangle-fill me-2"></i>Error</h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body py-4">
                <p id="userEditErrorMessage" class="mb-0 fs-5 text-center">Something went wrong.</p>
            </div>
            <div class="modal-footer border-0 justify-content-center">
                <button type="button" class="btn btn-secondary px-4" data-bs-dismiss="modal">OK</button>
            </div>
        </div>
    </div>
</div>