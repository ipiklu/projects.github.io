        // Master Synthetic Dataset
        const rawData = [
            { id: 1, date: '2026-01-12', rep: 'Emma Watson', region: 'North America', category: 'Electronics', units: 35, revenue: 8750, profit: 3062, quarter: 'Q1' },
            { id: 2, date: '2026-01-28', rep: 'Li Wei', region: 'Asia-Pacific', category: 'Furniture', units: 18, revenue: 4500, profit: 1125, quarter: 'Q1' },
            { id: 3, date: '2026-02-05', rep: 'John Smith', region: 'Europe', category: 'Office Supplies', units: 95, revenue: 2850, profit: 997, quarter: 'Q1' },
            { id: 4, date: '2026-02-19', rep: 'Carlos Silva', region: 'Latin America', category: 'Electronics', units: 22, revenue: 6600, profit: 2310, quarter: 'Q1' },
            { id: 5, date: '2026-03-02', rep: 'Sarah Jenkins', region: 'North America', category: 'Furniture', units: 40, revenue: 12000, profit: 3600, quarter: 'Q1' },
            { id: 6, date: '2026-03-24', rep: 'Emma Watson', region: 'North America', category: 'Office Supplies', units: 110, revenue: 4400, profit: 1760, quarter: 'Q1' },
            { id: 7, date: '2026-04-10', rep: 'Li Wei', region: 'Asia-Pacific', category: 'Electronics', units: 48, revenue: 14400, profit: 5040, quarter: 'Q2' },
            { id: 8, date: '2026-04-22', rep: 'John Smith', region: 'Europe', category: 'Furniture', units: 15, revenue: 5250, profit: 1312, quarter: 'Q2' },
            { id: 9, date: '2026-05-14', rep: 'Carlos Silva', region: 'Latin America', category: 'Office Supplies', units: 80, revenue: 2400, profit: 840, quarter: 'Q2' },
            { id: 10, date: '2026-05-30', rep: 'Sarah Jenkins', region: 'North America', category: 'Electronics', units: 29, revenue: 10150, profit: 4060, quarter: 'Q2' },
            { id: 11, date: '2026-06-11', rep: 'Emma Watson', region: 'North America', category: 'Furniture', units: 26, revenue: 7800, profit: 2184, quarter: 'Q2' },
            { id: 12, date: '2026-06-25', rep: 'Li Wei', region: 'Asia-Pacific', category: 'Office Supplies', units: 140, revenue: 4200, profit: 1470, quarter: 'Q2' },
            { id: 13, date: '2026-07-08', rep: 'John Smith', region: 'Europe', category: 'Electronics', units: 31, revenue: 9300, profit: 3255, quarter: 'Q3' },
            { id: 14, date: '2026-07-21', rep: 'Carlos Silva', region: 'Latin America', category: 'Furniture', units: 12, revenue: 3600, profit: 900, quarter: 'Q3' },
            { id: 15, date: '2026-08-04', rep: 'Sarah Jenkins', region: 'North America', category: 'Office Supplies', units: 90, revenue: 3650, profit: 1277, quarter: 'Q3' },
            { id: 16, date: '2026-08-18', rep: 'Emma Watson', region: 'Europe', category: 'Electronics', units: 25, revenue: 8000, profit: 2800, quarter: 'Q3' },
            { id: 17, date: '2026-09-09', rep: 'Li Wei', region: 'Asia-Pacific', category: 'Electronics', units: 42, revenue: 13440, profit: 4704, quarter: 'Q3' },
            { id: 18, date: '2026-09-27', rep: 'John Smith', region: 'Europe', category: 'Office Supplies', units: 75, revenue: 2250, profit: 787, quarter: 'Q3' },
            { id: 19, date: '2026-10-05', rep: 'Carlos Silva', region: 'Latin America', category: 'Electronics', units: 19, revenue: 6080, profit: 2128, quarter: 'Q4' },
            { id: 20, date: '2026-10-18', rep: 'Sarah Jenkins', region: 'North America', category: 'Furniture', units: 33, revenue: 9900, profit: 2970, quarter: 'Q4' },
            { id: 21, date: '2026-11-02', rep: 'Emma Watson', region: 'North America', category: 'Electronics', units: 50, revenue: 15000, profit: 5250, quarter: 'Q4' },
            { id: 22, date: '2026-11-15', rep: 'Li Wei', region: 'Asia-Pacific', category: 'Furniture', units: 21, revenue: 6300, profit: 1890, quarter: 'Q4' }
        ];

        // Chart Instances Storage
        let chartInstances = {};
        let currentFilteredData = [...rawData];
        let currentPage = 1;
        const rowsPerPage = 6;
        let sortColumn = 'date';
        let sortAsc = false;

        // Initialize App on DOM Load
        window.onload = function() {
            initSparklines();
            initCharts();
            applyFilters();
        };

        // Initialize Sparkline Charts in KPI Cards
        function initSparklines() {
            const sparklineConfig = (color) => ({
                type: 'line',
                data: {
                    labels: [1, 2, 3, 4, 5, 6],
                    datasets: [{
                        data: [12, 19, 15, 25, 22, 30],
                        borderColor: color,
                        borderWidth: 2,
                        pointRadius: 0,
                        fill: false,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false }, tooltip: { enabled: false } },
                    scales: { x: { display: false }, y: { display: false } }
                }
            });

            new Chart(document.getElementById('sparklineRevenue'), sparklineConfig('#3B82F6'));
            new Chart(document.getElementById('sparklineProfit'), sparklineConfig('#10B981'));
            new Chart(document.getElementById('sparklineMargin'), sparklineConfig('#8B5CF6'));
            new Chart(document.getElementById('sparklineUnits'), sparklineConfig('#06B6D4'));
        }

        // Initialize Main Analytics Charts
        function initCharts() {
            // Chart 1: Revenue vs Profit Trend (Line Area)
            const ctxTrend = document.getElementById('chartTrend').getContext('2d');
            chartInstances.trend = new Chart(ctxTrend, {
                type: 'line',
                data: { labels: [], datasets: [] },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        x: { grid: { color: '#1F2937' }, ticks: { color: '#9CA3AF' } },
                        y: { grid: { color: '#1F2937' }, ticks: { color: '#9CA3AF', callback: v => '$' + v.toLocaleString() } }
                    }
                }
            });

            // Chart 2: Category Donut
            const ctxCategory = document.getElementById('chartCategory').getContext('2d');
            chartInstances.category = new Chart(ctxCategory, {
                type: 'doughnut',
                data: { labels: [], datasets: [] },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { position: 'bottom', labels: { color: '#E5E7EB', font: { size: 11 } } }
                    },
                    cutout: '70%'
                }
            });

            // Chart 3: Region Revenue Bar
            const ctxRegion = document.getElementById('chartRegion').getContext('2d');
            chartInstances.region = new Chart(ctxRegion, {
                type: 'bar',
                data: { labels: [], datasets: [] },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        x: { grid: { display: false }, ticks: { color: '#9CA3AF' } },
                        y: { grid: { color: '#1F2937' }, ticks: { color: '#9CA3AF', callback: v => '$' + v.toLocaleString() } }
                    }
                }
            });

            // Chart 4: Top Sales Reps (Horizontal Bar)
            const ctxReps = document.getElementById('chartReps').getContext('2d');
            chartInstances.reps = new Chart(ctxReps, {
                type: 'bar',
                data: { labels: [], datasets: [] },
                options: {
                    indexAxis: 'y',
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        x: { grid: { color: '#1F2937' }, ticks: { color: '#9CA3AF', callback: v => '$' + v.toLocaleString() } },
                        y: { grid: { display: false }, ticks: { color: '#9CA3AF' } }
                    }
                }
            });
        }

        // Apply Interactive Filters Function
        function applyFilters() {
            const regFilter = document.getElementById('filterRegion').value;
            const catFilter = document.getElementById('filterCategory').value;
            const dateFilter = document.getElementById('filterDate').value;

            currentFilteredData = rawData.filter(item => {
                const matchReg = (regFilter === 'All' || item.region === regFilter);
                const matchCat = (catFilter === 'All' || item.category === catFilter);
                const matchDate = (dateFilter === 'All' || item.quarter === dateFilter);
                return matchReg && matchCat && matchDate;
            });

            updateKPIs();
            updateCharts();
            renderTable();
        }

        // Reset Filters
        function resetFilters() {
            document.getElementById('filterRegion').value = 'All';
            document.getElementById('filterCategory').value = 'All';
            document.getElementById('filterDate').value = 'All';
            document.getElementById('tableSearch').value = '';
            applyFilters();
        }

        // Update Top KPI Cards
        function updateKPIs() {
            const totalRevenue = currentFilteredData.reduce((acc, i) => acc + i.revenue, 0);
            const totalProfit = currentFilteredData.reduce((acc, i) => acc + i.profit, 0);
            const totalUnits = currentFilteredData.reduce((acc, i) => acc + i.units, 0);
            const avgMargin = totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(1) : 0;

            document.getElementById('kpiRevenue').innerText = '$' + totalRevenue.toLocaleString();
            document.getElementById('kpiProfit').innerText = '$' + totalProfit.toLocaleString();
            document.getElementById('kpiMargin').innerText = avgMargin + '%';
            document.getElementById('kpiUnits').innerText = totalUnits.toLocaleString();
        }

        // Update Dynamic Visualizations
        function updateCharts() {
            // 1. Monthly Financial Trend Update
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'];
            const monthlyRev = new Array(11).fill(0);
            const monthlyProf = new Array(11).fill(0);

            currentFilteredData.forEach(item => {
                const monthIdx = parseInt(item.date.split('-')[1]) - 1;
                if (monthIdx < 11) {
                    monthlyRev[monthIdx] += item.revenue;
                    monthlyProf[monthIdx] += item.profit;
                }
            });

            chartInstances.trend.data = {
                labels: months,
                datasets: [
                    {
                        label: 'Revenue',
                        data: monthlyRev,
                        borderColor: '#3B82F6',
                        backgroundColor: 'rgba(59, 130, 246, 0.15)',
                        fill: true,
                        tension: 0.35,
                        borderWidth: 2
                    },
                    {
                        label: 'Profit',
                        data: monthlyProf,
                        borderColor: '#10B981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        fill: true,
                        tension: 0.35,
                        borderWidth: 2
                    }
                ]
            };
            chartInstances.trend.update();

            // 2. Category Donut Update
            const catMap = {};
            currentFilteredData.forEach(item => {
                catMap[item.category] = (catMap[item.category] || 0) + item.revenue;
            });

            chartInstances.category.data = {
                labels: Object.keys(catMap),
                datasets: [{
                    data: Object.values(catMap),
                    backgroundColor: ['#8B5CF6', '#3B82F6', '#06B6D4'],
                    borderWidth: 0
                }]
            };
            chartInstances.category.update();

            // 3. Region Revenue Bar Update
            const regMap = {};
            currentFilteredData.forEach(item => {
                regMap[item.region] = (regMap[item.region] || 0) + item.revenue;
            });

            chartInstances.region.data = {
                labels: Object.keys(regMap),
                datasets: [{
                    label: 'Revenue',
                    data: Object.values(regMap),
                    backgroundColor: ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B'],
                    borderRadius: 6
                }]
            };
            chartInstances.region.update();

            // 4. Sales Reps Update
            const repMap = {};
            currentFilteredData.forEach(item => {
                repMap[item.rep] = (repMap[item.rep] || 0) + item.revenue;
            });
            const sortedReps = Object.entries(repMap).sort((a, b) => b[1] - a[1]);

            chartInstances.reps.data = {
                labels: sortedReps.map(r => r[0]),
                datasets: [{
                    label: 'Revenue',
                    data: sortedReps.map(r => r[1]),
                    backgroundColor: 'rgba(59, 130, 246, 0.8)',
                    borderRadius: 6
                }]
            };
            chartInstances.reps.update();
        }

        // Render Interactive Data Table
        function renderTable() {
            const tbody = document.getElementById('tableBody');
            const searchValue = document.getElementById('tableSearch').value.toLowerCase();

            // Table level search filtering
            let displayData = currentFilteredData.filter(item => 
                item.rep.toLowerCase().includes(searchValue) ||
                item.category.toLowerCase().includes(searchValue) ||
                item.region.toLowerCase().includes(searchValue)
            );

            // Sorting logic
            displayData.sort((a, b) => {
                let valA = a[sortColumn];
                let valB = b[sortColumn];
                if (typeof valA === 'string') {
                    return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
                }
                return sortAsc ? valA - valB : valB - valA;
            });

            // Pagination calculation
            const totalRows = displayData.length;
            const totalPages = Math.ceil(totalRows / rowsPerPage) || 1;
            if (currentPage > totalPages) currentPage = totalPages;

            const startIdx = (currentPage - 1) * rowsPerPage;
            const pageData = displayData.slice(startIdx, startIdx + rowsPerPage);

            tbody.innerHTML = '';

            if (pageData.length === 0) {
                tbody.innerHTML = `<tr><td colspan="8" class="text-center py-6 text-gray-500">No records found matching current criteria</td></tr>`;
            } else {
                pageData.forEach(row => {
                    const marginPct = (row.profit / row.revenue) * 100;
                    let badgeClass = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
                    let badgeLabel = "High Margin";

                    if (marginPct < 25) {
                        badgeClass = "bg-rose-500/10 text-rose-400 border-rose-500/20";
                        badgeLabel = "Low Margin";
                    } else if (marginPct < 35) {
                        badgeClass = "bg-amber-500/10 text-amber-400 border-amber-500/20";
                        badgeLabel = "Mid Margin";
                    }

                    const tr = document.createElement('tr');
                    tr.className = "hover:bg-gray-800/40 transition-colors";
                    tr.innerHTML = `
                        <td class="py-3 px-4 font-mono text-gray-400">${row.date}</td>
                        <td class="py-3 px-4 font-semibold text-gray-200">${row.rep}</td>
                        <td class="py-3 px-4 text-gray-300">${row.region}</td>
                        <td class="py-3 px-4 text-gray-300">${row.category}</td>
                        <td class="py-3 px-4 text-right font-mono">${row.units}</td>
                        <td class="py-3 px-4 text-right font-mono font-medium text-white">$${row.revenue.toLocaleString()}</td>
                        <td class="py-3 px-4 text-right font-mono text-emerald-400">$${row.profit.toLocaleString()}</td>
                        <td class="py-3 px-4 text-center">
                            <span class="px-2.5 py-1 text-[10px] rounded-full border ${badgeClass} font-medium">
                                ${badgeLabel}
                            </span>
                        </td>
                    `;
                    tbody.appendChild(tr);
                });
            }

            // Update Counter Info
            document.getElementById('tableCountInfo').innerText = `Showing ${pageData.length} of ${totalRows} entries`;

            // Render Pagination Buttons
            const pagContainer = document.getElementById('paginationControls');
            pagContainer.innerHTML = '';
            
            for (let i = 1; i <= totalPages; i++) {
                const btn = document.createElement('button');
                btn.className = `px-2.5 py-1 text-xs rounded-md border transition-all ${i === currentPage ? 'bg-pink-900 border-pink-800 text-white' : 'bg-gray-900 border-gray-700 text-gray-400 hover:bg-gray-800'}`;
                btn.innerText = i;
                btn.onclick = () => { currentPage = i; renderTable(); };
                pagContainer.appendChild(btn);
            }
        }

        // Sorting Helper
        function sortTable(col) {
            if (sortColumn === col) {
                sortAsc = !sortAsc;
            } else {
                sortColumn = col;
                sortAsc = true;
            }
            renderTable();
        }

        // Table Search Trigger
        function filterTable() {
            currentPage = 1;
            renderTable();
        }

        // Export Function Mock
        function exportSummary() {
            const summaryText = `EXECUTIVE ANALYTICS SUMMARY REPORT\nTotal Revenue: ${document.getElementById('kpiRevenue').innerText}\nTotal Profit: ${document.getElementById('kpiProfit').innerText}\nAvg Margin: ${document.getElementById('kpiMargin').innerText}\nTotal Units: ${document.getElementById('kpiUnits').innerText}`;
            
            const blob = new Blob([summaryText], { type: 'text/plain' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'PowerBI_Executive_Summary.txt';
            link.click();
        }
		
function reloadClear() {
  window.localStorage.clear();
  window.location.reload(true);
  return false;
}	