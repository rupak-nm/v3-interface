import { Trans } from '@lingui/macro'
import { useWeb3React } from '@web3-react/core'
import { useAccountDrawer } from 'components/AccountDrawer/MiniPortfolio/hooks'
import { UniIcon } from 'components/Logo/UniIcon'
import Web3Status from 'components/Web3Status'
import { useInfoExplorePageEnabled } from 'featureFlags/flags/infoExplore'
import { useNewLandingPage } from 'featureFlags/flags/landingPageV2'
import { chainIdToBackendName } from 'graphql/data/util'
import { useDisableNFTRoutes } from 'hooks/useDisableNFTRoutes'
import { useIsLandingPage } from 'hooks/useIsLandingPage'
import { useIsNftPage } from 'hooks/useIsNftPage'
import { useIsPoolsPage } from 'hooks/useIsPoolsPage'
import { Box } from 'nft/components/Box'
import { Row } from 'nft/components/Flex'
import { useProfilePageState } from 'nft/hooks'
import { ProfilePageStateType } from 'nft/types'
import React, { ReactNode, useCallback } from 'react'
import { NavLink, NavLinkProps, useLocation, useNavigate } from 'react-router-dom'
import styled from 'styled-components'

import { useIsNavSearchInputVisible } from '../../nft/hooks/useIsNavSearchInputVisible'
import { Bag } from './Bag'
import Blur from './Blur'
import { ChainSelector } from './ChainSelector'
import * as styles from './style.css'
import ExploreDropdown from './ExploreDropdown'

const Nav = styled.nav`
  padding: ${({ theme }) => `${theme.navVerticalPad}px 12px`};
  width: 100%;
  height: ${({ theme }) => theme.navHeight}px;
  z-index: 2;
`

interface MenuItemProps {
  href: string
  id?: NavLinkProps['id']
  isActive?: boolean
  children: ReactNode
  dataTestId?: string
  target?: string
  rel?: string
}

const MenuItem = ({ href, dataTestId, id, isActive, children, target, rel }: MenuItemProps) => {
  return (
    <NavLink
      to={href}
      className={isActive ? styles.activeMenuItem : styles.menuItem}
      id={id}
      style={{ textDecoration: 'none' }}
      data-testid={dataTestId}
      target={target}
      rel={rel}
    >
      {children}
    </NavLink>
  )
}

export const PageTabs = () => {
  const { pathname } = useLocation()
  const { chainId: connectedChainId } = useWeb3React()
  const chainName = chainIdToBackendName(connectedChainId)

  const isPoolActive = useIsPoolsPage()
  const isNftPage = useIsNftPage()

  const shouldDisableNFTRoutes = useDisableNFTRoutes()
  const infoExplorePageEnabled = useInfoExplorePageEnabled()
  const isNewLandingPageEnabled = useNewLandingPage()

  return (
    <>
      <MenuItem href="/swap" isActive={pathname.startsWith('/swap')}>
        <Trans>Swap</Trans>
      </MenuItem>
      {/* {infoExplorePageEnabled ? (
        <MenuItem href="/explore" isActive={pathname.startsWith('/explore')}>
          <Trans>Explore</Trans>
        </MenuItem>
      ) : (
        <MenuItem href={`/tokens/${chainName.toLowerCase()}`} isActive={pathname.startsWith('/tokens')}>
          <Trans>Tokens</Trans>
        </MenuItem>
      )} */}
      {/* {!shouldDisableNFTRoutes && (
        <MenuItem dataTestId="nft-nav" href="/nfts" isActive={isNftPage}>
          <Trans>NFTs</Trans>
        </MenuItem>
      )} */}
      <Box display={{ sm: 'flex', lg: 'none', xxl: 'flex' }} width="full">
        <MenuItem href="/pools" dataTestId="pool-nav-link" isActive={isPoolActive}>
          <Trans>Pools</Trans>
        </MenuItem>
      </Box>
      
      <Box display={{ sm: 'flex', lg: 'none', xxl: 'flex' }} width="full">
        <MenuItem href="https://v3-info.stationdex.com/#/xlayer-mainnet" target='_blank' rel='noreferrer noopener'>
          <Trans>Info</Trans>
        </MenuItem>
      </Box>
      
      {/* {isNewLandingPageEnabled ? (
        <More />
      ) : (
        <Box marginY="4">
          <MenuDropdown />
        </Box>
      )} */}
    </>
  )
}

const Navbar = ({ blur }: { blur: boolean }) => {
  const isNftPage = useIsNftPage()
  const isLandingPage = useIsLandingPage()
  const isNewLandingPageEnabled = useNewLandingPage()
  const sellPageState = useProfilePageState((state) => state.state)
  const navigate = useNavigate()
  const isNavSearchInputVisible = useIsNavSearchInputVisible()

  const [accountDrawerOpen, toggleAccountDrawer] = useAccountDrawer()

  const handleUniIconClick = useCallback(() => {
    if (accountDrawerOpen) {
      toggleAccountDrawer()
    }
    navigate({
      pathname: '/',
      search: '?intro=true',
    })
  }, [accountDrawerOpen, navigate, toggleAccountDrawer])

  return (
    <>
      {blur && <Blur />}
      <Nav>
        <Box display="flex" height="full" flexWrap="nowrap">
          <Box className={styles.leftSideContainer}>
            <Box className={styles.logoContainer}>
              <NavLink to="/">
                <UniIcon
                  data-testid="uniswap-logo"
                  className={styles.logo}
                  onClick={handleUniIconClick}
                />
              </NavLink>
            </Box>
            {!isNftPage && (
              <Box display={{ sm: 'flex', lg: 'none' }}>
                <ChainSelector leftAlign={true} />
              </Box>
            )}
            <Row display={{ sm: 'none', lg: 'flex' }}>
              <PageTabs />
            </Row>
          </Box>
          <Box
            className={styles.searchContainer}
            {...(isNavSearchInputVisible && {
              display: 'flex',
            })}
          >
            {/* <SearchBar /> */}
          </Box>
          <Box className={styles.rightSideContainer}>
            <Row gap="12">
              <Box position="relative" display={isNavSearchInputVisible ? 'none' : { sm: 'flex' }}>
                {/* <SearchBar /> */}
              </Box>
              {isNftPage && sellPageState !== ProfilePageStateType.LISTING && <Bag />}
              {!isNftPage && (
                <Box display={{ sm: 'none', lg: 'flex' }}>
                  <ChainSelector />
                </Box>
              )}
              {/* {isLandingPage && isNewLandingPageEnabled && <GetTheAppButton />} */}
              <Web3Status />
            </Row>
          </Box>
        </Box>
      </Nav>
    </>
  )
}

export default Navbar
