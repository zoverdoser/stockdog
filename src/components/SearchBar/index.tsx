'use client'

import { useEffect, useState } from 'react'
import SearchIcon from '@mui/icons-material/Search'
import { Autocomplete, TextField } from '@mui/material'
import InputAdornment from '@mui/material/InputAdornment'
import { useStockContext } from '@/context'
import parse from 'autosuggest-highlight/parse'
import match from 'autosuggest-highlight/match'
import { debounce } from '@/utils'

type OptionType = { label: string; id: string }

const omitFn = <T extends object>(obj: T, key: keyof T) => {
  const { [key]: _, ...rest } = obj
  return rest
}

const SearchBar = () => {
  const { stocks, setCurrentStock } = useStockContext()
  const [showOptions, setShowOptions] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [autoCompleteValue, setAutoCompleteValue] = useState<OptionType>({ label: '', id: '' })
  const [options, setOptions] = useState<OptionType[]>([])

  const handleSearch = debounce((value: string) => {
    setSearchValue(value)
  }, 300)

  useEffect(() => {
    if (stocks.length > 0 && searchValue.trim().length) {
      const options = stocks
        .filter(stock => {
          return stock.stock_id.startsWith(searchValue) || stock.stock_name.startsWith(searchValue)
        })
        .map(stock => ({
          label: `${stock.stock_id} ${stock.stock_name}`,
          id: stock.stock_id,
        }))
      setOptions(options)
    }
  }, [stocks, searchValue])

  return (
    <div
      style={{
        position: 'sticky',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '57px',
        backgroundColor: '#FFFFFF',
        boxShadow: '0px 0px 1px #DFDFDF',
      }}
    >
      <Autocomplete
        disablePortal
        options={options}
        forcePopupIcon={false}
        disableClearable={true}
        open={showOptions && options.length > 0}
        value={autoCompleteValue}
        renderOption={(props, option, { inputValue }) => {
          const { key, ...optionProps } = props
          const matches = match(option.label, inputValue, { insideWords: true })
          const parts = parse(option.label, matches)

          return (
            <li
              key={key}
              {...optionProps}
            >
              <div>
                {parts.map((part, index) => (
                  <span
                    key={index}
                    style={{
                      fontWeight: part.highlight ? 700 : 400,
                      color: part.highlight ? 'var(--primary)' : '#434343',
                    }}
                  >
                    {part.text}
                  </span>
                ))}
              </div>
            </li>
          )
        }}
        onChange={(event, newValue) => {
          if (newValue) {
            setSearchValue('')
            setAutoCompleteValue({ label: '', id: '' })
            setCurrentStock(stocks.find(stock => stock.stock_id === newValue.id)!)
            window.history.pushState(null, '', `/stock/${newValue.id}`)
          }
        }}
        renderInput={params => (
          <TextField
            {...params}
            value={searchValue}
            onChange={e => handleSearch(e.target.value)}
            placeholder="輸入台／美股代號，查看公司價值"
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment
                    position="end"
                    sx={{ cursor: 'pointer' }}
                  >
                    <SearchIcon />
                  </InputAdornment>
                ),
                ...omitFn(params.InputProps, 'endAdornment'),
              },
            }}
            sx={{
              width: 400,
              '& .MuiInputBase-root': {
                height: '37px',
                '& fieldset': {
                  border: '1px solid #DFDFDF',
                  borderRadius: '3px',
                },
                '& input::placeholder': {
                  color: '#434343',
                  opacity: 1,
                },
              },
            }}
            onFocus={() => setShowOptions(true)}
            onBlur={() => setShowOptions(false)}
          />
        )}
      />
    </div>
  )
}

export default SearchBar
