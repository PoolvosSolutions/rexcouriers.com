<?php
// includes/view/operations/newbooking.php
// 🔥 New Booking Form - Rexcouris
?>

<div class="container-fluid py-4 newbooking-page">
    
    <!-- PAGE HEADER -->
    <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
            <h3 class="mb-1"><i class="bi bi-plus-circle-fill text-danger me-2"></i>New Booking</h3>
            <p class="text-muted mb-0 small">Create a new shipment booking with complete details</p>
        </div>
        <button type="button" class="btn btn-outline-secondary" onclick="loadView('admindashboard')">
            <i class="bi bi-arrow-left me-1"></i> Back to Dashboard
        </button>
    </div>

    <form id="newBookingForm" novalidate>
        
        <!-- ============================================ -->
        <!-- SECTION 1: BOOKING HEADER                    -->
        <!-- ============================================ -->
        <div class="rex-form-card mb-4">
            <div class="rex-form-card-header">
                <h5 class="mb-0"><i class="bi bi-calendar-date me-2"></i>Booking Information</h5>
            </div>
            <div class="rex-form-card-body">
                <div class="row g-3">
                    <div class="col-md-3">
                        <label class="form-label fw-semibold">Booking Date <span class="text-danger">*</span></label>
                        <input type="date" class="form-control" id="bookingDate" required>
                    </div>
                    <div class="col-md-3">
                        <label class="form-label fw-semibold">AWB Number</label>
                        <input type="text" class="form-control bg-light" id="awbNumber" readonly placeholder="Auto-generated">
                        <small class="text-muted">Format: MMDD + Serial</small>
                    </div>
                    <div class="col-md-3">
                        <label class="form-label fw-semibold">PI Number</label>
                        <input type="text" class="form-control bg-light" id="piNumber" readonly placeholder="Auto-generated">
                        <small class="text-muted">Format: YYYYMMDD + Serial</small>
                    </div>
                    <div class="col-md-3">
                        <label class="form-label fw-semibold">Service Type <span class="text-danger">*</span></label>
                        <select class="form-select" id="serviceType" required>
                            <option value="International" selected>International</option>
                            <option value="Domestic">Domestic</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>

        <!-- ============================================ -->
        <!-- SECTION 2: CUSTOMER / SHIPPER                -->
        <!-- ============================================ -->
        <div class="rex-form-card mb-4">
            <div class="rex-form-card-header">
                <h5 class="mb-0"><i class="bi bi-person-badge me-2"></i>Customer / Shipper Details</h5>
            </div>
            <div class="rex-form-card-body">
                <div class="row g-3">
                    <div class="col-md-3">
                        <label class="form-label fw-semibold">Customer Type <span class="text-danger">*</span></label>
                        <select class="form-select" id="customerType" required>
                            <option value="" disabled selected>Select Type</option>
                            <option value="Cash">Cash Customer</option>
                            <option value="Account">Account Customer</option>
                        </select>
                    </div>
                    <div class="col-md-3 d-none" id="accountNumberWrapper">
                        <label class="form-label fw-semibold">Account Number <span class="text-danger">*</span></label>
                        <input type="text" class="form-control" id="accountNumber" placeholder="e.g., Rex-1001">
                        <small class="text-muted">Type accurate number to fetch details</small>
                    </div>
                    <div class="col-md-3">
                        <label class="form-label fw-semibold">Shipper Name <span class="text-danger">*</span></label>
                        <input type="text" class="form-control" id="shipperName" required placeholder="Full Name">
                    </div>
                    <div class="col-md-3">
                        <label class="form-label fw-semibold">Shipper Company Name</label>
                        <input type="text" class="form-control" id="shipperCompany" placeholder="Business Name">
                    </div>
                    <div class="col-md-3">
                        <label class="form-label fw-semibold">Shipper City <span class="text-danger">*</span></label>
                        <input type="text" class="form-control" id="shipperCity" required placeholder="City">
                    </div>
                    <div class="col-md-3">
                        <label class="form-label fw-semibold">Shipper State</label>
                        <input type="text" class="form-control" id="shipperState" placeholder="State/Province">
                    </div>
                    <div class="col-md-3">
                        <label class="form-label fw-semibold">Shipper Country <span class="text-danger">*</span></label>
                        <input type="text" class="form-control" id="shipperCountry" required value="Pakistan">
                    </div>
                    <div class="col-md-3">
                        <label class="form-label fw-semibold">Postal Code</label>
                        <input type="text" class="form-control" id="shipperPostalCode" placeholder="Postal Code">
                    </div>
                    <div class="col-md-3">
                        <label class="form-label fw-semibold">Shipper CNIC</label>
                        <input type="text" class="form-control" id="shipperCnic" placeholder="12345-1234567-1" maxlength="15">
                    </div>
                    <div class="col-md-3">
                        <label class="form-label fw-semibold">Shipper NTN</label>
                        <input type="text" class="form-control" id="shipperNtn" placeholder="NTN Number">
                    </div>
                    <div class="col-md-3">
                        <label class="form-label fw-semibold">Shipper Email</label>
                        <input type="email" class="form-control" id="shipperEmail" placeholder="email@example.com">
                    </div>
                    <div class="col-md-3">
                        <label class="form-label fw-semibold">Shipper Contact <span class="text-danger">*</span></label>
                        <div class="input-group">
                            <span class="input-group-text">+92</span>
                            <input type="tel" class="form-control" id="shipperContact" required placeholder="3001234567" maxlength="10">
                        </div>
                    </div>
                </div>
                
                <!-- Customer Info Display Card -->
                <div class="customer-info-display d-none mt-3" id="customerInfoDisplay">
                    <div class="alert alert-info mb-0">
                        <div class="d-flex align-items-center">
                            <i class="bi bi-check-circle-fill me-2 fs-4"></i>
                            <div class="flex-grow-1">
                                <strong id="displayCustomerName">-</strong>
                                <small class="d-block text-muted" id="displayCustomerDetails">-</small>
                            </div>
                            <button type="button" class="btn btn-sm btn-outline-secondary" id="btnClearCustomer">
                                <i class="bi bi-x"></i> Clear
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- ============================================ -->
        <!-- SECTION 3: SHIPMENT DETAILS                  -->
        <!-- ============================================ -->
        <div class="rex-form-card mb-4">
            <div class="rex-form-card-header">
                <h5 class="mb-0"><i class="bi bi-box-seam me-2"></i>Shipment Details</h5>
            </div>
            <div class="rex-form-card-body">
                <div class="row g-3">
                    <div class="col-md-2">
                        <label class="form-label fw-semibold">Pieces <span class="text-danger">*</span></label>
                        <input type="number" class="form-control" id="pieces" required min="1" value="1">
                    </div>
                    <div class="col-md-2">
                        <label class="form-label fw-semibold">Weight (KG) <span class="text-danger">*</span></label>
                        <input type="number" class="form-control" id="weight" required min="0.1" step="0.1" placeholder="0.0">
                    </div>
                    <div class="col-md-2">
                        <label class="form-label fw-semibold">Length (CM)</label>
                        <input type="number" class="form-control" id="length" min="0" step="0.1" placeholder="0">
                    </div>
                    <div class="col-md-2">
                        <label class="form-label fw-semibold">Width (CM)</label>
                        <input type="number" class="form-control" id="width" min="0" step="0.1" placeholder="0">
                    </div>
                    <div class="col-md-2">
                        <label class="form-label fw-semibold">Height (CM)</label>
                        <input type="number" class="form-control" id="height" min="0" step="0.1" placeholder="0">
                    </div>
                    <div class="col-md-2">
                        <label class="form-label fw-semibold">Volumetric Weight</label>
                        <input type="text" class="form-control bg-light" id="volumetricWeight" readonly placeholder="Auto">
                    </div>
                    <div class="col-md-3">
                        <label class="form-label fw-semibold">Chargeable Weight (KG)</label>
                        <input type="text" class="form-control bg-light fw-bold text-primary" id="chargeableWeight" readonly placeholder="Auto">
                        <small class="text-muted">Max of Actual vs Volumetric</small>
                    </div>
                    <div class="col-md-3">
                        <label class="form-label fw-semibold">Shipment Type</label>
                        <select class="form-select" id="shipmentType">
                            <option value="Document">Document</option>
                            <option value="Parcel" selected>Parcel</option>
                            <option value="Cargo">Cargo</option>
                        </select>
                    </div>
                    <div class="col-md-3">
                        <label class="form-label fw-semibold">Contents Description</label>
                        <input type="text" class="form-control" id="contents" placeholder="e.g., Electronics, Documents">
                    </div>
                    <div class="col-md-3">
                        <label class="form-label fw-semibold">Declared Value (PKR)</label>
                        <input type="number" class="form-control" id="declaredValue" min="0" step="0.01" placeholder="0.00">
                    </div>
                </div>
            </div>
        </div>

        <!-- ============================================ -->
        <!-- SECTION 4: PAYMENT MODE                      -->
        <!-- ============================================ -->
        <div class="rex-form-card mb-4">
            <div class="rex-form-card-header">
                <h5 class="mb-0"><i class="bi bi-credit-card me-2"></i>Payment Mode</h5>
            </div>
            <div class="rex-form-card-body">
                <div class="row g-3">
                    <div class="col-md-6">
                        <label class="form-label fw-semibold">Mode of Payment <span class="text-danger">*</span></label>
                        <div class="payment-mode-group" id="paymentModeGroup">
                            <div class="form-check form-check-inline">
                                <input class="form-check-input" type="radio" name="paymentMode" id="payCash" value="Cash" checked>
                                <label class="form-check-label" for="payCash">
                                    <i class="bi bi-cash-stack me-1"></i> Cash
                                </label>
                            </div>
                            <div class="form-check form-check-inline d-none" id="creditOption">
                                <input class="form-check-input" type="radio" name="paymentMode" id="payCredit" value="Credit">
                                <label class="form-check-label" for="payCredit">
                                    <i class="bi bi-credit-card me-1"></i> Credit (Account)
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- ============================================ -->
        <!-- SECTION 5: SHIPMENT CHARGES                  -->
        <!-- ============================================ -->
        <div class="rex-form-card mb-4">
            <div class="rex-form-card-header">
                <h5 class="mb-0"><i class="bi bi-currency-dollar me-2"></i>Shipment Charges</h5>
            </div>
            <div class="rex-form-card-body">
                <div class="row g-3">
                    <div class="col-md-6">
                        <label class="form-label fw-semibold">Base Shipment Charges (PKR) <span class="text-danger">*</span></label>
                        <input type="number" class="form-control form-control-lg fw-bold" id="shipmentCharges" required min="0" step="0.01" placeholder="0.00">
                    </div>
                </div>
            </div>
        </div>

        <!-- ============================================ -->
        <!-- SECTION 6: EXTRA CHARGES                     -->
        <!-- ============================================ -->
        <div class="rex-form-card mb-4">
            <div class="rex-form-card-header">
                <h5 class="mb-0"><i class="bi bi-tags me-2"></i>Additional Charges</h5>
                <small class="text-muted d-block mt-1">Check to apply, enter amount if different from default</small>
            </div>
            <div class="rex-form-card-body">
                <div class="row g-3" id="chargesContainer">
                    <!-- Charges will be dynamically populated -->
                    <div class="col-12 text-center text-muted py-3">
                        <div class="spinner-border spinner-border-sm me-2"></div>
                        Loading charges...
                    </div>
                </div>
            </div>
        </div>

        <!-- ============================================ -->
        <!-- SECTION 7: TAXATION                          -->
        <!-- ============================================ -->
        <div class="rex-form-card mb-4">
            <div class="rex-form-card-header">
                <h5 class="mb-0"><i class="bi bi-receipt me-2"></i>Taxation</h5>
                <small class="text-muted d-block mt-1">Select applicable taxes based on customer profile</small>
            </div>
            <div class="rex-form-card-body">
                <div class="row g-3" id="taxContainer">
                    <!-- Taxes will be dynamically populated -->
                    <div class="col-12 text-center text-muted py-3">
                        <div class="spinner-border spinner-border-sm me-2"></div>
                        Loading taxes...
                    </div>
                </div>
            </div>
        </div>

        <!-- ============================================ -->
        <!-- SECTION 8: TOTAL CHARGES SUMMARY             -->
        <!-- ============================================ -->
        <div class="rex-form-card mb-4">
            <div class="rex-form-card-header bg-primary text-white">
                <h5 class="mb-0"><i class="bi bi-calculator me-2"></i>Total Summary</h5>
            </div>
            <div class="rex-form-card-body">
                <div class="total-summary">
                    <div class="summary-row">
                        <span>Base Shipment Charges:</span>
                        <span class="amount" id="summaryBase">PKR 0.00</span>
                    </div>
                    <div class="summary-row" id="summaryChargesRow">
                        <span>Additional Charges:</span>
                        <span class="amount" id="summaryCharges">PKR 0.00</span>
                    </div>
                    <div class="summary-row subtotal-row">
                        <span>Subtotal:</span>
                        <span class="amount" id="summarySubtotal">PKR 0.00</span>
                    </div>
                    <div class="summary-row" id="summaryTaxRow">
                        <span>Tax:</span>
                        <span class="amount" id="summaryTax">PKR 0.00</span>
                    </div>
                    <div class="summary-row grand-total-row">
                        <span>GRAND TOTAL:</span>
                        <span class="amount" id="summaryGrandTotal">PKR 0.00</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- ============================================ -->
        <!-- SECTION 9: CONSIGNEE (RECEIVER) DETAILS      -->
        <!-- ============================================ -->
        <div class="rex-form-card mb-4">
            <div class="rex-form-card-header">
                <h5 class="mb-0"><i class="bi bi-geo-alt me-2"></i>Destination / Consignee Details</h5>
            </div>
            <div class="rex-form-card-body">
                <div class="row g-3">
                    <div class="col-md-6">
                        <label class="form-label fw-semibold">Destination <span class="text-danger">*</span></label>
                        <input type="text" class="form-control" id="destination" required placeholder="Enter destination city/area">
                    </div>
                    <div class="col-md-6">
                        <label class="form-label fw-semibold">Consignee Name <span class="text-danger">*</span></label>
                        <input type="text" class="form-control" id="consigneeName" required placeholder="Receiver Name">
                    </div>
                    <div class="col-md-6">
                        <label class="form-label fw-semibold">Consignee Company Name</label>
                        <input type="text" class="form-control" id="consigneeCompany" placeholder="Company (Optional)">
                    </div>
                    <div class="col-12">
                        <label class="form-label fw-semibold">Consignee Address <span class="text-danger">*</span></label>
                        <textarea class="form-control" id="consigneeAddress" required rows="2" placeholder="Complete Address"></textarea>
                    </div>
                    <div class="col-md-4">
                        <label class="form-label fw-semibold">Country <span class="text-danger">*</span></label>
                        <select class="form-select" id="consigneeCountry" required>
                            <option value="" disabled selected>Select Country</option>
                        </select>
                    </div>
                    <div class="col-md-4">
                        <label class="form-label fw-semibold">City <span class="text-danger">*</span></label>
                        <select class="form-select" id="consigneeCity" required>
                            <option value="" disabled selected>Select Country first</option>
                        </select>
                    </div>
                    <div class="col-md-4">
                        <label class="form-label fw-semibold">State</label>
                        <input type="text" class="form-control" id="consigneeState" placeholder="State (Optional)">
                    </div>
                    <div class="col-md-4">
                        <label class="form-label fw-semibold">Postal Code</label>
                        <input type="text" class="form-control" id="consigneePostalCode" placeholder="Postal Code">
                    </div>
                    <div class="col-md-4">
                        <label class="form-label fw-semibold">Consignee Email</label>
                        <input type="email" class="form-control" id="consigneeEmail" placeholder="email@example.com">
                    </div>
                    <div class="col-md-4">
                        <label class="form-label fw-semibold">Consignee Contact <span class="text-danger">*</span></label>
                        <input type="tel" class="form-control" id="consigneeContact" required placeholder="+92 300 1234567">
                    </div>
                    <div class="col-md-6">
                        <label class="form-label fw-semibold">Consignee Tax Details</label>
                        <input type="text" class="form-control" id="consigneeTax" placeholder="NTN / STRN / Tax ID (Optional)">
                    </div>
                </div>
            </div>
        </div>

        <!-- ============================================ -->
        <!-- SECTION 10: OPTIONAL SERVICES                -->
        <!-- ============================================ -->
        <div class="rex-form-card mb-4">
            <div class="rex-form-card-header">
                <h5 class="mb-0"><i class="bi bi-gear me-2"></i>Optional Services</h5>
            </div>
            <div class="rex-form-card-body">
                <div class="row g-3">
                    <div class="col-md-4">
                        <label class="form-label fw-semibold">Shipment Reference</label>
                        <input type="text" class="form-control" id="shipmentReference" placeholder="Reference No.">
                    </div>
                    <div class="col-md-4">
                        <label class="form-label fw-semibold">Insurance Amount (PKR)</label>
                        <input type="number" class="form-control" id="insuranceAmount" min="0" step="0.01" placeholder="0.00">
                    </div>
                    <div class="col-md-4">
                        <label class="form-label fw-semibold">Third Party No.</label>
                        <input type="text" class="form-control" id="thirdPartyNo" placeholder="Third Party Reference">
                    </div>
                    <div class="col-12">
                        <label class="form-label fw-semibold">Items Description</label>
                        <textarea class="form-control" id="itemsDescription" rows="2" placeholder="Detailed description of items"></textarea>
                    </div>
                </div>
            </div>
        </div>

        <!-- ============================================ -->
        <!-- SECTION 11: ITEMS TABLE (DYNAMIC)            -->
        <!-- ============================================ -->
        <div class="rex-form-card mb-4">
            <div class="rex-form-card-header d-flex justify-content-between align-items-center">
                <h5 class="mb-0"><i class="bi bi-list-columns-reverse me-2"></i>Items Details</h5>
                <button type="button" class="btn btn-sm btn-success" id="btnAddItem">
                    <i class="bi bi-plus-circle me-1"></i> Add Item
                </button>
            </div>
            <div class="rex-form-card-body">
                <div class="table-responsive">
                    <table class="table table-bordered items-table" id="itemsTable">
                        <thead class="table-light">
                            <tr>
                                <th width="5%">S.No</th>
                                <th width="25%">Item / Goods</th>
                                <th width="12%">HS Code</th>
                                <th width="15%">Country of Origin</th>
                                <th width="10%">Quantity</th>
                                <th width="15%">Unit Value (USD)</th>
                                <th width="15%">Sub Total (USD)</th>
                                <th width="3%"></th>
                            </tr>
                        </thead>
                        <tbody id="itemsTableBody">
                            <!-- First row will be added dynamically -->
                        </tbody>
                        <tfoot>
                            <tr class="table-primary">
                                <td colspan="6" class="text-end fw-bold">Items Sub Total (USD):</td>
                                <td colspan="2" class="fw-bold">
                                    <span id="itemsSubtotal">0.00</span> USD
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>

        <!-- ============================================ -->
        <!-- SECTION 12: TERMS & UNDERTAKING              -->
        <!-- ============================================ -->
        <div class="rex-form-card mb-4">
            <div class="rex-form-card-header">
                <h5 class="mb-0"><i class="bi bi-file-earmark-text me-2"></i>Terms & Undertaking</h5>
            </div>
            <div class="rex-form-card-body">
                <!-- Terms & Conditions -->
                <div class="mb-4" id="tcSection">
                    <h6 class="fw-bold text-primary"><i class="bi bi-file-ruled me-1"></i> Terms & Conditions</h6>
                    <div class="tc-content-display" id="tcContentDisplay">
                        <div class="text-center text-muted py-3">
                            <div class="spinner-border spinner-border-sm me-2"></div>
                            Loading Terms & Conditions...
                        </div>
                    </div>
                    <div class="form-check mt-3">
                        <input class="form-check-input" type="checkbox" id="acceptTC" required>
                        <label class="form-check-label fw-semibold" for="acceptTC">
                            I have read and accept the Terms & Conditions <span class="text-danger">*</span>
                        </label>
                    </div>
                </div>

                <hr>

                <!-- Undertaking -->
                <div id="undertakingSection">
                    <h6 class="fw-bold text-primary"><i class="bi bi-shield-check me-1"></i> Undertaking</h6>
                    <div class="tc-content-display" id="undertakingContentDisplay">
                        <div class="text-center text-muted py-3">
                            <div class="spinner-border spinner-border-sm me-2"></div>
                            Loading Undertaking...
                        </div>
                    </div>
                    <div class="form-check mt-3">
                        <input class="form-check-input" type="checkbox" id="acceptUndertaking" required>
                        <label class="form-check-label fw-semibold" for="acceptUndertaking">
                            I have read and accept the Undertaking <span class="text-danger">*</span>
                        </label>
                    </div>
                </div>
            </div>
        </div>

        <!-- ============================================ -->
        <!-- SECTION 13: SHIPPER SIGNATURE                -->
        <!-- ============================================ -->
        <div class="rex-form-card mb-4">
            <div class="rex-form-card-body text-center">
                <div class="signature-box">
                    <div class="signature-line"></div>
                    <p class="mb-0 fw-semibold">Shipper Signature</p>
                    <small class="text-muted">By signing, I confirm all above details are correct</small>
                </div>
            </div>
        </div>

        <!-- ============================================ -->
        <!-- ACTION BUTTONS                               -->
        <!-- ============================================ -->
        <div class="rex-form-actions">
            <button type="button" class="btn btn-outline-secondary" onclick="loadView('admindashboard')">
                <i class="bi bi-x-circle me-1"></i> Cancel
            </button>
            <button type="button" class="btn btn-outline-warning" id="btnSaveDraft">
                <i class="bi bi-save me-1"></i> Save as Draft
            </button>
            <button type="submit" class="btn btn-rex-primary btn-lg" id="btnSaveBooking">
                <span class="btn-text"><i class="bi bi-check-circle me-1"></i> Save Booking</span>
                <span class="btn-loader d-none">
                    <span class="spinner-border spinner-border-sm me-2"></span> Saving...
                </span>
            </button>
        </div>

    </form>
