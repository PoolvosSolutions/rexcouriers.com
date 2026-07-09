// assets/js/newbookingview.js - FIXED VERSION
import { FirebaseDB, FirebaseAuth } from "./firebase/firebase-crud.js";

// Global state
let countriesData = [];
let chargesList = [];
let taxesList = [];
let tcData = null;
let undertakingData = null;
let itemRowCount = 0;

window.initNewBookingView = function() {
    console.log("🚀 [newbookingview.js] initNewBookingView() executed successfully!");
    
    initializeForm();
    loadCountries();
    loadCharges();
    loadTaxes();
    loadTermsAndUndertaking();
    setupEventHandlers();
    addItemRow();
    setTimeout(calculateWeights, 200);
};

// ============================================
// 🔥 INITIALIZE FORM
// ============================================
async function initializeForm() {
    const today = new Date().toISOString().split('T')[0];
    $('#bookingDate').val(today);
    
    try {
        const awb = await FirebaseDB.peekNextAWBNumber();
        const pi = await FirebaseDB.peekNextPINumber();
        $('#awbNumber').val(awb);
        $('#piNumber').val(pi);
        console.log("✅ AWB (peek):", awb, "PI (peek):", pi);
    } catch (error) {
        console.error("❌ Error generating numbers:", error);
        showErrorModal('Failed to generate booking numbers: ' + error.message);
    }
}

// ============================================
// 🔥 LOAD COUNTRIES
// ============================================
async function loadCountries() {
    try {
        console.log("📥 Fetching countries from Firebase...");
        const countries = await FirebaseDB.getList('countries');
        countriesData = Array.isArray(countries) ? countries : [];
        
        console.log("✅ Loaded", countriesData.length, "countries from Firebase");
        
        const $select = $('#consigneeCountry');
        $select.empty().append('<option value="" disabled selected>Select Country</option>');
        
        countriesData.sort((a, b) => a.name.localeCompare(b.name));
        
        countriesData.forEach(c => {
            $select.append(`<option value="${c.name}">${c.name}</option>`);
        });
        
    } catch (error) {
        console.error("❌ Error loading countries:", error);
        $('#consigneeCountry').html('<option value="">Failed to load countries</option>');
    }
}

// ============================================
// 🔥 LOAD CHARGES
// ============================================
async function loadCharges() {
    try {
        const charges = await FirebaseDB.getList('systemSettings/chargeRules');
        chargesList = charges.filter(c => c.status === 'Active' && c.showOnBooking);
        chargesList.sort((a, b) => (a.sortOrder || 99) - (b.sortOrder || 99));
        
        renderCharges();
        console.log("✅ Loaded", chargesList.length, "charges");
    } catch (error) {
        console.error("❌ Error loading charges:", error);
        $('#chargesContainer').html('<div class="text-danger">Failed to load charges</div>');
    }
}

function renderCharges() {
    const $container = $('#chargesContainer').empty();
    
    if (chargesList.length === 0) {
        $container.html('<div class="col-12 text-center text-muted py-3">No active charges configured</div>');
        return;
    }
    
    chargesList.forEach((charge, index) => {
        const col = `
            <div class="col-md-6">
                <div class="charge-row" data-charge-id="${charge.id}" data-default="${charge.defaultValue || 0}">
                    <div class="form-check">
                        <input class="form-check-input charge-checkbox" type="checkbox" id="charge_${index}" data-charge-id="${charge.id}">
                    </div>
                    <div class="charge-info">
                        <div class="charge-name">${charge.chargeName}</div>
                        <div class="charge-code">${charge.chargeCode || ''}</div>
                    </div>
                    <div class="charge-input">
                        <div class="input-group input-group-sm">
                            <span class="input-group-text">PKR</span>
                            <input type="number" class="form-control charge-amount" disabled 
                                   value="${charge.defaultValue || 0}" min="0" step="0.01">
                        </div>
                    </div>
                </div>
            </div>
        `;
        $container.append(col);
    });
}

// ============================================
// 🔥 LOAD TAXES
// ============================================
async function loadTaxes() {
    try {
        const taxes = await FirebaseDB.getList('systemSettings/taxRates');
        taxesList = taxes.filter(t => t.status === 'Active' && t.showOnBooking);
        taxesList.sort((a, b) => (a.priority || 99) - (b.priority || 99));
        
        renderTaxes();
        console.log("✅ Loaded", taxesList.length, "taxes");
    } catch (error) {
        console.error("❌ Error loading taxes:", error);
        $('#taxContainer').html('<div class="text-danger">Failed to load taxes</div>');
    }
}

