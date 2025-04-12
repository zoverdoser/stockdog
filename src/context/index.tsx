'use client'

import { createContext, useContext, useState } from 'react'

interface StockContextType {
  stocks: StockItemType[]
  currentStock: StockItemType | undefined
  setStocks: (stocks: StockItemType[]) => void
  setCurrentStock: (stock: StockItemType) => void
}

const StockContext = createContext<StockContextType>({
  stocks: [],
  currentStock: undefined,
  setStocks: () => {},
  setCurrentStock: () => {},
})

export const StockContextProvider = ({
  children,
  initValue,
}: {
  children: React.ReactNode
  initValue: {
    stocks: StockItemType[]
    currentStock: StockItemType | undefined
  }
}) => {
  const [stocks, setStocks] = useState<StockItemType[]>(initValue.stocks ?? [])
  const [currentStock, setCurrentStock] = useState<StockItemType | undefined>(initValue.currentStock)

  return (
    <StockContext.Provider value={{ stocks, setStocks, currentStock, setCurrentStock }}>
      {children}
    </StockContext.Provider>
  )
}

export const useStockContext = () => useContext(StockContext)
