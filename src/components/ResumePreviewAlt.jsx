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

const ResumePreviewAlt = ({ resume, onResumeDelete }) => {
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
    pdf.save("My_Resume_Alt.pdf");

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
          display: "flex",
          flexDirection: "row",
          borderRadius: 3,
          overflow: "hidden",
          width: "100%",
          maxWidth: "1000px",
          margin: "auto",
          boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
        }}
      >
        {/* Sidebar */}
        <Box
          sx={{
            backgroundColor: "#263238",
            color: "#ffffff",
            width: "35%",
            p: 3,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            textAlign: "justify",
          }}
        >
          <Box>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              {resume.name}
            </Typography>
            <Typography variant="subtitle1" color="gray.200" gutterBottom>
              {resume.title}
            </Typography>

            <Divider sx={{ my: 2, backgroundColor: "#455A64" }} />

            <Typography variant="subtitle2">Contact</Typography>
            <Typography variant="body2">{resume.email}</Typography>
            <Typography variant="body2">{resume.phone}</Typography>
            <Typography variant="body2" sx={{ wordBreak: "break-word" }}>
              {resume.github}
            </Typography>
            <Typography variant="body2">{resume.website}</Typography>

            <Divider sx={{ my: 2, backgroundColor: "#455A64" }} />

            <Typography variant="subtitle2">Skills</Typography>
            <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
              {resume.skills?.map((skill, i) => (
                <Chip key={i} label={skill} size="small" sx={{ bgcolor: "#546e7a", color: "white" }} />
              ))}
            </Box>

            <Divider sx={{ my: 2, backgroundColor: "#455A64" }} />

            <Typography variant="subtitle2">Languages</Typography>
            <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
              {resume.languages?.map((lang, i) => (
                <Chip key={i} label={lang} size="small" sx={{ bgcolor: "#37474f", color: "white" }} />
              ))}
            </Box>

            <Divider sx={{ my: 2, backgroundColor: "#455A64" }} />

            <Typography variant="subtitle2">Hobbies</Typography>
            <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
              {resume.hobbies?.map((hobby, i) => (
                <Chip key={i} label={hobby} size="small" sx={{ bgcolor: "#004d40", color: "white" }} />
              ))}
            </Box>

            <Divider sx={{ my: 2, backgroundColor: "#455A64" }} />

            <Typography variant="subtitle2"  gutterBottom>
            Education
          </Typography>
          {resume.education?.map((edu, index) => (
            <Box key={index} mb={2}>
              <Typography variant="subtitle1" fontWeight="bold">
                {edu.degree}
              </Typography>
              <Typography variant="body2">{edu.school}</Typography>
              <Typography variant="body2" >
                {new Date(edu.startDate).toLocaleDateString()} -{" "}
                {new Date(edu.endDate).toLocaleDateString()}
              </Typography>
            </Box>
          ))}
          </Box>
        </Box>

        {/* Content Area */}
        <CardContent sx={{ width: "65%", p: 4 , textAlign: "justify", }}>
          <Typography variant="h6" color="primary" gutterBottom>
            Summary
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            {resume.summary}
          </Typography>

         

          

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
                {exp.endDate ? new Date(exp.endDate).toLocaleDateString() : "Present"}
              </Typography>
              <Typography variant="body2">{exp.description}</Typography>
            </Box>
          ))}

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
                {project.endDate ? new Date(project.endDate).toLocaleDateString() : "Present"}
              </Typography>
              <Typography variant="body2">{project.description}</Typography>
              {project.link && (
                <Typography variant="body2">
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#1976d2" }}
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

          {isLoading ? (
            <CircularProgress sx={{ mt: 4 }} />
          ) : (
            <Box
              className="pdf-hidden"
              display="flex"
              justifyContent="center"
              mt={4}
              gap={2}
            >
              <Button variant="contained" color="success" onClick={handleDownloadPDF}>
                Download PDF
              </Button>
              <Button variant="outlined" color="error" onClick={handleDeleteResume}>
                Delete Resume
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ResumePreviewAlt;