function renderTaxes() {
    const $container = $('#taxContainer').empty();
    
    if (taxesList.length === 0) {
        $container.html('<div class="col-12 text-center text-muted py-3">No active taxes configured</div>');
        return;
    }
    
    taxesList.forEach((tax, index) => {
        const col = `
            <div class="col-md-6">
                <div class="tax-row" data-tax-id="${tax.id}" data-rate="${tax.taxRate || 0}">
                    <div class="form-check">
                        <input class="form-check-input tax-checkbox" type="checkbox" id="tax_${index}" data-tax-id="${tax.id}">
                    </div>
                    <div class="tax-info">
                        <div class="tax-name">${tax.taxName}</div>
                        <small class="text-muted">${tax.taxJurisdiction || ''}</small>
                    </div>
                    <span class="tax-rate">${tax.taxRate}%</span>
                    <span class="tax-amount" id="taxAmount_${index}">PKR 0.00</span>
                </div>
            </div>
        `;
        $container.append(col);
    });
}

// ============================================
// 🔥 LOAD TERMS & UNDERTAKING
// ============================================
async function loadTermsAndUndertaking() {
    try {
        const terms = await FirebaseDB.getList('systemSettings/termsAndConditions');
        tcData = terms.find(t => t.status === 'Active') || terms[0];
        
        if (tcData) {
            $('#tcContentDisplay').html(tcData.content || '<p class="text-muted">No content available</p>');
        } else {
            $('#tcContentDisplay').html('<p class="text-muted">No Terms & Conditions configured</p>');
        }
        
        const undertakings = await FirebaseDB.getList('systemSettings/undertakings');
        undertakingData = undertakings.find(u => u.status === 'Active') || undertakings[0];
        
        if (undertakingData) {
            $('#undertakingContentDisplay').html(undertakingData.content || '<p class="text-muted">No content available</p>');
        } else {
            $('#undertakingContentDisplay').html('<p class="text-muted">No Undertaking configured</p>');
            $('#undertakingSection').hide();
        }
        
        console.log("✅ Loaded T&C and Undertaking");
    } catch (error) {
        console.error("❌ Error loading T&C:", error);
    }
}

