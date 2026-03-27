// "use client";

// import { useEffect, useState } from "react";
// import {
//   CircularProgress,
//   Typography,
//   Box,
//   TextField,
//   Button,
//   Card,
//   CardContent,
//   Container,
//   Grid,
//   Alert,
//   Chip,
//   Stack,
//   useTheme,
//   useMediaQuery,
//   Fade,
//   Table,
//   TableHead,
//   TableRow,
//   TableCell,
//   TableContainer,
//   TableBody,
//   Paper,
// } from "@mui/material";
// import {
//   GetApp,
//   DateRange,
//   Assessment,
//   TrendingUp,
//   FileDownload,
// } from "@mui/icons-material";
// import axios from "axios";
// import { saveAs } from "file-saver";
// import AttendanceReport from "./AttendanceReport";
// import SalaryList from "../employee/SalaryList";
// import SalarySlip from "../employee/SalarySlip";
// import { useAuth } from "../auth/AuthContext";

// const VisitList = () => {
//   const { user } = useAuth();
//   const [employees, setEmployees] = useState([]);
//   const [selectedEmpId, setSelectedEmpId] = useState("");
//   const [visits, setVisits] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("md"));

//   // Fetch employees for HR role according to the selected tenant
//   useEffect(() => {
//     if (user.role === "HR") {
//       const fetchEmployees = async () => {
//         try {
//           const response = await axios.get(
//             `https://namami-infotech.com/HR-SMILE-BACKEND/src/employee/list_employee.php?Tenent_Id=${user.tenent_id}`,
//           );
//           if (response.data.success) {
//             setEmployees(response.data.data);
//           }
//         } catch (error) {
//           console.error("Error fetching employee list:", error.message);
//         }
//       };
//       fetchEmployees();
//     }
//   }, [user.role, user.tenent_id]);

//   // useEffect(() => {
//   //   const fetchEmployees = async () => {
//   //     try {
//   //       const response = await axios.get(
//   //         `https://namami-infotech.com/HR-SMILE-BACKEND/src/employee/list_employee.php?Tenent_Id=${user.tenent_id}`,
//   //       );
//   //       if (response.data.success) {
//   //         setEmployees(response.data.data);
//   //       }
//   //     } catch (error) {
//   //       console.error("Error fetching employees:", error);
//   //     }
//   //   };

//   //   fetchEmployees();
//   // }, []);

//   useEffect(() => {
//     const fetchVisits = async () => {
//       if (!fromDate) return;
//       setLoading(true);
//       setError("");
//       try {
//         const response = await axios.get(
//           `https://namami-infotech.com/HR-SMILE-BACKEND/src/visit/get_visit_report.php?empId=${selectedEmpId}&date=${fromDate}`,
//         );
//         if (response.data.success) {
//           const filteredVisits = response.data.data.filter((visit) => {
//             const visitDate = new Date(visit.VisitDateTime);
//             return (
//               visitDate >= new Date(fromDate) && visitDate <= new Date(toDate)
//             );
//           });
//           setVisits(filteredVisits);
//         } else {
//           setVisits([]);
//           setError("No visits found.");
//         }
//       } catch (error) {
//         setError("Error fetching visit history.");
//         setVisits([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchVisits();
//   }, [fromDate]);

//   const handleDateChange = (event, type) => {
//     type === "from"
//       ? setFromDate(event.target.value)
//       : setToDate(event.target.value);
//   };

//   const exportSummaryToCSV = () => {
//     const summaryData = employees.map((employee) => {
//       const dealerVisits = visits.filter(
//         (visit) =>
//           visit.EmpId === employee.EmpId &&
//           visit.SourceEvent !== "In" &&
//           visit.SourceEvent !== "Out",
//       );
//       const totalDistance = dealerVisits
//         .reduce((total, visit) => total + parseFloat(visit.Distance || 0), 0)
//         .toFixed(2);

