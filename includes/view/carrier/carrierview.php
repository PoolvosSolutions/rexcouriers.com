<?php
// includes/view/carrier/carrierview.php
// 🔥 Carrier List View - Rexcouris
?>

<div class="container-fluid py-4 carrierview-page">
    
    <!-- ============================================ -->
    <!-- PAGE HEADER                                  -->
    <!-- ============================================ -->
    <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
            <h3 class="mb-1"><i class="bi bi-buildings text-danger me-2"></i>Carrier Partner Management</h3>
            <p class="text-muted mb-0 small">Manage all your courier partners (DHL, Skynet, TCS, LCS, etc.)</p>
        </div>
        <button type="button" class="btn btn-rex-primary" onclick="loadView('addcarrier')">
            <i class="bi bi-plus-circle me-1"></i> Add New Carrier
        </button>
    </div>

    <!-- ============================================ -->
    <!-- STATS CARDS                                  -->
    <!-- ============================================ -->
    <div class="row g-3 mb-4">
        <div class="col-md-3">
            <div class="stat-card stat-total">
                <div class="stat-icon"><i class="bi bi-buildings"></i></div>
                <div class="stat-info">
                    <div class="stat-value" id="statTotal">0</div>
                    <div class="stat-label">Total Carriers</div>
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
            <div class="stat-card stat-international">
                <div class="stat-icon"><i class="bi bi-globe-americas"></i></div>
                <div class="stat-info">
                    <div class="stat-value" id="statInternational">0</div>
                    <div class="stat-label">International</div>
                </div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="stat-card stat-domestic">
                <div class="stat-icon"><i class="bi bi-truck"></i></div>
                <div class="stat-info">
                    <div class="stat-value" id="statDomestic">0</div>
                    <div class="stat-label">Domestic</div>
                </div>
            </div>
        </div>
    </div>

    <!-- ============================================ -->
    <!-- FILTERS & SEARCH                             -->
    <!-- ============================================ -->
    <div class="filter-card mb-4">
        <div class="filter-header">
            <h6 class="mb-0"><i class="bi bi-funnel me-2"></i>Filters & Search</h6>
            <button type="button" class="btn btn-sm btn-outline-secondary" id="btnClearFilters">
                <i class="bi bi-x-circle me-1"></i> Clear Filters
            </button>
        </div>
        <div class="filter-body">
            <div class="row g-3">
                
                <!-- Search Bar -->
                <div class="col-md-4">
                    <div class="input-group">
                        <span class="input-group-text"><i class="bi bi-search"></i></span>
                        <input type="text" class="form-control" id="searchInput" 
                               placeholder="Search by name, code, contact person...">
                    </div>
                </div>

                <!-- Status Filter -->
                <div class="col-md-2">
                    <select class="form-select" id="filterStatus">
                        <option value="">All Status</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                </div>

                <!-- Type Filter -->
                <div class="col-md-2">
                    <select class="form-select" id="filterType">
                        <option value="">All Types</option>
                        <option value="International">International</option>
                        <option value="Domestic">Domestic</option>
                        <option value="Both">Both</option>
                    </select>
                </div>

                <!-- Priority Filter -->
                <div class="col-md-2">
                    <select class="form-select" id="filterPriority">
                        <option value="">All Priorities</option>
                        <option value="1">Priority 1</option>
                        <option value="2">Priority 2</option>
                        <option value="3">Priority 3</option>
                        <option value="4">Priority 4</option>
                        <option value="5">Priority 5</option>
                    </select>
                </div>

                <!-- Payment Terms Filter -->
                <div class="col-md-2">
                    <select class="form-select" id="filterPayment">
                        <option value="">All Payments</option>
                        <option value="Prepaid">Prepaid</option>
                        <option value="Postpaid">Postpaid</option>
                        <option value="COD">COD</option>
                    </select>
                </div>

            </div>
        </div>
    </div>

    <!-- ============================================ -->
    <!-- PAGINATION CONTROLS (TOP)                    -->
    <!-- ============================================ -->
    <div class="pagination-controls mb-3">
        <div class="d-flex justify-content-between align-items-center">
            <div class="showing-info">
                Showing <span id="showingFrom">0</span> to <span id="showingTo">0</span> of 
                <span id="showingTotal">0</span> carriers
            </div>
            <div class="items-per-page">
                <label>Items per page:</label>
                <select class="form-select form-select-sm" id="itemsPerPage">
                    <option value="100" selected>100</option>
                    <option value="200">200</option>
                    <option value="500">500</option>
                </select>
            </div>
        </div>
    </div>

    <!-- ============================================ -->
    <!-- DATA TABLE                                   -->
    <!-- ============================================ -->
    <div class="table-card">
        <div class="table-responsive">
            <table class="table table-hover align-middle mb-0">
                <thead>
                    <tr>
                        <th class="ps-4">Code</th>
                        <th>Carrier Name</th>
                        <th>Type</th>
                        <th>Contact Person</th>
                        <th>Contact #</th>
                        <th>Priority</th>
                        <th>Payment</th>
                        <th>Status</th>
                        <th class="text-center pe-4">Actions</th>
                    </tr>
                </thead>
                <tbody id="carrierTableBody">
                    <tr>
                        <td colspan="9" class="text-center py-5">
                            <div class="spinner-border text-primary" role="status"></div>
                            <p class="mt-3 text-muted">Loading carriers...</p>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <!-- ============================================ -->
    <!-- PAGINATION CONTROLS (BOTTOM)                 -->
    <!-- ============================================ -->
    <div class="pagination-controls mt-3">
        <nav aria-label="Carrier pagination">
            <ul class="pagination justify-content-center mb-0" id="paginationContainer">
                <!-- Pagination buttons will be generated here -->
            </ul>
        </nav>
    </div>

