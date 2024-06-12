import {AppBar, Box, createTheme, CssBaseline, ThemeProvider, Toolbar, Typography} from "@mui/material";

const theme = createTheme({
  typography: {
    fontFamily: [
      '"Inter"',
      '"Noto Sans SC Variable"',
      'sans-serif'
    ].join(','),
  },
  palette: {
    mode: 'light',
    background: {
      default: '#f9f9f9',
    },
    text: {
      primary: 'rgba(0,0,0,0.825)',
    },
  },
});

function App() {
  return <ThemeProvider theme={theme}><CssBaseline/>
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <Typography variant={"h6"} style={{userSelect: "none"}}>
          <b>饥渴 ID 平台</b>
        </Typography>
      </Toolbar>
    </AppBar>
    <Box display={"flex"} flexDirection={"column"} height={"100vh"}>
      <Toolbar/>
      <Box flexGrow={1}>

      </Box>
      <Box display={"flex"} flexDirection={"column"} alignItems={"center"} gap={1} justifyContent={"center"} paddingY={1}>
        <Typography variant={"caption"}>
          © {new Date().getFullYear()} 清华大学物理系学生科学与技术协会
        </Typography>
      </Box>
    </Box>
  </ThemeProvider>
}

export default App;