//       return {
//         Employee: employee.Name,
//         DateRange: `${new Date(fromDate).toLocaleDateString()} - ${new Date(toDate).toLocaleDateString()}`,
//         TotalVisits: dealerVisits.length,
//         TotalDistance: `${totalDistance} km`,
//       };
//     });

//     const csvContent = [
//       ["Employee", "Date Range", "Total Visits", "Total Distance (km)"],
//       ...summaryData.map((row) => Object.values(row)),
//     ]
//       .map((e) => e.join(","))
//       .join("\n");

//     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//     saveAs(blob, "summary_report.csv");
//   };

//   const exportDetailToCSV = () => {
//     const csvData = visits
//       .filter(
//         (visit) => visit.SourceEvent !== "In" && visit.SourceEvent !== "Out",
//       )
//       .map((visit) => ({
//         Employee:
//           employees.find((emp) => emp.EmpId === visit.EmpId)?.Name || "N/A",
//         Event: visit.SourceEvent,
//         DateTime: `"${new Date(visit.SourceTime).toLocaleString()}"`,
//         Distance: `${visit.Distance} km`,
//       }));

//     const csvContent = [
//       ["Employee", "Event", "DateTime", "Distance (km)"],
//       ...csvData.map((row) => Object.values(row)),
//     ]
//       .map((e) => e.join(","))
//       .join("\n");

//     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//     saveAs(blob, "detailed_report.csv");
//   };

//   const getVisitStats = () => {
//     const dealerVisits = visits.filter(
//       (visit) => visit.SourceEvent !== "In" && visit.SourceEvent !== "Out",
//     );
//     const totalDistance = dealerVisits.reduce(
//       (total, visit) => total + parseFloat(visit.Distance || 0),
//       0,
//     );
//     const uniqueEmployees = new Set(dealerVisits.map((visit) => visit.EmpId))
//       .size;

//     return {
//       totalVisits: dealerVisits.length,
//       totalDistance: totalDistance.toFixed(2),
//       uniqueEmployees,
//     };
//   };

//   const stats = getVisitStats();

//   return (
//     <Container maxWidth="xl" sx={{ py: 0 }}>
//       {/* Header Section */}
//       <Box sx={{ mb: 2 }}>
//         <Typography
//           variant="h4"
//           component="h1"
//           gutterBottom
//           sx={{
//             fontWeight: 600,
//             color: "primary.main",
//             mb: 1,
//           }}
//         >
//           <Assessment sx={{ mr: 2, verticalAlign: "middle" }} />
//           Reports Dashboard
//         </Typography>
//         <Typography variant="body1" color="text.secondary">
//           Comprehensive reporting system for visits, attendance, and salary
//           management
//         </Typography>
//       </Box>

//       {/* Visit Report Section */}
//       <Card sx={{ mb: 2, boxShadow: 3 }}>
//         <CardContent>
//           <Typography
//             variant="h5"
//             component="h2"
//             sx={{ mb: 1, color: "primary.main", fontWeight: 600 }}
//           >
//             <TrendingUp sx={{ mr: 1, verticalAlign: "middle" }} />
//             Visit Report
//           </Typography>

//           {/* Date Range Controls */}
//           <Grid container spacing={1} alignItems="center" sx={{ mb: 1 }}>
//             <Grid item xs={12} md={2}>
//               <TextField
//                 label="Employee"
//                 placeholder="Search by name or ID..."
//                 variant="outlined"
//                 size="small"
//                 fullWidth
//                 value={selectedEmpId}
//                 onChange={(e) => setSelectedEmpId(e.target.value)}
//                 inputProps={{
//                   list: "employee-list",
//                 }}
//                 InputProps={{
//                   sx: {
//                     borderRadius: "10px",
//                     backgroundColor: "#fafafa",
//                   },
//                 }}
//               />

