<?php
// includes/view/customer/dashboard.php
// 🔥 Start session and read user data directly

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

$user = $_SESSION['user'] ?? [];
$fullName = $user['fullName'] ?? 'User';
$firstName = explode(' ', $fullName)[0];
$email = $user['email'] ?? '';
$userCode = $user['userCode'] ?? '';
?>
<div class="customerdashboard">
    
    <!-- ============================================ -->
    <!-- 🔥 WELCOME HEADER -->
    <!-- ============================================ -->
    <div class="welcome-section">
        <div class="welcome-text">
            <h2 class="welcome-title">Hello, <?php echo htmlspecialchars(explode(' ', $fullName)[0]); ?> 👋</h2>
            <p class="welcome-subtitle">Here's what's in your wallet today</p>
        </div>
        <div class="welcome-datetime">
            <span id="custDashDate">--</span>
        </div>
    </div>

    <!-- ============================================ -->
    <!-- 🔥 SUMMARY CARDS -->
    <!-- ============================================ -->
    <div class="summary-cards">
        <div class="summary-card card-coupons">
            <div class="summary-icon">
                <i class="bi bi-ticket-perforated"></i>
            </div>
            <div class="summary-info">
                <div class="summary-count" id="summaryCoupons">
                    <span class="spinner-border spinner-border-sm"></span>
                </div>
                <div class="summary-label">Coupons</div>
            </div>
        </div>
        
        <div class="summary-card card-vouchers">
            <div class="summary-icon">
                <i class="bi bi-bag-check"></i>
            </div>
            <div class="summary-info">
                <div class="summary-count" id="summaryVouchers">
                    <span class="spinner-border spinner-border-sm"></span>
                </div>
                <div class="summary-label">Vouchers</div>
            </div>
        </div>
        
        <div class="summary-card card-expiring">
            <div class="summary-icon">
                <i class="bi bi-clock-history"></i>
            </div>
            <div class="summary-info">
                <div class="summary-count" id="summaryExpiring">
                    <span class="spinner-border spinner-border-sm"></span>
                </div>
                <div class="summary-label">Expiring Soon</div>
            </div>
        </div>
    </div>

    <!-- ============================================ -->
    <!-- 🔥 FILTER SECTION -->
    <!-- ============================================ -->
    <div class="filter-section">
        <!-- Search Bar -->
        <div class="search-wrapper">
            <i class="bi bi-search search-icon"></i>
            <input type="text" id="walletSearchInput" class="wallet-search" placeholder="Search by merchant or offer...">
        </div>
        
        <!-- Filter Pills -->
        <div class="filter-pills">
            <button class="filter-pill active" data-filter="all">
                <i class="bi bi-grid"></i> All
            </button>
            <button class="filter-pill" data-filter="coupon">
                <i class="bi bi-ticket-perforated"></i> Coupons
            </button>
            <button class="filter-pill" data-filter="voucher">
                <i class="bi bi-bag-check"></i> Vouchers
            </button>
            <button class="filter-pill" data-filter="expiring">
                <i class="bi bi-exclamation-circle"></i> Expiring
            </button>
            <button class="filter-pill" data-filter="free">
                <i class="bi bi-gift"></i> Free
            </button>
        </div>
        
        <!-- Sort Dropdown -->
        <div class="sort-wrapper">
            <select id="walletSortSelect" class="wallet-sort">
                <option value="expiry">Sort: Expiry Date</option>
                <option value="recent">Sort: Most Recent</option>
                <option value="value">Sort: Highest Value</option>
                <option value="name">Sort: Name (A-Z)</option>
            </select>
        </div>
    </div>

    <!-- ============================================ -->
    <!-- 🔥 WALLET CONTENT AREA -->
    <!-- ============================================ -->
    <div class="wallet-content">
        
        <!-- Loading State -->
        <div id="walletLoading" class="wallet-state">
            <div class="wallet-loader">
                <div class="loader-spinner"></div>
                <p>Loading your wallet...</p>
            </div>
        </div>
        
        <!-- Empty State -->
        <div id="walletEmpty" class="wallet-state d-none">
            <div class="empty-state">
                <i class="bi bi-wallet2 empty-icon"></i>
                <h4>Your wallet is empty</h4>
                <p>Claim some offers to get started!</p>
            </div>
        </div>
        
        <!-- No Results State -->
        <div id="walletNoResults" class="wallet-state d-none">
            <div class="empty-state">
                <i class="bi bi-search empty-icon"></i>
                <h4>No matches found</h4>
                <p>Try adjusting your filters</p>
            </div>
        </div>
        
        <!-- Wallet Items Grid -->
        <div id="walletItemsGrid" class="wallet-grid d-none">
            <!-- Populated by jQuery -->
        </div>
        
    </div>
