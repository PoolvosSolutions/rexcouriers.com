// assets/js/addtaxview.js
import { FirebaseDB } from "./firebase/firebase-crud.js";

window.initAddTaxView = function() {
    console.log("🚀 [addtaxview.js] initAddTaxView() executed successfully!");

    // Set default effective date to today
    const today = new Date().toISOString().split('T')[0];
    $('#effectiveFrom').val(today);

    setupAutoGenerateCode();
    setupProvinceButtons();
    setupFormSubmission();
};

// ============================================
// 🔥 AUTO-GENERATE TAX CODE
// ============================================
function setupAutoGenerateCode() {
    $('#taxName').on('blur', function() {
        const name = $(this).val().trim();
        if (!name) return;
        
        const currentCode = $('#taxCode').val().trim();
        if (!currentCode || currentCode.startsWith('TAX-')) {
            // Smart code generation based on common tax types
            let code = '';
            const lowerName = name.toLowerCase();
            
            if (lowerName.includes('gst')) code = 'GST';
            else if (lowerName.includes('sst')) code = 'SST';
            else if (lowerName.includes('withholding') || lowerName.includes('wht')) code = 'WHT';
            else if (lowerName.includes('vat')) code = 'VAT';
            else {
                // Generate from name
                const words = name.split(' ');
                code = words.map(w => w.charAt(0).toUpperCase()).join('').substring(0, 4);
            }
            
            code = 'TAX-' + code + '-' + Math.floor(Math.random() * 1000).toString().padStart(3, '0');
            $('#taxCode').val(code);
        }
    });

    $('#taxCode').on('input', function() {
        $(this).val($(this).val().toUpperCase());
    });
}

// ============================================
// 🔥 PROVINCE QUICK SELECT BUTTONS
// ============================================
function setupProvinceButtons() {
    $('#btnSelectAllProvinces').on('click', function() {
        $('.province-check').prop('checked', true);
    });

    $('#btnDeselectAllProvinces').on('click', function() {
        $('.province-check').prop('checked', false);
    });

    $('#btnSelectSindhOnly').on('click', function() {
        $('.province-check').prop('checked', false);
        $('#provSindh').prop('checked', true);
    });

    $('#btnSelectExceptSindh').on('click', function() {
        $('.province-check').prop('checked', true);
        $('#provSindh').prop('checked', false);
    });
}

