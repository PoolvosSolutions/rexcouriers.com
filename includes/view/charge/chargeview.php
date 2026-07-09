<?php
// includes/view/charge/chargeview.php
// 🔥 Charge List View - Rexcouris
?>

<div class="container-fluid py-4 chargeview-page">
    
    <!-- PAGE HEADER -->
    <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
            <h3 class="mb-1"><i class="bi bi-tags-fill text-danger me-2"></i>Charge Configuration</h3>
            <p class="text-muted mb-0 small">Manage all configurable charges for the booking system</p>
        </div>
        <button type="button" class="btn btn-rex-primary" onclick="loadView('addcharge')">
            <i class="bi bi-plus-circle me-1"></i> Add New Charge
        </button>
    </div>

    <!-- STATS CARDS -->
    <div class="row g-3 mb-4">
        <div class="col-md-3">
            <div class="stat-card stat-total">
                <div class="stat-icon"><i class="bi bi-tags"></i></div>
                <div class="stat-info">
                    <div class="stat-value" id="statTotal">0</div>
                    <div class="stat-label">Total Charges</div>
                </div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="stat-card stat-active">
                <div class="stat-icon"><i class="bi bi-check-circle"></i></div>
                <div class="stat-info">
                    <div class="stat-value" id="statActive">0</div>
                    <div class="stat-label">Active</div>
                </div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="stat-card stat-mandatory">
                <div class="stat-icon"><i class="bi bi-lock-fill"></i></div>
                <div class="stat-info">
                    <div class="stat-value" id="statMandatory">0</div>
                    <div class="stat-label">Mandatory</div>
                </div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="stat-card stat-optional">
                <div class="stat-icon"><i class="bi bi-unlock-fill"></i></div>
                <div class="stat-info">
                    <div class="stat-value" id="statOptional">0</div>
                    <div class="stat-label">Optional</div>
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
                        <input type="text" class="form-control" id="searchInput" placeholder="Search by name or code...">
                    </div>
                </div>
                <div class="col-md-2">
                    <select class="form-select" id="filterStatus">
                        <option value="">All Status</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                </div>
                <div class="col-md-2">
                    <select class="form-select" id="filterCategory">
                        <option value="">All Categories</option>
                        <option value="Standard">Standard</option>
                        <option value="Surcharge">Surcharge</option>
                        <option value="Service">Service Fee</option>
                        <option value="Penalty">Penalty</option>
                        <option value="Discount">Discount</option>
                    </select>
                </div>
                <div class="col-md-2">
                    <select class="form-select" id="filterNature">
                        <option value="">All Natures</option>
                        <option value="Mandatory">Mandatory</option>
                        <option value="Optional">Optional</option>
                    </select>
                </div>
                <div class="col-md-2">
                    <select class="form-select" id="filterCalcType">
                        <option value="">All Calc Types</option>
                        <option value="flat">Flat (PKR)</option>
                        <option value="percentage">Percentage (%)</option>
                        <option value="per_kg">Per KG</option>
                        <option value="per_piece">Per Piece</option>
                    </select>
                </div>
            </div>
        </div>
    </div>

    <!-- PAGINATION CONTROLS (TOP) -->
    <div class="pagination-controls mb-3">
        <div class="d-flex justify-content-between align-items-center">
            <div class="showing-info">
                Showing <span id="showingFrom">0</span> to <span id="showingTo">0</span> of <span id="showingTotal">0</span> charges
            </div>
            <div class="items-per-page">
                <label>Items per page:</label>
                <select class="form-select form-select-sm" id="itemsPerPage">
                    <option value="50" selected>50</option>
                    <option value="100">100</option>
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
                        <th class="ps-4">Code</th>
                        <th>Charge Name</th>
                        <th>Category</th>
                        <th>Calculation</th>
                        <th>Applicability</th>
                        <th>Nature</th>
                        <th>Status</th>
                        <th class="text-center pe-4">Actions</th>
                    </tr>
                </thead>
                <tbody id="chargeTableBody">
                    <tr>
                        <td colspan="8" class="text-center py-5">
                            <div class="spinner-border text-primary" role="status"></div>
                            <p class="mt-3 text-muted">Loading charges...</p>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <!-- PAGINATION CONTROLS (BOTTOM) -->
    <div class="pagination-controls mt-3">
        <nav aria-label="Charge pagination">
            <ul class="pagination justify-content-center mb-0" id="paginationContainer"></ul>
        </nav>
    </div>
