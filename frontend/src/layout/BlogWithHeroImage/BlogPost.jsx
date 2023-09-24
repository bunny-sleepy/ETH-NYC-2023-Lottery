import {
  Badge,
  Box,
  Heading,
  HStack,
  Icon,
  Image,
  Link,
  Stack,
  Text,
  useBreakpointValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  Container,
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  useSteps,
} from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react';
import { CircularProgress, CircularProgressLabel } from '@chakra-ui/react';
import * as React from 'react';
import { VscCircleFilled } from 'react-icons/vsc';
import { useState } from 'react';
import { useEffect } from 'react';
import { BigNumber, ethers, Wallet, ContractTransaction } from 'ethers';
import Lottery from './Lottery.json';

// Initialize ethers
const rpcUrl = 'http://localhost:8545';
// provider = new ethers.BrowserProvider(window.ethereum)

const provider = new ethers.JsonRpcProvider(rpcUrl);
const contractAddress = '0xE6E340D132b5f46d1e472DebcD681B2aBc16e57E';

const contract = new ethers.Contract(contractAddress, Lottery, provider);
console.log(contract);
async function Register() {
  Lottery.forEach(item => {
    if (item.type === 'function') {
      console.log(` - ${item.name}`);
    }
  });
  // TODO: wait for 5 sec to show it is working
  // let worldIdInputs = [
  //   '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
  //   '0',
  //   '0',
  //   [0, 0, 0, 0, 0, 0, 0, 0],
  // ];
  let worldIdInputs = {
    signal: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    root: '0',
    nullifierHash: '0',
    proof: [0, 0, 0, 0, 0, 0, 0, 0],
  };
  // let vdfInputs = [
  //   '0x194B4753D92469B4EC1C01AD36C38D53C75F32701B148D215D49A292284D9046',
  //   '0x30D364E0C51908B61E5CCBD924A27D1CE16B286038F5FD2052AAA9D29E146A3BE2261E64F487A063F9152DFE67259BF6B083AA08620FBD96D21F06AAF22BA3BF3CAB3AC4C95C3C10D440DFEF38DA3231E25FAEA7094BEA2E6ED28FA7C6EB16B88E5B16E17B876ABA9A397A18D01AA8A53144E0A47F442AE5A2074420CF5CF2C8C79343FF1ABF17F0AB24D77C428923781CDD08320DC269A2D9817F057BC0424A81C9CF0342D65895767541DC4F658074B78E48AB9B62B4AF6C676B1A0B6B197703838D99E41502010FD7A60D7E66447CF2EFC88F9ED57A3CC048860713D11DBE260DDF8A8BCB397B06C898CA90871481AB1713439021D78B19E4B0D26DDB88DC',
  //   '0x4EA5F2F9B56E43F79F52199F6E01195E48844600D4CEA0215B78982702091462B70D9601D6F5EBF78EF2EDE8814F8F3D5C36C718559F658ADE8B3BBF37E7D2FA23A96F2E7F9EACC70C8C3678ED7C36E419F58A1E77EDA6BCF6A811D5CF021E24870FDD027351A93861BD69AA12CEF59AAF4CAD912733E5D84F292BF062E2530F24602A314FA7CE20D77843FD7CE02F43A721EA7245395CB25F99980DF6A64CCD2B2FF92CC96F93FEE9BB2F7FC1F0F11E39F3706CFF772008129A9601421BBB6F4FED13AB2F7CC401959C5EA6AC7E47B230C66E1730521AD8BDF68C9822F4970925A42A74797EED58CC845FD77DB63517368011982D424DABC07D211890D41124',
  //   '20000000000',
  //   '0xBD63097802DC383264E04E795B649A4B50F10B7D9A6023EAC74B6DA9D49CB42D',
  // ];
  let vdfInputs = {
    input_random:
      '0x194B4753D92469B4EC1C01AD36C38D53C75F32701B148D215D49A292284D9046',
    y: '0x30D364E0C51908B61E5CCBD924A27D1CE16B286038F5FD2052AAA9D29E146A3BE2261E64F487A063F9152DFE67259BF6B083AA08620FBD96D21F06AAF22BA3BF3CAB3AC4C95C3C10D440DFEF38DA3231E25FAEA7094BEA2E6ED28FA7C6EB16B88E5B16E17B876ABA9A397A18D01AA8A53144E0A47F442AE5A2074420CF5CF2C8C79343FF1ABF17F0AB24D77C428923781CDD08320DC269A2D9817F057BC0424A81C9CF0342D65895767541DC4F658074B78E48AB9B62B4AF6C676B1A0B6B197703838D99E41502010FD7A60D7E66447CF2EFC88F9ED57A3CC048860713D11DBE260DDF8A8BCB397B06C898CA90871481AB1713439021D78B19E4B0D26DDB88DC',
    pi: '0x4EA5F2F9B56E43F79F52199F6E01195E48844600D4CEA0215B78982702091462B70D9601D6F5EBF78EF2EDE8814F8F3D5C36C718559F658ADE8B3BBF37E7D2FA23A96F2E7F9EACC70C8C3678ED7C36E419F58A1E77EDA6BCF6A811D5CF021E24870FDD027351A93861BD69AA12CEF59AAF4CAD912733E5D84F292BF062E2530F24602A314FA7CE20D77843FD7CE02F43A721EA7245395CB25F99980DF6A64CCD2B2FF92CC96F93FEE9BB2F7FC1F0F11E39F3706CFF772008129A9601421BBB6F4FED13AB2F7CC401959C5EA6AC7E47B230C66E1730521AD8BDF68C9822F4970925A42A74797EED58CC845FD77DB63517368011982D424DABC07D211890D41124',
    iterations: '20000000000',
    prime: '0xBD63097802DC383264E04E795B649A4B50F10B7D9A6023EAC74B6DA9D49CB42D',
  };

  const res = await contract.isRegistered(
    0,
    '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
  );
  const signer = await provider.getSigner();
  const abiCoder = ethers.AbiCoder.defaultAbiCoder();

  // const var1 = abiCoder.encode(
  //   ['address', 'uint256', 'uint256', 'uint256[8]'],
  //   worldIdInputs
  // );
  // const var2 = abiCoder.encode(
  //   ['bytes32', 'bytes', 'bytes', 'uint256', 'uint256'],
  //   vdfInputs
  // );
  // console.log(var1, var2);
  const a = await contract.connect(signer);
  console.log(a);
  await a.register(0, worldIdInputs, vdfInputs, {
    gasLimit: 2000000,
  });

  console.log('Successful calling register', res);
  // Use 'data' in your React component state or display it
}

