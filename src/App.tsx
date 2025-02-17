import React, { useState, useMemo, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  IconButton,
  Tooltip,
  Snackbar,
  Fade,
  Zoom,
  Fab,
  InputBase,
  styled,
  alpha,
  AppBar,
  Toolbar,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  Paper
} from '@mui/material';
import {
  Check,
  Brightness4,
  Brightness7,
  Search,
  ExpandLess,
  Menu as MenuIcon,
  ContentCopy
} from '@mui/icons-material';
import { ThemeProvider, createTheme, useTheme } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';

// Enhanced color data structure
interface ColorShade {
  name: string;
  hex: string;
  contrast: string;
  rgb: string;
}

const TAILWIND_COLORS: { [key: string]: string[] } = {
  slate: ["#f8fafc", "#f1f5f9", "#e2e8f0", "#cbd5e1", "#94a3b8", "#64748b", "#475569", "#334155", "#1e293b", "#0f172a", "#020617"],
  gray: ["#f9fafb", "#f3f4f6", "#e5e7eb", "#d1d5db", "#9ca3af", "#6b7280", "#4b5563", "#374151", "#1f2937", "#111827", "#030712"],
  zinc: ["#fafafa", "#f4f4f5", "#e4e4e7", "#d4d4d8", "#a1a1aa", "#71717a", "#52525b", "#3f3f46", "#27272a", "#18181b", "#09090b"],
  neutral: ["#fafafa", "#f5f5f5", "#e5e5e5", "#d4d4d4", "#a3a3a3", "#737373", "#525252", "#404040", "#262626", "#171717", "#0a0a0a"],
  stone: ["#fafaf9", "#f5f5f4", "#e7e5e4", "#d6d3d1", "#a8a29e", "#78716c", "#57534e", "#44403c", "#292524", "#1c1917", "#0c0a09"],
  red: ["#fef2f2", "#fee2e2", "#fecaca", "#fca5a5", "#f87171", "#ef4444", "#dc2626", "#b91c1c", "#991b1b", "#7f1d1d", "#450a0a"],
  orange: ["#fff7ed", "#ffedd5", "#fed7aa", "#fdba74", "#fb923c", "#f97316", "#ea580c", "#c2410c", "#9a3412", "#7c2d12", "#431407"],
  amber: ["#fffbeb", "#fef3c7", "#fde68a", "#fcd34d", "#fbbf24", "#f59e0b", "#d97706", "#b45309", "#92400e", "#78350f", "#451a03"],
  yellow: ["#fefce8", "#fef9c3", "#fef08a", "#fde047", "#facc15", "#eab308", "#ca8a04", "#a16207", "#854d0e", "#713f12", "#422006"],
  lime: ["#f7fee7", "#ecfccb", "#d9f99d", "#bef264", "#a3e635", "#84cc16", "#65a30d", "#4d7c0f", "#3f6212", "#365314", "#1a2e05"],
  green: ["#f0fdf4", "#dcfce7", "#bbf7d0", "#86efac", "#4ade80", "#22c55e", "#16a34a", "#15803d", "#166534", "#14532d", "#052e16"],
  emerald: ["#ecfdf5", "#d1fae5", "#a7f3d0", "#6ee7b7", "#34d399", "#10b981", "#059669", "#047857", "#065f46", "#064e3b", "#022c22"],
  teal: ["#f0fdfa", "#ccfbf1", "#99f6e4", "#5eead4", "#2dd4bf", "#14b8a6", "#0d9488", "#0f766e", "#115e59", "#134e4a", "#042f2e"],
  cyan: ["#ecfeff", "#cffafe", "#a5f3fc", "#67e8f9", "#22d3ee", "#06b6d4", "#0891b2", "#0e7490", "#155e75", "#164e63", "#083344"],
  sky: ["#f0f9ff", "#e0f2fe", "#bae6fd", "#7dd3fc", "#38bdf8", "#0ea5e9", "#0284c7", "#0369a1", "#075985", "#0c4a6e", "#082f49"],
  blue: ["#eff6ff", "#dbeafe", "#bfdbfe", "#93c5fd", "#60a5fa", "#3b82f6", "#2563eb", "#1d4ed8", "#1e40af", "#1e3a8a", "#172554"],
  indigo: ["#eef2ff", "#e0e7ff", "#c7d2fe", "#a5b4fc", "#818cf8", "#6366f1", "#4f46e5", "#4338ca", "#3730a3", "#312e81", "#1e1b4b"],
  violet: ["#f5f3ff", "#ede9fe", "#ddd6fe", "#c4b5fd", "#a78bfa", "#8b5cf6", "#7c3aed", "#6d28d9", "#5b21b6", "#4c1d95", "#2e1065"],
  purple: ["#faf5ff", "#f3e8ff", "#e9d5ff", "#d8b4fe", "#c084fc", "#a855f7", "#9333ea", "#7e22ce", "#6b21a8", "#581c87", "#3b0764"],
  fuchsia: ["#fdf4ff", "#fae8ff", "#f5d0fe", "#f0abfc", "#e879f9", "#d946ef", "#c026d3", "#a21caf", "#86198f", "#701a75", "#4a044e"],
  pink: ["#fdf2f8", "#fce7f3", "#fbcfe8", "#f9a8d4", "#f472b6", "#ec4899", "#db2777", "#be185d", "#9d174d", "#831843", "#500724"],
  rose: ["#fff1f2", "#ffe4e6", "#fecdd3", "#fda4af", "#fb7185", "#f43f5e", "#e11d48", "#be123c", "#9f1239", "#881337", "#4c0519"],
};

