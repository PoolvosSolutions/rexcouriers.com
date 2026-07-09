<?php
// includes/view/operations/tracking.php
// 🔥 Track Shipment - Rexcouris
?>

<div class="container-fluid py-4 tracking-page">
    
    <!-- PAGE HEADER -->
    <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
            <h3 class="mb-1"><i class="bi bi-geo-alt-fill text-danger me-2"></i>Track Shipments</h3>
            <p class="text-muted mb-0 small">Update shipment status, track deliveries, and print status reports</p>
        </div>
        <button type="button" class="btn btn-rex-primary" onclick="loadView('newbooking')">
            <i class="bi bi-plus-circle me-1"></i> New Booking
        </button>
    </div>

    <!-- STATS CARDS -->
    <div class="row g-3 mb-4">
        <div class="col-md-2">
            <div class="stat-card stat-total">
                <div class="stat-icon"><i class="bi bi-box-seam"></i></div>
                <div class="stat-info">
                    <div class="stat-value" id="statTotal">0</div>
                    <div class="stat-label">Total</div>
                </div>
            </div>
        </div>
        <div class="col-md-2">
            <div class="stat-card stat-booked">
                <div class="stat-icon"><i class="bi bi-clock"></i></div>
                <div class="stat-info">
                    <div class="stat-value" id="statBooked">0</div>
                    <div class="stat-label">Booked</div>
                </div>
            </div>
        </div>
        <div class="col-md-2">
            <div class="stat-card stat-intransit">
                <div class="stat-icon"><i class="bi bi-truck"></i></div>
                <div class="stat-info">
                    <div class="stat-value" id="statIntransit">0</div>
                    <div class="stat-label">In Transit</div>
                </div>
            </div>
        </div>
        <div class="col-md-2">
            <div class="stat-card stat-delivered">
                <div class="stat-icon"><i class="bi bi-check-circle"></i></div>
                <div class="stat-info">
                    <div class="stat-value" id="statDelivered">0</div>
                    <div class="stat-label">Delivered</div>
                </div>
            </div>
        </div>
        <div class="col-md-2">
            <div class="stat-card stat-hold">
                <div class="stat-icon"><i class="bi bi-pause-circle"></i></div>
                <div class="stat-info">
                    <div class="stat-value" id="statHold">0</div>
                    <div class="stat-label">On Hold</div>
                </div>
            </div>
        </div>
        <div class="col-md-2">
            <div class="stat-card stat-exception">
                <div class="stat-icon"><i class="bi bi-exclamation-triangle"></i></div>
                <div class="stat-info">
                    <div class="stat-value" id="statException">0</div>
                    <div class="stat-label">Exceptions</div>
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
                        <option value="Intransit">In Transit</option>
                        <option value="Hold">On Hold</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Returned">Returned</option>
                        <option value="Lost">Lost</option>
                        <option value="Destroyed">Destroyed</option>
                    </select>
                </div>
                <div class="col-md-2">
                    <select class="form-select" id="filterCarrier">
                        <option value="">All Carriers</option>
                        <!-- Populated dynamically -->
                    </select>
                </div>
                <div class="col-md-2">
                    <select class="form-select" id="filterServiceType">
                        <option value="">All Services</option>
                        <option value="Domestic">Domestic</option>
                        <option value="International">International</option>
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
                <span id="showingTotal">0</span> shipments
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
                        <th>Carrier</th>
                        <th>Status</th>
                        <th>Last Update</th>
                        <th class="text-center pe-4">Actions</th>
                    </tr>
                </thead>
                <tbody id="shipmentTableBody">
                    <tr>
                        <td colspan="8" class="text-center py-5">
                            <div class="spinner-border text-primary" role="status"></div>
                            <p class="mt-3 text-muted">Loading shipments...</p>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <!-- PAGINATION CONTROLS (BOTTOM) -->
    <div class="pagination-controls mt-3">
        <nav aria-label="Shipment pagination">
            <ul class="pagination justify-content-center mb-0" id="paginationContainer"></ul>
        </nav>
    </div>
</div>

