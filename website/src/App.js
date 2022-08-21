import './App.css';
import * as React from 'react';
import {Box, createTheme, ThemeProvider, useMediaQuery} from "@mui/material";
import CssBaseline from '@mui/material/CssBaseline';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import Home from "./pages/Home";
import Footer from "./components/Footer";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Legal from "./pages/Legal";
import Header from "./components/Header";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";


function App() {
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

    const theme = React.useMemo(
        () =>
            createTheme({
                palette: {
                    mode: prefersDarkMode ? 'dark' : 'light',
                },
            }),
        [prefersDarkMode],
    );

    return (
        <React.Fragment>
            <BrowserRouter>
                <ThemeProvider theme={theme}>
                    <CssBaseline/>
                    <Box sx={{
                        mx: {xs: 2, md: 4, lg: 8},
                        my: 4,
                    }}>
                        <Header></Header>
                        <Routes>
                            <Route path="/" element={<Home/>}/>
                            <Route path={"/mentions-legales"} element={<Legal/>}/>
                            <Route path={"/contact"} element={<Contact/>}/>
                            <Route path="*" element={<NotFound/>}/>
                        </Routes>
                        <Footer></Footer>
                    </Box>
                </ThemeProvider>
            </BrowserRouter>
        </React.Fragment>
    );
}

export default App;