//               <datalist id="employee-list">
//                 {employees.map((emp) => (
//                   <option key={emp.EmpId} value={emp.EmpId}>
//                     {emp.Name} ({emp.EmpId})
//                   </option>
//                 ))}
//               </datalist>
//             </Grid>
//             <Grid item xs={12} md={2}>
//               <TextField
//                 label="From Date"
//                 type="date"
//                 variant="outlined"
//                 size="small"
//                 value={fromDate}
//                 onChange={(e) => handleDateChange(e, "from")}
//                 fullWidth
//                 InputLabelProps={{ shrink: true }}
//                 InputProps={{
//                   startAdornment: (
//                     <DateRange sx={{ mr: 1, color: "action.active" }} />
//                   ),
//                 }}
//               />
//             </Grid>

//             {/* <Grid item xs={12} md={2}>
//               <TextField
//                 label="To Date"
//                 type="date"
//                 variant="outlined"
//                 size="small"
//                 value={toDate}
//                 onChange={(e) => handleDateChange(e, "to")}
//                 fullWidth
//                 InputLabelProps={{ shrink: true }}
//                 InputProps={{
//                   startAdornment: (
//                     <DateRange sx={{ mr: 1, color: "action.active" }} />
//                   ),
//                 }}
//               />
//             </Grid> */}

//             <Grid item xs={12} md={6}>
//               <Stack direction={isMobile ? "column" : "row"} spacing={2}>
//                 <Button
//                   variant="contained"
//                   onClick={exportSummaryToCSV}
//                   startIcon={<FileDownload />}
//                   disabled={!fromDate || !toDate || loading}
//                   sx={{
//                     bgcolor: "primary.main",
//                     "&:hover": { bgcolor: "primary.dark" },
//                   }}
//                 >
//                   Summary Report
//                 </Button>
//                 <Button
//                   variant="outlined"
//                   onClick={exportDetailToCSV}
//                   startIcon={<GetApp />}
//                   disabled={!fromDate || !toDate || loading}
//                   sx={{
//                     borderColor: "primary.main",
//                     color: "primary.main",
//                     "&:hover": {
//                       borderColor: "primary.dark",
//                       bgcolor: "primary.50",
//                     },
//                   }}
//                 >
//                   Detailed Report
//                 </Button>
//               </Stack>
//             </Grid>
//           </Grid>

//           {/* Stats Cards */}
//           {fromDate && toDate && !loading && (
//             <Fade in={true}>
//               <Grid container spacing={2} sx={{ mb: 2 }}>
//                 <Grid item xs={12} md={4}>
//                   <Card
//                     sx={{
//                       bgcolor: "primary.50",
//                       border: "1px solid",
//                       borderColor: "primary.200",
//                     }}
//                   >
//                     <CardContent sx={{ textAlign: "center", py: 2 }}>
//                       <Typography
//                         variant="h4"
//                         color="primary.main"
//                         fontWeight="bold"
//                       >
//                         {stats.totalVisits}
//                       </Typography>
//                       <Typography variant="body2" color="text.secondary">
//                         Total Visits
//                       </Typography>
//                     </CardContent>
//                   </Card>
//                 </Grid>
//                 <Grid item xs={12} md={4}>
//                   <Card
//                     sx={{
//                       bgcolor: "success.50",
//                       border: "1px solid",
//                       borderColor: "success.200",
//                     }}
//                   >
//                     <CardContent sx={{ textAlign: "center", py: 2 }}>
//                       <Typography
//                         variant="h4"
//                         color="success.main"
//                         fontWeight="bold"
//                       >
//                         {stats.totalDistance}
//                       </Typography>
//                       <Typography variant="body2" color="text.secondary">
//                         Total Distance (km)
//                       </Typography>
//                     </CardContent>
//                   </Card>
//                 </Grid>
//                 <Grid item xs={12} md={4}>
//                   <Card
//                     sx={{
//                       bgcolor: "info.50",
//                       border: "1px solid",
//                       borderColor: "info.200",
//                     }}
//                   >
//                     <CardContent sx={{ textAlign: "center", py: 2 }}>
//                       <Typography
//                         variant="h4"
//                         color="info.main"
//                         fontWeight="bold"
//                       >
//                         {stats.uniqueEmployees}
//                       </Typography>
//                       <Typography variant="body2" color="text.secondary">
//                         Active Employees
//                       </Typography>
//                     </CardContent>
//                   </Card>
//                 </Grid>
//               </Grid>
//             </Fade>
//           )}

