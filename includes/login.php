<!-- includes/login.php -->
<!-- 🔥 NO <!DOCTYPE>, <html>, <head>, or <body> tags here! -->

<div class="rex-auth-wrapper">
    
    <!-- ============================================ -->
    <!-- 🔥 LEFT SIDE: BRANDING (Hidden on mobile) -->
    <!-- ============================================ -->
    <div class="rex-auth-branding d-none d-lg-flex flex-column justify-content-between">
        <div class="branding-content">
            <a href="home.php" class="brand-logo-link" title="Go to Home Page">
    <div class="brand-logo">
        <i class="bi bi-box-seam-fill"></i>
        <span>Rex Couriers</span>
    </div>
</a>
            <div class="branding-text">
                <h1>Delivering Trust,<br>Across Borders.</h1>
                <p>Your premier partner for seamless domestic and international courier solutions in Pakistan.</p>
            </div>
            
            <div class="brand-features">
                <div class="feature-item">
                    <i class="bi bi-globe-americas"></i>
                    <div>
                        <h6>Global Reach</h6>
                        <p>Partnered with DHL, Skynet for international shipments.</p>
                    </div>
                </div>
                <div class="feature-item">
                    <i class="bi bi-truck"></i>
                    <div>
                        <h6>Local Expertise</h6>
                        <p>Fast domestic delivery via TCS & LCS networks.</p>
                    </div>
                </div>
                <div class="feature-item">
                    <i class="bi bi-shield-check"></i>
                    <div>
                        <h6>Secure & Reliable</h6>
                        <p>Real-time tracking and secure handling of your parcels.</p>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="branding-footer">
            <p>&copy; <?php echo date('Y'); ?> Rexcouriers.com. All rights reserved.</p>
        </div>
    </div>

    <!-- ============================================ -->
    <!-- 🔥 RIGHT SIDE: LOGIN FORM -->
    <!-- ============================================ -->
    <div class="rex-auth-form-container">
        <div class="rex-auth-form-inner">
            
            <!-- Mobile Logo -->
            <div class="mobile-logo d-lg-none text-center mb-4">
                <i class="bi bi-box-seam-fill text-danger"></i>
                <h3 class="fw-bold mb-0">Rexcouris</h3>
            </div>

            <div class="form-header">
                <h2>Welcome Back!</h2>
                <p class="text-muted">Please sign in to your account to continue.</p>
            </div>

            <!-- 🔥 THE LOGIN FORM -->
            <form id="rexLoginForm" class="needs-validation" novalidate>
                
                <!-- Email Field -->
                <div class="form-floating rex-floating-group mb-3">
                    <input type="email" class="form-control" id="loginEmail" name="loginEmail" placeholder="name@example.com" required>
                    <label for="loginEmail"><i class="bi bi-envelope-fill me-2"></i>Email Address</label>
                    <div class="invalid-feedback">Please enter a valid email address.</div>
                </div>

                <!-- Password Field -->
                <div class="form-floating rex-floating-group rex-password-wrapper mb-3">
                    <input type="password" class="form-control" id="loginPassword" name="loginPassword" placeholder="Password" required>
                    <label for="loginPassword"><i class="bi bi-lock-fill me-2"></i>Password</label>
                    
                    <!-- Show/Hide Password Toggle -->
                    <button type="button" class="rex-password-toggle" id="togglePassword" aria-label="Toggle password visibility">
                        <i class="bi bi-eye-fill" id="toggleIcon"></i>
                    </button>
                    
                    <div class="invalid-feedback">Please enter your password.</div>
                </div>

                <!-- Remember Me & Forgot Password -->
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <div class="form-check rex-custom-check">
                        <input class="form-check-input" type="checkbox" id="rememberMe" name="rememberMe">
                        <label class="form-check-label" for="rememberMe">Remember me</label>
                    </div>
                    <a href="#" class="rex-forgot-link" id="forgotPasswordLink">Forgot Password?</a>
                </div>

                <!-- Submit Button -->
                <div class="d-grid gap-2 mb-3">
                    <button type="submit" class="btn btn-rex-primary" id="btnLogin">
                        <span class="btn-text">Sign In</span>
                        <span class="btn-loader d-none">
                            <span class="spinner-border spinner-border-sm me-2" role="status"></span>
                            Authenticating...
                        </span>
                    </button>
                </div>

                <!-- Error Message Alert -->
                <div class="alert alert-danger d-none py-2 px-3 small" id="loginErrorAlert" role="alert">
                    <i class="bi bi-exclamation-triangle-fill me-1"></i>
                    <span id="loginErrorMessage">Invalid credentials.</span>
                </div>
            </form>

            <div class="form-footer text-center mt-4">
                <p class="mb-0 text-muted small">Having trouble logging in? <a href="#" class="text-decoration-none fw-semibold">Contact Support</a></p>
            </div>
        </div>
    </div>
</div>




<!-- ============================================ -->
<!-- 🔥 ERROR MODAL (Wrong Password / Failed) -->
<!-- ============================================ -->
<div class="modal fade" id="loginErrorModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow">
            <div class="modal-header bg-danger text-white border-0">
                <h5 class="modal-title"><i class="bi bi-exclamation-triangle-fill me-2"></i>Login Failed</h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body py-4">
                <p id="loginErrorMessageText" class="mb-0 fs-5 text-center">Invalid email or password.</p>
            </div>
            <div class="modal-footer border-0 justify-content-center">
                <button type="button" class="btn btn-secondary px-4" data-bs-dismiss="modal">Try Again</button>
            </div>
        </div>
    </div>
</div>

<!-- ============================================ -->
<!-- 🔥 SUCCESS/REDIRECT MODAL -->
<!-- ============================================ -->
<div class="modal fade" id="loginSuccessModal" tabindex="-1" data-bs-backdrop="static" data-bs-keyboard="false" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow">
            <div class="modal-header bg-success text-white border-0">
                <h5 class="modal-title"><i class="bi bi-check-circle-fill me-2"></i>Authentication Successful</h5>
            </div>
            <div class="modal-body py-5 text-center">
                <div class="spinner-border text-success mb-3" role="status" style="width: 3rem; height: 3rem;"></div>
                <h4 id="redirectUserTypeText" class="fw-bold mb-2">Welcome!</h4>
                <p class="text-muted mb-0">Redirecting to your dashboard...</p>
            </div>
        </div>
    </div>
</div>