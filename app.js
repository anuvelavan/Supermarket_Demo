// Main Application Logic
class SuperMarketDashboard {
    constructor() {
        this.revenueData = [];
        this.products = [];
        this.chart = null;
        this.init();
    }
    
    init() {
        // Load data
        this.revenueData = RevenueData.getAllData();
        this.products = RevenueData.products;
        
        // Update dashboard
        this.updateRevenueCards();
        this.updateAIAnalysis();
        this.renderChart();
        this.renderTopProducts();
        
        // Setup event listeners
        this.setupEventListeners();
    }
    
    updateRevenueCards() {
        const stats = RevenueData.getStatistics();
        const prediction = AIAnalysis.predictRevenue(this.revenueData);
        
        // Today's revenue
        document.getElementById('todayRevenue').textContent = '$' + stats.today.toLocaleString();
        const todayChange = document.getElementById('todayChange');
        todayChange.textContent = (stats.todayChange >= 0 ? '+' : '') + stats.todayChange + '%';
        todayChange.className = 'change ' + (stats.todayChange >= 0 ? 'positive' : 'negative');
        
        // Weekly revenue
        document.getElementById('weeklyRevenue').textContent = '$' + stats.weeklyRevenue.toLocaleString();
        const weeklyChange = document.getElementById('weeklyChange');
        weeklyChange.textContent = (stats.weeklyChange >= 0 ? '+' : '') + stats.weeklyChange + '%';
        weeklyChange.className = 'change ' + (stats.weeklyChange >= 0 ? 'positive' : 'negative');
        
        // Monthly revenue
        document.getElementById('monthlyRevenue').textContent = '$' + stats.monthlyRevenue.toLocaleString();
        const monthlyChange = document.getElementById('monthlyChange');
        monthlyChange.textContent = (stats.monthlyChange >= 0 ? '+' : '') + stats.monthlyChange + '%';
        monthlyChange.className = 'change ' + (stats.monthlyChange >= 0 ? 'positive' : 'negative');
        
        // Predicted revenue
        document.getElementById('predictedRevenue').textContent = '$' + prediction.monthly.toLocaleString();
        document.getElementById('predictionConfidence').textContent = prediction.confidence + '% confidence';
    }
    
    updateAIAnalysis() {
        // Trend Analysis
        const trends = AIAnalysis.analyzeTrends(this.revenueData);
        const trendHTML = '<ul>' + trends.map(t => '<li>' + t + '</li>').join('') + '</ul>';
        document.getElementById('trendAnalysis').innerHTML = trendHTML;
        
        // Insights & Recommendations
        const insights = AIAnalysis.generateInsights(this.revenueData, this.products);
        const insightsHTML = '<ul>' + insights.map(i => '<li>' + i + '</li>').join('') + '</ul>';
        document.getElementById('insights').innerHTML = insightsHTML;
        
        // Performance Metrics
        const performance = AIAnalysis.calculatePerformance(this.revenueData, this.products);
        const performanceHTML = '<ul>' + performance.map(p => '<li>' + p + '</li>').join('') + '</ul>';
        document.getElementById('performance').innerHTML = performanceHTML;
    }
    
    renderChart() {
        const canvas = document.getElementById('revenueChart');
        const ctx = canvas.getContext('2d');
        
        // Set canvas size
        canvas.width = canvas.offsetWidth;
        canvas.height = 400;
        
        const width = canvas.width;
        const height = canvas.height;
        const padding = 50;
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        // Get data
        const data = this.revenueData.map(d => d.revenue);
        const maxRevenue = Math.max(...data);
        const minRevenue = Math.min(...data);
        const range = maxRevenue - minRevenue;
        
        // Draw axes
        ctx.strokeStyle = '#ccc';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, height - padding);
        ctx.lineTo(width - padding, height - padding);
        ctx.stroke();
        