</div>


<!-- 🔥 Redeem Modal with Branch Selection + Code Input -->
<div class="modal fade" id="redeemConfirmModal" tabindex="-1" aria-hidden="true" data-bs-backdrop="static">
    <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content border-0 shadow-lg customer-modal">
            <div class="modal-body p-4">
                <div class="text-center mb-3">
                    <div class="redeem-icon-wrapper mx-auto">
                        <i class="bi bi-ticket-perforated"></i>
                    </div>
                </div>
                <h4 class="fw-bold text-center mb-2">Redeem Coupon</h4>
                
                <!-- Coupon Details -->
                <div class="redeem-details bg-light rounded-3 p-3 mb-3">
                    <div class="redeem-detail-row">
                        <span>Offer:</span>
                        <strong id="redeemOfferName">--</strong>
                    </div>
                    <div class="redeem-detail-row">
                        <span>Merchant:</span>
                        <strong id="redeemMerchantName">--</strong>
                    </div>
                    <div class="redeem-detail-row">
                        <span>Valid till:</span>
                        <strong id="redeemValidTill">--</strong>
                    </div>
                </div>

                <!-- Branch Selection -->
                <div class="branch-selection-section mb-3">
                    <h6 class="fw-bold mb-3"><i class="bi bi-shop me-2"></i>Select Branch</h6>
                    
                    <div class="branch-selection-tabs mb-3">
                        <button class="branch-tab active" data-branch-method="select">
                            <i class="bi bi-list-ul me-1"></i> Select from List
                        </button>
                        <button class="branch-tab" data-branch-method="scan">
                            <i class="bi bi-qr-code-scan me-1"></i> Scan QR
                        </button>
                    </div>

                    <div id="branchListSection" class="branch-selection-content">
                        <select class="form-select mb-3" id="branchSelectDropdown">
                            <option value="">-- Select a Branch --</option>
                        </select>
                        <div id="selectedBranchInfo" class="selected-branch-info d-none bg-success bg-opacity-10 border border-success rounded-3 p-3">
                            <div class="d-flex align-items-center gap-2">
                                <i class="bi bi-check-circle-fill text-success"></i>
                                <div>
                                    <strong id="selectedBranchName">--</strong>
                                    <div class="small text-muted" id="selectedBranchCode">--</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div id="branchScanSection" class="branch-selection-content d-none">
                        <div class="qr-scanner-container mb-3">
                            <div id="qr-reader"></div>
                        </div>
                        <div class="manual-code-entry">
                            <label class="form-label fw-semibold">Or Enter Branch Code</label>
                            <div class="input-group">
                                <input type="text" class="form-control" id="manualBranchCode" placeholder="e.g., M1001-1">
                                <button class="btn btn-outline-secondary" id="btnVerifyBranchCode">Verify</button>
                            </div>
                        </div>
                        <div id="scannedBranchInfo" class="scanned-branch-info d-none bg-success bg-opacity-10 border border-success rounded-3 p-3 mt-3">
                            <div class="d-flex align-items-center gap-2">
                                <i class="bi bi-check-circle-fill text-success"></i>
                                <div>
                                    <strong id="scannedBranchName">--</strong>
                                    <div class="small text-muted" id="scannedBranchCode">--</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 🔥 CODE INPUT SECTION (hidden until branch selected + Proceed clicked) -->
                <div id="codeInputSection" class="code-input-section d-none">
                    <hr class="my-3">
                    <div class="alert alert-info small mb-3">
                        <i class="bi bi-info-circle me-1"></i>
                        <strong>Branch staff is preparing your code.</strong> Please wait a moment.
                    </div>
                    
                    <div id="codeWaitingState">
                        <div class="text-center py-3">
                            <div class="spinner-border text-primary" role="status"></div>
                            <p class="mt-2 text-muted small">Waiting for branch staff to generate code...</p>
                        </div>
                    </div>

                    <div id="codeEntryState" class="d-none">
                        <label class="form-label fw-semibold">
                            <i class="bi bi-key-fill text-primary me-1"></i>
                            Enter the 4-digit code from staff
                        </label>
                        <div class="code-inputs d-flex gap-2 justify-content-center mb-2">
                            <input type="text" class="form-control code-digit-input" maxlength="1" data-index="0">
                            <input type="text" class="form-control code-digit-input" maxlength="1" data-index="1">
                            <input type="text" class="form-control code-digit-input" maxlength="1" data-index="2">
                            <input type="text" class="form-control code-digit-input" maxlength="1" data-index="3">
                        </div>
                        <div class="text-center mb-3">
                            <small class="text-muted">
                                <i class="bi bi-clock me-1"></i>
                                Code expires in: <strong id="customerCodeTimer">--:--</strong>
                            </small>
                        </div>
                        <button type="button" class="btn btn-customer w-100" id="btnSubmitCode" disabled>
                            <i class="bi bi-check-circle me-1"></i> Submit Code
                        </button>
                    </div>

                    <!-- 🔥 Success Message (below input field) -->
                    <div id="redemptionSuccessMsg" class="redemption-success-msg d-none">
                        <div class="alert alert-success mb-0">
                            <div class="d-flex align-items-center gap-2">
                                <i class="bi bi-check-circle-fill fs-4"></i>
                                <div>
                                    <strong>Redemption Successful!</strong>
                                    <div class="small">Your coupon has been redeemed. Enjoy your offer!</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Footer Buttons -->
                <div class="d-flex gap-2 mt-3">
                    <button type="button" class="btn btn-outline-secondary flex-fill" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-customer flex-fill" id="btnProceedRedeem" disabled>
                        <i class="bi bi-arrow-right me-1"></i> Proceed
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>




