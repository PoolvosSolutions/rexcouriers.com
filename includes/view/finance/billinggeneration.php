<?php
// includes/view/finance/billinggeneration.php
// 🔥 Billing Generation - Rexcouris
?>

<div class="container-fluid py-4 billing-page">
    
    <!-- PAGE HEADER -->
    <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
            <h3 class="mb-1"><i class="bi bi-file-earmark-ruled-fill text-danger me-2"></i>Generate Bill</h3>
            <p class="text-muted mb-0 small">Generate customer bills from unbilled credit shipments</p>
        </div>
        <div class="d-flex gap-2">
            <button type="button" class="btn btn-outline-secondary" onclick="loadView('billinglist')">
                <i class="bi bi-list-ul me-1"></i> View All Bills
            </button>
            <button type="button" class="btn btn-outline-info" onclick="loadView('receivables')">
                <i class="bi bi-cash-stack me-1"></i> Receivables
            </button>
        </div>
    </div>

    <!-- INFO ALERT -->
    <div class="alert alert-info border-0 shadow-sm mb-4" role="alert">
        <div class="d-flex align-items-start">
            <i class="bi bi-info-circle-fill me-2 mt-1 fs-5"></i>
            <div>
                <strong class="d-block mb-1">Billing Rules</strong>
                <small class="text-muted">
                    Only <strong>Credit/Account customers</strong> are included in billing. Cash payments are excluded.
                    Select a date range and customer to preview unbilled shipments. Once generated, shipments will be 
                    marked as "Billed" and added to customer's outstanding balance.
                </small>
            </div>
        </div>
    </div>

    <div class="row g-4">
        
        <!-- LEFT: BILL GENERATION FORM -->
        <div class="col-lg-4">
            <div class="bill-config-card">
                <div class="card-header-custom">
                    <h5 class="mb-0"><i class="bi bi-sliders me-2"></i>Bill Configuration</h5>
                </div>
                <div class="card-body-custom">
                    <form id="billConfigForm">
                        
                        <!-- Date Range -->
                        <div class="config-section">
                            <h6 class="section-label">
                                <i class="bi bi-calendar-range me-1"></i> Billing Period
                            </h6>
                            <div class="row g-2">
                                <div class="col-6">
                                    <label class="form-label small fw-semibold">From Date</label>
                                    <input type="date" class="form-control" id="billFromDate" required>
                                </div>
                                <div class="col-6">
                                    <label class="form-label small fw-semibold">To Date</label>
                                    <input type="date" class="form-control" id="billToDate" required>
                                </div>
                            </div>
                            <div class="quick-dates mt-2">
                                <small class="text-muted d-block mb-1">Quick Select:</small>
                                <div class="d-flex gap-1 flex-wrap">
                                    <button type="button" class="btn btn-sm btn-outline-secondary quick-date" data-days="7">Last 7 Days</button>
                                    <button type="button" class="btn btn-sm btn-outline-secondary quick-date" data-days="30">Last 30 Days</button>
                                    <button type="button" class="btn btn-sm btn-outline-secondary quick-date" data-days="90">Last 90 Days</button>
                                    <button type="button" class="btn btn-sm btn-outline-secondary quick-date" data-month="current">This Month</button>
                                    <button type="button" class="btn btn-sm btn-outline-secondary quick-date" data-month="last">Last Month</button>
                                </div>
                            </div>
                        </div>

                        <!-- Customer Selection -->
                        <div class="config-section">
                            <h6 class="section-label">
                                <i class="bi bi-person-badge me-1"></i> Customer
                            </h6>
                            <div class="form-check mb-2">
                                <input class="form-check-input" type="radio" name="customerScope" id="scopeAll" value="all" checked>
                                <label class="form-check-label" for="scopeAll">
                                    <strong>All Account Customers</strong>
                                    <small class="text-muted d-block">Generate separate bills for each customer</small>
                                </label>
                            </div>
                            <div class="form-check mb-2">
                                <input class="form-check-input" type="radio" name="customerScope" id="scopeSpecific" value="specific">
                                <label class="form-check-label" for="scopeSpecific">
                                    <strong>Specific Customer</strong>
                                    <small class="text-muted d-block">Generate bill for one customer only</small>
                                </label>
                            </div>
                            <div class="mt-2 d-none" id="specificCustomerWrapper">
                                <select class="form-select" id="specificCustomer">
                                    <option value="" disabled selected>Select Customer</option>
                                </select>
                            </div>
                        </div>

                        <!-- Bill Status Filter -->
                        <div class="config-section">
                            <h6 class="section-label">
                                <i class="bi bi-funnel me-1"></i> Shipment Status to Bill
                            </h6>
                            <div class="form-check form-check-inline">
                                <input class="form-check-input status-filter" type="checkbox" id="statusDelivered" value="Delivered" checked>
                                <label class="form-check-label" for="statusDelivered">Delivered</label>
                            </div>
                            <div class="form-check form-check-inline">
                                <input class="form-check-input status-filter" type="checkbox" id="statusIntransit" value="Intransit">
                                <label class="form-check-label" for="statusIntransit">In Transit</label>
                            </div>
                            <div class="form-check form-check-inline">
                                <input class="form-check-input status-filter" type="checkbox" id="statusBooked" value="Booked">
                                <label class="form-check-label" for="statusBooked">Booked</label>
                            </div>
                            <small class="text-muted d-block mt-1">
                                Only shipments with selected statuses will be included
                            </small>
                        </div>

                        <!-- Exclude Already Billed -->
                        <div class="config-section">
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" id="excludeBilled" checked>
                                <label class="form-check-label" for="excludeBilled">
                                    <strong>Exclude Already Billed Shipments</strong>
                                    <small class="text-muted d-block">Recommended: Avoids duplicate billing</small>
                                </label>
                            </div>
                        </div>

                        <!-- Action Buttons -->
                        <div class="config-actions">
                            <button type="button" class="btn btn-primary w-100 mb-2" id="btnPreviewShipments">
                                <span class="btn-text"><i class="bi bi-search me-1"></i> Preview Unbilled Shipments</span>
                                <span class="btn-loader d-none">
                                    <span class="spinner-border spinner-border-sm me-2"></span> Searching...
                                </span>
                            </button>
                            <button type="button" class="btn btn-outline-secondary w-100" id="btnResetConfig">
                                <i class="bi bi-arrow-counterclockwise me-1"></i> Reset
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        <!-- RIGHT: PREVIEW & RESULTS -->
        <div class="col-lg-8">
            
            <!-- Preview Stats -->
            <div class="preview-stats-card d-none" id="previewStats">
                <div class="row g-3">
                    <div class="col-md-3">
                        <div class="preview-stat">
                            <div class="stat-icon stat-customers"><i class="bi bi-people-fill"></i></div>
                            <div class="stat-info">
                                <div class="stat-value" id="statCustomers">0</div>
                                <div class="stat-label">Customers</div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="preview-stat">
                            <div class="stat-icon stat-shipments"><i class="bi bi-box-seam-fill"></i></div>
                            <div class="stat-info">
                                <div class="stat-value" id="statShipments">0</div>
                                <div class="stat-label">Shipments</div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="preview-stat">
                            <div class="stat-icon stat-total"><i class="bi bi-cash-coin"></i></div>
                            <div class="stat-info">
                                <div class="stat-value" id="statTotalAmount">PKR 0</div>
                                <div class="stat-label">Total Amount</div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="preview-stat">
                            <div class="stat-icon stat-selected"><i class="bi bi-check2-circle"></i></div>
                            <div class="stat-info">
                                <div class="stat-value" id="statSelected">0</div>
                                <div class="stat-label">Selected</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Customer-wise Breakdown -->
            <div class="preview-results-card">
                <div class="card-header-custom d-flex justify-content-between align-items-center">
                    <h5 class="mb-0"><i class="bi bi-table me-2"></i>Unbilled Shipments Preview</h5>
                    <div class="header-actions d-none" id="previewActions">
                        <button type="button" class="btn btn-sm btn-outline-primary" id="btnSelectAll">
                            <i class="bi bi-check2-square me-1"></i> Select All
                        </button>
                        <button type="button" class="btn btn-sm btn-success" id="btnGenerateBills" disabled>
                            <span class="btn-text"><i class="bi bi-file-earmark-plus me-1"></i> Generate Bills (<span id="selectedCount">0</span>)</span>
                            <span class="btn-loader d-none">
                                <span class="spinner-border spinner-border-sm me-2"></span> Generating...
                            </span>
                        </button>
                    </div>
                </div>
                <div class="card-body-custom">
                    <div id="previewContent">
                        <div class="empty-preview-state">
                            <i class="bi bi-inbox"></i>
                            <h5>No Preview Available</h5>
                            <p>Configure your bill settings and click <strong>"Preview Unbilled Shipments"</strong> to see available shipments for billing.</p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
