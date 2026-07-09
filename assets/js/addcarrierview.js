// assets/js/addcarrierview.js
import { FirebaseDB } from "./firebase/firebase-crud.js";

// ============================================
// 🔥 ADD CARRIER VIEW INITIALIZER
// ============================================
window.initAddCarrierView = function() {
    console.log("🚀 [addcarrierview.js] initAddCarrierView() executed successfully!");
    console.log("👉 Initializing Add Carrier form...");

    // 🔥 Setup event handlers
    setupFileUploads();
    setupCarrierCodeAutoFormat();
    setupFormSubmission();
};

// ============================================
// 🔥 FILE UPLOAD HANDLERS
// ============================================
function setupFileUploads() {
    setupSingleUpload('logoUploadArea', 'logoFile', 'logoPlaceholder', 'logoPreview', 'logoRemove');
    setupSingleUpload('agreementUploadArea', 'agreementFile', 'agreementPlaceholder', 'agreementPreview', 'agreementRemove');
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
            handleFileSelect($input, $placeholder, $preview, areaId);
        }
    });

    // File selected
    $input.on('change', function() {
        handleFileSelect($input, $placeholder, $preview, areaId);
    });

    // Remove file
    $remove.on('click', function(e) {
        e.stopPropagation();
        $input.val('');
        $preview.addClass('d-none');
        $placeholder.removeClass('d-none');
    });
}

function handleFileSelect($input, $placeholder, $preview, areaId) {
    const file = $input[0].files[0];
    if (!file) return;

    // Validate size
    const maxSize = areaId === 'logoUploadArea' ? 2 * 1024 * 1024 : 10 * 1024 * 1024; // 2MB for logo, 10MB for agreement
    if (file.size > maxSize) {
        showErrorModal(`File size must be less than ${maxSize / (1024 * 1024)}MB`);
        $input.val('');
        return;
    }

    // Validate type
    const validTypes = areaId === 'logoUploadArea' 
        ? ['image/jpeg', 'image/png'] 
        : ['application/pdf'];
    
    if (!validTypes.includes(file.type)) {
        showErrorModal(areaId === 'logoUploadArea' 
            ? 'Only JPG or PNG files are allowed for logo' 
            : 'Only PDF files are allowed for agreement');
        $input.val('');
        return;
    }

    // Show preview
    $preview.find('.file-name').text(file.name);
    $placeholder.addClass('d-none');
    $preview.removeClass('d-none');
}

// ============================================
// 🔥 CARRIER CODE AUTO-FORMAT (UPPERCASE)
// ============================================
function setupCarrierCodeAutoFormat() {
    $('#carrierCode').on('input', function() {
        $(this).val($(this).val().toUpperCase());
    });
}