// ============================================
// 🔥 EVENT HANDLERS (FIXED - NO RECURSIVE CALL)
// ============================================
function setupEventHandlers() {
    console.log("🔧 Setting up event handlers...");
    
    // Customer Type Change
    $('#customerType').on('change', function() {
        const type = $(this).val();
        if (type === 'Account') {
            $('#accountNumberWrapper').removeClass('d-none');
            $('#creditOption').removeClass('d-none');
        } else {
            $('#accountNumberWrapper').addClass('d-none');
            $('#creditOption').addClass('d-none');
            $('#payCash').prop('checked', true);
            clearCustomerInfo();
        }
    });
    
    // Account Number Fetch
    let accountTimeout;
    $('#accountNumber').on('input', function() {
        clearTimeout(accountTimeout);
        const accNo = $(this).val().trim();
        if (accNo.length >= 5) {
            accountTimeout = setTimeout(() => fetchCustomerByAccount(accNo), 500);
        }
    });
    
    // Clear Customer
    $('#btnClearCustomer').on('click', clearCustomerInfo);
    
    // Country Change → Load Cities
    $(document).on('change', '#consigneeCountry', function() {
        const countryName = $(this).val();
        const country = countriesData.find(c => c.name === countryName);
        const $citySelect = $('#consigneeCity');
        $citySelect.empty();
        
        if (country && country.cities && country.cities.length > 0) {
            $citySelect.append('<option value="" disabled selected>Select City</option>');
            country.cities.forEach(city => {
                $citySelect.append(`<option value="${city}">${city}</option>`);
            });
            console.log("✅ Loaded", country.cities.length, "cities for", countryName);
        } else {
            $citySelect.append('<option value="" disabled selected>No cities available</option>');
        }
    });
    
    // Weight/Dimension Changes → Recalculate
    $(document).on('input', '#weight, #length, #width, #height', function() {
        calculateWeights();
    });
    
    // Shipment Charges Change → Recalculate Total
    $(document).on('input', '#shipmentCharges', function() {
        calculateTotal();
    });
    
    // Charge Checkbox → Enable Input
    $(document).on('change', '.charge-checkbox', function() {
        const $row = $(this).closest('.charge-row');
        const $input = $row.find('.charge-amount');
        
        if ($(this).is(':checked')) {
            $row.addClass('active');
            $input.prop('disabled', false);
        } else {
            $row.removeClass('active');
            $input.prop('disabled', true);
            $input.val($row.data('default'));
        }
        calculateTotal();
    });
    
    // Charge Amount Change → Recalculate
    $(document).on('input', '.charge-amount', calculateTotal);
    
    // Tax Checkbox → Recalculate
    $(document).on('change', '.tax-checkbox', function() {
        const $row = $(this).closest('.tax-row');
        if ($(this).is(':checked')) {
            $row.addClass('active');
        } else {
            $row.removeClass('active');
        }
        calculateTotal();
    });
    
    // Add Item Button
    $('#btnAddItem').on('click', addItemRow);
    
    // Remove Item Button
    $(document).on('click', '.btn-remove-row', function() {
        if ($('#itemsTableBody tr').length > 1) {
            $(this).closest('tr').remove();
            renumberItems();
            calculateItemsSubtotal();
        } else {
            showErrorModal('At least one item row is required');
        }
    });
    
    // Item Quantity/Value Change → Recalculate
    $(document).on('input', '.item-quantity, .item-unit-value', function() {
        const $row = $(this).closest('tr');
        const qty = parseFloat($row.find('.item-quantity').val()) || 0;
        const unitVal = parseFloat($row.find('.item-unit-value').val()) || 0;
        const subTotal = qty * unitVal;
        $row.find('.item-subtotal').val(subTotal.toFixed(2));
        calculateItemsSubtotal();
    });
    
    // 🔥 FORM SUBMISSION - CRITICAL FIX
    $(document).on('submit', '#newBookingForm', function(e) {
        e.preventDefault();  // Prevent default form submission
        e.stopPropagation(); // Stop event bubbling
        console.log("🚀 Form submit intercepted");
        handleFormSubmit(false);
        return false; // Extra safety
    });
    
    // Save Draft
    $('#btnSaveDraft').on('click', function(e) {
        e.preventDefault();
        handleFormSubmit(true);
    });
    
    // Success Modal Buttons
    $('#btnNewBooking').on('click', function() {
        bootstrap.Modal.getInstance(document.getElementById('bookingSuccessModal')).hide();
        setTimeout(() => location.reload(), 300);
    });
    
    $('#btnPrintBooking').on('click', printBooking);
    
    $('#btnViewList').on('click', function() {
        bootstrap.Modal.getInstance(document.getElementById('bookingSuccessModal')).hide();
        loadView('admindashboard');
    });
    
    // CNIC Formatting
    $('#shipperCnic').on('input', function() {
        let value = $(this).val().replace(/\D/g, '');
        if (value.length > 5) value = value.slice(0, 5) + '-' + value.slice(5);
        if (value.length > 13) value = value.slice(0, 13) + '-' + value.slice(13);
        if (value.length > 15) value = value.slice(0, 15);
        $(this).val(value);
    });
    
    // Confirmation Modal Buttons
    $('#btnCancelConfirm').on('click', function() {
        bootstrap.Modal.getInstance(document.getElementById('bookingConfirmModal')).hide();
        console.log("❌ Booking cancelled by user");
    });
    
    $('#bookingConfirmModal').on('hidden.bs.modal', function() {
        if (window.pendingBookingData) {
            console.log("🧹 Cleared pending booking data");
            window.pendingBookingData = null;
        }
    });
    
    $('#btnConfirmSave').on('click', confirmAndSaveBooking);
    
    console.log("✅ All event handlers bound successfully");
}

// ============================================
// 🔥 FETCH CUSTOMER BY ACCOUNT NUMBER
// ============================================
async function fetchCustomerByAccount(accNo) {
    try {
        const customers = await FirebaseDB.getList('customers');
        const customer = customers.find(c => c.accountNumber === accNo && c.status === 'Active');
        
        if (customer) {
            $('#shipperName').val(customer.customerName || '');
            $('#shipperCompany').val(customer.businessName || '');
            $('#shipperCity').val(customer.city || '');
            $('#shipperState').val(customer.state || '');
            $('#shipperCountry').val(customer.country || 'Pakistan');
            $('#shipperPostalCode').val(customer.postalCode || '');
            $('#shipperCnic').val(customer.cnicNumber || '');
            $('#shipperNtn').val(customer.ntnNumber || '');
            $('#shipperEmail').val(customer.email || '');
            $('#shipperContact').val(customer.contactNumber ? customer.contactNumber.replace('+92', '') : '');
            
            $('#displayCustomerName').text(customer.customerName);
            $('#displayCustomerDetails').text(`${customer.accountNumber} | ${customer.customerType} | ${customer.province || ''} | ${customer.contactNumber || ''}`);
            $('#customerInfoDisplay').removeClass('d-none');
            
            console.log("✅ Customer fetched:", customer.customerName);
        } else {
            showErrorModal(`Account number "${accNo}" not found. Please check and try again.`);
            $('#accountNumber').focus();
        }
    } catch (error) {
        console.error("❌ Error fetching customer:", error);
        showErrorModal('Failed to fetch customer details');
    }
}

