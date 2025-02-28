
const getSalesByYearAndMonth = (orderHistoryData) => {
    const salesByYear = {};
  
    orderHistoryData.forEach(customer => {
      customer.orders.forEach(order => {
        if (order.orderStatus === "delivered") {
          const date = new Date(order.orderDate);
          const year = date.getFullYear();
          const month = date.toLocaleString('default', { month: 'short' });
  
          if (!salesByYear[year]) {
            salesByYear[year] = {};
          }
          if (!salesByYear[year][month]) {
            salesByYear[year][month] = 0;
          }
  
          salesByYear[year][month] += order.totalAmount;
        }
      });
    });
  
    const salesTrend = Object.keys(salesByYear).map(year => {
      const monthsData = Object.keys(salesByYear[year]).map(month => ({
        month,
        sales: salesByYear[year][month],
      }));
  
      const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return {
        year,
        months: monthsData.sort((a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month)),
      };
    });
  
    return salesTrend;
  }

  export default getSalesByYearAndMonth;