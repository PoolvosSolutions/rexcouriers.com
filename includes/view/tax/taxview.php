<?php
// includes/view/tax/taxview.php
// 🔥 Tax List View - Rexcouris
?>

<div class="container-fluid py-4 taxview-page">
    
    <!-- PAGE HEADER -->
    <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
            <h3 class="mb-1"><i class="bi bi-receipt-cutoff text-danger me-2"></i>Tax Configuration</h3>
            <p class="text-muted mb-0 small">Manage all tax rules (GST, SST, WHT) for Pakistan tax compliance</p>
        </div>
        <button type="button" class="btn btn-rex-primary" onclick="loadView('addtax')">
            <i class="bi bi-plus-circle me-1"></i> Add New Tax
        </button>
    </div>

    <!-- STATS CARDS -->
    <div class="row g-3 mb-4">
        <div class="col-md-3">
            <div class="stat-card stat-total">
                <div class="stat-icon"><i class="bi bi-receipt"></i></div>
                <div class="stat-info">
                    <div class="stat-value" id="statTotal">0</div>
                    <div class="stat-label">Total Taxes</div>
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
            <div class="stat-card stat-gst">
                <div class="stat-icon"><i class="bi bi-globe"></i></div>
                <div class="stat-info">
                    <div class="stat-value" id="statGST">0</div>
                    <div class="stat-label">GST (Federal)</div>
                </div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="stat-card stat-sst">
                <div class="stat-icon"><i class="bi bi-geo-alt"></i></div>
                <div class="stat-info">
                    <div class="stat-value" id="statSST">0</div>
                    <div class="stat-label">SST (Sindh)</div>
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
                    <select class="form-select" id="filterAuthority">
                        <option value="">All Authorities</option>
                        <option value="FBR">FBR (Federal)</option>
                        <option value="SRB">SRB (Sindh)</option>
                        <option value="PRA">PRA (Punjab)</option>
                        <option value="KRA">KRA (KPK)</option>
                        <option value="BRA">BRA (Balochistan)</option>
                    </select>
                </div>
                <div class="col-md-2">
                    <select class="form-select" id="filterJurisdiction">
                        <option value="">All Jurisdictions</option>
                        <option value="Federal">Federal</option>
                        <option value="Provincial">Provincial</option>
                        <option value="Both">Both</option>
                    </select>
                </div>
                <div class="col-md-3">
                    <select class="form-select" id="filterProvince">
                        <option value="">All Provinces</option>
                        <option value="Sindh">Sindh</option>
                        <option value="Punjab">Punjab</option>
                        <option value="KPK">KPK</option>
                        <option value="Balochistan">Balochistan</option>
                        <option value="Islamabad">Islamabad</option>
                    </select>
                </div>
            </div>
        </div>
    </div>

    <!-- PAGINATION CONTROLS (TOP) -->
    <div class="pagination-controls mb-3">
        <div class="d-flex justify-content-between align-items-center">
            <div class="showing-info">
                Showing <span id="showingFrom">0</span> to <span id="showingTo">0</span> of <span id="showingTotal">0</span> taxes
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
                        <th>Tax Name</th>
                        <th>Rate</th>
                        <th>Authority</th>
                        <th>Provinces</th>
                        <th>Filer Status</th>
                        <th>Effective Date</th>
                        <th>Status</th>
                        <th class="text-center pe-4">Actions</th>
                    </tr>
                </thead>
                <tbody id="taxTableBody">
                    <tr>
                        <td colspan="9" class="text-center py-5">
                            <div class="spinner-border text-primary" role="status"></div>
                            <p class="mt-3 text-muted">Loading taxes...</p>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <!-- PAGINATION CONTROLS (BOTTOM) -->
    <div class="pagination-controls mt-3">
        <nav aria-label="Tax pagination">
            <ul class="pagination justify-content-center mb-0" id="paginationContainer"></ul>
        </nav>
    </div>