function clearCustomerInfo() {
    $('#shipperName, #shipperCompany, #shipperCity, #shipperState, #shipperPostalCode, #shipperCnic, #shipperNtn, #shipperEmail, #shipperContact').val('');
    $('#shipperCountry').val('Pakistan');
    $('#accountNumber').val('');
    $('#customerInfoDisplay').addClass('d-none');
}

// ============================================
// 🔥 WEIGHT CALCULATIONS
// ============================================
function calculateWeights() {
    const weight = parseFloat($('#weight').val()) || 0;
    const length = parseFloat($('#length').val()) || 0;
    const width = parseFloat($('#width').val()) || 0;
    const height = parseFloat($('#height').val()) || 0;
    
    let volumetric = 0;
    if (length > 0 && width > 0 && height > 0) {
        volumetric = (length * width * height) / 5000;
    }
    
    const chargeable = Math.max(weight, volumetric);
    
    $('#volumetricWeight').val(volumetric > 0 ? volumetric.toFixed(2) : '0.00');
    $('#chargeableWeight').val(chargeable > 0 ? chargeable.toFixed(2) : '0.00');
}

// ============================================
// 🔥 ITEMS TABLE
// ============================================
function addItemRow() {
    itemRowCount++;
    
    const row = `
        <tr>
            <td class="text-center item-sno">${itemRowCount}</td>
            <td><input type="text" class="form-control item-name" placeholder="Item name"></td>
            <td><input type="text" class="form-control item-hscode" placeholder="HS Code"></td>
            <td><input type="text" class="form-control item-origin bg-light" value="Pakistan" readonly></td>
            <td><input type="number" class="form-control item-quantity" min="1" value="1"></td>
            <td><input type="number" class="form-control item-unit-value" min="0" step="0.01" value="0"></td>
            <td><input type="text" class="form-control item-subtotal bg-light" value="0.00" readonly></td>
            <td class="text-center">
                <button type="button" class="btn btn-sm btn-danger btn-remove-row">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        </tr>
    `;
    $('#itemsTableBody').append(row);
}

function renumberItems() {
    $('#itemsTableBody tr').each(function(index) {
        $(this).find('.item-sno').text(index + 1);
    });
    itemRowCount = $('#itemsTableBody tr').length;
}

function calculateItemsSubtotal() {
    let total = 0;
    $('#itemsTableBody tr').each(function() {
        const sub = parseFloat($(this).find('.item-subtotal').val()) || 0;
        total += sub;
    });
    $('#itemsSubtotal').text(total.toFixed(2));
}

// ============================================
// 🔥 TOTAL CALCULATION
// ============================================
function calculateTotal() {
    const baseCharges = parseFloat($('#shipmentCharges').val()) || 0;
    
    let additionalCharges = 0;
    $('.charge-checkbox:checked').each(function() {
        const amount = parseFloat($(this).closest('.charge-row').find('.charge-amount').val()) || 0;
        additionalCharges += amount;
    });
    
    const subtotal = baseCharges + additionalCharges;
    
    let totalTax = 0;
    let taxBreakdown = [];
    $('.tax-checkbox:checked').each(function() {
        const $row = $(this).closest('.tax-row');
        const rate = parseFloat($row.data('rate')) || 0;
        const taxAmount = subtotal * (rate / 100);
        totalTax += taxAmount;
        
        const taxName = $row.find('.tax-name').text();
        taxBreakdown.push({ name: taxName, rate: rate, amount: taxAmount });
        
        const displayIndex = $(this).attr('id').split('_')[1];
        $(`#taxAmount_${displayIndex}`).text('PKR ' + taxAmount.toFixed(2));
    });
    
    $('.tax-checkbox:not(:checked)').each(function() {
        const displayIndex = $(this).attr('id').split('_')[1];
        $(`#taxAmount_${displayIndex}`).text('PKR 0.00');
    });
    
    const grandTotal = subtotal + totalTax;
    
    $('#summaryBase').text('PKR ' + baseCharges.toFixed(2));
    $('#summaryCharges').text('PKR ' + additionalCharges.toFixed(2));
    $('#summarySubtotal').text('PKR ' + subtotal.toFixed(2));
    $('#summaryTax').text('PKR ' + totalTax.toFixed(2));
    $('#summaryGrandTotal').text('PKR ' + grandTotal.toFixed(2));
    
    window.bookingCalculation = {
        baseCharges, additionalCharges, subtotal, totalTax, grandTotal, taxBreakdown
    };
}

