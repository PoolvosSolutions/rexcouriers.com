// assets/js/carrierview.js
import { FirebaseDB } from "./firebase/firebase-crud.js";

// ============================================
// 🔥 ALL CARRIERS VIEW INITIALIZER
// ============================================
window.initCarrierView = function() {
    console.log("🚀 [carrierview.js] initCarrierView() executed successfully!");
    console.log("👉 Initializing Carrier List...");

    // 🔥 Initialize variables
    window.allCarriers = [];
    window.filteredCarriers = [];
    window.currentPage = 1;
    window.itemsPerPage = 100;

    // 🔥 Setup event listeners FIRST
    setupFilters();
    setupPagination();
    setupEditModal();

    // 🔥 Then load carriers
    loadCarriers();
};

// ============================================
// 🔥 LOAD CARRIERS FROM FIREBASE
// ============================================
async function loadCarriers() {
    try {
        console.log("📥 Fetching carriers from Firebase...");
        
        const carriers = await FirebaseDB.getList('carriers');
        
        console.log("📊 Raw data received:", carriers);
        
        if (!Array.isArray(carriers)) {
            console.error("❌ Data is not an array!", carriers);
            showErrorModal('Invalid data format received from database');
            return;
        }
        
        window.allCarriers = carriers;
        console.log("✅ Loaded", carriers.length, "carriers");
        
        // Update stats
        updateStats();
        
        // Apply filters and render
        applyFilters();
        
    } catch (error) {
        console.error("❌ Error loading carriers:", error);
        showErrorModal('Failed to load carriers: ' + error.message);
        
        $('#carrierTableBody').html(`
            <tr>
                <td colspan="9" class="text-center py-5">
                    <i class="bi bi-exclamation-triangle text-danger" style="font-size: 3rem;"></i>
                    <p class="mt-3 text-danger">Error loading carriers</p>
                    <p class="text-muted small">${error.message}</p>
                </td>
            </tr>
        `);
    }
}

// ============================================
// 🔥 UPDATE STATS CARDS
// ============================================
function updateStats() {
    try {
        const total = window.allCarriers.length;
        const active = window.allCarriers.filter(c => c.status === 'Active').length;
        const international = window.allCarriers.filter(c => 
            c.carrierType === 'International' || c.carrierType === 'Both'
        ).length;
        const domestic = window.allCarriers.filter(c => 
            c.carrierType === 'Domestic' || c.carrierType === 'Both'
        ).length;

        $('#statTotal').text(total);
        $('#statActive').text(active);
        $('#statInternational').text(international);
        $('#statDomestic').text(domestic);
        
        console.log("📊 Stats updated:", { total, active, international, domestic });
    } catch (error) {
        console.error("❌ Error updating stats:", error);
    }
}

// ============================================
// 🔥 SETUP FILTERS
// ============================================
function setupFilters() {
    console.log("🔧 Setting up filters...");
    
    // Search input
    $('#searchInput').on('input', debounce(applyFilters, 300));

    // Filter dropdowns
    $('#filterStatus, #filterType, #filterPriority, #filterPayment').on('change', applyFilters);

    // Clear filters
    $('#btnClearFilters').on('click', function() {
        $('#searchInput').val('');
        $('#filterStatus, #filterType, #filterPriority, #filterPayment').val('');
        applyFilters();
    });
}

// ============================================
// 🔥 APPLY FILTERS & SEARCH
// ============================================
function applyFilters() {
    try {
        const search = $('#searchInput').val().toLowerCase().trim();
        const status = $('#filterStatus').val();
        const type = $('#filterType').val();
        const priority = $('#filterPriority').val();
        const payment = $('#filterPayment').val();

        window.filteredCarriers = window.allCarriers.filter(carrier => {
            // Search filter
            if (search) {
                const searchFields = [
                    carrier.carrierName,
                    carrier.carrierCode,
                    carrier.contactPerson,
                    carrier.contactNumber,
                    carrier.contactEmail
                ].map(f => (f || '').toLowerCase());
                
                if (!searchFields.some(f => f.includes(search))) {
                    return false;
                }
            }

            // Status filter
            if (status && carrier.status !== status) return false;

            // Type filter
            if (type && carrier.carrierType !== type) return false;

            // Priority filter
            if (priority && carrier.priority != priority) return false;

            // Payment filter
            if (payment && carrier.paymentTerms !== payment) return false;

            return true;
        });

        // Reset to page 1
        window.currentPage = 1;
        
        // Render table
        renderTable();
        renderPagination();
        
    } catch (error) {
        console.error("❌ Error applying filters:", error);
    }
}

