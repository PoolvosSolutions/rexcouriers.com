<?php
// includes/view/operations/bookinglist.php
// 🔥 Booking List View - Rexcouris
?>

<div class="container-fluid py-4 bookinglist-page">
    
    <!-- PAGE HEADER -->
    <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
            <h3 class="mb-1"><i class="bi bi-list-ul text-danger me-2"></i>Manage Bookings</h3>
            <p class="text-muted mb-0 small">View, edit, and print all shipment bookings</p>
        </div>
        <button type="button" class="btn btn-rex-primary" onclick="loadView('newbooking')">
            <i class="bi bi-plus-circle me-1"></i> New Booking
        </button>
    </div>

    <!-- STATS CARDS -->
    <div class="row g-3 mb-4">
        <div class="col-md-3">
            <div class="stat-card stat-total">
                <div class="stat-icon"><i class="bi bi-box-seam"></i></div>
                <div class="stat-info">
                    <div class="stat-value" id="statTotal">0</div>
                    <div class="stat-label">Total Bookings</div>
                </div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="stat-card stat-today">
                <div class="stat-icon"><i class="bi bi-calendar-check"></i></div>
                <div class="stat-info">
                    <div class="stat-value" id="statToday">0</div>
                    <div class="stat-label">Today's Bookings</div>
                </div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="stat-card stat-booked">
                <div class="stat-icon"><i class="bi bi-clock-history"></i></div>
                <div class="stat-info">
                    <div class="stat-value" id="statBooked">0</div>
                    <div class="stat-label">Pending / Booked</div>
                </div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="stat-card stat-delivered">
                <div class="stat-icon"><i class="bi bi-check-circle"></i></div>
                <div class="stat-info">
                    <div class="stat-value" id="statDelivered">0</div>
                    <div class="stat-label">Delivered</div>
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
                        <input type="text" class="form-control" id="searchInput" 
                               placeholder="Search AWB, PI, Customer, Destination...">
                    </div>
                </div>
                <div class="col-md-2">
                    <select class="form-select" id="filterStatus">
                        <option value="">All Status</option>
                        <option value="Booked">Booked</option>
                        <option value="Picked Up">Picked Up</option>
                        <option value="In Transit">In Transit</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                        <option value="Draft">Draft</option>
                    </select>
                </div>
                <div class="col-md-2">
                    <select class="form-select" id="filterServiceType">
                        <option value="">All Services</option>
                        <option value="Domestic">Domestic</option>
                        <option value="International">International</option>
                    </select>
                </div>
                <div class="col-md-2">
                    <select class="form-select" id="filterCustomerType">
                        <option value="">All Customers</option>
                        <option value="Cash">Cash</option>
                        <option value="Account">Account</option>
                    </select>
                </div>
                <div class="col-md-3">
                    <div class="input-group">
                        <input type="date" class="form-control" id="filterDateFrom" placeholder="From">
                        <span class="input-group-text">to</span>
                        <input type="date" class="form-control" id="filterDateTo" placeholder="To">
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- PAGINATION CONTROLS (TOP) -->
    <div class="pagination-controls mb-3">
        <div class="d-flex justify-content-between align-items-center">
            <div class="showing-info">
                Showing <span id="showingFrom">0</span> to <span id="showingTo">0</span> of 
                <span id="showingTotal">0</span> bookings
            </div>
            <div class="items-per-page">
                <label>Items per page:</label>
                <select class="form-select form-select-sm" id="itemsPerPage">
                    <option value="50" selected>50</option>
                    <option value="100">100</option>
                    <option value="200">200</option>
                    <option value="500">500</option>
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
                        <th class="ps-4">AWB / PI</th>
                        <th>Date</th>
                        <th>Customer</th>
                        <th>Destination</th>
                        <th>Service</th>
                        <th>Weight</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th class="text-center pe-4">Actions</th>
                    </tr>
                </thead>
                <tbody id="bookingTableBody">
                    <tr>
                        <td colspan="9" class="text-center py-5">
                            <div class="spinner-border text-primary" role="status"></div>
                            <p class="mt-3 text-muted">Loading bookings...</p>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <!-- PAGINATION CONTROLS (BOTTOM) -->
    <div class="pagination-controls mt-3">
        <nav aria-label="Booking pagination">
            <ul class="pagination justify-content-center mb-0" id="paginationContainer"></ul>
        </nav>
    </div>
</div>