// ============================================
// 🔥 FORM SUBMISSION (SHOW CONFIRMATION)
// ============================================
async function handleFormSubmit(isDraft = false) {
    console.log("🔍 handleFormSubmit called, isDraft:", isDraft);
    
    // Validation
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
        console.error("❌ Validation failed:", validationErrors);
        showErrorModal('<strong>Please fix the following errors:</strong><br><br>' + validationErrors.join('<br>'));
        return;
    }
    
    console.log("✅ Validation passed, preparing confirmation...");
    
    try {
        // Collect items
        const items = [];
        $('#itemsTableBody tr').each(function() {
            items.push({
                sno: $(this).find('.item-sno').text(),
                name: $(this).find('.item-name').val() || '-',
                hsCode: $(this).find('.item-hscode').val() || '-',
                origin: $(this).find('.item-origin').val() || 'Pakistan',
                quantity: parseFloat($(this).find('.item-quantity').val()) || 0,
                unitValue: parseFloat($(this).find('.item-unit-value').val()) || 0,
                subtotal: parseFloat($(this).find('.item-subtotal').val()) || 0
            });
        });
        
        // Collect charges
        const charges = [];
        $('.charge-checkbox:checked').each(function() {
            const $row = $(this).closest('.charge-row');
            charges.push({
                chargeId: $(this).data('charge-id'),
                chargeName: $row.find('.charge-name').text(),
                amount: parseFloat($row.find('.charge-amount').val()) || 0
            });
        });
        
        const consigneeCountryName = $('#consigneeCountry').val() || '';
        
        // Build booking data
        window.pendingBookingData = {
            awbNumber: $('#awbNumber').val(),
            piNumber: $('#piNumber').val(),
            bookingDate: $('#bookingDate').val(),
            serviceType: $('#serviceType').val(),
            customerType: $('#customerType').val(),
            accountNumber: $('#accountNumber').val(),
            
            shipper: {
                name: $('#shipperName').val(),
                company: $('#shipperCompany').val(),
                city: $('#shipperCity').val(),
                state: $('#shipperState').val(),
                country: $('#shipperCountry').val(),
                postalCode: $('#shipperPostalCode').val(),
                cnic: $('#shipperCnic').val(),
                ntn: $('#shipperNtn').val(),
                email: $('#shipperEmail').val(),
                contact: '+92' + $('#shipperContact').val()
            },
            
            shipment: {
                pieces: parseInt($('#pieces').val()) || 1,
                weight: parseFloat($('#weight').val()) || 0,
                dimensions: {
                    length: parseFloat($('#length').val()) || 0,
                    width: parseFloat($('#width').val()) || 0,
                    height: parseFloat($('#height').val()) || 0
                },
                volumetricWeight: parseFloat($('#volumetricWeight').val()) || 0,
                chargeableWeight: parseFloat($('#chargeableWeight').val()) || 0,
                shipmentType: $('#shipmentType').val(),
                contents: $('#contents').val()
            },
            
            paymentMode: $('input[name="paymentMode"]:checked').val(),
            shipmentCharges: parseFloat($('#shipmentCharges').val()) || 0,
            additionalCharges: charges,
            taxes: window.bookingCalculation ? window.bookingCalculation.taxBreakdown || [] : [],
            subtotal: window.bookingCalculation ? window.bookingCalculation.subtotal || 0 : 0,
            taxAmount: window.bookingCalculation ? window.bookingCalculation.totalTax || 0 : 0,
            grandTotal: window.bookingCalculation ? window.bookingCalculation.grandTotal || 0 : 0,
            
            consignee: {
                destination: $('#destination').val(),
                name: $('#consigneeName').val(),
                company: $('#consigneeCompany').val(),
                address: $('#consigneeAddress').val(),
                country: consigneeCountryName,
                city: $('#consigneeCity').val(),
                state: $('#consigneeState').val(),
                postalCode: $('#consigneePostalCode').val(),
                email: $('#consigneeEmail').val(),
                contact: $('#consigneeContact').val(),
                taxDetails: $('#consigneeTax').val()
            },
            
            optionalServices: {
                reference: $('#shipmentReference').val(),
                declaredValue: parseFloat($('#declaredValue').val()) || 0,
                insurance: parseFloat($('#insuranceAmount').val()) || 0,
                thirdPartyNo: $('#thirdPartyNo').val(),
                itemsDescription: $('#itemsDescription').val()
            },
            
            items: items,
            itemsSubtotalUSD: parseFloat($('#itemsSubtotal').text()) || 0,
            
            tcAccepted: $('#acceptTC').is(':checked'),
            tcVersion: tcData ? tcData.version : '',
            undertakingAccepted: $('#acceptUndertaking').is(':checked'),
            undertakingCode: undertakingData ? undertakingData.code : '',
            
            status: isDraft ? 'Draft' : 'Booked',
            createdAt: new Date().toISOString(),
            lastUpdated: new Date().toISOString()
        };
        
        // Populate and show confirmation modal
        populateConfirmationModal(window.pendingBookingData);
        new bootstrap.Modal(document.getElementById('bookingConfirmModal')).show();
        
    } catch (error) {
        console.error("❌ Error preparing confirmation:", error);
        showErrorModal('Failed to prepare booking: ' + error.message);
    }
}

