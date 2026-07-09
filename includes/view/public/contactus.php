<?php
// includes/view/public/contactus.php
// 🔥 Contact Us Section - REX Couriers
?>

<!-- ============================================ -->
<!-- 🔥 CONTACT US SECTION                        -->
<!-- ============================================ -->
<section class="contactus-section" id="contactus">
    <div class="container">
        
        <!-- Section Header -->
        <div class="section-header text-center">
            <span class="section-badge">
                <i class="bi bi-envelope-paper"></i> Get In Touch
            </span>
            <h2 class="section-title">Contact REX Worldwide Courier</h2>
            <p class="section-subtitle">
                Have questions or need assistance? We're here to help. Reach out to us and our team will get back to you promptly.
            </p>
        </div>
        
        <!-- Main Contact Layout -->
        <div class="contact-main">
            
            <!-- Left Column: Contact Form -->
            <div class="contact-form-wrapper">
                <div class="contact-form-card">
                    <div class="form-header">
                        <h3 class="form-title">
                            <i class="bi bi-chat-dots-fill me-2"></i>
                            Send Us a Message
                        </h3>
                        <p class="form-subtitle">Fill out the form below and we'll respond within 24 hours</p>
                    </div>
                    
                    <form id="contactForm" class="contact-form" novalidate>
                        
                        <!-- Name Field -->
                        <div class="form-group">
                            <label for="contactName" class="form-label">
                                <i class="bi bi-person-fill me-1"></i>Full Name <span class="required">*</span>
                            </label>
                            <div class="input-wrapper">
                                <input 
                                    type="text" 
                                    id="contactName" 
                                    name="name"
                                    class="form-input" 
                                    placeholder="Enter your full name"
                                    required
                                    minlength="2"
                                    maxlength="100"
                                >
                                <i class="bi bi-check-circle-fill input-icon-success d-none"></i>
                                <i class="bi bi-exclamation-circle-fill input-icon-error d-none"></i>
                            </div>
                            <small class="error-message d-none">Please enter your full name (min 2 characters)</small>
                        </div>
                        
                        <!-- Email Field -->
                        <div class="form-group">
                            <label for="contactEmail" class="form-label">
                                <i class="bi bi-envelope-fill me-1"></i>Email Address <span class="required">*</span>
                            </label>
                            <div class="input-wrapper">
                                <input 
                                    type="email" 
                                    id="contactEmail" 
                                    name="email"
                                    class="form-input" 
                                    placeholder="your.email@example.com"
                                    required
                                >
                                <i class="bi bi-check-circle-fill input-icon-success d-none"></i>
                                <i class="bi bi-exclamation-circle-fill input-icon-error d-none"></i>
                            </div>
                            <small class="error-message d-none">Please enter a valid email address</small>
                        </div>
                        
                        <!-- Phone Field -->
                        <div class="form-group">
                            <label for="contactPhone" class="form-label">
                                <i class="bi bi-telephone-fill me-1"></i>Phone Number <span class="required">*</span>
                            </label>
                            <div class="input-wrapper">
                                <span class="input-prefix">+92</span>
                                <input 
                                    type="tel" 
                                    id="contactPhone" 
                                    name="phone"
                                    class="form-input with-prefix" 
                                    placeholder="300 1234567"
                                    required
                                    maxlength="11"
                                >
                                <i class="bi bi-check-circle-fill input-icon-success d-none"></i>
                                <i class="bi bi-exclamation-circle-fill input-icon-error d-none"></i>
                            </div>
                            <small class="error-message d-none">Please enter a valid phone number (10-11 digits)</small>
                        </div>
                        
                        <!-- Subject Field (Optional) -->
                        <div class="form-group">
                            <label for="contactSubject" class="form-label">
                                <i class="bi bi-tag-fill me-1"></i>Subject
                            </label>
                            <div class="input-wrapper">
                                <select id="contactSubject" name="subject" class="form-input">
                                    <option value="" disabled selected>Select a subject (optional)</option>
                                    <option value="General Inquiry">General Inquiry</option>
                                    <option value="Shipment Tracking">Shipment Tracking</option>
                                    <option value="Pricing & Rates">Pricing & Rates</option>
                                    <option value="Corporate Services">Corporate Services</option>
                                    <option value="Complaint">Complaint</option>
                                    <option value="Feedback">Feedback</option>
                                    <option value="Partnership">Partnership</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>
                        
                        <!-- Message Field -->
                        <div class="form-group">
                            <label for="contactMessage" class="form-label">
                                <i class="bi bi-chat-left-text-fill me-1"></i>Message <span class="required">*</span>
                            </label>
                            <div class="input-wrapper">
                                <textarea 
                                    id="contactMessage" 
                                    name="message"
                                    class="form-input form-textarea" 
                                    placeholder="Type your message here..."
                                    required
                                    minlength="10"
                                    maxlength="1000"
                                    rows="5"
                                ></textarea>
                            </div>
                            <div class="textarea-footer">
                                <small class="error-message d-none">Please enter your message (min 10 characters)</small>
                                <small class="char-counter"><span id="messageCharCount">0</span>/1000 characters</small>
                            </div>
                        </div>
                        
                        <!-- Submit Button -->
                        <button type="submit" class="btn-submit" id="btnSubmitContact">
                            <span class="btn-text">
                                <i class="bi bi-send-fill me-2"></i>Send Message
                            </span>
                            <span class="btn-loader d-none">
                                <span class="spinner-border spinner-border-sm me-2"></span>Sending...
                            </span>
                        </button>
                        
                        <!-- Privacy Note -->
                        <p class="privacy-note">
                            <i class="bi bi-shield-lock-fill me-1"></i>
                            Your information is secure and will never be shared with third parties.
                        </p>
                        
                    </form>
                </div>
            </div>
            
            <!-- Right Column: Contact Information -->
            <div class="contact-info-wrapper">
                
                <!-- Contact Info Card -->
                <div class="contact-info-card">
                    <h3 class="info-title">
                        <i class="bi bi-info-circle-fill me-2"></i>
                        Contact Information
                    </h3>
                    
                    <!-- Address -->
                    <div class="info-item">
                        <div class="info-icon">
                            <i class="bi bi-geo-alt-fill"></i>
                        </div>
                        <div class="info-content">
                            <h6>Head Office Address</h6>
                            <p>281, Main Abdullah Haroon Road,<br>Saddar, Karachi, 74400<br>Pakistan</p>
                            <a href="https://share.google/UZHpAcJ18739jr8Ly" target="_blank" class="info-link">
                                <i class="bi bi-map me-1"></i>View on Google Maps
                            </a>
                        </div>
                    </div>
                    
                    <!-- Phone -->
                    <div class="info-item">
                        <div class="info-icon">
                            <i class="bi bi-telephone-fill"></i>
                        </div>
                        <div class="info-content">
                            <h6>Phone Number</h6>
                            <p>
                                <a href="tel:+9203001115231" class="phone-link">+92-0300-111-5231</a>
                            </p>
                            <small class="info-meta">Available 24/7 for customer support</small>
                        </div>
                    </div>
                    
                    <!-- Email -->
                    <div class="info-item">
                        <div class="info-icon">
                            <i class="bi bi-envelope-fill"></i>
                        </div>
                        <div class="info-content">
                            <h6>Email Address</h6>
                            <p>
                                <a href="mailto:info@rexcouriers.com" class="email-link">info@rexcouriers.com</a>
                            </p>
                            <small class="info-meta">We respond within 24 hours</small>
                        </div>
                    </div>
                    
                    <!-- Business Hours -->
                    <div class="info-item">
                        <div class="info-icon">
                            <i class="bi bi-clock-fill"></i>
                        </div>
                        <div class="info-content">
                            <h6>Business Hours</h6>
                            <div class="hours-list">
                                <div class="hours-row">
                                    <span>Monday - Saturday</span>
                                    <strong>9:00 AM - 8:00 PM</strong>
                                </div>
                                <div class="hours-row">
                                    <span>Sunday</span>
                                    <strong>10:00 AM - 4:00 PM</strong>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                </div>
                
                <!-- Map Card -->
                <div class="map-card">
                    <div class="map-header">
                        <h6><i class="bi bi-pin-map-fill me-2"></i>Our Location</h6>
                    </div>
                    <div class="map-container">
                        <iframe 
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3619.885!2d67.0299!3d24.8607!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjTCsDUxJzM4LjUiTiA2N8KwMDEnNDcuNiJF!5e0!3m2!1sen!2s!4v1234567890"
                            width="100%" 
                            height="250" 
                            style="border:0;" 
                            allowfullscreen="" 
                            loading="lazy"
                            onerror="this.style.display='none'; this.parentElement.classList.add('map-error');"
                        ></iframe>
                        <div class="map-overlay-link">
                            <a href="https://share.google/UZHpAcJ18739jr8Ly" target="_blank" class="btn-map">
                                <i class="bi bi-box-arrow-up-right me-1"></i>Open in Google Maps
                            </a>
                        </div>
                    </div>
                </div>
                
                
                
            </div>
            
        </div>
        
    </div>