<!-- ============================================ -->
<!-- 🔥 GIFT COUPON MODAL                         -->
<!-- ============================================ -->
<div class="modal fade" id="giftModal" tabindex="-1" aria-hidden="true" data-bs-backdrop="static">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow-lg customer-modal">
            
            <!-- Step 1: Recipient Details -->
            <div id="giftStep1">
                <div class="modal-header bg-gradient-primary text-white border-0">
                    <div class="d-flex align-items-center gap-2">
                        <div class="gift-icon-wrapper">
                            <i class="bi bi-gift"></i>
                        </div>
                        <div>
                            <h5 class="modal-title fw-bold mb-0">Gift This Coupon</h5>
                            <small class="text-white-50">Share the joy with someone special</small>
                        </div>
                    </div>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                </div>
                
                <div class="modal-body p-4">
                    
                    <!-- Coupon Preview -->
                    <div class="gift-coupon-preview mb-4">
                        <div class="d-flex align-items-center gap-3">
                            <div class="gift-coupon-icon">
                                <i class="bi bi-ticket-perforated"></i>
                            </div>
                            <div class="flex-grow-1">
                                <div class="gift-coupon-title" id="giftCouponTitle">--</div>
                                <div class="gift-coupon-merchant">
                                    <i class="bi bi-shop me-1"></i>
                                    <span id="giftCouponMerchant">--</span>
                                </div>
                            </div>
                            <div class="gift-coupon-value" id="giftCouponValue">--</div>
                        </div>
                    </div>

                    <!-- Privacy Notice -->
                    <div class="alert alert-info small mb-3 d-flex align-items-start gap-2">
                        <i class="bi bi-shield-lock-fill mt-1"></i>
                        <div>
                            <strong>Privacy Protected:</strong> For security, you must enter the recipient's exact 
                            <strong>user code</strong> and <strong>registered email</strong>. Both must match to complete the transfer.
                        </div>
                    </div>

                    <!-- Gift Form -->
                    <form id="giftForm" novalidate>
                        <div class="mb-3">
                            <label class="form-label fw-semibold">
                                <i class="bi bi-hash me-1 text-primary"></i>
                                Recipient's User Code <span class="text-danger">*</span>
                            </label>
                            <input type="text" class="form-control form-control-lg" id="giftRecipientCode" 
                                   placeholder="e.g., U1006" autocomplete="off" required>
                            <small class="form-text text-muted">
                                The recipient can find their code in their profile
                            </small>
                            <div class="invalid-feedback">Please enter the recipient's user code.</div>
                        </div>

                        <div class="mb-3">
                            <label class="form-label fw-semibold">
                                <i class="bi bi-envelope me-1 text-primary"></i>
                                Recipient's Email <span class="text-danger">*</span>
                            </label>
                            <input type="email" class="form-control form-control-lg" id="giftRecipientEmail" 
                                   placeholder="recipient@example.com" autocomplete="off" required>
                            <small class="form-text text-muted">
                                Must match the email registered with the user code above
                            </small>
                            <div class="invalid-feedback">Please enter a valid email address.</div>
                        </div>

                        <div class="mb-3">
                            <label class="form-label fw-semibold">
                                <i class="bi bi-chat-heart me-1 text-primary"></i>
                                Personal Message <span class="text-muted small">(Optional)</span>
                            </label>
                            <textarea class="form-control" id="giftMessage" rows="2" 
                                      placeholder="e.g., Happy Birthday! Enjoy this treat 🎉" 
                                      maxlength="150"></textarea>
                            <small class="form-text text-muted">
                                <span id="giftMessageCount">0</span>/150 characters
                            </small>
                        </div>
                    </form>
                </div>
                
                <div class="modal-footer border-0">
                    <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-customer" id="btnValidateRecipient">
                        <i class="bi bi-search me-1"></i> Verify Recipient
                    </button>
                </div>
            </div>

            <!-- Step 2: Confirmation -->
            <div id="giftStep2" class="d-none">
                <div class="modal-header bg-gradient-success text-white border-0">
                    <div class="d-flex align-items-center gap-2">
                        <div class="gift-icon-wrapper bg-white bg-opacity-25">
                            <i class="bi bi-person-check"></i>
                        </div>
                        <div>
                            <h5 class="modal-title fw-bold mb-0">Confirm Gift Transfer</h5>
                            <small class="text-white-50">Please verify the recipient details</small>
                        </div>
                    </div>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                </div>
                
                <div class="modal-body p-4">
                    <div class="recipient-verified-card mb-3">
                        <div class="d-flex align-items-center gap-3 mb-3">
                            <div class="recipient-avatar-lg" id="recipientAvatar">?</div>
                            <div class="flex-grow-1">
                                <div class="fw-bold fs-5" id="recipientName">--</div>
                                <div class="text-muted small">
                                    <code id="recipientCodeDisplay">--</code>
                                </div>
                            </div>
                            <span class="badge bg-success">
                                <i class="bi bi-patch-check-fill me-1"></i>Verified
                            </span>
                        </div>
                        <div class="recipient-details-grid">
                            <div class="recipient-detail-row">
                                <span class="label">Email</span>
                                <span class="value" id="recipientEmailDisplay">--</span>
                            </div>
                            <div class="recipient-detail-row">
                                <span class="label">Status</span>
                                <span class="value">
                                    <span class="badge bg-success" id="recipientStatus">Active</span>
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- Transfer Summary -->
                    <div class="transfer-summary">
                        <h6 class="fw-bold mb-2">
                            <i class="bi bi-arrow-left-right me-1"></i> Transfer Summary
                        </h6>
                        <div class="summary-row">
                            <span>From:</span>
                            <strong id="senderNameDisplay">--</strong>
                        </div>
                        <div class="summary-row">
                            <span>To:</span>
                            <strong id="recipientSummaryName">--</strong>
                        </div>
                        <div class="summary-row">
                            <span>Coupon:</span>
                            <strong id="summaryCouponTitle">--</strong>
                        </div>
                        <div class="summary-row">
                            <span>Value:</span>
                            <strong class="text-success" id="summaryCouponValue">--</strong>
                        </div>
                        <div class="summary-row" id="summaryMessageRow" style="display:none;">
                            <span>Message:</span>
                            <em id="summaryMessage">--</em>
                        </div>
                    </div>

                    <div class="alert alert-warning small mt-3 mb-0">
                        <i class="bi bi-exclamation-triangle me-1"></i>
                        <strong>Important:</strong> This action cannot be undone. The coupon will be permanently transferred to the recipient's wallet.
                    </div>
                </div>
                
                <div class="modal-footer border-0">
                    <button type="button" class="btn btn-outline-secondary" id="btnBackToStep1">
                        <i class="bi bi-arrow-left me-1"></i> Back
                    </button>
                    <button type="button" class="btn btn-success" id="btnConfirmGift">
                        <i class="bi bi-gift me-1"></i> Complete Gift Transfer
                    </button>
                </div>
            </div>

            <!-- Step 3: Processing -->
            <div id="giftStep3" class="d-none">
                <div class="modal-body p-5 text-center">
                    <div class="gift-processing-icon mb-3">
                        <div class="spinner-border text-primary" role="status" style="width: 4rem; height: 4rem;"></div>
                    </div>
                    <h5 class="fw-bold mb-2">Transferring Coupon...</h5>
                    <p class="text-muted mb-0">Please wait while we process your gift</p>
                </div>
            </div>

        </div>
    </div>
