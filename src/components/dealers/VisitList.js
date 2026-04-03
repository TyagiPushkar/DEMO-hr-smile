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
// import { useAuth } from "../auth/AuthContext";

// const VisitList = () => {
//   const { user } = useAuth();

//   const [employees, setEmployees] = useState([]);
//   const [selectedEmpId, setSelectedEmpId] = useState("");
//   const [visits, setVisits] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [fromDate, setFromDate] = useState("");

//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("md"));

//   // 🔥 Fetch Employees
//   useEffect(() => {
//     if (user.role === "HR") {
//       axios
//         .get(
//           `https://namami-infotech.com/HR-SMILE-BACKEND/src/employee/list_employee.php?Tenent_Id=${user.tenent_id}`,
//         )
//         .then((res) => {
//           if (res.data.success) setEmployees(res.data.data);
//         })
//         .catch((err) => console.log(err));
//     }
//   }, [user]);

//   //  GROUPING FUNCTION
//   const formatData = (data) => {
//     const map = {};

//     data.forEach((item) => {
//       const key = item.ActivityId;

//       if (!map[key]) {
//         map[key] = {
//           date: item.Datetime,
//           company: "",
//           image: "",
//         };
//       }

//       if (item.ChkId == 1) map[key].company = item.Value;
//       if (item.ChkId == 7) map[key].image = item.Value;
//     });

//     return Object.values(map).filter((item) => item.company && item.image);
//   };

//   // 🔥 Fetch Visits
//   useEffect(() => {
//     if (!fromDate || !selectedEmpId) return;

//     setLoading(true);
//     setError("");

//     axios
//       .get(
//         `https://namami-infotech.com/HR-SMILE-BACKEND/src/visit/get_visit_report.php?empId=${selectedEmpId}&date=${fromDate}`,
//       )
//       .then((res) => {
//         if (res.data.success) {
//           const formatted = formatData(res.data.data);
//           setVisits(formatted);
//         } else {
//           setVisits([]);
//           setError("No data found");
//         }
//       })
//       .catch(() => {
//         setError("API Error");
//         setVisits([]);
//       })
//       .finally(() => setLoading(false));
//   }, [fromDate, selectedEmpId]);

//   const getVisitStats = () => {
//     const totalVisits = visits.length;

//     // 👉 Distance calculate (basic approx - between points)
//     let totalDistance = 0;

//     for (let i = 1; i < visits.length; i++) {
//       const lat1 = parseFloat(visits[i - 1].lat);
//       const lon1 = parseFloat(visits[i - 1].lng);
//       const lat2 = parseFloat(visits[i].lat);
//       const lon2 = parseFloat(visits[i].lng);

//       if (lat1 && lon1 && lat2 && lon2) {
//         const R = 6371; // km
//         const dLat = ((lat2 - lat1) * Math.PI) / 180;
//         const dLon = ((lon2 - lon1) * Math.PI) / 180;

//         const a =
//           Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//           Math.cos((lat1 * Math.PI) / 180) *
//             Math.cos((lat2 * Math.PI) / 180) *
//             Math.sin(dLon / 2) *
//             Math.sin(dLon / 2);

//         const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//         totalDistance += R * c;
//       }
//     }

//     return {
//       totalVisits,
//       totalDistance: totalDistance.toFixed(2),
//       uniqueEmployees: selectedEmpId ? 1 : 0,
//     };
//   };

//   const stats = getVisitStats();

//   return (
//     <Container maxWidth="xl">
//       {/* HEADER */}
//       <Box sx={{ mb: 3 }}>
//         <Typography variant="h4" fontWeight="bold" color="primary">
//           <Assessment sx={{ mr: 1 }} />
//           Visit Report
//         </Typography>
//       </Box>

//       {/* FILTER CARD */}
//       <Card sx={{ mb: 3, borderRadius: 3 }}>
//         <CardContent>
//           <Grid container spacing={2}>
//             <Grid item xs={12} md={4}>
//               <TextField
//                 label="Employee"
//                 fullWidth
//                 value={selectedEmpId}
//                 onChange={(e) => setSelectedEmpId(e.target.value)}
//                 inputProps={{ list: "employee-list" }}
//               />
//               <datalist id="employee-list">
//                 {employees.map((emp) => (
//                   <option key={emp.EmpId} value={emp.EmpId}>
//                     {emp.Name}
//                   </option>
//                 ))}
//               </datalist>
//             </Grid>

//             <Grid item xs={12} md={4}>
//               <TextField
//                 type="date"
//                 fullWidth
//                 label="Select Date"
//                 InputLabelProps={{ shrink: true }}
//                 value={fromDate}
//                 onChange={(e) => setFromDate(e.target.value)}
//               />
//             </Grid>
//           </Grid>
//         </CardContent>
//       </Card>

