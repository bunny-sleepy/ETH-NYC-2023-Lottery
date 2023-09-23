import React, { createContext, useState } from 'react'
import {
  ChakraProvider,
} from '@chakra-ui/react'
import { ColorModeSwitcher } from './ColorModeSwitcher'
import { Logo } from './Logo'
import { Nav } from './layout/NavbarWithAvatarOnAccent/App'
import { Main } from './layout/BlogWithHeroImage/App'
import '@fontsource/fira-code'

import { theme as proTheme } from '@chakra-ui/pro-theme'
import { extendTheme, theme as baseTheme } from '@chakra-ui/react'
export const theme = extendTheme(
  {
    colors: { ...baseTheme.colors, brand: baseTheme.colors.blue },
    fonts: {
      heading: "'Fira CodeVariable', -apple-system, system-ui, sans-serif",
      body: "'Fira CodeVariable', -apple-system, system-ui, sans-serif",
    },
  },
  proTheme,
)
export const UserContext = createContext()


function App () {
  return (
    <ChakraProvider theme={theme}>
      <Nav />
      <Main />
    </ChakraProvider>
  )
}

export default App
