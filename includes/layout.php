


    <div class="app-wrapper">
        
        <!-- 🔥 1. SIDEBAR -->
        <!-- 🔥 1. SIDEBAR -->
<aside class="app-sidebar">
    <div class="sidebar-header">
        <h4><i class="bi bi-box-seam-fill text-danger me-2"></i>REX Courier</h4>
    </div>
    <nav class="sidebar-menu">
        <ul class="menu-list">
            
            <!-- Dashboard Link -->
            <li>
                <a href="#" class="menu-link" data-view="admindashboard">
                    <i class="bi bi-speedometer2"></i>
                    <span>Dashboard</span>
                </a>
            </li>

            <!-- 🔥 CUSTOMER MANAGEMENT MENU -->
            <li class="menu-group">
                <a href="#" class="menu-parent" data-submenu="submenuCustomers">
                    <i class="bi bi-person-badge-fill"></i>
                    <span>Customer Management</span>
                    <i class="bi bi-chevron-down ms-auto submenu-arrow"></i>
                </a>
                <ul class="submenu" id="submenuCustomers">
                    <li>
                        <a href="#" class="menu-link" data-view="customer">
                            <i class="bi bi-list-ul"></i>
                            <span>All Customers</span>
                        </a>
                    </li>
                    <li>
                        <a href="#" class="menu-link" data-view="addcustomer">
                            <i class="bi bi-person-plus-fill"></i>
                            <span>Add New Customer</span>
                        </a>
                    </li>
                </ul>
            </li>


            <!-- 🔥 CARRIER / PARTNER MANAGEMENT MENU -->
            <li class="menu-group">
                <a href="#" class="menu-parent" data-submenu="submenuCarriers">
                    <i class="bi bi-buildings"></i>
                    <span>Carrier Partners</span>
                    <i class="bi bi-chevron-down ms-auto submenu-arrow"></i>
                </a>
                <ul class="submenu" id="submenuCarriers">
                    <li>
                        <a href="#" class="menu-link" data-view="carrier">
                            <i class="bi bi-list-ul"></i>
                            <span>All Carriers</span>
                        </a>
                    </li>
                    <li>
                        <a href="#" class="menu-link" data-view="addcarrier">
                            <i class="bi bi-building-add"></i>
                            <span>Add New Carrier</span>
                        </a>
                    </li>
                </ul>
            </li>


            <!-- 🔥 OPERATIONS MENU -->
            <li class="menu-group">
                <a href="#" class="menu-parent" data-submenu="submenuOps">
                    <i class="bi bi-box-seam"></i>
                    <span>Operations</span>
                    <i class="bi bi-chevron-down ms-auto submenu-arrow"></i>
                </a>
                <ul class="submenu" id="submenuOps">
                    <li><a href="#" class="menu-link" data-view="newbooking"><i class="bi bi-plus-circle"></i> <span>New Booking</span></a></li>
                    <li><a href="#" class="menu-link" data-view="bookinglist"><i class="bi bi-list-ul"></i> <span>Manage Bookings</span></a></li>
                    <li><a href="#" class="menu-link" data-view="trackshipment"><i class="bi bi-search"></i> <span>Track Shipment</span></a></li>
                    
                    <!-- 🔥 NEW: MANIFEST & RUN SHEET -->
                    <li><a href="#" class="menu-link" data-view="manifest"><i class="bi bi-file-earmark-text"></i> <span>Manifest</span></a></li>
                    <li><a href="#" class="menu-link" data-view="runsheet"><i class="bi bi-clipboard2-data"></i> <span>Run Sheet</span></a></li>
                </ul>
            </li>

            <li class="menu-group">
                <a href="#" class="menu-parent" data-submenu="submenuFinance">
                    <i class="bi bi-cash-coin"></i>
                    <span>Finance</span>
                    <i class="bi bi-chevron-down ms-auto submenu-arrow"></i>
                </a>
                <ul class="submenu" id="submenuFinance">
                    <li><a href="#" class="menu-link" data-view="billinggeneration"><i class="bi bi-file-earmark-ruled"></i> <span>Generate Bill</span></a></li>
                    <li><a href="#" class="menu-link" data-view="billinglist"><i class="bi bi-receipt"></i> <span>All Bills</span></a></li>
                    <li><a href="#" class="menu-link" data-view="receivables"><i class="bi bi-cash-stack"></i> <span>Receivables</span></a></li>
                    <li><a href="#" class="menu-link" data-view="payments"><i class="bi bi-credit-card"></i> <span>Payments Received</span></a></li>
                </ul>
            </li>


            <!-- 🔥 CHARGES / PRICING CONFIGURATION MENU -->
            <li class="menu-group">
                <a href="#" class="menu-parent" data-submenu="submenuCharges">
                    <i class="bi bi-tags-fill"></i>
                    <span>Charge Configuration</span>
                    <i class="bi bi-chevron-down ms-auto submenu-arrow"></i>
                </a>
                <ul class="submenu" id="submenuCharges">
                    <li>
                        <a href="#" class="menu-link" data-view="charge">
                            <i class="bi bi-list-ul"></i>
                            <span>All Charges</span>
                        </a>
                    </li>
                    <li>
                        <a href="#" class="menu-link" data-view="addcharge">
                            <i class="bi bi-plus-circle"></i>
                            <span>Add New Charge</span>
                        </a>
                    </li>
                </ul>
            </li>


            <!-- 🔥 TAX CONFIGURATION MENU -->
            <li class="menu-group">
                <a href="#" class="menu-parent" data-submenu="submenuTax">
                    <i class="bi bi-receipt-cutoff"></i>
                    <span>Tax Configuration</span>
                    <i class="bi bi-chevron-down ms-auto submenu-arrow"></i>
                </a>
                <ul class="submenu" id="submenuTax">
                    <li>
                        <a href="#" class="menu-link" data-view="tax">
                            <i class="bi bi-list-ul"></i>
                            <span>All Taxes</span>
                        </a>
                    </li>
                    <li>
                        <a href="#" class="menu-link" data-view="addtax">
                            <i class="bi bi-plus-circle"></i>
                            <span>Add New Tax</span>
                        </a>
                    </li>
                </ul>
            </li>


            <!-- Settings Menu -->
            <li class="menu-group">
                <a href="#" class="menu-parent" data-submenu="submenuSettings">
                    <i class="bi bi-gear"></i>
                    <span>Settings</span>
                    <i class="bi bi-chevron-down ms-auto submenu-arrow"></i>
                </a>
                <ul class="submenu" id="submenuSettings">
                    <li><a href="#" class="menu-link" data-view="countriesview"><i class="bi bi-globe-americas"></i> <span>Countries</span></a></li>
                    <!-- Other settings items -->
                </ul>
            </li>


            <!-- 🔥 TERMS & UNDERTAKINGS MENU -->
        <li class="menu-group">
            <a href="#" class="menu-parent" data-submenu="submenuLegal">
                <i class="bi bi-file-earmark-ruled"></i>
                <span>Legal Documents</span>
                <i class="bi bi-chevron-down ms-auto submenu-arrow"></i>
            </a>
            <ul class="submenu" id="submenuLegal">
                <li>
                    <a href="#" class="menu-link" data-view="terms">
                        <i class="bi bi-list-ul"></i>
                        <span>Terms & Conditions</span>
                    </a>
                </li>
                <li>
                    <a href="#" class="menu-link" data-view="addterms">
                        <i class="bi bi-plus-circle"></i>
                        <span>Add New Terms</span>
                    </a>
                </li>
                <li>
                    <a href="#" class="menu-link" data-view="undertaking">
                        <i class="bi bi-list-ul"></i>
                        <span>Undertakings</span>
                    </a>
                </li>
                <li>
                    <a href="#" class="menu-link" data-view="addundertaking">
                        <i class="bi bi-plus-circle"></i>
                        <span>Add New Undertaking</span>
                    </a>
                </li>
            </ul>
        </li>




            <!-- 🔥 USER MANAGEMENT MENU (WITH SUBMENU) -->
            <li class="menu-group">
                <a href="#" class="menu-parent" data-submenu="submenuUsers">
                    <i class="bi bi-people-fill"></i>
                    <span>User Management</span>
                    <i class="bi bi-chevron-down ms-auto submenu-arrow"></i>
                </a>
                <ul class="submenu" id="submenuUsers">
                    <li>
                        <a href="#" class="menu-link" data-view="users">
                            <i class="bi bi-list-ul"></i>
                            <span>All Users</span>
                        </a>
                    </li>
                    <li>
                        <a href="#" class="menu-link" data-view="adduser">
                            <i class="bi bi-person-plus-fill"></i>
                            <span>Add New User</span>
                        </a>
                    </li>
                </ul>
            </li>

            

        </ul>
    </nav>
</aside>

        <!-- 🔥 2. MAIN CONTENT AREA -->
        <div class="app-content">
            
            <!-- 🔥 HEADER (Hamburger Left, Logout Right) -->
            <header class="app-header">
                <button id="hamburgerBtn" class="hamburger-btn">
                    <i class="bi bi-list"></i> <!-- 3-bar hamburger icon -->
                </button>
                
                <div class="header-right">
                    <span>Welcome, <?php echo $fullName; ?></span>
                    <button id="logoutBtn" class="btn btn-sm btn-outline-danger ms-3">
                        <i class="bi bi-box-arrow-right"></i> Logout
                    </button>
                </div>
            </header>

            <!-- 🔥 DYNAMIC CONTENT LOADER -->
            <main id="dynamicContent" class="p-4">
                <!-- PHP views will be loaded here via jQuery .load() -->
                <div class="text-center my-5">
                    <div class="spinner-border text-primary"></div>
                    <p>Loading Dashboard...</p>
                </div>
            </main>

        </div>
    </div>