const SHADE_NUMBERS = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'];

// Enhanced theme configuration
const getDesignTokens = (mode: 'light' | 'dark') => ({
  palette: {
    mode,
    ...(mode === 'dark' ? {
      background: {
        default: '#111827',
        paper: '#1f2937'
      },
      primary: {
        main: '#60a5fa'
      }
    } : {
      background: {
        default: '#f9fafb',
        paper: '#ffffff'
      },
      primary: {
        main: '#3b82f6'
      }
    }),
  },
  shape: {
    borderRadius: 8
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 800,
      letterSpacing: '-0.025em'
    },
    h6: {
      fontWeight: 600
    }
  },
  components: {
    MuiAppBar: {
      defaultProps: {
        elevation: 0
      },
      styleOverrides: {
        root: {
          backgroundColor: 'transparent',
          backdropFilter: 'blur(8px)'
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none'
        }
      }
    }
  },
});

const SearchInput = styled(InputBase)(({ theme }) => ({
  width: '100%',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  padding: theme.spacing(1, 2),
  color: theme.palette.text.primary,
  transition: theme.transitions.create(['background-color', 'box-shadow']),
  boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
  '&:focus-within': {
    boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)'
  }
}));

const hexToRgb = (hex: string): string => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? `rgb(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)})` : '';
};

const getContrastColor = (hexColor: string): string => {
  const rgb = hexToRgb(hexColor);
  const [r, g, b] = rgb.match(/\d+/g)!.map(Number);
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  return (yiq >= 128) ? '#000000' : '#ffffff';
};