</div>

<!-- ============================================ -->
<!-- 🔥 EDIT CHARGE MODAL                         -->
<!-- ============================================ -->
<div class="modal fade" id="editChargeModal" tabindex="-1" data-bs-backdrop="static">
    <div class="modal-dialog modal-lg modal-dialog-scrollable">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title"><i class="bi bi-pencil-square me-2"></i>Edit Charge Configuration</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <form id="editChargeForm">
                    <input type="hidden" id="editChargeId">
                    
                    <!-- Basic Info -->
                    <div class="edit-section">
                        <h6 class="section-title">Basic Information</h6>
                        <div class="row g-3">
                            <div class="col-md-5">
                                <label class="form-label">Charge Name <span class="text-danger">*</span></label>
                                <input type="text" class="form-control" id="editChargeName" required>
                            </div>
                            <div class="col-md-3">
                                <label class="form-label">Charge Code</label>
                                <input type="text" class="form-control" id="editChargeCode" readonly>
                            </div>
                            <div class="col-md-4">
                                <label class="form-label">Status</label>
                                <select class="form-select" id="editChargeStatus">
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </div>
                            <div class="col-md-4">
                                <label class="form-label">Category</label>
                                <select class="form-select" id="editChargeCategory">
                                    <option value="Standard">Standard</option>
                                    <option value="Surcharge">Surcharge</option>
                                    <option value="Service">Service Fee</option>
                                    <option value="Penalty">Penalty</option>
                                    <option value="Discount">Discount</option>
                                </select>
                            </div>
                            <div class="col-md-4">
                                <label class="form-label">Nature</label>
                                <select class="form-select" id="editChargeNature">
                                    <option value="Optional">Optional</option>
                                    <option value="Mandatory">Mandatory</option>
                                </select>
                            </div>
                            <div class="col-md-4">
                                <label class="form-label">Display Order</label>
                                <input type="number" class="form-control" id="editChargeSortOrder" min="1">
                            </div>
                            <div class="col-12">
                                <label class="form-label">Description</label>
                                <textarea class="form-control" id="editChargeDescription" rows="2"></textarea>
                            </div>
                        </div>
                    </div>

                    <!-- Calculation -->
                    <div class="edit-section">
                        <h6 class="section-title">Calculation Settings</h6>
                        <div class="row g-3">
                            <div class="col-md-4">
                                <label class="form-label">Calculation Type <span class="text-danger">*</span></label>
                                <select class="form-select" id="editCalculationType" required>
                                    <option value="flat">Flat Amount (PKR)</option>
                                    <option value="percentage">Percentage (%)</option>
                                    <option value="per_kg">Per Kilogram (PKR/kg)</option>
                                    <option value="per_piece">Per Piece (PKR/piece)</option>
                                </select>
                            </div>
                            <div class="col-md-4">
                                <label class="form-label">Default Value <span class="text-danger">*</span></label>
                                <div class="input-group">
                                    <span class="input-group-text rex-calc-symbol" id="editCalcSymbol">PKR</span>
                                    <input type="number" class="form-control" id="editDefaultValue" required min="0" step="0.01">
                                </div>
                            </div>
                            <div class="col-md-4">
                                <label class="form-label">Rounding</label>
                                <select class="form-select" id="editRoundingType">
                                    <option value="none">No Rounding</option>
                                    <option value="up">Round Up</option>
                                    <option value="down">Round Down</option>
                                    <option value="nearest">Round to Nearest</option>
                                </select>
                            </div>
                            <div class="col-md-6 edit-min-max-field d-none">
                                <label class="form-label">Minimum Value</label>
                                <input type="number" class="form-control" id="editMinValue" min="0" step="0.01">
                            </div>
                            <div class="col-md-6 edit-min-max-field d-none">
                                <label class="form-label">Maximum Value</label>
                                <input type="number" class="form-control" id="editMaxValue" min="0" step="0.01">
                            </div>
                        </div>
                    </div>

                    <!-- Applicability -->
                    <div class="edit-section">
                        <h6 class="section-title">Applicability Rules</h6>
                        <div class="row g-3">
                            <div class="col-md-4">
                                <label class="form-label fw-semibold mb-2">Shipment Type</label>
                                <div class="rex-checkbox-group">
                                    <div class="form-check"><input class="form-check-input edit-apply-shipment" type="checkbox" value="Document" id="editApplyDoc"><label class="form-check-label" for="editApplyDoc">Documents</label></div>
                                    <div class="form-check"><input class="form-check-input edit-apply-shipment" type="checkbox" value="Parcel" id="editApplyParcel"><label class="form-check-label" for="editApplyParcel">Parcels</label></div>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <label class="form-label fw-semibold mb-2">Service Direction</label>
                                <div class="rex-checkbox-group">
                                    <div class="form-check"><input class="form-check-input edit-apply-direction" type="checkbox" value="Domestic" id="editApplyDom"><label class="form-check-label" for="editApplyDom">Domestic</label></div>
                                    <div class="form-check"><input class="form-check-input edit-apply-direction" type="checkbox" value="International" id="editApplyInt"><label class="form-check-label" for="editApplyInt">International</label></div>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <label class="form-label fw-semibold mb-2">Customer Type</label>
                                <div class="rex-checkbox-group">
                                    <div class="form-check"><input class="form-check-input edit-apply-customer" type="checkbox" value="Cash" id="editApplyCash"><label class="form-check-label" for="editApplyCash">Cash</label></div>
                                    <div class="form-check"><input class="form-check-input edit-apply-customer" type="checkbox" value="Account" id="editApplyAcc"><label class="form-check-label" for="editApplyAcc">Account</label></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Display & Accounting -->
                    <div class="edit-section">
                        <h6 class="section-title">Display & Accounting</h6>
                        <div class="row g-3">
                            <div class="col-md-3"><div class="rex-switch-group"><label class="rex-switch"><input type="checkbox" id="editShowBooking"><span class="rex-switch-slider"></span></label><span class="rex-switch-label">Booking Form</span></div></div>
                            <div class="col-md-3"><div class="rex-switch-group"><label class="rex-switch"><input type="checkbox" id="editShowInvoice"><span class="rex-switch-slider"></span></label><span class="rex-switch-label">Invoice</span></div></div>
                            <div class="col-md-3"><div class="rex-switch-group"><label class="rex-switch"><input type="checkbox" id="editShowReceipt"><span class="rex-switch-slider"></span></label><span class="rex-switch-label">Receipt</span></div></div>
                            <div class="col-md-3"><div class="rex-switch-group"><label class="rex-switch"><input type="checkbox" id="editIsTaxable"><span class="rex-switch-slider"></span></label><span class="rex-switch-label">Taxable</span></div></div>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal"><i class="bi bi-x-circle me-1"></i> Cancel</button>
                <button type="button" class="btn btn-rex-primary" id="btnSaveChargeEdit">
                    <span class="btn-text"><i class="bi bi-check-circle me-1"></i> Save Changes</span>
                    <span class="btn-loader d-none"><span class="spinner-border spinner-border-sm me-2"></span> Saving...</span>
                </button>
            </div>
        </div>
    </div>
</div>

<!-- SUCCESS & ERROR MODALS -->
<div class="modal fade" id="chargeEditSuccessModal" tabindex="-1" data-bs-backdrop="static">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow">
            <div class="modal-body text-center p-5">
                <div class="success-icon-wrapper mb-4"><i class="bi bi-check-circle-fill"></i></div>
                <h3 class="fw-bold mb-2">Charge Updated!</h3>
                <p class="text-muted mb-4">Charge configuration has been successfully updated.</p>
                <button type="button" class="btn btn-rex-primary" id="btnCloseEditSuccess"><i class="bi bi-check-circle me-1"></i> OK</button>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="chargeEditErrorModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow">
            <div class="modal-header bg-danger text-white border-0">
                <h5 class="modal-title"><i class="bi bi-exclamation-triangle-fill me-2"></i>Error</h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body py-4">
                <p id="chargeEditErrorMessage" class="mb-0 fs-5 text-center">Something went wrong.</p>
            </div>
            <div class="modal-footer border-0 justify-content-center">
                <button type="button" class="btn btn-secondary px-4" data-bs-dismiss="modal">OK</button>
            </div>
        </div>
    </div>
</div>