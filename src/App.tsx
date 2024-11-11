// import { useState } from 'react';
import React, { useEffect, useState } from 'react';
import './App.css';
import PomodoroTimer from './PomodoroTimer';
// import TodoList from './TodoList';
import { ChakraProvider, Box, Heading, Center } from '@chakra-ui/react';
import { lightTheme, darkTheme, retroTheme } from './theme/theme';

function App() {
  // const [count, setCount] = useState(0);
  const [currentTheme, setCurrentTheme] = useState(lightTheme);

  useEffect(() => {
    if ('Notification' in window) {
      Notification.requestPermission();
    }
  }, []);

  return (
    <ChakraProvider theme={currentTheme}>
      <Box minHeight="100vh" bg="background" color="text" p={4}>
        <Center flexDirection="column">
          <Heading as="h1" mb="{4}" mt={4}>
            ポモドーロタイマー
          </Heading>
          {/* <TodoList /> */}
          {/* <User /> */}
          <PomodoroTimer setTheme={setCurrentTheme} />
        </Center>
      </Box>
    </ChakraProvider>
  );
}

export default App;
