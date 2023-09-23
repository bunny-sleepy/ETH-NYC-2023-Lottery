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

  const handleClick = () => {
    setIsLoading(true);
    setParticipants(prev => prev + 1);
    setTimeout(() => {
      setIsLoading(false);
      setHasParticipated(true);
    }, 5000); // 5 seconds
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
                            if (!hasParticipated) handleClick();
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