// ============================================
// 🔥 RENDER TABLE
// ============================================
function renderTable() {
    try {
        const start = (window.currentPage - 1) * window.itemsPerPage;
        const end = start + window.itemsPerPage;
        const pageCarriers = window.filteredCarriers.slice(start, end);

        // Update showing info
        $('#showingFrom').text(window.filteredCarriers.length > 0 ? start + 1 : 0);
        $('#showingTo').text(Math.min(end, window.filteredCarriers.length));
        $('#showingTotal').text(window.filteredCarriers.length);

        // Render rows
        const $tbody = $('#carrierTableBody');
        $tbody.empty();

        if (pageCarriers.length === 0) {
            $tbody.html(`
                <tr>
                    <td colspan="9" class="text-center py-5">
                        <i class="bi bi-inbox" style="font-size: 3rem; color: #d1d5db;"></i>
                        <p class="mt-3 text-muted">No carriers found</p>
                    </td>
                </tr>
            `);
            return;
        }

        pageCarriers.forEach(carrier => {
            const statusBadge = carrier.status === 'Active' 
                ? '<span class="badge-status badge-active"><i class="bi bi-check-circle"></i> Active</span>'
                : '<span class="badge-status badge-inactive"><i class="bi bi-x-circle"></i> Inactive</span>';

            let typeBadge = '';
            if (carrier.carrierType === 'International') {
                typeBadge = '<span class="badge-status badge-international"><i class="bi bi-globe-americas"></i> International</span>';
            } else if (carrier.carrierType === 'Domestic') {
                typeBadge = '<span class="badge-status badge-domestic"><i class="bi bi-truck"></i> Domestic</span>';
            } else if (carrier.carrierType === 'Both') {
                typeBadge = '<span class="badge-status badge-both"><i class="bi bi-globe"></i> Both</span>';
            }

            const priorityBadge = `<span class="priority-badge priority-${carrier.priority || 3}">
                <i class="bi bi-star-fill"></i> ${carrier.priority || 3}
            </span>`;

            const contact = carrier.contactNumber 
                ? carrier.contactNumber.replace('+92', '0')
                : '-';

            const row = `
                <tr>
                    <td class="ps-4"><strong>${carrier.carrierCode || '-'}</strong></td>
                    <td>${carrier.carrierName || '-'}</td>
                    <td>${typeBadge}</td>
                    <td>${carrier.contactPerson || '-'}</td>
                    <td>${contact}</td>
                    <td>${priorityBadge}</td>
                    <td>${carrier.paymentTerms || '-'}</td>
                    <td>${statusBadge}</td>
                    <td class="text-center pe-4">
                        <div class="action-buttons">
                            <button class="btn-action btn-edit" onclick="editCarrier('${carrier.id}')" title="Edit">
                                <i class="bi bi-pencil"></i>
                            </button>
                            <button class="btn-action btn-view" onclick="viewCarrier('${carrier.id}')" title="View">
                                <i class="bi bi-eye"></i>
                            </button>
                            <button class="btn-action btn-delete" onclick="deleteCarrier('${carrier.id}')" title="Delete">
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
            $tbody.append(row);
        });
        
        console.log("✅ Table rendered successfully");
        
    } catch (error) {
        console.error("❌ Error rendering table:", error);
        $('#carrierTableBody').html(`
            <tr>
                <td colspan="9" class="text-center py-5">
                    <i class="bi bi-exclamation-triangle text-danger" style="font-size: 3rem;"></i>
                    <p class="mt-3 text-danger">Error rendering table</p>
                    <p class="text-muted small">${error.message}</p>
                </td>
            </tr>
        `);
    }
}

// ============================================
// 🔥 SETUP PAGINATION
// ============================================
function setupPagination() {
    $('#itemsPerPage').on('change', function() {
        window.itemsPerPage = parseInt($(this).val());
        window.currentPage = 1;
        renderTable();
        renderPagination();
    });
}

// ============================================
// 🔥 RENDER PAGINATION
// ============================================
function renderPagination() {
    const totalPages = Math.ceil(window.filteredCarriers.length / window.itemsPerPage);
    const $container = $('#paginationContainer');
    $container.empty();

    if (totalPages <= 1) return;

    // Previous button
    $container.append(`
        <li class="page-item ${window.currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" data-page="${window.currentPage - 1}">Previous</a>
        </li>
    `);

    // Page numbers
    const maxVisible = 5;
    let startPage = Math.max(1, window.currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage < maxVisible - 1) {
        startPage = Math.max(1, endPage - maxVisible + 1);
    }

    if (startPage > 1) {
        $container.append(`<li class="page-item"><a class="page-link" href="#" data-page="1">1</a></li>`);
        if (startPage > 2) {
            $container.append(`<li class="page-item disabled"><span class="page-link">...</span></li>`);
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        $container.append(`
            <li class="page-item ${i === window.currentPage ? 'active' : ''}">
                <a class="page-link" href="#" data-page="${i}">${i}</a>
            </li>
        `);
    }

    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            $container.append(`<li class="page-item disabled"><span class="page-link">...</span></li>`);
        }
        $container.append(`<li class="page-item"><a class="page-link" href="#" data-page="${totalPages}">${totalPages}</a></li>`);
    }

    // Next button
    $container.append(`
        <li class="page-item ${window.currentPage === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#" data-page="${window.currentPage + 1}">Next</a>
        </li>
    `);

    // Click handler
    $container.find('.page-link').on('click', function(e) {
        e.preventDefault();
        const page = parseInt($(this).data('page'));
        if (page && page !== window.currentPage) {
            window.currentPage = page;
            renderTable();
            renderPagination();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
}

// ============================================
// 🔥 SETUP EDIT MODAL
// ============================================
function setupEditModal() {
    // Save button
    $('#btnSaveEdit').on('click', saveEdit);

    // Carrier code auto-uppercase
    $('#editCarrierCode').on('input', function() {
        $(this).val($(this).val().toUpperCase());
    });
}

// ============================================
// 🔥 EDIT CARRIER (Called from table)
// ============================================
window.editCarrier = async function(carrierId) {
    try {
        console.log("📝 Editing carrier:", carrierId);
        
        const carrier = await FirebaseDB.get(`carriers/${carrierId}`);
        if (!carrier) {
            showErrorModal('Carrier not found');
            return;
        }

        // Populate form
        $('#editCarrierId').val(carrierId);
        $('#editCarrierName').val(carrier.carrierName);
        $('#editCarrierCode').val(carrier.carrierCode);
        $('#editCarrierType').val(carrier.carrierType);
        $('#editStatus').val(carrier.status);
        $('#editPriority').val(carrier.priority || 3);
        $('#editWebsite').val(carrier.website);
        
        $('#editContactPerson').val(carrier.contactPerson);
        $('#editDesignation').val(carrier.contactDesignation);
        $('#editContactNumber').val(carrier.contactNumber ? carrier.contactNumber.replace('+92', '') : '');
        $('#editContactEmail').val(carrier.contactEmail);
        $('#editWhatsappNumber').val(carrier.whatsappNumber ? carrier.whatsappNumber.replace('+92', '') : '');
        $('#editSupportNumber').val(carrier.supportNumber);
        $('#editSupportEmail').val(carrier.supportEmail);
        
        $('#editAddress').val(carrier.address);
        $('#editCity').val(carrier.city);
        $('#editState').val(carrier.state);
        $('#editCountry').val(carrier.country);
        
        $('#editAccountNumber').val(carrier.accountNumber);
        $('#editPaymentTerms').val(carrier.paymentTerms);
        $('#editBillingCycle').val(carrier.billingCycle);
        $('#editContractStartDate').val(carrier.contractStartDate);
        $('#editContractEndDate').val(carrier.contractEndDate);
        $('#editCreditLimit').val(carrier.creditLimit);
        
        $('#editApiEndpoint').val(carrier.apiEndpoint);
        $('#editApiKey').val(carrier.apiKey);
        $('#editApiPassword').val(carrier.apiPassword);
        $('#editTrackingUrlPattern').val(carrier.trackingUrlPattern);
        
        $('#editNotes').val(carrier.notes);

        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('editCarrierModal'));
        modal.show();

    } catch (error) {
        console.error("❌ Error loading carrier:", error);
        showErrorModal('Failed to load carrier: ' + error.message);
    }
};

// ============================================
// 🔥 SAVE EDIT
// ============================================
async function saveEdit() {
    const carrierId = $('#editCarrierId').val();
    const carrierName = $('#editCarrierName').val().trim();
    const carrierCode = $('#editCarrierCode').val().trim();
    const carrierType = $('#editCarrierType').val();
    const contactPerson = $('#editContactPerson').val().trim();
    const contactNumber = $('#editContactNumber').val().trim();

    // Validation
    if (!carrierName) {
        showErrorModal('Carrier Name is required');
        return;
    }
    if (!carrierCode) {
        showErrorModal('Carrier Code is required');
        return;
    }
    if (!contactPerson) {
        showErrorModal('Contact Person is required');
        return;
    }
    if (!contactNumber) {
        showErrorModal('Contact Number is required');
        return;
    }

    const $btn = $('#btnSaveEdit');
    const $btnText = $btn.find('.btn-text');
    const $btnLoader = $btn.find('.btn-loader');

    $btn.prop('disabled', true);
    $btnText.addClass('d-none');
    $btnLoader.removeClass('d-none');

    try {
        console.log("💾 Updating carrier...");

        const updateData = {
            carrierName: carrierName,
            carrierCode: carrierCode,
            carrierType: carrierType,
            status: $('#editStatus').val(),
            priority: parseInt($('#editPriority').val()),
            website: $('#editWebsite').val().trim(),
            
            contactPerson: contactPerson,
            contactDesignation: $('#editDesignation').val().trim(),
            contactNumber: '+92' + contactNumber,
            contactEmail: $('#editContactEmail').val().trim(),
            whatsappNumber: $('#editWhatsappNumber').val().trim() ? '+92' + $('#editWhatsappNumber').val().trim() : '',
            supportNumber: $('#editSupportNumber').val().trim(),
            supportEmail: $('#editSupportEmail').val().trim(),
            
            address: $('#editAddress').val().trim(),
            city: $('#editCity').val().trim(),
            state: $('#editState').val().trim(),
            country: $('#editCountry').val().trim(),
            
            accountNumber: $('#editAccountNumber').val().trim(),
            paymentTerms: $('#editPaymentTerms').val(),
            billingCycle: $('#editBillingCycle').val(),
            contractStartDate: $('#editContractStartDate').val(),
            contractEndDate: $('#editContractEndDate').val(),
            creditLimit: parseFloat($('#editCreditLimit').val()) || 0,
            
            apiEndpoint: $('#editApiEndpoint').val().trim(),
            apiKey: $('#editApiKey').val().trim(),
            apiPassword: $('#editApiPassword').val().trim(),
            trackingUrlPattern: $('#editTrackingUrlPattern').val().trim(),
            
            notes: $('#editNotes').val().trim(),
            lastUpdated: new Date().toISOString()
        };

        await FirebaseDB.update(`carriers/${carrierId}`, updateData);
        console.log("✅ Carrier updated");

        // Close edit modal
        bootstrap.Modal.getInstance(document.getElementById('editCarrierModal')).hide();

        // Show success modal
        const successModal = new bootstrap.Modal(document.getElementById('editSuccessModal'));
        successModal.show();

        // Reload carriers
        await loadCarriers();

    } catch (error) {
        console.error("❌ Error updating carrier:", error);
        showErrorModal('Failed to update carrier: ' + error.message);
    } finally {
        $btn.prop('disabled', false);
        $btnText.removeClass('d-none');
        $btnLoader.addClass('d-none');
    }
}

// ============================================
// 🔥 VIEW CARRIER (Placeholder)
// ============================================
window.viewCarrier = function(carrierId) {
    console.log("👁️ View carrier:", carrierId);
    alert('View carrier details - Coming soon!');
};

// ============================================
// 🔥 DELETE CARRIER (Placeholder)
// ============================================
window.deleteCarrier = function(carrierId) {
    console.log("🗑️ Delete carrier:", carrierId);
    if (confirm('Are you sure you want to delete this carrier?')) {
        alert('Delete carrier - Coming soon!');
    }
};

// ============================================
// 🔥 HELPER FUNCTIONS
// ============================================
function showErrorModal(message) {
    $('#editErrorMessage').text(message);
    const modal = new bootstrap.Modal(document.getElementById('editErrorModal'));
    modal.show();
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Close success modal
$(document).on('click', '#btnCloseSuccess', function() {
    bootstrap.Modal.getInstance(document.getElementById('editSuccessModal')).hide();
});