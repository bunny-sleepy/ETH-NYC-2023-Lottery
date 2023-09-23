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
} from '@chakra-ui/react';
import { CircularProgress, CircularProgressLabel } from '@chakra-ui/react';
import * as React from 'react';
import { VscCircleFilled } from 'react-icons/vsc';
import { useState } from 'react';
import { useEffect } from 'react';
import Web3 from 'web3';

// Initialize Web3
const web3 = new Web3("http://localhost:8545"); // Use your own RPC URL or MetaMask provider

const contractAddress = '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9'; // Replace with your contract's address
const contractABI = [
  {
    "inputs": [
      {
        "internalType": "contract IMockToken",
        "name": "token",
        "type": "address"
      },
      {
        "internalType": "contract IRandomnessOracle",
        "name": "oracle",
        "type": "address"
      },
      {
        "internalType": "contract IVDFVerifier",
        "name": "vdfVerifier",
        "type": "address"
      },
      {
        "internalType": "contract IWorldID",
        "name": "worldId",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "appId",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "actionId",
        "type": "string"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "InvalidNullifier",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "poolId",
        "type": "uint256"
      }
    ],
    "name": "draw",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "maxUserNumber",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "tokenAmount",
        "type": "uint256"
      }
    ],
    "name": "open",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "poolId",
        "type": "uint256"
      },
      {
        "components": [
          {
            "internalType": "address",
            "name": "signal",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "root",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "nullifierHash",
            "type": "uint256"
          },
          {
            "internalType": "uint256[8]",
            "name": "proof",
            "type": "uint256[8]"
          }
        ],
        "internalType": "struct ILottery.WorldIDInputs",
        "name": "worldIdInputs",
        "type": "tuple"
      },
      {
        "components": [
          {
            "internalType": "bytes32",
            "name": "input_random",
            "type": "bytes32"
          },
          {
            "internalType": "bytes",
            "name": "y",
            "type": "bytes"
          },
          {
            "internalType": "bytes",
            "name": "pi",
            "type": "bytes"
          },
          {
            "internalType": "uint256",
            "name": "iterations",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "prime",
            "type": "uint256"
          }
        ],
        "internalType": "struct ILottery.VDFInputs",
        "name": "vdfInputs",
        "type": "tuple"
      }
    ],
    "name": "register",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];
const contract = new web3.eth.Contract(contractABI, contractAddress);
async function ContractRegister() {
  try {
    // TODO: wait for 5 sec to show it is working
    let worldIdInputs = [deployer.address, 0, 0, [0, 0, 0, 0, 0, 0, 0, 0]];
    let vdfInputs = [
      // input random / g
      '0x194B4753D92469B4EC1C01AD36C38D53C75F32701B148D215D49A292284D9046',
      // y
      '0x30D364E0C51908B61E5CCBD924A27D1CE16B286038F5FD2052AAA9D29E146A3BE2261E64F487A063F9152DFE67259BF6B083AA08620FBD96D21F06AAF22BA3BF3CAB3AC4C95C3C10D440DFEF38DA3231E25FAEA7094BEA2E6ED28FA7C6EB16B88E5B16E17B876ABA9A397A18D01AA8A53144E0A47F442AE5A2074420CF5CF2C8C79343FF1ABF17F0AB24D77C428923781CDD08320DC269A2D9817F057BC0424A81C9CF0342D65895767541DC4F658074B78E48AB9B62B4AF6C676B1A0B6B197703838D99E41502010FD7A60D7E66447CF2EFC88F9ED57A3CC048860713D11DBE260DDF8A8BCB397B06C898CA90871481AB1713439021D78B19E4B0D26DDB88DC',
      // pi
      '0x4EA5F2F9B56E43F79F52199F6E01195E48844600D4CEA0215B78982702091462B70D9601D6F5EBF78EF2EDE8814F8F3D5C36C718559F658ADE8B3BBF37E7D2FA23A96F2E7F9EACC70C8C3678ED7C36E419F58A1E77EDA6BCF6A811D5CF021E24870FDD027351A93861BD69AA12CEF59AAF4CAD912733E5D84F292BF062E2530F24602A314FA7CE20D77843FD7CE02F43A721EA7245395CB25F99980DF6A64CCD2B2FF92CC96F93FEE9BB2F7FC1F0F11E39F3706CFF772008129A9601421BBB6F4FED13AB2F7CC401959C5EA6AC7E47B230C66E1730521AD8BDF68C9822F4970925A42A74797EED58CC845FD77DB63517368011982D424DABC07D211890D41124',
      // iterations / t
      20000000000,
      // prime / l
      '0xBD63097802DC383264E04E795B649A4B50F10B7D9A6023EAC74B6DA9D49CB42D'
    ];
    const data = await contract.methods.register(worldIdInputs, vdfInputs).call();
    // Use 'data' in your React component state or display it
  } catch (error) {
    console.error("Error fetching data from contract:", error);
  }
}

export const BlogPost = props => {
  const { post, isHero } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [size, setSize] = React.useState('md');
  const [isLoading, setIsLoading] = useState(false);
  const [hasParticipated, setHasParticipated] = useState(false);

  const handleSizeClick = newSize => {
    setSize(newSize);
    onOpen();
  };
  const [participants, setParticipants] = useState(40); // 初始值设置为40

  const handleClickRegister = () => {
    setIsLoading(true);
    setParticipants(prev => prev + 1);
    setTimeout(() => {
      setIsLoading(false);
      setHasParticipated(true);
    }, 5000); // 5 seconds
    ContractRegister();
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
            <ModalHeader>Lottery Page</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Box bg="bg-surface">
                <Container
                  py={{
                    base: '10',
                    md: '0',
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
                          抽奖活动标题
                        </Heading>
                        <Text
                          fontSize={{
                            base: 'lg',
                            md: 'xl',
                          }}
                          color="muted"
                        >
                          抽奖活动介绍：In this drawing, one person will receive
                          a cash prize of US$300. Total number of participants
                          50.
                        </Text>
                      </Stack>
                      <CircularProgress
                        value={participants}
                        color="green.400"
                        size={70}
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
                      <Stack
                        direction={{
                          base: 'column-reverse',
                          md: 'row',
                        }}
                        spacing="3"
                      >
                        <Button variant="secondary" size="lg">
                          立即开奖（）
                        </Button>
                        <Button
                          variant="primary"
                          size="lg"
                          onClick={() => {
                            if (!hasParticipated) handleClickRegister();
                          }}
                          isLoading={isLoading}
                          disabled={isLoading || hasParticipated} // Disable the button when isLoading or hasParticipated is true
                        >
                          {isLoading ? (
                            <>
                              <CircularProgress
                                isIndeterminate
                                color="green.300"
                                size="24px"
                                trackColor="transparent" // This ensures that the text inside is visible
                              />
                            </>
                          ) : hasParticipated ? (
                            '已参与抽奖'
                          ) : (
                            '立即参与抽奖'
                          )}
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
                      src="https://images.unsplash.com/photo-1600188769045-bc6026bfc8cd?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
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
