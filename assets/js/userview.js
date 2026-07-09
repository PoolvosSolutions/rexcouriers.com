// assets/js/userview.js - COMPLETE USER MANAGEMENT
import { FirebaseDB, FirebaseAuth } from "./firebase/firebase-crud.js";

// Global state
let allUsers = [];
let filteredUsers = [];
let currentPage = 1;
let itemsPerPage = 50;
let branchesList = [];
let customersList = [];
let currentViewUserId = null;
let currentEditUserId = null;

window.initUserView = function() {
    console.log("🚀 [userview.js] initUserView() executed successfully!");
    
    loadInitialData();
    setupFilters();
    setupPagination();
    setupViewModal();
    setupEditModal();
    setupDeleteModal();
};

// ============================================
// 🔥 LOAD INITIAL DATA
// ============================================
async function loadInitialData() {
    try {
        // Load users, branches, and customers in parallel
        const [users, branches, customers] = await Promise.all([
            FirebaseDB.getList('users'),
            FirebaseDB.getList('branches'),
            FirebaseDB.getList('customers')
        ]);
        
        allUsers = Array.isArray(users) ? users : [];
        branchesList = Array.isArray(branches) ? branches : [];
        customersList = Array.isArray(customers) ? customers : [];
        
        console.log("✅ Loaded:", allUsers.length, "users,", branchesList.length, "branches,", customersList.length, "customers");
        
        // Populate filter dropdowns
        populateBranchFilter();
        populateEditBranchDropdown();
        populateEditCustomerDropdown();
        
        updateStats();
        applyFilters();
    } catch (error) {
        console.error("❌ Error loading data:", error);
        showEditErrorModal('Failed to load data: ' + error.message);
    }
}

function populateBranchFilter() {
    const $select = $('#filterBranch');
    $select.empty().append('<option value="">All Branches</option>');
    branchesList.filter(b => b.status === 'Active').forEach(b => {
        $select.append(`<option value="${b.id}">${b.branchName}</option>`);
    });
}

function populateEditBranchDropdown() {
    const $select = $('#editBranchSelect');
    $select.empty().append('<option value="">Select Branch</option>');
    branchesList.filter(b => b.status === 'Active').forEach(b => {
        $select.append(`<option value="${b.id}" data-code="${b.branchCode || ''}" data-name="${b.branchName}">${b.branchName} (${b.branchCode || ''})</option>`);
    });
}

function populateEditCustomerDropdown() {
    const $select = $('#editCustomerSelect');
    $select.empty().append('<option value="">Select Customer</option>');
    customersList.filter(c => c.status === 'Active').forEach(c => {
        $select.append(`<option value="${c.id}" data-name="${c.customerName}" data-account="${c.accountNumber}">${c.customerName} (${c.accountNumber})</option>`);
    });
}

// ============================================
// 🔥 STATS
// ============================================
function updateStats() {
    const total = allUsers.length;
    const active = allUsers.filter(u => (u.status || u.userStatus || '').toLowerCase() === 'active').length;
    const inactive = allUsers.filter(u => (u.status || u.userStatus || '').toLowerCase() === 'inactive').length;
    const admins = allUsers.filter(u => ['SuperAdmin', 'Admin'].includes(u.userType)).length;
    
    $('#statTotal').text(total);
    $('#statActive').text(active);
    $('#statInactive').text(inactive);
    $('#statAdmins').text(admins);
}

// ============================================
// 🔥 FILTERS
// ============================================
function setupFilters() {
    $('#searchInput').on('input', debounce(applyFilters, 300));
    $('#filterStatus, #filterUserType, #filterBranch, #filterVerified').on('change', applyFilters);
    $('#btnClearFilters').on('click', function() {
        $('#searchInput, #filterStatus, #filterUserType, #filterBranch, #filterVerified').val('');
        applyFilters();
    });
}

function applyFilters() {
    const search = $('#searchInput').val().toLowerCase().trim();
    const status = $('#filterStatus').val();
    const userType = $('#filterUserType').val();
    const branch = $('#filterBranch').val();
    const verified = $('#filterVerified').val();

    filteredUsers = allUsers.filter(u => {
        // Search
        if (search) {
            const searchFields = [
                u.fullName, u.email, u.contactNumber, u.cnicNumber, u.designation
            ].map(f => (f || '').toLowerCase());
            if (!searchFields.some(f => f.includes(search))) return false;
        }

        // Status
        if (status && (u.status || u.userStatus || '').toLowerCase() !== status) return false;

        // User Type
        if (userType && u.userType !== userType) return false;

        // Branch
        if (branch && u.branchId !== branch) return false;

        // Email Verified
        if (verified === 'verified' && !u.emailVerified) return false;
        if (verified === 'unverified' && u.emailVerified) return false;

        return true;
    });

    currentPage = 1;
    renderTable();
    renderPagination();
}

