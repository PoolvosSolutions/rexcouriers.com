<?php
// includes/view/charge/addcharge.php
// 🔥 Add Charge Configuration Form - Rexcouris
?>

<div class="container-fluid py-4 addcharge-page">
    
    <!-- Page Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
            <h3 class="mb-1"><i class="bi bi-plus-circle text-danger me-2"></i>Add New Charge</h3>
            <p class="text-muted mb-0 small">Create a new charge type for the booking system</p>
        </div>
        <button type="button" class="btn btn-outline-secondary" onclick="loadView('charge')">
            <i class="bi bi-arrow-left me-1"></i> Back to List
        </button>
    </div>

    <!-- 🔥 MAIN FORM -->
    <form id="addChargeForm" novalidate>
        
        <!-- ============================================ -->
        <!-- SECTION 1: BASIC INFORMATION                 -->
        <!-- ============================================ -->
        <div class="rex-form-card mb-4">
            <div class="rex-form-card-header">
                <h5 class="mb-0"><i class="bi bi-info-circle me-2"></i>Basic Information</h5>
            </div>
            <div class="rex-form-card-body">
                <div class="row g-3">
                    
                    <!-- Charge Name (Compulsory) -->
                    <div class="col-md-6">
                        <div class="form-floating rex-floating-group">
                            <input type="text" class="form-control" id="chargeName" required 
                                   placeholder="Charge Name">
                            <label for="chargeName"><i class="bi bi-tag me-2"></i>Charge Name <span class="text-danger">*</span></label>
                            <div class="invalid-feedback">Charge name is required</div>
                        </div>
                        <small class="text-muted mt-1 d-block">e.g., "Packing Material", "Remote Area Surcharge"</small>
                    </div>

                    <!-- Charge Code (Auto-generated but editable) -->
                    <div class="col-md-3">
                        <div class="form-floating rex-floating-group">
                            <input type="text" class="form-control" id="chargeCode" required 
                                   placeholder="CHG-001" maxlength="20">
                            <label for="chargeCode"><i class="bi bi-hash me-2"></i>Charge Code <span class="text-danger">*</span></label>
                        </div>
                        <small class="text-muted mt-1 d-block">Unique identifier (auto-generated)</small>
                    </div>

                    <!-- Status -->
                    <div class="col-md-3">
                        <div class="form-floating rex-floating-group">
                            <select class="form-select" id="chargeStatus">
                                <option value="Active" selected>Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                            <label for="chargeStatus"><i class="bi bi-toggle-on me-2"></i>Status</label>
                        </div>
                    </div>

                    <!-- Category -->
                    <div class="col-md-4">
                        <div class="form-floating rex-floating-group">
                            <select class="form-select" id="chargeCategory">
                                <option value="Standard" selected>Standard Charge</option>
                                <option value="Surcharge">Surcharge</option>
                                <option value="Service">Service Fee</option>
                                <option value="Penalty">Penalty</option>
                                <option value="Discount">Discount</option>
                            </select>
                            <label for="chargeCategory"><i class="bi bi-folder me-2"></i>Category</label>
                        </div>
                    </div>

                    <!-- Nature (Mandatory/Optional) -->
                    <div class="col-md-4">
                        <div class="form-floating rex-floating-group">
                            <select class="form-select" id="chargeNature">
                                <option value="Optional" selected>Optional (Checkbox in booking)</option>
                                <option value="Mandatory">Mandatory (Auto-applied)</option>
                            </select>
                            <label for="chargeNature"><i class="bi bi-check2-square me-2"></i>Nature</label>
                        </div>
                    </div>

                    <!-- Priority/Sort Order -->
                    <div class="col-md-4">
                        <div class="form-floating rex-floating-group">
                            <input type="number" class="form-control" id="chargeSortOrder" 
                                   placeholder="10" min="1" max="999" value="10">
                            <label for="chargeSortOrder"><i class="bi bi-sort-down me-2"></i>Display Order</label>
                        </div>
                        <small class="text-muted mt-1 d-block">Lower number = shown first in booking form</small>
                    </div>

                    <!-- Description -->
                    <div class="col-12">
                        <div class="form-floating rex-floating-group">
                            <textarea class="form-control" id="chargeDescription" placeholder="Description" 
                                      style="height: 80px"></textarea>
                            <label for="chargeDescription"><i class="bi bi-card-text me-2"></i>Description</label>
                        </div>
                    </div>

                </div>
            </div>
        </div>

        <!-- ============================================ -->
        <!-- SECTION 2: CALCULATION SETTINGS              -->
        <!-- ============================================ -->
        <div class="rex-form-card mb-4">
            <div class="rex-form-card-header">
                <h5 class="mb-0"><i class="bi bi-calculator me-2"></i>Calculation Settings</h5>
            </div>
            <div class="rex-form-card-body">
                <div class="row g-3">
                    
                    <!-- Calculation Type -->
                    <div class="col-md-4">
                        <div class="form-floating rex-floating-group">
                            <select class="form-select" id="calculationType" required>
                                <option value="flat" selected>Flat Amount (PKR)</option>
                                <option value="percentage">Percentage (%)</option>
                                <option value="per_kg">Per Kilogram (PKR/kg)</option>
                                <option value="per_piece">Per Piece (PKR/piece)</option>
                            </select>
                            <label for="calculationType"><i class="bi bi-calculator me-2"></i>Calculation Type <span class="text-danger">*</span></label>
                        </div>
                    </div>

                    <!-- Default Value -->
                    <div class="col-md-4">
                        <div class="form-floating rex-floating-group">
                            <div class="input-group">
                                <span class="input-group-text rex-calc-symbol" id="calcSymbol">PKR</span>
                                <input type="number" class="form-control" id="defaultValue" required 
                                       placeholder="0.00" min="0" step="0.01">
                            </div>
                            <label for="defaultValue"><i class="bi bi-currency-exchange me-2"></i>Default Value <span class="text-danger">*</span></label>
                        </div>
                    </div>

                    <!-- Minimum Value (for percentage) -->
                    <div class="col-md-2 min-max-field d-none">
                        <div class="form-floating rex-floating-group">
                            <input type="number" class="form-control" id="minValue" 
                                   placeholder="0" min="0" step="0.01">
                            <label for="minValue"><i class="bi bi-arrow-down me-2"></i>Min Value</label>
                        </div>
                    </div>

                    <!-- Maximum Value (for percentage) -->
                    <div class="col-md-2 min-max-field d-none">
                        <div class="form-floating rex-floating-group">
                            <input type="number" class="form-control" id="maxValue" 
                                   placeholder="0" min="0" step="0.01">
                            <label for="maxValue"><i class="bi bi-arrow-up me-2"></i>Max Value</label>
                        </div>
                    </div>

                    <!-- Rounding -->
                    <div class="col-md-2">
                        <div class="form-floating rex-floating-group">
                            <select class="form-select" id="roundingType">
                                <option value="none" selected>No Rounding</option>
                                <option value="up">Round Up</option>
                                <option value="down">Round Down</option>
                                <option value="nearest">Round to Nearest</option>
                            </select>
                            <label for="roundingType"><i class="bi bi-arrow-left-right me-2"></i>Rounding</label>
                        </div>
                    </div>

                </div>
            </div>
        </div>

        <!-- ============================================ -->
        <!-- SECTION 3: APPLICABILITY RULES               -->
        <!-- ============================================ -->
        <div class="rex-form-card mb-4">
            <div class="rex-form-card-header">
                <h5 class="mb-0"><i class="bi bi-funnel me-2"></i>Applicability Rules</h5>
                <small class="text-muted d-block mt-1">Define when this charge should be available</small>
            </div>
            <div class="rex-form-card-body">
                <div class="row g-3">
                    
                    <!-- Shipment Type -->
                    <div class="col-md-4">
                        <label class="form-label fw-semibold mb-2">
                            <i class="bi bi-box-seam me-1"></i>Apply To Shipment Type
                        </label>
                        <div class="rex-checkbox-group">
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" id="applyDocument" value="Document" checked>
                                <label class="form-check-label" for="applyDocument">Documents</label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" id="applyParcel" value="Parcel" checked>
                                <label class="form-check-label" for="applyParcel">Parcels/Non-Documents</label>
                            </div>
                        </div>
                    </div>

                    <!-- Service Direction -->
                    <div class="col-md-4">
                        <label class="form-label fw-semibold mb-2">
                            <i class="bi bi-globe me-1"></i>Apply To Service Direction
                        </label>
                        <div class="rex-checkbox-group">
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" id="applyDomestic" value="Domestic" checked>
                                <label class="form-check-label" for="applyDomestic">Domestic</label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" id="applyInternational" value="International" checked>
                                <label class="form-check-label" for="applyInternational">International</label>
                            </div>
                        </div>
                    </div>

                    <!-- Customer Type -->
                    <div class="col-md-4">
                        <label class="form-label fw-semibold mb-2">
                            <i class="bi bi-person me-1"></i>Apply To Customer Type
                        </label>
                        <div class="rex-checkbox-group">
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" id="applyCash" value="Cash" checked>
                                <label class="form-check-label" for="applyCash">Cash Customers</label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" id="applyAccount" value="Account" checked>
                                <label class="form-check-label" for="applyAccount">Account Customers</label>
                            </div>
                        </div>
                    </div>

                    <!-- Weight Threshold (Optional) -->
                    <div class="col-md-6">
                        <div class="form-floating rex-floating-group">
                            <input type="number" class="form-control" id="minWeightThreshold" 
                                   placeholder="0" min="0" step="0.1">
                            <label for="minWeightThreshold"><i class="bi bi-speedometer me-2"></i>Minimum Weight Threshold (KG)</label>
                        </div>
                        <small class="text-muted mt-1 d-block">Leave blank to apply to all weights</small>
                    </div>

                    <!-- Declared Value Threshold (Optional) -->
                    <div class="col-md-6">
                        <div class="form-floating rex-floating-group">
                            <input type="number" class="form-control" id="minDeclaredValue" 
                                   placeholder="0" min="0" step="1">
                            <label for="minDeclaredValue"><i class="bi bi-cash-stack me-2"></i>Minimum Declared Value (PKR)</label>
                        </div>
                        <small class="text-muted mt-1 d-block">Useful for insurance-type charges</small>
                    </div>

                </div>
            </div>
        </div>

        <!-- ============================================ -->
        <!-- SECTION 4: DISPLAY & INVOICE SETTINGS        -->
        <!-- ============================================ -->
        <div class="rex-form-card mb-4">
            <div class="rex-form-card-header">
                <h5 class="mb-0"><i class="bi bi-eye me-2"></i>Display & Invoice Settings</h5>
            </div>
            <div class="rex-form-card-body">
                <div class="row g-3">
                    
                    <!-- Show on Booking Form -->
                    <div class="col-md-3">
                        <div class="rex-switch-group">
                            <label class="rex-switch">
                                <input type="checkbox" id="showOnBooking" checked>
                                <span class="rex-switch-slider"></span>
                            </label>
                            <span class="rex-switch-label">Show on Booking Form</span>
                        </div>
                    </div>

                    <!-- Show on Invoice -->
                    <div class="col-md-3">
                        <div class="rex-switch-group">
                            <label class="rex-switch">
                                <input type="checkbox" id="showOnInvoice" checked>
                                <span class="rex-switch-slider"></span>
                            </label>
                            <span class="rex-switch-label">Show on Invoice</span>
                        </div>
                    </div>

                    <!-- Show on Receipt -->
                    <div class="col-md-3">
                        <div class="rex-switch-group">
                            <label class="rex-switch">
                                <input type="checkbox" id="showOnReceipt" checked>
                                <span class="rex-switch-slider"></span>
                            </label>
                            <span class="rex-switch-label">Show on Receipt</span>
                        </div>
                    </div>

                    <!-- Is Taxable (GST applies on this charge) -->
                    <div class="col-md-3">
                        <div class="rex-switch-group">
                            <label class="rex-switch">
                                <input type="checkbox" id="isTaxable" checked>
                                <span class="rex-switch-slider"></span>
                            </label>
                            <span class="rex-switch-label">Subject to GST/SST</span>
                        </div>
                    </div>

                </div>
            </div>
        </div>

        <!-- ============================================ -->
        <!-- SECTION 5: ACCOUNTING DETAILS                -->
        <!-- ============================================ -->
        <div class="rex-form-card mb-4">
            <div class="rex-form-card-header">
                <h5 class="mb-0"><i class="bi bi-journal-text me-2"></i>Accounting Details <span class="badge bg-secondary ms-2">Optional</span></h5>
            </div>
            <div class="rex-form-card-body">
                <div class="row g-3">
                    
                    <!-- GL Account Code -->
                    <div class="col-md-4">
                        <div class="form-floating rex-floating-group">
                            <input type="text" class="form-control" id="glAccountCode" 
                                   placeholder="GL Code">
                            <label for="glAccountCode"><i class="bi bi-journal me-2"></i>GL Account Code</label>
                        </div>
                    </div>

                    <!-- Revenue Type -->
                    <div class="col-md-4">
                        <div class="form-floating rex-floating-group">
                            <select class="form-select" id="revenueType">
                                <option value="business" selected>Business Revenue</option>
                                <option value="passthrough">Pass-Through (Carrier Cost)</option>
                                <option value="tax">Tax Collection</option>
                            </select>
                            <label for="revenueType"><i class="bi bi-piggy-bank me-2"></i>Revenue Type</label>
                        </div>
                    </div>

                    <!-- Tax Category -->
                    <div class="col-md-4">
                        <div class="form-floating rex-floating-group">
                            <select class="form-select" id="taxCategory">
                                <option value="standard" selected>Standard</option>
                                <option value="zero">Zero-Rated</option>
                                <option value="exempt">Exempt</option>
                            </select>
                            <label for="taxCategory"><i class="bi bi-receipt me-2"></i>Tax Category</label>
                        </div>
                    </div>

                </div>
            </div>
        </div>

        <!-- ============================================ -->
        <!-- SECTION 6: NOTES                             -->
        <!-- ============================================ -->
        <div class="rex-form-card mb-4">
            <div class="rex-form-card-header">
                <h5 class="mb-0"><i class="bi bi-sticky me-2"></i>Internal Notes</h5>
            </div>
            <div class="rex-form-card-body">
                <div class="row g-3">
                    <div class="col-12">
                        <div class="form-floating rex-floating-group">
                            <textarea class="form-control" id="internalNotes" placeholder="Notes" 
                                      style="height: 80px"></textarea>
                            <label for="internalNotes"><i class="bi bi-pencil me-2"></i>Notes (Internal use only)</label>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- ============================================ -->
        <!-- FORM ACTIONS                                 -->
        <!-- ============================================ -->
        <div class="rex-form-actions">
            <button type="button" class="btn btn-outline-secondary" onclick="loadView('charge')">
                <i class="bi bi-x-circle me-1"></i> Cancel
            </button>
            <button type="submit" class="btn btn-rex-primary" id="btnSaveCharge">
                <span class="btn-text"><i class="bi bi-check-circle me-1"></i> Save Charge</span>
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
<div class="modal fade" id="chargeSuccessModal" tabindex="-1" data-bs-backdrop="static">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow">
            <div class="modal-body text-center p-5">
                <div class="success-icon-wrapper mb-4">
                    <i class="bi bi-check-circle-fill"></i>
                </div>
                <h3 class="fw-bold mb-2">Charge Added Successfully!</h3>
                <p class="text-muted mb-1">New charge has been added to the system.</p>
                <p class="fw-semibold text-danger mb-4" id="successChargeName">Charge: Packing Material</p>
                <div class="d-flex gap-2 justify-content-center">
                    <button type="button" class="btn btn-outline-secondary" id="btnAddAnother">
                        <i class="bi bi-plus-circle me-1"></i> Add Another
                    </button>
                    <button type="button" class="btn btn-rex-primary" id="btnViewList">
                        <i class="bi bi-list-ul me-1"></i> View All Charges
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- ============================================ -->
<!-- 🔥 ERROR MODAL                               -->
<!-- ============================================ -->
<div class="modal fade" id="chargeErrorModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow">
            <div class="modal-header bg-danger text-white border-0">
                <h5 class="modal-title"><i class="bi bi-exclamation-triangle-fill me-2"></i>Error</h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body py-4">
                <p id="chargeErrorMessage" class="mb-0 fs-5 text-center">Something went wrong.</p>
            </div>
            <div class="modal-footer border-0 justify-content-center">
                <button type="button" class="btn btn-secondary px-4" data-bs-dismiss="modal">Try Again</button>
            </div>
        </div>
    </div>
</div>