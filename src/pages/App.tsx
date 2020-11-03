import React, { Suspense, useState } from 'react'
import { HashRouter, Route, Switch } from 'react-router-dom'
import styled from 'styled-components'
import GoogleAnalyticsReporter from '../components/analytics/GoogleAnalyticsReporter'
import Header from '../components/Header'
import Popups from '../components/Popups'
import Web3ReactManager from '../components/Web3ReactManager'
import DarkModeQueryParamReader from '../theme/DarkModeQueryParamReader'
import {
  RedirectDuplicateTokenIds,
  RedirectOldAddLiquidityPathStructure,
} from './AddLiquidity/redirects'
import RemoveV1Exchange from './MigrateV1/RemoveV1Exchange'
import Pool from './Pool'
import PoolFinder from './PoolFinder'
import RemoveLiquidity from './RemoveLiquidity'
import { RedirectOldRemoveLiquidityPathStructure } from './RemoveLiquidity/redirects'
import Swap from './Swap'
import { RedirectToSwap, RedirectPathToSwapOnly } from './Swap/redirects'
import Celswap from '../assets/images/CelSwap-logo-2.svg'
import GuardedRoute from './GuardedRoute'
import { useActiveWeb3React } from '../hooks'
import { LPsByNetwork } from '../utils/index'


const AppWrapper = styled.div`
  display: flex;
  flex-flow: column;
  align-items: flex-start;
  overflow-x: hidden;
`

const HeaderWrapper = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  width: 100%;
  justify-content: space-between;
`

const BodyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 10;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
      padding: 16px;
  `};

  z-index: 1;
`

const Marginer = styled.div`
  margin-top: 5rem;
`

export default function App() {
  const { account, chainId } = useActiveWeb3React()

  const [registeredProvider, setRegisteredProvider] = useState(false)

  if (account && !registeredProvider) {
    const liquidityProvidersList = LPsByNetwork(chainId)
    liquidityProvidersList.includes(account) && setRegisteredProvider(true)
  }

  return (
    <Suspense fallback={null}>
      <HashRouter>
        <Route component={GoogleAnalyticsReporter} />
        <Route component={DarkModeQueryParamReader} />
        <div>
          <div style={{ padding: '100px 0 30px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 5 }}>
              <img src={Celswap} alt="logo"/>
            </div>
          </div>
        </div>
        <AppWrapper>
          <HeaderWrapper>
            <Header/>
          </HeaderWrapper>
          <BodyWrapper>
            <Popups/>
            <Web3ReactManager>
              <Switch>
                <Route exact strict path="/swap" component={Swap} />
                <Route exact strict path="/swap/:outputCurrency" component={RedirectToSwap} />
                {/*<Route exact strict path="/send" component={RedirectPathToSwapOnly}/>*/}
                <Route exact strict path="/find" component={PoolFinder} />
                <Route exact strict path="/pool" component={Pool} />
                {/*<Route exact strict path="/create" component={RedirectToAddLiquidity}/>*/}
                {/*<Route exact path="/add" component={AddLiquidity}/>*/}
                <GuardedRoute exact path="/add/:currencyIdA" component={RedirectOldAddLiquidityPathStructure} auth={registeredProvider}/>
                <GuardedRoute exact path="/add/:currencyIdA/:currencyIdB" component={RedirectDuplicateTokenIds} auth={registeredProvider}/>
                <Route exact strict path="/remove/v1/:address" component={RemoveV1Exchange} />
                <Route exact strict path="/remove/:tokens"
                              component={RedirectOldRemoveLiquidityPathStructure}/>
                <Route exact strict path="/remove/:currencyIdA/:currencyIdB" component={RemoveLiquidity} />
                {/*<Route exact strict path="/migrate/v1" component={MigrateV1}/>*/}
                {/*<Route exact strict path="/migrate/v1/:address" component={MigrateV1Exchange}/>*/}
                <Route component={RedirectPathToSwapOnly} />
              </Switch>
            </Web3ReactManager>
            <Marginer />
          </BodyWrapper>
        </AppWrapper>
      </HashRouter>
    </Suspense>
  )
}
