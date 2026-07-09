// adduserview.js - DEBUG VERSION

import { FirebaseDB, FirebaseAuth } from "./firebase/firebase-crud.js";

window.initAddUserView = function() {
    console.log("🚀 Add User View Initialized");
    
    loadBranches();
    loadCustomers();
    setupUserTypeChange();
    setupPasswordValidation();
    setupPasswordToggles();
    setupGeneratePassword();
    setupCNICFormatting();
    setupFormSubmission();
};

async function loadBranches() {
    try {
        const branches = await FirebaseDB.getList('branches');
        const $select = $('#branchSelect');
        $select.empty().append('<option value="" disabled selected>Select Branch</option>');
        
        branches.filter(b => b.status === 'Active').forEach(b => {
            $select.append(`<option value="${b.id}" data-code="${b.branchCode || ''}" data-city="${b.city || ''}" data-contact="${b.contactNumber || ''}">${b.branchName} (${b.branchCode || ''})</option>`);
        });
        console.log("✅ Loaded branches:", branches.length);
    } catch (error) {
        console.error("❌ Error loading branches:", error);
    }
}

async function loadCustomers() {
    try {
        const customers = await FirebaseDB.getList('customers');
        const $select = $('#customerSelect');
        $select.empty().append('<option value="" disabled selected>Search & Select Customer</option>');
        
        customers.filter(c => c.status === 'Active').forEach(c => {
            $select.append(`<option value="${c.id}" data-name="${c.customerName}" data-account="${c.accountNumber}" data-type="${c.customerType}" data-contact="${c.contactNumber}" data-province="${c.province}" data-status="${c.status}">${c.customerName} (${c.accountNumber}) - ${c.contactNumber || 'No Contact'}</option>`);
        });
        console.log("✅ Loaded customers:", customers.length);
    } catch (error) {
        console.error("❌ Error loading customers:", error);
    }
}

function setupUserTypeChange() {
    $('.user-type-radio').on('change', function() {
        const userType = $(this).val();
        
        $('#branchSection, #customerSection').addClass('d-none');
        
        if (userType === 'Branch' || userType === 'Rider') {
            $('#branchSection').removeClass('d-none');
            $('#branchSelect').prop('required', true);
            $('#customerSelect').prop('required', false);
        } else if (userType === 'Customer') {
            $('#customerSection').removeClass('d-none');
            $('#customerSelect').prop('required', true);
            $('#branchSelect').prop('required', false);
        } else {
            $('#branchSelect').prop('required', false);
            $('#customerSelect').prop('required', false);
        }
    });
}

$(document).on('change', '#branchSelect', function() {
    const $selected = $(this).find('option:selected');
    const branchId = $(this).val();
    
    if (!branchId) {
        $('#branchInfoContent').addClass('d-none');
        $('.branch-info-placeholder').removeClass('d-none');
        return;
    }

    $('#branchCode').text($selected.data('code') || '-');
    $('#branchCity').text($selected.data('city') || '-');
    $('#branchContact').text($selected.data('contact') || '-');
    
    $('.branch-info-placeholder').addClass('d-none');
    $('#branchInfoContent').removeClass('d-none');
});

$(document).on('change', '#customerSelect', function() {
    const $selected = $(this).find('option:selected');
    const customerId = $(this).val();
    
    if (!customerId) {
        $('#customerInfoContent').addClass('d-none');
        $('.customer-info-placeholder').removeClass('d-none');
        return;
    }

    $('#customerDisplayName').text($selected.data('name') || '-');
    $('#customerAccountNumber').text($selected.data('account') || '-');
    $('#customerType').text($selected.data('type') || '-');
    $('#customerContact').text($selected.data('contact') || '-');
    $('#customerProvince').text($selected.data('province') || '-');
    $('#customerStatus').text($selected.data('status') || '-');
    
    $('.customer-info-placeholder').addClass('d-none');
    $('#customerInfoContent').removeClass('d-none');
});

