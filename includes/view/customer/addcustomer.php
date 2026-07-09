<?php
// includes/view/customer/addcustomer.php
// 🔥 Add Customer Form - Rexcouris
?>

<div class="container-fluid py-4 addcustomer-page">
    
    <!-- Page Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
            <h3 class="mb-1"><i class="bi bi-person-plus-fill text-danger me-2"></i>Add New Customer</h3>
            <p class="text-muted mb-0 small">Create a new customer profile for cash or account customers</p>
        </div>
        <button type="button" class="btn btn-outline-secondary" onclick="loadView('customer')">
            <i class="bi bi-arrow-left me-1"></i> Back to List
        </button>
    </div>

    <!-- 🔥 MAIN FORM -->
    <form id="addCustomerForm" novalidate>
        
        <!-- ============================================ -->
        <!-- SECTION 1: ACCOUNT INFORMATION               -->
        <!-- ============================================ -->
        <div class="rex-form-card mb-4">
            <div class="rex-form-card-header">
                <h5 class="mb-0"><i class="bi bi-hash me-2"></i>Account Information</h5>
            </div>
            <div class="rex-form-card-body">
                <div class="row g-3">
                    
                    <!-- Account Number (Auto-generated, read-only) -->
                    <div class="col-md-4">
                        <div class="form-floating rex-floating-group">
                            <input type="text" class="form-control" id="accountNumber" readonly 
                                   placeholder="Rex-1001" value="Generating...">
                            <label for="accountNumber"><i class="bi bi-hash me-2"></i>Account Number</label>
                        </div>
                        <small class="text-muted mt-1 d-block">Auto-generated, cannot be edited</small>
                    </div>

                    <!-- Customer Type (Cash/Account) -->
                    <div class="col-md-4">
                        <div class="form-floating rex-floating-group">
                            <select class="form-select" id="customerType" required>
                                <option value="" disabled selected>Select Type</option>                                
                                <option value="Account">Account Customer</option>
                                <option value="Cash">Cash Customer</option>
                            </select>
                            <label for="customerType"><i class="bi bi-person-badge me-2"></i>Customer Type <span class="text-danger">*</span></label>
                        </div>
                    </div>

                    <!-- Customer Category -->
                    <div class="col-md-4">
                        <div class="form-floating rex-floating-group">
                            <select class="form-select" id="customerCategory">
                                <option value="Individual" selected>Individual</option>
                                <option value="Business">Business</option>
                                <option value="Corporate">Corporate</option>
                                <option value="E-commerce">E-commerce</option>
                            </select>
                            <label for="customerCategory"><i class="bi bi-tag me-2"></i>Category</label>
                        </div>
                    </div>

                    <!-- Status -->
                    <div class="col-md-4">
                        <div class="form-floating rex-floating-group">
                            <select class="form-select" id="customerStatus">
                                <option value="Active" selected>Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                            <label for="customerStatus"><i class="bi bi-toggle-on me-2"></i>Status</label>
                        </div>
                    </div>

                    <!-- Province (for tax calculation) -->
                    <div class="col-md-4">
                        <div class="form-floating rex-floating-group">
                            <select class="form-select" id="province" required>
                                <option value="Sindh" selected>Sindh</option>
                                <option value="Punjab">Punjab</option>
                                <option value="KPK">Khyber Pakhtunkhwa</option>
                                <option value="Balochistan">Balochistan</option>
                                <option value="Gilgit-Baltistan">Gilgit-Baltistan</option>
                                <option value="AJK">Azad Jammu & Kashmir</option>
                                <option value="Islamabad">Islamabad Capital Territory</option>
                            </select>
                            <label for="province"><i class="bi bi-geo-alt me-2"></i>Province <span class="text-danger">*</span></label>
                        </div>
                        <small class="text-muted mt-1 d-block">Used for GST/SST tax calculation</small>
                    </div>

                    <!-- Filer Status -->
                    <div class="col-md-4">
                        <div class="form-floating rex-floating-group">
                            <select class="form-select" id="filerStatus">
                                <option value="Filer" selected>Filer</option>
                                <option value="Non-Filer">Non-Filer</option>
                            </select>
                            <label for="filerStatus"><i class="bi bi-file-earmark-check me-2"></i>FBR Filer Status</label>
                        </div>
                    </div>

                </div>
            </div>
        </div>

        <!-- ============================================ -->
        <!-- SECTION 2: PERSONAL / BUSINESS DETAILS       -->
        <!-- ============================================ -->
        <div class="rex-form-card mb-4">
            <div class="rex-form-card-header">
                <h5 class="mb-0"><i class="bi bi-person-vcard me-2"></i>Personal & Business Details</h5>
            </div>
            <div class="rex-form-card-body">
                <div class="row g-3">
                    
                    <!-- Customer Name (Compulsory) -->
                    <div class="col-md-6">
                        <div class="form-floating rex-floating-group">
                            <input type="text" class="form-control" id="customerName" required 
                                   placeholder="Full Name">
                            <label for="customerName"><i class="bi bi-person me-2"></i>Customer Name <span class="text-danger">*</span></label>
                            <div class="invalid-feedback">Customer name is required</div>
                        </div>
                    </div>

                    <!-- Business Name (Optional) -->
                    <div class="col-md-6">
                        <div class="form-floating rex-floating-group">
                            <input type="text" class="form-control" id="businessName" 
                                   placeholder="Business Name">
                            <label for="businessName"><i class="bi bi-building me-2"></i>Business Name</label>
                        </div>
                    </div>

                    <!-- CNIC Number (Optional, auto-verified if filled) -->
                    <div class="col-md-6">
                        <div class="form-floating rex-floating-group rex-verify-group">
                            <input type="text" class="form-control" id="cnicNumber" 
                                   placeholder="12345-1234567-1" maxlength="15">
                            <label for="cnicNumber"><i class="bi bi-person-badge me-2"></i>CNIC Number <span class="verify-hint">(Verified if filled)</span></label>
                            <span class="verify-badge unverified" id="cnicVerifyBadge">
                                <i class="bi bi-x-circle"></i> Not Verified
                            </span>
                        </div>
                        <small class="text-muted mt-1 d-block">Format: 12345-1234567-1</small>
                    </div>

                    <!-- NTN Number (Optional, auto-verified if filled) -->
                    <div class="col-md-6">
                        <div class="form-floating rex-floating-group rex-verify-group">
                            <input type="text" class="form-control" id="ntnNumber" 
                                   placeholder="NTN Number">
                            <label for="ntnNumber"><i class="bi bi-file-earmark-text me-2"></i>NTN Number <span class="verify-hint">(Verified if filled)</span></label>
                            <span class="verify-badge unverified" id="ntnVerifyBadge">
                                <i class="bi bi-x-circle"></i> Not Verified
                            </span>
                        </div>
                    </div>

                </div>
            </div>
        </div>

        <!-- ============================================ -->
        <!-- SECTION 3: CONTACT INFORMATION               -->
        <!-- ============================================ -->
        <div class="rex-form-card mb-4">
            <div class="rex-form-card-header">
                <h5 class="mb-0"><i class="bi bi-telephone me-2"></i>Contact Information</h5>
            </div>
            <div class="rex-form-card-body">
                <div class="row g-3">
                    
                    <!-- Email (Optional, unverified by default) -->
                    <div class="col-md-6">
                        <div class="form-floating rex-floating-group rex-verify-group">
                            <input type="email" class="form-control" id="email" 
                                   placeholder="email@example.com">
                            <label for="email"><i class="bi bi-envelope me-2"></i>Email Address</label>
                            <span class="verify-badge unverified" id="emailVerifyBadge">
                                <i class="bi bi-clock"></i> Unverified
                            </span>
                        </div>
                    </div>

                    <!-- Contact Number (0092 + number) -->
                    <div class="col-md-6">
                        <div class="form-floating rex-floating-group rex-verify-group">
                            <div class="input-group">
                                <span class="input-group-text rex-dialing-code">+92</span>
                                <input type="tel" class="form-control" id="contactNumber" 
                                       placeholder="3001234567" maxlength="10">
                            </div>
                            <span class="verify-badge unverified position-absolute" id="contactVerifyBadge" style="top: 8px; right: 8px;">
                                <i class="bi bi-clock"></i> Unverified
                            </span>
                        </div>
                        <small class="text-muted mt-1 d-block">Mobile/Landline number (without 0)</small>
                    </div>

                    <!-- WhatsApp Number (0092 + number) -->
                    <div class="col-md-6">
                        <div class="form-floating rex-floating-group rex-verify-group">
                            <div class="input-group">
                                <span class="input-group-text rex-dialing-code">+92</span>
                                <input type="tel" class="form-control" id="whatsappNumber" 
                                       placeholder="3001234567" maxlength="10">
                            </div>
                            <span class="verify-badge unverified position-absolute" id="whatsappVerifyBadge" style="top: 8px; right: 8px;">
                                <i class="bi bi-clock"></i> Unverified
                            </span>
                        </div>
                        <small class="text-muted mt-1 d-block">WhatsApp number for notifications</small>
                    </div>

                </div>
            </div>
        </div>

        <!-- ============================================ -->
        <!-- SECTION 4: ADDRESS                           -->
        <!-- ============================================ -->
        <div class="rex-form-card mb-4">
            <div class="rex-form-card-header">
                <h5 class="mb-0"><i class="bi bi-geo-alt me-2"></i>Address Details</h5>
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
                            <label for="state"><i class="bi bi-map me-2"></i>State</label>
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
        <!-- SECTION 5: DOCUMENT UPLOADS                  -->
        <!-- ============================================ -->
        <div class="rex-form-card mb-4">
            <div class="rex-form-card-header">
                <h5 class="mb-0"><i class="bi bi-cloud-upload me-2"></i>Document Uploads</h5>
            </div>
            <div class="rex-form-card-body">
                <div class="row g-3">
                    
                    <!-- CNIC Document Upload -->
                    <div class="col-md-6">
                        <label class="form-label fw-semibold">
                            <i class="bi bi-person-badge me-1"></i>CNIC Copy 
                            <small class="text-muted">(JPG, PNG or PDF - Max 5MB)</small>
                        </label>
                        <div class="rex-upload-area" id="cnicUploadArea">
                            <input type="file" class="d-none" id="cnicFile" accept=".jpg,.jpeg,.png,.pdf">
                            <div class="upload-placeholder" id="cnicPlaceholder">
                                <i class="bi bi-cloud-arrow-up"></i>
                                <p class="mb-0">Click to upload or drag & drop</p>
                                <small>JPG, PNG, PDF</small>
                            </div>
                            <div class="upload-preview d-none" id="cnicPreview">
                                <i class="bi bi-file-earmark-check text-success"></i>
                                <span class="file-name"></span>
                                <button type="button" class="btn-remove" id="cnicRemove">
                                    <i class="bi bi-x"></i>
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Business Registration / NTN Document Upload -->
                    <div class="col-md-6">
                        <label class="form-label fw-semibold">
                            <i class="bi bi-building me-1"></i>Business Registration / NTN Certificate 
                            <small class="text-muted">(JPG, PNG or PDF - Max 5MB)</small>
                        </label>
                        <div class="rex-upload-area" id="businessUploadArea">
                            <input type="file" class="d-none" id="businessFile" accept=".jpg,.jpeg,.png,.pdf">
                            <div class="upload-placeholder" id="businessPlaceholder">
                                <i class="bi bi-cloud-arrow-up"></i>
                                <p class="mb-0">Click to upload or drag & drop</p>
                                <small>JPG, PNG, PDF</small>
                            </div>
                            <div class="upload-preview d-none" id="businessPreview">
                                <i class="bi bi-file-earmark-check text-success"></i>
                                <span class="file-name"></span>
                                <button type="button" class="btn-remove" id="businessRemove">
                                    <i class="bi bi-x"></i>
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>

        <!-- ============================================ -->
        <!-- SECTION 6: ADDITIONAL DETAILS                -->
        <!-- ============================================ -->
        <div class="rex-form-card mb-4">
            <div class="rex-form-card-header">
                <h5 class="mb-0"><i class="bi bi-info-circle me-2"></i>Additional Details</h5>
            </div>
            <div class="rex-form-card-body">
                <div class="row g-3">
                    
                    <!-- Credit Limit (Only for Account customers) -->
                    <div class="col-md-4 credit-limit-field d-none">
                        <div class="form-floating rex-floating-group">
                            <input type="number" class="form-control" id="creditLimit" 
                                   placeholder="0" min="0">
                            <label for="creditLimit"><i class="bi bi-credit-card me-2"></i>Credit Limit (PKR)</label>
                        </div>
                    </div>

                    <!-- Notes/Remarks -->
                    <div class="col-12">
                        <div class="form-floating rex-floating-group">
                            <textarea class="form-control" id="notes" placeholder="Notes" 
                                      style="height: 80px"></textarea>
                            <label for="notes"><i class="bi bi-sticky me-2"></i>Notes / Remarks</label>
                        </div>
                    </div>

                </div>
            </div>
        </div>

        <!-- ============================================ -->
        <!-- FORM ACTIONS                                 -->
        <!-- ============================================ -->
        <div class="rex-form-actions">
            <button type="button" class="btn btn-outline-secondary" onclick="loadView('customer')">
                <i class="bi bi-x-circle me-1"></i> Cancel
            </button>
            <button type="submit" class="btn btn-rex-primary" id="btnSaveCustomer">
                <span class="btn-text"><i class="bi bi-check-circle me-1"></i> Save Customer</span>
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
<div class="modal fade" id="customerSuccessModal" tabindex="-1" data-bs-backdrop="static">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow">
            <div class="modal-body text-center p-5">
                <div class="success-icon-wrapper mb-4">
                    <i class="bi bi-check-circle-fill"></i>
                </div>
                <h3 class="fw-bold mb-2">Customer Added Successfully!</h3>
                <p class="text-muted mb-1">New customer profile has been created.</p>
                <p class="fw-semibold text-danger mb-4" id="successAccountNumber">Account: Rex-1001</p>
                <div class="d-flex gap-2 justify-content-center">
                    <button type="button" class="btn btn-outline-secondary" id="btnAddAnother">
                        <i class="bi bi-plus-circle me-1"></i> Add Another
                    </button>
                    <button type="button" class="btn btn-rex-primary" id="btnViewList">
                        <i class="bi bi-list-ul me-1"></i> View All Customers
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- ============================================ -->
<!-- 🔥 ERROR MODAL                               -->
<!-- ============================================ -->
<div class="modal fade" id="customerErrorModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow">
            <div class="modal-header bg-danger text-white border-0">
                <h5 class="modal-title"><i class="bi bi-exclamation-triangle-fill me-2"></i>Error</h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body py-4">
                <p id="customerErrorMessage" class="mb-0 fs-5 text-center">Something went wrong.</p>
            </div>
            <div class="modal-footer border-0 justify-content-center">
                <button type="button" class="btn btn-secondary px-4" data-bs-dismiss="modal">Try Again</button>
            </div>
        </div>
    </div>
</div>