</div>

<!-- ============================================ -->
<!-- 🔥 SUCCESS MODAL                             -->
<!-- ============================================ -->
<div class="modal fade" id="bookingSuccessModal" tabindex="-1" data-bs-backdrop="static">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow">
            <div class="modal-body text-center p-5">
                <div class="success-icon-wrapper mb-4"><i class="bi bi-check-circle-fill"></i></div>
                <h3 class="fw-bold mb-3">Booking Created Successfully!</h3>
                <div class="booking-numbers-card mb-4">
                    <div class="number-row">
                        <span class="number-label">AWB Number:</span>
                        <span class="number-value" id="successAWB">-</span>
                    </div>
                    <div class="number-row">
                        <span class="number-label">PI Number:</span>
                        <span class="number-value" id="successPI">-</span>
                    </div>
                    <div class="number-row">
                        <span class="number-label">Grand Total:</span>
                        <span class="number-value" id="successTotal">-</span>
                    </div>
                </div>
                <div class="d-flex gap-2 justify-content-center flex-wrap">
                    <button type="button" class="btn btn-outline-secondary" id="btnNewBooking">
                        <i class="bi bi-plus-circle me-1"></i> New Booking
                    </button>
                    <button type="button" class="btn btn-primary" id="btnPrintBooking">
                        <i class="bi bi-printer me-1"></i> Print AWB/PI
                    </button>
                    <button type="button" class="btn btn-success" id="btnViewList">
                        <i class="bi bi-list-ul me-1"></i> View Bookings
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- ============================================ -->
<!-- 🔥 ERROR MODAL                               -->
<!-- ============================================ -->
<div class="modal fade" id="bookingErrorModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow">
            <div class="modal-header bg-danger text-white border-0">
                <h5 class="modal-title"><i class="bi bi-exclamation-triangle-fill me-2"></i>Error</h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body py-4">
                <p id="bookingErrorMessage" class="mb-0 fs-5 text-center">Something went wrong.</p>
            </div>
            <div class="modal-footer border-0 justify-content-center">
                <button type="button" class="btn btn-secondary px-4" data-bs-dismiss="modal">OK</button>
            </div>
        </div>
    </div>