        // Draw grid lines
        ctx.strokeStyle = '#f0f0f0';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 5; i++) {
            const y = padding + (height - 2 * padding) * i / 5;
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(width - padding, y);
            ctx.stroke();
            
            // Y-axis labels
            const value = maxRevenue - (range * i / 5);
            ctx.fillStyle = '#666';
            ctx.font = '12px Arial';
            ctx.textAlign = 'right';
            ctx.fillText('$' + Math.round(value).toLocaleString(), padding - 10, y + 5);
        }
        
        // Draw revenue line
        ctx.strokeStyle = '#667eea';
        ctx.lineWidth = 3;
        ctx.beginPath();
        
        const xStep = (width - 2 * padding) / (data.length - 1);
        
        data.forEach((revenue, index) => {
            const x = padding + index * xStep;
            const y = height - padding - ((revenue - minRevenue) / range) * (height - 2 * padding);
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        
        ctx.stroke();
        
        // Draw data points
        ctx.fillStyle = '#667eea';
        data.forEach((revenue, index) => {
            const x = padding + index * xStep;
            const y = height - padding - ((revenue - minRevenue) / range) * (height - 2 * padding);
            
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, 2 * Math.PI);
            ctx.fill();
        });
        
        // Draw prediction line
        const prediction = AIAnalysis.predictRevenue(this.revenueData, 7);
        ctx.strokeStyle = '#f5576c';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        
        const lastX = padding + (data.length - 1) * xStep;
        const lastY = height - padding - ((data[data.length - 1] - minRevenue) / range) * (height - 2 * padding);
        ctx.moveTo(lastX, lastY);
        
        prediction.daily.forEach((revenue, index) => {
            const x = padding + (data.length + index) * xStep;
            const y = height - padding - ((revenue - minRevenue) / range) * (height - 2 * padding);
            ctx.lineTo(x, y);
        });
        
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Chart title
        ctx.fillStyle = '#333';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Daily Revenue Trend (30 Days)', width / 2, 30);
        
        // Legend
        ctx.textAlign = 'left';
        ctx.font = '12px Arial';
        ctx.fillStyle = '#667eea';
        ctx.fillText('● Actual Revenue', width - 200, 30);
        ctx.fillStyle = '#f5576c';
        ctx.fillText('- - Predicted (7 Days)', width - 200, 50);
    }
    
    renderTopProducts() {
        const topProducts = RevenueData.getTopProducts(6);
        const container = document.getElementById('topProducts');
        
        container.innerHTML = topProducts.map(product => `
            <div class="product-item">
                <h4>${product.name}</h4>
                <p class="product-revenue">$${product.revenue.toLocaleString()}</p>
                <p class="product-units">${product.units} units sold</p>
            </div>
        `).join('');
    }
    
    setupEventListeners() {
        // Refresh button
        document.getElementById('refreshData').addEventListener('click', () => {
            this.refreshAnalysis();
        });
        
        // Generate report button
        document.getElementById('generateReport').addEventListener('click', () => {
            this.generateReport();
        });
        
        // Window resize
        window.addEventListener('resize', () => {
            this.renderChart();
        });
    }
    
    refreshAnalysis() {
        // Regenerate data with some variation
        RevenueData.generateDailyRevenue();
        this.revenueData = RevenueData.getAllData();
        
        // Update all sections
        this.updateRevenueCards();
        this.updateAIAnalysis();
        this.renderChart();
        this.renderTopProducts();
        
        // Show notification
        this.showNotification('Analysis refreshed successfully!');
    }
    
    generateReport() {
        const stats = RevenueData.getStatistics();
        const prediction = AIAnalysis.predictRevenue(this.revenueData);
        const trends = AIAnalysis.analyzeTrends(this.revenueData);
        const insights = AIAnalysis.generateInsights(this.revenueData, this.products);
        const performance = AIAnalysis.calculatePerformance(this.revenueData, this.products);
        
        const report = `
═══════════════════════════════════════════════════
    SUPERMARKET REVENUE AI ANALYSIS REPORT
═══════════════════════════════════════════════════

Generated: ${new Date().toLocaleString()}

REVENUE SUMMARY
---------------
Today's Revenue:     $${stats.today.toLocaleString()} (${stats.todayChange}%)
Weekly Revenue:      $${stats.weeklyRevenue.toLocaleString()} (${stats.weeklyChange}%)
Monthly Revenue:     $${stats.monthlyRevenue.toLocaleString()} (${stats.monthlyChange}%)

AI PREDICTION
-------------
Next Month Forecast: $${prediction.monthly.toLocaleString()}
Confidence Level:    ${prediction.confidence}%

TREND ANALYSIS
--------------
${trends.join('\n')}

INSIGHTS & RECOMMENDATIONS
--------------------------
${insights.join('\n')}

PERFORMANCE METRICS
-------------------
${performance.join('\n')}

TOP PERFORMING PRODUCTS
-----------------------
${RevenueData.getTopProducts(5).map((p, i) => 
    `${i + 1}. ${p.name}: $${p.revenue.toLocaleString()} (${p.units} units)`
).join('\n')}

═══════════════════════════════════════════════════
        `;
        
        // Create a blob and download
        const blob = new Blob([report], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'supermarket-revenue-report-' + Date.now() + '.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showNotification('Report generated and downloaded!');
    }
    
    showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        notification.textContent = message;
        
        // Add animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(400px); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(400px); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SuperMarketDashboard();
});
