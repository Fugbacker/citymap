import React from 'react'
import { Global } from './global'
import { Owners } from './owners'
import { Cost } from './cost'
import { Complex } from './complex'
import { NoOwners } from './noOwners'
import { ReestrOfFlats } from './reestrOfFlats'
import { OwnersWithPersonalData } from './ownersWithPersonalData'
import { GlobalWithOwner } from './globalWithOwner'
import { Express } from './express'
import { CostWarning } from './costWarning'
import { Egrul } from './egrul'
import  { Shema } from './shema'
import { LandRaport } from './landRaport'

export const ModalWindow = ({active, setActive, raport}) => {

  return (
    <div className={active ? "modal active" : "modal"} onClick={() => {setActive(false)}}>
      <div className={active ? "modalContent active" : "modalContent"}>
        {raport === 'general' ? <Global/> : (
          raport === 'owners' ? <Owners/> : (
            raport === 'cost' ? <Cost/> : (
              raport === 'noOwners' ? <NoOwners/> : (
                raport === 'reestrOfFlats' ? <ReestrOfFlats/> : (
                  raport === 'ownersWithPersonalData' ?  <OwnersWithPersonalData /> : (
                    raport === 'express' ?  <Express /> : (
                      raport === 'generalWithOwner' ? <GlobalWithOwner /> : (
                          raport === 'costWarning' ? <CostWarning /> : (
                            raport === 'egrul' ? <Egrul /> : (
                              raport === 'shemaReport' ? <Shema /> : (
                                raport === 'landRaport' ? <LandRaport /> : <Complex />
                              )
                            )
                          )
                        )
                    )
                  )
                )
              )
            )
          )
        )}
      </div>
    </div>
  )
}
