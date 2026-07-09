<?php
// includes/view/customer/customerview.php
// 🔥 Customer List View - Rexcouris
?>

<div class="container-fluid py-4 customerview-page">
    
    <!-- ============================================ -->
    <!-- PAGE HEADER                                  -->
    <!-- ============================================ -->
    <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
            <h3 class="mb-1"><i class="bi bi-people-fill text-danger me-2"></i>Customer Management</h3>
            <p class="text-muted mb-0 small">Manage all your cash and account customers</p>
        </div>
        <button type="button" class="btn btn-rex-primary" onclick="loadView('addcustomer')">
            <i class="bi bi-plus-circle me-1"></i> Add New Customer
        </button>
    </div>

    <!-- ============================================ -->
    <!-- STATS CARDS                                  -->
    <!-- ============================================ -->
    <div class="row g-3 mb-4">
        <div class="col-md-3">
            <div class="stat-card stat-total">
                <div class="stat-icon"><i class="bi bi-people"></i></div>
                <div class="stat-info">
                    <div class="stat-value" id="statTotal">0</div>
                    <div class="stat-label">Total Customers</div>
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
            <div class="stat-card stat-account">
                <div class="stat-icon"><i class="bi bi-briefcase"></i></div>
                <div class="stat-info">
                    <div class="stat-value" id="statAccount">0</div>
                    <div class="stat-label">Account Customers</div>
                </div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="stat-card stat-cash">
                <div class="stat-icon"><i class="bi bi-cash"></i></div>
                <div class="stat-info">
                    <div class="stat-value" id="statCash">0</div>
                    <div class="stat-label">Cash Customers</div>
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
                               placeholder="Search by name, account #, contact, CNIC...">
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

                <!-- Customer Type Filter -->
                <div class="col-md-2">
                    <select class="form-select" id="filterType">
                        <option value="">All Types</option>
                        <option value="Cash">Cash</option>
                        <option value="Account">Account</option>
                    </select>
                </div>

                <!-- Province Filter -->
                <div class="col-md-2">
                    <select class="form-select" id="filterProvince">
                        <option value="">All Provinces</option>
                        <option value="Sindh">Sindh</option>
                        <option value="Punjab">Punjab</option>
                        <option value="KPK">KPK</option>
                        <option value="Balochistan">Balochistan</option>
                        <option value="Gilgit-Baltistan">Gilgit-Baltistan</option>
                        <option value="AJK">AJK</option>
                        <option value="Islamabad">Islamabad</option>
                    </select>
                </div>

                <!-- Filer Filter -->
                <div class="col-md-2">
                    <select class="form-select" id="filterFiler">
                        <option value="">All Filers</option>
                        <option value="Filer">Filer</option>
                        <option value="Non-Filer">Non-Filer</option>
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
                <span id="showingTotal">0</span> customers
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
                        <th class="ps-4">Account #</th>
                        <th>Customer Name</th>
                        <th>Business</th>
                        <th>Contact</th>
                        <th>Type</th>
                        <th>Province</th>
                        <th>Status</th>
                        <th class="text-center pe-4">Actions</th>
                    </tr>
                </thead>
                <tbody id="customerTableBody">
                    <tr>
                        <td colspan="8" class="text-center py-5">
                            <div class="spinner-border text-primary" role="status"></div>
                            <p class="mt-3 text-muted">Loading customers...</p>
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
        <nav aria-label="Customer pagination">
            <ul class="pagination justify-content-center mb-0" id="paginationContainer">
                <!-- Pagination buttons will be generated here -->
            </ul>
        </nav>
    </div>

</div>

<!-- ============================================ -->
<!-- 🔥 EDIT CUSTOMER MODAL                       -->
<!-- ============================================ -->
<div class="modal fade" id="editCustomerModal" tabindex="-1" data-bs-backdrop="static">
    <div class="modal-dialog modal-lg modal-dialog-scrollable">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title"><i class="bi bi-pencil-square me-2"></i>Edit Customer</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <form id="editCustomerForm">
                    <input type="hidden" id="editCustomerId">
                    
                    <!-- Account Information -->
                    <div class="edit-section">
                        <h6 class="section-title">Account Information</h6>
                        <div class="row g-3">
                            <div class="col-md-4">
                                <label class="form-label">Account Number</label>
                                <input type="text" class="form-control" id="editAccountNumber" readonly>
                            </div>
                            <div class="col-md-4">
                                <label class="form-label">Customer Type <span class="text-danger">*</span></label>
                                <select class="form-select" id="editCustomerType" required>
                                    <option value="Cash">Cash Customer</option>
                                    <option value="Account">Account Customer</option>
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
                                <label class="form-label">Category</label>
                                <select class="form-select" id="editCategory">
                                    <option value="Individual">Individual</option>
                                    <option value="Business">Business</option>
                                    <option value="Corporate">Corporate</option>
                                    <option value="E-commerce">E-commerce</option>
                                </select>
                            </div>
                            <div class="col-md-4">
                                <label class="form-label">Province</label>
                                <select class="form-select" id="editProvince">
                                    <option value="Sindh">Sindh</option>
                                    <option value="Punjab">Punjab</option>
                                    <option value="KPK">KPK</option>
                                    <option value="Balochistan">Balochistan</option>
                                    <option value="Gilgit-Baltistan">Gilgit-Baltistan</option>
                                    <option value="AJK">AJK</option>
                                    <option value="Islamabad">Islamabad</option>
                                </select>
                            </div>
                            <div class="col-md-4">
                                <label class="form-label">Filer Status</label>
                                <select class="form-select" id="editFilerStatus">
                                    <option value="Filer">Filer</option>
                                    <option value="Non-Filer">Non-Filer</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <!-- Personal Details -->
                    <div class="edit-section">
                        <h6 class="section-title">Personal & Business Details</h6>
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label class="form-label">Customer Name <span class="text-danger">*</span></label>
                                <input type="text" class="form-control" id="editCustomerName" required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Business Name</label>
                                <input type="text" class="form-control" id="editBusinessName">
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">CNIC Number</label>
                                <input type="text" class="form-control" id="editCnicNumber" maxlength="15">
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">NTN Number</label>
                                <input type="text" class="form-control" id="editNtnNumber">
                            </div>
                        </div>
                    </div>

                    <!-- Contact Information -->
                    <div class="edit-section">
                        <h6 class="section-title">Contact Information</h6>
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label class="form-label">Email</label>
                                <input type="email" class="form-control" id="editEmail">
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Contact Number</label>
                                <div class="input-group">
                                    <span class="input-group-text">+92</span>
                                    <input type="tel" class="form-control" id="editContactNumber" maxlength="10">
                                </div>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">WhatsApp Number</label>
                                <div class="input-group">
                                    <span class="input-group-text">+92</span>
                                    <input type="tel" class="form-control" id="editWhatsappNumber" maxlength="10">
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Address -->
                    <div class="edit-section">
                        <h6 class="section-title">Address</h6>
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

                    <!-- Account Specific -->
                    <div class="edit-section" id="editCreditLimitSection">
                        <h6 class="section-title">Account Details</h6>
                        <div class="row g-3">
                            <div class="col-md-4">
                                <label class="form-label">Credit Limit (PKR)</label>
                                <input type="number" class="form-control" id="editCreditLimit" min="0">
                            </div>
                            <div class="col-md-4">
                                <label class="form-label">Current Balance (PKR)</label>
                                <input type="number" class="form-control" id="editCurrentBalance" readonly>
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
                <h3 class="fw-bold mb-2">Customer Updated!</h3>
                <p class="text-muted mb-4">Customer details have been successfully updated.</p>
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