</div>

<!-- ============================================ -->
<!-- 🔥 GIFT SUCCESS MODAL                        -->
<!-- ============================================ -->
<div class="modal fade" id="giftSuccessModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow-lg">
            <div class="modal-body p-5 text-center">
                <div class="gift-success-animation mb-3">
                    <i class="bi bi-gift-fill"></i>
                </div>
                <h4 class="fw-bold mb-2">Gift Sent Successfully!</h4>
                <p class="text-muted mb-4" id="giftSuccessMessage">
                    Your coupon has been transferred to the recipient's wallet.
                </p>
                <div class="gift-success-details bg-success bg-opacity-10 rounded-3 p-3 mb-4 text-start">
                    <div class="summary-row">
                        <span>Recipient:</span>
                        <strong id="successRecipientName">--</strong>
                    </div>
                    <div class="summary-row">
                        <span>Coupon:</span>
                        <strong id="successCouponTitle">--</strong>
                    </div>
                    <div class="summary-row">
                        <span>Transfer ID:</span>
                        <code id="successTransferId">--</code>
                    </div>
                    <div class="summary-row">
                        <span>Transferred at:</span>
                        <strong id="successTransferTime">--</strong>
                    </div>
                </div>
                <button type="button" class="btn btn-success w-100" id="btnCloseGiftSuccess">
                    <i class="bi bi-check-circle me-1"></i> Done
                </button>
            </div>
        </div>
    </div>