//           {/* Loading and Error States */}
//           {loading && (
//             <Box
//               sx={{
//                 display: "flex",
//                 justifyContent: "center",
//                 alignItems: "center",
//                 py: 4,
//               }}
//             >
//               <CircularProgress size={40} sx={{ mr: 2 }} />
//               <Typography variant="body1" color="text.secondary">
//                 Loading visit data...
//               </Typography>
//             </Box>
//           )}

//           {error && (
//             <Alert severity="error" sx={{ mt: 2 }}>
//               {error}
//             </Alert>
//           )}
//         </CardContent>
//       </Card>
//       <TableContainer component={Paper}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>Sr No</TableCell>
//               <TableCell>Date</TableCell>
//               <TableCell>Company</TableCell>
//               <TableCell>Image</TableCell>
//             </TableRow>
//           </TableHead>

//           <TableBody>
//             {visits.map((row, index) => (
//               <TableRow key={index}>
//                 <TableCell>{index + 1}</TableCell>

//                 <TableCell>{new Date(row.date).toLocaleString()}</TableCell>

//                 <TableCell>{row.company}</TableCell>

//                 <TableCell>
//                   <img
//                     src={`https://namami-infotech.com/${row.image}`}
//                     alt="img"
//                     width="80"
//                     style={{ borderRadius: "8px" }}
//                   />
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       {/* Other Report Components */}
//       {/* <Stack spacing={4}>
//         <AttendanceReport />
//         <SalaryList />
//         <SalarySlip /> */}
//       {/* </Stack> */}
//     </Container>
//   );
// };

// export default VisitList;

"use client";

import { useEffect, useState } from "react";
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
  Stack,
  useTheme,
  useMediaQuery,
  Fade,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableContainer,
  TableBody,
  Paper,
} from "@mui/material";
import {
  GetApp,
  DateRange,
  Assessment,
  TrendingUp,
  FileDownload,
} from "@mui/icons-material";
import axios from "axios";
import { saveAs } from "file-saver";
import { useAuth } from "../auth/AuthContext";