const TailwindColors: React.FC = () => {
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedColor, setCopiedColor] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const colorMode = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  const handleScroll = () => {
    setShowScrollTop(window.pageYOffset > 500);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const colorFamilies = useMemo(() =>
    Object.entries(TAILWIND_COLORS).map(([name, shades]) => {
      const processedShades = shades.map((hex, index) => {
        const rgb = hexToRgb(hex);
        return {
          name: SHADE_NUMBERS[index],
          hex,
          rgb,
          contrast: getContrastColor(hex)
        };
      });
      return {
        name,
        shades: processedShades,
        keywords: [name, ...processedShades.map(s => s.hex)]
      };
    }).filter(family =>
      family.keywords.some(k =>
        k.toLowerCase().includes(searchQuery.toLowerCase())
      )
    ), [searchQuery]);

  const handleCopyColor = (color: string) => {
    navigator.clipboard.writeText(color).then(() => {
      setCopiedColor(color);
      setTimeout(() => setCopiedColor(''), 2000);
    });
  };

  const ColorSwatch = ({ shade }: { shade: ColorShade }) => (
    <Tooltip title={`${shade.hex} - Click to copy`}>
      <Box
        onClick={() => handleCopyColor(shade.hex)}
        sx={{
          width: 60,
          height: 60,
          bgcolor: shade.hex,
          borderRadius: 1,
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden',
          transition: theme.transitions.create(['box-shadow', 'transform']),
          '&:hover': {
            boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
            transform: 'translateY(-2px)'
          }
        }}
      >
        {copiedColor === shade.hex && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'rgba(0, 0, 0, 0.3)',
            }}
          >
            <Check sx={{ color: '#ffffff', fontSize: 24 }} />
          </Box>
        )}
      </Box>
    </Tooltip>
  );

  return (
    <ThemeProvider theme={colorMode}>
      <Box sx={{
        bgcolor: 'background.default',
        minHeight: '100vh',
        transition: theme.transitions.create('background-color')
      }}>
        <AppBar position="sticky">
          <Toolbar>
            {isMobile && (
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={() => setDrawerOpen(true)}
              >
                <MenuIcon />
              </IconButton>
            )}
            {mode === 'dark' ? 
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Tailwind Colors
            </Typography>
            :
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: "GrayText" }}>
              Tailwind Colors
            </Typography>
            }
            <IconButton
              onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}
              color="inherit"
            >
              {mode === 'dark' ? <Brightness7 /> : <Brightness4 color='info' />}
            </IconButton>
          </Toolbar>
        </AppBar>

        <Container maxWidth="xl" sx={{ py: 6 }}>
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              <Typography
                variant="h1"
                component="h1"
                sx={{
                  fontWeight: 900,
                  letterSpacing: '-0.05em',
                  mb: 2,
                  background: 'linear-gradient(45deg, #3b82f6 0%, #ec4899 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                Tailwind Color Explorer
              </Typography>
              <Typography variant="h6" sx={{ mb: 4, color: 'text.secondary' }}>
                Discover and copy Tailwind CSS color palettes with ease
              </Typography>
            </motion.div>

            <Box sx={{ maxWidth: 600, mx: 'auto' }}>
              <SearchInput
                placeholder="Search colors..."
                startAdornment={<Search sx={{ mr: 1 }} />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                fullWidth
              />
            </Box>
          </Box>

          <AnimatePresence>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {colorFamilies.map((family) => (
                <motion.div
                  key={family.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  layout
                >
                  <Paper
                    elevation={2}
                    sx={{
                      borderRadius: 2,
                      overflow: 'hidden',
                      transition: theme.transitions.create(['box-shadow']),
                      '&:hover': {
                        boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                      }
                    }}
                  >
                    <Box sx={{
                      p: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      bgcolor: family.shades[5].hex,
                    }}>
                      <Typography
                        variant="h6"
                        sx={{
                          color: family.shades[5].contrast,
                          fontWeight: 700,
                          textTransform: 'capitalize',
                        }}
                      >
                        {family.name}
                      </Typography>
                      <IconButton
                        onClick={() => handleCopyColor(family.shades[5].hex)}
                        sx={{ color: family.shades[5].contrast }}
                      >
                        <ContentCopy fontSize="small" />
                      </IconButton>
                    </Box>
                    <Box sx={{ p: 2 }}>
                      <Box sx={{
                        display: 'flex',
                        gap: 2,
                        overflowX: 'auto',
                        pb: 1,
                      }}>
                        {family.shades.map((shade) => (
                          <Box key={shade.name} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                            <ColorSwatch shade={shade} />
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                              {shade.name}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  </Paper>
                </motion.div>
              ))}
            </Box>
          </AnimatePresence>
        </Container>

        <Zoom in={showScrollTop}>
          <Fab
            color="primary"
            sx={{ position: 'fixed', bottom: 32, right: 32 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <ExpandLess />
          </Fab>
        </Zoom>

        <Snackbar
          open={!!copiedColor}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          TransitionComponent={Fade}
          autoHideDuration={2000}
          onClose={() => setCopiedColor('')}
        >
          <Paper
            elevation={3}
            sx={{
              px: 3,
              py: 2,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 2
            }}
          >
            <Check color="success" />
            <Typography>Copied {copiedColor} to clipboard</Typography>
          </Paper>
        </Snackbar>

        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        >
          <List sx={{ width: 250 }}>
            <ListItem>
              <ListItemText primary="Tailwind Colors" primaryTypographyProps={{ variant: 'h6' }} />
            </ListItem>
            <Divider />
            {Object.keys(TAILWIND_COLORS).map((colorName) => (
              <ListItem
                key={colorName}
                component="button"
                onClick={() => {
                  setSearchQuery(colorName);
                  setDrawerOpen(false);
                }}
                sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 1, border: 'none', background: 'transparent' }}
              >
                <ListItemText primary={colorName} />
              </ListItem>
            ))}
          </List>
        </Drawer>
      </Box>
    </ThemeProvider>
  );
};

export default TailwindColors;