// assets/js/contactus.js - CONTACT US FUNCTIONALITY
$(document).ready(function() {
    console.log("🚀 [contactus.js] Contact Us section initialized");
    
    initContactForm();
});

// ============================================
// 🔥 INITIALIZE CONTACT FORM
// ============================================
function initContactForm() {
    // Setup form validation
    setupFormValidation();
    
    // Setup character counter
    setupCharCounter();
    
    // Setup form submission
    setupFormSubmission();
    
    // Setup modal buttons
    setupModalButtons();
}

// ============================================
// 🔥 FORM VALIDATION
// ============================================
function setupFormValidation() {
    // Real-time validation on blur
    $('#contactName').on('blur', function() {
        validateField($(this), validateName);
    });
    
    $('#contactEmail').on('blur', function() {
        validateField($(this), validateEmail);
    });
    
    $('#contactPhone').on('blur', function() {
        validateField($(this), validatePhone);
    });
    
    $('#contactMessage').on('blur', function() {
        validateField($(this), validateMessage);
    });
    
    // Clear validation on input
    $('.form-input').on('input', function() {
        const $group = $(this).closest('.form-group');
        if ($group.hasClass('invalid')) {
            $group.removeClass('invalid');
            $group.find('.input-icon-error').addClass('d-none');
            $group.find('.input-icon-success').addClass('d-none');
        }
    });
}

// ============================================
// 🔥 VALIDATION FUNCTIONS
// ============================================
function validateName(value) {
    const name = value.trim();
    return name.length >= 2 && name.length <= 100;
}

