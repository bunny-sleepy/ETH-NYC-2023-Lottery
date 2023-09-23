import { InputGroup, Input, InputLeftElement, InputRightElement, Icon, Flex, Button } from "@chakra-ui/react"
import { FiSearch } from "react-icons/fi"

const SearchBar = () => {

  const handleSearch = () => {
    // Place your search logic here
    console.log("Search triggered")
  }

  return (
    <Flex justifyContent="center" alignItems="center">
      <InputGroup maxW="lg">
        <InputLeftElement pointerEvents="none">
          <Icon as={FiSearch} color="muted" boxSize="5" />
        </InputLeftElement>
        <Input placeholder="Search" />
        <InputRightElement>
          <Button onClick={handleSearch}>
            <FiSearch />
          </Button>
        </InputRightElement>
      </InputGroup>
    </Flex>
  )
}

export default SearchBar
