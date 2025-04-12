import { useRef, useEffect, useCallback } from 'react'
import { Chart } from '@antv/g2'
import { format } from 'd3-format'
import { fixed } from '@/utils'

interface ChartBoxProps {
  data: StockMonthRevenueTypeWithMonthGrowth[]
  style?: React.CSSProperties
}

const ChartBox = ({ data, style }: ChartBoxProps) => {
  const chartBoxRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<Chart>(null)

  const initChart = useCallback(() => {
    if (!chartBoxRef.current) return
    chartRef.current = new Chart({
      container: chartBoxRef.current,
      autoFit: true,
    })
    chartRef.current.data(data)

    chartRef.current.options({
      title: {
        align: 'left',
        size: -10,
        title: '千元',
        titleFontSize: 12,
        titleFontWeight: 400,
        titleFill: '#000',
        titleFillOpacity: 0.75,
      },
      legend: {
        color: {
          position: 'bottom',
          size: 0,
          itemMarker: 'rect',
        },
      },
    })

    chartRef.current
      .interval()
      .encode('x', 'date')
      .encode('y', 'revenue')
      .encode('color', () => '每月營收')
      .scale('color', {
        domain: ['每月營收', '每月營收年增率'],
        range: ['rgb(232, 175, 0)', 'rgb(203, 75, 75)'],
      })
      .style('lineWidth', 1)
      .style('fill', 'rgba(232, 175, 0, 0.4)')
      .style('stroke', 'rgb(232, 175, 0)')
      .style('insetLeft', 2)
      .style('insetRight', 2)
      .axis('y', {
        position: 'left',
        title: false,
        grid: true,
        gridLineDash: [0, 0],
        gridStroke: '#000',
        gridStrokeOpacity: 0.3,
        labelFormatter: (val: number) => format(',d')(val / 1000),
      })
      .tooltip({
        channel: 'y',
        valueFormatter: (val: number) => format(',d')(val) + '元',
      })

    chartRef.current
      .line()
      .encode('x', 'date')
      .encode('y', 'month_growth')
      .encode('color', () => '每月營收年增率')
      .scale('color', {
        domain: ['每月營收', '每月營收年增率'],
        range: ['rgb(232, 175, 0)', 'rgb(203, 75, 75)'],
      })
      .encode('shape', 'smooth')
      .style('lineWidth', 2.5)
      .style('stroke', 'rgb(203, 75, 75)')
      .scale('y', { independent: true })
      .axis('y', {
        position: 'right',
        title: '%',
        titlePosition: 'top',
        titleSpacing: 5,
        grid: null,
        labelFormatter: (val: number) => val * 100,
      })
      .axis('x', {
        title: false,
        grid: true,
        gridLineDash: [0, 0],
        gridStroke: '#000',
        gridStrokeOpacity: 0.3,
        tickFilter: (datum: number, index: number) => data[index].date.endsWith('/01'),
        labelFormatter: (value: string) => value.slice(0, 4),
      })
      .tooltip({
        channel: 'y',
        valueFormatter: (val: number) => fixed(val * 100) + '%',
      })

    chartRef.current.render()
  }, [data])

  useEffect(() => {
    initChart()
    return () => {
      chartRef.current?.destroy()
    }
  }, [initChart])

  return (
    <div
      style={style}
      ref={chartBoxRef}
    ></div>
  )
}
export default ChartBox
