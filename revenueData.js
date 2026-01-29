// Revenue Data Module
const RevenueData = {
    // Historical revenue data (last 30 days)
    dailyRevenue: [],
    
    // Product categories and their performance
    products: [
        { name: 'Fresh Produce', revenue: 15420, units: 1850, category: 'Perishable' },
        { name: 'Dairy Products', revenue: 12340, units: 1420, category: 'Perishable' },
        { name: 'Bakery Items', revenue: 8950, units: 980, category: 'Perishable' },
        { name: 'Beverages', revenue: 18750, units: 2150, category: 'Non-Perishable' },
        { name: 'Snacks & Candy', revenue: 11230, units: 1680, category: 'Non-Perishable' },
        { name: 'Frozen Foods', revenue: 9870, units: 890, category: 'Frozen' },
        { name: 'Meat & Seafood', revenue: 21450, units: 1120, category: 'Perishable' },
        { name: 'Household Items', revenue: 14680, units: 1340, category: 'Non-Perishable' },
        { name: 'Personal Care', revenue: 10540, units: 1050, category: 'Non-Perishable' },
        { name: 'Canned Goods', revenue: 7890, units: 1450, category: 'Non-Perishable' }
    ],
    
    // Generate revenue data for the past 30 days
    generateDailyRevenue() {
        this.dailyRevenue = []; // Clear previous data
        const baseRevenue = 5000;
        const now = new Date();
        
        for (let i = 29; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            
            // Add some variation and trends
            const trend = (30 - i) * 50; // Upward trend
            const dayOfWeek = date.getDay();
            const weekendBonus = (dayOfWeek === 0 || dayOfWeek === 6) ? 1000 : 0;
            const randomVariation = Math.random() * 1000 - 500;
            
            const revenue = baseRevenue + trend + weekendBonus + randomVariation;
            
            this.dailyRevenue.push({
                date: date,
                revenue: Math.round(revenue),
                transactions: Math.floor(revenue / 35), // Average transaction ~$35
                customers: Math.floor(revenue / 42) // Average per customer ~$42
            });
        }
    },
    
    // Calculate statistics
    getStatistics() {
        if (this.dailyRevenue.length === 0) {
            this.generateDailyRevenue();
        }
        
        const today = this.dailyRevenue[this.dailyRevenue.length - 1].revenue;
        const yesterday = this.dailyRevenue[this.dailyRevenue.length - 2].revenue;
        const todayChange = ((today - yesterday) / yesterday * 100).toFixed(1);
        
        const lastWeek = this.dailyRevenue.slice(-7);
        const weeklyRevenue = lastWeek.reduce((sum, day) => sum + day.revenue, 0);
        const previousWeek = this.dailyRevenue.slice(-14, -7);
        const previousWeekRevenue = previousWeek.reduce((sum, day) => sum + day.revenue, 0);
        const weeklyChange = ((weeklyRevenue - previousWeekRevenue) / previousWeekRevenue * 100).toFixed(1);
        
        const monthlyRevenue = this.dailyRevenue.reduce((sum, day) => sum + day.revenue, 0);
        const avgDailyRevenue = monthlyRevenue / this.dailyRevenue.length;
        const monthlyChange = ((monthlyRevenue - (avgDailyRevenue * 30 * 0.9)) / (avgDailyRevenue * 30 * 0.9) * 100).toFixed(1);
        
        return {
            today,
            todayChange,
            weeklyRevenue,
            weeklyChange,
            monthlyRevenue,
            monthlyChange,
            avgDailyRevenue
        };
    },
    
    // Get top performing products
    getTopProducts(limit = 5) {
        return [...this.products]
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, limit);
    },
    
    // Get all revenue data
    getAllData() {
        if (this.dailyRevenue.length === 0) {
            this.generateDailyRevenue();
        }
        return this.dailyRevenue;
    },
    
    // Calculate growth rate
    getGrowthRate() {
        if (this.dailyRevenue.length === 0) {
            this.generateDailyRevenue();
        }
        
        const first7Days = this.dailyRevenue.slice(0, 7).reduce((sum, day) => sum + day.revenue, 0) / 7;
        const last7Days = this.dailyRevenue.slice(-7).reduce((sum, day) => sum + day.revenue, 0) / 7;
        
        return ((last7Days - first7Days) / first7Days * 100).toFixed(1);
    }
};

// Initialize data
RevenueData.generateDailyRevenue();
