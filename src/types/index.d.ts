type StockItemType = {
  stock_id: string
  stock_name: string
}

type StockMonthRevenueType = {
  stock_id: string
  date: string
  revenue_year: number
  revenue_month: number
  revenue: string
}

type StockMonthRevenueTypeWithMonthGrowth = StockMonthRevenueType & {
  month_growth: number
}