function setupPasswordValidation() {
    $('#userPassword').on('input', function() {
        updatePasswordStrength($(this).val());
        checkPasswordMatch();
    });

    $('#confirmPassword').on('input', checkPasswordMatch);
}

function updatePasswordStrength(password) {
    let score = 0;
    const reqs = {
        length: password.length >= 8,
        upper: /[A-Z]/.test(password),
        lower: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[!@#$%^&*]/.test(password)
    };

    updateRequirement('reqLength', reqs.length);
    updateRequirement('reqUpper', reqs.upper);
    updateRequirement('reqLower', reqs.lower);
    updateRequirement('reqNumber', reqs.number);
    updateRequirement('reqSpecial', reqs.special);

    if (reqs.length) score++;
    if (reqs.upper) score++;
    if (reqs.lower) score++;
    if (reqs.number) score++;
    if (reqs.special) score++;

    const $fill = $('#strengthFill');
    const $text = $('#strengthLevel');
    
    $fill.removeClass('weak fair good strong');
    
    if (password.length === 0) {
        $text.text('-');
    } else if (score <= 2) {
        $fill.addClass('weak');
        $text.text('Weak');
    } else if (score === 3) {
        $fill.addClass('fair');
        $text.text('Fair');
    } else if (score === 4) {
        $fill.addClass('good');
        $text.text('Good');
    } else {
        $fill.addClass('strong');
        $text.text('Strong');
    }
}

function updateRequirement(id, met) {
    const $item = $(`#${id}`);
    const $icon = $item.find('i');
    
    if (met) {
        $item.addClass('met');
        $icon.removeClass('bi-circle').addClass('bi-check-circle-fill');
    } else {
        $item.removeClass('met');
        $icon.removeClass('bi-check-circle-fill').addClass('bi-circle');
    }
}

function checkPasswordMatch() {
    const password = $('#userPassword').val();
    const confirm = $('#confirmPassword').val();
    const $indicator = $('#matchIndicator');
    const $icon = $('#matchIcon');
    const $text = $('#matchText');

    if (confirm.length === 0) {
        $indicator.removeClass('match no-match');
        $icon.removeClass('bi-check-circle-fill bi-x-circle-fill').addClass('bi-circle');
        $text.text('Passwords do not match');
        return;
    }

    if (password === confirm) {
        $indicator.removeClass('no-match').addClass('match');
        $icon.removeClass('bi-circle bi-x-circle-fill').addClass('bi-check-circle-fill');
        $text.text('Passwords match!');
    } else {
        $indicator.removeClass('match').addClass('no-match');
        $icon.removeClass('bi-circle bi-x-circle-fill').addClass('bi-x-circle-fill');
        $text.text('Passwords do not match');
    }
}

function setupPasswordToggles() {
    $('.rex-password-toggle').on('click', function() {
        const targetId = $(this).data('target');
        const $input = $(`#${targetId}`);
        const $icon = $(this).find('i');
        
        const type = $input.attr('type') === 'password' ? 'text' : 'password';
        $input.attr('type', type);
        $icon.toggleClass('bi-eye-fill bi-eye-slash-fill');
    });
}

function setupGeneratePassword() {
    $('#btnGeneratePassword').on('click', function() {
        const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const lower = 'abcdefghijklmnopqrstuvwxyz';
        const numbers = '0123456789';
        const special = '!@#$%^&*';
        const all = upper + lower + numbers + special;
        
        let password = '';
        password += upper[Math.floor(Math.random() * upper.length)];
        password += lower[Math.floor(Math.random() * lower.length)];
        password += numbers[Math.floor(Math.random() * numbers.length)];
        password += special[Math.floor(Math.random() * special.length)];
        
        for (let i = 4; i < 12; i++) {
            password += all[Math.floor(Math.random() * all.length)];
        }
        
        password = password.split('').sort(() => Math.random() - 0.5).join('');
        
        $('#userPassword').val(password).trigger('input');
        $('#confirmPassword').val(password).trigger('input');
        
        $('#userPassword, #confirmPassword').attr('type', 'text');
        $('.rex-password-toggle i').removeClass('bi-eye-fill').addClass('bi-eye-slash-fill');
    });
}

function setupCNICFormatting() {
    $('#cnicNumber').on('input', function() {
        let value = $(this).val().replace(/\D/g, '');
        if (value.length > 5) value = value.slice(0, 5) + '-' + value.slice(5);
        if (value.length > 13) value = value.slice(0, 13) + '-' + value.slice(13);
        if (value.length > 15) value = value.slice(0, 15);
        $(this).val(value);
    });
}

function setupFormSubmission() {
    $('#addUserForm').on('submit', async function(e) {
        e.preventDefault();
        
        console.log("========================================");
        console.log("🔍 FORM SUBMISSION STARTED");
        console.log("========================================");
        
        const $btn = $('#btnSaveUser');
        const $btnText = $btn.find('.btn-text');
        const $btnLoader = $btn.find('.btn-loader');

        const userType = $('.user-type-radio:checked').val();
        const fullName = $('#fullName').val().trim();
        const email = $('#userEmail').val().trim();
        const password = $('#userPassword').val();
        const confirmPassword = $('#confirmPassword').val();

        console.log("📝 Form Data:", { userType, fullName, email });

        if (!userType) { showErrorModal('Please select a user role'); return; }
        if (!fullName) { showErrorModal('Full Name is required'); return; }
        if (!email) { showErrorModal('Email is required'); return; }
        if (!password) { showErrorModal('Password is required'); return; }
        if (password !== confirmPassword) { showErrorModal('Passwords do not match'); return; }

        const hasUpper = /[A-Z]/.test(password);
        const hasLower = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecial = /[!@#$%^&*]/.test(password);
        
        if (password.length < 8 || !hasUpper || !hasLower || !hasNumber || !hasSpecial) {
            showErrorModal('Password does not meet requirements');
            return;
        }

        if ((userType === 'Branch' || userType === 'Rider') && !$('#branchSelect').val()) {
            showErrorModal('Please select a branch');
            return;
        }
        if (userType === 'Customer' && !$('#customerSelect').val()) {
            showErrorModal('Please select a customer');
            return;
        }

        $btn.prop('disabled', true);
        $btnText.addClass('d-none');
        $btnLoader.removeClass('d-none');

        try {
            console.log("🔥 STEP 1: Checking admin session...");
            const adminUser = FirebaseAuth.getCurrentUser();
            if (!adminUser) {
                throw new Error('Admin not logged in. Please refresh and login again.');
            }
            console.log("✅ Admin logged in:", adminUser.email);
            console.log("✅ Admin UID:", adminUser.uid);

            console.log("🔥 STEP 2: Creating user with secondary auth...");
            console.log("📧 Email:", email);
            console.log("🔑 Password length:", password.length);
            
            const userCredential = await FirebaseAuth.createUserWithoutLogin(email, password);
            const newUid = userCredential.user.uid;
            
            console.log("✅ User created successfully!");
            console.log("✅ New UID:", newUid);

            console.log("🔥 STEP 3: Preparing user data...");
            const selectedBranch = $('#branchSelect option:selected');
            const selectedCustomer = $('#customerSelect option:selected');

            const userData = {
                uid: newUid,
                email: email,
                fullName: fullName,
                userType: userType,
                userStatus: $('#userStatus').val(),
                contactNumber: $('#contactNumber').val().trim() ? '+92' + $('#contactNumber').val().trim() : '',
                cnicNumber: $('#cnicNumber').val().trim(),
                designation: $('#designation').val().trim(),
                branchId: (userType === 'Branch' || userType === 'Rider') ? $('#branchSelect').val() : '',
                branchCode: (userType === 'Branch' || userType === 'Rider') ? selectedBranch.data('code') : '',
                branchName: (userType === 'Branch' || userType === 'Rider') ? selectedBranch.text().split(' (')[0] : '',
                customerId: userType === 'Customer' ? $('#customerSelect').val() : '',
                customerName: userType === 'Customer' ? selectedCustomer.data('name') : '',
                customerAccountNumber: userType === 'Customer' ? selectedCustomer.data('account') : '',
                forcePasswordChange: $('#forcePasswordChange').is(':checked'),
                emailVerified: false,
                notes: $('#userNotes').val().trim(),
                createdAt: new Date().toISOString(),
                createdBy: adminUser.uid,
                lastLogin: null,
                lastUpdated: new Date().toISOString()
            };

            console.log("✅ User data prepared");

            console.log("🔥 STEP 4: Saving to Firebase Database...");
            console.log("📍 Path: users/" + newUid);
            
            await FirebaseDB.set(`users/${newUid}`, userData);
            
            console.log("✅ Data saved to database!");

            console.log("🔥 STEP 5: Showing success modal...");
            $('#successEmail').text(email);
            $('#successRole').text(userType);
            $('#successStatus').text(userData.userStatus);
            new bootstrap.Modal(document.getElementById('userSuccessModal')).show();
            
            console.log("========================================");
            console.log("✅ SUCCESS - USER CREATED");
            console.log("========================================");

        } catch (error) {
            console.error("========================================");
            console.error("❌ ERROR OCCURRED");
            console.error("========================================");
            console.error("Error object:", error);
            console.error("Error code:", error.code);
            console.error("Error message:", error.message);
            console.error("Error stack:", error.stack);
            
            let errorMessage = 'Failed to create user';
            if (error.code === 'auth/email-already-in-use') {
                errorMessage = 'Email already registered';
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = 'Invalid email format';
            } else if (error.code === 'auth/weak-password') {
                errorMessage = 'Password too weak (min 6 chars)';
            } else if (error.code === 'auth/operation-not-allowed') {
                errorMessage = 'Email/password auth not enabled in Firebase Console';
            } else if (error.code === 'auth/too-many-requests') {
                errorMessage = 'Too many attempts. Wait and try again';
            } else if (error.message) {
                errorMessage = error.message;
            }
            showErrorModal(errorMessage);
        } finally {
            $btn.prop('disabled', false);
            $btnText.removeClass('d-none');
            $btnLoader.addClass('d-none');
        }
    });

    $('#btnAddAnotherUser').on('click', function() {
        bootstrap.Modal.getInstance(document.getElementById('userSuccessModal')).hide();
        resetForm();
    });

    $('#btnViewUserList').on('click', function() {
        bootstrap.Modal.getInstance(document.getElementById('userSuccessModal')).hide();
        loadView('users');
    });
}

function showErrorModal(message) {
    $('#userErrorMessage').text(message);
    new bootstrap.Modal(document.getElementById('userErrorModal')).show();
}

function resetForm() {
    $('#addUserForm')[0].reset();
    $('.user-type-radio').prop('checked', false);
    $('#branchSection, #customerSection').addClass('d-none');
    $('#branchInfoContent, #customerInfoContent').addClass('d-none');
    $('.branch-info-placeholder, .customer-info-placeholder').removeClass('d-none');
    $('#strengthFill').removeClass('weak fair good strong');
    $('#strengthLevel').text('-');
    $('.requirement-item').removeClass('met').find('i').removeClass('bi-check-circle-fill').addClass('bi-circle');
    $('#matchIndicator').removeClass('match no-match');
    $('#matchIcon').removeClass('bi-check-circle-fill bi-x-circle-fill').addClass('bi-circle');
    $('#matchText').text('Passwords do not match');
    $('#userPassword, #confirmPassword').attr('type', 'password');
    $('.rex-password-toggle i').removeClass('bi-eye-slash-fill').addClass('bi-eye-fill');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}