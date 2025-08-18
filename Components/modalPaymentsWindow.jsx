import React from 'react'
import { PaymentWindow } from './paymentWindow'

export const ModalPaymentsWindow = ({active, setActive, raport}) => {
  return (
    <div className={active ? "modal active" : "modal"} onClick={() => {setActive(false)}}>
      <div className={active ? "modalContent active" : "modalContent"}>
        <PaymentWindow />
      </div>
    </div>
  )
}
