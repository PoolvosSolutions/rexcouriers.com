// assets/js/addcustomerview.js
import { FirebaseDB } from "./firebase/firebase-crud.js";

// ============================================
// 🔥 ADD CUSTOMER VIEW INITIALIZER
// ============================================
window.initAddCustomerView = function() {
    console.log("🚀 [addcustomerview.js] initAddCustomerView() executed successfully!");
    console.log("👉 Initializing Add Customer form...");

    // 🔥 STEP 1: Generate Account Number
    generateAccountNumber();

    // 🔥 STEP 2: Auto-verification for CNIC & NTN
    setupAutoVerification();

    // 🔥 STEP 3: File Upload Handlers
    setupFileUploads();

    // 🔥 STEP 4: Customer Type Change (Show/Hide Credit Limit)
    setupCustomerTypeToggle();

    // 🔥 STEP 5: CNIC Auto-formatting
    setupCNICFormatting();

    // 🔥 STEP 6: Form Submission
    setupFormSubmission();
};

// ============================================
// 🔥 1. GENERATE ACCOUNT NUMBER
// ============================================
async function generateAccountNumber() {
    try {
        console.log("🔢 Generating next account number...");
        const nextCode = await FirebaseDB.getNextCustomerCode();
        const accountNumber = `Rex-${nextCode}`;
        $('#accountNumber').val(accountNumber);
        console.log("✅ Account Number:", accountNumber);
    } catch (error) {
        console.error("❌ Error generating account number:", error);
        $('#accountNumber').val('Error');
    }
}

// ============================================
// 🔥 2. AUTO-VERIFICATION FOR CNIC & NTN
// ============================================
function setupAutoVerification() {
    // CNIC: Verified if filled, Not Verified if blank
    $('#cnicNumber').on('input', function() {
        const value = $(this).val().trim();
        const $badge = $('#cnicVerifyBadge');
        
        if (value.length > 0) {
            $badge.removeClass('unverified').addClass('verified')
                  .html('<i class="bi bi-check-circle-fill"></i> Verified');
        } else {
            $badge.removeClass('verified').addClass('unverified')
                  .html('<i class="bi bi-x-circle"></i> Not Verified');
        }
    });

    // NTN: Verified if filled, Not Verified if blank
    $('#ntnNumber').on('input', function() {
        const value = $(this).val().trim();
        const $badge = $('#ntnVerifyBadge');
        
        if (value.length > 0) {
            $badge.removeClass('unverified').addClass('verified')
                  .html('<i class="bi bi-check-circle-fill"></i> Verified');
        } else {
            $badge.removeClass('verified').addClass('unverified')
                  .html('<i class="bi bi-x-circle"></i> Not Verified');
        }
    });
}

// ============================================
// 🔥 3. FILE UPLOAD HANDLERS
// ============================================
function setupFileUploads() {
    setupSingleUpload('cnicUploadArea', 'cnicFile', 'cnicPlaceholder', 'cnicPreview', 'cnicRemove');
    setupSingleUpload('businessUploadArea', 'businessFile', 'businessPlaceholder', 'businessPreview', 'businessRemove');
}

function setupSingleUpload(areaId, inputId, placeholderId, previewId, removeId) {
    const $area = $(`#${areaId}`);
    const $input = $(`#${inputId}`);
    const $placeholder = $(`#${placeholderId}`);
    const $preview = $(`#${previewId}`);
    const $remove = $(`#${removeId}`);

    // Click to upload
    $area.on('click', function(e) {
        if (!$(e.target).closest(`#${removeId}`).length) {
            $input.click();
        }
    });

    // Drag & Drop
    $area.on('dragover', function(e) {
        e.preventDefault();
        $(this).addClass('dragover');
    }).on('dragleave drop', function(e) {
        e.preventDefault();
        $(this).removeClass('dragover');
    }).on('drop', function(e) {
        const files = e.originalEvent.dataTransfer.files;
        if (files.length > 0) {
            $input[0].files = files;
            handleFileSelect($input, $placeholder, $preview);
        }
    });

    // File selected
    $input.on('change', function() {
        handleFileSelect($input, $placeholder, $preview);
    });

    // Remove file
    $remove.on('click', function(e) {
        e.stopPropagation();
        $input.val('');
        $preview.addClass('d-none');
        $placeholder.removeClass('d-none');
    });
}

function handleFileSelect($input, $placeholder, $preview) {
    const file = $input[0].files[0];
    if (!file) return;

    // Validate size (5MB)
    if (file.size > 5 * 1024 * 1024) {
        showErrorModal('File size must be less than 5MB');
        $input.val('');
        return;
    }

    // Validate type
    const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
        showErrorModal('Only JPG, PNG, or PDF files are allowed');
        $input.val('');
        return;
    }

    // Show preview
    $preview.find('.file-name').text(file.name);
    $placeholder.addClass('d-none');
    $preview.removeClass('d-none');
}

