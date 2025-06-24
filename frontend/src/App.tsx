import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import {
  CssBaseline,
  Box,
  Toolbar,
  Typography,
  IconButton,
  ThemeProvider,
  createTheme,
  AppBar,
  Button,
  Container,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Sidebar from "./Components/Sidebar";
import StudentDataGrid from "./Components/StudentDataGrid";
import AddStudentForm from "./Components/AddStudentForm";
import Settings from "./Components/Settings";
import ExcelImport from "./Components/ExcelImport";
import { getStudents, createStudent } from "./Services/StudentService";
import { Students } from "./Models/Students";
import { SettingsProvider, useSettings } from "./Contexts/SettingsContext";

// Sidebar width constant
const drawerWidth = 240;

/**
 * Main application content component
 * Contains student data management, theme switching, sidebar functionality
 */
const AppContent: React.FC = () => {
  // Student data state management
  const [students, setStudents] = useState<Students[]>([]);
  // Loading state
  const [loading, setLoading] = useState<boolean>(true);
  // Error state
  const [error, setError] = useState<string | null>(null);
  // Add student form open/close state
  const [isFormOpen, setIsFormOpen] = useState(false);

  /**
   * Fetch student list data
   * Retrieves all student information from backend API
   */
  const fetchStudents = async () => {
    try {
      const students = await getStudents();
      setStudents(students);
    } catch (err) {
      setError("Failed to fetch students, check if server is running.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch student data when component mounts
  useEffect(() => {
    fetchStudents();
  }, []);

  /**
   * Handle adding new student
   * @param student Student information (without ID)
   */
  const handleAddStudent = async (student: Omit<Students, "id">) => {
    try {
      const newStudent = await createStudent(student);
      setStudents((prev) => [...prev, newStudent]);
      setIsFormOpen(false);
    } catch (err) {
      setError("Failed to add student");
    }
  };

  /**
   * Handle data loaded from Excel import
   * @param data Imported student data
   */
  const handleDataLoaded = (data: Students[]) => {
    setStudents(data);
  };

  // Get state from settings context
  const { isDrawerOpen, toggleDrawer, isDarkTheme } = useSettings();

  // Create Material-UI theme based on theme settings
  const theme = createTheme({
    palette: {
      mode: isDarkTheme ? "dark" : "light",
      primary: {
        main: "#5c2d91", // Purple theme color
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: "flex" }}>
        {/* Top application bar */}
        <AppBar
          position="fixed"
          sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        >
          <Toolbar>
            {/* Sidebar toggle button */}
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              edge="start"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap>
              Student Portal
            </Typography>
          </Toolbar>
        </AppBar>

        {/* Sidebar component */}
        <Sidebar />

        {/* Main content area */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            // Sidebar animation effects
            transition: (theme) =>
              theme.transitions.create("margin", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
              }),
            ...(isDrawerOpen && {
              marginLeft: 0,
              transition: (theme) =>
                theme.transitions.create("margin", {
                  easing: theme.transitions.easing.easeOut,
                  duration: theme.transitions.duration.enteringScreen,
                }),
            }),
          }}
        >
          <Toolbar />
          <Container>
            {/* Route configuration */}
            <Routes>
              {/* Home route - Student list */}
              <Route
                path="/"
                element={
                  <>
                    <Box mb={2}>
                      <Typography variant="h4" gutterBottom>
                        Student List
                      </Typography>
                      {/* Action buttons area */}
                      <Box display="flex" gap={2} mb={2}>
                        {/* Add student button */}
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => setIsFormOpen(true)}
                        >
                          Add Student
                        </Button>
                        {/* Excel import component */}
                        <ExcelImport onDataLoaded={handleDataLoaded} />
                      </Box>
                      {/* Student data grid */}
                      <StudentDataGrid
                        students={students}
                        setStudents={setStudents}
                        loading={loading}
                        error={error}
                      />
                    </Box>
                    {/* Add student form dialog */}
                    <AddStudentForm
                      open={isFormOpen}
                      onClose={() => setIsFormOpen(false)}
                      onAddStudent={handleAddStudent}
                    />
                  </>
                }
              />
              {/* Settings page route */}
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

/**
 * Root application component
 * Provides settings context and routing functionality
 */
const App: React.FC = () => (
  <SettingsProvider>
    <Router>
      <AppContent />
    </Router>
  </SettingsProvider>
);

export default App;
