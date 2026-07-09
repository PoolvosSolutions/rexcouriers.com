
// ============================================
// 🔥 ADMIN GLOBAL STATS LOADER
// ============================================
function loadAdminNavbarStats() {
    (async function() {
        try {
            const [merchants, branches, users, redemptions] = await Promise.all([
                FirebaseDB.getList('users').then(list => list.filter(u => u.userType === 'Merchant')),
                FirebaseDB.getList('branches'),
                FirebaseDB.getList('users'),
                FirebaseDB.getList('redemptions')
            ]);

            const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Karachi' });
            const todayRedemptions = redemptions.filter(r => {
                if (r.status !== 'completed') return false;
                const rDate = r.date || (r.completedAtTimestamp ? new Date(r.completedAtTimestamp).toLocaleDateString('en-CA', { timeZone: 'Asia/Karachi' }) : '');
                return rDate === today;
            });

            const todayRevenue = todayRedemptions.reduce((sum, r) => {
                const val = typeof r.discountValue === 'number' ? r.discountValue : 0;
                return sum + val;
            }, 0);

            // Update navbar stats
            $('#navStatMerchants').text(merchants.length);
            $('#navStatBranches').text(branches.length);
            $('#navStatUsers').text(users.length);
            $('#navStatRedemptions').text(todayRedemptions.length);
            $('#navStatRevenue').text('Rs. ' + todayRevenue.toLocaleString());

            // Update dropdown summary
            $('#dropdownMerchantCount').text(merchants.length);
            $('#dropdownBranchCount').text(branches.length);
            $('#dropdownRevenue').text('Rs. ' + todayRevenue.toLocaleString());

            // Store for detail modals
            window.adminSystemData = {
                merchants: merchants,
                branches: branches,
                users: users,
                redemptions: redemptions.filter(r => r.status === 'completed'),
                todayRedemptions: todayRedemptions,
                todayRevenue: todayRevenue
            };

            // Generate notifications
            generateAdminNotifications(todayRedemptions, merchants);

        } catch (error) {
            console.error("Error loading admin stats:", error);
        }
    })();
}

// ============================================
// 🔥 NOTIFICATION SYSTEM
// ============================================
function generateAdminNotifications(todayRedemptions, merchants) {
    const notifications = [];
    const now = Date.now();

    // Recent redemptions (last hour)
    const recentRedemptions = todayRedemptions.filter(r => {
        const ts = r.completedAtTimestamp || 0;
        return (now - ts) < 60 * 60 * 1000;
    }).slice(0, 5);

    recentRedemptions.forEach(r => {
        notifications.push({
            type: 'redemption',
            icon: 'bi-check-circle-fill',
            title: `${r.customerName || 'Customer'} redeemed ${r.couponTitle || 'coupon'}`,
            subtitle: `${r.merchantName} • ${r.branchName}`,
            time: r.completedAtTimestamp,
            unread: true
        });
    });

    // System notifications
    if (merchants.length > 0) {
        notifications.push({
            type: 'merchant',
            icon: 'bi-building',
            title: `${merchants.length} active merchants on platform`,
            subtitle: 'System overview',
            time: now,
            unread: false
        });
    }

    renderNotifications(notifications);
}

function renderNotifications(notifications) {
    const $list = $('#adminNotifList');
    const unreadCount = notifications.filter(n => n.unread).length;
    
    $('#adminNotifBadge').text(unreadCount).toggle(unreadCount > 0);

    if (notifications.length === 0) {
        $list.html(`
            <div class="text-center py-4 text-muted small">
                <i class="bi bi-bell-slash fs-1 d-block mb-2"></i>
                No notifications
            </div>
        `);
        return;
    }

    $list.empty();
    notifications.forEach(notif => {
        const timeAgo = getTimeAgo(notif.time);
        $list.append(`
            <div class="notif-item ${notif.unread ? 'unread' : ''}">
                <div class="notif-icon type-${notif.type}">
                    <i class="bi ${notif.icon}"></i>
                </div>
                <div class="notif-content">
                    <div class="notif-title">${notif.title}</div>
                    <div class="notif-time">${notif.subtitle} • ${timeAgo}</div>
                </div>
            </div>
        `);
    });
}

function getTimeAgo(timestamp) {
    if (!timestamp) return '--';
    const diff = Date.now() - timestamp;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
}