</section>

<!-- ============================================ -->
<!-- 🔥 CONTACT SUCCESS MODAL                     -->
<!-- ============================================ -->
<div class="modal fade" id="contactSuccessModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-body text-center p-5">
                
                <!-- Success Animation -->
                <div class="success-animation">
                    <div class="success-circle">
                        <i class="bi bi-check-lg"></i>
                    </div>
                    <div class="success-particles">
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
                
                <!-- Success Message -->
                <h3 class="success-title">Message Sent Successfully!</h3>
                <p class="success-subtitle">
                    Thank you for reaching out to REX Worldwide Courier. Our team will contact you within <strong>24 hours</strong>.
                </p>
                
                <!-- Reference Number -->
                <div class="reference-box">
                    <small>Your Reference Number</small>
                    <strong id="contactReference">REX-2026-0001</strong>
                </div>
                
                <!-- What's Next -->
                <div class="whats-next">
                    <h6 class="next-title">What happens next?</h6>
                    <ul class="next-list">
                        <li>
                            <i class="bi bi-check-circle-fill"></i>
                            <span>Our customer service team will review your message</span>
                        </li>
                        <li>
                            <i class="bi bi-check-circle-fill"></i>
                            <span>You'll receive a response via email or phone</span>
                        </li>
                        <li>
                            <i class="bi bi-check-circle-fill"></i>
                            <span>For urgent matters, call us at <strong>+92-0300-111-5231</strong></span>
                        </li>
                    </ul>
                </div>
                
                <!-- Contact Details -->
                <div class="modal-contact-info">
                    <h6>Need Immediate Assistance?</h6>
                    <div class="modal-contact-row">
                        <a href="tel:+9203001115231" class="modal-contact-link">
                            <i class="bi bi-telephone-fill"></i>
                            <span>+92-0300-111-5231</span>
                        </a>
                        <a href="mailto:info@rexcouriers.com" class="modal-contact-link">
                            <i class="bi bi-envelope-fill"></i>
                            <span>info@rexcouriers.com</span>
                        </a>
                    </div>
                </div>
                
                <!-- Close Button -->
                <button type="button" class="btn-close-modal" data-bs-dismiss="modal">
                    <i class="bi bi-check-circle me-2"></i>Got It, Thanks!
                </button>
                
            </div>
        </div>
    </div>
</div>

<!-- ============================================ -->
<!-- 🔥 CONTACT ERROR MODAL                       -->
<!-- ============================================ -->
<div class="modal fade" id="contactErrorModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-body text-center p-5">
                
                <div class="error-animation">
                    <div class="error-circle">
                        <i class="bi bi-exclamation-triangle-fill"></i>
                    </div>
                </div>
                
                <h3 class="error-title">Oops! Something Went Wrong</h3>
                <p class="error-subtitle" id="contactErrorMessage">
                    We couldn't send your message. Please try again or contact us directly.
                </p>
                
                <div class="error-actions">
                    <button type="button" class="btn-retry" id="btnRetryContact">
                        <i class="bi bi-arrow-clockwise me-2"></i>Try Again
                    </button>
                    <a href="tel:+9203001115231" class="btn-call-direct">
                        <i class="bi bi-telephone me-2"></i>Call Us Directly
                    </a>
                </div>
                
                <button type="button" class="btn-close-error" data-bs-dismiss="modal">
                    Close
                </button>
                
            </div>
        </div>
    </div>
</div>