</div>

<!-- ============================================ -->
<!-- 🔥 GIFT ERROR MODAL                          -->
<!-- ============================================ -->
<div class="modal fade" id="giftErrorModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow-lg">
            <div class="modal-body p-4 text-center">
                <div class="gift-error-icon mb-3">
                    <i class="bi bi-exclamation-triangle-fill"></i>
                </div>
                <h5 class="fw-bold mb-2" id="giftErrorTitle">Transfer Failed</h5>
                <p class="text-muted mb-3" id="giftErrorMessage">Something went wrong.</p>
                <div class="alert alert-light small text-start" id="giftErrorDetails" style="display:none;">
                    <!-- Additional details if needed -->
                </div>
                <button type="button" class="btn btn-outline-danger w-100" data-bs-dismiss="modal">
                    <i class="bi bi-x-circle me-1"></i> Close
                </button>
            </div>
        </div>
    </div>
</div>




<!-- 🔥 Error Modal -->
<div class="modal fade" id="customerErrorModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-sm">
        <div class="modal-content border-0 shadow-lg">
            <div class="modal-body text-center p-4">
                <div class="mb-3">
                    <i class="bi bi-exclamation-triangle-fill text-danger" style="font-size: 3rem;"></i>
                </div>
                <h5 class="fw-bold mb-2">Oops!</h5>
                <p class="text-muted mb-3" id="customerErrorMessage">Something went wrong.</p>
                <button type="button" class="btn btn-danger w-100" data-bs-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>