// ============================================
// 🔥 SMART DETAIL MODAL SYSTEM
// ============================================
const AdminDetailModal = {
    currentType: null,
    currentTab: 'list',
    chartInstance: null,

    init() {
        $(document).on('click', '.clickable-stat', (e) => {
            const type = $(e.currentTarget).data('stat-type');
            this.open(type);
        });

        $(document).on('click', '.modal-tab', (e) => {
            const tab = $(e.currentTarget).data('modal-tab');
            this.switchTab(tab);
        });

        $('#btnExportDetail').on('click', () => this.exportData());
    },

    open(type) {
        this.currentType = type;
        this.currentTab = 'list';
        
        const data = window.adminSystemData;
        if (!data) {
            console.warn("System data not loaded yet");
            return;
        }

        const configs = {
            merchants: {
                title: 'Merchants Overview',
                subtitle: `${data.merchants.length} total merchants`,
                icon: 'bi-building',
                data: data.merchants,
                footer: `Last updated: ${new Date().toLocaleTimeString()}`
            },
            branches: {
                title: 'Branches Overview',
                subtitle: `${data.branches.length} total branches`,
                icon: 'bi-diagram-3',
                data: data.branches,
                footer: `Last updated: ${new Date().toLocaleTimeString()}`
            },
            users: {
                title: 'Users Overview',
                subtitle: `${data.users.length} total users`,
                icon: 'bi-people',
                data: data.users,
                footer: `Last updated: ${new Date().toLocaleTimeString()}`
            },
            redemptions: {
                title: "Today's Redemptions",
                subtitle: `${data.todayRedemptions.length} redemptions today`,
                icon: 'bi-check2-all',
                data: data.todayRedemptions,
                footer: `Total value: Rs. ${data.todayRevenue.toLocaleString()}`
            },
            revenue: {
                title: 'Revenue Breakdown',
                subtitle: `Today: Rs. ${data.todayRevenue.toLocaleString()}`,
                icon: 'bi-cash-stack',
                data: data.todayRedemptions,
                footer: `Based on ${data.todayRedemptions.length} transactions`
            }
        };

        const config = configs[type];
        if (!config) return;

        $('#detailModalTitle').text(config.title);
        $('#detailModalSubtitle').text(config.subtitle);
        $('#detailModalIcon').html(`<i class="bi ${config.icon}"></i>`);
        $('#detailModalFooter').text(config.footer);

        $('.modal-tab').removeClass('active');
        $('.modal-tab[data-modal-tab="list"]').addClass('active');

        this.renderListView(config.data, type);

        const modalEl = document.getElementById('adminDetailModal');
        if (modalEl) {
            const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
            modal.show();
        }
    },

    switchTab(tab) {
        this.currentTab = tab;
        $('.modal-tab').removeClass('active');
        $(`.modal-tab[data-modal-tab="${tab}"]`).addClass('active');

        const data = window.adminSystemData;
        const type = this.currentType;

        if (tab === 'list') {
            let items = data[type === 'revenue' ? 'todayRedemptions' : type];
            this.renderListView(items, type);
        } else if (tab === 'chart') {
            this.renderChartView(type);
        } else if (tab === 'summary') {
            this.renderSummaryView(type);
        }
    },

    renderListView(items, type) {
        const $content = $('#detailModalContent');
        $content.empty();

        if (!items || items.length === 0) {
            $content.html(`
                <div class="text-center py-5 text-muted">
                    <i class="bi bi-inbox fs-1 d-block mb-2"></i>
                    <p>No data available</p>
                </div>
            `);
            return;
        }

        let html = '';
        const displayItems = items.slice(0, 50);

        if (type === 'merchants') {
            displayItems.forEach(m => {
                const branchCount = (window.adminSystemData.branches || []).filter(b => b.merchantCode === m.merchantCode).length;
                html += `
                    <div class="detail-list-item">
                        <div class="detail-item-avatar"><i class="bi bi-building"></i></div>
                        <div class="detail-item-info">
                            <div class="detail-item-title">${m.merchantName || '--'}</div>
                            <div class="detail-item-meta">
                                <code>${m.merchantCode || '--'}</code>
                                <span>•</span>
                                <span>${branchCount} branches</span>
                                <span>•</span>
                                <span>${m.email || '--'}</span>
                            </div>
                        </div>
                        <div class="detail-item-value">
                            <span class="badge bg-${m.userStatus === 'Active' ? 'success' : 'secondary'}">${m.userStatus || 'Active'}</span>
                        </div>
                    </div>
                `;
            });
        } else if (type === 'branches') {
            displayItems.forEach(b => {
                html += `
                    <div class="detail-list-item">
                        <div class="detail-item-avatar"><i class="bi bi-shop"></i></div>
                        <div class="detail-item-info">
                            <div class="detail-item-title">${b.name || '--'}</div>
                            <div class="detail-item-meta">
                                <code>${b.branchCode || '--'}</code>
                                <span>•</span>
                                <span>${b.merchantName || '--'}</span>
                                <span>•</span>
                                <span>${b.address || 'No address'}</span>
                            </div>
                        </div>
                        <div class="detail-item-value">
                            <span class="badge bg-${b.status === 'Active' ? 'success' : 'secondary'}">${b.status || 'Active'}</span>
                        </div>
                    </div>
                `;
            });
        } else if (type === 'users') {
            const byType = {};
            items.forEach(u => {
                const t = u.userType || 'Unknown';
                if (!byType[t]) byType[t] = [];
                byType[t].push(u);
            });

            Object.keys(byType).forEach(userType => {
                html += `<h6 class="text-admin-primary fw-bold mt-3 mb-2"><i class="bi bi-tag me-2"></i>${userType} (${byType[userType].length})</h6>`;
                byType[userType].slice(0, 10).forEach(u => {
                    html += `
                        <div class="detail-list-item">
                            <div class="detail-item-avatar">${(u.fullName || '?').charAt(0).toUpperCase()}</div>
                            <div class="detail-item-info">
                                <div class="detail-item-title">${u.fullName || '--'}</div>
                                <div class="detail-item-meta">
                                    <code>${u.userCode || '--'}</code>
                                    <span>•</span>
                                    <span>${u.email || '--'}</span>
                                </div>
                            </div>
                            <div class="detail-item-value">
                                <span class="badge bg-${u.userStatus === 'Active' ? 'success' : 'secondary'}">${u.userStatus || 'Active'}</span>
                            </div>
                        </div>
                    `;
                });
            });
        } else if (type === 'redemptions' || type === 'revenue') {
            displayItems.forEach(r => {
                const offer = this.extractOfferValue(r);
                html += `
                    <div class="detail-list-item">
                        <div class="detail-item-avatar"><i class="bi bi-ticket-perforated"></i></div>
                        <div class="detail-item-info">
                            <div class="detail-item-title">${r.couponTitle || '--'}</div>
                            <div class="detail-item-meta">
                                <span>${r.customerName || '--'}</span>
                                <span>•</span>
                                <span>${r.merchantName || '--'}</span>
                                <span>•</span>
                                <span>${r.branchName || '--'}</span>
                            </div>
                        </div>
                        <div class="detail-item-value">
                            <div class="detail-item-main">${offer.text}</div>
                            <div class="detail-item-sub">${this.formatTime(r.completedAtTimestamp)}</div>
                        </div>
                    </div>
                `;
            });
        }

        if (items.length > 50) {
            html += `<div class="text-center text-muted small mt-3">Showing 50 of ${items.length} items</div>`;
        }

        $content.html(html);
    },

    renderChartView(type) {
        const $content = $('#detailModalContent');
        $content.html('<div class="modal-chart-container"><canvas id="modalChart"></canvas></div>');

        if (this.chartInstance) {
            this.chartInstance.destroy();
            this.chartInstance = null;
        }

        const ctx = document.getElementById('modalChart');
        if (!ctx) return;

        const data = window.adminSystemData;
        let chartConfig;

        if (type === 'merchants') {
            const merchantData = data.merchants.map(m => {
                const count = data.branches.filter(b => b.merchantCode === m.merchantCode).length;
                return { name: m.merchantName, count };
            }).sort((a, b) => b.count - a.count).slice(0, 10);

            chartConfig = {
                type: 'bar',
                data: {
                    labels: merchantData.map(m => m.name),
                    datasets: [{
                        label: 'Branches',
                        data: merchantData.map(m => m.count),
                        backgroundColor: '#0d9488',
                        borderRadius: 6
                    }]
                },
                options: { 
                    responsive: true, 
                    maintainAspectRatio: false,
                    plugins: { title: { display: true, text: 'Top Merchants by Branch Count' } }
                }
            };
        } else if (type === 'branches') {
            const active = data.branches.filter(b => b.status === 'Active').length;
            const inactive = data.branches.length - active;

            chartConfig = {
                type: 'doughnut',
                data: {
                    labels: ['Active', 'Inactive'],
                    datasets: [{
                        data: [active, inactive],
                        backgroundColor: ['#10b981', '#94a3b8'],
                        borderWidth: 3,
                        borderColor: '#fff'
                    }]
                },
                options: { 
                    responsive: true, 
                    maintainAspectRatio: false,
                    plugins: { title: { display: true, text: 'Branch Status Distribution' } }
                }
            };
        } else if (type === 'users') {
            const byType = {};
            data.users.forEach(u => {
                const t = u.userType || 'Unknown';
                byType[t] = (byType[t] || 0) + 1;
            });

            chartConfig = {
                type: 'pie',
                data: {
                    labels: Object.keys(byType),
                    datasets: [{
                        data: Object.values(byType),
                        backgroundColor: ['#0d9488', '#f59e0b', '#3b82f6', '#ec4899', '#8b5cf6', '#64748b'],
                        borderWidth: 3,
                        borderColor: '#fff'
                    }]
                },
                options: { 
                    responsive: true, 
                    maintainAspectRatio: false,
                    plugins: { title: { display: true, text: 'User Distribution by Type' } }
                }
            };
        } else if (type === 'redemptions' || type === 'revenue') {
            const hourCounts = new Array(24).fill(0);
            data.todayRedemptions.forEach(r => {
                const ts = r.completedAtTimestamp || 0;
                if (ts) {
                    const hour = new Date(ts).getHours();
                    hourCounts[hour]++;
                }
            });

            chartConfig = {
                type: 'bar',
                data: {
                    labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
                    datasets: [{
                        label: 'Redemptions',
                        data: hourCounts,
                        backgroundColor: '#0d9488',
                        borderRadius: 4
                    }]
                },
                options: { 
                    responsive: true, 
                    maintainAspectRatio: false,
                    plugins: { title: { display: true, text: 'Hourly Redemption Distribution (Today)' } }
                }
            };
        }

        if (chartConfig) {
            this.chartInstance = new Chart(ctx, chartConfig);
        }
    },

    renderSummaryView(type) {
        const $content = $('#detailModalContent');
        const data = window.adminSystemData;
        let html = '';

        if (type === 'merchants') {
            const active = data.merchants.filter(m => m.userStatus === 'Active').length;
            const totalBranches = data.branches.length;
            const avgBranches = data.merchants.length > 0 ? (totalBranches / data.merchants.length).toFixed(1) : 0;

            html = `
                <div class="modal-summary-grid">
                    <div class="modal-summary-card">
                        <div class="summary-label">Total Merchants</div>
                        <div class="summary-value">${data.merchants.length}</div>
                    </div>
                    <div class="modal-summary-card" style="border-left-color: #10b981;">
                        <div class="summary-label">Active</div>
                        <div class="summary-value">${active}</div>
                    </div>
                    <div class="modal-summary-card" style="border-left-color: #f59e0b;">
                        <div class="summary-label">Total Branches</div>
                        <div class="summary-value">${totalBranches}</div>
                    </div>
                    <div class="modal-summary-card" style="border-left-color: #3b82f6;">
                        <div class="summary-label">Avg Branches/Merchant</div>
                        <div class="summary-value">${avgBranches}</div>
                    </div>
                </div>
                <h6 class="fw-bold mt-4 mb-3"><i class="bi bi-trophy me-2 text-warning"></i>Top 5 Merchants by Branch Count</h6>
            `;

            const topMerchants = data.merchants.map(m => ({
                name: m.merchantName,
                code: m.merchantCode,
                count: data.branches.filter(b => b.merchantCode === m.merchantCode).length
            })).sort((a, b) => b.count - a.count).slice(0, 5);

            topMerchants.forEach((m, i) => {
                html += `
                    <div class="detail-list-item">
                        <div class="detail-item-avatar" style="background: ${i === 0 ? 'linear-gradient(135deg, #fbbf24, #f59e0b)' : i === 1 ? 'linear-gradient(135deg, #cbd5e1, #94a3b8)' : 'linear-gradient(135deg, #0d9488, #0f766e)'};">
                            ${i + 1}
                        </div>
                        <div class="detail-item-info">
                            <div class="detail-item-title">${m.name || '--'}</div>
                            <div class="detail-item-meta"><code>${m.code}</code></div>
                        </div>
                        <div class="detail-item-value">
                            <div class="detail-item-main">${m.count}</div>
                            <div class="detail-item-sub">branches</div>
                        </div>
                    </div>
                `;
            });
        } else if (type === 'branches') {
            const active = data.branches.filter(b => b.status === 'Active').length;
            const byMerchant = {};
            data.branches.forEach(b => {
                byMerchant[b.merchantName || 'Unknown'] = (byMerchant[b.merchantName || 'Unknown'] || 0) + 1;
            });

            html = `
                <div class="modal-summary-grid">
                    <div class="modal-summary-card">
                        <div class="summary-label">Total Branches</div>
                        <div class="summary-value">${data.branches.length}</div>
                    </div>
                    <div class="modal-summary-card" style="border-left-color: #10b981;">
                        <div class="summary-label">Active</div>
                        <div class="summary-value">${active}</div>
                    </div>
                    <div class="modal-summary-card" style="border-left-color: #f59e0b;">
                        <div class="summary-label">Inactive</div>
                        <div class="summary-value">${data.branches.length - active}</div>
                    </div>
                    <div class="modal-summary-card" style="border-left-color: #3b82f6;">
                        <div class="summary-label">Merchants</div>
                        <div class="summary-value">${Object.keys(byMerchant).length}</div>
                    </div>
                </div>
            `;
        } else if (type === 'users') {
            const byType = {};
            data.users.forEach(u => {
                const t = u.userType || 'Unknown';
                byType[t] = (byType[t] || 0) + 1;
            });
            const active = data.users.filter(u => u.userStatus === 'Active').length;

            html = `<div class="modal-summary-grid">`;
            html += `
                <div class="modal-summary-card">
                    <div class="summary-label">Total Users</div>
                    <div class="summary-value">${data.users.length}</div>
                </div>
                <div class="modal-summary-card" style="border-left-color: #10b981;">
                    <div class="summary-label">Active</div>
                    <div class="summary-value">${active}</div>
                </div>
            `;

            Object.keys(byType).forEach(userType => {
                html += `
                    <div class="modal-summary-card">
                        <div class="summary-label">${userType}</div>
                        <div class="summary-value">${byType[userType]}</div>
                    </div>
                `;
            });
            html += `</div>`;
        } else if (type === 'redemptions' || type === 'revenue') {
            const total = data.todayRedemptions.length;
            const revenue = data.todayRevenue;
            const avg = total > 0 ? Math.round(revenue / total) : 0;
            const uniqueCustomers = new Set(data.todayRedemptions.map(r => r.customerId)).size;

            const byMerchant = {};
            data.todayRedemptions.forEach(r => {
                const m = r.merchantName || 'Unknown';
                if (!byMerchant[m]) byMerchant[m] = { count: 0, value: 0 };
                byMerchant[m].count++;
                byMerchant[m].value += (typeof r.discountValue === 'number' ? r.discountValue : 0);
            });

            html = `
                <div class="modal-summary-grid">
                    <div class="modal-summary-card">
                        <div class="summary-label">Today's Redemptions</div>
                        <div class="summary-value">${total}</div>
                    </div>
                    <div class="modal-summary-card" style="border-left-color: #f59e0b;">
                        <div class="summary-label">Revenue</div>
                        <div class="summary-value">Rs. ${revenue.toLocaleString()}</div>
                    </div>
                    <div class="modal-summary-card" style="border-left-color: #3b82f6;">
                        <div class="summary-label">Avg Value</div>
                        <div class="summary-value">Rs. ${avg.toLocaleString()}</div>
                    </div>
                    <div class="modal-summary-card" style="border-left-color: #ec4899;">
                        <div class="summary-label">Unique Customers</div>
                        <div class="summary-value">${uniqueCustomers}</div>
                    </div>
                </div>
                <h6 class="fw-bold mt-4 mb-3"><i class="bi bi-trophy me-2 text-warning"></i>Revenue by Merchant (Today)</h6>
            `;

            Object.entries(byMerchant)
                .sort((a, b) => b[1].value - a[1].value)
                .forEach(([name, stats]) => {
                    html += `
                        <div class="detail-list-item">
                            <div class="detail-item-avatar"><i class="bi bi-building"></i></div>
                            <div class="detail-item-info">
                                <div class="detail-item-title">${name}</div>
                                <div class="detail-item-meta">${stats.count} redemptions</div>
                            </div>
                            <div class="detail-item-value">
                                <div class="detail-item-main">Rs. ${stats.value.toLocaleString()}</div>
                            </div>
                        </div>
                    `;
                });
        }

        $content.html(html);
    },

    exportData() {
        const data = window.adminSystemData;
        const type = this.currentType;
        if (!data || !type) return;

        let items = data[type === 'revenue' ? 'todayRedemptions' : type];
        if (!items || items.length === 0) {
            alert('No data to export');
            return;
        }

        let headers = [];
        let rows = [];

        if (type === 'merchants') {
            headers = ['Name', 'Code', 'Email', 'Phone', 'Status', 'Branches'];
            rows = items.map(m => [
                m.merchantName || '',
                m.merchantCode || '',
                m.email || '',
                m.phone || '',
                m.userStatus || '',
                data.branches.filter(b => b.merchantCode === m.merchantCode).length
            ]);
        } else if (type === 'branches') {
            headers = ['Name', 'Code', 'Merchant', 'Address', 'Phone', 'Status'];
            rows = items.map(b => [
                b.name || '',
                b.branchCode || '',
                b.merchantName || '',
                b.address || '',
                b.phone || '',
                b.status || ''
            ]);
        } else if (type === 'users') {
            headers = ['Name', 'Code', 'Email', 'Phone', 'Type', 'Status'];
            rows = items.map(u => [
                u.fullName || '',
                u.userCode || '',
                u.email || '',
                u.phone || '',
                u.userType || '',
                u.userStatus || ''
            ]);
        } else {
            headers = ['Time', 'Customer', 'Merchant', 'Branch', 'Coupon', 'Offer', 'Code Used'];
            rows = items.map(r => [
                this.formatTime(r.completedAtTimestamp),
                r.customerName || '',
                r.merchantName || '',
                r.branchName || '',
                r.couponTitle || '',
                this.extractOfferValue(r).text,
                r.codeUsed || ''
            ]);
        }

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `admin_${type}_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    },

    extractOfferValue(r) {
        if (r.discountType === 'FreeItem') return { text: 'FREE ITEM', value: 0 };
        if (r.discountType === 'Percentage') return { text: `${r.discountValue}% OFF`, value: r.discountValue || 0 };
        if (r.discountType === 'Fixed') return { text: `Rs. ${r.discountValue} OFF`, value: r.discountValue || 0 };
        if (r.discountType === 'BOGO') return { text: 'BUY 1 GET 1', value: 0 };
        return { text: r.offerValue || 'SPECIAL', value: r.discountValue || 0 };
    },

    formatTime(timestamp) {
        if (!timestamp) return '--';
        const date = typeof timestamp === 'number' ? new Date(timestamp) : new Date(timestamp);
        if (isNaN(date.getTime())) return '--';
        return date.toLocaleTimeString('en-GB', {
            hour: '2-digit', minute: '2-digit',
            timeZone: 'Asia/Karachi'
        });
    }
};

// ============================================
// 🔥 NOTIFICATION PANEL TOGGLE
// ============================================
$(document).on('click', '#adminNotifBtn', function(e) {
    e.stopPropagation();
    $('#adminNotificationPanel').toggleClass('show');
    $('.js-user-dropdown').removeClass('show');
});

$(document).on('click', function(e) {
    if (!$(e.target).closest('#adminNotifBtn, #adminNotificationPanel').length) {
        $('#adminNotificationPanel').removeClass('show');
    }
});

$('#btnMarkAllRead').on('click', function() {
    $('.notif-item.unread').removeClass('unread');
    $('#adminNotifBadge').text('0').hide();
});

// ============================================
// 🔥 ADMIN DASHBOARD VIEW
// ============================================
function initAdminDashboardView() {
    console.log("✅ Admin Dashboard Initialized");

    // Load navbar stats
    loadAdminNavbarStats();

    // Initialize detail modal system
    AdminDetailModal.init();

    // Build dashboard content
    const $content = $('#dynamicContent');
    $content.html(`
        <div class="container-fluid py-4">
            <div class="row mb-4">
                <div class="col-12">
                    <div class="admin-welcome-card rounded-3 shadow-sm p-4">
                        <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                            <div>
                                <h3 class="fw-bold text-white mb-1">
                                    <i class="bi bi-speedometer me-2"></i>Admin Dashboard
                                </h3>
                                <p class="text-white-50 mb-0">
                                    <span class="admin-pill">System Overview</span>
                                    <span class="separator">•</span>
                                    <span>Click any stat above for detailed insights</span>
                                </p>
                            </div>
                            <div class="d-flex gap-2">
                                <div class="sa-dt-box">
                                    <div class="sa-dt-label"><i class="bi bi-calendar3"></i> Date</div>
                                    <div class="sa-dt-value" id="adminDisplayDate">--</div>
                                </div>
                                <div class="sa-dt-box">
                                    <div class="sa-dt-label"><i class="bi bi-clock"></i> Time</div>
                                    <div class="sa-dt-value" id="adminDisplayTime">--</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row g-3 mb-4">
                <div class="col-lg-8">
                    <div class="card border-0 shadow-sm">
                        <div class="card-header bg-white border-0 py-3 px-4">
                            <h5 class="fw-bold mb-0">
                                <i class="bi bi-graph-up text-admin-primary me-2"></i>System Revenue Trend (30 Days)
                            </h5>
                        </div>
                        <div class="card-body">
                            <div style="height: 300px; position: relative;">
                                <canvas id="adminRevenueChart"></canvas>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-4">
                    <div class="card border-0 shadow-sm h-100">
                        <div class="card-header bg-white border-0 py-3 px-4">
                            <h5 class="fw-bold mb-0">
                                <i class="bi bi-pie-chart text-admin-primary me-2"></i>Activity Distribution
                            </h5>
                        </div>
                        <div class="card-body">
                            <div style="height: 300px; position: relative;">
                                <canvas id="adminActivityChart"></canvas>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row g-3">
                <div class="col-lg-6">
                    <div class="card border-0 shadow-sm">
                        <div class="card-header bg-white border-0 py-3 px-4">
                            <h5 class="fw-bold mb-0">
                                <i class="bi bi-trophy-fill text-warning me-2"></i>Top Merchants
                            </h5>
                        </div>
                        <div class="card-body" id="adminTopMerchants">
                            <div class="text-center py-4"><div class="spinner-border"></div></div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-6">
                    <div class="card border-0 shadow-sm">
                        <div class="card-header bg-white border-0 py-3 px-4">
                            <h5 class="fw-bold mb-0">
                                <i class="bi bi-activity text-danger me-2"></i>Recent Activity
                            </h5>
                        </div>
                        <div class="card-body" id="adminRecentActivity">
                            <div class="text-center py-4"><div class="spinner-border"></div></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `);

    // Add admin welcome card styles
    if (!$('#admin-extra-styles').length) {
        $('<style id="admin-extra-styles">')
            .text(`
                .admin-welcome-card {
                    background: linear-gradient(135deg, var(--admin-primary) 0%, var(--admin-primary-dark) 100%);
                    color: #fff;
                    position: relative;
                    overflow: hidden;
                }
                .admin-welcome-card::before {
                    content: '';
                    position: absolute;
                    top: -50%;
                    right: -10%;
                    width: 300px;
                    height: 300px;
                    background: radial-gradient(circle, rgba(245, 158, 11, 0.15) 0%, transparent 70%);
                    border-radius: 50%;
                }
                .admin-welcome-card > * { position: relative; z-index: 1; }
                .admin-pill {
                    background: rgba(245, 158, 11, 0.2);
                    padding: 0.2rem 0.6rem;
                    border-radius: 1rem;
                    font-weight: 600;
                    font-size: 0.8rem;
                    color: #fef3c7;
                    border: 1px solid rgba(245, 158, 11, 0.3);
                }
                .sa-dt-box {
                    background: rgba(255, 255, 255, 0.15);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    border-radius: 0.75rem;
                    padding: 0.6rem 1rem;
                    min-width: 130px;
                    text-align: center;
                }
                .sa-dt-label {
                    font-size: 0.7rem;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    color: rgba(255, 255, 255, 0.7);
                    margin-bottom: 0.25rem;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.35rem;
                }
                .sa-dt-value {
                    font-size: 0.95rem;
                    font-weight: 700;
                    color: #fff;
                    white-space: nowrap;
                }
                .merchant-rank.rank-1 {
                    background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
                    color: #fff;
                }
                .merchant-rank.rank-2 {
                    background: linear-gradient(135deg, #cbd5e1 0%, #94a3b8 100%);
                    color: #fff;
                }
                .merchant-rank.rank-3 {
                    background: linear-gradient(135deg, #d97706 0%, #92400e 100%);
                    color: #fff;
                }
                .merchant-rank.rank-other {
                    background: #f1f5f9;
                    color: #64748b;
                }
                .merchant-bar {
                    height: 4px;
                    background: #f1f5f9;
                    border-radius: 2px;
                    overflow: hidden;
                }
                .merchant-bar-fill {
                    height: 100%;
                    background: linear-gradient(90deg, var(--admin-primary) 0%, var(--admin-gold) 100%);
                    border-radius: 2px;
                    transition: width 0.6s ease;
                }
                .detail-list-item {
                    display: flex;
                    align-items: center;
                    gap: 0.85rem;
                    padding: 0.85rem;
                    border-radius: 0.75rem;
                    border: 1px solid #e2e8f0;
                    margin-bottom: 0.6rem;
                    transition: all 0.2s;
                    background: #fff;
                }
                .detail-list-item:hover {
                    border-color: var(--admin-primary);
                    box-shadow: 0 2px 8px rgba(13, 148, 136, 0.1);
                }
                .detail-item-avatar {
                    width: 44px;
                    height: 44px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, var(--admin-primary) 0%, var(--admin-primary-dark) 100%);
                    color: #fff;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 700;
                    font-size: 1rem;
                    flex-shrink: 0;
                }
                .detail-item-info { flex: 1; min-width: 0; }
                .detail-item-title {
                    font-weight: 600;
                    color: #0f172a;
                    font-size: 0.95rem;
                    margin-bottom: 0.15rem;
                }
                .detail-item-meta {
                    font-size: 0.75rem;
                    color: #64748b;
                    display: flex;
                    gap: 0.5rem;
                    flex-wrap: wrap;
                }
                .detail-item-value { text-align: right; flex-shrink: 0; }
                .detail-item-main {
                    font-weight: 700;
                    color: var(--admin-primary);
                    font-size: 1rem;
                }
                .detail-item-sub {
                    font-size: 0.7rem;
                    color: #94a3b8;
                }
            `)
            .appendTo('head');
    }

    // Start clock
    function updateClock() {
        const now = new Date();
        $('#adminDisplayDate').text(now.toLocaleDateString('en-US', {
            day: '2-digit', month: 'short', year: 'numeric',
            timeZone: 'Asia/Karachi'
        }));
        $('#adminDisplayTime').text(now.toLocaleTimeString('en-US', {
            hour: '2-digit', minute: '2-digit', second: '2-digit',
            hour12: true, timeZone: 'Asia/Karachi'
        }));
    }
    updateClock();
    setInterval(updateClock, 1000);

    // Wait for data then render charts
    const waitForData = setInterval(() => {
        if (window.adminSystemData) {
            clearInterval(waitForData);
            renderAdminCharts();
            renderTopMerchants();
            renderRecentActivity();
        }
    }, 100);
}

function renderAdminCharts() {
    const data = window.adminSystemData;
    if (!data) return;

    // Revenue trend chart
    const ctx1 = document.getElementById('adminRevenueChart');
    if (ctx1) {
        const now = new Date();
        const dailyData = [];
        const labels = [];

        for (let i = 29; i >= 0; i--) {
            const dayStart = new Date(now);
            dayStart.setDate(dayStart.getDate() - i);
            dayStart.setHours(0, 0, 0, 0);
            const dayEnd = new Date(dayStart);
            dayEnd.setHours(23, 59, 59, 999);

            const dayRedemptions = data.redemptions.filter(r => {
                const ts = r.completedAtTimestamp || 0;
                return ts >= dayStart.getTime() && ts <= dayEnd.getTime();
            });

            const revenue = dayRedemptions.reduce((sum, r) => sum + (typeof r.discountValue === 'number' ? r.discountValue : 0), 0);
            dailyData.push(revenue);
            labels.push(dayStart.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }));
        }

        const gradient = ctx1.getContext('2d').createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, 'rgba(13, 148, 136, 0.3)');
        gradient.addColorStop(1, 'rgba(13, 148, 136, 0.02)');

        new Chart(ctx1, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Revenue (Rs.)',
                    data: dailyData,
                    borderColor: '#0d9488',
                    backgroundColor: gradient,
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 3,
                    pointBackgroundColor: '#0d9488'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { grid: { display: false }, ticks: { maxTicksLimit: 10 } },
                    y: { ticks: { callback: v => 'Rs.' + v } }
                }
            }
        });
    }

    // Activity distribution
    const ctx2 = document.getElementById('adminActivityChart');
    if (ctx2) {
        const byType = {};
        data.users.forEach(u => {
            const t = u.userType || 'Unknown';
            byType[t] = (byType[t] || 0) + 1;
        });

        new Chart(ctx2, {
            type: 'doughnut',
            data: {
                labels: Object.keys(byType),
                datasets: [{
                    data: Object.values(byType),
                    backgroundColor: ['#0d9488', '#f59e0b', '#3b82f6', '#ec4899', '#8b5cf6'],
                    borderWidth: 3,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '65%',
                plugins: { legend: { position: 'bottom' } }
            }
        });
    }
}

function renderTopMerchants() {
    const data = window.adminSystemData;
    const $list = $('#adminTopMerchants');
    $list.empty();

    const merchantStats = data.merchants.map(m => {
        const mRedemptions = data.redemptions.filter(r => r.merchantCode === m.merchantCode);
        const revenue = mRedemptions.reduce((sum, r) => sum + (typeof r.discountValue === 'number' ? r.discountValue : 0), 0);
        return { merchant: m, count: mRedemptions.length, revenue };
    }).sort((a, b) => b.revenue - a.revenue).slice(0, 5);

    if (merchantStats.length === 0) {
        $list.html('<p class="text-center text-muted py-3">No merchants yet</p>');
        return;
    }

    const maxRevenue = merchantStats[0]?.revenue || 1;
    merchantStats.forEach((stat, i) => {
        const rankClass = i === 0 ? 'rank-1' : i === 1 ? 'rank-2' : i === 2 ? 'rank-3' : 'rank-other';
        const barWidth = (stat.revenue / maxRevenue * 100).toFixed(1);

        $list.append(`
            <div class="detail-list-item">
                <div class="detail-item-avatar merchant-rank ${rankClass}">${i + 1}</div>
                <div class="detail-item-info">
                    <div class="detail-item-title">${stat.merchant.merchantName || '--'}</div>
                    <div class="detail-item-meta">
                        <code>${stat.merchant.merchantCode}</code> • ${stat.count} redemptions
                    </div>
                    <div class="merchant-bar mt-1">
                        <div class="merchant-bar-fill" style="width: ${barWidth}%"></div>
                    </div>
                </div>
                <div class="detail-item-value">
                    <div class="detail-item-main">Rs. ${stat.revenue.toLocaleString()}</div>
                </div>
            </div>
        `);
    });
}

function renderRecentActivity() {
    const data = window.adminSystemData;
    const $list = $('#adminRecentActivity');
    $list.empty();

    const recent = [...data.redemptions]
        .sort((a, b) => (b.completedAtTimestamp || 0) - (a.completedAtTimestamp || 0))
        .slice(0, 6);

    if (recent.length === 0) {
        $list.html('<p class="text-center text-muted py-3">No recent activity</p>');
        return;
    }

    recent.forEach(r => {
        $list.append(`
            <div class="detail-list-item">
                <div class="detail-item-avatar"><i class="bi bi-check-circle-fill"></i></div>
                <div class="detail-item-info">
                    <div class="detail-item-title">${r.customerName || 'Customer'}</div>
                    <div class="detail-item-meta">
                        ${r.couponTitle || 'coupon'} • ${r.merchantName} • ${r.branchName}
                    </div>
                </div>
                <div class="detail-item-value">
                    <div class="detail-item-sub">${AdminDetailModal.formatTime(r.completedAtTimestamp)}</div>
                </div>
            </div>
        `);
    });
}