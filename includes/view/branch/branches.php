
<!-- includes/views/branches/branches.php -->
<div class="container-fluid py-4 all-branches-wrapper">
    <!-- Page Header -->
    <div class="row mb-4">
        <div class="col-12">
            <div class="page-header-card d-flex flex-column flex-md-row justify-content-between align-items-center p-4 rounded-3 shadow-sm">
                <div class="header-title mb-3 mb-md-0">
                    <h3 class="mb-1 fw-bold text-white">
                        <i class="bi bi-building me-2"></i>Branches Dashboard
                    </h3>
                    <p class="mb-0 text-white-50">
                        Manage merchant branches
                        <span class="badge bg-white bg-opacity-25 text-white ms-1" id="totalBranchesCount">0</span>
                    </p>
                </div>
                <button type="button" class="btn btn-light fw-semibold px-4" id="btnGoAddBranch">
                    <i class="bi bi-plus-circle me-1"></i> Add New Branch
                </button>
            </div>
        </div>
    </div>

    <!-- Stats Cards -->
    <div class="row g-3 mb-4">
        <div class="col-md-3">
            <div class="stat-card bg-white rounded-3 p-3 shadow-sm border-0">
                <div class="d-flex align-items-center">
                    <div class="stat-icon bg-primary bg-opacity-10 text-primary rounded-3 p-3 me-3">
                        <i class="bi bi-building fs-3"></i>
                    </div>
                    <div>
                        <h6 class="text-muted mb-1 small">Total Branches</h6>
                        <h3 class="fw-bold mb-0" id="statTotal">0</h3>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="stat-card bg-white rounded-3 p-3 shadow-sm border-0">
                <div class="d-flex align-items-center">
                    <div class="stat-icon bg-success bg-opacity-10 text-success rounded-3 p-3 me-3">
                        <i class="bi bi-check-circle fs-3"></i>
                    </div>
                    <div>
                        <h6 class="text-muted mb-1 small">Active</h6>
                        <h3 class="fw-bold mb-0 text-success" id="statActive">0</h3>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="stat-card bg-white rounded-3 p-3 shadow-sm border-0">
                <div class="d-flex align-items-center">
                    <div class="stat-icon bg-secondary bg-opacity-10 text-secondary rounded-3 p-3 me-3">
                        <i class="bi bi-pause-circle fs-3"></i>
                    </div>
                    <div>
                        <h6 class="text-muted mb-1 small">Inactive</h6>
                        <h3 class="fw-bold mb-0 text-secondary" id="statInactive">0</h3>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="stat-card bg-white rounded-3 p-3 shadow-sm border-0">
                <div class="d-flex align-items-center">
                    <div class="stat-icon bg-info bg-opacity-10 text-info rounded-3 p-3 me-3">
                        <i class="bi bi-shop fs-3"></i>
                    </div>
                    <div>
                        <h6 class="text-muted mb-1 small">Merchants</h6>
                        <h3 class="fw-bold mb-0 text-info" id="statMerchants">0</h3>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Filters Card -->
    <div class="row mb-4">
        <div class="col-12">
            <div class="card border-0 shadow-sm">
                <div class="card-body p-3">
                    <div class="row g-3 align-items-center">
                        <div class="col-md-4">
                            <div class="input-group">
                                <span class="input-group-text bg-light border-end-0">
                                    <i class="bi bi-search text-muted"></i>
                                </span>
                                <input type="text" class="form-control border-start-0 ps-0" 
                                       id="branchSearchInput" placeholder="Search by name, code, contact...">
                            </div>
                        </div>
                        <div class="col-md-2">
                            <select class="form-select" id="branchStatusFilter">
                                <option value="all" selected>All Status</option>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>
                        <div class="col-md-3">
                            <select class="form-select" id="branchMerchantFilter">
                                <option value="all" selected>All Merchants</option>
                                <!-- Populated by jQuery -->
                            </select>
                        </div>
                        <div class="col-md-3 text-md-end">
                            <button type="button" class="btn btn-outline-secondary me-2" id="btnResetFilters">
                                <i class="bi bi-arrow-counterclockwise me-1"></i> Reset
                            </button>
                            <button type="button" class="btn btn-primary" id="btnRefreshData">
                                <i class="bi bi-arrow-clockwise me-1"></i> Refresh
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Data Display Area -->
    <div class="row">
        <div class="col-12">
            <div class="card border-0 shadow-sm">
                <div class="card-body p-0">
                    <!-- Loading State -->
                    <div id="branchesLoading" class="text-center py-5">
                        <div class="spinner-border text-primary" role="status"></div>
                        <p class="mt-3 text-muted">Loading branches...</p>
                    </div>

                    <!-- Empty State -->
                    <div id="branchesEmpty" class="text-center py-5 d-none">
                        <i class="bi bi-inbox display-1 text-muted"></i>
                        <h5 class="mt-3 fw-bold">No Branches Found</h5>
                        <p class="text-muted mb-4">Get started by adding your first branch.</p>
                        <button type="button" class="btn btn-primary px-4" id="btnEmptyAddBranch">
                            <i class="bi bi-plus-circle me-1"></i> Add First Branch
                        </button>
                    </div>

                    <!-- Table View -->
                    <div class="table-responsive d-none" id="branchesTableContainer">
                        <table class="table table-hover align-middle mb-0" id="branchesTable">
                            <thead class="table-light">
                                <tr>
                                    <th style="width: 60px;" class="ps-4">#</th>
                                    <th style="width: 80px;">Image</th>
                                    <th>Branch Details</th>
                                    <th style="width: 150px;">Merchant</th>
                                    <th style="width: 130px;">Hours</th>
                                    <th style="width: 100px;">Sunday</th>
                                    <th style="width: 120px;">Status</th>
                                    <th style="width: 180px;" class="text-center pe-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody id="branchesTableBody">
                                <!-- Rows injected by jQuery -->
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- 🔥 Edit Branch Modal -->
<div class="modal fade" id="editBranchModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-xl modal-dialog-scrollable">
        <div class="modal-content border-0 shadow-lg">
            <div class="modal-header bg-primary text-white border-0">
                <h5 class="modal-title">
                    <i class="bi bi-pencil-square me-2"></i>Edit Branch
                </h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body p-4">
                <form id="editBranchForm" novalidate>
                    <input type="hidden" id="editBranchId">
                    
                    <!-- Basic Information -->
                    <h6 class="fw-bold text-primary mb-3"><i class="bi bi-info-circle me-2"></i>Basic Information</h6>
                    <div class="row g-3 mb-4">
                        <div class="col-md-6">
                            <label for="editBranchName" class="form-label fw-semibold">
                                Branch Name <span class="text-danger">*</span>
                            </label>
                            <input type="text" class="form-control" id="editBranchName" required>
                            <div class="invalid-feedback">Required.</div>
                        </div>
                        <div class="col-md-6">
                            <label for="editBranchCode" class="form-label fw-semibold">Branch Code</label>
                            <input type="text" class="form-control bg-light" id="editBranchCode" readonly>
                            <small class="text-muted">Cannot be changed</small>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label fw-semibold">Merchant</label>
                            <input type="text" class="form-control bg-light" id="editBranchMerchant" readonly>
                            <small class="text-muted">Parent merchant</small>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label fw-semibold">Status</label>
                            <div class="d-flex align-items-center h-100 bg-light rounded-3 p-3">
                                <div class="form-check form-switch mb-0 w-100">
                                    <input class="form-check-input" type="checkbox" id="editBranchStatus" checked style="width: 3rem; height: 1.5rem;">
                                    <label class="form-check-label fw-semibold ms-2" for="editBranchStatus" id="editBranchStatusLabel">
                                        Active
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Contact Information -->
                    <h6 class="fw-bold text-primary mb-3"><i class="bi bi-telephone me-2"></i>Contact Information</h6>
                    <div class="row g-3 mb-4">
                        <div class="col-md-6">
                            <label for="editBranchContactPerson" class="form-label fw-semibold">Contact Person</label>
                            <input type="text" class="form-control" id="editBranchContactPerson">
                        </div>
                        <div class="col-md-6">
                            <label for="editBranchPhone" class="form-label fw-semibold">Phone</label>
                            <input type="tel" class="form-control" id="editBranchPhone">
                        </div>
                        <div class="col-md-6">
                            <label for="editBranchEmail" class="form-label fw-semibold">Email</label>
                            <input type="email" class="form-control" id="editBranchEmail">
                        </div>
                        <div class="col-md-6">
                            <label for="editBranchAddress" class="form-label fw-semibold">Address</label>
                            <input type="text" class="form-control" id="editBranchAddress">
                        </div>
                        <div class="col-md-6">
                            <label for="editBranchLat" class="form-label fw-semibold">Latitude</label>
                            <input type="text" class="form-control" id="editBranchLat" placeholder="e.g. 24.8607">
                        </div>
                        <div class="col-md-6">
                            <label for="editBranchLng" class="form-label fw-semibold">Longitude</label>
                            <input type="text" class="form-control" id="editBranchLng" placeholder="e.g. 67.0011">
                        </div>
                    </div>

                    <!-- Operating Hours -->
                    <h6 class="fw-bold text-primary mb-3"><i class="bi bi-clock me-2"></i>Operating Hours</h6>
                    <div class="row g-3 mb-4">
                        <div class="col-12">
                            <div class="form-check form-switch">
                                <input class="form-check-input" type="checkbox" id="editBranch24Hours">
                                <label class="form-check-label fw-semibold" for="editBranch24Hours">
                                    Open 24 Hours
                                </label>
                            </div>
                        </div>
                        <div class="col-md-6 time-field">
                            <label for="editBranchOpenTime" class="form-label fw-semibold">Opening Time</label>
                            <input type="time" class="form-control" id="editBranchOpenTime">
                        </div>
                        <div class="col-md-6 time-field">
                            <label for="editBranchCloseTime" class="form-label fw-semibold">Closing Time</label>
                            <input type="time" class="form-control" id="editBranchCloseTime">
                        </div>
                        <div class="col-md-6">
                            <div class="form-check form-switch">
                                <input class="form-check-input" type="checkbox" id="editBranchSundayOpen">
                                <label class="form-check-label fw-semibold" for="editBranchSundayOpen">
                                    Open on Sunday
                                </label>
                            </div>
                        </div>
                    </div>

                    <!-- Description -->
                    <div class="row g-3 mb-4">
                        <div class="col-12">
                            <label for="editBranchDescription" class="form-label fw-semibold">Description</label>
                            <textarea class="form-control" id="editBranchDescription" rows="2"></textarea>
                        </div>
                    </div>

                    <!-- 🔥 Image Upload Section -->
                    <h6 class="fw-bold text-primary mb-3"><i class="bi bi-image me-2"></i>Branch Image</h6>
                    <div class="row g-3 mb-4">
                        <div class="col-12">
                            <div class="image-edit-container bg-light rounded-3 p-4">
                                <div class="row align-items-center">
                                    <div class="col-md-4 text-center">
                                        <div class="current-image-preview mb-2">
                                            <img id="editBranchImage" src="" alt="Current" class="img-fluid rounded-3 shadow-sm" style="max-height: 200px; object-fit: contain;">
                                        </div>
                                        <small class="text-muted">Current Image</small>
                                    </div>
                                    <div class="col-md-8">
                                        <label for="editBranchImageInput" class="form-label fw-semibold">Change Image (Optional)</label>
                                        <div class="input-group mb-2">
                                            <input type="file" class="form-control" id="editBranchImageInput" accept="image/png, image/jpeg, image/jpg, image/webp">
                                            <button class="btn btn-outline-danger" type="button" id="btnRemoveNewImage">
                                                <i class="bi bi-x-circle"></i>
                                            </button>
                                        </div>
                                        <small class="text-muted d-block mb-2">
                                            <i class="bi bi-info-circle me-1"></i>
                                            Max 200KB. PNG, JPG, WEBP only. Leave empty to keep current image.
                                        </small>
                                        
                                        <!-- New Image Preview -->
                                        <div class="new-image-preview d-none mt-3">
                                            <label class="form-label fw-semibold small">New Image Preview:</label>
                                            <img id="editBranchNewImagePreview" src="" alt="New" class="img-fluid rounded-3 border shadow-sm" style="max-height: 150px; object-fit: contain;">
                                        </div>

                                        <!-- Upload Progress -->
                                        <div class="mt-3 d-none" id="editUploadStatusArea">
                                            <div class="progress" style="height: 6px;">
                                                <div class="progress-bar progress-bar-striped progress-bar-animated bg-primary" role="progressbar" style="width: 0%"></div>
                                            </div>
                                            <small class="text-muted mt-1 d-block" id="editUploadStatusText">Uploading...</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Info Alert -->
                    <div class="col-12">
                        <div class="alert alert-info small mb-0">
                            <i class="bi bi-info-circle me-1"></i>
                            <strong>Note:</strong> Branch code and merchant cannot be changed. 
                            Changes will reflect immediately across the platform.
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer border-0">
                <button type="button" class="btn btn-outline-secondary px-4" data-bs-dismiss="modal">
                    <i class="bi bi-x-circle me-1"></i> Cancel
                </button>
                <button type="button" class="btn btn-primary px-4" id="btnSaveEditBranch">
                    <i class="bi bi-check-circle me-1"></i> Save Changes
                </button>
            </div>
        </div>
    </div>
