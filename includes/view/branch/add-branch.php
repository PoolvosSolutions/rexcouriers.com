<!-- includes/views/branches/add-branch.php -->
<div class="container-fluid py-4 add-branch-wrapper">
    <!-- Page Header -->
    <div class="row mb-4">
        <div class="col-12">
            <div class="page-header-card d-flex flex-column flex-md-row justify-content-between align-items-center p-4 rounded-3 shadow-sm">
                <div class="header-title mb-3 mb-md-0">
                    <h3 class="mb-1 fw-bold text-white"><i class="bi bi-building me-2"></i>Add New Branch</h3>
                    <p class="mb-0 text-white-50">Register a new branch for an existing merchant.</p>
                </div>
                <div class="header-datetime d-flex gap-3">
                    <div class="dt-box text-center p-2 rounded">
                        <small class="d-block text-white-50">Today's Date</small>
                        <strong class="text-white" id="displayDate">--</strong>
                    </div>
                    <div class="dt-box text-center p-2 rounded">
                        <small class="d-block text-white-50">Current Time</small>
                        <strong class="text-white" id="displayDateTime">--</strong>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Merchant Selection Card -->
    <div class="row mb-4">
        <div class="col-12">
            <div class="card border-0 shadow-sm">
                <div class="card-body p-4">
                    <h5 class="fw-bold mb-3"><i class="bi bi-shop text-primary me-2"></i>Select Merchant</h5>
                    <div class="row g-3 align-items-end">
                        <div class="col-md-8">
                            <label for="branchMerchant" class="form-label fw-semibold">Merchant <span class="text-danger">*</span></label>
                            <select class="form-select" id="branchMerchant" required>
                                <option value="" selected disabled>Loading merchants...</option>
                            </select>
                            <div class="invalid-feedback">Please select a merchant.</div>
                        </div>
                        <div class="col-md-4">
                            <div class="merchant-info-display bg-light rounded-3 p-3 h-100 d-none" id="merchantInfoCard">
                                <small class="text-muted d-block">Selected Merchant</small>
                                <div class="d-flex justify-content-between align-items-center">
                                    <strong id="merchantInfoName" class="text-dark">--</strong>
                                    <span class="badge bg-primary fs-6" id="merchantInfoCode">--</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Main Form Area -->
    <div class="row g-4">
        <!-- Left Column: Form Fields -->
        <div class="col-lg-8">
            <div class="card border-0 shadow-sm h-100">
                <div class="card-body p-4 p-md-5">
                    <form id="addBranchForm" novalidate>
                        <div class="row g-3">
                            <!-- Branch Name -->
                            <div class="col-md-6">
                                <label for="branchName" class="form-label fw-semibold">Branch Name <span class="text-danger">*</span></label>
                                <input type="text" class="form-control" id="branchName" placeholder="e.g. DHA Phase 5, Clifton" required>
                                <div class="invalid-feedback">Required.</div>
                            </div>

                            <!-- Contact Person -->
                            <div class="col-md-6">
                                <label for="branchContactPerson" class="form-label fw-semibold">Contact Person</label>
                                <input type="text" class="form-control" id="branchContactPerson" placeholder="e.g. Ahmed Ali">
                            </div>

                            <!-- Contact Phone -->
                            <div class="col-md-6">
                                <label for="branchPhone" class="form-label fw-semibold">Contact Phone</label>
                                <input type="tel" class="form-control" id="branchPhone" placeholder="e.g. +92 300 1234567">
                            </div>

                            <!-- Contact Email -->
                            <div class="col-md-6">
                                <label for="branchEmail" class="form-label fw-semibold">Contact Email</label>
                                <input type="email" class="form-control" id="branchEmail" placeholder="e.g. branch@merchant.com">
                            </div>

                            <!-- Address -->
                            <div class="col-12">
                                <label for="branchAddress" class="form-label fw-semibold">Branch Address</label>
                                <input type="text" class="form-control" id="branchAddress" placeholder="Street address, building, etc.">
                            </div>

                            <!-- Latitude -->
                            <div class="col-md-6">
                                <label for="branchLat" class="form-label fw-semibold">Latitude</label>
                                <input type="text" class="form-control" id="branchLat" placeholder="e.g. 24.8607">
                                <small class="text-muted">Decimal degrees</small>
                            </div>

                            <!-- Longitude -->
                            <div class="col-md-6">
                                <label for="branchLng" class="form-label fw-semibold">Longitude</label>
                                <input type="text" class="form-control" id="branchLng" placeholder="e.g. 67.0011">
                                <small class="text-muted">Decimal degrees</small>
                            </div>

                            <!-- 24 Hours Checkbox -->
                            <div class="col-12">
                                <div class="form-check form-switch">
                                    <input class="form-check-input" type="checkbox" id="branch24Hours">
                                    <label class="form-check-label fw-semibold" for="branch24Hours">
                                        Open 24 Hours
                                    </label>
                                </div>
                            </div>

                            <!-- Opening Time -->
                            <div class="col-md-6 time-field">
                                <label for="branchOpenTime" class="form-label fw-semibold">Opening Time</label>
                                <input type="time" class="form-control" id="branchOpenTime">
                            </div>

                            <!-- Closing Time -->
                            <div class="col-md-6 time-field">
                                <label for="branchCloseTime" class="form-label fw-semibold">Closing Time</label>
                                <input type="time" class="form-control" id="branchCloseTime">
                            </div>

                            <!-- Sunday Status -->
                            <div class="col-md-6">
                                <label class="form-label fw-semibold">Sunday Status</label>
                                <div class="form-check form-switch">
                                    <input class="form-check-input" type="checkbox" id="branchSundayOpen" checked>
                                    <label class="form-check-label" for="branchSundayOpen">Open on Sunday</label>
                                </div>
                            </div>

                            <!-- Description -->
                            <div class="col-12">
                                <label for="branchDescription" class="form-label fw-semibold">Description</label>
                                <textarea class="form-control" id="branchDescription" rows="3" placeholder="Brief description about this branch..."></textarea>
                            </div>
                        </div>

                        <!-- Hidden fields -->
                        <input type="hidden" id="hiddenDate" name="date">
                        <input type="hidden" id="hiddenDateTime" name="dateTime">
                        <input type="hidden" id="hiddenImagePath" name="imagePath">
                    </form>
                </div>
            </div>
        </div>

        <!-- Right Column: Image Upload -->
        <div class="col-lg-4">
            <div class="card border-0 shadow-sm h-100">
                <div class="card-body p-4 d-flex flex-column">
                    <h5 class="card-title fw-bold mb-2 text-dark">Branch Image</h5>
                    <p class="text-muted small mb-3">Optional. Max 200KB. Shows default if empty.</p>
                    
                    <!-- Preview Area -->
                    <div class="image-preview-area flex-grow-1 d-flex align-items-center justify-content-center bg-light rounded-3 mb-3 position-relative overflow-hidden" id="imagePreviewContainer">
                        <img id="imagePreviewImage" src="assets/img/branchimg/bdefault.png" alt="Preview" class="img-fluid" style="max-height: 250px; object-fit: contain;">
                        <button type="button" class="btn btn-sm btn-danger position-absolute top-0 end-0 m-2 rounded-circle p-0 d-none" id="removeImageBtn" style="width: 28px; height: 28px; line-height: 28px;">
                            <i class="bi bi-x"></i>
                        </button>
                    </div>

                    <!-- Upload Button -->
                    <label for="branchImageInput" class="btn btn-outline-primary w-100 d-flex align-items-center justify-content-center gap-2 mb-0 cursor-pointer">
                        <i class="bi bi-cloud-upload"></i> Choose Image
                    </label>
                    <input type="file" class="d-none" id="branchImageInput" accept="image/png, image/jpeg, image/jpg, image/webp">
                    
                    <!-- Upload Progress -->
                    <div class="mt-3 d-none" id="uploadStatusArea">
                        <div class="progress" style="height: 6px;">
                            <div class="progress-bar progress-bar-striped progress-bar-animated bg-primary" role="progressbar" style="width: 0%"></div>
                        </div>
                        <small class="text-muted mt-1 d-block" id="uploadStatusText">Uploading...</small>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Bottom Action Bar -->
    <div class="row mt-4">
        <div class="col-12">
            <div class="card border-0 shadow-sm">
                <div class="card-body p-4 d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
                    <p class="text-muted mb-0 small"><i class="bi bi-info-circle me-1"></i> Ensure required fields are filled before saving.</p>
                    <div class="d-flex gap-2">
                        <button type="button" class="btn btn-outline-secondary px-4" id="btnResetBranch">
                            <i class="bi bi-arrow-counterclockwise me-1"></i> Reset
                        </button>
                        <button type="button" class="btn btn-primary px-5 fw-semibold" id="btnSaveBranch">
                            <i class="bi bi-check-circle-fill me-1"></i> Save Branch
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Success Modal -->
<div class="modal fade" id="successModalBranch" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow-lg">
            <div class="modal-body text-center p-5">
                <div class="mb-4">
                    <i class="bi bi-check-circle-fill text-success" style="font-size: 4rem;"></i>
                </div>
                <h4 class="fw-bold mb-3">Branch Saved Successfully!</h4>
                <p class="text-muted mb-3">Your branch has been registered with the following details:</p>
                
                <div class="branch-code-display bg-light border rounded-3 p-3 mb-4">
                    <small class="text-muted d-block mb-1">Branch Code</small>
                    <h3 class="fw-bold text-primary mb-0" id="displayBranchCode">M1001-1</h3>
                </div>
                
                <p class="small text-muted mb-4">
                    <i class="bi bi-info-circle me-1"></i>
                    This code uniquely identifies the branch within the merchant.
                </p>
                
                <button type="button" class="btn btn-success w-100" data-bs-dismiss="modal">Done</button>
            </div>
        </div>
    </div>
</div>

<!-- Error Modal -->
<div class="modal fade" id="errorModalBranch" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-sm">
        <div class="modal-content border-0 shadow-lg">
            <div class="modal-body text-center p-5">
                <div class="mb-4"><i class="bi bi-exclamation-triangle-fill text-danger" style="font-size: 4rem;"></i></div>
                <h4 class="fw-bold mb-2">Error!</h4>
                <p class="text-muted mb-4" id="errorMessageBranch">Something went wrong.</p>
                <button type="button" class="btn btn-danger w-100" data-bs-dismiss="modal">Try Again</button>
            </div>
        </div>
    </div>
</div>


