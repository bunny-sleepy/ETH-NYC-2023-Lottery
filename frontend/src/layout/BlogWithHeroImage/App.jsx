import {
  Box,
  Container,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  SimpleGrid,
  Stack,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react';
import * as React from 'react';
import { FiSearch } from 'react-icons/fi';
import { BlogPost } from './BlogPost';
import { posts } from './data';

export const Main = () => (
  <Box bg="bg-surface">
    <Box bg="bg-accent" color="on-accent">
      <Container
        pt={{
          base: '16',
          md: '24',
        }}
        pb={{
          base: '32',
          md: '48',
        }}
      >
        <Stack
          spacing={{
            base: '8',
            md: '10',
          }}
          align="center"
        >
          <Stack
            spacing={{
              base: '4',
              md: '6',
            }}
            textAlign="center"
          >
            <Stack spacing="4">
              <Text
                fontWeight="semibold"
                color="blue.50"
                fontSize={{
                  base: 'sm',
                  md: 'md',
                }}
              >
                “FairDraw” - The Blockchain-powered Lottery Platform.
              </Text>
              <Heading
                size={useBreakpointValue({
                  base: 'md',
                  md: 'lg',
                })}
              >
                Discover your fair chance among countless draws.
              </Heading>
            </Stack>
            <Text
              fontSize={{
                base: 'lg',
                md: 'xl',
              }}
              maxW="5xl"
              color="on-accent-muted"
            >
              Cast aside doubts. Each draw is blockchain-verified, ensuring
              transparency and fairness. Giving every user an equal shot at
              their dream prize.
            </Text>
          </Stack>
          <InputGroup
            size="lg"
            maxW={{
              md: 'sm',
            }}
          >
            <InputLeftElement pointerEvents="none">
              <Icon as={FiSearch} color="on-accent" boxSize="5" />
            </InputLeftElement>
            <Input
              placeholder="Your fair play, your transparent stage."
              variant="filled"
              colorScheme="blue"
            />
          </InputGroup>
        </Stack>
      </Container>
    </Box>
    <Container
      pb={{
        base: '16',
        md: '24',
      }}
      mt={{
        base: '-16',
        md: '-24',
      }}
    >
      <Stack
        spacing={{
          base: '16',
          md: '24',
        }}
      >
        <Stack
          spacing={{
            base: '12',
            md: '16',
          }}
        >
          <BlogPost post={posts[0]} isHero />
          <SimpleGrid
            columns={{
              base: 1,
              md: 2,
              lg: 3,
            }}
            gap={{
              base: '12',
              lg: '8',
            }}
          >
            {posts.slice(1, 4).map(post => (
              <BlogPost key={post.id} post={post} />
            ))}
          </SimpleGrid>
        </Stack>
      </Stack>
    </Container>
  </Box>
);
