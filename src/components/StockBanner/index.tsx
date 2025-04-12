'use client'

import { useState, useEffect } from 'react'
import { useStockContext } from '@/context'
import styles from './index.module.scss'

const Banner = ({ initData }: { initData?: StockItemType }) => {
  const [displayStock, setDisplayStock] = useState<StockItemType | undefined>(undefined)
  const { currentStock } = useStockContext()

  useEffect(() => {
    if (!currentStock && initData) {
      setDisplayStock(initData)
    } else if (currentStock) {
      setDisplayStock(currentStock)
    }
  }, [currentStock, initData, setDisplayStock])

  const displayData = displayStock || initData

  return (
    <div className={styles.bannerBox}>
      <h3>
        {displayData?.stock_name} ({displayData?.stock_id})
      </h3>
    </div>
  )
}

export default Banner
