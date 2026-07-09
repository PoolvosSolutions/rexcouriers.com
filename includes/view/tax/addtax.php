<?php
// includes/view/tax/addtax.php
// 🔥 Add Tax Configuration Form - Rexcouris
?>

<div class="container-fluid py-4 addtax-page">
    
    <!-- Page Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
            <h3 class="mb-1"><i class="bi bi-plus-circle text-danger me-2"></i>Add New Tax Configuration</h3>
            <p class="text-muted mb-0 small">Configure tax rules (GST, SST, WHT) for the booking system</p>
        </div>
        <button type="button" class="btn btn-outline-secondary" onclick="loadView('tax')">
            <i class="bi bi-arrow-left me-1"></i> Back to List
        </button>
    </div>

    <!-- 🔥 INFO ALERT -->
    <div class="alert alert-info border-0 shadow-sm mb-4" role="alert">
        <div class="d-flex align-items-start">
            <i class="bi bi-info-circle-fill me-2 mt-1"></i>
            <div>
                <strong class="d-block mb-1">Pakistan Tax Compliance Guide</strong>
                <small class="text-muted">
                    • <strong>GST (18%)</strong> - Federal tax for customers outside Sindh<br>
                    • <strong>SST (16%)</strong> - Sindh provincial tax for customers within Sindh<br>
                    • <strong>WHT</strong> - Withholding tax for non-filers (higher rate)
                </small>
            </div>
        </div>
    </div>

    <!-- 🔥 MAIN FORM -->
    <form id="addTaxForm" novalidate>
        
        <!-- ============================================ -->
        <!-- SECTION 1: BASIC INFORMATION                 -->
        <!-- ============================================ -->
        <div class="rex-form-card mb-4">
            <div class="rex-form-card-header">
                <h5 class="mb-0"><i class="bi bi-info-circle me-2"></i>Basic Information</h5>
            </div>
            <div class="rex-form-card-body">
                <div class="row g-3">
                    
                    <!-- Tax Name (Compulsory) -->
                    <div class="col-md-6">
                        <div class="form-floating rex-floating-group">
                            <input type="text" class="form-control" id="taxName" required 
                                   placeholder="Tax Name">
                            <label for="taxName"><i class="bi bi-tag me-2"></i>Tax Name <span class="text-danger">*</span></label>
                            <div class="invalid-feedback">Tax name is required</div>
                        </div>
                        <small class="text-muted mt-1 d-block">e.g., "GST (Federal)", "SST (Sindh)", "Withholding Tax"</small>
                    </div>

                    <!-- Tax Code (Auto-generated) -->
                    <div class="col-md-3">
                        <div class="form-floating rex-floating-group">
                            <input type="text" class="form-control" id="taxCode" required 
                                   placeholder="TAX-001" maxlength="20">
                            <label for="taxCode"><i class="bi bi-hash me-2"></i>Tax Code <span class="text-danger">*</span></label>
                        </div>
                        <small class="text-muted mt-1 d-block">Unique identifier (auto-generated)</small>
                    </div>

                    <!-- Status -->
                    <div class="col-md-3">
                        <div class="form-floating rex-floating-group">
                            <select class="form-select" id="taxStatus">
                                <option value="Active" selected>Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                            <label for="taxStatus"><i class="bi bi-toggle-on me-2"></i>Status</label>
                        </div>
                    </div>

                    <!-- Tax Authority -->
                    <div class="col-md-4">
                        <div class="form-floating rex-floating-group">
                            <select class="form-select" id="taxAuthority" required>
                                <option value="" disabled selected>Select Authority</option>
                                <option value="FBR">FBR (Federal Board of Revenue)</option>
                                <option value="SRB">SRB (Sindh Revenue Board)</option>
                                <option value="PRA">PRA (Punjab Revenue Authority)</option>
                                <option value="KRA">KRA (Khyber Pakhtunkhwa Revenue Authority)</option>
                                <option value="BRA">BRA (Balochistan Revenue Authority)</option>
                                <option value="Internal">Internal (Company Policy)</option>
                            </select>
                            <label for="taxAuthority"><i class="bi bi-bank me-2"></i>Tax Authority <span class="text-danger">*</span></label>
                        </div>
                    </div>

                    <!-- Tax Jurisdiction -->
                    <div class="col-md-4">
                        <div class="form-floating rex-floating-group">
                            <select class="form-select" id="taxJurisdiction">
                                <option value="Federal" selected>Federal</option>
                                <option value="Provincial">Provincial</option>
                                <option value="Both">Both</option>
                            </select>
                            <label for="taxJurisdiction"><i class="bi bi-map me-2"></i>Tax Jurisdiction</label>
                        </div>
                    </div>

                    <!-- Priority -->
                    <div class="col-md-4">
                        <div class="form-floating rex-floating-group">
                            <input type="number" class="form-control" id="taxPriority" 
                                   placeholder="10" min="1" max="999" value="10">
                            <label for="taxPriority"><i class="bi bi-sort-down me-2"></i>Priority Level</label>
                        </div>
                        <small class="text-muted mt-1 d-block">Lower = applied first (if multiple taxes apply)</small>
                    </div>

                    <!-- Description -->
                    <div class="col-12">
                        <div class="form-floating rex-floating-group">
                            <textarea class="form-control" id="taxDescription" placeholder="Description" 
                                      style="height: 80px"></textarea>
                            <label for="taxDescription"><i class="bi bi-card-text me-2"></i>Description / Legal Reference</label>
                        </div>
                    </div>

                </div>
            </div>
        </div>

        <!-- ============================================ -->
        <!-- SECTION 2: TAX RATE & CALCULATION            -->
        <!-- ============================================ -->
        <div class="rex-form-card mb-4">
            <div class="rex-form-card-header">
                <h5 class="mb-0"><i class="bi bi-percent me-2"></i>Tax Rate & Calculation</h5>
            </div>
            <div class="rex-form-card-body">
                <div class="row g-3">
                    
                    <!-- Tax Rate -->
                    <div class="col-md-3">
                        <div class="form-floating rex-floating-group">
                            <div class="input-group">
                                <input type="number" class="form-control" id="taxRate" required 
                                       placeholder="18" min="0" max="100" step="0.01">
                                <span class="input-group-text rex-percent-symbol">%</span>
                            </div>
                            <label for="taxRate"><i class="bi bi-percent me-2"></i>Tax Rate <span class="text-danger">*</span></label>
                        </div>
                        <small class="text-muted mt-1 d-block">Enter percentage (e.g., 18 for 18%)</small>
                    </div>

                    <!-- Calculation Base -->
                    <div class="col-md-3">
                        <div class="form-floating rex-floating-group">
                            <select class="form-select" id="calculationBase" required>
                                <option value="subtotal" selected>On Subtotal (Before other taxes)</option>
                                <option value="grand_total">On Grand Total (After other taxes)</option>
                                <option value="base_freight">On Base Freight Only</option>
                                <option value="custom">Custom Base (Advanced)</option>
                            </select>
                            <label for="calculationBase"><i class="bi bi-calculator me-2"></i>Calculation Base <span class="text-danger">*</span></label>
                        </div>
                    </div>

                    <!-- Rounding -->
                    <div class="col-md-3">
                        <div class="form-floating rex-floating-group">
                            <select class="form-select" id="roundingType">
                                <option value="none" selected>No Rounding</option>
                                <option value="up">Round Up</option>
                                <option value="down">Round Down</option>
                                <option value="nearest">Round to Nearest Rupee</option>
                            </select>
                            <label for="roundingType"><i class="bi bi-arrow-left-right me-2"></i>Rounding Method</label>
                        </div>
                    </div>

                    <!-- Is Compound Tax -->
                    <div class="col-md-3">
                        <div class="rex-switch-group h-100">
                            <label class="rex-switch">
                                <input type="checkbox" id="isCompoundTax">
                                <span class="rex-switch-slider"></span>
                            </label>
                            <span class="rex-switch-label">Compound Tax<br><small class="text-muted">(Applied after other taxes)</small></span>
                        </div>
                    </div>

                </div>
            </div>
        </div>

        <!-- ============================================ -->
        <!-- SECTION 3: APPLICABILITY - PROVINCE          -->
        <!-- ============================================ -->
        <div class="rex-form-card mb-4">
            <div class="rex-form-card-header">
                <h5 class="mb-0"><i class="bi bi-geo-alt me-2"></i>Applicability: Province</h5>
                <small class="text-muted d-block mt-1">Select which provinces this tax applies to</small>
            </div>
            <div class="rex-form-card-body">
                <div class="row g-3">
                    <div class="col-12">
                        <div class="province-checkbox-grid">
                            <div class="province-item">
                                <input class="form-check-input province-check" type="checkbox" id="provSindh" value="Sindh" checked>
                                <label class="province-label" for="provSindh">
                                    <i class="bi bi-geo-alt-fill"></i>
                                    <span>Sindh</span>
                                    <small>SST applies here</small>
                                </label>
                            </div>
                            <div class="province-item">
                                <input class="form-check-input province-check" type="checkbox" id="provPunjab" value="Punjab" checked>
                                <label class="province-label" for="provPunjab">
                                    <i class="bi bi-geo-alt-fill"></i>
                                    <span>Punjab</span>
                                    <small>GST applies</small>
                                </label>
                            </div>
                            <div class="province-item">
                                <input class="form-check-input province-check" type="checkbox" id="provKPK" value="KPK" checked>
                                <label class="province-label" for="provKPK">
                                    <i class="bi bi-geo-alt-fill"></i>
                                    <span>Khyber Pakhtunkhwa</span>
                                    <small>GST applies</small>
                                </label>
                            </div>
                            <div class="province-item">
                                <input class="form-check-input province-check" type="checkbox" id="provBalochistan" value="Balochistan" checked>
                                <label class="province-label" for="provBalochistan">
                                    <i class="bi bi-geo-alt-fill"></i>
                                    <span>Balochistan</span>
                                    <small>GST applies</small>
                                </label>
                            </div>
                            <div class="province-item">
                                <input class="form-check-input province-check" type="checkbox" id="provIslamabad" value="Islamabad" checked>
                                <label class="province-label" for="provIslamabad">
                                    <i class="bi bi-geo-alt-fill"></i>
                                    <span>Islamabad</span>
                                    <small>GST applies</small>
                                </label>
                            </div>
                            <div class="province-item">
                                <input class="form-check-input province-check" type="checkbox" id="provGB" value="Gilgit-Baltistan" checked>
                                <label class="province-label" for="provGB">
                                    <i class="bi bi-geo-alt-fill"></i>
                                    <span>Gilgit-Baltistan</span>
                                    <small>GST applies</small>
                                </label>
                            </div>
                            <div class="province-item">
                                <input class="form-check-input province-check" type="checkbox" id="provAJK" value="AJK" checked>
                                <label class="province-label" for="provAJK">
                                    <i class="bi bi-geo-alt-fill"></i>
                                    <span>Azad Jammu & Kashmir</span>
                                    <small>GST applies</small>
                                </label>
                            </div>
                        </div>
                        <div class="mt-2">
                            <button type="button" class="btn btn-sm btn-outline-secondary" id="btnSelectAllProvinces">
                                <i class="bi bi-check-all me-1"></i> Select All
                            </button>
                            <button type="button" class="btn btn-sm btn-outline-secondary" id="btnDeselectAllProvinces">
                                <i class="bi bi-x-circle me-1"></i> Deselect All
                            </button>
                            <button type="button" class="btn btn-sm btn-outline-danger" id="btnSelectSindhOnly">
                                <i class="bi bi-geo-alt me-1"></i> Sindh Only (SST)
                            </button>
                            <button type="button" class="btn btn-sm btn-outline-primary" id="btnSelectExceptSindh">
                                <i class="bi bi-globe me-1"></i> All Except Sindh (GST)
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- ============================================ -->
        <!-- SECTION 4: APPLICABILITY - FILER STATUS      -->
        <!-- ============================================ -->
        <div class="rex-form-card mb-4">
            <div class="rex-form-card-header">
                <h5 class="mb-0"><i class="bi bi-person-check me-2"></i>Applicability: FBR Filer Status</h5>
                <small class="text-muted d-block mt-1">Select which filer categories this tax applies to</small>
            </div>
            <div class="rex-form-card-body">
                <div class="row g-3">
                    <div class="col-md-4">
                        <div class="filer-option-card">
                            <input class="form-check-input filer-check" type="checkbox" id="filerFiler" value="Filer" checked>
                            <label class="filer-label" for="filerFiler">
                                <i class="bi bi-check-circle-fill text-success"></i>
                                <strong>Filer</strong>
                                <small>Standard tax rate applies</small>
                            </label>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="filer-option-card">
                            <input class="form-check-input filer-check" type="checkbox" id="filerNonFiler" value="Non-Filer" checked>
                            <label class="filer-label" for="filerNonFiler">
                                <i class="bi bi-x-circle-fill text-warning"></i>
                                <strong>Non-Filer</strong>
                                <small>Higher WHT may apply</small>
                            </label>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="filer-option-card">
                            <input class="form-check-input filer-check" type="checkbox" id="filerExempt" value="Tax-Exempt">
                            <label class="filer-label" for="filerExempt">
                                <i class="bi bi-shield-check text-info"></i>
                                <strong>Tax-Exempt</strong>
                                <small>B2B with valid NTN</small>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- ============================================ -->
        <!-- SECTION 5: APPLICABILITY - CUSTOMER TYPE     -->
        <!-- ============================================ -->
        <div class="rex-form-card mb-4">
            <div class="rex-form-card-header">
                <h5 class="mb-0"><i class="bi bi-person-badge me-2"></i>Applicability: Customer Type</h5>
            </div>
            <div class="rex-form-card-body">
                <div class="row g-3">
                    <div class="col-md-4">
                        <div class="rex-checkbox-group">
                            <div class="form-check">
                                <input class="form-check-input customer-type-check" type="checkbox" id="custCash" value="Cash" checked>
                                <label class="form-check-label" for="custCash">Cash Customers</label>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="rex-checkbox-group">
                            <div class="form-check">
                                <input class="form-check-input customer-type-check" type="checkbox" id="custAccount" value="Account" checked>
                                <label class="form-check-label" for="custAccount">Account Customers</label>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="rex-checkbox-group">
                            <div class="form-check">
                                <input class="form-check-input customer-type-check" type="checkbox" id="custWalkin" value="Walk-in" checked>
                                <label class="form-check-label" for="custWalkin">Walk-in Customers</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- ============================================ -->
        <!-- SECTION 6: APPLICABILITY - SERVICE TYPE      -->
        <!-- ============================================ -->
        <div class="rex-form-card mb-4">
            <div class="rex-form-card-header">
                <h5 class="mb-0"><i class="bi bi-box-seam me-2"></i>Applicability: Service Type</h5>
            </div>
            <div class="rex-form-card-body">
                <div class="row g-3">
                    <div class="col-md-3">
                        <div class="rex-checkbox-group">
                            <div class="form-check">
                                <input class="form-check-input service-type-check" type="checkbox" id="svcDomestic" value="Domestic" checked>
                                <label class="form-check-label" for="svcDomestic">Domestic Shipments</label>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="rex-checkbox-group">
                            <div class="form-check">
                                <input class="form-check-input service-type-check" type="checkbox" id="svcInternational" value="International" checked>
                                <label class="form-check-label" for="svcInternational">International Shipments</label>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="rex-checkbox-group">
                            <div class="form-check">
                                <input class="form-check-input service-type-check" type="checkbox" id="svcDocument" value="Document" checked>
                                <label class="form-check-label" for="svcDocument">Documents</label>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="rex-checkbox-group">
                            <div class="form-check">
                                <input class="form-check-input service-type-check" type="checkbox" id="svcParcel" value="Parcel" checked>
                                <label class="form-check-label" for="svcParcel">Parcels</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- ============================================ -->
        <!-- SECTION 7: EFFECTIVE DATE RANGE              -->
        <!-- ============================================ -->
        <div class="rex-form-card mb-4">
            <div class="rex-form-card-header">
                <h5 class="mb-0"><i class="bi bi-calendar3 me-2"></i>Effective Date Range</h5>
                <small class="text-muted d-block mt-1">Define when this tax rate is valid (for historical accuracy)</small>
            </div>
            <div class="rex-form-card-body">
                <div class="row g-3">
                    <div class="col-md-4">
                        <div class="form-floating rex-floating-group">
                            <input type="date" class="form-control" id="effectiveFrom" required>
                            <label for="effectiveFrom"><i class="bi bi-calendar-check me-2"></i>Effective From <span class="text-danger">*</span></label>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="form-floating rex-floating-group">
                            <input type="date" class="form-control" id="effectiveTo">
                            <label for="effectiveTo"><i class="bi bi-calendar-x me-2"></i>Effective Until</label>
                        </div>
                        <small class="text-muted mt-1 d-block">Leave blank for ongoing/indefinite</small>
                    </div>
                    <div class="col-md-4">
                        <div class="form-floating rex-floating-group">
                            <input type="text" class="form-control" id="notificationRef" placeholder="Notification Reference">
                            <label for="notificationRef"><i class="bi bi-file-earmark-text me-2"></i>Govt. Notification Ref.</label>
                        </div>
                        <small class="text-muted mt-1 d-block">e.g., SRO 1234/2026</small>
                    </div>
                </div>
            </div>
        </div>

        <!-- ============================================ -->
        <!-- SECTION 8: DISPLAY & ACCOUNTING              -->
        <!-- ============================================ -->
        <div class="rex-form-card mb-4">
            <div class="rex-form-card-header">
                <h5 class="mb-0"><i class="bi bi-eye me-2"></i>Display & Accounting</h5>
            </div>
            <div class="rex-form-card-body">
                <div class="row g-3">
                    <div class="col-md-3"><div class="rex-switch-group"><label class="rex-switch"><input type="checkbox" id="showOnBooking" checked><span class="rex-switch-slider"></span></label><span class="rex-switch-label">Show on Booking</span></div></div>
                    <div class="col-md-3"><div class="rex-switch-group"><label class="rex-switch"><input type="checkbox" id="showOnInvoice" checked><span class="rex-switch-slider"></span></label><span class="rex-switch-label">Show on Invoice</span></div></div>
                    <div class="col-md-3"><div class="rex-switch-group"><label class="rex-switch"><input type="checkbox" id="showOnReceipt" checked><span class="rex-switch-slider"></span></label><span class="rex-switch-label">Show on Receipt</span></div></div>
                    <div class="col-md-3"><div class="rex-switch-group"><label class="rex-switch"><input type="checkbox" id="autoApply" checked><span class="rex-switch-slider"></span></label><span class="rex-switch-label">Auto-Apply in Booking</span></div></div>
                </div>
                <hr class="my-4">
                <div class="row g-3">
                    <div class="col-md-4">
                        <div class="form-floating rex-floating-group">
                            <input type="text" class="form-control" id="glAccountCode" placeholder="GL Code">
                            <label for="glAccountCode"><i class="bi bi-journal me-2"></i>GL Account Code</label>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="form-floating rex-floating-group">
                            <select class="form-select" id="taxCategory">
                                <option value="output" selected>Output Tax (Payable to Govt)</option>
                                <option value="input">Input Tax (Receivable from Govt)</option>
                                <option value="withholding">Withholding Tax</option>
                            </select>
                            <label for="taxCategory"><i class="bi bi-receipt me-2"></i>Tax Category</label>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="form-floating rex-floating-group">
                            <select class="form-select" id="reportingType">
                                <option value="monthly" selected>Monthly Return</option>
                                <option value="quarterly">Quarterly Return</option>
                                <option value="annual">Annual Return</option>
                            </select>
                            <label for="reportingType"><i class="bi bi-calendar-range me-2"></i>Reporting Frequency</label>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- ============================================ -->
        <!-- SECTION 9: INTERNAL NOTES                    -->
        <!-- ============================================ -->
        <div class="rex-form-card mb-4">
            <div class="rex-form-card-header">
                <h5 class="mb-0"><i class="bi bi-sticky me-2"></i>Internal Notes</h5>
            </div>
            <div class="rex-form-card-body">
                <div class="row g-3">
                    <div class="col-12">
                        <div class="form-floating rex-floating-group">
                            <textarea class="form-control" id="internalNotes" placeholder="Notes" style="height: 80px"></textarea>
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
            <button type="button" class="btn btn-outline-secondary" onclick="loadView('tax')">
                <i class="bi bi-x-circle me-1"></i> Cancel
            </button>
            <button type="submit" class="btn btn-rex-primary" id="btnSaveTax">
                <span class="btn-text"><i class="bi bi-check-circle me-1"></i> Save Tax Configuration</span>
                <span class="btn-loader d-none">
                    <span class="spinner-border spinner-border-sm me-2"></span> Saving...
                </span>
            </button>
        </div>

    </form>
