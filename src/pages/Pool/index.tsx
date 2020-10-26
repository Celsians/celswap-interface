import React, { useContext, useMemo } from 'react'
import { ThemeContext } from 'styled-components'
import { Pair } from '@uniswap/sdk'
import { Link, RouteComponentProps } from 'react-router-dom'
import { SwapPoolTabs } from '../../components/NavigationTabs'

import Question from '../../components/QuestionHelper'
import FullPositionCard from '../../components/PositionCard'
import { useTokenBalancesWithLoadingIndicator } from '../../state/wallet/hooks'
import { TYPE, StyledInternalLink } from '../../theme'
import { Text } from 'rebass'
import { LightCard } from '../../components/Card'
import { RowBetween } from '../../components/Row'
import { ButtonPrimary } from '../../components/Button'
import { AutoColumn } from '../../components/Column'

import { useActiveWeb3React } from '../../hooks'
import { usePairs } from '../../data/Reserves'
import { toV2LiquidityToken, useTrackedTokenPairs } from '../../state/user/hooks'
import AppBody from '../AppBody'
import { Dots } from '../../components/swap/styleds'
import * as typeformEmbed from '@typeform/embed'
import { LPsByNetwork } from '../../utils/index'

// eslint-disable-next-line react/prop-types
export default function Pool({ history }: RouteComponentProps) {
  const theme = useContext(ThemeContext)
  const { account, chainId } = useActiveWeb3React()

  // fetch the user's balances of all tracked V2 LP tokens
  const trackedTokenPairs = useTrackedTokenPairs()
  const tokenPairsWithLiquidityTokens = useMemo(
    () => trackedTokenPairs.map(tokens => ({ liquidityToken: toV2LiquidityToken(tokens), tokens })),
    [trackedTokenPairs]
  )
  const liquidityTokens = useMemo(() => tokenPairsWithLiquidityTokens.map(tpwlt => tpwlt.liquidityToken), [
    tokenPairsWithLiquidityTokens
  ])
  const [v2PairsBalances, fetchingV2PairBalances] = useTokenBalancesWithLoadingIndicator(
    account ?? undefined,
    liquidityTokens
  )

  // fetch the reserves for all V2 pools in which the user has a balance
  const liquidityTokensWithBalances = useMemo(
    () =>
      tokenPairsWithLiquidityTokens.filter(({ liquidityToken }) =>
        v2PairsBalances[liquidityToken.address]?.greaterThan('0')
      ),
    [tokenPairsWithLiquidityTokens, v2PairsBalances]
  )

  const v2Pairs = usePairs(liquidityTokensWithBalances.map(({ tokens }) => tokens))
  const v2IsLoading =
    fetchingV2PairBalances || v2Pairs?.length < liquidityTokensWithBalances.length || v2Pairs?.some(V2Pair => !V2Pair)

  const allV2PairsWithLiquidity = v2Pairs.map(([, pair]) => pair).filter((v2Pair): v2Pair is Pair => Boolean(v2Pair))

  const reference = typeformEmbed.makePopup(
    'https://ivorjugo9.typeform.com/to/jCM4rajT', // NOTE: Replace with your typeform URL
    {
      mode: 'popup',
      autoClose: 3000,
      hideHeaders: true,
      hideFooter: true,
      // eslint-disable-next-line react/display-name
      onSubmit: function() {
        history.push(`/swap`)
      },
      // eslint-disable-next-line react/display-name
      onClose: function() {
        history.push(`/swap`)
      }
    }
  )

  const openTypeFrom = () => {
    reference.open()
  }

  const liquidityProvidersList = LPsByNetwork(chainId)

  return (
    <>
      <AppBody>
        <SwapPoolTabs active={'pool'} />
        {account && liquidityProvidersList.includes(account) ?
          <AutoColumn gap="lg" justify="center">
            <ButtonPrimary id="join-pool-button" as={Link} style={{ padding: 16 }} to="/add/CEL">
              <Text fontWeight={500} fontSize={20}>
                Add Liquidity
              </Text>
            </ButtonPrimary>

            <AutoColumn gap="12px" style={{ width: '100%' }}>
              <RowBetween padding={'0 8px'}>
                <Text color={theme.text1} fontWeight={500}>
                  Your Liquidity
                </Text>
                <Question
                  text="When you add liquidity, you are given pool tokens that represent your share. If you don’t see a pool you joined in this list, try importing a pool below."/>
              </RowBetween>

              {!account ? (
                <LightCard padding="40px">
                  <TYPE.body color={theme.text3} textAlign="center">
                    Connect to a wallet to view your liquidity.
                  </TYPE.body>
                </LightCard>
              ) : v2IsLoading ? (
                <LightCard padding="40px">
                  <TYPE.body color={theme.text3} textAlign="center">
                    <Dots>Loading</Dots>
                  </TYPE.body>
                </LightCard>
              ) : allV2PairsWithLiquidity?.length > 0 ? (
                <>
                  {allV2PairsWithLiquidity.map(v2Pair => (
                    <FullPositionCard key={v2Pair.liquidityToken.address} pair={v2Pair}/>
                  ))}
                </>
              ) : (
                <LightCard padding="40px">
                  <TYPE.body color={theme.text3} textAlign="center">
                    No liquidity found.
                  </TYPE.body>
                </LightCard>
              )}

              <div>
                <Text textAlign="center" fontSize={14} style={{ padding: '.5rem 0 .5rem 0' }}>
                  Don&#39;t see a pool you joined?{' '}
                  <StyledInternalLink id="import-pool-link" to={'/find'}>
                    Import it.
                  </StyledInternalLink>
                </Text>
              </div>
            </AutoColumn>
          </AutoColumn>
          :
          <AutoColumn gap="lg" justify="center">
            <ButtonPrimary id="join-pool-button" onClick={openTypeFrom} style={{ padding: 16 }} >
              <Text fontWeight={500} fontSize={20}>
                Become Liquidity Provider
              </Text>
            </ButtonPrimary>
          </AutoColumn>
        }
      </AppBody>
    </>
  )
}