function validateEmail(value) {
    const email = value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePhone(value) {
    const phone = value.replace(/\s/g, '');
    const phoneRegex = /^[0-9]{10,11}$/;
    return phoneRegex.test(phone);
}

function validateMessage(value) {
    const message = value.trim();
    return message.length >= 10 && message.length <= 1000;
}

// ============================================
// 🔥 VALIDATE FIELD
// ============================================
function validateField($input, validator) {
    const value = $input.val();
    const $group = $input.closest('.form-group');
    const $successIcon = $group.find('.input-icon-success');
    const $errorIcon = $group.find('.input-icon-error');
    
    if (!value) {
        $group.removeClass('valid invalid');
        $successIcon.addClass('d-none');
        $errorIcon.addClass('d-none');
        return false;
    }
    
    if (validator(value)) {
        $group.removeClass('invalid').addClass('valid');
        $errorIcon.addClass('d-none');
        $successIcon.removeClass('d-none');
        return true;
    } else {
        $group.removeClass('valid').addClass('invalid');
        $successIcon.addClass('d-none');
        $errorIcon.removeClass('d-none');
        return false;
    }
}

// ============================================
// 🔥 CHARACTER COUNTER
// ============================================
function setupCharCounter() {
    $('#contactMessage').on('input', function() {
        const length = $(this).val().length;
        $('#messageCharCount').text(length);
        
        if (length > 1000) {
            $(this).val($(this).val().substring(0, 1000));
            $('#messageCharCount').text(1000);
        }
        
        // Color coding
        if (length < 10) {
            $('#messageCharCount').css('color', '#dc2626');
        } else if (length > 900) {
            $('#messageCharCount').css('color', '#f59e0b');
        } else {
            $('#messageCharCount').css('color', '#10b981');
        }
    });
}

// ============================================
// 🔥 FORM SUBMISSION
// ============================================
function setupFormSubmission() {
    $('#contactForm').on('submit', async function(e) {
        e.preventDefault();
        
        // Validate all fields
        const isNameValid = validateField($('#contactName'), validateName);
        const isEmailValid = validateField($('#contactEmail'), validateEmail);
        const isPhoneValid = validateField($('#contactPhone'), validatePhone);
        const isMessageValid = validateField($('#contactMessage'), validateMessage);
        
        if (!isNameValid || !isEmailValid || !isPhoneValid || !isMessageValid) {
            // Scroll to first invalid field
            const $firstInvalid = $('.form-group.invalid').first();
            if ($firstInvalid.length) {
                $('html, body').animate({
                    scrollTop: $firstInvalid.offset().top - 100
                }, 500);
                $firstInvalid.find('.form-input').focus();
            }
            return;
        }
        
        // Show loading state
        const $btn = $('#btnSubmitContact');
        $btn.prop('disabled', true).find('.btn-text').addClass('d-none');
        $btn.find('.btn-loader').removeClass('d-none');
        
        try {
            // Collect form data
            const formData = {
                name: $('#contactName').val().trim(),
                email: $('#contactEmail').val().trim(),
                phone: '+92' + $('#contactPhone').val().replace(/\s/g, ''),
                subject: $('#contactSubject').val() || 'General Inquiry',
                message: $('#contactMessage').val().trim(),
                submittedAt: new Date().toISOString(),
                source: 'Website Contact Form'
            };
            
            console.log("📤 Submitting contact form:", formData);
            
            // Simulate API call (replace with actual Firebase save)
            await simulateContactSubmission(formData);
            
            // Generate reference number
            const referenceNumber = generateReferenceNumber();
            $('#contactReference').text(referenceNumber);
            
            // Show success modal
            const successModal = new bootstrap.Modal(document.getElementById('contactSuccessModal'));
            successModal.show();
            
            // Reset form
            resetContactForm();
            
            console.log("✅ Contact form submitted successfully");
            
        } catch (error) {
            console.error("❌ Error submitting contact form:", error);
            
            // Show error modal
            $('#contactErrorMessage').text(error.message || 'Failed to send message. Please try again.');
            const errorModal = new bootstrap.Modal(document.getElementById('contactErrorModal'));
            errorModal.show();
            
        } finally {
            // Reset button state
            $btn.prop('disabled', false).find('.btn-text').removeClass('d-none');
            $btn.find('.btn-loader').addClass('d-none');
        }
    });
}

// ============================================
// 🔥 SIMULATE CONTACT SUBMISSION
// ============================================
async function simulateContactSubmission(data) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Save to Firebase (uncomment when ready)
    /*
    try {
        await FirebaseDB.push('contactMessages', data);
    } catch (error) {
        throw new Error('Failed to save message. Please try again.');
    }
    */
    
    // For now, just simulate success
    console.log("✅ Message saved (simulated):", data);
    return true;
}

// ============================================
// 🔥 GENERATE REFERENCE NUMBER
// ============================================
function generateReferenceNumber() {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 9000) + 1000;
    return `REX-${year}-${random}`;
}

// ============================================
// 🔥 RESET CONTACT FORM
// ============================================
function resetContactForm() {
    $('#contactForm')[0].reset();
    
    // Clear validation states
    $('.form-group').removeClass('valid invalid');
    $('.input-icon-success, .input-icon-error').addClass('d-none');
    
    // Reset character counter
    $('#messageCharCount').text('0').css('color', '#6b7280');
}

// ============================================
// 🔥 MODAL BUTTONS
// ============================================
function setupModalButtons() {
    // Retry button in error modal
    $('#btnRetryContact').on('click', function() {
        bootstrap.Modal.getInstance(document.getElementById('contactErrorModal')).hide();
        setTimeout(() => {
            $('#contactName').focus();
        }, 400);
    });
}

// ============================================
// 🔥 PHONE FORMATTING
// ============================================
$('#contactPhone').on('input', function() {
    let value = $(this).val().replace(/\D/g, '');
    
    // Limit to 11 digits
    if (value.length > 11) {
        value = value.substring(0, 11);
    }
    
    // Format with spaces: 300 1234567
    if (value.length > 3) {
        value = value.substring(0, 3) + ' ' + value.substring(3);
    }
    
    $(this).val(value);
});
