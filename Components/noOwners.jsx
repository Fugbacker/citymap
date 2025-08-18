import React from 'react'

export const NoOwners = () => {
  return (
    <div className='tooltipText'>
      <div className="table">
        <div className="table-row">
          <div className="table-cell hundred">
            <h3>Уведомление об отсутствии прав</h3>
            <hr/>
          </div>
        </div>
      </div>
      <div className="table">
        <div className="table-row">
          <div className="table-cell">
            <p>В случае, если в отсутствуют запрашиваемые сведения, выдается Уведомление об отсутствии запрашиваемых сведений. Уведомление необходимо для предоставления по месту требования отчета о переходе прав на объект недвижимости. </p>
          </div>
        </div>
      </div>
    </div>
  )
}