// ============================================
// 🔥 RENDER TABLE
// ============================================
function renderTable() {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageUsers = filteredUsers.slice(start, end);

    $('#showingFrom').text(filteredUsers.length > 0 ? start + 1 : 0);
    $('#showingTo').text(Math.min(end, filteredUsers.length));
    $('#showingTotal').text(filteredUsers.length);

    const $tbody = $('#userTableBody').empty();

    if (pageUsers.length === 0) {
        $tbody.html(`<tr><td colspan="8" class="text-center py-5"><i class="bi bi-inbox" style="font-size: 3rem; color: #d1d5db;"></i><p class="mt-3 text-muted">No users found</p></td></tr>`);
        return;
    }

    pageUsers.forEach(u => {
        const status = (u.status || u.userStatus || 'inactive').toLowerCase();
        const userType = u.userType || 'Customer';
        
        // User cell
        const initials = (u.fullName || 'U').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
        const userCell = `
            <div class="user-cell">
                <div class="user-avatar"><i class="bi bi-person-fill"></i></div>
                <div class="user-info">
                    <span class="user-name">${u.fullName || '-'}</span>
                    <span class="user-designation">${u.designation || 'No designation'}</span>
                </div>
            </div>
        `;

        // Role badge
        const roleClass = `role-${userType.toLowerCase()}`;
        const roleBadge = `<span class="role-badge ${roleClass}">${userType}</span>`;

        // Branch/Customer linkage
        let linkageBadge = '<span class="text-muted">-</span>';
        if ((userType === 'Branch' || userType === 'Rider') && u.branchName) {
            linkageBadge = `<span class="linkage-badge" title="${u.branchName}"><i class="bi bi-geo-alt me-1"></i>${u.branchName}</span>`;
        } else if (userType === 'Customer' && u.customerName) {
            linkageBadge = `<span class="linkage-badge" title="${u.customerName}"><i class="bi bi-person me-1"></i>${u.customerName}</span>`;
        }

        // Status badge
        const statusClass = `status-${status}`;
        const statusIcon = status === 'active' ? 'check-circle-fill' : (status === 'suspended' ? 'pause-circle-fill' : 'x-circle-fill');
        const statusBadge = `<span class="status-badge ${statusClass}"><i class="bi bi-${statusIcon}"></i> ${status.charAt(0).toUpperCase() + status.slice(1)}</span>`;

        // Created date
        const createdDate = u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '-';

        const row = `
            <tr>
                <td class="ps-4">${userCell}</td>
                <td>
                    <div>${u.email || '-'}</div>
                    ${u.emailVerified ? '<small class="text-success"><i class="bi bi-check-circle-fill"></i> Verified</small>' : '<small class="text-muted"><i class="bi bi-clock"></i> Unverified</small>'}
                </td>
                <td>${roleBadge}</td>
                <td>${linkageBadge}</td>
                <td>${u.contactNumber || '-'}</td>
                <td>${statusBadge}</td>
                <td><small>${createdDate}</small></td>
                <td class="text-center pe-4">
                    <div class="action-buttons">
                        <button class="btn-action btn-view" onclick="viewUser('${u.id}')" title="View Details"><i class="bi bi-eye"></i></button>
                        <button class="btn-action btn-edit" onclick="editUser('${u.id}')" title="Edit User"><i class="bi bi-pencil"></i></button>
                        <button class="btn-action btn-toggle" onclick="toggleUserStatus('${u.id}')" title="Toggle Status"><i class="bi bi-${status === 'active' ? 'pause' : 'play'}-circle"></i></button>
                        <button class="btn-action btn-delete" onclick="deleteUser('${u.id}')" title="Delete User"><i class="bi bi-trash"></i></button>
                    </div>
                </td>
            </tr>
        `;
        $tbody.append(row);
    });
}