<!-- ============================================ -->
<!-- 🔥 UPDATE STATUS MODAL (ENHANCED)            -->
<!-- ============================================ -->
<div class="modal fade" id="updateStatusModal" tabindex="-1" data-bs-backdrop="static">
    <div class="modal-dialog modal-lg modal-dialog-scrollable">
        <div class="modal-content">
            <div class="modal-header bg-warning text-dark">
                <h5 class="modal-title"><i class="bi bi-arrow-repeat me-2"></i>Update Shipment Status</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <input type="hidden" id="updateShipmentId">
                
                <!-- Current Status Info -->
                <div class="current-status-box mb-4">
                    <div class="row g-3">
                        <div class="col-md-4">
                            <label class="small text-muted">AWB Number</label>
                            <div class="fw-bold mono" id="updateAWB">-</div>
                        </div>
                        <div class="col-md-4">
                            <label class="small text-muted">Current Status</label>
                            <div id="updateCurrentStatus">-</div>
                        </div>
                        <div class="col-md-4">
                            <label class="small text-muted">Assigned Carrier</label>
                            <div class="fw-bold" id="updateCurrentCarrier">-</div>
                        </div>
                    </div>
                </div>

                <!-- Warning if no carrier -->
                <div class="alert alert-danger d-none" id="noCarrierWarning">
                    <i class="bi bi-exclamation-triangle-fill me-2"></i>
                    <strong>Carrier Not Assigned!</strong> You must assign a carrier before updating status to "In Transit".
                </div>

                <!-- New Status Selection -->
                <div class="edit-section">
                    <h6 class="section-title"><i class="bi bi-flag me-2"></i>New Status</h6>
                    <div class="row g-3">
                        <div class="col-md-6">
                            <label class="form-label">Select New Status <span class="text-danger">*</span></label>
                            <select class="form-select" id="newStatus" required>
                                <option value="" disabled selected>Select Status</option>
                            </select>
                            <small class="text-muted" id="statusTransitionHint"></small>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">Status Change Date <span class="text-danger">*</span></label>
                            <input type="date" class="form-control" id="statusDate" required>
                        </div>
                    </div>
                </div>

                <!-- 🔥 REASON/STATEMENT - ALWAYS VISIBLE -->
                <div class="edit-section">
                    <h6 class="section-title"><i class="bi bi-chat-left-text me-2"></i>Reason / Statement <span class="text-danger">*</span></h6>
                    <div class="alert alert-info small mb-3">
                        <i class="bi bi-info-circle me-1"></i>
                        <strong>Important:</strong> Please provide a clear reason for this status change. This will be visible to customers in their tracking view and helps maintain transparency.
                    </div>
                    <div class="row g-3">
                        <div class="col-12">
                            <textarea class="form-control" id="statusReason" rows="3" 
                                      placeholder="Enter reason for status change..." required></textarea>
                            <small class="text-muted">
                                <span id="reasonCharCount">0</span>/500 characters
                            </small>
                        </div>
                        <div class="col-12">
                            <label class="form-label small fw-semibold">Quick Reasons (Click to use):</label>
                            <div class="quick-reasons" id="quickReasons">
                                <!-- Populated dynamically based on status -->
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Carrier Selection (shown when changing to Intransit) -->
                <div class="edit-section d-none" id="carrierSection">
                    <h6 class="section-title"><i class="bi bi-truck me-2"></i>Assign Carrier</h6>
                    <div class="row g-3">
                        <div class="col-md-12">
                            <label class="form-label">Select Carrier <span class="text-danger">*</span></label>
                            <select class="form-select" id="newCarrier">
                                <option value="" disabled selected>Select Carrier</option>
                            </select>
                        </div>
                    </div>
                </div>

                <!-- 🔥 DELIVERY-SPECIFIC FIELDS -->
                
                <!-- For Intransit: Why is it in transit? -->
                <div class="edit-section d-none" id="intransitDetails">
                    <h6 class="section-title"><i class="bi bi-truck me-2"></i>In Transit Details</h6>
                    <div class="row g-3">
                        <div class="col-md-6">
                            <label class="form-label">Current Location</label>
                            <input type="text" class="form-control" id="currentLocation" 
                                   placeholder="e.g., Karachi Hub, Lahore Airport">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">Expected Delivery Date</label>
                            <input type="date" class="form-control" id="expectedDeliveryDate">
                        </div>
                        <div class="col-12">
                            <label class="form-label">Transit Notes</label>
                            <input type="text" class="form-control" id="transitNotes" 
                                   placeholder="e.g., Awaiting customs clearance, In sorting facility">
                        </div>
                    </div>
                </div>

                <!-- For Hold: Why is it on hold? -->
                <div class="edit-section d-none" id="holdDetails">
                    <h6 class="section-title"><i class="bi bi-pause-circle me-2"></i>Hold Details</h6>
                    <div class="row g-3">
                        <div class="col-md-6">
                            <label class="form-label">Hold Reason Category <span class="text-danger">*</span></label>
                            <select class="form-select" id="holdReasonCategory">
                                <option value="" disabled selected>Select Category</option>
                                <option value="Address Issue">Address Issue</option>
                                <option value="Recipient Not Available">Recipient Not Available</option>
                                <option value="Payment Pending">Payment Pending</option>
                                <option value="Documentation">Documentation Required</option>
                                <option value="Customs">Customs Hold</option>
                                <option value="Weather">Weather/Force Majeure</option>
                                <option value="Customer Request">Customer Request</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">Expected Resolution Date</label>
                            <input type="date" class="form-control" id="holdResolutionDate">
                        </div>
                        <div class="col-12">
                            <label class="form-label">Detailed Hold Reason</label>
                            <textarea class="form-control" id="holdDetailedReason" rows="2" 
                                      placeholder="Provide specific details about why shipment is on hold..."></textarea>
                        </div>
                    </div>
                </div>

                <!-- For Delivered: Who received it? -->
                <div class="edit-section d-none" id="podSection">
                    <h6 class="section-title"><i class="bi bi-clipboard-check me-2"></i>Proof of Delivery (POD)</h6>
                    <div class="row g-3">
                        <div class="col-md-6">
                            <label class="form-label">Delivered To (Name) <span class="text-danger">*</span></label>
                            <input type="text" class="form-control" id="deliveredTo" 
                                   placeholder="Name of person who received" required>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">Relationship to Consignee</label>
                            <select class="form-select" id="recipientRelationship">
                                <option value="" disabled selected>Select Relationship</option>
                                <option value="Self">Self (Consignee)</option>
                                <option value="Family Member">Family Member</option>
                                <option value="Office Colleague">Office Colleague</option>
                                <option value="Security Guard">Security Guard</option>
                                <option value="Receptionist">Receptionist</option>
                                <option value="Authorized Person">Authorized Person</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">Delivery Time</label>
                            <input type="time" class="form-control" id="deliveryTime">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">Recipient ID (Optional)</label>
                            <input type="text" class="form-control" id="recipientId" 
                                   placeholder="CNIC/ID number if collected">
                        </div>
                        <div class="col-12">
                            <label class="form-label">Delivery Remarks</label>
                            <input type="text" class="form-control" id="deliveryRemarks" 
                                   placeholder="e.g., Handed to security, Left at reception">
                        </div>
                    </div>
                </div>

                <!-- For Returned: Why returned? -->
                <div class="edit-section d-none" id="returnDetails">
                    <h6 class="section-title"><i class="bi bi-arrow-return-left me-2"></i>Return Details</h6>
                    <div class="row g-3">
                        <div class="col-md-6">
                            <label class="form-label">Return Reason Category <span class="text-danger">*</span></label>
                            <select class="form-select" id="returnReasonCategory">
                                <option value="" disabled selected>Select Category</option>
                                <option value="Address Not Found">Address Not Found</option>
                                <option value="Recipient Refused">Recipient Refused</option>
                                <option value="Multiple Attempts Failed">Multiple Attempts Failed</option>
                                <option value="Customer Cancelled">Customer Cancelled</option>
                                <option value="Undeliverable">Undeliverable</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">Return Date</label>
                            <input type="date" class="form-control" id="returnDate">
                        </div>
                        <div class="col-12">
                            <label class="form-label">Detailed Return Reason</label>
                            <textarea class="form-control" id="returnDetailedReason" rows="2" 
                                      placeholder="Provide specific details about why shipment is being returned..."></textarea>
                        </div>
                    </div>
                </div>

                <!-- For Lost: Last known location -->
                <div class="edit-section d-none" id="lostDetails">
                    <h6 class="section-title"><i class="bi bi-question-circle me-2"></i>Lost Shipment Details</h6>
                    <div class="row g-3">
                        <div class="col-md-6">
                            <label class="form-label">Last Known Location</label>
                            <input type="text" class="form-control" id="lastKnownLocation" 
                                   placeholder="Where was it last seen?">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">Last Seen Date</label>
                            <input type="date" class="form-control" id="lastSeenDate">
                        </div>
                        <div class="col-12">
                            <label class="form-label">Investigation Notes</label>
                            <textarea class="form-control" id="investigationNotes" rows="2" 
                                      placeholder="Details about the investigation..."></textarea>
                        </div>
                    </div>
                </div>

                <!-- Status History Preview -->
                <div class="edit-section">
                    <h6 class="section-title"><i class="bi bi-clock-history me-2"></i>Status History</h6>
                    <div id="statusHistoryPreview">
                        <p class="text-muted small">No history available</p>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
                    <i class="bi bi-x-circle me-1"></i> Cancel
                </button>
                <button type="button" class="btn btn-warning" id="btnSaveStatus">
                    <span class="btn-text"><i class="bi bi-check-circle me-1"></i> Update Status</span>
                    <span class="btn-loader d-none"><span class="spinner-border spinner-border-sm me-2"></span> Updating...</span>
                </button>
            </div>
        </div>
    </div>
