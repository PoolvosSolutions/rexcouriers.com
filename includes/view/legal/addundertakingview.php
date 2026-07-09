<?php
// includes/view/legal/addundertakingview.php
// 🔥 Add Undertaking Form - Rexcouris
?>

<div class="container-fluid py-4 addundertaking-page">
    
    <!-- Page Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
            <h3 class="mb-1"><i class="bi bi-plus-circle text-danger me-2"></i>Add New Undertaking</h3>
            <p class="text-muted mb-0 small">Create a legally binding declaration for specific shipment scenarios</p>
        </div>
        <button type="button" class="btn btn-outline-secondary" onclick="loadView('undertaking')">
            <i class="bi bi-arrow-left me-1"></i> Back to List
        </button>
    </div>

    <!-- 🔥 LEGAL NOTICE ALERT -->
    <div class="alert alert-warning border-0 shadow-sm mb-4" role="alert">
        <div class="d-flex align-items-start">
            <i class="bi bi-shield-exclamation-fill me-2 mt-1 text-warning"></i>
            <div>
                <strong class="d-block mb-1">Legal Declaration Notice</strong>
                <small class="text-muted">
                    Undertakings are legally binding declarations that must be signed/acknowledged by customers or staff 
                    for specific shipment types (e.g., high-value items, international shipments, fragile goods). 
                    Each undertaking is permanently linked to the booking for audit and legal purposes.
                </small>
            </div>
        </div>
    </div>

    <!-- 🔥 MAIN FORM -->
    <form id="addUndertakingForm" novalidate>
        
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
                            <input type="text" class="form-control" id="undertakingTitle" required 
                                   placeholder="Undertaking Title">
                            <label for="undertakingTitle"><i class="bi bi-card-heading me-2"></i>Title <span class="text-danger">*</span></label>
                            <div class="invalid-feedback">Title is required</div>
                        </div>
                        <small class="text-muted mt-1 d-block">e.g., "High-Value Item Declaration", "Prohibited Items Undertaking"</small>
                    </div>

                    <!-- Undertaking Code (Auto-generated) -->
                    <div class="col-md-3">
                        <div class="form-floating rex-floating-group">
                            <input type="text" class="form-control" id="undertakingCode" required 
                                   placeholder="UND-001" maxlength="20">
                            <label for="undertakingCode"><i class="bi bi-hash me-2"></i>Code <span class="text-danger">*</span></label>
                        </div>
                        <small class="text-muted mt-1 d-block">Unique identifier (auto-generated)</small>
                    </div>

                    <!-- Status -->
                    <div class="col-md-3">
                        <div class="form-floating rex-floating-group">
                            <select class="form-select" id="undertakingStatus">
                                <option value="Draft" selected>Draft</option>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                                <option value="Archived">Archived</option>
                            </select>
                            <label for="undertakingStatus"><i class="bi bi-toggle-on me-2"></i>Status</label>
                        </div>
                    </div>

                    <!-- Undertaking Type -->
                    <div class="col-md-4">
                        <div class="form-floating rex-floating-group">
                            <select class="form-select" id="undertakingType" required>
                                <option value="" disabled selected>Select Type</option>
                                <option value="Customer">Customer Undertaking</option>
                                <option value="Staff">Staff Undertaking</option>
                                <option value="Carrier-Specific">Carrier-Specific</option>
                                <option value="Customs">Customs Declaration</option>
                                <option value="High-Value">High-Value Item</option>
                                <option value="Fragile">Fragile Items</option>
                                <option value="Dangerous-Goods">Dangerous Goods</option>
                            </select>
                            <label for="undertakingType"><i class="bi bi-person-badge me-2"></i>Undertaking Type <span class="text-danger">*</span></label>
                        </div>
                    </div>

                    <!-- Category -->
                    <div class="col-md-4">
                        <div class="form-floating rex-floating-group">
                            <select class="form-select" id="undertakingCategory" required>
                                <option value="" disabled selected>Select Category</option>
                                <option value="Domestic">Domestic Shipments</option>
                                <option value="International">International Shipments</option>
                                <option value="Both">Both (Domestic & International)</option>
                                <option value="Special">Special Services</option>
                            </select>
                            <label for="undertakingCategory"><i class="bi bi-folder me-2"></i>Category <span class="text-danger">*</span></label>
                        </div>
                    </div>

                    <!-- Priority -->
                    <div class="col-md-4">
                        <div class="form-floating rex-floating-group">
                            <input type="number" class="form-control" id="undertakingPriority" 
                                   placeholder="10" min="1" max="999" value="10">
                            <label for="undertakingPriority"><i class="bi bi-sort-down me-2"></i>Priority Level</label>
                        </div>
                        <small class="text-muted mt-1 d-block">Lower = shown first (if multiple apply)</small>
                    </div>

                    <!-- Version -->
                    <div class="col-md-3">
                        <div class="form-floating rex-floating-group">
                            <input type="text" class="form-control" id="undertakingVersion" required 
                                   placeholder="v1.0" maxlength="20">
                            <label for="undertakingVersion"><i class="bi bi-tag me-2"></i>Version <span class="text-danger">*</span></label>
                        </div>
                        <small class="text-muted mt-1 d-block">Auto-generated (e.g., v1.0)</small>
                    </div>

                    <!-- Language -->
                    <div class="col-md-3">
                        <div class="form-floating rex-floating-group">
                            <select class="form-select" id="undertakingLanguage">
                                <option value="English" selected>English</option>
                                <option value="Urdu">Urdu</option>
                                <option value="Both">Both (English & Urdu)</option>
                            </select>
                            <label for="undertakingLanguage"><i class="bi bi-translate me-2"></i>Language</label>
                        </div>
                    </div>

                    <!-- Is Mandatory -->
                    <div class="col-md-3">
                        <div class="rex-switch-group h-100">
                            <label class="rex-switch">
                                <input type="checkbox" id="isMandatory">
                                <span class="rex-switch-slider"></span>
                            </label>
                            <span class="rex-switch-label">Mandatory<br><small class="text-muted">Must be signed</small></span>
                        </div>
                    </div>

                    <!-- Requires Signature -->
                    <div class="col-md-3">
                        <div class="rex-switch-group h-100">
                            <label class="rex-switch">
                                <input type="checkbox" id="requiresSignature" checked>
                                <span class="rex-switch-slider"></span>
                            </label>
                            <span class="rex-switch-label">Requires Signature<br><small class="text-muted">Digital/Physical</small></span>
                        </div>
                    </div>

                    <!-- Short Description -->
                    <div class="col-12">
                        <div class="form-floating rex-floating-group">
                            <textarea class="form-control" id="undertakingShortDesc" placeholder="Short Description" 
                                      style="height: 80px"></textarea>
                            <label for="undertakingShortDesc"><i class="bi bi-card-text me-2"></i>Short Description</label>
                        </div>
                        <small class="text-muted mt-1 d-block">Brief summary shown in undertaking selection dropdown</small>
                    </div>

                </div>
            </div>
        </div>

        <!-- ============================================ -->
        <!-- SECTION 2: DECLARATION TEXT                  -->
        <!-- ============================================ -->
        <div class="rex-form-card mb-4">
            <div class="rex-form-card-header">
                <h5 class="mb-0"><i class="bi bi-quote me-2"></i>Declaration Statement</h5>
                <small class="text-muted d-block mt-1">The specific statement that will be affirmed/acknowledged</small>
            </div>
            <div class="rex-form-card-body">
                <div class="row g-3">
                    <div class="col-12">
                        <div class="form-floating rex-floating-group">
                            <textarea class="form-control" id="declarationText" required 
                                      placeholder="I hereby declare..." style="height: 120px"></textarea>
                            <label for="declarationText"><i class="bi bi-chat-left-quote me-2"></i>Declaration Text <span class="text-danger">*</span></label>
                        </div>
                        <small class="text-muted mt-1 d-block">
                            Example: "I hereby declare that the contents of this shipment do not include any prohibited items as per Pakistan Customs regulations and I accept full responsibility for any misdeclaration."
                        </small>
                    </div>
                </div>
            </div>
        </div>

        <!-- ============================================ -->
        <!-- SECTION 3: FULL CONTENT (RICH TEXT EDITOR)   -->
        <!-- ============================================ -->
        <div class="rex-form-card mb-4">
            <div class="rex-form-card-header d-flex justify-content-between align-items-center">
                <h5 class="mb-0"><i class="bi bi-file-earmark-text me-2"></i>Full Undertaking Content</h5>
                <div>
                    <button type="button" class="btn btn-sm btn-outline-secondary" id="btnPreviewUndertaking">
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
                            Detailed Content <span class="text-danger">*</span>
                        </label>
                        
                        <!-- Quill Editor Container -->
                        <div id="undertakingEditor" style="min-height: 350px;"></div>
                        
                        <small class="text-muted mt-2 d-block">
                            <i class="bi bi-info-circle me-1"></i>
                            Use the toolbar to format the full undertaking document. This will be shown to the person signing.
                        </small>
                    </div>
                </div>
            </div>
        </div>

        <!-- ============================================ -->
        <!-- SECTION 4: ACCEPTANCE METHOD                 -->
        <!-- ============================================ -->
        <div class="rex-form-card mb-4">
            <div class="rex-form-card-header">
                <h5 class="mb-0"><i class="bi bi-check2-square me-2"></i>Acceptance Method</h5>
                <small class="text-muted d-block mt-1">How should this undertaking be accepted/acknowledged?</small>
            </div>
            <div class="rex-form-card-body">
                <div class="row g-3">
                    
                    <!-- Acceptance Type -->
                    <div class="col-md-6">
                        <label class="form-label fw-semibold mb-3">
                            <i class="bi bi-ui-checks me-1"></i>Acceptance Type
                        </label>
                        <div class="acceptance-type-grid">
                            <div class="acceptance-type-item">
                                <input class="form-check-input acceptance-type" type="radio" name="acceptanceType" id="acceptCheckbox" value="Checkbox" checked>
                                <label class="acceptance-label" for="acceptCheckbox">
                                    <i class="bi bi-check-square"></i>
                                    <strong>Checkbox</strong>
                                    <small>Simple acknowledgment</small>
                                </label>
                            </div>
                            <div class="acceptance-type-item">
                                <input class="form-check-input acceptance-type" type="radio" name="acceptanceType" id="acceptSignature" value="Digital-Signature">
                                <label class="acceptance-label" for="acceptSignature">
                                    <i class="bi bi-signature"></i>
                                    <strong>Digital Signature</strong>
                                    <small>Sign on screen</small>
                                </label>
                            </div>
                            <div class="acceptance-type-item">
                                <input class="form-check-input acceptance-type" type="radio" name="acceptanceType" id="acceptPhysical" value="Physical-Signature">
                                <label class="acceptance-label" for="acceptPhysical">
                                    <i class="bi bi-pen"></i>
                                    <strong>Physical Signature</strong>
                                    <small>Print & sign</small>
                                </label>
                            </div>
                            <div class="acceptance-type-item">
                                <input class="form-check-input acceptance-type" type="radio" name="acceptanceType" id="acceptOTP" value="OTP-Verification">
                                <label class="acceptance-label" for="acceptOTP">
                                    <i class="bi bi-shield-lock"></i>
                                    <strong>OTP Verification</strong>
                                    <small>SMS/Email code</small>
                                </label>
                            </div>
                        </div>
                    </div>

                    <!-- Acceptance Label -->
                    <div class="col-md-6">
                        <div class="form-floating rex-floating-group">
                            <input type="text" class="form-control" id="acceptanceLabel" 
                                   placeholder="I accept and agree..." value="I have read and accept the above undertaking">
                            <label for="acceptanceLabel"><i class="bi bi-chat-quote me-2"></i>Acceptance Checkbox Label</label>
                        </div>
                        <small class="text-muted mt-1 d-block">Text shown next to the acceptance checkbox</small>

                        <div class="form-floating rex-floating-group mt-3">
                            <input type="text" class="form-control" id="signaturePlaceholder" 
                                   placeholder="Sign here..." value="Sign here to acknowledge">
                            <label for="signaturePlaceholder"><i class="bi bi-signature me-2"></i>Signature Placeholder Text</label>
                        </div>
                    </div>

                </div>
            </div>
        </div>

        <!-- ============================================ -->
        <!-- SECTION 5: APPLICABILITY RULES               -->
        <!-- ============================================ -->
        <div class="rex-form-card mb-4">
            <div class="rex-form-card-header">
                <h5 class="mb-0"><i class="bi bi-funnel me-2"></i>Applicability Rules</h5>
                <small class="text-muted d-block mt-1">Define when this undertaking should be required</small>
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
                                <input class="form-check-input apply-shipment" type="checkbox" id="applyDocument" value="Document">
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
                                <input class="form-check-input apply-direction" type="checkbox" id="applyDomestic" value="Domestic">
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

                    <!-- Carrier Specific -->
                    <div class="col-md-6">
                        <div class="form-floating rex-floating-group">
                            <select class="form-select" id="carrierSpecific" multiple size="4">
                                <option value="">All Carriers (No restriction)</option>
                            </select>
                            <label for="carrierSpecific"><i class="bi bi-truck me-2"></i>Carrier-Specific (Optional)</label>
                        </div>
                        <small class="text-muted mt-1 d-block">Hold Ctrl/Cmd to select multiple</small>
                    </div>

                    <!-- Thresholds -->
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
                        <small class="text-muted mt-1 d-block">For high-value item undertakings</small>
                    </div>

                </div>
            </div>
        </div>

        <!-- ============================================ -->
        <!-- SECTION 6: EFFECTIVE DATE & VERSION CONTROL  -->
        <!-- ============================================ -->
        <div class="rex-form-card mb-4">
            <div class="rex-form-card-header">
                <h5 class="mb-0"><i class="bi bi-calendar3 me-2"></i>Effective Date & Version Control</h5>
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
                        <small class="text-muted mt-1 d-block">Leave blank for ongoing</small>
                    </div>

                    <div class="col-md-4">
                        <div class="form-floating rex-floating-group">
                            <select class="form-select" id="supersedesVersion">
                                <option value="">None (New Undertaking)</option>
                            </select>
                            <label for="supersedesVersion"><i class="bi bi-arrow-repeat me-2"></i>Supersedes Version</label>
                        </div>
                    </div>

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

                    <div class="col-md-4">
                        <div class="form-floating rex-floating-group">
                            <input type="text" class="form-control" id="approvedBy" placeholder="Legal Team / Name">
                            <label for="approvedBy"><i class="bi bi-person-check me-2"></i>Approved By</label>
                        </div>
                    </div>

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
        <!-- SECTION 7: DISPLAY SETTINGS                  -->
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
                    <div class="col-md-3"><div class="rex-switch-group"><label class="rex-switch"><input type="checkbox" id="requireAcknowledgment" checked><span class="rex-switch-slider"></span></label><span class="rex-switch-label">Require Acknowledgment</span></div></div>
                </div>
            </div>
        </div>

        <!-- ============================================ -->
        <!-- SECTION 8: INTERNAL NOTES                    -->
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
            <button type="button" class="btn btn-outline-secondary" onclick="loadView('undertaking')">
                <i class="bi bi-x-circle me-1"></i> Cancel
            </button>
            <button type="button" class="btn btn-outline-primary" id="btnSaveDraft">
                <i class="bi bi-save me-1"></i> Save as Draft
            </button>
            <button type="submit" class="btn btn-rex-primary" id="btnSaveUndertaking">
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
<div class="modal fade" id="undertakingPreviewModal" tabindex="-1">
    <div class="modal-dialog modal-xl modal-dialog-scrollable">
        <div class="modal-content">
            <div class="modal-header bg-primary text-white">
                <h5 class="modal-title"><i class="bi bi-eye me-2"></i>Undertaking Preview</h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body p-4">
                <div class="preview-container">
                    <div class="preview-header text-center mb-4">
                        <h2 id="previewTitle" class="mb-2">Undertaking Title</h2>
                        <p class="text-muted" id="previewVersion">Version: v1.0</p>
                        <hr>
                    </div>
                    <div class="preview-declaration" id="previewDeclaration"></div>
                    <hr>
                    <div class="preview-content" id="previewContent"></div>
                    <hr class="my-4">
                    <div class="preview-acceptance">
                        <h6 class="fw-bold">Acceptance:</h6>
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" id="previewAcceptCheckbox" disabled>
                            <label class="form-check-label" for="previewAcceptCheckbox" id="previewAcceptanceLabel">
                                I have read and accept
                            </label>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" id="btnPrintPreview">
                    <i class="bi bi-printer me-1"></i> Print
                </button>
            </div>
        </div>
    </div>
