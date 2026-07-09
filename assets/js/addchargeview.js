// assets/js/addchargeview.js
import { FirebaseDB } from "./firebase/firebase-crud.js";

// ============================================
// 🔥 ADD CHARGE VIEW INITIALIZER
// ============================================
window.initAddChargeView = function() {
    console.log("🚀 [addchargeview.js] initAddChargeView() executed successfully!");
    console.log("👉 Initializing Add Charge form...");

    // 🔥 Setup event handlers
    setupAutoGenerateCode();
    setupCalculationTypeChange();
    setupFormSubmission();
};

// ============================================
// 🔥 AUTO-GENERATE CHARGE CODE
// ============================================
function setupAutoGenerateCode() {
    // Generate code from charge name
    $('#chargeName').on('blur', function() {
        const name = $(this).val().trim();
        if (!name) return;
        
        // If code is empty or still default, auto-generate
        const currentCode = $('#chargeCode').val().trim();
        if (!currentCode || currentCode.startsWith('CHG-')) {
            // Create code from name (first letters + random)
            const words = name.split(' ');
            let code = words.map(w => w.charAt(0).toUpperCase()).join('').substring(0, 4);
            code = 'CHG-' + code + '-' + Math.floor(Math.random() * 1000).toString().padStart(3, '0');
            $('#chargeCode').val(code);
        }
    });

    // Auto-uppercase code
    $('#chargeCode').on('input', function() {
        $(this).val($(this).val().toUpperCase());
    });
}

// ============================================
// 🔥 CALCULATION TYPE CHANGE
// ============================================
function setupCalculationTypeChange() {
    $('#calculationType').on('change', function() {
        const type = $(this).val();
        const $symbol = $('#calcSymbol');
        const $minMaxFields = $('.min-max-field');
        
        switch(type) {
            case 'flat':
                $symbol.text('PKR');
                $minMaxFields.addClass('d-none');
                break;
            case 'percentage':
                $symbol.text('%');
                $minMaxFields.removeClass('d-none');
                break;
            case 'per_kg':
                $symbol.text('PKR/kg');
                $minMaxFields.addClass('d-none');
                break;
            case 'per_piece':
                $symbol.text('PKR/pc');
                $minMaxFields.addClass('d-none');
                break;
        }
    });
}