// ============================================
// 🔥 POPULATE CONFIRMATION MODAL
// ============================================
function populateConfirmationModal(data) {
    console.log("📋 Populating confirmation modal...");
    
    $('#confirmAWB').text(data.awbNumber);
    $('#confirmPI').text(data.piNumber);
    $('#confirmDate').text(data.bookingDate);
    $('#confirmService').text(data.serviceType);
    
    $('#confirmShipperName').text(data.shipper.name || '-');
    $('#confirmShipperCompany').text(data.shipper.company || '-');
    $('#confirmShipperCity').text(data.shipper.city || '-');
    $('#confirmShipperCountry').text(data.shipper.country || '-');
    $('#confirmShipperContact').text(data.shipper.contact || '-');
    $('#confirmShipperCnic').text(data.shipper.cnic || '-');
    
    $('#confirmConsigneeName').text(data.consignee.name || '-');
    $('#confirmConsigneeCompany').text(data.consignee.company || '-');
    $('#confirmDestination').text(data.consignee.destination || '-');
    $('#confirmConsigneeCity').text(data.consignee.city || '-');
    $('#confirmConsigneeCountry').text(data.consignee.country || '-');
    $('#confirmConsigneeContact').text(data.consignee.contact || '-');
    $('#confirmConsigneeAddress').text(data.consignee.address || '-');
    
    $('#confirmPieces').text(data.shipment.pieces);
    $('#confirmWeight').text(data.shipment.weight + ' KG');
    $('#confirmDimensions').text(`${data.shipment.dimensions.length} × ${data.shipment.dimensions.width} × ${data.shipment.dimensions.height} CM`);
    $('#confirmVolumetric').text(data.shipment.volumetricWeight + ' KG');
    $('#confirmChargeable').text(data.shipment.chargeableWeight + ' KG');
    $('#confirmShipmentType').text(data.shipment.shipmentType);
    
    $('#confirmItemCount').text(data.items.length);
    const $itemsBody = $('#confirmItemsBody').empty();
    data.items.forEach(item => {
        $itemsBody.append(`
            <tr>
                <td>${item.sno}</td>
                <td>${item.name}</td>
                <td>${item.hsCode}</td>
                <td>${item.quantity}</td>
                <td>${item.unitValue.toFixed(2)}</td>
                <td>${item.subtotal.toFixed(2)}</td>
            </tr>
        `);
    });
    $('#confirmItemsSubtotal').text(data.itemsSubtotalUSD.toFixed(2));
    
    $('#confirmBaseCharges').text('PKR ' + data.shipmentCharges.toFixed(2));
    
    const $additionalCharges = $('#confirmAdditionalCharges').empty();
    if (data.additionalCharges.length > 0) {
        data.additionalCharges.forEach(charge => {
            $additionalCharges.append(`
                <div class="confirm-charge-row">
                    <span>${charge.chargeName}:</span>
                    <span>PKR ${charge.amount.toFixed(2)}</span>
                </div>
            `);
        });
    }
    
    $('#confirmSubtotal').text('PKR ' + data.subtotal.toFixed(2));
    
    const $taxes = $('#confirmTaxes').empty();
    if (data.taxes.length > 0) {
        data.taxes.forEach(tax => {
            $taxes.append(`
                <div class="confirm-charge-row">
                    <span>${tax.name} (${tax.rate}%):</span>
                    <span>PKR ${tax.amount.toFixed(2)}</span>
                </div>
            `);
        });
    }
    
    $('#confirmGrandTotal').text('PKR ' + data.grandTotal.toFixed(2));
    $('#confirmPaymentMode').text(data.paymentMode);
    
    console.log("✅ Confirmation modal populated");
}