</div>

<!-- ============================================ -->
<!-- 🔥 GENERATE CONFIRMATION MODAL              -->
<!-- ============================================ -->
<div class="modal fade" id="generateConfirmModal" tabindex="-1" data-bs-backdrop="static">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header bg-success text-white">
                <h5 class="modal-title"><i class="bi bi-check-circle me-2"></i>Confirm Bill Generation</h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <div class="alert alert-warning border-0">
                    <i class="bi bi-exclamation-triangle-fill me-2"></i>
                    <strong>Important:</strong> Once generated, shipments will be marked as "Billed" and cannot be included in future bills. This action cannot be undone.
                </div>
                
                <h6 class="fw-bold mb-3">Bills to be Generated:</h6>
                <div id="confirmBillsList"></div>
                
                <div class="confirm-summary mt-3">
                    <div class="summary-row">
                        <span>Total Bills:</span>
                        <span class="fw-bold" id="confirmTotalBills">0</span>
                    </div>
                    <div class="summary-row">
                        <span>Total Shipments:</span>
                        <span class="fw-bold" id="confirmTotalShipments">0</span>
                    </div>
                    <div class="summary-row grand">
                        <span>Total Amount:</span>
                        <span class="fw-bold text-success" id="confirmTotalAmount">PKR 0.00</span>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
                    <i class="bi bi-x-circle me-1"></i> Cancel
                </button>
                <button type="button" class="btn btn-success" id="btnConfirmGenerate">
                    <span class="btn-text"><i class="bi bi-check-circle me-1"></i> Confirm & Generate</span>
                    <span class="btn-loader d-none">
                        <span class="spinner-border spinner-border-sm me-2"></span> Generating...
                    </span>
                </button>
            </div>
        </div>
    </div>