// ============================================
// 🔥 FORM SUBMISSION
// ============================================
function setupFormSubmission() {
    $('#addChargeForm').on('submit', async function(e) {
        e.preventDefault();
        
        const $btn = $('#btnSaveCharge');
        const $btnText = $btn.find('.btn-text');
        const $btnLoader = $btn.find('.btn-loader');

        // 🔥 Validation
        const chargeName = $('#chargeName').val().trim();
        const chargeCode = $('#chargeCode').val().trim();
        const calculationType = $('#calculationType').val();
        const defaultValue = parseFloat($('#defaultValue').val());

        if (!chargeName) {
            showErrorModal('Charge Name is required');
            $('#chargeName').focus();
            return;
        }
        if (!chargeCode) {
            showErrorModal('Charge Code is required');
            $('#chargeCode').focus();
            return;
        }
        if (isNaN(defaultValue) || defaultValue < 0) {
            showErrorModal('Please enter a valid default value');
            $('#defaultValue').focus();
            return;
        }
        
        // Validate percentage range
        if (calculationType === 'percentage' && (defaultValue < 0 || defaultValue > 100)) {
            showErrorModal('Percentage value must be between 0 and 100');
            $('#defaultValue').focus();
            return;
        }

        // Show loading
        $btn.prop('disabled', true);
        $btnText.addClass('d-none');
        $btnLoader.removeClass('d-none');

        try {
            console.log("💾 Saving charge to Firebase...");

            // 🔥 Collect applicability checkboxes
            const shipmentTypes = [];
            if ($('#applyDocument').is(':checked')) shipmentTypes.push('Document');
            if ($('#applyParcel').is(':checked')) shipmentTypes.push('Parcel');

            const serviceDirections = [];
            if ($('#applyDomestic').is(':checked')) serviceDirections.push('Domestic');
            if ($('#applyInternational').is(':checked')) serviceDirections.push('International');

            const customerTypes = [];
            if ($('#applyCash').is(':checked')) customerTypes.push('Cash');
            if ($('#applyAccount').is(':checked')) customerTypes.push('Account');

            // 🔥 Prepare charge data
            const chargeData = {
                // Basic Info
                chargeName: chargeName,
                chargeCode: chargeCode,
                status: $('#chargeStatus').val(),
                category: $('#chargeCategory').val(),
                nature: $('#chargeNature').val(),
                sortOrder: parseInt($('#chargeSortOrder').val()) || 10,
                description: $('#chargeDescription').val().trim(),
                
                // Calculation
                calculationType: calculationType,
                defaultValue: defaultValue,
                minValue: calculationType === 'percentage' ? (parseFloat($('#minValue').val()) || 0) : 0,
                maxValue: calculationType === 'percentage' ? (parseFloat($('#maxValue').val()) || 0) : 0,
                roundingType: $('#roundingType').val(),
                
                // Applicability
                applicableShipmentTypes: shipmentTypes,
                applicableServiceDirections: serviceDirections,
                applicableCustomerTypes: customerTypes,
                minWeightThreshold: parseFloat($('#minWeightThreshold').val()) || 0,
                minDeclaredValue: parseFloat($('#minDeclaredValue').val()) || 0,
                
                // Display
                showOnBooking: $('#showOnBooking').is(':checked'),
                showOnInvoice: $('#showOnInvoice').is(':checked'),
                showOnReceipt: $('#showOnReceipt').is(':checked'),
                isTaxable: $('#isTaxable').is(':checked'),
                
                // Accounting
                glAccountCode: $('#glAccountCode').val().trim(),
                revenueType: $('#revenueType').val(),
                taxCategory: $('#taxCategory').val(),
                
                // Notes
                internalNotes: $('#internalNotes').val().trim(),
                
                // Metadata
                createdAt: new Date().toISOString(),
                createdBy: window.sessionData ? window.sessionData.userId : 'unknown',
                lastUpdated: new Date().toISOString()
            };

            // 🔥 Save to Firebase
            const chargeId = await FirebaseDB.push('systemSettings/chargeRules', chargeData);
            console.log("✅ Charge saved with ID:", chargeId);

            // 🔥 Show success modal
            $('#successChargeName').text(`Charge: ${chargeName}`);
            const successModal = new bootstrap.Modal(document.getElementById('chargeSuccessModal'));
            successModal.show();

        } catch (error) {
            console.error("❌ Error saving charge:", error);
            showErrorModal(error.message || 'Failed to save charge. Please try again.');
        } finally {
            $btn.prop('disabled', false);
            $btnText.removeClass('d-none');
            $btnLoader.addClass('d-none');
        }
    });

    // 🔥 Success Modal Buttons
    $('#btnAddAnother').on('click', function() {
        bootstrap.Modal.getInstance(document.getElementById('chargeSuccessModal')).hide();
        resetForm();
    });

    $('#btnViewList').on('click', function() {
        bootstrap.Modal.getInstance(document.getElementById('chargeSuccessModal')).hide();
        loadView('charge');
    });
}

// ============================================
// 🔥 HELPER: SHOW ERROR MODAL
// ============================================
function showErrorModal(message) {
    $('#chargeErrorMessage').text(message);
    const modal = new bootstrap.Modal(document.getElementById('chargeErrorModal'));
    modal.show();
}

// ============================================
// 🔥 HELPER: RESET FORM
// ============================================
function resetForm() {
    $('#addChargeForm')[0].reset();
    
    // Reset defaults
    $('#chargeStatus').val('Active');
    $('#chargeCategory').val('Standard');
    $('#chargeNature').val('Optional');
    $('#chargeSortOrder').val('10');
    $('#calculationType').val('flat');
    $('#roundingType').val('none');
    $('#revenueType').val('business');
    $('#taxCategory').val('standard');
    
    // Reset checkboxes
    $('#applyDocument, #applyParcel, #applyDomestic, #applyInternational, #applyCash, #applyAccount').prop('checked', true);
    $('#showOnBooking, #showOnInvoice, #showOnReceipt, #isTaxable').prop('checked', true);
    
    // Hide min/max fields
    $('.min-max-field').addClass('d-none');
    $('#calcSymbol').text('PKR');
    
    // Clear auto-generated code
    $('#chargeCode').val('');
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}