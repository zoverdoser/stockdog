import { useRef, useEffect } from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { fixed } from '@/utils'
import styles from './index.module.scss'

interface StockDataTableProps {
  data: StockMonthRevenueTypeWithMonthGrowth[]
}

const StockDataTable = ({ data }: StockDataTableProps) => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    containerRef.current?.scrollTo({
      left: Number.MAX_SAFE_INTEGER,
    })
  }, [data])

  return (
    <>
      <TableContainer ref={containerRef}>
        <Table
          aria-label="table"
          sx={{
            wordBreak: 'none',
            whiteSpace: 'nowrap',
            borderCollapse: 'collapse',
            position: 'relative',
            borderTop: '1px solid #e3e3e3',
            borderBottom: '1px solid #e3e3e3',
            '& .MuiTableCell-head': {
              borderTop: '1px solid #e3e3e3',
              borderRight: '1px solid #e3e3e3',
              borderBottom: '1px solid #e3e3e3',
            },
            '& .MuiTableCell-body': {
              borderTop: '1px solid #e3e3e3',
              borderRight: '1px solid #e3e3e3',
              borderBottom: '1px solid #e3e3e3',
            },
            '& .MuiTableHead-root .MuiTableCell-head': {
              backgroundColor: '#f6f8fa',
            },
            '& .MuiTableBody-root .MuiTableRow-root:nth-child(2n+1) .MuiTableCell-body': {
              backgroundColor: '#fff',
            },
            '& .MuiTableBody-root .MuiTableRow-root:nth-child(2n) .MuiTableCell-body': {
              backgroundColor: '#f6f8fa',
            },
            '& .stickyCell': {
              position: 'sticky',
              left: 0,
              zIndex: 10,
              fontWeight: 'bold',
              border: 'none',
            },
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell
                align="left"
                className={'stickyCell'}
              >
                <div className={styles.stickyCellContent}>年度/月份</div>
              </TableCell>
              {data.map(row => (
                <TableCell
                  key={row.date}
                  align="right"
                >
                  {row.date}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell
                align="left"
                className={'stickyCell'}
              >
                <div className={styles.stickyCellContent}>每月營收</div>
              </TableCell>
              {data.map(row => (
                <TableCell
                  key={row.date}
                  align="right"
                >
                  {(BigInt(row.revenue) / BigInt(1000)).toLocaleString()}
                </TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell
                align="left"
                className={'stickyCell'}
              >
                <div className={styles.stickyCellContent}>單月營收年增率 (%)</div>
              </TableCell>
              {data.map(row => (
                <TableCell
                  key={row.date}
                  align="right"
                >
                  {fixed(row.month_growth * 100)}
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <div className={styles.tip}>
        表格單位：千元，數據來自公開資訊觀測站 <br /> 網頁圖表歡迎轉貼引用，請註明出處為財報狗{' '}
      </div>
    </>
  )
}

export default StockDataTable