</div>

<!-- ============================================ -->
<!-- 🔥 VIEW T&C MODAL                            -->
<!-- ============================================ -->
<div class="modal fade" id="viewTCModal" tabindex="-1">
    <div class="modal-dialog modal-lg modal-dialog-scrollable">
        <div class="modal-content">
            <div class="modal-header bg-primary text-white">
                <h5 class="modal-title"><i class="bi bi-file-ruled me-2"></i>Terms & Conditions</h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body p-4" id="viewTCContent"></div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>




<!-- ============================================ -->
<!-- 🔥 BOOKING CONFIRMATION MODAL                -->
<!-- ============================================ -->
<div class="modal fade" id="bookingConfirmModal" tabindex="-1" data-bs-backdrop="static">
    <div class="modal-dialog modal-xl modal-dialog-scrollable">
        <div class="modal-content border-0 shadow-lg">
            <div class="modal-header bg-primary text-white">
                <h5 class="modal-title"><i class="bi bi-clipboard-check me-2"></i>Review Booking Details</h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body p-4">
                
                <div class="alert alert-warning border-0 mb-4">
                    <i class="bi bi-exclamation-triangle-fill me-2"></i>
                    <strong>Please review all details carefully.</strong> Once saved, the AWB and PI numbers will be committed and cannot be changed.
                </div>

                <!-- Booking Numbers -->
                <div class="confirm-section">
                    <h6 class="confirm-section-title"><i class="bi bi-hash me-2"></i>Booking Numbers</h6>
                    <div class="confirm-numbers-grid">
                        <div class="confirm-number-box">
                            <span class="label">AWB Number</span>
                            <span class="value" id="confirmAWB">-</span>
                        </div>
                        <div class="confirm-number-box">
                            <span class="label">PI Number</span>
                            <span class="value" id="confirmPI">-</span>
                        </div>
                        <div class="confirm-number-box">
                            <span class="label">Booking Date</span>
                            <span class="value" id="confirmDate">-</span>
                        </div>
                        <div class="confirm-number-box">
                            <span class="label">Service Type</span>
                            <span class="value" id="confirmService">-</span>
                        </div>
                    </div>
                </div>

                <!-- Shipper Details -->
                <div class="confirm-section">
                    <h6 class="confirm-section-title"><i class="bi bi-person-badge me-2"></i>Shipper Details</h6>
                    <div class="confirm-grid">
                        <div class="confirm-field"><span class="label">Name:</span><span class="value" id="confirmShipperName">-</span></div>
                        <div class="confirm-field"><span class="label">Company:</span><span class="value" id="confirmShipperCompany">-</span></div>
                        <div class="confirm-field"><span class="label">City:</span><span class="value" id="confirmShipperCity">-</span></div>
                        <div class="confirm-field"><span class="label">Country:</span><span class="value" id="confirmShipperCountry">-</span></div>
                        <div class="confirm-field"><span class="label">Contact:</span><span class="value" id="confirmShipperContact">-</span></div>
                        <div class="confirm-field"><span class="label">CNIC:</span><span class="value" id="confirmShipperCnic">-</span></div>
                    </div>
                </div>

                <!-- Consignee Details -->
                <div class="confirm-section">
                    <h6 class="confirm-section-title"><i class="bi bi-geo-alt me-2"></i>Consignee Details</h6>
                    <div class="confirm-grid">
                        <div class="confirm-field"><span class="label">Name:</span><span class="value" id="confirmConsigneeName">-</span></div>
                        <div class="confirm-field"><span class="label">Company:</span><span class="value" id="confirmConsigneeCompany">-</span></div>
                        <div class="confirm-field"><span class="label">Destination:</span><span class="value" id="confirmDestination">-</span></div>
                        <div class="confirm-field"><span class="label">City:</span><span class="value" id="confirmConsigneeCity">-</span></div>
                        <div class="confirm-field"><span class="label">Country:</span><span class="value" id="confirmConsigneeCountry">-</span></div>
                        <div class="confirm-field"><span class="label">Contact:</span><span class="value" id="confirmConsigneeContact">-</span></div>
                    </div>
                    <div class="confirm-field mt-2"><span class="label">Address:</span><span class="value" id="confirmConsigneeAddress">-</span></div>
                </div>

                <!-- Shipment Details -->
                <div class="confirm-section">
                    <h6 class="confirm-section-title"><i class="bi bi-box-seam me-2"></i>Shipment Details</h6>
                    <div class="confirm-grid">
                        <div class="confirm-field"><span class="label">Pieces:</span><span class="value" id="confirmPieces">-</span></div>
                        <div class="confirm-field"><span class="label">Weight:</span><span class="value" id="confirmWeight">-</span></div>
                        <div class="confirm-field"><span class="label">Dimensions:</span><span class="value" id="confirmDimensions">-</span></div>
                        <div class="confirm-field"><span class="label">Volumetric Weight:</span><span class="value" id="confirmVolumetric">-</span></div>
                        <div class="confirm-field"><span class="label">Chargeable Weight:</span><span class="value fw-bold text-primary" id="confirmChargeable">-</span></div>
                        <div class="confirm-field"><span class="label">Shipment Type:</span><span class="value" id="confirmShipmentType">-</span></div>
                    </div>
                </div>

                <!-- Items -->
                <div class="confirm-section">
                    <h6 class="confirm-section-title"><i class="bi bi-list-columns-reverse me-2"></i>Items (<span id="confirmItemCount">0</span>)</h6>
                    <div class="table-responsive">
                        <table class="table table-sm table-bordered confirm-items-table">
                            <thead class="table-light">
                                <tr>
                                    <th>S.No</th>
                                    <th>Item</th>
                                    <th>HS Code</th>
                                    <th>Qty</th>
                                    <th>Unit (USD)</th>
                                    <th>Sub Total (USD)</th>
                                </tr>
                            </thead>
                            <tbody id="confirmItemsBody"></tbody>
                            <tfoot>
                                <tr class="table-primary">
                                    <td colspan="5" class="text-end fw-bold">Items Sub Total:</td>
                                    <td class="fw-bold"><span id="confirmItemsSubtotal">0.00</span> USD</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>

                <!-- Charges & Taxes -->
                <div class="confirm-section">
                    <h6 class="confirm-section-title"><i class="bi bi-calculator me-2"></i>Charges & Taxes</h6>
                    <div class="confirm-charges-box">
                        <div class="confirm-charge-row">
                            <span>Base Shipment Charges:</span>
                            <span id="confirmBaseCharges">PKR 0.00</span>
                        </div>
                        <div id="confirmAdditionalCharges"></div>
                        <div class="confirm-charge-row subtotal">
                            <span>Subtotal:</span>
                            <span id="confirmSubtotal">PKR 0.00</span>
                        </div>
                        <div id="confirmTaxes"></div>
                        <div class="confirm-charge-row grand-total">
                            <span>GRAND TOTAL:</span>
                            <span id="confirmGrandTotal">PKR 0.00</span>
                        </div>
                    </div>
                </div>

                <!-- Payment Mode -->
                <div class="confirm-section">
                    <h6 class="confirm-section-title"><i class="bi bi-credit-card me-2"></i>Payment</h6>
                    <div class="confirm-field">
                        <span class="label">Payment Mode:</span>
                        <span class="value fw-bold" id="confirmPaymentMode">-</span>
                    </div>
                </div>

            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-outline-secondary btn-lg" id="btnCancelConfirm">
                    <i class="bi bi-arrow-left me-1"></i> Cancel & Edit
                </button>
                <button type="button" class="btn btn-success btn-lg" id="btnConfirmSave">
                    <span class="btn-text"><i class="bi bi-check-circle me-1"></i> Save Booking</span>
                    <span class="btn-loader d-none"><span class="spinner-border spinner-border-sm me-2"></span> Saving...</span>
                </button>
            </div>
        </div>
    </div>
</div>

