import {
  Box,
  Button,
  ButtonGroup,
  Container,
  Flex,
  HStack,
  IconButton,
  useBreakpointValue,
  button,
} from '@chakra-ui/react';
import { Web3Button } from '@web3modal/react';
import * as React from 'react';
import { useState } from 'react';
import { FiHelpCircle, FiMenu, FiSettings } from 'react-icons/fi';
import { Logo } from './Logo';
import { ColorModeSwitcher } from '../../ColorModeSwitcher';
import { IDKitWidget, CredentialType } from '@worldcoin/idkit';
// import { UserContext } from '../../App';
// import ConnectWallet from '../../components/ConnectWallet/connectWallet';

export const Nav = () => {
  // const [user, setUser] = useState(null);
  const isDesktop = useBreakpointValue({
    base: false,
    lg: true,
  });
  const handleProof = result => {
    return new Promise(resolve => {
      setTimeout(() => resolve(), 3000);
      // NOTE: Example of how to decline the verification request and show an error message to the user
    });
  };

  const onSuccess = result => {
    console.log(result);
  };

  const urlParams = new URLSearchParams(window.location.search);
  const credential_types = urlParams.get('credential_types')
    ? urlParams.get('credential_types').split(',')
    : [CredentialType.Orb, CredentialType.Phone];

  const action = urlParams.get('action') || 'register';
  const app_id =
    urlParams.get('app_id') || 'app_staging_2e79568227debfad7ee2c133640cdf75';
  return (
    <Box as="section">
      <Box as="nav" bg="bg-accent" color="on-accent">
        <Container
          py={{
            base: '3',
            lg: '4',
          }}
        >
          <Flex justify="space-between">
            <HStack spacing="4">
              <Logo />
              {isDesktop && (
                <ButtonGroup variant="ghost-on-accent" spacing="1">
                  <Button aria-current="page" fontSize="1.25rem">
                    FairDrop
                  </Button>
                </ButtonGroup>
              )}
            </HStack>
            {isDesktop ? (
              <HStack spacing="4">
                <ButtonGroup variant="ghost-on-accent" spacing="1">
                  <Web3Button />
                  <IDKitWidget
                    action={action}
                    signal="my_signal"
                    onSuccess={onSuccess}
                    handleVerify={handleProof}
                    app_id={app_id}
                    credential_types={credential_types}
                    walletConnectProjectId="3d2b7c418720bc2030074f63fe134ff5"
                  >
                    {({ open }) => (
                      <Button onClick={open} colorScheme="gray">
                        VERIFY YOUR WORLD ID
                      </Button>
                    )}
                  </IDKitWidget>
                  {/* <IconButton
                    icon={<FiSettings fontSize="1.25rem" />}
                    aria-label="Settings"
                  />
                  <IconButton
                    icon={<FiHelpCircle fontSize="1.25rem" />}
                    aria-label="Help Center"
                  /> */}
                  <ColorModeSwitcher />
                </ButtonGroup>
              </HStack>
            ) : (
              <IconButton
                variant="ghost-on-accent"
                icon={<FiMenu fontSize="1.25rem" />}
                aria-label="Open Menu"
              />
            )}
          </Flex>
        </Container>
      </Box>
    </Box>
  );
};
