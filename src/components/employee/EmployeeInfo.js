import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  Paper,
  Grid,
  useTheme,
  Divider,
  Stack,
} from "@mui/material";
import { motion } from "framer-motion";
import { Badge as BadgeIcon } from "@mui/icons-material";

// Simple Text Display Component
export const EmployeeInfoText = ({ employee, variant = "compact" }) => {
  const theme = useTheme();

  if (variant === "compact") {
    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <Avatar
          sx={{
            bgcolor: theme.palette.primary.main,
            width: 40,
            height: 40,
            fontWeight: "bold",
          }}
        >
          {employee?.Name?.charAt(0).toUpperCase()}
        </Avatar>
        <Box>
          <Typography variant="body2" fontWeight="600">
            {employee?.Name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            ID: {employee?.EmpId}
          </Typography>
        </Box>
      </Box>
    );
  }

  if (variant === "expanded") {
    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Avatar
          sx={{
            bgcolor: theme.palette.primary.main,
            width: 56,
            height: 56,
            fontSize: "1.5rem",
            fontWeight: "bold",
          }}
        >
          {employee?.Name?.charAt(0).toUpperCase()}
        </Avatar>
        <Box>
          <Typography variant="h6" fontWeight="bold">
            {employee?.Name}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <BadgeIcon fontSize="small" sx={{ color: "text.secondary" }} />
            <Typography variant="body2" color="text.secondary">
              {employee?.EmpId}
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  }
};

// Card Display Component
export const EmployeeInfoCard = ({ employee }) => {
  const theme = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4, boxShadow: theme.shadows[8] }}
      transition={{ duration: 0.2 }}
    >
      <Card
        sx={{
          borderLeft: `4px solid ${theme.palette.primary.main}`,
          "&:hover": {
            boxShadow: theme.shadows[8],
            transition: "all 0.3s ease",
          },
        }}
      >
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar
              sx={{
                bgcolor: theme.palette.primary.main,
                width: 60,
                height: 60,
                fontSize: "1.8rem",
                fontWeight: "bold",
              }}
            >
              {employee?.Name?.charAt(0).toUpperCase()}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                {employee?.Name}
              </Typography>
              <Chip
                icon={<BadgeIcon />}
                label={`ID: ${employee?.EmpId}`}
                variant="outlined"
                size="small"
              />
            </Box>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Detailed Badge Component
export const EmployeeInfoBadge = ({ employee }) => {
  const theme = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Paper
        elevation={2}
        sx={{
          p: 2.5,
          borderRadius: 2,
          background: `linear-gradient(135deg, ${theme.palette.primary.main}08, ${theme.palette.primary.main}04)`,
          border: `1px solid ${theme.palette.primary.main}30`,
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <Avatar
              sx={{
                bgcolor: theme.palette.primary.main,
                width: 50,
                height: 50,
                fontWeight: "bold",
              }}
            >
              {employee?.Name?.charAt(0).toUpperCase()}
            </Avatar>
          </Grid>
          <Grid item xs>
            <Typography variant="subtitle1" fontWeight="700">
              {employee?.Name}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.5 }}>
              <Typography variant="caption" color="text.secondary">
                Employee ID:
              </Typography>
              <Typography variant="body2" fontWeight="600" color="primary">
                {employee?.EmpId}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </motion.div>
  );
};

// Simple Row Display
export const EmployeeInfoRow = ({ employee }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        p: 1.5,
        borderRadius: 1,
        backgroundColor: theme.palette.grey[50],
        border: `1px solid ${theme.palette.grey[200]}`,
        "&:hover": {
          backgroundColor: theme.palette.grey[100],
        },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <Avatar
          sx={{
            bgcolor: theme.palette.primary.main,
            width: 36,
            height: 36,
            fontSize: "0.9rem",
            fontWeight: "bold",
          }}
        >
          {employee?.Name?.charAt(0).toUpperCase()}
        </Avatar>
        <Box>
          <Typography variant="body2" fontWeight="600">
            {employee?.Name}
          </Typography>
        </Box>
      </Box>
      <Chip
        label={employee?.EmpId}
        variant="filled"
        size="small"
        sx={{
          bgcolor: theme.palette.primary.light,
          color: theme.palette.primary.dark,
          fontWeight: "600",
        }}
      />
    </Box>
  );
};

export default EmployeeInfoText;
