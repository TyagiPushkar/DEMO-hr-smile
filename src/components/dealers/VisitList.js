"use client";

import { useEffect, useState, useRef } from "react";
import {
  CircularProgress,
  Typography,
  Box,
  TextField,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Alert,
  Chip,
  Fade,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableContainer,
  TableBody,
  Paper,
  Dialog,
  IconButton,
} from "@mui/material";
import { Assessment, Close } from "@mui/icons-material";
import axios from "axios";
import { useAuth } from "../auth/AuthContext";

const VisitList = () => {
  const { user } = useAuth();

  const [employees, setEmployees] = useState([]);
  const [selectedEmpId, setSelectedEmpId] = useState("");
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [selectedImage, setSelectedImage] = useState(null);
  const [openImageModal, setOpenImageModal] = useState(false);

  const initialLoad = useRef(false); // 🔥 important

  // ✅ Fetch Employees (ONLY ONCE)
  useEffect(() => {
    if (user.role === "HR") {
      axios
        .get(
          `https://namami-infotech.com/HR-SMILE-BACKEND/src/employee/list_employee.php?Tenent_Id=${user.tenent_id}`,
        )
        .then((res) => {
          if (res.data.success) setEmployees(res.data.data);
        })
        .catch(() => {});
    }
  }, [user]);

  const getEmployeeName = (empId) => {
    const emp = employees.find((e) => e.EmpId == empId);
    return emp ? emp.Name : "N/A";
  };

  // ✅ Format Data
  const formatData = (data) => {
    const map = {};

    data.forEach((item) => {
      const key = item.Datetime + "_" + item.EmpId;

      if (!map[key]) {
        map[key] = {
          empId: item.EmpId,
          name: getEmployeeName(item.EmpId),
          date: item.Datetime,
          companyName: "",
          image: "",
        };
      }

      if (item.ChkId == 1) map[key].companyName = item.Value;
      if (item.ChkId == 7) map[key].image = item.Value;
    });

    return Object.values(map).filter((i) => i.companyName && i.image);
  };

  // ✅ API CALL (ONLY WHEN CLICK)
  const fetchVisits = async () => {
    setLoading(true);
    setError("");

    try {
      let url = `https://namami-infotech.com/HR-SMILE-BACKEND/src/visit/temp_get_visit_report.php`;

      const params = {};
      if (selectedEmpId) params.empId = selectedEmpId;
      if (fromDate) params.startdate = fromDate;
      if (toDate) params.enddate = toDate;

      const query = new URLSearchParams(params).toString();
      if (query) url += `?${query}`;

      const res = await axios.get(url);

      if (res.data.success) {
        setVisits(formatData(res.data.data));
      } else {
        setVisits([]);
        setError("No data found");
      }
    } catch {
      setError("API Error");
      setVisits([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ OPTIONAL: Initial load (only once)
  useEffect(() => {
    if (!initialLoad.current && employees.length > 0) {
      initialLoad.current = true;
      fetchVisits(); // remove if you DON'T want auto load
    }
  }, [employees]);

  return (
    <Container maxWidth="xl">
      {/* HEADER */}
      <Typography variant="h4" fontWeight="bold" color="primary" mb={2}>
        <Assessment sx={{ mr: 1 }} />
        Visit Report
      </Typography>

      {/* FILTER CARD */}
      <Card sx={{ mb: 3, borderRadius: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <TextField
                select
                fullWidth
                value={selectedEmpId}
                onChange={(e) => setSelectedEmpId(e.target.value)}
                SelectProps={{ native: true }}
              >
                <option value="">All Employees</option>
                {employees.map((emp) => (
                  <option key={emp.EmpId} value={emp.EmpId}>
                    {emp.Name}
                  </option>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                type="date"
                fullWidth
                label="From Date"
                InputLabelProps={{ shrink: true }}
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                type="date"
                fullWidth
                label="To Date"
                InputLabelProps={{ shrink: true }}
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </Grid>

            <Grid item xs={12} md={1.5}>
              <Button
                variant="contained"
                fullWidth
                sx={{ height: "56px" }}
                onClick={fetchVisits}
              >
                Search
              </Button>
            </Grid>

            <Grid item xs={12} md={1.5}>
              <Button
                variant="outlined"
                fullWidth
                sx={{ height: "56px" }}
                onClick={() => {
                  setSelectedEmpId("");
                  setFromDate("");
                  setToDate("");
                  setVisits([]);
                }}
              >
                Clear
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* LOADING */}
      {loading && (
        <Box textAlign="center" py={4}>
          <CircularProgress />
        </Box>
      )}

      {/* ERROR */}
      {error && <Alert severity="error">{error}</Alert>}

      {/* TABLE */}
      {!loading && visits.length > 0 && (
        <Fade in>
          <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "primary.main" }}>
                  <TableCell sx={{ color: "#fff" }}>#</TableCell>
                  <TableCell sx={{ color: "#fff" }}>Emp ID</TableCell>
                  <TableCell sx={{ color: "#fff" }}>Name</TableCell>
                  <TableCell sx={{ color: "#fff" }}>Company</TableCell>
                  <TableCell sx={{ color: "#fff" }}>Image</TableCell>
                  <TableCell sx={{ color: "#fff" }}>Date</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {visits.map((row, i) => (
                  <TableRow key={i}>
                    <TableCell>{i + 1}</TableCell>
                    <TableCell>{row.empId}</TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>
                      <Chip label={row.companyName} />
                    </TableCell>
                    <TableCell>
                      <img
                        src={
                          row.image.startsWith("http")
                            ? row.image
                            : `https://namami-infotech.com/${row.image}`
                        }
                        width="40"
                        style={{
                          borderRadius: 6,
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          setSelectedImage(row.image);
                          setOpenImageModal(true);
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(row.date).toLocaleString("en-IN")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Fade>
      )}

      {/* IMAGE MODAL */}
      <Dialog open={openImageModal} onClose={() => setOpenImageModal(false)}>
        <Box p={2} bgcolor="#000">
          <IconButton
            onClick={() => setOpenImageModal(false)}
            sx={{ color: "#fff" }}
          >
            <Close />
          </IconButton>
          <img src={selectedImage} style={{ maxWidth: "100%" }} alt="preview" />
        </Box>
      </Dialog>
    </Container>
  );
};

export default VisitList;
