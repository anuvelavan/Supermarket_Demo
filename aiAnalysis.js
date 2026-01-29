// AI Analysis Module - Intelligent Revenue Analysis
const AIAnalysis = {
    // Analyze revenue trends using AI algorithms
    analyzeTrends(revenueData) {
        const trends = [];
        const revenues = revenueData.map(d => d.revenue);
        
        // Calculate moving average
        const movingAvg = this.calculateMovingAverage(revenues, 7);
        
        // Determine trend direction
        const recentTrend = this.calculateTrendDirection(revenues.slice(-7));
        const overallTrend = this.calculateTrendDirection(revenues);
        
        // Identify patterns
        const volatility = this.calculateVolatility(revenues);
        const seasonality = this.detectSeasonality(revenueData);
        
        trends.push(`📈 Overall Trend: ${overallTrend.direction} (${overallTrend.strength})`);
        trends.push(`📊 Recent 7-Day Trend: ${recentTrend.direction} (${recentTrend.strength})`);
        trends.push(`💹 Volatility Index: ${volatility.toFixed(2)}% (${this.getVolatilityLevel(volatility)})`);
        trends.push(`🔄 Seasonality Detected: ${seasonality}`);
        
        return trends;
    },
    
    // Calculate moving average
    calculateMovingAverage(data, window) {
        const result = [];
        for (let i = window - 1; i < data.length; i++) {
            const slice = data.slice(i - window + 1, i + 1);
            const avg = slice.reduce((sum, val) => sum + val, 0) / window;
            result.push(avg);
        }
        return result;
    },
    
    // Determine trend direction and strength
    calculateTrendDirection(data) {
        const firstHalf = data.slice(0, Math.floor(data.length / 2));
        const secondHalf = data.slice(Math.floor(data.length / 2));
        
        const firstAvg = firstHalf.reduce((sum, val) => sum + val, 0) / firstHalf.length;
        const secondAvg = secondHalf.reduce((sum, val) => sum + val, 0) / secondHalf.length;
        
        const change = ((secondAvg - firstAvg) / firstAvg) * 100;
        
        let direction, strength;
        if (change > 5) {
            direction = 'Strong Growth';
            strength = 'High Confidence';
        } else if (change > 2) {
            direction = 'Moderate Growth';
            strength = 'Medium Confidence';
        } else if (change > -2) {
            direction = 'Stable';
            strength = 'Steady';
        } else if (change > -5) {
            direction = 'Slight Decline';
            strength = 'Monitor Closely';
        } else {
            direction = 'Significant Decline';
            strength = 'Action Required';
        }
        
        return { direction, strength, change: change.toFixed(2) };
    },
    
    // Calculate volatility
    calculateVolatility(data) {
        const mean = data.reduce((sum, val) => sum + val, 0) / data.length;
        const squaredDiffs = data.map(val => Math.pow(val - mean, 2));
        const variance = squaredDiffs.reduce((sum, val) => sum + val, 0) / data.length;
        const stdDev = Math.sqrt(variance);
        
        return (stdDev / mean) * 100;
    },
    
    // Get volatility level
    getVolatilityLevel(volatility) {
        if (volatility < 5) return 'Low - Stable';
        if (volatility < 10) return 'Moderate - Normal';
        if (volatility < 15) return 'High - Variable';
        return 'Very High - Unpredictable';
    },
    
    // Detect seasonality patterns
    detectSeasonality(revenueData) {
        const weekendRevenues = [];
        const weekdayRevenues = [];
        
        revenueData.forEach(day => {
            const dayOfWeek = day.date.getDay();
            if (dayOfWeek === 0 || dayOfWeek === 6) {
                weekendRevenues.push(day.revenue);
            } else {
                weekdayRevenues.push(day.revenue);
            }
        });
        
        const weekendAvg = weekendRevenues.reduce((sum, val) => sum + val, 0) / weekendRevenues.length;
        const weekdayAvg = weekdayRevenues.reduce((sum, val) => sum + val, 0) / weekdayRevenues.length;
        
        const diff = ((weekendAvg - weekdayAvg) / weekdayAvg) * 100;
        
        if (diff > 10) {
            return `Weekend Peak (+${diff.toFixed(1)}%)`;
        } else if (diff < -10) {
            return `Weekday Peak (+${Math.abs(diff).toFixed(1)}%)`;
        } else {
            return 'Consistent Pattern';
        }
    },
    
    // Generate insights and recommendations
    generateInsights(revenueData, products) {
        const insights = [];
        const stats = RevenueData.getStatistics();
        const growthRate = parseFloat(RevenueData.getGrowthRate());
        
        // Growth insights
        if (growthRate > 10) {
            insights.push('🚀 Exceptional growth! Revenue increased by ' + growthRate + '% over the past month.');
            insights.push('💼 Consider expanding inventory for high-demand products.');
        } else if (growthRate > 5) {
            insights.push('📈 Healthy growth trajectory with ' + growthRate + '% increase.');
            insights.push('✅ Current strategies are working well - maintain momentum.');
        } else if (growthRate < 0) {
            insights.push('⚠️ Revenue decline detected (-' + Math.abs(growthRate) + '%).');
            insights.push('🔍 Analyze customer feedback and competitor strategies.');
        } else {
            insights.push('📊 Stable revenue with ' + growthRate + '% growth.');
            insights.push('💡 Explore new marketing campaigns to boost sales.');
        }
        
        // Product insights
        const sortedProducts = [...products].sort((a, b) => b.revenue - a.revenue);
        const topProduct = sortedProducts[0];
        const totalRevenue = products.reduce((sum, p) => sum + p.revenue, 0);
        const topProductShare = (topProduct.revenue / totalRevenue * 100).toFixed(1);
        
        insights.push(`⭐ ${topProduct.name} leads with ${topProductShare}% of total revenue.`);
        
        // Recommendations
        const avgTransaction = stats.monthlyRevenue / (revenueData.length * revenueData[0].transactions);
        if (avgTransaction < 40) {
            insights.push('💰 Implement upselling strategies to increase average transaction value.');
        }
        
        return insights;
    },
    
    // Predict future revenue using linear regression
    predictRevenue(revenueData, daysAhead = 30) {
        const revenues = revenueData.map(d => d.revenue);
        const n = revenues.length;
        
        // Calculate linear regression
        let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
        
        for (let i = 0; i < n; i++) {
            sumX += i;
            sumY += revenues[i];
            sumXY += i * revenues[i];
            sumX2 += i * i;
        }
        
        const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
        const intercept = (sumY - slope * sumX) / n;
        
        // Predict future values
        const predictions = [];
        for (let i = n; i < n + daysAhead; i++) {
            predictions.push(Math.round(slope * i + intercept));
        }
        
        const predictedMonthly = predictions.reduce((sum, val) => sum + val, 0);
        
        // Calculate confidence based on R-squared
        const confidence = this.calculateConfidence(revenues, slope, intercept);
        
        return {
            monthly: predictedMonthly,
            daily: predictions,
            confidence: confidence.toFixed(1)
        };
    },
    
    // Calculate prediction confidence (R-squared)
    calculateConfidence(actualData, slope, intercept) {
        const mean = actualData.reduce((sum, val) => sum + val, 0) / actualData.length;
        let ssTotal = 0, ssResidual = 0;
        
        for (let i = 0; i < actualData.length; i++) {
            const predicted = slope * i + intercept;
            ssTotal += Math.pow(actualData[i] - mean, 2);
            ssResidual += Math.pow(actualData[i] - predicted, 2);
        }
        
        const rSquared = 1 - (ssResidual / ssTotal);
        return Math.max(0, Math.min(100, rSquared * 100));
    },
    
    // Calculate performance metrics
    calculatePerformance(revenueData, products) {
        const metrics = [];
        const stats = RevenueData.getStatistics();
        
        // Revenue per transaction
        const totalTransactions = revenueData.reduce((sum, day) => sum + day.transactions, 0);
        const revenuePerTransaction = (stats.monthlyRevenue / totalTransactions).toFixed(2);
        
        // Revenue per customer
        const totalCustomers = revenueData.reduce((sum, day) => sum + day.customers, 0);
        const revenuePerCustomer = (stats.monthlyRevenue / totalCustomers).toFixed(2);
        
        // Product diversity
        const productCount = products.length;
        const avgRevenuePerProduct = (products.reduce((sum, p) => sum + p.revenue, 0) / productCount).toFixed(0);
        
        metrics.push(`💵 Average Transaction Value: $${revenuePerTransaction}`);
        metrics.push(`👥 Revenue per Customer: $${revenuePerCustomer}`);
        metrics.push(`📦 Product Categories: ${productCount}`);
        metrics.push(`📊 Avg Revenue per Category: $${avgRevenuePerProduct}`);
        
        // Calculate efficiency score
        const efficiencyScore = Math.min(100, (parseFloat(revenuePerTransaction) / 50 * 100)).toFixed(0);
        metrics.push(`⚡ Efficiency Score: ${efficiencyScore}/100`);
        
        return metrics;
    }
};
