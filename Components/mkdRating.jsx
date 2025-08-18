import React from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

import StarRateRoundedIcon from '@material-ui/icons/StarRateRounded';

const MkdRating = ({ dcHouse }) => {
  const mkd = dcHouse && JSON.parse(dcHouse)
  const fullRating = mkd?.house_feedback?.total_rating
  const rating = mkd?.house_feedback?.ratings
  const plus = mkd?.house_feedback?.top?.plus
  const minus = mkd?.house_feedback?.top?.minus
  const colorStarRating = (rating) => {
    if ( rating < 3 ) { return <StarRateRoundedIcon className="redStar" fontSize="large"/> }
    if ( rating >= 3 && rating < 4) { return <StarRateRoundedIcon className="yellowStar" fontSize="large"/> }
    if ( rating >= 4 ) { return <StarRateRoundedIcon className="greenStar" fontSize="large"/> }
  }

  const colorBg = (rating) => {
    if ( rating <= 1) { return '#ff0000'}
    if ( rating >1 && rating < 2 ) { return '#FD2A00'}
    if ( rating === 2 ) { return '#FC4500'}
    if ( rating > 2 && rating < 3) { return '#FB7100'}
    if ( rating === 3) { return '#f5ff00'}
    if ( rating > 3 && rating < 4) { return '#C3F626'}
    if ( rating === 4) { return '#AEFF54'}
    if ( rating > 4 && rating < 5) { return '#66FF47'}
    if ( rating >= 5) { return '#0CFF08'}
  }



  const labels = ['Чистота', 'Двор', 'Парковки', 'Транспорт', 'Магазины', 'Парки', 'Безопасность', 'Соседи', 'Школы и сады', 'Детские площадки', 'ЖКХ', 'Цены ЖКХ', 'Вода']
  const data = {
    labels: labels,
    datasets: [
      {
        data: rating.map((it) => it.value),
        backgroundColor: rating.map((it) => colorBg(it.value)),

      },
    ],
  };

  const options = {
    indexAxis: 'y',
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false
      }
    },
    maintainAspectRatio: false,

      scales: {
        y: {
            ticks: {
              beginAtZero: true,
            },
            grid: {
              drawBorder: false,
              display: false,
            },
          },

        x: {
            ticks: {
              display:false
            },
            grid: {
              display: false,
              drawBorder: false,
              // drawOnChartArea: false
            },
          },
      },
  };



  return (
    fullRating && fullRating !==0 ?
    (<div data-content="photo" id="mkdRating" className="object__block">
      <div className="object__block-wrap">
        <div className="object__block-title _rating">
          <h2>
            Рейтинг МКД - {fullRating}{colorStarRating(fullRating)}
            </h2>
          </div>
        <div className="ratingDescriptionContainer">
          <div className="ratingDescription">
            Общий рейтинг многоквартирного дома - это итоговая оценка, выданная сервисом, которая складывается из множества параметров.
          </div>
        </div>
        <div className="rating">
          <div className="allRaitngs">
            <div className="rateTable">
            <div className="object__block-title-2 products">Рейтинг по категориям</div>
              {rating && (rating.map((it, index) => {
                return (
                <div className="rateTableTr" key={index}>
                  <div className="rateTableTd">{colorStarRating(it.value)}{it.value}</div>
                  <div className="rateTableTd">{it.display_name}</div>
                </div>
                )
              }))}
            </div>
          </div>
          <div className="plusMinus">
            {plus.length > 0 && (
              <div className="ratingPlus">
                <div className="rateTable">
                <div className="object__block-title-2 products">Плюсы</div>
                {plus.map((it, index) => {
                    return (
                    <div className="rateTableTr" key={index}>
                      <div className="rateTableTd">{colorStarRating(it.value)}{it.value}</div>
                      <div className="rateTableTd">{it.display_name}</div>
                    </div>
                    )
                  })}
                </div>
              </div>
            )}
            {minus.length > 0 && (
              <div className="ratingMinus">
                <div className="rateTable">
                <div className="object__block-title-2 products">Минусы</div>
                {minus.map((it, index) => {
                    return (
                    <div className="rateTableTr" key={index}>
                      <div className="rateTableTd">{colorStarRating(it.value)}{it.value}</div>
                      <div className="rateTableTd">{it.display_name}</div>
                    </div>
                    )
                  })}
                </div>
              </div>
            )}
            <div className="chartContainer1">
              <Bar options={options} data={data} />
            </div>
          </div>
        </div>
      </div>
    </div>):('')
  )
}

export default MkdRating