const VisitList = () => {
  const { user } = useAuth();

  const [employees, setEmployees] = useState([]);
  const [selectedEmpId, setSelectedEmpId] = useState("");
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fromDate, setFromDate] = useState("");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // 🔥 Fetch Employees
  useEffect(() => {
    if (user.role === "HR") {
      axios
        .get(
          `https://namami-infotech.com/HR-SMILE-BACKEND/src/employee/list_employee.php?Tenent_Id=${user.tenent_id}`,
        )
        .then((res) => {
          if (res.data.success) setEmployees(res.data.data);
        })
        .catch((err) => console.log(err));
    }
  }, [user]);

  //  GROUPING FUNCTION
  const formatData = (data) => {
    const map = {};

    data.forEach((item) => {
      const key = item.ActivityId;

      if (!map[key]) {
        map[key] = {
          date: item.Datetime,
          company: "",
          image: "",
        };
      }

      if (item.ChkId == 1) map[key].company = item.Value;
      if (item.ChkId == 7) map[key].image = item.Value;
    });

    return Object.values(map).filter((item) => item.company && item.image);
  };

  // 🔥 Fetch Visits
  useEffect(() => {
    if (!fromDate || !selectedEmpId) return;

    setLoading(true);
    setError("");

    axios
      .get(
        `https://namami-infotech.com/HR-SMILE-BACKEND/src/visit/get_visit_report.php?empId=${selectedEmpId}&date=${fromDate}`,
      )
      .then((res) => {
        if (res.data.success) {
          const formatted = formatData(res.data.data);
          setVisits(formatted);
        } else {
          setVisits([]);
          setError("No data found");
        }
      })
      .catch(() => {
        setError("API Error");
        setVisits([]);
      })
      .finally(() => setLoading(false));
  }, [fromDate, selectedEmpId]);

  const getVisitStats = () => {
    const totalVisits = visits.length;

    // 👉 Distance calculate (basic approx - between points)
    let totalDistance = 0;

    for (let i = 1; i < visits.length; i++) {
      const lat1 = parseFloat(visits[i - 1].lat);
      const lon1 = parseFloat(visits[i - 1].lng);
      const lat2 = parseFloat(visits[i].lat);
      const lon2 = parseFloat(visits[i].lng);

      if (lat1 && lon1 && lat2 && lon2) {
        const R = 6371; // km
        const dLat = ((lat2 - lat1) * Math.PI) / 180;
        const dLon = ((lon2 - lon1) * Math.PI) / 180;

        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        totalDistance += R * c;
      }
    }

    return {
      totalVisits,
      totalDistance: totalDistance.toFixed(2),
      uniqueEmployees: selectedEmpId ? 1 : 0,
    };
  };

  const stats = getVisitStats();

  return (
    <Container maxWidth="xl">
      {/* HEADER */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight="bold" color="primary">
          <Assessment sx={{ mr: 1 }} />
          Visit Report
        </Typography>
      </Box>

      {/* FILTER CARD */}
      <Card sx={{ mb: 3, borderRadius: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                label="Employee"
                fullWidth
                value={selectedEmpId}
                onChange={(e) => setSelectedEmpId(e.target.value)}
                inputProps={{ list: "employee-list" }}
              />
              <datalist id="employee-list">
                {employees.map((emp) => (
                  <option key={emp.EmpId} value={emp.EmpId}>
                    {emp.Name}
                  </option>
                ))}
              </datalist>
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                type="date"
                fullWidth
                label="Select Date"
                InputLabelProps={{ shrink: true }}
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      {fromDate && !loading && visits.length > 0 && (
        <Fade in={true}>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  bgcolor: "primary.50",
                  border: "1px solid",
                  borderColor: "primary.200",
                }}
              >
                <CardContent sx={{ textAlign: "center", py: 2 }}>
                  <Typography
                    variant="h4"
                    color="primary.main"
                    fontWeight="bold"
                  >
                    {stats.totalVisits}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Visits
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  bgcolor: "success.50",
                  border: "1px solid",
                  borderColor: "success.200",
                }}
              >
                <CardContent sx={{ textAlign: "center", py: 2 }}>
                  <Typography
                    variant="h4"
                    color="success.main"
                    fontWeight="bold"
                  >
                    {stats.totalDistance} km
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Distance
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  bgcolor: "info.50",
                  border: "1px solid",
                  borderColor: "info.200",
                }}
              >
                <CardContent sx={{ textAlign: "center", py: 2 }}>
                  <Typography variant="h4" color="info.main" fontWeight="bold">
                    {stats.uniqueEmployees}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active Employees
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Fade>
      )}
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
          <TableContainer
            component={Paper}
            sx={{ borderRadius: 3, boxShadow: 3 }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "primary.main" }}>
                  <TableCell sx={{ color: "#fff" }}>Sr No</TableCell>
                  <TableCell sx={{ color: "#fff" }}>Date</TableCell>
                  <TableCell sx={{ color: "#fff" }}>Company</TableCell>
                  <TableCell sx={{ color: "#fff" }}>Image</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {visits.map((row, i) => (
                  <TableRow key={i} hover>
                    <TableCell>{i + 1}</TableCell>

                    <TableCell>{new Date(row.date).toLocaleString()}</TableCell>

                    <TableCell>
                      <Chip label={row.company} />
                    </TableCell>

                    <TableCell>
                      <img
                        src={`https://namami-infotech.com/${row.image}`}
                        width="70"
                        style={{ borderRadius: "8px" }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Fade>
      )}
    </Container>
  );
};

export default VisitList;
