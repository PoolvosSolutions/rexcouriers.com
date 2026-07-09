function initDashboardView() {
    console.log("✅ Dashboard View Initialized");

    // ============================================
    // 🔥 DATETIME UPDATE
    // ============================================
    function updateDashDateTime() {
        const now = new Date();
        $('#dashDisplayDate').text(now.toLocaleDateString('en-US', { 
            year: 'numeric', month: 'short', day: 'numeric', 
            timeZone: 'Asia/Karachi' 
        }));
        $('#dashDisplayTime').text(now.toLocaleTimeString('en-US', { 
            hour: '2-digit', minute: '2-digit', second: '2-digit', 
            hour12: true, timeZone: 'Asia/Karachi' 
        }));
    }
    updateDashDateTime();
    setInterval(updateDashDateTime, 1000);

    // ============================================
    // 🔥 SIGN OUT FUNCTIONALITY
    // ============================================
    
    // User Menu Dropdown Toggle
    $("#userMenuBtn").off("click").on("click", function(e) {
        e.stopPropagation();
        $("#userDropdown").toggleClass("show");
    });

    // Close dropdown when clicking outside
    $(document).off("click.dropdown").on("click.dropdown", function(e) {
        if (!$(e.target).closest("#userMenuBtn, #userDropdown").length) {
            $("#userDropdown").removeClass("show");
        }
    });

    $("#signOutBtn").on("click", function(e) {
        e.preventDefault();
        $("#userDropdown").removeClass("show");
        const signOutModal = new bootstrap.Modal(document.getElementById('signOutModal'));
        signOutModal.show();
    });

    // 🔥 CONFIRM SIGN OUT
    $("#confirmSignOutBtn").on("click", function() {
        clearSession();
        
        if (typeof FirebaseAuth !== "undefined" && FirebaseAuth.logout) {
            FirebaseAuth.logout().catch(err => console.log("Firebase logout:", err));
        }
        
        window.location.href = "index.php?signout=1";
    });


    // ============================================
    // 🔥 LOAD DASHBOARD STATS
    // ============================================
    async function loadDashboardStats() {
        try {
            // Load all data in parallel
            const [merchants, branches, coupons, users] = await Promise.all([
                FirebaseDB.getList('merchants'),
                FirebaseDB.getList('branches'),
                FirebaseDB.getList('coupons'),
                FirebaseDB.getList('users')
            ]);

            // Count active items
            const activeMerchants = merchants.filter(m => m.status === 'Active').length;
            const activeBranches = branches.filter(b => b.status === 'Active').length;
            const activeCoupons = coupons.filter(c => c.status === 'Active').length;
            const activeUsers = users.filter(u => u.userStatus === 'Active').length;

            // Update UI with animation
            animateCounter('#dashStatMerchants', activeMerchants);
            animateCounter('#dashStatBranches', activeBranches);
            animateCounter('#dashStatCoupons', activeCoupons);
            animateCounter('#dashStatUsers', activeUsers);

            // Load recent activity
            loadRecentActivity(merchants, branches, coupons, users);

        } catch (error) {
            console.error("Error loading dashboard stats:", error);
            $('#dashStatMerchants, #dashStatBranches, #dashStatCoupons, #dashStatUsers').text('--');
        }
    }

    // ============================================
    // 🔥 ANIMATE COUNTER
    // ============================================
    function animateCounter(selector, target) {
        const $el = $(selector);
        const duration = 1000;
        const steps = 30;
        const increment = target / steps;
        let current = 0;
        let step = 0;

        const timer = setInterval(() => {
            step++;
            current = Math.min(Math.round(increment * step), target);
            $el.text(current);
            if (step >= steps) {
                clearInterval(timer);
                $el.text(target);
            }
        }, duration / steps);
    }

    // ============================================
    // 🔥 LOAD RECENT ACTIVITY
    // ============================================
    function loadRecentActivity(merchants, branches, coupons, users) {
        const $list = $('#recentActivityList');
        $list.empty();

        // Combine all items with timestamps
        const allItems = [
            ...merchants.map(m => ({ 
                type: 'merchant', 
                title: m.name, 
                date: m.createdAt, 
                icon: 'bi-shop', 
                color: 'primary' 
            })),
            ...branches.map(b => ({ 
                type: 'branch', 
                title: b.name, 
                date: b.createdAt, 
                icon: 'bi-building', 
                color: 'success' 
            })),
            ...coupons.map(c => ({ 
                type: 'coupon', 
                title: c.title, 
                date: c.createdAt, 
                icon: 'bi-ticket-perforated', 
                color: 'warning' 
            })),
            ...users.map(u => ({ 
                type: 'user', 
                title: u.fullName, 
                date: u.createdAt, 
                icon: 'bi-person', 
                color: 'info' 
            }))
        ];

        // Sort by date descending
        allItems.sort((a, b) => (b.date || '').localeCompare(a.date || ''));

        // Take top 10
        const recent = allItems.slice(0, 10);

        if (recent.length === 0) {
            $list.html('<p class="text-muted text-center py-4">No recent activity</p>');
            return;
        }

        recent.forEach(item => {
            const dateStr = item.date ? new Date(item.date).toLocaleString('en-GB', {
                day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
                timeZone: 'Asia/Karachi'
            }) : '--';

            $list.append(`
                <div class="activity-item">
                    <div class="activity-icon bg-${item.color} bg-opacity-10 text-${item.color}">
                        <i class="bi ${item.icon}"></i>
                    </div>
                    <div class="flex-grow-1">
                        <div class="fw-semibold">${item.title}</div>
                        <div class="small text-muted">New ${item.type} added</div>
                    </div>
                    <div class="small text-muted">${dateStr}</div>
                </div>
            `);
        });
    }

    // ============================================
    // 🔥 QUICK ACTION BUTTONS
    // ============================================
    $(document).on('click', '.quick-action-btn', function() {
        const view = $(this).data('view');
        if (view && typeof window.loadView === 'function') {
            window.loadView(view);
        }
    });

    // ============================================
    // 🔥 INITIALIZE
    // ============================================
    loadDashboardStats();


    function clearSession() {
       sessionStorage.clear();
        localStorage.clear();
    }

    
}