</div>

<!-- ============================================ -->
<!-- 🔥 VIEW SHIPMENT MODAL                       -->
<!-- ============================================ -->
<div class="modal fade" id="viewShipmentModal" tabindex="-1">
    <div class="modal-dialog modal-xl modal-dialog-scrollable">
        <div class="modal-content">
            <div class="modal-header bg-primary text-white">
                <h5 class="modal-title"><i class="bi bi-eye me-2"></i>Shipment Details</h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body p-4" id="viewShipmentContent">
                <!-- Content populated dynamically -->
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" id="btnPrintFromView">
                    <i class="bi bi-printer me-1"></i> Print
                </button>
                <button type="button" class="btn btn-warning" id="btnUpdateFromView">
                    <i class="bi bi-arrow-repeat me-1"></i> Update Status
                </button>
            </div>
        </div>
    </div>
</div>

<!-- SUCCESS & ERROR MODALS -->
<div class="modal fade" id="statusUpdateSuccessModal" tabindex="-1" data-bs-backdrop="static">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow">
            <div class="modal-body text-center p-5">
                <div class="success-icon-wrapper mb-4"><i class="bi bi-check-circle-fill"></i></div>
                <h3 class="fw-bold mb-2">Status Updated!</h3>
                <p class="text-muted mb-2">Shipment status has been successfully updated.</p>
                <div class="status-update-info mb-4">
                    <div class="info-row">
                        <span class="label">AWB:</span>
                        <span class="value mono" id="successAWB">-</span>
                    </div>
                    <div class="info-row">
                        <span class="label">New Status:</span>
                        <span class="value" id="successStatus">-</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Date:</span>
                        <span class="value" id="successDate">-</span>
                    </div>
                </div>
                <button type="button" class="btn btn-rex-primary" id="btnCloseStatusSuccess">
                    <i class="bi bi-check-circle me-1"></i> OK
                </button>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="trackingErrorModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow">
            <div class="modal-header bg-danger text-white border-0">
                <h5 class="modal-title"><i class="bi bi-exclamation-triangle-fill me-2"></i>Error</h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body py-4">
                <p id="trackingErrorMessage" class="mb-0 fs-5 text-center">Something went wrong.</p>
            </div>
            <div class="modal-footer border-0 justify-content-center">
                <button type="button" class="btn btn-secondary px-4" data-bs-dismiss="modal">OK</button>
            </div>
        </div>
    </div>