<!-- ============================================ -->
<!-- 🔥 VIEW BOOKING MODAL                        -->
<!-- ============================================ -->
<div class="modal fade" id="viewBookingModal" tabindex="-1">
    <div class="modal-dialog modal-xl modal-dialog-scrollable">
        <div class="modal-content">
            <div class="modal-header bg-primary text-white">
                <h5 class="modal-title"><i class="bi bi-eye me-2"></i>Booking Details</h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body p-4" id="viewBookingContent">
                <!-- Content populated dynamically -->
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" id="btnPrintFromView">
                    <i class="bi bi-printer me-1"></i> Print
                </button>
                <button type="button" class="btn btn-warning" id="btnEditFromView">
                    <i class="bi bi-pencil me-1"></i> Edit
                </button>
            </div>
        </div>
    </div>
</div>

<!-- ============================================ -->
<!-- 🔥 EDIT BOOKING MODAL                        -->
<!-- ============================================ -->
<div class="modal fade" id="editBookingModal" tabindex="-1" data-bs-backdrop="static">
    <div class="modal-dialog modal-xl modal-dialog-scrollable">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title"><i class="bi bi-pencil-square me-2"></i>Edit Booking</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <form id="editBookingForm">
                    <input type="hidden" id="editBookingId">
                    
                    <!-- Booking Info -->
                    <div class="edit-section">
                        <h6 class="section-title"><i class="bi bi-info-circle me-2"></i>Booking Information</h6>
                        <div class="row g-3">
                            <div class="col-md-3">
                                <label class="form-label">AWB Number</label>
                                <input type="text" class="form-control bg-light" id="editAWB" readonly>
                            </div>
                            <div class="col-md-3">
                                <label class="form-label">PI Number</label>
                                <input type="text" class="form-control bg-light" id="editPI" readonly>
                            </div>
                            <div class="col-md-3">
                                <label class="form-label">Booking Date</label>
                                <input type="date" class="form-control" id="editBookingDate">
                            </div>
                            <div class="col-md-3">
                                <label class="form-label">Status</label>
                                <select class="form-select" id="editStatus">
                                    <option value="Booked">Booked</option>
                                    <option value="Picked Up">Picked Up</option>
                                    <option value="In Transit">In Transit</option>
                                    <option value="Delivered">Delivered</option>
                                    <option value="Cancelled">Cancelled</option>
                                    <option value="Draft">Draft</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <!-- Shipper -->
                    <div class="edit-section">
                        <h6 class="section-title"><i class="bi bi-person-badge me-2"></i>Shipper Details</h6>
                        <div class="row g-3">
                            <div class="col-md-4">
                                <label class="form-label">Name</label>
                                <input type="text" class="form-control" id="editShipperName">
                            </div>
                            <div class="col-md-4">
                                <label class="form-label">Company</label>
                                <input type="text" class="form-control" id="editShipperCompany">
                            </div>
                            <div class="col-md-4">
                                <label class="form-label">Contact</label>
                                <input type="text" class="form-control" id="editShipperContact">
                            </div>
                            <div class="col-md-4">
                                <label class="form-label">City</label>
                                <input type="text" class="form-control" id="editShipperCity">
                            </div>
                            <div class="col-md-4">
                                <label class="form-label">Country</label>
                                <input type="text" class="form-control" id="editShipperCountry">
                            </div>
                            <div class="col-md-4">
                                <label class="form-label">CNIC</label>
                                <input type="text" class="form-control" id="editShipperCnic">
                            </div>
                        </div>
                    </div>

                    <!-- Consignee -->
                    <div class="edit-section">
                        <h6 class="section-title"><i class="bi bi-geo-alt me-2"></i>Consignee Details</h6>
                        <div class="row g-3">
                            <div class="col-md-4">
                                <label class="form-label">Name</label>
                                <input type="text" class="form-control" id="editConsigneeName">
                            </div>
                            <div class="col-md-4">
                                <label class="form-label">Company</label>
                                <input type="text" class="form-control" id="editConsigneeCompany">
                            </div>
                            <div class="col-md-4">
                                <label class="form-label">Contact</label>
                                <input type="text" class="form-control" id="editConsigneeContact">
                            </div>
                            <div class="col-md-4">
                                <label class="form-label">Destination</label>
                                <input type="text" class="form-control" id="editDestination">
                            </div>
                            <div class="col-md-4">
                                <label class="form-label">City</label>
                                <input type="text" class="form-control" id="editConsigneeCity">
                            </div>
                            <div class="col-md-4">
                                <label class="form-label">Country</label>
                                <input type="text" class="form-control" id="editConsigneeCountry">
                            </div>
                            <div class="col-12">
                                <label class="form-label">Address</label>
                                <textarea class="form-control" id="editConsigneeAddress" rows="2"></textarea>
                            </div>
                        </div>
                    </div>

                    <!-- Shipment -->
                    <div class="edit-section">
                        <h6 class="section-title"><i class="bi bi-box-seam me-2"></i>Shipment Details</h6>
                        <div class="row g-3">
                            <div class="col-md-2">
                                <label class="form-label">Pieces</label>
                                <input type="number" class="form-control" id="editPieces" min="1">
                            </div>
                            <div class="col-md-2">
                                <label class="form-label">Weight (KG)</label>
                                <input type="number" class="form-control" id="editWeight" step="0.1">
                            </div>
                            <div class="col-md-2">
                                <label class="form-label">Chargeable Weight</label>
                                <input type="number" class="form-control" id="editChargeableWeight" step="0.01">
                            </div>
                            <div class="col-md-3">
                                <label class="form-label">Shipment Type</label>
                                <select class="form-select" id="editShipmentType">
                                    <option value="Document">Document</option>
                                    <option value="Parcel">Parcel</option>
                                    <option value="Cargo">Cargo</option>
                                </select>
                            </div>
                            <div class="col-md-3">
                                <label class="form-label">Service Type</label>
                                <select class="form-select" id="editServiceType">
                                    <option value="Domestic">Domestic</option>
                                    <option value="International">International</option>
                                </select>
                            </div>
                            <div class="col-12">
                                <label class="form-label">Contents</label>
                                <input type="text" class="form-control" id="editContents">
                            </div>
                        </div>
                    </div>

                    <!-- Charges -->
                    <div class="edit-section">
                        <h6 class="section-title"><i class="bi bi-calculator me-2"></i>Charges & Total</h6>
                        <div class="row g-3">
                            <div class="col-md-3">
                                <label class="form-label">Shipment Charges (PKR)</label>
                                <input type="number" class="form-control" id="editShipmentCharges" step="0.01">
                            </div>
                            <div class="col-md-3">
                                <label class="form-label">Tax Amount (PKR)</label>
                                <input type="number" class="form-control" id="editTaxAmount" step="0.01">
                            </div>
                            <div class="col-md-3">
                                <label class="form-label">Grand Total (PKR)</label>
                                <input type="number" class="form-control fw-bold text-primary" id="editGrandTotal" step="0.01">
                            </div>
                            <div class="col-md-3">
                                <label class="form-label">Payment Mode</label>
                                <select class="form-select" id="editPaymentMode">
                                    <option value="Cash">Cash</option>
                                    <option value="Credit">Credit</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <!-- Notes -->
                    <div class="edit-section">
                        <h6 class="section-title"><i class="bi bi-sticky me-2"></i>Notes</h6>
                        <textarea class="form-control" id="editNotes" rows="2" placeholder="Internal notes..."></textarea>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
                    <i class="bi bi-x-circle me-1"></i> Cancel
                </button>
                <button type="button" class="btn btn-rex-primary" id="btnSaveBookingEdit">
                    <span class="btn-text"><i class="bi bi-check-circle me-1"></i> Save Changes</span>
                    <span class="btn-loader d-none"><span class="spinner-border spinner-border-sm me-2"></span> Saving...</span>
                </button>
            </div>
        </div>
    </div>
</div>

<!-- SUCCESS & ERROR MODALS -->
<div class="modal fade" id="bookingEditSuccessModal" tabindex="-1" data-bs-backdrop="static">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow">
            <div class="modal-body text-center p-5">
                <div class="success-icon-wrapper mb-4"><i class="bi bi-check-circle-fill"></i></div>
                <h3 class="fw-bold mb-2">Booking Updated!</h3>
                <p class="text-muted mb-4">Booking details have been successfully updated.</p>
                <button type="button" class="btn btn-rex-primary" id="btnCloseEditSuccess">
                    <i class="bi bi-check-circle me-1"></i> OK
                </button>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="bookingEditErrorModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow">
            <div class="modal-header bg-danger text-white border-0">
                <h5 class="modal-title"><i class="bi bi-exclamation-triangle-fill me-2"></i>Error</h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body py-4">
                <p id="bookingEditErrorMessage" class="mb-0 fs-5 text-center">Something went wrong.</p>
            </div>
            <div class="modal-footer border-0 justify-content-center">
                <button type="button" class="btn btn-secondary px-4" data-bs-dismiss="modal">OK</button>
            </div>
        </div>
    </div>
</div>

