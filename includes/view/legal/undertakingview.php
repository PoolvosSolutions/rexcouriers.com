<?php
// includes/view/legal/undertakingview.php
// 🔥 Undertaking List View - Rexcouris
?>

<div class="container-fluid py-4 undertakingview-page">
    
    <!-- PAGE HEADER -->
    <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
            <h3 class="mb-1"><i class="bi bi-file-earmark-ruled text-danger me-2"></i>Undertakings</h3>
            <p class="text-muted mb-0 small">Manage all legally binding declarations for specific shipment scenarios</p>
        </div>
        <button type="button" class="btn btn-rex-primary" onclick="loadView('addundertaking')">
            <i class="bi bi-plus-circle me-1"></i> Add New Undertaking
        </button>
    </div>

    <!-- STATS CARDS -->
    <div class="row g-3 mb-4">
        <div class="col-md-3">
            <div class="stat-card stat-total">
                <div class="stat-icon"><i class="bi bi-file-earmark-text"></i></div>
                <div class="stat-info">
                    <div class="stat-value" id="statTotal">0</div>
                    <div class="stat-label">Total Undertakings</div>
                </div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="stat-card stat-active">
                <div class="stat-icon"><i class="bi bi-check-circle"></i></div>
                <div class="stat-info">
                    <div class="stat-value" id="statActive">0</div>
                    <div class="stat-label">Currently Active</div>
                </div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="stat-card stat-mandatory">
                <div class="stat-icon"><i class="bi bi-shield-lock"></i></div>
                <div class="stat-info">
                    <div class="stat-value" id="statMandatory">0</div>
                    <div class="stat-label">Mandatory</div>
                </div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="stat-card stat-draft">
                <div class="stat-icon"><i class="bi bi-pencil-square"></i></div>
                <div class="stat-info">
                    <div class="stat-value" id="statDraft">0</div>
                    <div class="stat-label">Drafts</div>
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
                <div class="col-md-3">
                    <div class="input-group">
                        <span class="input-group-text"><i class="bi bi-search"></i></span>
                        <input type="text" class="form-control" id="searchInput" placeholder="Search by title or code...">
                    </div>
                </div>
                <div class="col-md-2">
                    <select class="form-select" id="filterStatus">
                        <option value="">All Status</option>
                        <option value="Active">Active</option>
                        <option value="Draft">Draft</option>
                        <option value="Inactive">Inactive</option>
                        <option value="Archived">Archived</option>
                    </select>
                </div>
                <div class="col-md-2">
                    <select class="form-select" id="filterType">
                        <option value="">All Types</option>
                        <option value="Customer">Customer</option>
                        <option value="Staff">Staff</option>
                        <option value="Carrier-Specific">Carrier-Specific</option>
                        <option value="Customs">Customs</option>
                        <option value="High-Value">High-Value</option>
                        <option value="Fragile">Fragile</option>
                        <option value="Dangerous-Goods">Dangerous Goods</option>
                    </select>
                </div>
                <div class="col-md-2">
                    <select class="form-select" id="filterCategory">
                        <option value="">All Categories</option>
                        <option value="Domestic">Domestic</option>
                        <option value="International">International</option>
                        <option value="Both">Both</option>
                        <option value="Special">Special</option>
                    </select>
                </div>
                <div class="col-md-3">
                    <select class="form-select" id="filterApproval">
                        <option value="">All Approvals</option>
                        <option value="Pending">Pending Review</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                </div>
            </div>
        </div>
    </div>

    <!-- PAGINATION CONTROLS (TOP) -->
    <div class="pagination-controls mb-3">
        <div class="d-flex justify-content-between align-items-center">
            <div class="showing-info">
                Showing <span id="showingFrom">0</span> to <span id="showingTo">0</span> of <span id="showingTotal">0</span> undertakings
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
                        <th>Title & Version</th>
                        <th>Type</th>
                        <th>Category</th>
                        <th>Acceptance</th>
                        <th>Effective Date</th>
                        <th>Approval</th>
                        <th>Status</th>
                        <th class="text-center pe-4">Actions</th>
                    </tr>
                </thead>
                <tbody id="undertakingTableBody">
                    <tr>
                        <td colspan="9" class="text-center py-5">
                            <div class="spinner-border text-primary" role="status"></div>
                            <p class="mt-3 text-muted">Loading undertakings...</p>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <!-- PAGINATION CONTROLS (BOTTOM) -->
    <div class="pagination-controls mt-3">
        <nav aria-label="Undertaking pagination">
            <ul class="pagination justify-content-center mb-0" id="paginationContainer"></ul>
        </nav>
    </div>
