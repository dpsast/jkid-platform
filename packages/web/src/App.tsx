import { AppBar, Box, CssBaseline, createTheme, ThemeProvider, Toolbar, Typography } from '@mui/material';
import { Outlet } from 'react-router';

const theme = createTheme({
  typography: {
    fontFamily: ['"Inter"', '"Noto Sans SC Variable"', 'sans-serif'].join(','),
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
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant={'h6'} style={{ userSelect: 'none' }}>
            <b>饥渴 ID 平台</b>
          </Typography>
        </Toolbar>
      </AppBar>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Toolbar />
        <Box id="detail" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexGrow: 1 }}>
          <Box
            sx={{
              height: '100%',
              width: '50%',
              minWidth: '300px',
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <Outlet />
          </Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1,
            justifyContent: 'center',
            paddingY: 1,
          }}
        >
          <Typography variant="caption">© {new Date().getFullYear()} 清华大学物理系学生科学与技术协会</Typography>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