</div>



<!-- ============================================ -->
<!-- 🔥 ASSIGN CARRIER MODAL                      -->
<!-- ============================================ -->
<div class="modal fade" id="assignCarrierModal" tabindex="-1" data-bs-backdrop="static">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header bg-success text-white">
                <h5 class="modal-title"><i class="bi bi-truck me-2"></i>Assign Carrier to Shipment</h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <input type="hidden" id="assignShipmentId">
                
                <!-- Current Shipment Info -->
                <div class="current-shipment-box mb-4">
                    <div class="row g-3">
                        <div class="col-md-4">
                            <label class="small text-muted">AWB Number</label>
                            <div class="fw-bold mono" id="assignAWB">-</div>
                        </div>
                        <div class="col-md-4">
                            <label class="small text-muted">PI Number</label>
                            <div class="fw-bold mono" id="assignPI">-</div>
                        </div>
                        <div class="col-md-4">
                            <label class="small text-muted">Current Status</label>
                            <div id="assignCurrentStatus">-</div>
                        </div>
                    </div>
                    <div class="row g-3 mt-2">
                        <div class="col-md-6">
                            <label class="small text-muted">Shipper</label>
                            <div class="fw-bold" id="assignShipper">-</div>
                        </div>
                        <div class="col-md-6">
                            <label class="small text-muted">Destination</label>
                            <div class="fw-bold" id="assignDestination">-</div>
                        </div>
                    </div>
                </div>

                <!-- Currently Assigned Carrier -->
                <div class="current-carrier-info mb-4">
                    <h6 class="fw-bold mb-2"><i class="bi bi-info-circle me-1"></i>Currently Assigned Carrier</h6>
                    <div id="currentCarrierDisplay">
                        <span class="carrier-badge unassigned"><i class="bi bi-truck-front"></i> Not Assigned</span>
                    </div>
                </div>

                <!-- New Carrier Selection -->
                <div class="edit-section">
                    <h6 class="section-title"><i class="bi bi-truck me-2"></i>Select Carrier</h6>
                    <div class="row g-3">
                        <div class="col-md-12">
                            <label class="form-label">Choose Carrier <span class="text-danger">*</span></label>
                            <select class="form-select form-select-lg" id="assignCarrierSelect" required>
                                <option value="" disabled selected>Select Carrier</option>
                                <!-- Populated dynamically -->
                            </select>
                        </div>
                    </div>
                </div>

                <!-- Carrier Details Preview -->
                <div class="carrier-details-preview d-none" id="carrierDetailsPreview">
                    <h6 class="fw-bold mb-2"><i class="bi bi-building me-1"></i>Carrier Details</h6>
                    <div class="carrier-info-grid">
                        <div class="carrier-info-item">
                            <span class="label">Name:</span>
                            <span class="value" id="previewCarrierName">-</span>
                        </div>
                        <div class="carrier-info-item">
                            <span class="label">Code:</span>
                            <span class="value" id="previewCarrierCode">-</span>
                        </div>
                        <div class="carrier-info-item">
                            <span class="label">Type:</span>
                            <span class="value" id="previewCarrierType">-</span>
                        </div>
                        <div class="carrier-info-item">
                            <span class="label">Contact:</span>
                            <span class="value" id="previewCarrierContact">-</span>
                        </div>
                    </div>
                </div>

                <!-- Assignment Notes -->
                <div class="edit-section">
                    <h6 class="section-title"><i class="bi bi-chat-left-text me-2"></i>Assignment Notes</h6>
                    <div class="row g-3">
                        <div class="col-12">
                            <textarea class="form-control" id="carrierAssignmentNotes" rows="2" 
                                      placeholder="Optional notes about carrier assignment..."></textarea>
                        </div>
                    </div>
                </div>
            </div>

            <div class="modal-footer">
    <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
        <i class="bi bi-x-circle me-1"></i> Cancel
    </button>
    <button type="button" class="btn btn-success" id="btnConfirmAssignCarrier">
        <span class="btn-text"><i class="bi bi-check-circle me-1"></i> Assign Carrier</span>
        <span class="btn-loader d-none"><span class="spinner-border spinner-border-sm me-2"></span> Assigning...</span>
    </button>
</div>

        </div>
    </div>
</div>

<!-- CARRIER ASSIGNMENT SUCCESS MODAL -->
<div class="modal fade" id="carrierAssignSuccessModal" tabindex="-1" data-bs-backdrop="static">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow">
            <div class="modal-body text-center p-5">
                <div class="success-icon-wrapper mb-4"><i class="bi bi-truck-fill"></i></div>
                <h3 class="fw-bold mb-2">Carrier Assigned!</h3>
                <p class="text-muted mb-2">Carrier has been successfully assigned to the shipment.</p>
                <div class="status-update-info mb-4">
                    <div class="info-row">
                        <span class="label">AWB:</span>
                        <span class="value mono" id="successAssignAWB">-</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Carrier:</span>
                        <span class="value" id="successAssignCarrier">-</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Assigned Date:</span>
                        <span class="value" id="successAssignDate">-</span>
                    </div>
                </div>
                <button type="button" class="btn btn-success" id="btnCloseCarrierSuccess">
                    <i class="bi bi-check-circle me-1"></i> OK
                </button>
            </div>
        </div>
    </div>
</div>