</div>

<!-- ============================================ -->
<!-- 🔥 EDIT CARRIER MODAL                        -->
<!-- ============================================ -->
<div class="modal fade" id="editCarrierModal" tabindex="-1" data-bs-backdrop="static">
    <div class="modal-dialog modal-lg modal-dialog-scrollable">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title"><i class="bi bi-pencil-square me-2"></i>Edit Carrier Partner</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <form id="editCarrierForm">
                    <input type="hidden" id="editCarrierId">
                    
                    <!-- Basic Information -->
                    <div class="edit-section">
                        <h6 class="section-title">Basic Information</h6>
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label class="form-label">Carrier Name <span class="text-danger">*</span></label>
                                <input type="text" class="form-control" id="editCarrierName" required>
                            </div>
                            <div class="col-md-3">
                                <label class="form-label">Carrier Code <span class="text-danger">*</span></label>
                                <input type="text" class="form-control" id="editCarrierCode" required maxlength="10">
                            </div>
                            <div class="col-md-3">
                                <label class="form-label">Service Type <span class="text-danger">*</span></label>
                                <select class="form-select" id="editCarrierType" required>
                                    <option value="International">International</option>
                                    <option value="Domestic">Domestic</option>
                                    <option value="Both">Both</option>
                                </select>
                            </div>
                            <div class="col-md-4">
                                <label class="form-label">Status</label>
                                <select class="form-select" id="editStatus">
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </div>
                            <div class="col-md-4">
                                <label class="form-label">Priority Level</label>
                                <select class="form-select" id="editPriority">
                                    <option value="1">1 - Highest</option>
                                    <option value="2">2 - High</option>
                                    <option value="3">3 - Medium</option>
                                    <option value="4">4 - Low</option>
                                    <option value="5">5 - Lowest</option>
                                </select>
                            </div>
                            <div class="col-md-4">
                                <label class="form-label">Website</label>
                                <input type="url" class="form-control" id="editWebsite">
                            </div>
                        </div>
                    </div>

                    <!-- Contact Information -->
                    <div class="edit-section">
                        <h6 class="section-title">Contact Information</h6>
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label class="form-label">Contact Person <span class="text-danger">*</span></label>
                                <input type="text" class="form-control" id="editContactPerson" required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Designation</label>
                                <input type="text" class="form-control" id="editDesignation">
                            </div>
                            <div class="col-md-4">
                                <label class="form-label">Contact Number <span class="text-danger">*</span></label>
                                <div class="input-group">
                                    <span class="input-group-text">+92</span>
                                    <input type="tel" class="form-control" id="editContactNumber" required maxlength="10">
                                </div>
                            </div>
                            <div class="col-md-4">
                                <label class="form-label">Email</label>
                                <input type="email" class="form-control" id="editContactEmail">
                            </div>
                            <div class="col-md-4">
                                <label class="form-label">WhatsApp</label>
                                <div class="input-group">
                                    <span class="input-group-text">+92</span>
                                    <input type="tel" class="form-control" id="editWhatsappNumber" maxlength="10">
                                </div>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Support Number</label>
                                <input type="text" class="form-control" id="editSupportNumber">
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Support Email</label>
                                <input type="email" class="form-control" id="editSupportEmail">
                            </div>
                        </div>
                    </div>

                    <!-- Address -->
                    <div class="edit-section">
                        <h6 class="section-title">Head Office Address</h6>
                        <div class="row g-3">
                            <div class="col-12">
                                <label class="form-label">Street Address</label>
                                <textarea class="form-control" id="editAddress" rows="2"></textarea>
                            </div>
                            <div class="col-md-4">
                                <label class="form-label">City</label>
                                <input type="text" class="form-control" id="editCity">
                            </div>
                            <div class="col-md-4">
                                <label class="form-label">State</label>
                                <input type="text" class="form-control" id="editState">
                            </div>
                            <div class="col-md-4">
                                <label class="form-label">Country</label>
                                <input type="text" class="form-control" id="editCountry">
                            </div>
                        </div>
                    </div>

                    <!-- Account & Contract -->
                    <div class="edit-section">
                        <h6 class="section-title">Account & Contract Details</h6>
                        <div class="row g-3">
                            <div class="col-md-4">
                                <label class="form-label">Account Number</label>
                                <input type="text" class="form-control" id="editAccountNumber">
                            </div>
                            <div class="col-md-4">
                                <label class="form-label">Payment Terms</label>
                                <select class="form-select" id="editPaymentTerms">
                                    <option value="Prepaid">Prepaid</option>
                                    <option value="Postpaid">Postpaid</option>
                                    <option value="COD">COD</option>
                                </select>
                            </div>
                            <div class="col-md-4">
                                <label class="form-label">Billing Cycle</label>
                                <select class="form-select" id="editBillingCycle">
                                    <option value="Weekly">Weekly</option>
                                    <option value="Bi-Weekly">Bi-Weekly</option>
                                    <option value="Monthly">Monthly</option>
                                    <option value="Quarterly">Quarterly</option>
                                </select>
                            </div>
                            <div class="col-md-4">
                                <label class="form-label">Contract Start Date</label>
                                <input type="date" class="form-control" id="editContractStartDate">
                            </div>
                            <div class="col-md-4">
                                <label class="form-label">Contract End Date</label>
                                <input type="date" class="form-control" id="editContractEndDate">
                            </div>
                            <div class="col-md-4">
                                <label class="form-label">Credit Limit (PKR)</label>
                                <input type="number" class="form-control" id="editCreditLimit" min="0">
                            </div>
                        </div>
                    </div>

                    <!-- API & Integration -->
                    <div class="edit-section">
                        <h6 class="section-title">API & Integration</h6>
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label class="form-label">API Endpoint URL</label>
                                <input type="url" class="form-control" id="editApiEndpoint">
                            </div>
                            <div class="col-md-3">
                                <label class="form-label">API Key</label>
                                <input type="text" class="form-control" id="editApiKey">
                            </div>
                            <div class="col-md-3">
                                <label class="form-label">API Password</label>
                                <input type="password" class="form-control" id="editApiPassword">
                            </div>
                            <div class="col-12">
                                <label class="form-label">Tracking URL Pattern</label>
                                <input type="text" class="form-control" id="editTrackingUrlPattern" 
                                       placeholder="https://example.com/track?awb={trackingNumber}">
                            </div>
                        </div>
                    </div>

                    <!-- Notes -->
                    <div class="edit-section">
                        <h6 class="section-title">Notes</h6>
                        <div class="row g-3">
                            <div class="col-12">
                                <textarea class="form-control" id="editNotes" rows="2"></textarea>
                            </div>
                        </div>
                    </div>

                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
                    <i class="bi bi-x-circle me-1"></i> Cancel
                </button>
                <button type="button" class="btn btn-rex-primary" id="btnSaveEdit">
                    <span class="btn-text"><i class="bi bi-check-circle me-1"></i> Save Changes</span>
                    <span class="btn-loader d-none">
                        <span class="spinner-border spinner-border-sm me-2"></span> Saving...
                    </span>
                </button>
            </div>
        </div>
    </div>