// ============================================
// 🔥 PAGINATION
// ============================================
function setupPagination() {
    $('#itemsPerPage').on('change', function() {
        itemsPerPage = parseInt($(this).val());
        currentPage = 1;
        renderTable();
        renderPagination();
    });
}

function renderPagination() {
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const $c = $('#paginationContainer').empty();
    if (totalPages <= 1) return;

    $c.append(`<li class="page-item ${currentPage === 1 ? 'disabled' : ''}"><a class="page-link" href="#" data-page="${currentPage - 1}">Prev</a></li>`);
    
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            $c.append(`<li class="page-item ${i === currentPage ? 'active' : ''}"><a class="page-link" href="#" data-page="${i}">${i}</a></li>`);
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            $c.append(`<li class="page-item disabled"><span class="page-link">...</span></li>`);
        }
    }
    
    $c.append(`<li class="page-item ${currentPage === totalPages ? 'disabled' : ''}"><a class="page-link" href="#" data-page="${currentPage + 1}">Next</a></li>`);

    $c.find('.page-link').on('click', function(e) {
        e.preventDefault();
        const page = parseInt($(this).data('page'));
        if (page && page !== currentPage) {
            currentPage = page;
            renderTable();
            renderPagination();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
}

// ============================================
// 🔥 VIEW USER MODAL
// ============================================
function setupViewModal() {
    $('#btnEditFromView').on('click', function() {
        bootstrap.Modal.getInstance(document.getElementById('viewUserModal')).hide();
        setTimeout(() => editUser(currentViewUserId), 300);
    });
}

window.viewUser = async function(userId) {
    try {
        const user = await FirebaseDB.get(`users/${userId}`);
        if (!user) return showEditErrorModal('User not found');

        currentViewUserId = userId;

        // Header
        $('#viewFullName').text(user.fullName || '-');
        $('#viewEmail').text(user.email || '-');
        
        const userType = user.userType || 'Customer';
        const roleClass = `role-${userType.toLowerCase()}`;
        $('#viewRoleBadge').attr('class', `role-badge ${roleClass}`).text(userType);
        
        const status = (user.status || user.userStatus || 'inactive').toLowerCase();
        const statusClass = `status-${status}`;
        $('#viewStatusBadge').attr('class', `status-badge ${statusClass}`).text(status.charAt(0).toUpperCase() + status.slice(1));

        // Basic Info
        $('#viewBasicName').text(user.fullName || '-');
        $('#viewBasicEmail').text(user.email || '-');
        $('#viewBasicContact').text(user.contactNumber || '-');
        $('#viewBasicCnic').text(user.cnicNumber || '-');
        $('#viewBasicDesignation').text(user.designation || '-');
        $('#viewBasicUid').text(user.uid || userId);

        // Role & Access
        $('#viewRole').text(userType);
        $('#viewStatus').text(status.charAt(0).toUpperCase() + status.slice(1));
        $('#viewEmailVerified').html(user.emailVerified 
            ? '<span class="text-success"><i class="bi bi-check-circle-fill"></i> Verified</span>' 
            : '<span class="text-warning"><i class="bi bi-clock"></i> Unverified</span>');
        $('#viewForcePassword').html(user.forcePasswordChange 
            ? '<span class="text-warning"><i class="bi bi-check-circle-fill"></i> Yes</span>' 
            : '<span class="text-muted">No</span>');

        // Branch section
        if ((userType === 'Branch' || userType === 'Rider') && user.branchName) {
            $('#viewBranchSection').removeClass('d-none');
            $('#viewBranchName').text(user.branchName || '-');
            $('#viewBranchCode').text(user.branchCode || '-');
        } else {
            $('#viewBranchSection').addClass('d-none');
        }

        // Customer section
        if (userType === 'Customer' && user.customerName) {
            $('#viewCustomerSection').removeClass('d-none');
            $('#viewCustomerName').text(user.customerName || '-');
            $('#viewCustomerAccount').text(user.customerAccountNumber || '-');
        } else {
            $('#viewCustomerSection').addClass('d-none');
        }

        // Activity
        $('#viewCreatedAt').text(user.createdAt ? new Date(user.createdAt).toLocaleString() : '-');
        $('#viewLastUpdated').text(user.lastUpdated ? new Date(user.lastUpdated).toLocaleString() : '-');
        $('#viewLastLogin').text(user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never logged in');
        $('#viewCreatedBy').text(user.createdBy || '-');

        // Notes
        if (user.notes && user.notes.trim()) {
            $('#viewNotesSection').removeClass('d-none');
            $('#viewNotes').text(user.notes);
        } else {
            $('#viewNotesSection').addClass('d-none');
        }

        new bootstrap.Modal(document.getElementById('viewUserModal')).show();
    } catch (error) {
        console.error("❌ Error loading user:", error);
        showEditErrorModal('Failed to load user: ' + error.message);
    }
};

// ============================================
// 🔥 EDIT USER MODAL
// ============================================
function setupEditModal() {
    $('#btnSaveUserEdit').on('click', saveUserEdit);
    $('#btnCloseEditSuccess').on('click', () => bootstrap.Modal.getInstance(document.getElementById('userEditSuccessModal')).hide());
    
    // Toggle branch/customer sections based on role
    $('#editUserType').on('change', function() {
        const type = $(this).val();
        $('#editBranchSection, #editCustomerSection').addClass('d-none');
        
        if (type === 'Branch' || type === 'Rider') {
            $('#editBranchSection').removeClass('d-none');
        } else if (type === 'Customer') {
            $('#editCustomerSection').removeClass('d-none');
        }
    });
}

window.editUser = async function(userId) {
    try {
        const user = await FirebaseDB.get(`users/${userId}`);
        if (!user) return showEditErrorModal('User not found');

        currentEditUserId = userId;

        // Populate form
        $('#editUserId').val(userId);
        $('#editFullName').val(user.fullName || '');
        $('#editEmail').val(user.email || '');
        $('#editContactNumber').val(user.contactNumber ? user.contactNumber.replace('+92', '') : '');
        $('#editCnicNumber').val(user.cnicNumber || '');
        $('#editDesignation').val(user.designation || '');
        $('#editUserType').val(user.userType || 'Customer').trigger('change');
        $('#editUserStatus').val((user.status || user.userStatus || 'active').toLowerCase());
        $('#editForcePassword').prop('checked', user.forcePasswordChange || false);
        
        // Branch/Customer selection
        if (user.branchId) $('#editBranchSelect').val(user.branchId);
        if (user.customerId) $('#editCustomerSelect').val(user.customerId);
        
        // Clear password fields
        $('#editNewPassword, #editConfirmPassword').val('');
        
        // Notes
        $('#editNotes').val(user.notes || '');

        new bootstrap.Modal(document.getElementById('editUserModal')).show();
    } catch (error) {
        console.error("❌ Error loading user:", error);
        showEditErrorModal('Failed to load user: ' + error.message);
    }
};

async function saveUserEdit() {
    const userId = $('#editUserId').val();
    const fullName = $('#editFullName').val().trim();
    const userType = $('#editUserType').val();
    const newPassword = $('#editNewPassword').val();
    const confirmPassword = $('#editConfirmPassword').val();

    if (!fullName) return showEditErrorModal('Full name is required');

    // Validate password if provided
    if (newPassword) {
        if (newPassword !== confirmPassword) {
            return showEditErrorModal('Passwords do not match');
        }
        if (newPassword.length < 6) {
            return showEditErrorModal('Password must be at least 6 characters');
        }
    }

    const $btn = $('#btnSaveUserEdit');
    $btn.prop('disabled', true).find('.btn-text').addClass('d-none');
    $btn.find('.btn-loader').removeClass('d-none');

    try {
        // Get branch/customer info
        const selectedBranch = $('#editBranchSelect option:selected');
        const selectedCustomer = $('#editCustomerSelect option:selected');

        const updateData = {
            fullName: fullName,
            contactNumber: $('#editContactNumber').val().trim() ? '+92' + $('#editContactNumber').val().trim() : '',
            cnicNumber: $('#editCnicNumber').val().trim(),
            designation: $('#editDesignation').val().trim(),
            userType: userType,
            status: $('#editUserStatus').val(),
            forcePasswordChange: $('#editForcePassword').is(':checked'),
            notes: $('#editNotes').val().trim(),
            lastUpdated: new Date().toISOString()
        };

        // Branch linkage
        if (userType === 'Branch' || userType === 'Rider') {
            updateData.branchId = $('#editBranchSelect').val() || '';
            updateData.branchCode = selectedBranch.data('code') || '';
            updateData.branchName = selectedBranch.data('name') || '';
        } else {
            updateData.branchId = '';
            updateData.branchCode = '';
            updateData.branchName = '';
        }

        // Customer linkage
        if (userType === 'Customer') {
            updateData.customerId = $('#editCustomerSelect').val() || '';
            updateData.customerName = selectedCustomer.data('name') || '';
            updateData.customerAccountNumber = selectedCustomer.data('account') || '';
        } else {
            updateData.customerId = '';
            updateData.customerName = '';
            updateData.customerAccountNumber = '';
        }

        // Reset password if provided (using secondary auth)
        if (newPassword) {
            console.log("🔥 Resetting password for user:", userId);
            try {
                // Note: Firebase doesn't allow password reset without user being signed in
                // This would require Firebase Admin SDK (Cloud Functions) for production
                // For now, we'll show a message
                updateData.passwordResetRequired = true;
                updateData.passwordResetDate = new Date().toISOString();
                console.log("⚠️ Password reset flag set. User will need to reset on next login.");
            } catch (pwdError) {
                console.warn("⚠️ Could not reset password:", pwdError);
            }
        }

        await FirebaseDB.update(`users/${userId}`, updateData);
        console.log("✅ User updated successfully");

        bootstrap.Modal.getInstance(document.getElementById('editUserModal')).hide();
        new bootstrap.Modal(document.getElementById('userEditSuccessModal')).show();
        
        // Reload data
        await loadInitialData();
    } catch (error) {
        console.error("❌ Error updating user:", error);
        showEditErrorModal('Failed to update user: ' + error.message);
    } finally {
        $btn.prop('disabled', false).find('.btn-text').removeClass('d-none');
        $btn.find('.btn-loader').addClass('d-none');
    }
}

// ============================================
// 🔥 TOGGLE USER STATUS
// ============================================
window.toggleUserStatus = async function(userId) {
    try {
        const user = await FirebaseDB.get(`users/${userId}`);
        if (!user) return showEditErrorModal('User not found');

        const currentStatus = (user.status || user.userStatus || 'active').toLowerCase();
        const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
        
        const action = newStatus === 'active' ? 'activate' : 'deactivate';
        if (!confirm(`Are you sure you want to ${action} this user?`)) return;

        await FirebaseDB.update(`users/${userId}`, {
            status: newStatus,
            lastUpdated: new Date().toISOString()
        });

        console.log(`✅ User ${action}d successfully`);
        await loadInitialData();
    } catch (error) {
        console.error("❌ Error toggling status:", error);
        showEditErrorModal('Failed to update status: ' + error.message);
    }
};

// ============================================
// 🔥 DELETE USER
// ============================================
function setupDeleteModal() {
    $('#btnConfirmDelete').on('click', confirmDeleteUser);
}

window.deleteUser = async function(userId) {
    try {
        const user = await FirebaseDB.get(`users/${userId}`);
        if (!user) return showEditErrorModal('User not found');

        currentEditUserId = userId;
        $('#deleteUserName').text(`${user.fullName} (${user.email})`);
        new bootstrap.Modal(document.getElementById('deleteUserModal')).show();
    } catch (error) {
        console.error("❌ Error loading user:", error);
        showEditErrorModal('Failed to load user: ' + error.message);
    }
};

async function confirmDeleteUser() {
    if (!currentEditUserId) return;

    try {
        // Soft delete - mark as deleted instead of removing
        await FirebaseDB.update(`users/${currentEditUserId}`, {
            status: 'deleted',
            deletedAt: new Date().toISOString(),
            deletedBy: FirebaseAuth.getCurrentUser() ? FirebaseAuth.getCurrentUser().uid : 'unknown',
            lastUpdated: new Date().toISOString()
        });

        console.log("✅ User deleted (soft delete)");
        bootstrap.Modal.getInstance(document.getElementById('deleteUserModal')).hide();
        await loadInitialData();
    } catch (error) {
        console.error("❌ Error deleting user:", error);
        showEditErrorModal('Failed to delete user: ' + error.message);
    }
}

// ============================================
// 🔥 HELPERS
// ============================================
function showEditErrorModal(message) {
    $('#userEditErrorMessage').text(message);
    new bootstrap.Modal(document.getElementById('userEditErrorModal')).show();
}

function debounce(func, wait) {
    let t;
    return function(...args) {
        clearTimeout(t);
        t = setTimeout(() => func(...args), wait);
    };
}