</div>

<!-- ============================================ -->
<!-- 🔥 EDIT UNDERTAKING MODAL                    -->
<!-- ============================================ -->
<div class="modal fade" id="editUndertakingModal" tabindex="-1" data-bs-backdrop="static">
    <div class="modal-dialog modal-xl modal-dialog-scrollable">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title"><i class="bi bi-pencil-square me-2"></i>Edit Undertaking</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <form id="editUndertakingForm">
                    <input type="hidden" id="editUndertakingId">
                    
                    <!-- Basic Info -->
                    <div class="edit-section">
                        <h6 class="section-title">Basic Information</h6>
                        <div class="row g-3">
                            <div class="col-md-4">
                                <label class="form-label">Title <span class="text-danger">*</span></label>
                                <input type="text" class="form-control" id="editUndertakingTitle" required>
                            </div>
                            <div class="col-md-2">
                                <label class="form-label">Code</label>
                                <input type="text" class="form-control" id="editUndertakingCode" readonly>
                            </div>
                            <div class="col-md-2">
                                <label class="form-label">Version</label>
                                <input type="text" class="form-control" id="editUndertakingVersion" readonly>
                            </div>
                            <div class="col-md-2">
                                <label class="form-label">Status</label>
                                <select class="form-select" id="editUndertakingStatus">
                                    <option value="Draft">Draft</option>
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                    <option value="Archived">Archived</option>
                                </select>
                            </div>
                            <div class="col-md-2">
                                <label class="form-label">Priority</label>
                                <input type="number" class="form-control" id="editUndertakingPriority" min="1">
                            </div>
                            <div class="col-md-4">
                                <label class="form-label">Type</label>
                                <select class="form-select" id="editUndertakingType">
                                    <option value="Customer">Customer</option>
                                    <option value="Staff">Staff</option>
                                    <option value="Carrier-Specific">Carrier-Specific</option>
                                    <option value="Customs">Customs</option>
                                    <option value="High-Value">High-Value</option>
                                    <option value="Fragile">Fragile</option>
                                    <option value="Dangerous-Goods">Dangerous Goods</option>
                                </select>
                            </div>
                            <div class="col-md-4">
                                <label class="form-label">Category</label>
                                <select class="form-select" id="editUndertakingCategory">
                                    <option value="Domestic">Domestic</option>
                                    <option value="International">International</option>
                                    <option value="Both">Both</option>
                                    <option value="Special">Special</option>
                                </select>
                            </div>
                            <div class="col-md-2">
                                <label class="form-label">Language</label>
                                <select class="form-select" id="editUndertakingLanguage">
                                    <option value="English">English</option>
                                    <option value="Urdu">Urdu</option>
                                    <option value="Both">Both</option>
                                </select>
                            </div>
                            <div class="col-md-2">
                                <label class="form-label d-block">Mandatory</label>
                                <div class="form-check form-switch">
                                    <input class="form-check-input" type="checkbox" id="editIsMandatory">
                                    <label class="form-check-label" for="editIsMandatory">Required</label>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Short Description</label>
                                <input type="text" class="form-control" id="editUndertakingShortDesc">
                            </div>
                        </div>
                    </div>

                    <!-- Declaration -->
                    <div class="edit-section">
                        <h6 class="section-title">Declaration Statement</h6>
                        <div class="row g-3">
                            <div class="col-12">
                                <textarea class="form-control" id="editDeclarationText" rows="3"></textarea>
                            </div>
                        </div>
                    </div>

                    <!-- Content (Quill Editor) -->
                    <div class="edit-section">
                        <h6 class="section-title">Full Undertaking Content</h6>
                        <div id="editUndertakingEditor" style="min-height: 300px;"></div>
                    </div>

                    <!-- Acceptance -->
                    <div class="edit-section">
                        <h6 class="section-title">Acceptance Method</h6>
                        <div class="row g-3">
                            <div class="col-md-4">
                                <label class="form-label">Acceptance Type</label>
                                <select class="form-select" id="editAcceptanceType">
                                    <option value="Checkbox">Checkbox</option>
                                    <option value="Digital-Signature">Digital Signature</option>
                                    <option value="Physical-Signature">Physical Signature</option>
                                    <option value="OTP-Verification">OTP Verification</option>
                                </select>
                            </div>
                            <div class="col-md-4">
                                <label class="form-label">Checkbox Label</label>
                                <input type="text" class="form-control" id="editAcceptanceLabel">
                            </div>
                            <div class="col-md-4">
                                <label class="form-label">Signature Placeholder</label>
                                <input type="text" class="form-control" id="editSignaturePlaceholder">
                            </div>
                            <div class="col-md-4">
                                <div class="form-check form-switch mt-4">
                                    <input class="form-check-input" type="checkbox" id="editRequiresSignature">
                                    <label class="form-check-label" for="editRequiresSignature">Requires Signature</label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Applicability -->
                    <div class="edit-section">
                        <h6 class="section-title">Applicability Rules</h6>
                        <div class="row g-3">
                            <div class="col-md-4">
                                <label class="form-label fw-semibold">Shipment Types</label>
                                <div class="rex-checkbox-group">
                                    <div class="form-check"><input class="form-check-input edit-apply-shipment" type="checkbox" value="Document" id="editApplyDoc"><label class="form-check-label" for="editApplyDoc">Documents</label></div>
                                    <div class="form-check"><input class="form-check-input edit-apply-shipment" type="checkbox" value="Parcel" id="editApplyParcel"><label class="form-check-label" for="editApplyParcel">Parcels</label></div>
                                    <div class="form-check"><input class="form-check-input edit-apply-shipment" type="checkbox" value="Cargo" id="editApplyCargo"><label class="form-check-label" for="editApplyCargo">Cargo</label></div>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <label class="form-label fw-semibold">Service Direction</label>
                                <div class="rex-checkbox-group">
                                    <div class="form-check"><input class="form-check-input edit-apply-direction" type="checkbox" value="Domestic" id="editApplyDom"><label class="form-check-label" for="editApplyDom">Domestic</label></div>
                                    <div class="form-check"><input class="form-check-input edit-apply-direction" type="checkbox" value="International" id="editApplyInt"><label class="form-check-label" for="editApplyInt">International</label></div>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <label class="form-label fw-semibold">Customer Types</label>
                                <div class="rex-checkbox-group">
                                    <div class="form-check"><input class="form-check-input edit-apply-customer" type="checkbox" value="Cash" id="editApplyCash"><label class="form-check-label" for="editApplyCash">Cash</label></div>
                                    <div class="form-check"><input class="form-check-input edit-apply-customer" type="checkbox" value="Account" id="editApplyAcc"><label class="form-check-label" for="editApplyAcc">Account</label></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Date & Approval -->
                    <div class="edit-section">
                        <h6 class="section-title">Effective Date & Approval</h6>
                        <div class="row g-3">
                            <div class="col-md-3">
                                <label class="form-label">Effective From <span class="text-danger">*</span></label>
                                <input type="date" class="form-control" id="editEffectiveFrom" required>
                            </div>
                            <div class="col-md-3">
                                <label class="form-label">Effective Until</label>
                                <input type="date" class="form-control" id="editEffectiveTo">
                            </div>
                            <div class="col-md-3">
                                <label class="form-label">Approval Status</label>
                                <select class="form-select" id="editApprovalStatus">
                                    <option value="Pending">Pending</option>
                                    <option value="Approved">Approved</option>
                                    <option value="Rejected">Rejected</option>
                                </select>
                            </div>
                            <div class="col-md-3">
                                <label class="form-label">Approved By</label>
                                <input type="text" class="form-control" id="editApprovedBy">
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Legal Reference</label>
                                <input type="text" class="form-control" id="editLegalReference">
                            </div>
                        </div>
                    </div>

                    <!-- Display Settings -->
                    <div class="edit-section">
                        <h6 class="section-title">Display Settings</h6>
                        <div class="row g-3">
                            <div class="col-md-3"><div class="form-check form-switch"><input class="form-check-input" type="checkbox" id="editShowBooking"><label class="form-check-label" for="editShowBooking">Show on Booking</label></div></div>
                            <div class="col-md-3"><div class="form-check form-switch"><input class="form-check-input" type="checkbox" id="editPrintReceipt"><label class="form-check-label" for="editPrintReceipt">Print on Receipt</label></div></div>
                            <div class="col-md-3"><div class="form-check form-switch"><input class="form-check-input" type="checkbox" id="editPrintInvoice"><label class="form-check-label" for="editPrintInvoice">Print on Invoice</label></div></div>
                            <div class="col-md-3"><div class="form-check form-switch"><input class="form-check-input" type="checkbox" id="editRequireAck"><label class="form-check-label" for="editRequireAck">Require Acknowledgment</label></div></div>
                        </div>
                    </div>

                    <!-- Notes -->
                    <div class="edit-section">
                        <h6 class="section-title">Internal Notes</h6>
                        <textarea class="form-control" id="editInternalNotes" rows="2"></textarea>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal"><i class="bi bi-x-circle me-1"></i> Cancel</button>
                <button type="button" class="btn btn-rex-primary" id="btnSaveUndertakingEdit">
                    <span class="btn-text"><i class="bi bi-check-circle me-1"></i> Save Changes</span>
                    <span class="btn-loader d-none"><span class="spinner-border spinner-border-sm me-2"></span> Saving...</span>
                </button>
            </div>
        </div>
    </div>
