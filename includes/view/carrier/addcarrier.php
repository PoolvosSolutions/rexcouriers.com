<?php
// includes/view/carrier/addcarrier.php
// 🔥 Add Carrier Partner Form - Rexcouris
?>

<div class="container-fluid py-4 addcarrier-page">
    
    <!-- Page Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
            <h3 class="mb-1"><i class="bi bi-building-add text-danger me-2"></i>Add New Carrier Partner</h3>
            <p class="text-muted mb-0 small">Register a new courier partner (DHL, Skynet, TCS, LCS, etc.)</p>
        </div>
        <button type="button" class="btn btn-outline-secondary" onclick="loadView('carrier')">
            <i class="bi bi-arrow-left me-1"></i> Back to List
        </button>
    </div>

    <!-- 🔥 MAIN FORM -->
    <form id="addCarrierForm" novalidate>
        
        <!-- ============================================ -->
        <!-- SECTION 1: BASIC INFORMATION                 -->
        <!-- ============================================ -->
        <div class="rex-form-card mb-4">
            <div class="rex-form-card-header">
                <h5 class="mb-0"><i class="bi bi-info-circle me-2"></i>Basic Information</h5>
            </div>
            <div class="rex-form-card-body">
                <div class="row g-3">
                    
                    <!-- Carrier Name (Compulsory) -->
                    <div class="col-md-6">
                        <div class="form-floating rex-floating-group">
                            <input type="text" class="form-control" id="carrierName" required 
                                   placeholder="Carrier Name">
                            <label for="carrierName"><i class="bi bi-building me-2"></i>Carrier Name <span class="text-danger">*</span></label>
                            <div class="invalid-feedback">Carrier name is required</div>
                        </div>
                    </div>

                    <!-- Carrier Code (Short Code) -->
                    <div class="col-md-3">
                        <div class="form-floating rex-floating-group">
                            <input type="text" class="form-control" id="carrierCode" required 
                                   placeholder="DHL" maxlength="10">
                            <label for="carrierCode"><i class="bi bi-hash me-2"></i>Carrier Code <span class="text-danger">*</span></label>
                            <div class="invalid-feedback">Carrier code is required</div>
                        </div>
                        <small class="text-muted mt-1 d-block">Short code (e.g., DHL, TCS, SKY)</small>
                    </div>

                    <!-- Carrier Type -->
                    <div class="col-md-3">
                        <div class="form-floating rex-floating-group">
                            <select class="form-select" id="carrierType" required>
                                <option value="" disabled selected>Select Type</option>
                                <option value="International">International</option>
                                <option value="Domestic">Domestic</option>
                                <option value="Both">Both (International & Domestic)</option>
                            </select>
                            <label for="carrierType"><i class="bi bi-globe me-2"></i>Service Type <span class="text-danger">*</span></label>
                        </div>
                    </div>

                    <!-- Status -->
                    <div class="col-md-4">
                        <div class="form-floating rex-floating-group">
                            <select class="form-select" id="carrierStatus">
                                <option value="Active" selected>Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                            <label for="carrierStatus"><i class="bi bi-toggle-on me-2"></i>Status</label>
                        </div>
                    </div>

                    <!-- Priority/Ranking -->
                    <div class="col-md-4">
                        <div class="form-floating rex-floating-group">
                            <select class="form-select" id="carrierPriority">
                                <option value="1">1 - Highest Priority</option>
                                <option value="2">2 - High Priority</option>
                                <option value="3" selected>3 - Medium Priority</option>
                                <option value="4">4 - Low Priority</option>
                                <option value="5">5 - Lowest Priority</option>
                            </select>
                            <label for="carrierPriority"><i class="bi bi-star me-2"></i>Priority Level</label>
                        </div>
                        <small class="text-muted mt-1 d-block">Used for auto-selecting carrier in booking</small>
                    </div>

                    <!-- Website -->
                    <div class="col-md-4">
                        <div class="form-floating rex-floating-group">
                            <input type="url" class="form-control" id="carrierWebsite" 
                                   placeholder="https://www.example.com">
                            <label for="carrierWebsite"><i class="bi bi-globe2 me-2"></i>Website</label>
                        </div>
                    </div>

                </div>
            </div>
        </div>

        <!-- ============================================ -->
        <!-- SECTION 2: CONTACT INFORMATION               -->
        <!-- ============================================ -->
        <div class="rex-form-card mb-4">
            <div class="rex-form-card-header">
                <h5 class="mb-0"><i class="bi bi-telephone me-2"></i>Contact Information</h5>
            </div>
            <div class="rex-form-card-body">
                <div class="row g-3">
                    
                    <!-- Primary Contact Person -->
                    <div class="col-md-6">
                        <div class="form-floating rex-floating-group">
                            <input type="text" class="form-control" id="contactPerson" required 
                                   placeholder="Contact Person">
                            <label for="contactPerson"><i class="bi bi-person me-2"></i>Primary Contact Person <span class="text-danger">*</span></label>
                        </div>
                    </div>

                    <!-- Designation -->
                    <div class="col-md-6">
                        <div class="form-floating rex-floating-group">
                            <input type="text" class="form-control" id="contactDesignation" 
                                   placeholder="Designation">
                            <label for="contactDesignation"><i class="bi bi-briefcase me-2"></i>Designation</label>
                        </div>
                    </div>

                    <!-- Contact Number -->
                    <div class="col-md-4">
                        <div class="form-floating rex-floating-group">
                            <div class="input-group">
                                <span class="input-group-text rex-dialing-code">+92</span>
                                <input type="tel" class="form-control" id="contactNumber" required 
                                       placeholder="3001234567" maxlength="10">
                            </div>
                            <label for="contactNumber"><i class="bi bi-phone me-2"></i>Contact Number <span class="text-danger">*</span></label>
                        </div>
                    </div>

                    <!-- Email -->
                    <div class="col-md-4">
                        <div class="form-floating rex-floating-group">
                            <input type="email" class="form-control" id="contactEmail" 
                                   placeholder="email@example.com">
                            <label for="contactEmail"><i class="bi bi-envelope me-2"></i>Email Address</label>
                        </div>
                    </div>

                    <!-- WhatsApp Number -->
                    <div class="col-md-4">
                        <div class="form-floating rex-floating-group">
                            <div class="input-group">
                                <span class="input-group-text rex-dialing-code">+92</span>
                                <input type="tel" class="form-control" id="whatsappNumber" 
                                       placeholder="3001234567" maxlength="10">
                            </div>
                            <label for="whatsappNumber"><i class="bi bi-whatsapp me-2"></i>WhatsApp Number</label>
                        </div>
                    </div>

                    <!-- Support/Helpdesk Number -->
                    <div class="col-md-6">
                        <div class="form-floating rex-floating-group">
                            <input type="text" class="form-control" id="supportNumber" 
                                   placeholder="Support/Helpdesk Number">
                            <label for="supportNumber"><i class="bi bi-headset me-2"></i>Support/Helpdesk Number</label>
                        </div>
                    </div>

                    <!-- Support Email -->
                    <div class="col-md-6">
                        <div class="form-floating rex-floating-group">
                            <input type="email" class="form-control" id="supportEmail" 
                                   placeholder="support@example.com">
                            <label for="supportEmail"><i class="bi bi-envelope-check me-2"></i>Support Email</label>
                        </div>
                    </div>

                </div>
            </div>
        </div>

        <!-- ============================================ -->
        <!-- SECTION 3: BUSINESS ADDRESS                  -->
        <!-- ============================================ -->
        <div class="rex-form-card mb-4">
            <div class="rex-form-card-header">
                <h5 class="mb-0"><i class="bi bi-geo-alt me-2"></i>Head Office Address</h5>
            </div>
            <div class="rex-form-card-body">
                <div class="row g-3">
                    
                    <!-- Address -->
                    <div class="col-12">
                        <div class="form-floating rex-floating-group">
                            <textarea class="form-control" id="address" placeholder="Address" 
                                      style="height: 80px"></textarea>
                            <label for="address"><i class="bi bi-house me-2"></i>Street Address</label>
                        </div>
                    </div>

                    <!-- City -->
                    <div class="col-md-4">
                        <div class="form-floating rex-floating-group">
                            <input type="text" class="form-control" id="city" value="Karachi" 
                                   placeholder="City">
                            <label for="city"><i class="bi bi-building me-2"></i>City</label>
                        </div>
                    </div>

                    <!-- State -->
                    <div class="col-md-4">
                        <div class="form-floating rex-floating-group">
                            <input type="text" class="form-control" id="state" value="Sindh" 
                                   placeholder="State">
                            <label for="state"><i class="bi bi-map me-2"></i>State/Province</label>
                        </div>
                    </div>

                    <!-- Country -->
                    <div class="col-md-4">
                        <div class="form-floating rex-floating-group">
                            <input type="text" class="form-control" id="country" value="Pakistan" 
                                   placeholder="Country">
                            <label for="country"><i class="bi bi-globe me-2"></i>Country</label>
                        </div>
                    </div>

                </div>
            </div>
        </div>

        <!-- ============================================ -->
        <!-- SECTION 4: ACCOUNT & CONTRACT DETAILS        -->
        <!-- ============================================ -->
        <div class="rex-form-card mb-4">
            <div class="rex-form-card-header">
                <h5 class="mb-0"><i class="bi bi-file-earmark-text me-2"></i>Account & Contract Details</h5>
            </div>
            <div class="rex-form-card-body">
                <div class="row g-3">
                    
                    <!-- Account Number -->
                    <div class="col-md-4">
                        <div class="form-floating rex-floating-group">
                            <input type="text" class="form-control" id="accountNumber" 
                                   placeholder="Account Number">
                            <label for="accountNumber"><i class="bi bi-hash me-2"></i>Account Number</label>
                        </div>
                        <small class="text-muted mt-1 d-block">Your account number with this carrier</small>
                    </div>

                    <!-- Payment Terms -->
                    <div class="col-md-4">
                        <div class="form-floating rex-floating-group">
                            <select class="form-select" id="paymentTerms">
                                <option value="Prepaid" selected>Prepaid</option>
                                <option value="Postpaid">Postpaid</option>
                                <option value="COD">Cash on Delivery (COD)</option>
                            </select>
                            <label for="paymentTerms"><i class="bi bi-credit-card me-2"></i>Payment Terms</label>
                        </div>
                    </div>

                    <!-- Billing Cycle -->
                    <div class="col-md-4">
                        <div class="form-floating rex-floating-group">
                            <select class="form-select" id="billingCycle">
                                <option value="Weekly">Weekly</option>
                                <option value="Bi-Weekly">Bi-Weekly</option>
                                <option value="Monthly" selected>Monthly</option>
                                <option value="Quarterly">Quarterly</option>
                            </select>
                            <label for="billingCycle"><i class="bi bi-calendar3 me-2"></i>Billing Cycle</label>
                        </div>
                    </div>

                    <!-- Contract Start Date -->
                    <div class="col-md-4">
                        <div class="form-floating rex-floating-group">
                            <input type="date" class="form-control" id="contractStartDate">
                            <label for="contractStartDate"><i class="bi bi-calendar-check me-2"></i>Contract Start Date</label>
                        </div>
                    </div>

                    <!-- Contract End Date -->
                    <div class="col-md-4">
                        <div class="form-floating rex-floating-group">
                            <input type="date" class="form-control" id="contractEndDate">
                            <label for="contractEndDate"><i class="bi bi-calendar-x me-2"></i>Contract End Date</label>
                        </div>
                    </div>

                    <!-- Credit Limit -->
                    <div class="col-md-4">
                        <div class="form-floating rex-floating-group">
                            <input type="number" class="form-control" id="creditLimit" 
                                   placeholder="0" min="0">
                            <label for="creditLimit"><i class="bi bi-wallet2 me-2"></i>Credit Limit (PKR)</label>
                        </div>
                    </div>

                </div>
            </div>
        </div>

        <!-- ============================================ -->
        <!-- SECTION 5: API & INTEGRATION (Optional)      -->
        <!-- ============================================ -->
        <div class="rex-form-card mb-4">
            <div class="rex-form-card-header">
                <h5 class="mb-0"><i class="bi bi-code-slash me-2"></i>API & Integration <span class="badge bg-warning text-dark ms-2">Optional - For Future Use</span></h5>
            </div>
            <div class="rex-form-card-body">
                <div class="row g-3">
                    
                    <!-- API Endpoint -->
                    <div class="col-md-6">
                        <div class="form-floating rex-floating-group">
                            <input type="url" class="form-control" id="apiEndpoint" 
                                   placeholder="https://api.example.com">
                            <label for="apiEndpoint"><i class="bi bi-link-45deg me-2"></i>API Endpoint URL</label>
                        </div>
                    </div>

                    <!-- API Key/Username -->
                    <div class="col-md-3">
                        <div class="form-floating rex-floating-group">
                            <input type="text" class="form-control" id="apiKey" 
                                   placeholder="API Key">
                            <label for="apiKey"><i class="bi bi-key me-2"></i>API Key/Username</label>
                        </div>
                    </div>

                    <!-- API Password/Token -->
                    <div class="col-md-3">
                        <div class="form-floating rex-floating-group">
                            <input type="password" class="form-control" id="apiPassword" 
                                   placeholder="API Password">
                            <label for="apiPassword"><i class="bi bi-shield-lock me-2"></i>API Password/Token</label>
                        </div>
                    </div>

                    <!-- Tracking URL Pattern -->
                    <div class="col-12">
                        <div class="form-floating rex-floating-group">
                            <input type="text" class="form-control" id="trackingUrlPattern" 
                                   placeholder="https://www.example.com/track?awb={trackingNumber}">
                            <label for="trackingUrlPattern"><i class="bi bi-link-45deg me-2"></i>Tracking URL Pattern</label>
                        </div>
                        <small class="text-muted mt-1 d-block">Use <code>{trackingNumber}</code> as placeholder (e.g., https://www.dhl.com/track?awb={trackingNumber})</small>
                    </div>

                </div>
            </div>
        </div>

        <!-- ============================================ -->
        <!-- SECTION 6: SERVICE COVERAGE                  -->
        <!-- ============================================ -->
        <div class="rex-form-card mb-4">
            <div class="rex-form-card-header">
                <h5 class="mb-0"><i class="bi bi-check2-square me-2"></i>Service Coverage</h5>
            </div>
            <div class="rex-form-card-body">
                <div class="row g-3">
                    
                    <!-- Domestic Services -->
                    <div class="col-md-6">
                        <label class="form-label fw-semibold mb-3">
                            <i class="bi bi-truck me-1"></i>Domestic Services
                        </label>
                        <div class="service-checkboxes">
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" id="domSameDay" value="Same Day">
                                <label class="form-check-label" for="domSameDay">Same Day Delivery</label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" id="domNextDay" value="Next Day">
                                <label class="form-check-label" for="domNextDay">Next Day Delivery</label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" id="dom2Days" value="2 Days">
                                <label class="form-check-label" for="dom2Days">2 Days Delivery</label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" id="dom3Days" value="3-5 Days">
                                <label class="form-check-label" for="dom3Days">3-5 Days Delivery</label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" id="domCOD" value="COD Available">
                                <label class="form-check-label" for="domCOD">COD Available</label>
                            </div>
                        </div>
                    </div>

                    <!-- International Services -->
                    <div class="col-md-6">
                        <label class="form-label fw-semibold mb-3">
                            <i class="bi bi-globe-americas me-1"></i>International Services
                        </label>
                        <div class="service-checkboxes">
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" id="intExpress" value="Express">
                                <label class="form-check-label" for="intExpress">Express (2-3 Days)</label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" id="intEconomy" value="Economy">
                                <label class="form-check-label" for="intEconomy">Economy (5-7 Days)</label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" id="intStandard" value="Standard">
                                <label class="form-check-label" for="intStandard">Standard (7-14 Days)</label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" id="intFreight" value="Freight">
                                <label class="form-check-label" for="intFreight">Freight/Cargo</label>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>

        <!-- ============================================ -->
        <!-- SECTION 7: DOCUMENT UPLOADS                  -->
        <!-- ============================================ -->
        <div class="rex-form-card mb-4">
            <div class="rex-form-card-header">
                <h5 class="mb-0"><i class="bi bi-cloud-upload me-2"></i>Document Uploads</h5>
            </div>
            <div class="rex-form-card-body">
                <div class="row g-3">
                    
                    <!-- Carrier Logo Upload -->
                    <div class="col-md-6">
                        <label class="form-label fw-semibold">
                            <i class="bi bi-image me-1"></i>Carrier Logo 
                            <small class="text-muted">(JPG or PNG - Max 2MB)</small>
                        </label>
                        <div class="rex-upload-area" id="logoUploadArea">
                            <input type="file" class="d-none" id="logoFile" accept=".jpg,.jpeg,.png">
                            <div class="upload-placeholder" id="logoPlaceholder">
                                <i class="bi bi-cloud-arrow-up"></i>
                                <p class="mb-0">Click to upload logo</p>
                                <small>JPG, PNG</small>
                            </div>
                            <div class="upload-preview d-none" id="logoPreview">
                                <i class="bi bi-file-earmark-check text-success"></i>
                                <span class="file-name"></span>
                                <button type="button" class="btn-remove" id="logoRemove">
                                    <i class="bi bi-x"></i>
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Agreement/Contract Upload -->
                    <div class="col-md-6">
                        <label class="form-label fw-semibold">
                            <i class="bi bi-file-earmark-pdf me-1"></i>Agreement/Contract Document 
                            <small class="text-muted">(PDF - Max 10MB)</small>
                        </label>
                        <div class="rex-upload-area" id="agreementUploadArea">
                            <input type="file" class="d-none" id="agreementFile" accept=".pdf">
                            <div class="upload-placeholder" id="agreementPlaceholder">
                                <i class="bi bi-cloud-arrow-up"></i>
                                <p class="mb-0">Click to upload agreement</p>
                                <small>PDF only</small>
                            </div>
                            <div class="upload-preview d-none" id="agreementPreview">
                                <i class="bi bi-file-earmark-check text-success"></i>
                                <span class="file-name"></span>
                                <button type="button" class="btn-remove" id="agreementRemove">
                                    <i class="bi bi-x"></i>
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>

        <!-- ============================================ -->
        <!-- SECTION 8: ADDITIONAL NOTES                  -->
        <!-- ============================================ -->
        <div class="rex-form-card mb-4">
            <div class="rex-form-card-header">
                <h5 class="mb-0"><i class="bi bi-sticky me-2"></i>Additional Notes</h5>
            </div>
            <div class="rex-form-card-body">
                <div class="row g-3">
                    <div class="col-12">
                        <div class="form-floating rex-floating-group">
                            <textarea class="form-control" id="notes" placeholder="Notes" 
                                      style="height: 100px"></textarea>
                            <label for="notes"><i class="bi bi-pencil me-2"></i>Notes / Remarks</label>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- ============================================ -->
        <!-- FORM ACTIONS                                 -->
        <!-- ============================================ -->
        <div class="rex-form-actions">
            <button type="button" class="btn btn-outline-secondary" onclick="loadView('carrier')">
                <i class="bi bi-x-circle me-1"></i> Cancel
            </button>
            <button type="submit" class="btn btn-rex-primary" id="btnSaveCarrier">
                <span class="btn-text"><i class="bi bi-check-circle me-1"></i> Save Carrier Partner</span>
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
<div class="modal fade" id="carrierSuccessModal" tabindex="-1" data-bs-backdrop="static">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow">
            <div class="modal-body text-center p-5">
                <div class="success-icon-wrapper mb-4">
                    <i class="bi bi-check-circle-fill"></i>
                </div>
                <h3 class="fw-bold mb-2">Carrier Partner Added!</h3>
                <p class="text-muted mb-1">New carrier partner has been successfully registered.</p>
                <p class="fw-semibold text-danger mb-4" id="successCarrierName">Carrier: DHL</p>
                <div class="d-flex gap-2 justify-content-center">
                    <button type="button" class="btn btn-outline-secondary" id="btnAddAnother">
                        <i class="bi bi-plus-circle me-1"></i> Add Another
                    </button>
                    <button type="button" class="btn btn-rex-primary" id="btnViewList">
                        <i class="bi bi-list-ul me-1"></i> View All Carriers
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- ============================================ -->
<!-- 🔥 ERROR MODAL                               -->
<!-- ============================================ -->
<div class="modal fade" id="carrierErrorModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow">
            <div class="modal-header bg-danger text-white border-0">
                <h5 class="modal-title"><i class="bi bi-exclamation-triangle-fill me-2"></i>Error</h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body py-4">
                <p id="carrierErrorMessage" class="mb-0 fs-5 text-center">Something went wrong.</p>
            </div>
            <div class="modal-footer border-0 justify-content-center">
                <button type="button" class="btn btn-secondary px-4" data-bs-dismiss="modal">Try Again</button>
            </div>
        </div>
    </div>
</div>