</div>

<!-- ============================================ -->
<!-- 🔥 EDIT TAX MODAL                            -->
<!-- ============================================ -->
<div class="modal fade" id="editTaxModal" tabindex="-1" data-bs-backdrop="static">
    <div class="modal-dialog modal-xl modal-dialog-scrollable">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title"><i class="bi bi-pencil-square me-2"></i>Edit Tax Configuration</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <form id="editTaxForm">
                    <input type="hidden" id="editTaxId">
                    
                    <!-- Basic Info -->
                    <div class="edit-section">
                        <h6 class="section-title">Basic Information</h6>
                        <div class="row g-3">
                            <div class="col-md-5">
                                <label class="form-label">Tax Name <span class="text-danger">*</span></label>
                                <input type="text" class="form-control" id="editTaxName" required>
                            </div>
                            <div class="col-md-3">
                                <label class="form-label">Tax Code</label>
                                <input type="text" class="form-control" id="editTaxCode" readonly>
                            </div>
                            <div class="col-md-2">
                                <label class="form-label">Status</label>
                                <select class="form-select" id="editTaxStatus">
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </div>
                            <div class="col-md-2">
                                <label class="form-label">Priority</label>
                                <input type="number" class="form-control" id="editTaxPriority" min="1">
                            </div>
                            <div class="col-md-4">
                                <label class="form-label">Tax Authority <span class="text-danger">*</span></label>
                                <select class="form-select" id="editTaxAuthority" required>
                                    <option value="FBR">FBR (Federal)</option>
                                    <option value="SRB">SRB (Sindh)</option>
                                    <option value="PRA">PRA (Punjab)</option>
                                    <option value="KRA">KRA (KPK)</option>
                                    <option value="BRA">BRA (Balochistan)</option>
                                    <option value="Internal">Internal</option>
                                </select>
                            </div>
                            <div class="col-md-4">
                                <label class="form-label">Jurisdiction</label>
                                <select class="form-select" id="editTaxJurisdiction">
                                    <option value="Federal">Federal</option>
                                    <option value="Provincial">Provincial</option>
                                    <option value="Both">Both</option>
                                </select>
                            </div>
                            <div class="col-md-4">
                                <label class="form-label">Notification Reference</label>
                                <input type="text" class="form-control" id="editNotificationRef">
                            </div>
                            <div class="col-12">
                                <label class="form-label">Description</label>
                                <textarea class="form-control" id="editTaxDescription" rows="2"></textarea>
                            </div>
                        </div>
                    </div>

                    <!-- Rate & Calculation -->
                    <div class="edit-section">
                        <h6 class="section-title">Tax Rate & Calculation</h6>
                        <div class="row g-3">
                            <div class="col-md-3">
                                <label class="form-label">Tax Rate <span class="text-danger">*</span></label>
                                <div class="input-group">
                                    <input type="number" class="form-control" id="editTaxRate" required min="0" max="100" step="0.01">
                                    <span class="input-group-text">%</span>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <label class="form-label">Calculation Base</label>
                                <select class="form-select" id="editCalculationBase">
                                    <option value="subtotal">On Subtotal</option>
                                    <option value="grand_total">On Grand Total</option>
                                    <option value="base_freight">On Base Freight</option>
                                    <option value="custom">Custom</option>
                                </select>
                            </div>
                            <div class="col-md-3">
                                <label class="form-label">Rounding</label>
                                <select class="form-select" id="editRoundingType">
                                    <option value="none">No Rounding</option>
                                    <option value="up">Round Up</option>
                                    <option value="down">Round Down</option>
                                    <option value="nearest">Round to Nearest</option>
                                </select>
                            </div>
                            <div class="col-md-3">
                                <label class="form-label d-block">Compound Tax</label>
                                <div class="form-check form-switch">
                                    <input class="form-check-input" type="checkbox" id="editIsCompoundTax">
                                    <label class="form-check-label" for="editIsCompoundTax">Applied after other taxes</label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Province Applicability -->
                    <div class="edit-section">
                        <h6 class="section-title">Applicable Provinces</h6>
                        <div class="row g-3">
                            <div class="col-12">
                                <div class="edit-province-grid">
                                    <label class="edit-province-item"><input type="checkbox" class="edit-province-check" value="Sindh"> <span>Sindh</span></label>
                                    <label class="edit-province-item"><input type="checkbox" class="edit-province-check" value="Punjab"> <span>Punjab</span></label>
                                    <label class="edit-province-item"><input type="checkbox" class="edit-province-check" value="KPK"> <span>KPK</span></label>
                                    <label class="edit-province-item"><input type="checkbox" class="edit-province-check" value="Balochistan"> <span>Balochistan</span></label>
                                    <label class="edit-province-item"><input type="checkbox" class="edit-province-check" value="Islamabad"> <span>Islamabad</span></label>
                                    <label class="edit-province-item"><input type="checkbox" class="edit-province-check" value="Gilgit-Baltistan"> <span>Gilgit-Baltistan</span></label>
                                    <label class="edit-province-item"><input type="checkbox" class="edit-province-check" value="AJK"> <span>AJK</span></label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Filer Status -->
                    <div class="edit-section">
                        <h6 class="section-title">Applicable Filer Status</h6>
                        <div class="row g-3">
                            <div class="col-md-4">
                                <div class="form-check"><input class="form-check-input edit-filer-check" type="checkbox" value="Filer" id="editFilerFiler"><label class="form-check-label" for="editFilerFiler">Filer</label></div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-check"><input class="form-check-input edit-filer-check" type="checkbox" value="Non-Filer" id="editFilerNonFiler"><label class="form-check-label" for="editFilerNonFiler">Non-Filer</label></div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-check"><input class="form-check-input edit-filer-check" type="checkbox" value="Tax-Exempt" id="editFilerExempt"><label class="form-check-label" for="editFilerExempt">Tax-Exempt</label></div>
                            </div>
                        </div>
                    </div>

                    <!-- Customer & Service Type -->
                    <div class="edit-section">
                        <h6 class="section-title">Applicable Customer & Service Types</h6>
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label class="form-label fw-semibold">Customer Types</label>
                                <div class="rex-checkbox-group">
                                    <div class="form-check"><input class="form-check-input edit-cust-check" type="checkbox" value="Cash" id="editCustCash"><label class="form-check-label" for="editCustCash">Cash</label></div>
                                    <div class="form-check"><input class="form-check-input edit-cust-check" type="checkbox" value="Account" id="editCustAccount"><label class="form-check-label" for="editCustAccount">Account</label></div>
                                    <div class="form-check"><input class="form-check-input edit-cust-check" type="checkbox" value="Walk-in" id="editCustWalkin"><label class="form-check-label" for="editCustWalkin">Walk-in</label></div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label fw-semibold">Service Types</label>
                                <div class="rex-checkbox-group">
                                    <div class="form-check"><input class="form-check-input edit-svc-check" type="checkbox" value="Domestic" id="editSvcDom"><label class="form-check-label" for="editSvcDom">Domestic</label></div>
                                    <div class="form-check"><input class="form-check-input edit-svc-check" type="checkbox" value="International" id="editSvcInt"><label class="form-check-label" for="editSvcInt">International</label></div>
                                    <div class="form-check"><input class="form-check-input edit-svc-check" type="checkbox" value="Document" id="editSvcDoc"><label class="form-check-label" for="editSvcDoc">Document</label></div>
                                    <div class="form-check"><input class="form-check-input edit-svc-check" type="checkbox" value="Parcel" id="editSvcParcel"><label class="form-check-label" for="editSvcParcel">Parcel</label></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Date Range -->
                    <div class="edit-section">
                        <h6 class="section-title">Effective Date Range</h6>
                        <div class="row g-3">
                            <div class="col-md-4">
                                <label class="form-label">Effective From <span class="text-danger">*</span></label>
                                <input type="date" class="form-control" id="editEffectiveFrom" required>
                            </div>
                            <div class="col-md-4">
                                <label class="form-label">Effective Until</label>
                                <input type="date" class="form-control" id="editEffectiveTo">
                            </div>
                        </div>
                    </div>

                    <!-- Display & Accounting -->
                    <div class="edit-section">
                        <h6 class="section-title">Display & Accounting</h6>
                        <div class="row g-3">
                            <div class="col-md-3"><div class="form-check form-switch"><input class="form-check-input" type="checkbox" id="editShowBooking"><label class="form-check-label" for="editShowBooking">Show on Booking</label></div></div>
                            <div class="col-md-3"><div class="form-check form-switch"><input class="form-check-input" type="checkbox" id="editShowInvoice"><label class="form-check-label" for="editShowInvoice">Show on Invoice</label></div></div>
                            <div class="col-md-3"><div class="form-check form-switch"><input class="form-check-input" type="checkbox" id="editShowReceipt"><label class="form-check-label" for="editShowReceipt">Show on Receipt</label></div></div>
                            <div class="col-md-3"><div class="form-check form-switch"><input class="form-check-input" type="checkbox" id="editAutoApply"><label class="form-check-label" for="editAutoApply">Auto-Apply</label></div></div>
                        </div>
                        <hr class="my-3">
                        <div class="row g-3">
                            <div class="col-md-4">
                                <label class="form-label">GL Account Code</label>
                                <input type="text" class="form-control" id="editGlAccountCode">
                            </div>
                            <div class="col-md-4">
                                <label class="form-label">Tax Category</label>
                                <select class="form-select" id="editTaxCategory">
                                    <option value="output">Output Tax</option>
                                    <option value="input">Input Tax</option>
                                    <option value="withholding">Withholding Tax</option>
                                </select>
                            </div>
                            <div class="col-md-4">
                                <label class="form-label">Reporting Frequency</label>
                                <select class="form-select" id="editReportingType">
                                    <option value="monthly">Monthly</option>
                                    <option value="quarterly">Quarterly</option>
                                    <option value="annual">Annual</option>
                                </select>
                            </div>
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
                <button type="button" class="btn btn-rex-primary" id="btnSaveTaxEdit">
                    <span class="btn-text"><i class="bi bi-check-circle me-1"></i> Save Changes</span>
                    <span class="btn-loader d-none"><span class="spinner-border spinner-border-sm me-2"></span> Saving...</span>
                </button>
            </div>
        </div>
    </div>
</div>

<!-- SUCCESS & ERROR MODALS -->
<div class="modal fade" id="taxEditSuccessModal" tabindex="-1" data-bs-backdrop="static">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow">
            <div class="modal-body text-center p-5">
                <div class="success-icon-wrapper mb-4"><i class="bi bi-check-circle-fill"></i></div>
                <h3 class="fw-bold mb-2">Tax Updated!</h3>
                <p class="text-muted mb-4">Tax configuration has been successfully updated.</p>
                <button type="button" class="btn btn-rex-primary" id="btnCloseEditSuccess"><i class="bi bi-check-circle me-1"></i> OK</button>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="taxEditErrorModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow">
            <div class="modal-header bg-danger text-white border-0">
                <h5 class="modal-title"><i class="bi bi-exclamation-triangle-fill me-2"></i>Error</h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body py-4">
                <p id="taxEditErrorMessage" class="mb-0 fs-5 text-center">Something went wrong.</p>
            </div>
            <div class="modal-footer border-0 justify-content-center">
                <button type="button" class="btn btn-secondary px-4" data-bs-dismiss="modal">OK</button>
            </div>
        </div>
    </div>
</div>