</div>

<!-- ============================================ -->
<!-- 🔥 SUCCESS MODAL                             -->
<!-- ============================================ -->
<div class="modal fade" id="editSuccessModal" tabindex="-1" data-bs-backdrop="static">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow">
            <div class="modal-body text-center p-5">
                <div class="success-icon-wrapper mb-4">
                    <i class="bi bi-check-circle-fill"></i>
                </div>
                <h3 class="fw-bold mb-2">Carrier Updated!</h3>
                <p class="text-muted mb-4">Carrier partner details have been successfully updated.</p>
                <button type="button" class="btn btn-rex-primary" id="btnCloseSuccess">
                    <i class="bi bi-check-circle me-1"></i> OK
                </button>
            </div>
        </div>
    </div>
</div>

<!-- ============================================ -->
<!-- 🔥 ERROR MODAL                               -->
<!-- ============================================ -->
<div class="modal fade" id="editErrorModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow">
            <div class="modal-header bg-danger text-white border-0">
                <h5 class="modal-title"><i class="bi bi-exclamation-triangle-fill me-2"></i>Error</h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body py-4">
                <p id="editErrorMessage" class="mb-0 fs-5 text-center">Something went wrong.</p>
            </div>
            <div class="modal-footer border-0 justify-content-center">
                <button type="button" class="btn btn-secondary px-4" data-bs-dismiss="modal">OK</button>
            </div>
        </div>
    </div>
</div>