//       {/* Stats Cards */}
//       {fromDate && !loading && visits.length > 0 && (
//         <Fade in={true}>
//           <Grid container spacing={2} sx={{ mb: 2 }}>
//             <Grid item xs={12} md={4}>
//               <Card
//                 sx={{
//                   bgcolor: "primary.50",
//                   border: "1px solid",
//                   borderColor: "primary.200",
//                 }}
//               >
//                 <CardContent sx={{ textAlign: "center", py: 2 }}>
//                   <Typography
//                     variant="h4"
//                     color="primary.main"
//                     fontWeight="bold"
//                   >
//                     {stats.totalVisits}
//                   </Typography>
//                   <Typography variant="body2" color="text.secondary">
//                     Total Visits
//                   </Typography>
//                 </CardContent>
//               </Card>
//             </Grid>

//             <Grid item xs={12} md={4}>
//               <Card
//                 sx={{
//                   bgcolor: "success.50",
//                   border: "1px solid",
//                   borderColor: "success.200",
//                 }}
//               >
//                 <CardContent sx={{ textAlign: "center", py: 2 }}>
//                   <Typography
//                     variant="h4"
//                     color="success.main"
//                     fontWeight="bold"
//                   >
//                     {stats.totalDistance} km
//                   </Typography>
//                   <Typography variant="body2" color="text.secondary">
//                     Total Distance
//                   </Typography>
//                 </CardContent>
//               </Card>
//             </Grid>

//             <Grid item xs={12} md={4}>
//               <Card
//                 sx={{
//                   bgcolor: "info.50",
//                   border: "1px solid",
//                   borderColor: "info.200",
//                 }}
//               >
//                 <CardContent sx={{ textAlign: "center", py: 2 }}>
//                   <Typography variant="h4" color="info.main" fontWeight="bold">
//                     {stats.uniqueEmployees}
//                   </Typography>
//                   <Typography variant="body2" color="text.secondary">
//                     Active Employees
//                   </Typography>
//                 </CardContent>
//               </Card>
//             </Grid>
//           </Grid>
//         </Fade>
//       )}
//       {/* LOADING */}
//       {loading && (
//         <Box textAlign="center" py={4}>
//           <CircularProgress />
//         </Box>
//       )}

//       {/* ERROR */}
//       {error && <Alert severity="error">{error}</Alert>}

//       {/* TABLE */}
//       {!loading && visits.length > 0 && (
//         <Fade in>
//           <TableContainer
//             component={Paper}
//             sx={{ borderRadius: 3, boxShadow: 3 }}
//           >
//             <Table>
//               <TableHead>
//                 <TableRow sx={{ bgcolor: "primary.main" }}>
//                   <TableCell sx={{ color: "#fff" }}>Sr No</TableCell>
//                   <TableCell sx={{ color: "#fff" }}>Date</TableCell>
//                   <TableCell sx={{ color: "#fff" }}>Company</TableCell>
//                   <TableCell sx={{ color: "#fff" }}>Image</TableCell>
//                 </TableRow>
//               </TableHead>

//               <TableBody>
//                 {visits.map((row, i) => (
//                   <TableRow key={i} hover>
//                     <TableCell>{i + 1}</TableCell>

//                     <TableCell>{new Date(row.date).toLocaleString()}</TableCell>

//                     <TableCell>
//                       <Chip label={row.company} />
//                     </TableCell>

