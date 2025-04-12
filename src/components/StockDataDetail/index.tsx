'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import PrimaryBox from '@/components/PrimaryBox'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import YearRangeSelector from '@/components/YearRangeSelector'
import StockChart from '@/components/StockChart'
import StockDataTable from '@/components/StockDataTable'
import { useStockContext } from '@/context'
import styles from './index.module.scss'

async function fetchStockData({
  stockId,
  startYear,
}: {
  stockId: string
  startYear: string
}): Promise<StockMonthRevenueType[]> {
  const params = new URLSearchParams({
    dataset: 'TaiwanStockMonthRevenue',
    stock_id: stockId,
    date: startYear,
  })
  try {
    const response = await fetch('/api/v3/data?' + params)
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    const resData = await response.json()
    if (resData.msg === 'success') {
      return resData.data
    }
  } catch (error) {
    console.error('Error fetching stocks:', error)
  }
  return []
}

const StockDataDetail = () => {
  const { currentStock } = useStockContext()
  const rangeBtnRef = useRef(null)
  const [rangeSelectDisplay, setRangeSelectDisplay] = useState(false)
  const [rangePopupDisplay, setRangePopupDisplay] = useState(false)
  const [yearRange, setYearRange] = useState(5)
  const [startYear, setStartYear] = useState<number>()
  const [monthRevenueData, setMonthRevenueData] = useState<StockMonthRevenueTypeWithMonthGrowth[]>([])

  const handleCustomizeStartYear = (startYear: number) => {
    setStartYear(startYear)
    setYearRange(0)
    setRangePopupDisplay(false)
    setRangeSelectDisplay(false)
  }

  const fetchStock = useCallback(async (stockId: string, startYear: number) => {
    const data = await fetchStockData({ stockId, startYear: `${startYear - 2}-12-31` })
    const monthRevenueDataWithMonthGrowth = []
    let startIndex: number = 0
    for (let i = data.length - 1; i >= 0; i--) {
      const currentData = data[i]
      if (currentData.revenue_year === startYear && currentData.revenue_month === 1) {
        startIndex = i
      }
      if (i - 12 < 0) {
        monthRevenueDataWithMonthGrowth.unshift({
          ...currentData,
          date: `${currentData.revenue_year}/${currentData.revenue_month.toString().padStart(2, '0')}`,
          month_growth: 0,
        })
      } else {
        const previousData = data[i - 12]
        const month_growth =
          Math.round(
            Number(BigInt(`${currentData.revenue}00000`) / BigInt(previousData.revenue) - BigInt(100000))
          ) / 100000
        monthRevenueDataWithMonthGrowth.unshift({
          ...currentData,
          date: `${currentData.revenue_year}/${currentData.revenue_month.toString().padStart(2, '0')}`,
          month_growth: Number(month_growth),
        })
      }
    }
    setMonthRevenueData(monthRevenueDataWithMonthGrowth.slice(startIndex))
  }, [])

  useEffect(() => {
    setYearRange(5)
    setStartYear(undefined)
  }, [currentStock?.stock_id])

  useEffect(() => {
    if (!currentStock?.stock_id) return
    if (yearRange === 0 && startYear) {
      fetchStock(currentStock?.stock_id, startYear!)
    } else if (yearRange !== 0) {
      const currentYear = new Date().getFullYear()
      fetchStock(currentStock?.stock_id, currentYear - yearRange)
    }
  }, [startYear, yearRange, fetchStock, currentStock?.stock_id])

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <div className={styles.boxTitle}>
          <PrimaryBox>每月營收</PrimaryBox>
          <div className={styles.extra}>
            {!rangePopupDisplay && (
              <PrimaryBox
                suffixIcon={<ExpandMoreIcon />}
                onClick={() => setRangeSelectDisplay(!rangeSelectDisplay)}
                ref={rangeBtnRef}
                style={{ cursor: 'pointer' }}
              >
                {yearRange === 0 ? '自 訂' : `近 ${yearRange} 年`}
              </PrimaryBox>
            )}
            <Menu
              open={rangeSelectDisplay}
              anchorEl={rangeBtnRef.current}
              onClose={() => setRangeSelectDisplay(false)}
            >
              {[3, 5, 8, 0].map(range => (
                <MenuItem
                  key={range}
                  onClick={() => {
                    setYearRange(range)
                    setRangeSelectDisplay(false)
                    if (range === 0) {
                      setRangePopupDisplay(true)
                    }
                  }}
                >
                  {range === 0 ? '自 訂' : `近 ${range} 年`}
                </MenuItem>
              ))}
            </Menu>
            {rangePopupDisplay && <YearRangeSelector setStartYear={handleCustomizeStartYear} />}
          </div>
        </div>
        <div className={styles.boxContent}>
          <StockChart
            style={{
              width: '100%',
              height: '350px',
            }}
            data={monthRevenueData}
          />
        </div>
      </div>
      <div className={styles.box}>
        <div className={styles.boxTitle}>
          <PrimaryBox>詳細數據</PrimaryBox>
        </div>
        <div className={styles.boxContent}>
          <StockDataTable data={monthRevenueData} />
        </div>
      </div>
    </div>
  )
}

export default StockDataDetail
