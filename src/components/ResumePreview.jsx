import React, { useRef, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Divider,
  Chip,
  Button,
} from "@mui/material";
import { motion } from "framer-motion";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { toast } from "react-toastify";
import api from "../services/api";
import Swal from "sweetalert2";
import CircularProgress from "@mui/material/CircularProgress";

const ResumePreview = ({ resume, onResumeDelete, variant = "default" }) => {
  const componentRef = useRef();
  const [isLoading, setIsLoading] = useState(false);

  const handleDownloadPDF = async () => {
    const element = componentRef.current;
    const buttons = element.querySelector(".pdf-hidden");

    setIsLoading(true);
    buttons.style.display = "none";

    await new Promise((res) => setTimeout(res, 100));

    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("My_Resume.pdf");

    buttons.style.display = "flex";
    setIsLoading(false);
  };

  const handleDeleteResume = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/api/resume/${resume._id}`);
        toast.success("Resume deleted successfully!");
        onResumeDelete();
      } catch (error) {
        toast.error("Error deleting resume");
        console.error(error);
      }
    } else {
      toast.info("Delete action was canceled.");
    }
  };

  if (!resume) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card
        ref={componentRef}
        sx={{
          padding: "25px 0px",
          borderRadius: 4,
          width: "100%",
          maxWidth: "900px",
          minHeight: "297mm",
          margin: "auto",
          // background: "#fff",
          // boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
          background: variant === "alternative" ? "#f9f9f9" : "#fff",
          boxShadow:
            variant === "alternative"
              ? "0 0 10px rgba(255, 0, 0, 0.2)"
              : "0 8px 24px rgba(0, 0, 0, 0.1)",
          border: variant === "alternative" ? "2px dashed #e91e63" : "none",
        }}
      >
        <CardContent>
          <Grid
            item
            container
            spacing={0}
            wrap="nowrap"
            alignItems="flex-start"
          >
            {/* Left Column */}

            <Grid
              item
              xs={12}
              md={6}
              sx={{
                borderRight: { md: "1px solid #e0e0e0" },
                pr: { md: 4 },
                wordBreak: "break-word",
                textAlign: "justify",
                padding: "0px 10px 0px 10px",
              }}
            >
              <Box mb={3}>
                <Typography
                  variant="h5"
                  fontWeight="bold"
                  color="primary"
                  gutterBottom
                >
                  {resume.name}
                </Typography>
                <Typography variant="subtitle1" fontWeight="bold">
                  {resume.title}
                </Typography>
              </Box>

              <Box mb={3}>
                <Typography variant="body2">{resume.email}</Typography>
                <Typography variant="body2">{resume.phone}</Typography>
                <Typography
                  variant="body2"
                  sx={{ wordBreak: "break-word", whiteSpace: "pre-wrap" }}
                >
                  {resume.github}
                </Typography>
                <Typography variant="body2">{resume.website}</Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" color="primary" gutterBottom>
                Education
              </Typography>
              {resume.education?.map((edu, index) => (
                <Box key={index} mb={2}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {edu.degree}
                  </Typography>
                  <Typography variant="body2">{edu.school}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(edu.startDate).toLocaleDateString()} -{" "}
                    {new Date(edu.endDate).toLocaleDateString()}
                  </Typography>
                </Box>
              ))}

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" color="primary" gutterBottom>
                Work Experience
              </Typography>
              {resume.experiences?.map((exp, index) => (
                <Box key={index} mb={2}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {exp.position} at {exp.company}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(exp.startDate).toLocaleDateString()} -{" "}
                    {exp.endDate
                      ? new Date(exp.endDate).toLocaleDateString()
                      : "Present"}
                  </Typography>
                  <Typography variant="body2">{exp.description}</Typography>
                </Box>
              ))}
            </Grid>

            {/* Right Column */}
            <Grid
              item
              xs={12}
              md={6}
              sx={{
                pl: { md: 4 },
                wordBreak: "break-word",
                textAlign: "justify",
              }}
            >
              <Typography variant="h6" color="primary" gutterBottom>
                Summary
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {resume.summary}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" color="primary" gutterBottom>
                Skills
              </Typography>
              <Box display="flex" flexWrap="wrap" mb={2}>
                {resume.skills?.map((skill, i) => (
                  <Chip
                    key={i}
                    label={skill}
                    sx={{ m: 0.5, backgroundColor: "#e3f2fd", fontWeight: 500 }}
                  />
                ))}
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" color="primary" gutterBottom>
                Projects
              </Typography>
              {resume.projects?.map((project, index) => (
                <Box key={index} mb={2}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {project.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(project.startDate).toLocaleDateString()} -{" "}
                    {project.endDate
                      ? new Date(project.endDate).toLocaleDateString()
                      : "Present"}
                  </Typography>
                  <Typography variant="body2">{project.description}</Typography>
                  {project.link && (
                    <Typography variant="body2">
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "#1976d2", wordBreak: "break-word" }}
                      >
                        {project.link}
                      </a>
                    </Typography>
                  )}
                </Box>
              ))}

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" color="primary" gutterBottom>
                Certificates
              </Typography>
              {resume.certifications?.map((cert, index) => (
                <Box key={index} mb={2}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {cert.title}
                  </Typography>
                  <Typography variant="body2">{cert.issuer}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(cert.date).toLocaleDateString()}
                  </Typography>
                </Box>
              ))}

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" color="primary" gutterBottom>
                Languages
              </Typography>
              <Box display="flex" flexWrap="wrap" mb={2}>
                {resume.languages?.map((lang, i) => (
                  <Chip
                    key={i}
                    label={lang}
                    sx={{ m: 0.5, backgroundColor: "#f3e5f5", fontWeight: 500 }}
                  />
                ))}
              </Box>
              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" color="primary" gutterBottom>
                Hobbies
              </Typography>
              <Box display="flex" flexWrap="wrap" mb={2}>
                {resume.hobbies?.map((hobby, i) => (
                  <Chip
                    key={i}
                    label={hobby}
                    sx={{ m: 0.5, backgroundColor: "#e8f5e9", fontWeight: 500 }}
                  />
                ))}
              </Box>
            </Grid>
          </Grid>
        </CardContent>

        <Box display="flex" justifyContent="center" mt={4} flexDirection="column" alignItems="center">
        {isLoading ? (
          <CircularProgress color="primary" sx={{ mb: 2 }} />
        ) : (
          <Box
            className="pdf-hidden"
            display="flex"
            justifyContent="center"
            mt={4}
            gap={2}
          >
            <Button
              variant="contained"
              color="success"
              onClick={handleDownloadPDF}
              sx={{ px: 4, fontWeight: "bold" }}
            >
              Download PDF
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={handleDeleteResume}
              sx={{ px: 4, fontWeight: "bold" }}
            >
              Delete Resume
            </Button>
          </Box>
        )}
          </Box>
      </Card>
    </motion.div>
  );
};

export default ResumePreview;