// ============================================
// 🔥 4. CUSTOMER TYPE TOGGLE (Credit Limit)
// ============================================
function setupCustomerTypeToggle() {
    $('#customerType').on('change', function() {
        const type = $(this).val();
        if (type === 'Account') {
            $('.credit-limit-field').removeClass('d-none');
        } else {
            $('.credit-limit-field').addClass('d-none');
            $('#creditLimit').val('');
        }
    });
}

// ============================================
// 🔥 5. CNIC AUTO-FORMATTING
// ============================================
function setupCNICFormatting() {
    $('#cnicNumber').on('input', function() {
        let value = $(this).val().replace(/\D/g, '');
        if (value.length > 5) value = value.slice(0, 5) + '-' + value.slice(5);
        if (value.length > 13) value = value.slice(0, 13) + '-' + value.slice(13);
        if (value.length > 15) value = value.slice(0, 15);
        $(this).val(value);
    });
}

// ============================================
// 🔥 6. FORM SUBMISSION
// ============================================
function setupFormSubmission() {
    $('#addCustomerForm').on('submit', async function(e) {
        e.preventDefault();
        
        const $btn = $('#btnSaveCustomer');
        const $btnText = $btn.find('.btn-text');
        const $btnLoader = $btn.find('.btn-loader');

        // 🔥 Validation
        const customerName = $('#customerName').val().trim();
        const customerType = $('#customerType').val();
        
        if (!customerName) {
            showErrorModal('Customer Name is required');
            $('#customerName').focus();
            return;
        }
        if (!customerType) {
            showErrorModal('Customer Type is required');
            $('#customerType').focus();
            return;
        }

        // Show loading
        $btn.prop('disabled', true);
        $btnText.addClass('d-none');
        $btnLoader.removeClass('d-none');

        try {
            console.log("💾 Saving customer to Firebase...");

            // 🔥 Prepare customer data
            const customerData = {
                accountNumber: $('#accountNumber').val(),
                customerName: customerName,
                businessName: $('#businessName').val().trim(),
                customerType: customerType,
                customerCategory: $('#customerCategory').val(),
                status: $('#customerStatus').val(),
                province: $('#province').val(),
                filerStatus: $('#filerStatus').val(),
                
                // Personal IDs
                cnicNumber: $('#cnicNumber').val().trim(),
                cnicVerified: $('#cnicNumber').val().trim().length > 0,
                ntnNumber: $('#ntnNumber').val().trim(),
                ntnVerified: $('#ntnNumber').val().trim().length > 0,
                
                // Contact
                email: $('#email').val().trim(),
                emailVerified: false, // Will be verified later
                contactNumber: $('#contactNumber').val().trim() ? '+92' + $('#contactNumber').val().trim() : '',
                contactVerified: false,
                whatsappNumber: $('#whatsappNumber').val().trim() ? '+92' + $('#whatsappNumber').val().trim() : '',
                whatsappVerified: false,
                
                // Address
                address: $('#address').val().trim(),
                city: $('#city').val().trim(),
                state: $('#state').val().trim(),
                country: $('#country').val().trim(),
                
                // Account specific
                creditLimit: customerType === 'Account' ? (parseFloat($('#creditLimit').val()) || 0) : 0,
                currentBalance: 0,
                
                // Notes
                notes: $('#notes').val().trim(),
                
                // Metadata
                createdAt: new Date().toISOString(),
                createdBy: window.sessionData ? window.sessionData.userId : 'unknown',
                lastUpdated: new Date().toISOString()
            };

            // 🔥 Inside setupFormSubmission() function, replace the file upload section:

            // 🔥 Handle file uploads (if any)
            let cnicDocumentPath = '';
            let businessDocumentPath = '';

            try {
                if ($('#cnicFile')[0].files[0]) {
                    console.log("📤 Uploading CNIC document...");
                    cnicDocumentPath = await uploadFile($('#cnicFile')[0].files[0], 'cnic');
                    console.log("✅ CNIC uploaded:", cnicDocumentPath);
                }
                
                if ($('#businessFile')[0].files[0]) {
                    console.log("📤 Uploading Business document...");
                    businessDocumentPath = await uploadFile($('#businessFile')[0].files[0], 'business');
                    console.log("✅ Business document uploaded:", businessDocumentPath);
                }
            } catch (uploadError) {
                console.error("❌ File upload failed:", uploadError);
                showErrorModal(`File upload failed: ${uploadError.message}`);
                $btn.prop('disabled', false);
                $btnText.removeClass('d-none');
                $btnLoader.addClass('d-none');
                return; // Stop form submission
            }

            // 🔥 Add file paths to customer data
            customerData.cnicDocument = cnicDocumentPath;
            customerData.businessDocument = businessDocumentPath;

            // 🔥 Save to Firebase
            const customerId = await FirebaseDB.push('customers', customerData);
            console.log("✅ Customer saved with ID:", customerId);

            // 🔥 Optional: Update file names with customerId (rename files)
            if (cnicDocumentPath || businessDocumentPath) {
                await renameFilesWithCustomerId(customerId, cnicDocumentPath, businessDocumentPath);
            }

            
            // 🔥 Show success modal
            $('#successAccountNumber').text(`Account: ${customerData.accountNumber}`);
            const successModal = new bootstrap.Modal(document.getElementById('customerSuccessModal'));
            successModal.show();

        } catch (error) {
            console.error("❌ Error saving customer:", error);
            showErrorModal(error.message || 'Failed to save customer. Please try again.');
        } finally {
            $btn.prop('disabled', false);
            $btnText.removeClass('d-none');
            $btnLoader.addClass('d-none');
        }
    });

    // 🔥 Success Modal Buttons
    $('#btnAddAnother').on('click', function() {
        bootstrap.Modal.getInstance(document.getElementById('customerSuccessModal')).hide();
        resetForm();
    });

    $('#btnViewList').on('click', function() {
        bootstrap.Modal.getInstance(document.getElementById('customerSuccessModal')).hide();
        loadView('customer');
    });
}