</div>

<!-- 🔥 Delete Confirmation Modal (Soft Delete) -->
<div class="modal fade" id="deleteBranchModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow-lg">
            <div class="modal-body text-center p-5">
                <div class="mb-4">
                    <div class="warning-icon-wrapper mx-auto">
                        <i class="bi bi-exclamation-triangle-fill text-warning" style="font-size: 4rem;"></i>
                    </div>
                </div>
                <h4 class="fw-bold mb-2">Deactivate Branch?</h4>
                <p class="text-muted mb-1">You are about to deactivate:</p>
                <p class="fw-bold text-dark fs-5 mb-3" id="deleteBranchName">Branch Name</p>
                <p class="text-muted small mb-3" id="deleteBranchCode">M1001-1</p>
                
                <div class="soft-delete-info bg-light rounded-3 p-3 mb-4 text-start">
                    <h6 class="fw-bold small mb-2">
                        <i class="bi bi-shield-check text-success me-1"></i> Safe Deactivation
                    </h6>
                    <ul class="small text-muted mb-0 ps-3">
                        <li>Branch will be hidden from public view</li>
                        <li>All products and coupons at this branch remain intact</li>
                        <li>You can reactivate anytime from this dashboard</li>
                        <li>No data will be permanently lost</li>
                    </ul>
                </div>

                <div class="alert alert-warning small mb-4">
                    <i class="bi bi-info-circle me-1"></i>
                    This is a soft-delete action. The branch status will change to <strong>Inactive</strong>.
                </div>

                <div class="d-flex gap-2 justify-content-center">
                    <button type="button" class="btn btn-outline-secondary px-4" data-bs-dismiss="modal">
                        <i class="bi bi-x-circle me-1"></i> Cancel
                    </button>
                    <button type="button" class="btn btn-warning px-4" id="btnConfirmDelete">
                        <i class="bi bi-pause-circle me-1"></i> Yes, Deactivate
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Success Modal -->
<div class="modal fade" id="successModalBranches" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-sm">
        <div class="modal-content border-0 shadow-lg">
            <div class="modal-body text-center p-5">
                <div class="mb-4"><i class="bi bi-check-circle-fill text-success" style="font-size: 4rem;"></i></div>
                <h4 class="fw-bold mb-2">Success!</h4>
                <p class="text-muted mb-4" id="successMessageBranches">Action completed.</p>
                <button type="button" class="btn btn-success w-100" data-bs-dismiss="modal">Done</button>
            </div>
        </div>
    </div>
</div>

<!-- Error Modal -->
<div class="modal fade" id="errorModalBranches" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-sm">
        <div class="modal-content border-0 shadow-lg">
            <div class="modal-body text-center p-5">
                <div class="mb-4"><i class="bi bi-exclamation-triangle-fill text-danger" style="font-size: 4rem;"></i></div>
                <h4 class="fw-bold mb-2">Error!</h4>
                <p class="text-muted mb-4" id="errorMessageBranches">Something went wrong.</p>
                <button type="button" class="btn btn-danger w-100" data-bs-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>

