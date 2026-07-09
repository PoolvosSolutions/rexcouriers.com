<?php
// includes/view/legal/addtermsview.php
// 🔥 Add Terms & Conditions Form - Rexcouris
?>

<div class="container-fluid py-4 addterms-page">
    
    <!-- Page Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
            <h3 class="mb-1"><i class="bi bi-plus-circle text-danger me-2"></i>Add New Terms & Conditions</h3>
            <p class="text-muted mb-0 small">Create a new T&C template for booking receipts and consignment notes</p>
        </div>
        <button type="button" class="btn btn-outline-secondary" onclick="loadView('terms')">
            <i class="bi bi-arrow-left me-1"></i> Back to List
        </button>
    </div>

    <!-- 🔥 LEGAL NOTICE ALERT -->
    <div class="alert alert-warning border-0 shadow-sm mb-4" role="alert">
        <div class="d-flex align-items-start">
            <i class="bi bi-shield-exclamation-fill me-2 mt-1 text-warning"></i>
            <div>
                <strong class="d-block mb-1">Legal Document Notice</strong>
                <small class="text-muted">
                    Terms & Conditions are legally binding documents. Please ensure all content is reviewed by legal counsel before activation. 
                    Once a booking is made with a specific T&C version, that version is permanently linked to the booking for audit purposes.
                </small>
            </div>
        </div>
    </div>

    <!-- 🔥 MAIN FORM -->
    <form id="addTermsForm" novalidate>
        
        <!-- ============================================ -->
        <!-- SECTION 1: BASIC INFORMATION                 -->
        <!-- ============================================ -->
        <div class="rex-form-card mb-4">
            <div class="rex-form-card-header">
                <h5 class="mb-0"><i class="bi bi-info-circle me-2"></i>Basic Information</h5>
            </div>
            <div class="rex-form-card-body">
                <div class="row g-3">
                    
                    <!-- Title (Compulsory) -->
                    <div class="col-md-6">
                        <div class="form-floating rex-floating-group">
                            <input type="text" class="form-control" id="termsTitle" required 
                                   placeholder="T&C Title">
                            <label for="termsTitle"><i class="bi bi-card-heading me-2"></i>Title <span class="text-danger">*</span></label>
                            <div class="invalid-feedback">Title is required</div>
                        </div>
                        <small class="text-muted mt-1 d-block">e.g., "Standard Domestic T&C v2.0"</small>
                    </div>

                    <!-- Version (Auto-generated) -->
                    <div class="col-md-3">
                        <div class="form-floating rex-floating-group">
                            <input type="text" class="form-control" id="termsVersion" required 
                                   placeholder="v1.0" maxlength="20">
                            <label for="termsVersion"><i class="bi bi-hash me-2"></i>Version <span class="text-danger">*</span></label>
                        </div>
                        <small class="text-muted mt-1 d-block">Auto-generated (e.g., v1.0)</small>
                    </div>

                    <!-- Status -->
                    <div class="col-md-3">
                        <div class="form-floating rex-floating-group">
                            <select class="form-select" id="termsStatus">
                                <option value="Draft" selected>Draft</option>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                                <option value="Archived">Archived</option>
                            </select>
                            <label for="termsStatus"><i class="bi bi-toggle-on me-2"></i>Status</label>
                        </div>
                    </div>

                    <!-- Category -->
                    <div class="col-md-4">
                        <div class="form-floating rex-floating-group">
                            <select class="form-select" id="termsCategory" required>
                                <option value="" disabled selected>Select Category</option>
                                <option value="Domestic">Domestic Shipments</option>
                                <option value="International">International Shipments</option>
                                <option value="Carrier-Specific">Carrier-Specific</option>
                                <option value="Special">Special Services</option>
                                <option value="General">General (All Shipments)</option>
                            </select>
                            <label for="termsCategory"><i class="bi bi-folder me-2"></i>Category <span class="text-danger">*</span></label>
                        </div>
                    </div>

                    <!-- Priority -->
                    <div class="col-md-4">
                        <div class="form-floating rex-floating-group">
                            <input type="number" class="form-control" id="termsPriority" 
                                   placeholder="10" min="1" max="999" value="10">
                            <label for="termsPriority"><i class="bi bi-sort-down me-2"></i>Priority Level</label>
                        </div>
                        <small class="text-muted mt-1 d-block">Lower = shown first (if multiple T&C apply)</small>
                    </div>

                    <!-- Language -->
                    <div class="col-md-4">
                        <div class="form-floating rex-floating-group">
                            <select class="form-select" id="termsLanguage">
                                <option value="English" selected>English</option>
                                <option value="Urdu">Urdu</option>
                                <option value="Both">Both (English & Urdu)</option>
                            </select>
                            <label for="termsLanguage"><i class="bi bi-translate me-2"></i>Language</label>
                        </div>
                    </div>

                    <!-- Short Description -->
                    <div class="col-12">
                        <div class="form-floating rex-floating-group">
                            <textarea class="form-control" id="termsShortDesc" placeholder="Short Description" 
                                      style="height: 80px"></textarea>
                            <label for="termsShortDesc"><i class="bi bi-card-text me-2"></i>Short Description</label>
                        </div>
                        <small class="text-muted mt-1 d-block">Brief summary shown in T&C selection dropdown</small>
                    </div>

                </div>
            </div>
        </div>

        <!-- ============================================ -->
        <!-- SECTION 2: TERMS CONTENT (RICH TEXT EDITOR)  -->
        <!-- ============================================ -->
        <div class="rex-form-card mb-4">
            <div class="rex-form-card-header d-flex justify-content-between align-items-center">
                <h5 class="mb-0"><i class="bi bi-file-earmark-text me-2"></i>Terms & Conditions Content</h5>
                <div>
                    <button type="button" class="btn btn-sm btn-outline-secondary" id="btnPreviewTerms">
                        <i class="bi bi-eye me-1"></i> Preview
                    </button>
                    <button type="button" class="btn btn-sm btn-outline-primary" id="btnFullscreenEditor">
                        <i class="bi bi-arrows-fullscreen me-1"></i> Fullscreen
                    </button>
                </div>
            </div>
            <div class="rex-form-card-body">
                <div class="row g-3">
                    <div class="col-12">
                        <label class="form-label fw-semibold mb-2">
                            Full Terms & Conditions Text <span class="text-danger">*</span>
                        </label>
                        
                        <!-- Quill Editor Container -->
                        <div id="termsEditor" style="min-height: 400px;"></div>
                        
                        <small class="text-muted mt-2 d-block">
                            <i class="bi bi-info-circle me-1"></i>
                            Use the toolbar to format text, add lists, links, and tables. This content will be printed on receipts and displayed to customers.
                        </small>
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
                <small class="text-muted d-block mt-1">Define when this T&C should be shown/used</small>
            </div>
            <div class="rex-form-card-body">
                <div class="row g-3">
                    
                    <!-- Shipment Type -->
                    <div class="col-md-4">
                        <label class="form-label fw-semibold mb-2">
                            <i class="bi bi-box-seam me-1"></i>Shipment Type
                        </label>
                        <div class="rex-checkbox-group">
                            <div class="form-check">
                                <input class="form-check-input apply-shipment" type="checkbox" id="applyDocument" value="Document" checked>
                                <label class="form-check-label" for="applyDocument">Documents</label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input apply-shipment" type="checkbox" id="applyParcel" value="Parcel" checked>
                                <label class="form-check-label" for="applyParcel">Parcels</label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input apply-shipment" type="checkbox" id="applyCargo" value="Cargo">
                                <label class="form-check-label" for="applyCargo">Cargo/Freight</label>
                            </div>
                        </div>
                    </div>

                    <!-- Service Direction -->
                    <div class="col-md-4">
                        <label class="form-label fw-semibold mb-2">
                            <i class="bi bi-globe me-1"></i>Service Direction
                        </label>
                        <div class="rex-checkbox-group">
                            <div class="form-check">
                                <input class="form-check-input apply-direction" type="checkbox" id="applyDomestic" value="Domestic" checked>
                                <label class="form-check-label" for="applyDomestic">Domestic</label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input apply-direction" type="checkbox" id="applyInternational" value="International" checked>
                                <label class="form-check-label" for="applyInternational">International</label>
                            </div>
                        </div>
                    </div>

                    <!-- Customer Type -->
                    <div class="col-md-4">
                        <label class="form-label fw-semibold mb-2">
                            <i class="bi bi-person me-1"></i>Customer Type
                        </label>
                        <div class="rex-checkbox-group">
                            <div class="form-check">
                                <input class="form-check-input apply-customer" type="checkbox" id="applyCash" value="Cash" checked>
                                <label class="form-check-label" for="applyCash">Cash Customers</label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input apply-customer" type="checkbox" id="applyAccount" value="Account" checked>
                                <label class="form-check-label" for="applyAccount">Account Customers</label>
                            </div>
                        </div>
                    </div>

                    <!-- Carrier Specific (Optional) -->
                    <div class="col-md-6">
                        <div class="form-floating rex-floating-group">
                            <select class="form-select" id="carrierSpecific" multiple size="4">
                                <option value="">All Carriers (No restriction)</option>
                                <!-- Will be populated dynamically -->
                            </select>
                            <label for="carrierSpecific"><i class="bi bi-truck me-2"></i>Carrier-Specific (Optional)</label>
                        </div>
                        <small class="text-muted mt-1 d-block">Hold Ctrl/Cmd to select multiple. Leave empty for all carriers.</small>
                    </div>

                    <!-- Weight/Value Thresholds -->
                    <div class="col-md-3">
                        <div class="form-floating rex-floating-group">
                            <input type="number" class="form-control" id="minWeightThreshold" 
                                   placeholder="0" min="0" step="0.1">
                            <label for="minWeightThreshold"><i class="bi bi-speedometer me-2"></i>Min Weight (KG)</label>
                        </div>
                    </div>

                    <div class="col-md-3">
                        <div class="form-floating rex-floating-group">
                            <input type="number" class="form-control" id="minDeclaredValue" 
                                   placeholder="0" min="0" step="1">
                            <label for="minDeclaredValue"><i class="bi bi-cash-stack me-2"></i>Min Value (PKR)</label>
                        </div>
                    </div>

                </div>
            </div>
        </div>

        <!-- ============================================ -->
        <!-- SECTION 4: EFFECTIVE DATE & VERSION CONTROL  -->
        <!-- ============================================ -->
        <div class="rex-form-card mb-4">
            <div class="rex-form-card-header">
                <h5 class="mb-0"><i class="bi bi-calendar3 me-2"></i>Effective Date & Version Control</h5>
            </div>
            <div class="rex-form-card-body">
                <div class="row g-3">
                    
                    <!-- Effective From -->
                    <div class="col-md-4">
                        <div class="form-floating rex-floating-group">
                            <input type="date" class="form-control" id="effectiveFrom" required>
                            <label for="effectiveFrom"><i class="bi bi-calendar-check me-2"></i>Effective From <span class="text-danger">*</span></label>
                        </div>
                    </div>

                    <!-- Effective Until -->
                    <div class="col-md-4">
                        <div class="form-floating rex-floating-group">
                            <input type="date" class="form-control" id="effectiveTo">
                            <label for="effectiveTo"><i class="bi bi-calendar-x me-2"></i>Effective Until</label>
                        </div>
                        <small class="text-muted mt-1 d-block">Leave blank for ongoing</small>
                    </div>

                    <!-- Supersedes (Previous Version) -->
                    <div class="col-md-4">
                        <div class="form-floating rex-floating-group">
                            <select class="form-select" id="supersedesVersion">
                                <option value="">None (New T&C)</option>
                                <!-- Will be populated dynamically -->
                            </select>
                            <label for="supersedesVersion"><i class="bi bi-arrow-repeat me-2"></i>Supersedes Version</label>
                        </div>
                        <small class="text-muted mt-1 d-block">Select previous version this replaces (if any)</small>
                    </div>

                    <!-- Approval Status -->
                    <div class="col-md-4">
                        <div class="form-floating rex-floating-group">
                            <select class="form-select" id="approvalStatus">
                                <option value="Pending" selected>Pending Review</option>
                                <option value="Approved">Approved by Legal</option>
                                <option value="Rejected">Rejected</option>
                            </select>
                            <label for="approvalStatus"><i class="bi bi-check2-square me-2"></i>Legal Approval</label>
                        </div>
                    </div>

                    <!-- Approved By -->
                    <div class="col-md-4">
                        <div class="form-floating rex-floating-group">
                            <input type="text" class="form-control" id="approvedBy" placeholder="Legal Team / Name">
                            <label for="approvedBy"><i class="bi bi-person-check me-2"></i>Approved By</label>
                        </div>
                    </div>

                    <!-- Legal Reference -->
                    <div class="col-md-4">
                        <div class="form-floating rex-floating-group">
                            <input type="text" class="form-control" id="legalReference" placeholder="e.g., Contract Act 1872">
                            <label for="legalReference"><i class="bi bi-book me-2"></i>Legal Reference</label>
                        </div>
                    </div>

                </div>
            </div>
        </div>

        <!-- ============================================ -->
        <!-- SECTION 5: DISPLAY SETTINGS                  -->
        <!-- ============================================ -->
        <div class="rex-form-card mb-4">
            <div class="rex-form-card-header">
                <h5 class="mb-0"><i class="bi bi-eye me-2"></i>Display & Print Settings</h5>
            </div>
            <div class="rex-form-card-body">
                <div class="row g-3">
                    <div class="col-md-3"><div class="rex-switch-group"><label class="rex-switch"><input type="checkbox" id="showOnBooking" checked><span class="rex-switch-slider"></span></label><span class="rex-switch-label">Show on Booking Form</span></div></div>
                    <div class="col-md-3"><div class="rex-switch-group"><label class="rex-switch"><input type="checkbox" id="printOnReceipt" checked><span class="rex-switch-slider"></span></label><span class="rex-switch-label">Print on Receipt</span></div></div>
                    <div class="col-md-3"><div class="rex-switch-group"><label class="rex-switch"><input type="checkbox" id="printOnInvoice" checked><span class="rex-switch-slider"></span></label><span class="rex-switch-label">Print on Invoice</span></div></div>
                    <div class="col-md-3"><div class="rex-switch-group"><label class="rex-switch"><input type="checkbox" id="showOnWebsite"><span class="rex-switch-slider"></span></label><span class="rex-switch-label">Show on Website</span></div></div>
                </div>
                <hr class="my-4">
                <div class="row g-3">
                    <div class="col-md-6">
                        <div class="form-floating rex-floating-group">
                            <input type="text" class="form-control" id="customHeader" placeholder="Custom Header Text">
                            <label for="customHeader"><i class="bi bi-textarea-t me-2"></i>Custom Header (Optional)</label>
                        </div>
                        <small class="text-muted mt-1 d-block">Shown above T&C content (e.g., "IMPORTANT: Please read carefully")</small>
                    </div>
                    <div class="col-md-6">
                        <div class="form-floating rex-floating-group">
                            <input type="text" class="form-control" id="customFooter" placeholder="Custom Footer Text">
                            <label for="customFooter"><i class="bi bi-textarea-bt me-2"></i>Custom Footer (Optional)</label>
                        </div>
                        <small class="text-muted mt-1 d-block">Shown below T&C content (e.g., "By signing, you agree...")</small>
                    </div>
                </div>
            </div>
        </div>

        <!-- ============================================ -->
        <!-- SECTION 6: INTERNAL NOTES                    -->
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
                            <label for="internalNotes"><i class="bi bi-pencil me-2"></i>Notes (Internal use only - not shown to customers)</label>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- ============================================ -->
        <!-- FORM ACTIONS                                 -->
        <!-- ============================================ -->
        <div class="rex-form-actions">
            <button type="button" class="btn btn-outline-secondary" onclick="loadView('terms')">
                <i class="bi bi-x-circle me-1"></i> Cancel
            </button>
            <button type="button" class="btn btn-outline-primary" id="btnSaveDraft">
                <i class="bi bi-save me-1"></i> Save as Draft
            </button>
            <button type="submit" class="btn btn-rex-primary" id="btnSaveTerms">
                <span class="btn-text"><i class="bi bi-check-circle me-1"></i> Save & Activate</span>
                <span class="btn-loader d-none">
                    <span class="spinner-border spinner-border-sm me-2"></span> Saving...
                </span>
            </button>
        </div>

    </form>
