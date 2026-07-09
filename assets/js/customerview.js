// assets/js/customerview.js
import { FirebaseDB } from "./firebase/firebase-crud.js";

// ============================================
// 🔥 ALL CUSTOMERS VIEW INITIALIZER
// ============================================
window.initCustomerView = function() {
    console.log("🚀 [customerview.js] initCustomerView() executed successfully!");
    console.log("👉 Initializing Customer List...");

    // 🔥 Initialize variables
    window.allCustomers = [];
    window.filteredCustomers = [];
    window.currentPage = 1;
    window.itemsPerPage = 100;

    // 🔥 Setup event listeners FIRST
    setupFilters();
    setupPagination();
    setupEditModal();

    // 🔥 Then load customers
    loadCustomers();
};

// ============================================
// 🔥 LOAD CUSTOMERS FROM FIREBASE
// ============================================
async function loadCustomers() {
    try {
        console.log("📥 Fetching customers from Firebase...");
        
        const customers = await FirebaseDB.getList('customers');
        
        console.log("📊 Raw data received:", customers);
        console.log("📊 Data type:", typeof customers);
        console.log("📊 Is array?", Array.isArray(customers));
        console.log("📊 Length:", customers ? customers.length : 'undefined');
        
        if (!Array.isArray(customers)) {
            console.error("❌ Data is not an array!", customers);
            showErrorModal('Invalid data format received from database');
            return;
        }
        
        window.allCustomers = customers;
        console.log("✅ Loaded", customers.length, "customers");
        
        // Update stats
        updateStats();
        
        // Apply filters and render
        applyFilters();
        
    } catch (error) {
        console.error("❌ Error loading customers:", error);
        console.error("❌ Error stack:", error.stack);
        showErrorModal('Failed to load customers: ' + error.message);
        
        // Show error in table
        $('#customerTableBody').html(`
            <tr>
                <td colspan="8" class="text-center py-5">
                    <i class="bi bi-exclamation-triangle text-danger" style="font-size: 3rem;"></i>
                    <p class="mt-3 text-danger">Error loading customers</p>
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
        const total = window.allCustomers.length;
        const active = window.allCustomers.filter(c => c.status === 'Active').length;
        const account = window.allCustomers.filter(c => c.customerType === 'Account').length;
        const cash = window.allCustomers.filter(c => c.customerType === 'Cash').length;

        $('#statTotal').text(total);
        $('#statActive').text(active);
        $('#statAccount').text(account);
        $('#statCash').text(cash);
        
        console.log("📊 Stats updated:", { total, active, account, cash });
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
    $('#filterStatus, #filterType, #filterProvince, #filterFiler').on('change', applyFilters);

    // Clear filters
    $('#btnClearFilters').on('click', function() {
        $('#searchInput').val('');
        $('#filterStatus, #filterType, #filterProvince, #filterFiler').val('');
        applyFilters();
    });
}

// ============================================
// 🔥 APPLY FILTERS & SEARCH
// ============================================
function applyFilters() {
    try {
        console.log("🔍 Applying filters...");
        console.log("🔍 Total customers:", window.allCustomers.length);
        
        const search = $('#searchInput').val().toLowerCase().trim();
        const status = $('#filterStatus').val();
        const type = $('#filterType').val();
        const province = $('#filterProvince').val();
        const filer = $('#filterFiler').val();

        console.log("🔍 Filter values:", { search, status, type, province, filer });

        window.filteredCustomers = window.allCustomers.filter(customer => {
            // Search filter
            if (search) {
                const searchFields = [
                    customer.accountNumber,
                    customer.customerName,
                    customer.businessName,
                    customer.contactNumber,
                    customer.cnicNumber,
                    customer.email
                ].map(f => (f || '').toLowerCase());
                
                if (!searchFields.some(f => f.includes(search))) {
                    return false;
                }
            }

            // Status filter
            if (status && customer.status !== status) return false;

            // Type filter
            if (type && customer.customerType !== type) return false;

            // Province filter
            if (province && customer.province !== province) return false;

            // Filer filter
            if (filer && customer.filerStatus !== filer) return false;

            return true;
        });

        console.log("🔍 Filtered customers:", window.filteredCustomers.length);

        // Reset to page 1
        window.currentPage = 1;
        
        // Render table
        renderTable();
        renderPagination();
        
    } catch (error) {
        console.error("❌ Error applying filters:", error);
        console.error("❌ Error stack:", error.stack);
    }
}

// ============================================
// 🔥 RENDER TABLE
// ============================================
function renderTable() {
    try {
        console.log("📋 Rendering table...");
        console.log("📋 Current page:", window.currentPage);
        console.log("📋 Items per page:", window.itemsPerPage);
        console.log("📋 Filtered customers:", window.filteredCustomers.length);
        
        const start = (window.currentPage - 1) * window.itemsPerPage;
        const end = start + window.itemsPerPage;
        const pageCustomers = window.filteredCustomers.slice(start, end);

        console.log("📋 Page customers:", pageCustomers.length);

        // Update showing info
        $('#showingFrom').text(window.filteredCustomers.length > 0 ? start + 1 : 0);
        $('#showingTo').text(Math.min(end, window.filteredCustomers.length));
        $('#showingTotal').text(window.filteredCustomers.length);

        // Render rows
        const $tbody = $('#customerTableBody');
        $tbody.empty();

        if (pageCustomers.length === 0) {
            console.log("📋 No customers to display");
            $tbody.html(`
                <tr>
                    <td colspan="8" class="text-center py-5">
                        <i class="bi bi-inbox" style="font-size: 3rem; color: #d1d5db;"></i>
                        <p class="mt-3 text-muted">No customers found</p>
                    </td>
                </tr>
            `);
            return;
        }

        console.log("📋 Rendering", pageCustomers.length, "rows");

        pageCustomers.forEach((customer, index) => {
            console.log(`📋 Rendering row ${index + 1}:`, customer.customerName);
            
            const statusBadge = customer.status === 'Active' 
                ? '<span class="badge-status badge-active"><i class="bi bi-check-circle"></i> Active</span>'
                : '<span class="badge-status badge-inactive"><i class="bi bi-x-circle"></i> Inactive</span>';

            const typeBadge = customer.customerType === 'Account'
                ? '<span class="badge-status badge-account"><i class="bi bi-briefcase"></i> Account</span>'
                : '<span class="badge-status badge-cash"><i class="bi bi-cash"></i> Cash</span>';

            const contact = customer.contactNumber 
                ? customer.contactNumber.replace('+92', '0')
                : '-';

            const row = `
                <tr>
                    <td class="ps-4"><strong>${customer.accountNumber || '-'}</strong></td>
                    <td>${customer.customerName || '-'}</td>
                    <td>${customer.businessName || '-'}</td>
                    <td>${contact}</td>
                    <td>${typeBadge}</td>
                    <td>${customer.province || '-'}</td>
                    <td>${statusBadge}</td>
                    <td class="text-center pe-4">
                        <div class="action-buttons">
                            <button class="btn-action btn-edit" onclick="editCustomer('${customer.id}')" title="Edit">
                                <i class="bi bi-pencil"></i>
                            </button>
                            <button class="btn-action btn-view" onclick="viewCustomer('${customer.id}')" title="View">
                                <i class="bi bi-eye"></i>
                            </button>
                            <button class="btn-action btn-delete" onclick="deleteCustomer('${customer.id}')" title="Delete">
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
        console.error("❌ Error stack:", error.stack);
        $('#customerTableBody').html(`
            <tr>
                <td colspan="8" class="text-center py-5">
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
    const totalPages = Math.ceil(window.filteredCustomers.length / window.itemsPerPage);
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

    // CNIC auto-formatting in edit modal
    $('#editCnicNumber').on('input', function() {
        let value = $(this).val().replace(/\D/g, '');
        if (value.length > 5) value = value.slice(0, 5) + '-' + value.slice(5);
        if (value.length > 13) value = value.slice(0, 13) + '-' + value.slice(13);
        if (value.length > 15) value = value.slice(0, 15);
        $(this).val(value);
    });

    // Customer type toggle (show/hide credit limit)
    $('#editCustomerType').on('change', function() {
        if ($(this).val() === 'Account') {
            $('#editCreditLimitSection').show();
        } else {
            $('#editCreditLimitSection').hide();
        }
    });
}

// ============================================
// 🔥 EDIT CUSTOMER (Called from table)
// ============================================
window.editCustomer = async function(customerId) {
    try {
        console.log("📝 Editing customer:", customerId);
        
        const customer = await FirebaseDB.get(`customers/${customerId}`);
        if (!customer) {
            showErrorModal('Customer not found');
            return;
        }

        // Populate form
        $('#editCustomerId').val(customerId);
        $('#editAccountNumber').val(customer.accountNumber);
        $('#editCustomerType').val(customer.customerType);
        $('#editStatus').val(customer.status);
        $('#editCategory').val(customer.customerCategory);
        $('#editProvince').val(customer.province);
        $('#editFilerStatus').val(customer.filerStatus);
        $('#editCustomerName').val(customer.customerName);
        $('#editBusinessName').val(customer.businessName);
        $('#editCnicNumber').val(customer.cnicNumber);
        $('#editNtnNumber').val(customer.ntnNumber);
        $('#editEmail').val(customer.email);
        $('#editContactNumber').val(customer.contactNumber ? customer.contactNumber.replace('+92', '') : '');
        $('#editWhatsappNumber').val(customer.whatsappNumber ? customer.whatsappNumber.replace('+92', '') : '');
        $('#editAddress').val(customer.address);
        $('#editCity').val(customer.city);
        $('#editState').val(customer.state);
        $('#editCountry').val(customer.country);
        $('#editCreditLimit').val(customer.creditLimit);
        $('#editCurrentBalance').val(customer.currentBalance);
        $('#editNotes').val(customer.notes);

        // Show/hide credit limit section
        if (customer.customerType === 'Account') {
            $('#editCreditLimitSection').show();
        } else {
            $('#editCreditLimitSection').hide();
        }

        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('editCustomerModal'));
        modal.show();

    } catch (error) {
        console.error("❌ Error loading customer:", error);
        showErrorModal('Failed to load customer: ' + error.message);
    }
};

// ============================================
// 🔥 SAVE EDIT
// ============================================
async function saveEdit() {
    const customerId = $('#editCustomerId').val();
    const customerName = $('#editCustomerName').val().trim();
    const customerType = $('#editCustomerType').val();

    // Validation
    if (!customerName) {
        showErrorModal('Customer Name is required');
        return;
    }

    const $btn = $('#btnSaveEdit');
    const $btnText = $btn.find('.btn-text');
    const $btnLoader = $btn.find('.btn-loader');

    $btn.prop('disabled', true);
    $btnText.addClass('d-none');
    $btnLoader.removeClass('d-none');

    try {
        console.log("💾 Updating customer...");

        const updateData = {
            customerName: customerName,
            businessName: $('#editBusinessName').val().trim(),
            customerType: customerType,
            status: $('#editStatus').val(),
            customerCategory: $('#editCategory').val(),
            province: $('#editProvince').val(),
            filerStatus: $('#editFilerStatus').val(),
            cnicNumber: $('#editCnicNumber').val().trim(),
            ntnNumber: $('#editNtnNumber').val().trim(),
            email: $('#editEmail').val().trim(),
            contactNumber: $('#editContactNumber').val().trim() ? '+92' + $('#editContactNumber').val().trim() : '',
            whatsappNumber: $('#editWhatsappNumber').val().trim() ? '+92' + $('#editWhatsappNumber').val().trim() : '',
            address: $('#editAddress').val().trim(),
            city: $('#editCity').val().trim(),
            state: $('#editState').val().trim(),
            country: $('#editCountry').val().trim(),
            creditLimit: customerType === 'Account' ? (parseFloat($('#editCreditLimit').val()) || 0) : 0,
            notes: $('#editNotes').val().trim(),
            lastUpdated: new Date().toISOString()
        };

        await FirebaseDB.update(`customers/${customerId}`, updateData);
        console.log("✅ Customer updated");

        // Close edit modal
        bootstrap.Modal.getInstance(document.getElementById('editCustomerModal')).hide();

        // Show success modal
        const successModal = new bootstrap.Modal(document.getElementById('editSuccessModal'));
        successModal.show();

        // Reload customers
        await loadCustomers();

    } catch (error) {
        console.error("❌ Error updating customer:", error);
        showErrorModal('Failed to update customer: ' + error.message);
    } finally {
        $btn.prop('disabled', false);
        $btnText.removeClass('d-none');
        $btnLoader.addClass('d-none');
    }
}

// ============================================
// 🔥 VIEW CUSTOMER (Placeholder)
// ============================================
window.viewCustomer = function(customerId) {
    console.log("👁️ View customer:", customerId);
    alert('View customer details - Coming soon!');
};

// ============================================
// 🔥 DELETE CUSTOMER (Placeholder)
// ============================================
window.deleteCustomer = function(customerId) {
    console.log("🗑️ Delete customer:", customerId);
    if (confirm('Are you sure you want to delete this customer?')) {
        alert('Delete customer - Coming soon!');
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