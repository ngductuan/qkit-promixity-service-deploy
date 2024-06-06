/* eslint-disable */
'use client'
import { subFrontFamily } from '@/configs/themes/light'
import { IBusinessUserStatisticQuery } from '@/types/query'
import { IBusinessUserStatistic, IBusinessUserStatisticItem } from '@/types/statistic'
import $ from 'jquery'
import React, { useEffect, useMemo, useState } from 'react'
import './chart.scss'
import { STATISTIC_OPTIONS_VALUE } from '@/constants/statistic'

declare const CanvasJS: any

interface SplineChartProps {
  dataProps: IBusinessUserStatistic
  queryData: IBusinessUserStatisticQuery
}

const convertDateSpline = (query: IBusinessUserStatisticQuery, itemData: IBusinessUserStatisticItem): Date => {
  if(query.timeline === STATISTIC_OPTIONS_VALUE._MONTH){
    return new Date(query.year, query.month, itemData.time_index)
    }else if(query.timeline === STATISTIC_OPTIONS_VALUE._YEAR){
    return new Date(query.year,itemData.time_index - 1, 1)
  }
  return new Date(2024,1,1)
}

const generateChartFormat = (statisticData: IBusinessUserStatistic, query: IBusinessUserStatisticQuery) => ({
  theme: 'light2',
  exportEnabled: true,
  animationEnabled: true,
  title: {
    text: 'Users & Businesses',
    fontFamily: subFrontFamily,
    fontSize: 32,
    fontWeight: 600
  },
  subtitles: [
    {
      text: 'Users/businesses in each month/year',
    }
  ],
  axisX: {
    title: 'States'
  },
  axisY: {
    title: 'User',
    titleFontColor: '#4F81BC',
    lineColor: '#4F81BC',
    labelFontColor: '#4F81BC',
    tickColor: '#4F81BC'
  },
  axisY2: {
    title: 'Business',
    titleFontColor: '#C0504E',
    lineColor: '#C0504E',
    labelFontColor: '#C0504E',
    tickColor: '#C0504E'
  },
  toolTip: {
    shared: true
  },
  data: [
    {
      type: 'spline',
      name: 'Users',
      showInLegend: true,
      xValueFormatString: 'DD MMM YYYY',
      yValueFormatString: '#,##0 units',
      dataPoints: statisticData.data.map(item => {
        return ({
          // query.timeline === 'year' ? item.time_index : query.year
          // x: new Date(query.year, item.time_index - 1, 1),
          x: convertDateSpline(query, item),
          y: item.total_user
        })
      })
    },
    {
      type: 'spline',
      name: 'Businesses',
      axisYType: 'secondary',
      showInLegend: true,
      xValueFormatString: 'DD MMM YYYY',
      yValueFormatString: '#,##0 units',
      dataPoints: statisticData.data.map(item => ({
        // x: new Date(query.year, item.time_index - 1, 1),
        x: convertDateSpline(query, item),
        y: item.total_business
      }))
    }
  ]
})

const SplineChart: React.FC<SplineChartProps> = ({dataProps, queryData}) => {
  const chartFormat = useMemo(() =>{
    return dataProps ? generateChartFormat(dataProps, queryData) : null
  }, [dataProps])

  useEffect(() => {
    $(() => {
      const _splineChart = new CanvasJS.Chart('dashboard-spline-chart', chartFormat)
      _splineChart.render()
    })
  }, [chartFormat])

  return <div id='dashboard-spline-chart' className='chart' style={{ height: '400px', width: '100%' }}></div>
}

export default SplineChart