//                     <TableCell>
//                       <img
//                         src={`https://namami-infotech.com/${row.image}`}
//                         width="70"
//                         style={{ borderRadius: "8px" }}
//                       />
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         </Fade>
//       )}
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
  Fade,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableContainer,
  TableBody,
  Paper,
  Dialog,
  DialogContent,
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

  // ✅ DATE RANGE
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // 🔥 IMAGE MODAL STATE
  const [selectedImage, setSelectedImage] = useState(null);
  const [openImageModal, setOpenImageModal] = useState(false);

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
        .catch(() => {});
    }
  }, [user]);
  const getEmployeeName = (empId) => {
    const emp = employees.find((e) => e.EmpId == empId);
    return emp ? emp.Name : "N/A";
  };

  const formatData = (data) => {
    const map = {};

    data.forEach((item) => {
      // Use datetime + employee as key to separate visits
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

    return Object.values(map).filter((item) => item.companyName && item.image);
  };

  const fetchVisits = async () => {
    setLoading(true);
    setError("");

    try {
      let url = `https://namami-infotech.com/HR-SMILE-BACKEND/src/visit/temp_get_visit_report.php`;

      const params = {};

      if (selectedEmpId) params.empId = selectedEmpId;
      if (fromDate) params.startdate = fromDate;
      if (toDate) params.enddate = toDate;

      // Convert params object to query string
      const queryString = new URLSearchParams(params).toString();
      if (queryString) url += `?${queryString}`;

      console.log("API URL:", url);
      const res = await axios.get(url);

      if (res.data.success) {
        const formatted = formatData(res.data.data);
        setVisits(formatted);
      } else {
        setVisits([]);
        setError("No data found");
      }
    } catch (err) {
      setError("API Error");
      setVisits([]);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 AUTO LOAD + FILTER
  useEffect(() => {
    fetchVisits();
  }, [selectedEmpId, fromDate, toDate]);

  // 🔥 INITIAL LOAD (ALL DATA) - Wait for employees to load first
  useEffect(() => {
    if (employees.length > 0) {
      fetchVisits();
    }
  }, [employees]);

  // 🔥 STATS
  const stats = {
    totalVisits: visits.length,
    uniqueEmployees: selectedEmpId ? 1 : employees.length,
  };

  return (
    <Container maxWidth="xl">
      {/* HEADER */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight="bold" color="primary">
          <Assessment sx={{ mr: 1 }} />
          Visit Report
        </Typography>
      </Box>

      {/* FILTERS */}
      <Card sx={{ mb: 3, borderRadius: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            {/* EMPLOYEE */}
            <Grid item xs={12} md={4}>
              {/* <TextField
                label="Employee "
                fullWidth
                value={selectedEmpId}
                onChange={(e) => setSelectedEmpId(e.target.value)}
                inputProps={{ list: "employee-list" }}
              /> */}

              <TextField
                select
                label=""
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
              <datalist id="employee-list">
                {employees.map((emp) => (
                  <option key={emp.EmpId} value={emp.EmpId}>
                    {emp.Name}
                  </option>
                ))}
              </datalist>
            </Grid>

            {/* FROM DATE */}
            <Grid item xs={12} md={3}>
              <TextField
                type="date"
                label="From Date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </Grid>

            {/* TO DATE */}
            <Grid item xs={12} md={3}>
              <TextField
                type="date"
                label="To Date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </Grid>

            {/* CLEAR */}
            <Grid item xs={12} md={2}>
              <Button
                variant="outlined"
                fullWidth
                sx={{ height: "56px" }}
                onClick={() => {
                  setSelectedEmpId("");
                  setFromDate("");
                  setToDate("");
                }}
              >
                Clear
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* STATS */}
      {/* {!loading && visits.length > 0 && (
        <Fade in>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent sx={{ textAlign: "center" }}>
                  <Typography variant="h4" color="primary">
                    {stats.totalVisits}
                  </Typography>
                  <Typography>Total Visits</Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent sx={{ textAlign: "center" }}>
                  <Typography variant="h4" color="secondary">
                    {stats.uniqueEmployees}
                  </Typography>
                  <Typography>Employees</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Fade> */}
      {/* )} */}

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
                  <TableCell sx={{ color: "#fff" }}>Sr No</TableCell>
                  <TableCell sx={{ color: "#fff" }}>Emp ID</TableCell>
                  <TableCell sx={{ color: "#fff" }}>Name</TableCell>
                  <TableCell sx={{ color: "#fff" }}>Company Name</TableCell>
                  <TableCell sx={{ color: "#fff" }}>Image</TableCell>
                  <TableCell sx={{ color: "#fff" }}>Date Time</TableCell>
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
                          row.image && !row.image.startsWith("http")
                            ? `https://namami-infotech.com/${row.image}`
                            : row.image
                        }
                        width="35"
                        height="35"
                        style={{
                          borderRadius: "6px",
                          objectFit: "cover",
                          cursor: "pointer",
                          border: "2px solid #ddd",
                          transition: "transform 0.2s, box-shadow 0.2s",
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.transform = "scale(1.05)";
                          e.target.style.boxShadow =
                            "0 4px 8px rgba(0,0,0,0.2)";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = "scale(1)";
                          e.target.style.boxShadow = "0 0 0 rgba(0,0,0,0)";
                        }}
                        onClick={() => {
                          const fullUrl =
                            row.image && !row.image.startsWith("http")
                              ? `https://namami-infotech.com/${row.image}`
                              : row.image;
                          setSelectedImage(fullUrl);
                          setOpenImageModal(true);
                        }}
                        onError={(e) => {
                          console.log("Image Error - URL:", e.target.src);
                          console.log("Row Image Value:", row.image);
                          e.target.src =
                            "https://via.placeholder.com/50?text=No+Image";
                        }}
                        alt="Visit"
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(row.date).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}{" "}
                      {new Date(row.date).toLocaleTimeString("en-IN", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Fade>
      )}

      {/* 🔥 IMAGE MODAL */}
      <Dialog
        open={openImageModal}
        onClose={() => setOpenImageModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <Box
          sx={{
            position: "relative",
            bgcolor: "#000",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "400px",
            p: 2,
          }}
        >
          <IconButton
            onClick={() => setOpenImageModal(false)}
            sx={{
              position: "absolute",
              top: 10,
              right: 10,
              color: "#fff",
              bgcolor: "rgba(0,0,0,0.5)",
              "&:hover": { bgcolor: "rgba(0,0,0,0.7)" },
            }}
          >
            <Close />
          </IconButton>
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Full View"
              style={{
                maxWidth: "100%",
                maxHeight: "500px",
                objectFit: "contain",
                borderRadius: "8px",
              }}
              onError={(e) => {
                e.target.src =
                  "https://via.placeholder.com/400?text=Image+Not+Found";
              }}
            />
          )}
        </Box>
      </Dialog>
    </Container>
  );
};

export default VisitList;