</div>

<!-- SUCCESS MODAL -->
<div class="modal fade" id="taxSuccessModal" tabindex="-1" data-bs-backdrop="static">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow">
            <div class="modal-body text-center p-5">
                <div class="success-icon-wrapper mb-4"><i class="bi bi-check-circle-fill"></i></div>
                <h3 class="fw-bold mb-2">Tax Configuration Added!</h3>
                <p class="text-muted mb-1">New tax rule has been saved to the system.</p>
                <p class="fw-semibold text-danger mb-4" id="successTaxName">Tax: GST 18%</p>
                <div class="d-flex gap-2 justify-content-center">
                    <button type="button" class="btn btn-outline-secondary" id="btnAddAnotherTax">
                        <i class="bi bi-plus-circle me-1"></i> Add Another
                    </button>
                    <button type="button" class="btn btn-rex-primary" id="btnViewTaxList">
                        <i class="bi bi-list-ul me-1"></i> View All Taxes
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- ERROR MODAL -->
<div class="modal fade" id="taxErrorModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow">
            <div class="modal-header bg-danger text-white border-0">
                <h5 class="modal-title"><i class="bi bi-exclamation-triangle-fill me-2"></i>Error</h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body py-4">
                <p id="taxErrorMessage" class="mb-0 fs-5 text-center">Something went wrong.</p>
            </div>
            <div class="modal-footer border-0 justify-content-center">
                <button type="button" class="btn btn-secondary px-4" data-bs-dismiss="modal">Try Again</button>
            </div>
        </div>
    </div>
</div>