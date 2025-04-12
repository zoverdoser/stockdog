import { cache } from 'react'
import { FINMIND_API_HOST } from '@/const'
import SearchBar from '@/components/SearchBar'
import StockBanner from '@/components/StockBanner'
import StockDataDetail from '@/components/StockDataDetail'
import { StockContextProvider } from '@/context'
import styles from './page.module.scss'

const fetchStocks: () => Promise<StockItemType[]> = cache(async () => {
  try {
    const response = await fetch(
      `${FINMIND_API_HOST}/api/v4/data?` + new URLSearchParams({ dataset: 'TaiwanStockInfo' })
    )
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    const resData = await response.json()
    if (resData.msg === 'success') {
      const stocksData: StockItemType[] = []
      resData.data.forEach((stock: StockItemType) => {
        if (stocksData.find(item => item.stock_id === stock.stock_id)) {
          return
        }
        stocksData.push({
          ...stock,
        } as StockItemType)
      })
      return stocksData
    }
  } catch (error) {
    console.error('Error fetching stocks:', error)
  }
  return []
})

export async function generateMetadata({ params }: { params: Promise<{ stockId: string }> }) {
  const currentStockId = (await params).stockId
  const stocksData: StockItemType[] = await fetchStocks()
  const currentStockData = stocksData.find(stock => stock.stock_id === currentStockId)

  return currentStockData
    ? {
        title: `${currentStockData.stock_name} (${currentStockData.stock_id}) - Stock Info`,
        description: `Detailed stock information for ${currentStockData.stock_name} (${currentStockData.stock_id})`,
      }
    : {
        title: 'Stock Page',
        description: 'Detailed stock page',
      }
}

export default async function Page({ params }: { params: Promise<{ stockId: string }> }) {
  const currentStockId = (await params).stockId
  const stocksData: StockItemType[] = await fetchStocks()
  const currentStockData = stocksData.find(stock => stock.stock_id === currentStockId)

  return (
    <div className={styles.page}>
      <StockContextProvider initValue={{ stocks: stocksData, currentStock: currentStockData }}>
        <SearchBar />
        <main className={styles.main}>
          <StockBanner initData={currentStockData} />
          <StockDataDetail />
        </main>
      </StockContextProvider>
      <footer className={styles.footer}></footer>
    </div>
  )
}