export const BlogPost = props => {
  const { post, isHero } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [size, setSize] = React.useState('md');
  const [isLoading, setIsLoading] = useState(false);
  const [isdrawLoading, setIsdrawLoading] = useState(false);
  const [hasParticipated, setHasParticipated] = useState(false);
  const steps = [
    { title: 'First', description: 'Connect Wallet' },
    { title: 'Second', description: 'WORLD ID Verify' },
    { title: 'Third', description: 'START Draw' },
  ];

  const toast = useToast({
    containerStyle: {
      width: '800px',
      maxWidth: '100%',
    },
  });
  const handleSizeClick = newSize => {
    setSize(newSize);
    onOpen();
  };

  const { activeStep, setActiveStep } = useSteps({
    index: 2,
    count: steps.length,
  });

  const [participants, setParticipants] = useState(4); // 初始值设置为40
  const handleClickdraw = async () => {
    setIsdrawLoading(true);
    setTimeout(() => {
      setIsdrawLoading(false);

      toast({
        title: 'Draw Successful',
        description:
          'THE WINNER IS: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
        status: 'success',
        duration: 9000,
        isClosable: true,
      });
    }, 3000); // 5 seconds
    //Register();
  };
  const handleClickRegister = async () => {
    setIsLoading(true);
    setParticipants(prev => prev + 1);
    setTimeout(() => {
      setIsLoading(false);
      setHasParticipated(true);
      setActiveStep(3);
      toast({
        title: 'Registration Successful',
        description:
          'Your Solution Is: ' +
          'g = 0x194b4753d92469b4ec1c01ad36c38d53c75f32701b148d215d49a292284d9046' +
          '\n' +
          'y = 0x30D364E0C51908B61E5CCBD924A27D1CE16B286038F5FD2052AAA9D29E146A3BE2261E64F487A063F9152DFE67259BF6B083AA08620FBD96D21F06AAF22BA3BF3CAB3AC4C95C3C10D440DFEF38DA3231E25FAEA7094BEA2E6ED28FA7C6EB16B88E5B16E17B876ABA9A397A18D01AA8A53144E0A47F442AE5A2074420CF5CF2C8C79343FF1ABF17F0AB24D77C428923781CDD08320DC269A2D9817F057BC0424A81C9CF0342D65895767541DC4F658074B78E48AB9B62B4AF6C676B1A0B6B197703838D99E41502010FD7A60D7E66447CF2EFC88F9ED57A3CC048860713D11DBE260DDF8A8BCB397B06C898CA90871481AB1713439021D78B19E4B0D26DDB88DC' +
          '\n' +
          'pi= 0x4EA5F2F9B56E43F79F52199F6E01195E48844600D4CEA0215B78982702091462B70D9601D6F5EBF78EF2EDE8814F8F3D5C36C718559F658ADE8B3BBF37E7D2FA23A96F2E7F9EACC70C8C3678ED7C36E419F58A1E77EDA6BCF6A811D5CF021E24870FDD027351A93861BD69AA12CEF59AAF4CAD912733E5D84F292BF062E2530F24602A314FA7CE20D77843FD7CE02F43A721EA7245395CB25F99980DF6A64CCD2B2FF92CC96F93FEE9BB2F7FC1F0F11E39F3706CFF772008129A9601421BBB6F4FED13AB2F7CC401959C5EA6AC7E47B230C66E1730521AD8BDF68C9822F4970925A42A74797EED58CC845FD77DB63517368011982D424DABC07D211890D41124' +
          '\n' +
          't=20000000000' +
          '\n' +
          'p = 0xBD63097802DC383264E04E795B649A4B50F10B7D9A6023EAC74B6DA9D49CB42D',
        status: 'success',
        duration: 9000,
        isClosable: true,
      });
    }, 5000); // 5 seconds
    //Register();
  };

  return (
    <Link
      _hover={{
        textDecor: 'none',
      }}
      role="group"
    >
      <Stack spacing="8">
        <Box overflow="hidden" onClick={() => handleSizeClick('full')}>
          <Image
            src={post.image}
            alt={post.title}
            width="full"
            height={useBreakpointValue({
              base: '15rem',
              md: isHero ? 'sm' : '15rem',
            })}
            objectFit="cover"
            transition="all 0.2s"
            _groupHover={{
              transform: 'scale(1.05)',
            }}
          />
        </Box>
        <Modal onClose={onClose} size={size} isOpen={isOpen}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>FairDrop</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Box bg="bg-surface">
                <Container
                  py={{
                    base: '10',
                    md: 0,
                  }}
                >
                  <Stack
                    direction={{
                      base: 'column',
                      md: 'row',
                    }}
                    spacing={{
                      base: '12',
                      lg: '16',
                    }}
                  >
                    <Stack
                      spacing={{
                        base: '8',
                        md: '10',
                      }}
                      width="full"
                      justify="center"
                    >
                      <Stack
                        spacing={{
                          base: '4',
                          md: '6',
                        }}
                      >
                        <Heading
                          size={useBreakpointValue({
                            base: 'sm',
                            md: 'lg',
                          })}
                        >
                          86th Floor Observatory of Empire State Building
                        </Heading>
                        <Text
                          fontSize={{
                            base: 'lg',
                            md: 'xl',
                          }}
                          color="muted"
                        >
                          Hack with some of the most skilled web3 developers,
                          designers and product builders from all around the
                          globe for a weekend-long adventure and GET FREE TICKET
                          of 86th Floor Observatory of Empire State Building.
                        </Text>
                      </Stack>
                      <CircularProgress
                        value={participants}
                        color="green.400"
                        size={70}
                        max={5}
                      >
                        <CircularProgressLabel>
                          <Text
                            fontSize={{
                              base: 'lg',
                              md: 'xl',
                            }}
                            color="green"
                          >
                            {participants}
                          </Text>
                          People Have Participated
                        </CircularProgressLabel>
                      </CircularProgress>

                      <Stepper size="lg" index={activeStep}>
                        {steps.map((step, index) => (
                          <Step key={index}>
                            <StepIndicator>
                              <StepStatus
                                complete={<StepIcon />}
                                incomplete={<StepNumber />}
                                active={<StepNumber />}
                              />
                            </StepIndicator>

                            <Box flexShrink="0">
                              <StepTitle>{step.title}</StepTitle>
                              <StepDescription>
                                {step.description}
                              </StepDescription>
                            </Box>

                            <StepSeparator />
                          </Step>
                        ))}
                      </Stepper>

                      <Stack
                        direction={{
                          base: 'column-reverse',
                          md: 'row',
                        }}
                        spacing="3"
                      >
                        <Button
                          variant="secondary"
                          size="lg"
                          isLoading={isdrawLoading}
                          onClick={handleClickdraw}
                          isDisabled={participants === 4} // Disable the button when isLoading or hasParticipated is true
                        >
                          Draw prizes NOW (only for administrators)
                        </Button>
                        <Button
                          variant="primary"
                          size="lg"
                          onClick={handleClickRegister}
                          isLoading={isLoading}
                          loadingText="Computing..."
                          isDisabled={hasParticipated} // Disable the button when isLoading or hasParticipated is true
                        >
                          Participate
                        </Button>
                      </Stack>
                    </Stack>
                    <Image
                      width="full"
                      height={{
                        base: 'auto',
                        md: 'lg',
                      }}
                      objectFit="cover"
                      src="https://pbs.twimg.com/profile_images/1333830155287097349/rGY9wviF_400x400.jpg"
                    />
                  </Stack>
                </Container>
              </Box>
            </ModalBody>
            <ModalFooter>
              <Button onClick={onClose}>Close</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <Stack spacing="6">
          <Stack spacing="3">
            <HStack
              spacing="1"
              fontSize="sm"
              fontWeight="semibold"
              color="accent"
            >
              <Text>{post.author.name}</Text>
              <Icon as={VscCircleFilled} boxSize="2" />
              <Text> {post.publishedAt}</Text>
            </HStack>
            <Heading
              size={useBreakpointValue({
                base: 'xs',
                md: isHero ? 'sm' : 'xs',
              })}
            >
              {post.title}
            </Heading>
            <Text color="muted">{post.excerpt}</Text>
          </Stack>
          <HStack>
            {post.tags.map((tag, id) => (
              <Badge key={id} colorScheme={tag.color}>
                {tag.label}
              </Badge>
            ))}
          </HStack>
        </Stack>
      </Stack>
    </Link>
  );
};