// ============================================
// 🔥 FORM SUBMISSION
// ============================================
function setupFormSubmission() {
    $('#addCarrierForm').on('submit', async function(e) {
        e.preventDefault();
        
        const $btn = $('#btnSaveCarrier');
        const $btnText = $btn.find('.btn-text');
        const $btnLoader = $btn.find('.btn-loader');

        // 🔥 Validation
        const carrierName = $('#carrierName').val().trim();
        const carrierCode = $('#carrierCode').val().trim();
        const carrierType = $('#carrierType').val();
        const contactPerson = $('#contactPerson').val().trim();
        const contactNumber = $('#contactNumber').val().trim();
        
        if (!carrierName) {
            showErrorModal('Carrier Name is required');
            $('#carrierName').focus();
            return;
        }
        if (!carrierCode) {
            showErrorModal('Carrier Code is required');
            $('#carrierCode').focus();
            return;
        }
        if (!carrierType) {
            showErrorModal('Service Type is required');
            $('#carrierType').focus();
            return;
        }
        if (!contactPerson) {
            showErrorModal('Contact Person is required');
            $('#contactPerson').focus();
            return;
        }
        if (!contactNumber) {
            showErrorModal('Contact Number is required');
            $('#contactNumber').focus();
            return;
        }

        // Show loading
        $btn.prop('disabled', true);
        $btnText.addClass('d-none');
        $btnLoader.removeClass('d-none');

        try {
            console.log("💾 Saving carrier to Firebase...");

            // 🔥 Collect service checkboxes
            const domesticServices = [];
            $('#domSameDay, #domNextDay, #dom2Days, #dom3Days, #domCOD').each(function() {
                if ($(this).is(':checked')) {
                    domesticServices.push($(this).val());
                }
            });

            const internationalServices = [];
            $('#intExpress, #intEconomy, #intStandard, #intFreight').each(function() {
                if ($(this).is(':checked')) {
                    internationalServices.push($(this).val());
                }
            });

            // 🔥 Prepare carrier data
            const carrierData = {
                carrierName: carrierName,
                carrierCode: carrierCode,
                carrierType: carrierType,
                status: $('#carrierStatus').val(),
                priority: parseInt($('#carrierPriority').val()),
                website: $('#carrierWebsite').val().trim(),
                
                // Contact
                contactPerson: contactPerson,
                contactDesignation: $('#contactDesignation').val().trim(),
                contactNumber: '+92' + contactNumber,
                contactEmail: $('#contactEmail').val().trim(),
                whatsappNumber: $('#whatsappNumber').val().trim() ? '+92' + $('#whatsappNumber').val().trim() : '',
                supportNumber: $('#supportNumber').val().trim(),
                supportEmail: $('#supportEmail').val().trim(),
                
                // Address
                address: $('#address').val().trim(),
                city: $('#city').val().trim(),
                state: $('#state').val().trim(),
                country: $('#country').val().trim(),
                
                // Account & Contract
                accountNumber: $('#accountNumber').val().trim(),
                paymentTerms: $('#paymentTerms').val(),
                billingCycle: $('#billingCycle').val(),
                contractStartDate: $('#contractStartDate').val(),
                contractEndDate: $('#contractEndDate').val(),
                creditLimit: parseFloat($('#creditLimit').val()) || 0,
                
                // API & Integration
                apiEndpoint: $('#apiEndpoint').val().trim(),
                apiKey: $('#apiKey').val().trim(),
                apiPassword: $('#apiPassword').val().trim(),
                trackingUrlPattern: $('#trackingUrlPattern').val().trim(),
                
                // Services
                domesticServices: domesticServices,
                internationalServices: internationalServices,
                
                // Notes
                notes: $('#notes').val().trim(),
                
                // Metadata
                createdAt: new Date().toISOString(),
                createdBy: window.sessionData ? window.sessionData.userId : 'unknown',
                lastUpdated: new Date().toISOString()
            };

            // 🔥 Handle file uploads (if any)
            if ($('#logoFile')[0].files[0]) {
                console.log("📤 Uploading logo...");
                carrierData.logo = await uploadFile($('#logoFile')[0].files[0], 'carrier_logo');
            }
            
            if ($('#agreementFile')[0].files[0]) {
                console.log("📤 Uploading agreement...");
                carrierData.agreement = await uploadFile($('#agreementFile')[0].files[0], 'carrier_agreement');
            }

            // 🔥 Save to Firebase
            const carrierId = await FirebaseDB.push('carriers', carrierData);
            console.log("✅ Carrier saved with ID:", carrierId);

            // 🔥 Show success modal
            $('#successCarrierName').text(`Carrier: ${carrierName}`);
            const successModal = new bootstrap.Modal(document.getElementById('carrierSuccessModal'));
            successModal.show();

        } catch (error) {
            console.error("❌ Error saving carrier:", error);
            showErrorModal(error.message || 'Failed to save carrier. Please try again.');
        } finally {
            $btn.prop('disabled', false);
            $btnText.removeClass('d-none');
            $btnLoader.addClass('d-none');
        }
    });

    // 🔥 Success Modal Buttons
    $('#btnAddAnother').on('click', function() {
        bootstrap.Modal.getInstance(document.getElementById('carrierSuccessModal')).hide();
        resetForm();
    });

    $('#btnViewList').on('click', function() {
        bootstrap.Modal.getInstance(document.getElementById('carrierSuccessModal')).hide();
        loadView('carrier');
    });
}

// ============================================
// 🔥 FILE UPLOAD TO SERVER API
// ============================================
async function uploadFile(file, uploadType) {
    return new Promise((resolve, reject) => {
        console.log(`📤 Uploading ${uploadType}:`, file.name);

        const formData = new FormData();
        formData.append('document', file);
        formData.append('uploadType', uploadType);

        $.ajax({
            url: 'api/uploadCarrierDocument.php',
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
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
    $('#carrierErrorMessage').text(message);
    const modal = new bootstrap.Modal(document.getElementById('carrierErrorModal'));
    modal.show();
}

// ============================================
// 🔥 HELPER: RESET FORM
// ============================================
function resetForm() {
    $('#addCarrierForm')[0].reset();
    
    // Reset defaults
    $('#city').val('Karachi');
    $('#state').val('Sindh');
    $('#country').val('Pakistan');
    $('#carrierStatus').val('Active');
    $('#carrierPriority').val('3');
    $('#paymentTerms').val('Prepaid');
    $('#billingCycle').val('Monthly');
    
    // Uncheck all service checkboxes
    $('.service-checkboxes input[type="checkbox"]').prop('checked', false);
    
    // Reset file uploads
    $('.upload-preview').addClass('d-none');
    $('.upload-placeholder').removeClass('d-none');
    $('#logoFile, #agreementFile').val('');
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}