</div>

<!-- SUCCESS MODAL -->
<div class="modal fade" id="undertakingSuccessModal" tabindex="-1" data-bs-backdrop="static">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow">
            <div class="modal-body text-center p-5">
                <div class="success-icon-wrapper mb-4"><i class="bi bi-check-circle-fill"></i></div>
                <h3 class="fw-bold mb-2">Undertaking Saved!</h3>
                <p class="text-muted mb-1" id="successMessage">Undertaking has been saved successfully.</p>
                <p class="fw-semibold text-danger mb-4" id="successUndertakingTitle">Title: High-Value Declaration v1.0</p>
                <div class="d-flex gap-2 justify-content-center">
                    <button type="button" class="btn btn-outline-secondary" id="btnAddAnotherUndertaking">
                        <i class="bi bi-plus-circle me-1"></i> Add Another
                    </button>
                    <button type="button" class="btn btn-rex-primary" id="btnViewUndertakingList">
                        <i class="bi bi-list-ul me-1"></i> View All Undertakings
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- ERROR MODAL -->
<div class="modal fade" id="undertakingErrorModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow">
            <div class="modal-header bg-danger text-white border-0">
                <h5 class="modal-title"><i class="bi bi-exclamation-triangle-fill me-2"></i>Error</h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body py-4">
                <p id="undertakingErrorMessage" class="mb-0 fs-5 text-center">Something went wrong.</p>
            </div>
            <div class="modal-footer border-0 justify-content-center">
                <button type="button" class="btn btn-secondary px-4" data-bs-dismiss="modal">Try Again</button>
            </div>
        </div>
    </div>
</div>