// ============================================
// 🔥 FORM SUBMISSION
// ============================================
function setupFormSubmission() {
    $('#addTaxForm').on('submit', async function(e) {
        e.preventDefault();
        
        const $btn = $('#btnSaveTax');
        const $btnText = $btn.find('.btn-text');
        const $btnLoader = $btn.find('.btn-loader');

        // 🔥 Validation
        const taxName = $('#taxName').val().trim();
        const taxCode = $('#taxCode').val().trim();
        const taxRate = parseFloat($('#taxRate').val());
        const effectiveFrom = $('#effectiveFrom').val();
        const effectiveTo = $('#effectiveTo').val();

        if (!taxName) { showErrorModal('Tax Name is required'); $('#taxName').focus(); return; }
        if (!taxCode) { showErrorModal('Tax Code is required'); $('#taxCode').focus(); return; }
        if (isNaN(taxRate) || taxRate < 0 || taxRate > 100) { 
            showErrorModal('Tax Rate must be between 0 and 100'); 
            $('#taxRate').focus(); 
            return; 
        }
        if (!effectiveFrom) { showErrorModal('Effective From date is required'); $('#effectiveFrom').focus(); return; }
        if (effectiveTo && effectiveTo < effectiveFrom) {
            showErrorModal('Effective Until date cannot be before Effective From date');
            $('#effectiveTo').focus();
            return;
        }

        // Check at least one province selected
        const selectedProvinces = $('.province-check:checked').map((_, el) => el.value).get();
        if (selectedProvinces.length === 0) {
            showErrorModal('Please select at least one province');
            return;
        }

        // Check at least one filer status selected
        const selectedFilers = $('.filer-check:checked').map((_, el) => el.value).get();
        if (selectedFilers.length === 0) {
            showErrorModal('Please select at least one filer status');
            return;
        }

        $btn.prop('disabled', true);
        $btnText.addClass('d-none');
        $btnLoader.removeClass('d-none');

        try {
            console.log("💾 Saving tax to Firebase...");

            // Collect all checkbox arrays
            const customerTypes = $('.customer-type-check:checked').map((_, el) => el.value).get();
            const serviceTypes = $('.service-type-check:checked').map((_, el) => el.value).get();

            const taxData = {
                // Basic Info
                taxName: taxName,
                taxCode: taxCode,
                status: $('#taxStatus').val(),
                taxAuthority: $('#taxAuthority').val(),
                taxJurisdiction: $('#taxJurisdiction').val(),
                priority: parseInt($('#taxPriority').val()) || 10,
                description: $('#taxDescription').val().trim(),
                
                // Rate & Calculation
                taxRate: taxRate,
                calculationBase: $('#calculationBase').val(),
                roundingType: $('#roundingType').val(),
                isCompoundTax: $('#isCompoundTax').is(':checked'),
                
                // Applicability
                applicableProvinces: selectedProvinces,
                applicableFilerStatuses: selectedFilers,
                applicableCustomerTypes: customerTypes,
                applicableServiceTypes: serviceTypes,
                
                // Date Range
                effectiveFrom: effectiveFrom,
                effectiveTo: effectiveTo || null,
                notificationRef: $('#notificationRef').val().trim(),
                
                // Display
                showOnBooking: $('#showOnBooking').is(':checked'),
                showOnInvoice: $('#showOnInvoice').is(':checked'),
                showOnReceipt: $('#showOnReceipt').is(':checked'),
                autoApply: $('#autoApply').is(':checked'),
                
                // Accounting
                glAccountCode: $('#glAccountCode').val().trim(),
                taxCategory: $('#taxCategory').val(),
                reportingType: $('#reportingType').val(),
                
                // Notes
                internalNotes: $('#internalNotes').val().trim(),
                
                // Metadata
                createdAt: new Date().toISOString(),
                createdBy: window.sessionData ? window.sessionData.userId : 'unknown',
                lastUpdated: new Date().toISOString()
            };

            const taxId = await FirebaseDB.push('systemSettings/taxRates', taxData);
            console.log("✅ Tax saved with ID:", taxId);

            $('#successTaxName').text(`Tax: ${taxName} @ ${taxRate}%`);
            new bootstrap.Modal(document.getElementById('taxSuccessModal')).show();

        } catch (error) {
            console.error("❌ Error saving tax:", error);
            showErrorModal(error.message || 'Failed to save tax configuration.');
        } finally {
            $btn.prop('disabled', false);
            $btnText.removeClass('d-none');
            $btnLoader.addClass('d-none');
        }
    });

    $('#btnAddAnotherTax').on('click', function() {
        bootstrap.Modal.getInstance(document.getElementById('taxSuccessModal')).hide();
        resetForm();
    });

    $('#btnViewTaxList').on('click', function() {
        bootstrap.Modal.getInstance(document.getElementById('taxSuccessModal')).hide();
        loadView('tax');
    });
}

function showErrorModal(message) {
    $('#taxErrorMessage').text(message);
    new bootstrap.Modal(document.getElementById('taxErrorModal')).show();
}

function resetForm() {
    $('#addTaxForm')[0].reset();
    
    // Reset defaults
    const today = new Date().toISOString().split('T')[0];
    $('#effectiveFrom').val(today);
    $('#taxStatus').val('Active');
    $('#taxJurisdiction').val('Federal');
    $('#taxPriority').val('10');
    $('#calculationBase').val('subtotal');
    $('#roundingType').val('none');
    $('#taxCategory').val('output');
    $('#reportingType').val('monthly');
    
    // Reset checkboxes
    $('.province-check, .filer-check, .customer-type-check, .service-type-check').prop('checked', true);
    $('#filerExempt').prop('checked', false);
    $('#showOnBooking, #showOnInvoice, #showOnReceipt, #autoApply').prop('checked', true);
    $('#isCompoundTax').prop('checked', false);
    
    $('#taxCode').val('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}