</div>

<!-- ============================================ -->
<!-- 🔥 SUCCESS MODAL                            -->
<!-- ============================================ -->
<div class="modal fade" id="billingSuccessModal" tabindex="-1" data-bs-backdrop="static">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow">
            <div class="modal-body text-center p-5">
                <div class="success-icon-wrapper mb-4"><i class="bi bi-check-circle-fill"></i></div>
                <h3 class="fw-bold mb-2">Bills Generated Successfully!</h3>
                <p class="text-muted mb-4" id="successMessage">-</p>
                <div class="success-info mb-4">
                    <div class="info-row">
                        <span class="label">Bills Created:</span>
                        <span class="value" id="successBillCount">0</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Shipments Billed:</span>
                        <span class="value" id="successShipmentCount">0</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Total Amount:</span>
                        <span class="value text-success" id="successAmount">PKR 0.00</span>
                    </div>
                </div>
                <div class="d-flex gap-2 justify-content-center">
                    <button type="button" class="btn btn-outline-secondary" id="btnNewBilling">
                        <i class="bi bi-plus-circle me-1"></i> New Billing
                    </button>
                    <button type="button" class="btn btn-primary" id="btnViewBills">
                        <i class="bi bi-list-ul me-1"></i> View Bills
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- ============================================ -->
<!-- 🔥 ERROR MODAL                              -->
<!-- ============================================ -->
<div class="modal fade" id="billingErrorModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow">
            <div class="modal-header bg-danger text-white border-0">
                <h5 class="modal-title"><i class="bi bi-exclamation-triangle-fill me-2"></i>Error</h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body py-4">
                <p id="billingErrorMessage" class="mb-0 fs-5 text-center">Something went wrong.</p>
            </div>
            <div class="modal-footer border-0 justify-content-center">
                <button type="button" class="btn btn-secondary px-4" data-bs-dismiss="modal">OK</button>
            </div>
        </div>
    </div>
</div>