// ============================================
// 🔥 ACTUAL SAVE (after confirmation)
// ============================================
async function confirmAndSaveBooking() {
    const $btn = $('#btnConfirmSave');
    const $btnText = $btn.find('.btn-text');
    const $btnLoader = $btn.find('.btn-loader');
    
    $btn.prop('disabled', true);
    $btnText.addClass('d-none');
    $btnLoader.removeClass('d-none');
    
    try {
        const adminUser = FirebaseAuth.getCurrentUser();
        if (!adminUser) throw new Error('Admin session expired. Please login again.');
        
        window.pendingBookingData.createdBy = adminUser.uid;
        window.pendingBookingData.createdByEmail = adminUser.email;
        
        console.log("💾 Saving booking to Firebase...");
        console.log("AWB:", window.pendingBookingData.awbNumber);
        console.log("PI:", window.pendingBookingData.piNumber);
        
        await FirebaseDB.push('shipments', window.pendingBookingData);
        console.log("✅ Booking saved successfully");
        
        try {
            await FirebaseDB.commitAWBNumber();
            await FirebaseDB.commitPINumber();
            console.log("✅ AWB and PI counters committed");
        } catch (commitError) {
            console.error("⚠️ Warning: Could not commit counters:", commitError);
        }
        
        window.currentBooking = window.pendingBookingData;
        
        bootstrap.Modal.getInstance(document.getElementById('bookingConfirmModal')).hide();
        
        $('#successAWB').text(window.pendingBookingData.awbNumber);
        $('#successPI').text(window.pendingBookingData.piNumber);
        $('#successTotal').text('PKR ' + window.pendingBookingData.grandTotal.toFixed(2));
        
        new bootstrap.Modal(document.getElementById('bookingSuccessModal')).show();
        
        window.pendingBookingData = null;
        
    } catch (error) {
        console.error("❌ Error saving booking:", error);
        showErrorModal('Failed to save booking: ' + (error.message || 'Unknown error'));
    } finally {
        $btn.prop('disabled', false);
        $btnText.removeClass('d-none');
        $btnLoader.addClass('d-none');
    }
}

// ============================================
// 🔥 VALIDATION (IMPROVED)
// ============================================
function validateForm() {
    const errors = [];
    
    // Booking Info
    if (!$('#bookingDate').val()) errors.push('📅 Booking Date is required');
    
    // Customer
    if (!$('#customerType').val()) errors.push('👤 Customer Type is required');
    if ($('#customerType').val() === 'Account' && !$('#accountNumber').val()) {
        errors.push('🔢 Account Number is required for Account customers');
    }
    
    // Shipper
    if (!$('#shipperName').val().trim()) errors.push('👤 Shipper Name is required');
    if (!$('#shipperCity').val().trim()) errors.push('🏙️ Shipper City is required');
    if (!$('#shipperContact').val().trim()) errors.push('📞 Shipper Contact is required');
    
    // Shipment
    if (!$('#pieces').val() || parseInt($('#pieces').val()) < 1) errors.push('📦 Pieces must be at least 1');
    if (!$('#weight').val() || parseFloat($('#weight').val()) <= 0) errors.push('⚖️ Weight is required and must be greater than 0');
    
    // Charges
    if ($('#shipmentCharges').val() === '' || parseFloat($('#shipmentCharges').val()) < 0) {
        errors.push('💰 Shipment Charges is required');
    }
    
    // Consignee
    if (!$('#destination').val().trim()) errors.push('📍 Destination is required');
    if (!$('#consigneeName').val().trim()) errors.push('👤 Consignee Name is required');
    if (!$('#consigneeAddress').val().trim()) errors.push('🏠 Consignee Address is required');
    if (!$('#consigneeCountry').val()) errors.push('🌍 Consignee Country is required');
    if (!$('#consigneeCity').val()) errors.push('🏙️ Consignee City is required');
    if (!$('#consigneeContact').val().trim()) errors.push('📞 Consignee Contact is required');
    
    // Legal
    if (!$('#acceptTC').is(':checked')) errors.push('✅ You must accept Terms & Conditions');
    if ($('#undertakingSection').is(':visible') && !$('#acceptUndertaking').is(':checked')) {
        errors.push('✅ You must accept the Undertaking');
    }
    
    return errors;
}

