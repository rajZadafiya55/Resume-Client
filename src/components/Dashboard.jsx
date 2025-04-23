// src/components/Dashboard.js
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Container, 
  Card,
  CardContent,
  Skeleton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import ResumePreview from "./ResumePreview";
import ResumePreviewAlt from "./ResumePreviewAlt";

const Dashboard = () => {
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchResume = async () => {
    try {
      const response = await api.get("/api/resume");
      setResume(response.data[0]);
      console.log("response", response.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchResume();
  }, []);

  const handleResumeDelete = async (deletedResumeId) => {
    try {
      if (Array.isArray(resume)) {
        const updatedResumes = resume.filter(
          (res) => res._id !== deletedResumeId
        );
        setResume(updatedResumes);
      }

      await fetchResume();

      navigate("/create-resume");
    } catch (error) {
      console.error("Error deleting resume:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <Container maxWidth="md" sx={{ mt: 6 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h4" gutterBottom>
          Dashboard 🧑‍💻
        </Typography>
        <Button variant="outlined" color="error" onClick={handleLogout}>
          Logout
        </Button>
      </Box>

      <Card sx={{ border: "1px solid #ccc", borderRadius: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom textAlign="center">
            Welcome to Your Dashboard
          </Typography>

          <Typography
            variant="subtitle1"
            gutterBottom
            textAlign="center"
            color="text.secondary"
          >
            {loading ? (
              <Box mt={4}>
                {/* Skeleton for title */}
                <Skeleton
                  variant="text"
                  width="60%"
                  height={40}
                  sx={{ mx: "auto", mb: 2 }}
                />

                {/* Skeleton for resume card */}
                <Skeleton
                  variant="rectangular"
                  height={200}
                  sx={{ borderRadius: 2, mb: 2 }}
                />

                {/* Skeleton for alternate resume preview */}
                <Skeleton
                  variant="rectangular"
                  height={180}
                  sx={{ borderRadius: 2 }}
                />
              </Box>
            ) : (
              <>
                {resume && (
                  <>
                    <ResumePreview
                      resume={resume}
                      onResumeDelete={handleResumeDelete}
                    />
                    <Box mt={4}>
                      <ResumePreviewAlt
                        resume={resume}
                        onResumeDelete={handleResumeDelete}
                      />
                    </Box>
                  </>
                )}
              </>
            )}
          </Typography>

          <Box textAlign="center" mt={3}>
            <Button
              variant="contained"
              color="error"
              size="large"
              onClick={() => navigate("/create-resume", { state: { resume } })}
            >
              {resume ? "Update Resume" : "Create Resume"}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Dashboard;