</div>

<!-- ============================================ -->
<!-- 🔥 PREVIEW MODAL                             -->
<!-- ============================================ -->
<div class="modal fade" id="termsPreviewModal" tabindex="-1">
    <div class="modal-dialog modal-xl modal-dialog-scrollable">
        <div class="modal-content">
            <div class="modal-header bg-primary text-white">
                <h5 class="modal-title"><i class="bi bi-eye me-2"></i>Terms & Conditions Preview</h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body p-4">
                <div class="preview-container">
                    <div class="preview-header text-center mb-4">
                        <h2 id="previewTitle" class="mb-2">Terms Title</h2>
                        <p class="text-muted" id="previewVersion">Version: v1.0</p>
                        <hr>
                    </div>
                    <div class="preview-custom-header" id="previewCustomHeader"></div>
                    <div class="preview-content" id="previewContent">
                        <!-- T&C content will be rendered here -->
                    </div>
                    <div class="preview-custom-footer" id="previewCustomFooter"></div>
                    <hr class="my-4">
                    <div class="preview-footer text-center text-muted small">
                        <p class="mb-1">This is a preview of how the T&C will appear to customers.</p>
                        <p class="mb-0">Actual printing may vary based on receipt/invoice template.</p>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close Preview</button>
                <button type="button" class="btn btn-primary" id="btnPrintPreview">
                    <i class="bi bi-printer me-1"></i> Print Preview
                </button>
            </div>
        </div>
    </div>