// ============================================
// 🔥 PRINT BOOKING
// ============================================
function printBooking() {
    if (!window.currentBooking) {
        showErrorModal('No booking data available for printing');
        return;
    }
    
    const b = window.currentBooking;
    const printContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>AWB: ${b.awbNumber} | PI: ${b.piNumber}</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 2rem; }
                .header { text-align: center; border-bottom: 3px solid #dc2626; padding-bottom: 1rem; margin-bottom: 2rem; }
                .header h1 { color: #dc2626; margin: 0; }
                .numbers { display: flex; justify-content: space-around; background: #f3f4f6; padding: 1rem; margin: 1rem 0; border-radius: 8px; }
                .number-box { text-align: center; }
                .number-box .label { font-size: 0.85rem; color: #6b7280; }
                .number-box .value { font-size: 1.5rem; font-weight: 700; color: #dc2626; font-family: monospace; }
                .section { margin-bottom: 1.5rem; }
                .section h3 { background: #dc2626; color: white; padding: 0.5rem 1rem; margin: 0 0 0.5rem 0; border-radius: 4px; }
                .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; }
                .field { padding: 0.25rem 0; }
                .field .label { font-size: 0.8rem; color: #6b7280; }
                .field .value { font-weight: 600; }
                table { width: 100%; border-collapse: collapse; margin-top: 0.5rem; }
                th, td { border: 1px solid #d1d5db; padding: 0.5rem; text-align: left; font-size: 0.85rem; }
                th { background: #f3f4f6; }
                .total-box { background: #fef3c7; padding: 1rem; border-radius: 8px; margin-top: 1rem; text-align: right; }
                .total-box .grand { font-size: 1.5rem; font-weight: 700; color: #dc2626; }
                .signature { margin-top: 3rem; text-align: center; }
                .signature-line { border-top: 2px solid #000; width: 300px; margin: 0 auto 0.5rem; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>REX WORLDWIDE COURIER</h1>
                <p>Air Waybill / Proforma Invoice</p>
            </div>
            <div class="numbers">
                <div class="number-box"><div class="label">AWB Number</div><div class="value">${b.awbNumber}</div></div>
                <div class="number-box"><div class="label">PI Number</div><div class="value">${b.piNumber}</div></div>
                <div class="number-box"><div class="label">Booking Date</div><div class="value">${b.bookingDate}</div></div>
            </div>
            <div class="section">
                <h3>Shipper Details</h3>
                <div class="grid">
                    <div class="field"><div class="label">Name</div><div class="value">${b.shipper.name}</div></div>
                    <div class="field"><div class="label">Company</div><div class="value">${b.shipper.company || '-'}</div></div>
                    <div class="field"><div class="label">City</div><div class="value">${b.shipper.city}</div></div>
                    <div class="field"><div class="label">Country</div><div class="value">${b.shipper.country}</div></div>
                    <div class="field"><div class="label">Contact</div><div class="value">${b.shipper.contact}</div></div>
                    <div class="field"><div class="label">CNIC</div><div class="value">${b.shipper.cnic || '-'}</div></div>
                </div>
            </div>
            <div class="section">
                <h3>Consignee Details</h3>
                <div class="grid">
                    <div class="field"><div class="label">Name</div><div class="value">${b.consignee.name}</div></div>
                    <div class="field"><div class="label">Company</div><div class="value">${b.consignee.company || '-'}</div></div>
                    <div class="field"><div class="label">Destination</div><div class="value">${b.consignee.destination}</div></div>
                    <div class="field"><div class="label">City</div><div class="value">${b.consignee.city}</div></div>
                    <div class="field"><div class="label">Country</div><div class="value">${b.consignee.country}</div></div>
                    <div class="field"><div class="label">Contact</div><div class="value">${b.consignee.contact}</div></div>
                </div>
                <div class="field"><div class="label">Address</div><div class="value">${b.consignee.address}</div></div>
            </div>
            <div class="section">
                <h3>Shipment Details</h3>
                <div class="grid">
                    <div class="field"><div class="label">Pieces</div><div class="value">${b.shipment.pieces}</div></div>
                    <div class="field"><div class="label">Weight</div><div class="value">${b.shipment.weight} KG</div></div>
                    <div class="field"><div class="label">Chargeable Weight</div><div class="value">${b.shipment.chargeableWeight} KG</div></div>
                    <div class="field"><div class="label">Type</div><div class="value">${b.shipment.shipmentType}</div></div>
                </div>
            </div>
            <div class="section">
                <h3>Items</h3>
                <table>
                    <thead><tr><th>S.No</th><th>Item</th><th>HS Code</th><th>Origin</th><th>Qty</th><th>Unit (USD)</th><th>Sub Total (USD)</th></tr></thead>
                    <tbody>
                        ${b.items.map(item => `<tr><td>${item.sno}</td><td>${item.name || '-'}</td><td>${item.hsCode || '-'}</td><td>${item.origin}</td><td>${item.quantity}</td><td>${item.unitValue.toFixed(2)}</td><td>${item.subtotal.toFixed(2)}</td></tr>`).join('')}
                    </tbody>
                </table>
            </div>
            <div class="total-box">
                <div>Subtotal: PKR ${b.subtotal.toFixed(2)}</div>
                <div>Tax: PKR ${b.taxAmount.toFixed(2)}</div>
                <div class="grand">GRAND TOTAL: PKR ${b.grandTotal.toFixed(2)}</div>
            </div>
            <div class="signature"><div class="signature-line"></div><p>Shipper Signature</p></div>
        </body>
        </html>
    `;
    
    const printWindow = window.open('', '', 'width=900,height=700');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 500);
}

// ============================================
// 🔥 HELPERS
// ============================================
function showErrorModal(message) {
    $('#bookingErrorMessage').html(message);
    new bootstrap.Modal(document.getElementById('bookingErrorModal')).show();
}