</div>

<!-- ============================================ -->
<!-- 🔥 PREVIEW MODAL                             -->
<!-- ============================================ -->
<div class="modal fade" id="undertakingPreviewModal" tabindex="-1">
    <div class="modal-dialog modal-xl modal-dialog-scrollable">
        <div class="modal-content">
            <div class="modal-header bg-primary text-white">
                <h5 class="modal-title"><i class="bi bi-eye me-2"></i>Undertaking Preview</h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body p-4">
                <div class="preview-container">
                    <div class="preview-header text-center mb-4">
                        <h2 id="previewTitle" class="mb-2">Undertaking Title</h2>
                        <p class="text-muted" id="previewVersion">Version: v1.0</p>
                        <hr>
                    </div>
                    <div class="preview-declaration" id="previewDeclaration"></div>
                    <hr>
                    <div class="preview-content" id="previewContent"></div>
                    <hr class="my-4">
                    <div class="preview-acceptance">
                        <h6 class="fw-bold">Acceptance:</h6>
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" id="previewAcceptCheckbox" disabled>
                            <label class="form-check-label" for="previewAcceptCheckbox" id="previewAcceptanceLabel">
                                I have read and accept
                            </label>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" id="btnPrintPreview"><i class="bi bi-printer me-1"></i> Print</button>
            </div>
        </div>
    </div>
</div>

<!-- SUCCESS & ERROR MODALS -->
<div class="modal fade" id="undertakingEditSuccessModal" tabindex="-1" data-bs-backdrop="static">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow">
            <div class="modal-body text-center p-5">
                <div class="success-icon-wrapper mb-4"><i class="bi bi-check-circle-fill"></i></div>
                <h3 class="fw-bold mb-2">Undertaking Updated!</h3>
                <p class="text-muted mb-4">Undertaking has been successfully updated.</p>
                <button type="button" class="btn btn-rex-primary" id="btnCloseEditSuccess"><i class="bi bi-check-circle me-1"></i> OK</button>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="undertakingEditErrorModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow">
            <div class="modal-header bg-danger text-white border-0">
                <h5 class="modal-title"><i class="bi bi-exclamation-triangle-fill me-2"></i>Error</h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body py-4">
                <p id="undertakingEditErrorMessage" class="mb-0 fs-5 text-center">Something went wrong.</p>
            </div>
            <div class="modal-footer border-0 justify-content-center">
                <button type="button" class="btn btn-secondary px-4" data-bs-dismiss="modal">OK</button>
            </div>
        </div>
    </div>
</div>