</div>

<!-- SUCCESS MODAL -->
<div class="modal fade" id="termsSuccessModal" tabindex="-1" data-bs-backdrop="static">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow">
            <div class="modal-body text-center p-5">
                <div class="success-icon-wrapper mb-4"><i class="bi bi-check-circle-fill"></i></div>
                <h3 class="fw-bold mb-2">Terms & Conditions Saved!</h3>
                <p class="text-muted mb-1" id="successMessage">T&C has been saved successfully.</p>
                <p class="fw-semibold text-danger mb-4" id="successTermsTitle">Title: Standard T&C v1.0</p>
                <div class="d-flex gap-2 justify-content-center">
                    <button type="button" class="btn btn-outline-secondary" id="btnAddAnotherTerms">
                        <i class="bi bi-plus-circle me-1"></i> Add Another
                    </button>
                    <button type="button" class="btn btn-rex-primary" id="btnViewTermsList">
                        <i class="bi bi-list-ul me-1"></i> View All T&C
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- ERROR MODAL -->
<div class="modal fade" id="termsErrorModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow">
            <div class="modal-header bg-danger text-white border-0">
                <h5 class="modal-title"><i class="bi bi-exclamation-triangle-fill me-2"></i>Error</h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body py-4">
                <p id="termsErrorMessage" class="mb-0 fs-5 text-center">Something went wrong.</p>
            </div>
            <div class="modal-footer border-0 justify-content-center">
                <button type="button" class="btn btn-secondary px-4" data-bs-dismiss="modal">Try Again</button>
            </div>
        </div>
    </div>
</div>