// ============================================
// 🔥 FILE UPLOAD TO FIREBASE STORAGE
// ============================================
// ============================================
// 🔥 FILE UPLOAD TO SERVER API
// ============================================
async function uploadFile(file, uploadType) {
    return new Promise((resolve, reject) => {
        console.log(`📤 Uploading ${uploadType} document:`, file.name);

        // 🔥 Create FormData
        const formData = new FormData();
        formData.append('document', file);
        formData.append('uploadType', uploadType);
        formData.append('customerId', 'temp'); // Will be updated after customer is created

        // 🔥 AJAX Upload
        $.ajax({
            url: 'api/uploadCustomerDocument.php',
            type: 'POST',
            data: formData,
            processData: false,  // Required for FormData
            contentType: false,  // Required for FormData
            dataType: 'json',
            
            success: function(response) {
                console.log('✅ Upload response:', response);
                
                if (response.success) {
                    resolve(response.data.filePath);
                } else {
                    reject(new Error(response.message || 'Upload failed'));
                }
            },
            
            error: function(xhr, status, error) {
                console.error('❌ Upload error:', error);
                
                // Try to parse error response
                let errorMessage = 'Upload failed. Please try again.';
                try {
                    const errorResponse = JSON.parse(xhr.responseText);
                    errorMessage = errorResponse.message || errorMessage;
                } catch (e) {
                    errorMessage = `Upload error: ${xhr.statusText || error}`;
                }
                
                reject(new Error(errorMessage));
            }
        });
    });
}

// ============================================
// 🔥 HELPER: SHOW ERROR MODAL
// ============================================
function showErrorModal(message) {
    $('#customerErrorMessage').text(message);
    const modal = new bootstrap.Modal(document.getElementById('customerErrorModal'));
    modal.show();
}



// ============================================
// 🔥 RENAME FILES WITH CUSTOMER ID
// ============================================
async function renameFilesWithCustomerId(customerId, cnicPath, businessPath) {
    // This is optional - files already have unique names
    // But if you want to rename them with customerId, create another API
    
    console.log("📝 Files saved for customer:", customerId);
    console.log("  - CNIC:", cnicPath);
    console.log("  - Business:", businessPath);
    
    // For now, just log. In future, you can create an API to rename files
    // await $.ajax({
    //     url: 'api/renameCustomerDocument.php',
    //     type: 'POST',
    //     data: { 
    //         customerId: customerId,
    //         cnicPath: cnicPath,
    //         businessPath: businessPath
    //     }
    // });
}



// ============================================
// 🔥 HELPER: RESET FORM
// ============================================
async function resetForm() {
    $('#addCustomerForm')[0].reset();
    
    // Reset defaults
    $('#city').val('Karachi');
    $('#state').val('Sindh');
    $('#country').val('Pakistan');
    $('#customerCategory').val('Individual');
    $('#customerStatus').val('Active');
    $('#filerStatus').val('Filer');
    $('#province').val('Sindh');
    
    // Reset verification badges
    $('#cnicVerifyBadge, #ntnVerifyBadge').removeClass('verified').addClass('unverified')
        .html('<i class="bi bi-x-circle"></i> Not Verified');
    $('#emailVerifyBadge, #contactVerifyBadge, #whatsappVerifyBadge').removeClass('verified').addClass('unverified')
        .html('<i class="bi bi-clock"></i> Unverified');
    
    // Reset file uploads
    $('.upload-preview').addClass('d-none');
    $('.upload-placeholder').removeClass('d-none');
    $('#cnicFile, #businessFile').val('');
    
    // Hide credit limit
    $('.credit-limit-field').addClass('d-none');
    
    // Regenerate account number
    await generateAccountNumber();
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}