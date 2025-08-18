import React from 'react'
import { Link } from 'react-scroll'
import { useRouter } from 'next/router'

export const PaymentWindow = () => {
  const router = useRouter()
  return (
    <div className='tooltipText'>
      <div className="table">
        <div className="table-row">
          <div className="table-cell hundred">
            <h3>Ваша заявка принята</h3>
            <hr/>
          </div>
        </div>
      </div>
      <div className="table">
        <div className="table-row">
          <div className="table-cell">
            <p>Уважаемый клиент. Заявка принята. В течении нескольких минут на ваш почтовый ящик придет письмо с дальнейшими инструкциями. Проверьте входящую почту, включая папку «Спам»</p>
          </div>

        </div>
        <div className="sumButton1"
          onClick={() => router.push('/')}
        >Вернутья к поиску</div>
      </div>
    </div>
  )
}
