import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Container,
  IconButton,
  Autocomplete,
  CircularProgress,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import api from "../services/api";

const ResumeForm = () => {
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const initialData = location.state?.resume || null;
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    name: "",
    title: "",
    email: "",
    phone: "",
    address: "",
    github: "",
    website: "",
    summary: "",
    experiences: [
      {
        company: "",
        position: "",
        startDate: "",
        endDate: "",
        description: "",
      },
    ],
    projects: [
      {
        title: "",
        description: "",
        startDate: "",
        endDate: "",
        technologies: [],
      },
    ],
    education: [{ school: "", degree: "", startDate: "", endDate: "" }],
    certifications: [{ title: "", issuer: "", date: "" }],
    skills: [],
    languages: [],
    hobbies: [],
  });

  const skillOptions = [
    "HTML",
    "CSS",
    "Bootstrap",
    "JavaScript",
    "React JS",
    "Node JS",
    "Express JS",
    "MongoDB",
    "SQL",
    "Spring Boot",
    "SQL Server",
    "Python",
    "Java",
    "PHP",
    "C",
    "C++",
    "C#",
    "Ruby",
    "Swift",
    "Kotlin",
    "Dart",
    "Flutter",
    "Android",
    "iOS",
    "Machine Learning",
    "Deep Learning",
    "Data Science",
    "Artificial Intelligence",
    "Cloud Computing",
    "DevOps",
    "Cyber Security",
    "Blockchain",
    "Internet of Things",
    "AR/VR",
    "Game Development",
    "UI/UX Design",
    "Graphic Design",
    "Digital Marketing",
    "SEO",
    "Content Writing",
    "Social Media Marketing",
    "Email Marketing",
    "Affiliate Marketing",
    "PPC",
    "Google Ads",
    "React Native",
    "Angular",
    "Vue JS",
    "SASS",
    "Material UI",
    "Tailwind CSS",
    "jQuery",
    "DBMS",
    "OOPS",
    "Data Structures",
    "J2EE",
    "JSP",
    "Servlets",
    "Spring MVC",
    ".Net",
    "ASP.NET",
  ];

  const languageOptions = [
    "Hindi",
    "Gujarati",
    "English",
    "Marathi",
    "Bengali",
    "Punjabi",
    "Tamil",
    "Telugu",
    "Malayalam",
    "Kannada",
    "Urdu",
    "Odia",
    "Assamese",
    "Maithili",
    "Sanskrit",
    "Dogri",
    "Manipuri",
    "Bodo",
    "Santhali",
    "Kashmiri",
    "Sindhi",
    "Nepali",
    "Bhili/Bhilodi",
    "Santali",
  ];

  const hobbyOptions = [
    "Trading",
    "Dancing",
    "Learning",
    "Music",
    "Reading",
    "Writing",
    "Cooking",
    "Traveling",
    "Photography",
    "Gardening",
    "Gaming",
    "Sports",
    "Fitness",
    "Yoga",
    "Meditation",
    "Painting",
    "Drawing",
    "Crafting",
    "Volunteering",
    "Blogging",
    "Podcasting",
    "Coding",
    "Hiking",
    "Cycling",
    "Fishing",
    "Camping",
    "Surfing",
    "Skiing",
    "Snowboarding",
    "Rock Climbing",
    "Martial Arts",
    "Karate",
    "Taekwondo",
    "Judo",
    "Boxing",
    "Wrestling",
  ];

  const handleInputChange = (e, section, index, field) => {
    const value = e.target.value;
    const updatedSection = [...formData[section]];
    updatedSection[index] = { ...updatedSection[index], [field]: value };
    setFormData({ ...formData, [section]: updatedSection });
  };

  const handleAddSection = (section, newItem) => {
    setFormData({ ...formData, [section]: [...formData[section], newItem] });
  };

  const handleRemoveSection = (section, index) => {
    const updated = [...formData[section]];
    updated.splice(index, 1);
    setFormData({ ...formData, [section]: updated });
  };

  useEffect(() => {
    if (initialData) {
      const formattedData = JSON.parse(JSON.stringify(initialData));
      const formatDate = (dateStr) =>
        !dateStr ? "" : new Date(dateStr).toISOString().split("T")[0];

      formattedData.experiences = formattedData.experiences?.map((exp) => ({
        ...exp,
        startDate: formatDate(exp.startDate),
        endDate: formatDate(exp.endDate),
      }));

      formattedData.projects = formattedData.projects?.map((proj) => ({
        ...proj,
        startDate: formatDate(proj.startDate),
        endDate: formatDate(proj.endDate),
      }));

      formattedData.education = formattedData.education?.map((edu) => ({
        ...edu,
        startDate: formatDate(edu.startDate),
        endDate: formatDate(edu.endDate),
      }));

      formattedData.certifications =
        formattedData.certifications?.map((cert) => ({
          ...cert,
          date: formatDate(cert.date),
        })) || [];

      setFormData(formattedData);
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix validation errors.");
      return;
    }

    try {
      if (initialData && initialData._id) {
        setLoading(true);
        await api.put(`/api/resume/${initialData._id}`, formData);
        toast.success("Resume updated successfully!");

        setLoading(false);
      } else {
        setLoading(true);
        await api.post("/api/resume", formData);
        toast.success("Resume created successfully!");
      }
      navigate("/dashboard");
    } catch (error) {
      toast.error("Error saving resume.");
      console.error(error);
    }
  };

  const renderSection = (section, labelFields) => (
    <>
      <Typography variant="h6" mt={3} mb={1}>
        {section.charAt(0).toUpperCase() + section.slice(1)}
      </Typography>
      {formData[section].map((item, index) => (
        <Box
          key={index}
          sx={{ border: "1px solid #ccc", p: 2, mb: 2, borderRadius: 2 }}
        >
          {labelFields.map(({ field, label, type }) => (
            <TextField
              key={field}
              fullWidth
              label={label}
              type={type || "text"}
              value={item[field]}
              onChange={(e) => handleInputChange(e, section, index, field)}
              margin="normal"
              InputLabelProps={type === "date" ? { shrink: true } : {}}
              required
              error={!!errors[section]?.[index]}
              helperText={
                field === "endDate" && errors[section]?.[index]
                  ? errors[section][index]
                  : ""
              }
            />
          ))}
          <IconButton
            onClick={() => handleRemoveSection(section, index)}
            color="error"
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ))}
      <Button
        onClick={() =>
          handleAddSection(
            section,
            labelFields.reduce((acc, cur) => ({ ...acc, [cur.field]: "" }), {})
          )
        }
        startIcon={<AddIcon />}
        variant="outlined"
        sx={{ mb: 2 }}
      >
        Add {section}
      </Button>
    </>
  );

  const validateForm = () => {
    const newErrors = {};

    // Required fields
    ["name", "title", "email", "phone", "address"].forEach((field) => {
      if (!formData[field]) newErrors[field] = "This field is required";
    });

    // Email format
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email";
    }

    // Phone number format (basic)
    if (formData.phone && !/^[6-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = "Enter a valid 10-digit phone number";
    }

    // Date logic for experience and projects
    const checkDates = (section) => {
      formData[section]?.forEach((item, i) => {
        if (item.startDate && item.endDate && item.startDate > item.endDate) {
          if (!newErrors[section]) newErrors[section] = {};
          newErrors[section][i] = "End date must be after start date";
        }
      });
    };

    checkDates("experiences");
    checkDates("projects");
    checkDates("education");

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          {initialData ? "Update Resume" : "Create Your Resume"}
        </Typography>

        <form onSubmit={handleSubmit}>
          {[
            "name",
            "title",
            "email",
            "phone",
            "address",
            "github",
            "website",
            "summary",
          ].map((field) => (
            <TextField
              key={field}
              fullWidth
              label={field.charAt(0).toUpperCase() + field.slice(1)}
              value={formData[field]}
              onChange={(e) =>
                setFormData({ ...formData, [field]: e.target.value })
              }
              margin="normal"
              required
              error={!!errors[field]}
              helperText={errors[field]}
            />
          ))}

          <Autocomplete
            multiple
            options={skillOptions}
            value={formData.skills}
            onChange={(e, value) => setFormData({ ...formData, skills: value })}
            renderInput={(params) => (
              <TextField {...params} label="Skills" margin="normal" />
            )}
          />

          <Autocomplete
            multiple
            options={languageOptions}
            value={formData.languages}
            onChange={(e, value) =>
              setFormData({ ...formData, languages: value })
            }
            renderInput={(params) => (
              <TextField {...params} label="Languages" margin="normal" />
            )}
          />

          <Autocomplete
            multiple
            options={hobbyOptions}
            value={formData.hobbies}
            onChange={(e, value) =>
              setFormData({ ...formData, hobbies: value })
            }
            renderInput={(params) => (
              <TextField {...params} label="Hobbies" margin="normal" />
            )}
          />

          {renderSection("experiences", [
            { field: "company", label: "Company" },
            { field: "position", label: "Position" },
            { field: "startDate", label: "Start Date", type: "date" },
            { field: "endDate", label: "End Date", type: "date" },
            { field: "description", label: "Description" },
          ])}

          {renderSection("projects", [
            { field: "title", label: "Title" },
            { field: "description", label: "Description" },
            { field: "startDate", label: "Start Date", type: "date" },
            { field: "endDate", label: "End Date", type: "date" },
          ])}

          {renderSection("education", [
            { field: "school", label: "School" },
            { field: "degree", label: "Degree" },
            { field: "startDate", label: "Start Date", type: "date" },
            { field: "endDate", label: "End Date", type: "date" },
          ])}

          {renderSection("certifications", [
            { field: "title", label: "Title" },
            { field: "issuer", label: "Issuer" },
            { field: "date", label: "Date", type: "date" },
          ])}

          {loading ? (
            <CircularProgress color="primary" className="mt-2"/>
          ) : (
            <>

           
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 3 }}
            >
              {initialData ? "Update Resume" : "Create Resume"}
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="success"
              fullWidth
              sx={{ mt: 3 }}
              onClick={() => navigate('/dashboard')}
            >
              Back To Dashboard
            </Button>
            </>
          )}
        </form>
      </Box>
    </Container>
  );
};

export default ResumeForm;
