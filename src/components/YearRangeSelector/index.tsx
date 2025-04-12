import { useState } from 'react'
import Select, { type SelectChangeEvent } from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import styles from './index.module.scss'

interface YearRangeSelectorProps {
  setStartYear: (year: number) => void
}

const YearRangeSelector = ({ setStartYear }: YearRangeSelectorProps) => {
  const currentYear = new Date().getFullYear()
  const [year, setYear] = useState(currentYear - 5)

  const handleChange = (event: SelectChangeEvent) => {
    setYear(Number(event.target.value))
  }

  const selectRange: number[] = []
  for (let i = 2000; i <= currentYear; i++) {
    selectRange.push(i)
  }

  return (
    <div className={styles.container}>
      <div className={styles.controlBox}>
        <span className={styles.label}>起始年度：</span>
        <Select
          value={String(year)}
          onChange={handleChange}
          size="small"
          sx={{
            backgroundColor: '#fff',
            '& .MuiSelect-select': {
              padding: '3px 8px',
            },
          }}
        >
          {selectRange.map(i => (
            <MenuItem
              key={i}
              value={i}
            >
              {i}
            </MenuItem>
          ))}
        </Select>
      </div>
      <div className={styles.actionBox}>
        <Button
          variant="contained"
          size="small"
          onClick={() => setStartYear(year)}
        >
          確 定
        </Button>
      </div>
    </div>
  )
}
export default YearRangeSelector
