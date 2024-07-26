
"use client"
import React, { useState,useEffect } from 'react';
import { db } from '@/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useSummary } from '../SummaryContext';
import { CircularProgress, IconButton } from '@mui/material';
import {
  TextField,
  Grid,
  Box,
  Container,
  Typography,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  InputAdornment,
  Select,
  MenuItem,
} from '@mui/material';
import {
  AccountCircle,
  Email,
  CalendarToday,
  MedicalServices,
  PermIdentity,
  ContactPhone,
  ExpandMore,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation'

const ModernInputForm = () => {
    
    const router = useRouter();
    const { setSummary } = useSummary();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "",
        dob: "",
        gender: "",
        patientId: "",
        contactInfo: "",
        admissionDate: "",
        admissionTime: "",
        reasonForAdmission: "",
        admittingDiagnosis: "",
        roomWard: "",
        attendingPhysician: "",
        consultingPhysicians: "",
        surgicalProcedures: "",
        datesOfProcedures: "",
        diagnosticTests: "",
        testResults: "",
        pastMedicalHistory: "",
        allergies: "",
        currentMedications: "",
        familyHistory: "",
        dailyProgressNotes: "",
        majorEvents: "",
        changesInDiagnosis: "",
        responseToTreatment: "",
        dischargeDate: "",
        dischargeTime: "",
        dischargeDiagnosis: "",
        conditionAtDischarge: "",
        dischargeInstructions: "",
        medicationsAtDischarge: "",
        followUpAppointments: "",
        homeCareInstructions: "",
        warningSigns: "",
        contactForQuestions: "",
        attendingPhysicianSignature: "",
        nurseSignature: "",
        patientSignature: "",
      });
      useEffect(() => {
        const savedFormData = localStorage.getItem('formData');
        if (savedFormData) {
          console.log('Loading formData from localStorage:', JSON.parse(savedFormData));
          setFormData(JSON.parse(savedFormData));
        }
      }, []);

      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => {
            const updatedFormData = { ...prev, [name]: value };
            // console.log('Updating formData:', updatedFormData);
            localStorage.setItem('formData', JSON.stringify(updatedFormData)); // Save to local storage on change
            return updatedFormData;
          });
      };
      const handleLogout = () => {
        router.push('/');  // Redirect to login page
        localStorage.removeItem('formData');
      };
      const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        for (let key in formData) {
            if (formData[key] === "") {
                alert(`Please fill in the ${key} field`);
                return;
            }
        }
        // Remove empty fields
        const cleanedData = Object.fromEntries(
            Object.entries(formData).filter(([key, value]) => key && value !== "")
        );
        const prompt = `
        Generate a discharge summary based on the following patient information the response should in the same order as given, also add a little description with each heading:
        - Admission Date: ${cleanedData.admissionDate}
        - Discharge Date: ${cleanedData.dischargeDate}
        - Admission Diagnoses: ${cleanedData.admittingDiagnosis}
        - Discharge Diagnoses: ${cleanedData.dischargeDiagnosis}
        - Consults: ${cleanedData.consultingPhysicians}
        - Procedures: ${cleanedData.surgicalProcedures}
        - History of Present Illness (HPI): ${cleanedData.pastMedicalHistory}
        - Hospital Course: ${cleanedData.dailyProgressNotes}
        - Discharge To: ${cleanedData.homeCareInstructions}
        - Discharge Condition: ${cleanedData.conditionAtDischarge}
        - Discharge Medications: ${cleanedData.currentMedications}
        - Discharge Instructions: ${cleanedData.dischargeInstructions}
        - Pending Labs: ${cleanedData.testResults}
        - Follow-Up: ${cleanedData.followUpAppointments}
        - Copy To: ${cleanedData.contactForQuestions}
    `;

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                model: "gpt-4",
                messages: [
                    {
                        role: "system",
                        content: "You are a medical assistant generating a discharge summary."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                max_tokens: 2048, // Adjust the number of tokens based on your needs
            }),
        });

        const data = await response.json();

        if (response.ok) {
            const generatedSummary = data.choices[0].message.content.trim();
            // console.log('Generated summary:', generatedSummary);

            // Save to Firestore
            await addDoc(collection(db, 'dischargeSummaries'), {
                ...cleanedData,
                generatedSummary,
            });
            setSummary(data.choices[0].message.content.trim());  // Set the summary data in context
            router.push('/summary');
        } else {
            console.error('Error generating summary:', data.error);
        }
    } catch (error) {
        console.error('Error submitting discharge summary: ', error);
    }finally {
        setLoading(false);
      }
};

  return (
    <Container className='!py-20'  maxWidth="md">
        <Box
        className="absolute right-2 top-0 !text-white "
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'flex-end',
            padding: 1,
          }}
        >
          <IconButton className='text-white gap-2' onClick={handleLogout}>
            <AccountCircle />
            Logout
          </IconButton>
        </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: 3,
          backgroundColor: 'white',
          boxShadow: 3,
          borderRadius: 10,
        }}
        className='bg-[#8cc6e9]'
      >
        
        <Typography className='text-4xl font-bold text-black' component="h1" variant="h5">
          Discharge Summary
        </Typography>
        <Box  component="form" noValidate sx={{ mt: 3 }} onSubmit={handleSubmit}>
          <Accordion  className='bg-[#8cc6e9] mb-2'>
            <AccordionSummary  className='py-3  bg-white' expandIcon={<ExpandMore />}>
              <Typography className='text-xl font-semibold'>Patient Information</Typography>
            </AccordionSummary>
            <AccordionDetails className='py-6 bg-white border-t-[#dfd7d7] border-2 '>
              <Grid  container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="fullName"
                    required
                    fullWidth
                    id="fullName"
                    label="Full Name"
                    autoFocus
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AccountCircle />
                        </InputAdornment>
                      ),
                    }}
                    value={formData.fullName}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="dob"
                    fullWidth
                    id="dob"
                    label="Date of Birth"
                    type="date"
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    // InputProps={{
                    //   startAdornment: (
                    //     <InputAdornment position="start">
                    //       <CalendarToday />
                    //     </InputAdornment>
                    //   ),
                    // }}
                    value={formData.dob}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Select
                    required
                    fullWidth
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    displayEmpty
                    variant="outlined"
                    inputProps={{ 'aria-label': 'Gender' }}
                  >
                    <MenuItem value="" disabled>
                      <PermIdentity /> Gender
                    </MenuItem>
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="patientId"
                    label="Patient ID"
                    name="patientId"
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PermIdentity />
                        </InputAdornment>
                      ),
                    }}
                    value={formData.patientId}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="contactInfo"
                    label="Contact Information"
                    name="contactInfo"
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <ContactPhone />
                        </InputAdornment>
                      ),
                    }}
                    value={formData.contactInfo}
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          <Accordion className='bg-[#8cc6e9] mb-2'>
            <AccordionSummary className='py-3 bg-white ' expandIcon={<ExpandMore />}>
              <Typography className='text-xl font-semibold'>Admission Details</Typography>
            </AccordionSummary>
            <AccordionDetails className='py-6 bg-white border-t-[#dfd7d7] border-2 '>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="admissionDate"
                    required
                    fullWidth
                    id="admissionDate"
                    label="Admission Date"
                    type="date"
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="admissionTime"
                    required
                    fullWidth
                    id="admissionTime"
                    label="Admission Time"
                    type="time"
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="reasonForAdmission"
                    label="Reason for Admission"
                    name="reasonForAdmission"
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <MedicalServices />
                        </InputAdornment>
                      ),
                    }}
                    value={formData.reasonForAdmission}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="admittingDiagnosis"
                    label="Admitting Diagnosis"
                    name="admittingDiagnosis"
                    variant="outlined"
                    value={formData.admittingDiagnosis}
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          <Accordion className='bg-[#8cc6e9] mb-2'>
            <AccordionSummary className='py-3  bg-white ' expandIcon={<ExpandMore />}>
              <Typography className='text-xl font-semibold'>Hospital Stay Information</Typography>
            </AccordionSummary>
            <AccordionDetails className='py-6 bg-white border-t-[#dfd7d7] border-2 '>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="roomWard"
                    label="Room/Ward"
                    name="roomWard"
                    variant="outlined"
                    value={formData.roomWard}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="attendingPhysician"
                    label="Attending Physician"
                    name="attendingPhysician"
                    variant="outlined"
                    value={formData.attendingPhysician}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="consultingPhysicians"
                    label="Consulting Physicians"
                    name="consultingPhysicians"
                    variant="outlined"
                    value={formData.consultingPhysicians}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="surgicalProcedures"
                    label="Surgical Procedures"
                    name="surgicalProcedures"
                    variant="outlined"
                    value={formData.surgicalProcedures}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="datesOfProcedures"
                    label="Dates of Procedures"
                    name="datesOfProcedures"
                    variant="outlined"
                    value={formData.datesOfProcedures}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="diagnosticTests"
                    label="Diagnostic Tests Conducted"
                    name="diagnosticTests"
                    variant="outlined"
                    value={formData.diagnosticTests}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="testResults"
                    label="Results of Major Tests"
                    name="testResults"
                    variant="outlined"
                    value={formData.testResults}
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          <Accordion className='bg-[#8cc6e9] mb-2'>
            <AccordionSummary className='py-3  bg-white ' expandIcon={<ExpandMore />}>
              <Typography className='text-xl font-semibold'>Medical History</Typography>
            </AccordionSummary>
            <AccordionDetails className='py-6 bg-white border-t-[#dfd7d7] border-2 '>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="pastMedicalHistory"
                    label="Past Medical History"
                    name="pastMedicalHistory"
                    variant="outlined"
                    multiline
                    rows={3}
                    value={formData.pastMedicalHistory}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="allergies"
                    label="Allergies"
                    name="allergies"
                    variant="outlined"
                    multiline
                    rows={2}
                    value={formData.allergies}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="currentMedications"
                    label="Current Medications"
                    name="currentMedications"
                    variant="outlined"
                    multiline
                    rows={3}
                    value={formData.currentMedications}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="familyHistory"
                    label="Family History"
                    name="familyHistory"
                    variant="outlined"
                    multiline
                    rows={2}
                    value={formData.familyHistory}
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          <Accordion className='bg-[#8cc6e9] mb-2'>
            <AccordionSummary className='py-3  bg-white ' expandIcon={<ExpandMore />}>
              <Typography className='text-xl font-semibold'>Clinical Course</Typography>
            </AccordionSummary>
            <AccordionDetails className='py-6 bg-white border-t-[#dfd7d7] border-2 '>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="dailyProgressNotes"
                    label="Daily Progress Notes"
                    name="dailyProgressNotes"
                    variant="outlined"
                    multiline
                    rows={3}
                    value={formData.dailyProgressNotes}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="majorEvents"
                    label="Major Events/Interventions During Hospital Stay"
                    name="majorEvents"
                    variant="outlined"
                    multiline
                    rows={3}
                    value={formData.majorEvents}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="changesInDiagnosis"
                    label="Changes in Diagnosis"
                    name="changesInDiagnosis"
                    variant="outlined"
                    multiline
                    rows={2}
                    value={formData.changesInDiagnosis}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="responseToTreatment"
                    label="Response to Treatment"
                    name="responseToTreatment"
                    variant="outlined"
                    multiline
                    rows={2}
                    value={formData.responseToTreatment}
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          <Accordion className='bg-[#8cc6e9] mb-2'>
            <AccordionSummary className='py-3  bg-white ' expandIcon={<ExpandMore />}>
              <Typography className='text-xl font-semibold'>Discharge Information</Typography>
            </AccordionSummary>
            <AccordionDetails className='py-6 bg-white border-t-[#dfd7d7] border-2 '>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                  name="dischargeDate"
                    required
                    fullWidth
                    id="dischargeDate"
                    label="Discharge Date"
                    type="date"
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="dischargeTime"
                    required
                    fullWidth
                    id="dischargeTime"
                    label="Discharge Time"
                    type="time"
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="dischargeDiagnosis"
                    label="Discharge Diagnosis"
                    name="dischargeDiagnosis"
                    variant="outlined"
                    multiline
                    rows={2}
                    value={formData.dischargeDiagnosis}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="conditionAtDischarge"
                    label="Condition at Discharge"
                    name="conditionAtDischarge"
                    variant="outlined"
                    multiline
                    rows={2}
                    value={formData.conditionAtDischarge}
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          <Accordion className='bg-[#8cc6e9] mb-2'>
            <AccordionSummary className='py-3 bg-white ' expandIcon={<ExpandMore />}>
              <Typography className='text-xl font-semibold'>Discharge Instructions</Typography>
            </AccordionSummary>
            <AccordionDetails className='py-6 bg-white border-t-[#dfd7d7] border-2 '>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="dischargeInstructions"
                    label="Discharge Instructions"
                    name="dischargeInstructions"
                    variant="outlined"
                    multiline
                    rows={3}
                    value={formData.dischargeInstructions}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="medicationsAtDischarge"
                    label="Medications at Discharge"
                    name="medicationsAtDischarge"
                    variant="outlined"
                    multiline
                    rows={2}
                    value={formData.medicationsAtDischarge}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="followUpAppointments"
                    label="Follow-up Appointments"
                    name="followUpAppointments"
                    variant="outlined"
                    multiline
                    rows={2}
                    value={formData.followUpAppointments}
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          <Accordion className='bg-[#8cc6e9] mb-2'>
            <AccordionSummary className='py-3  bg-white ' expandIcon={<ExpandMore />}>
              <Typography className='text-xl font-semibold'>Patient Education</Typography>
            </AccordionSummary>
            <AccordionDetails className='py-6 bg-white border-t-[#dfd7d7] border-2 '>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="homeCareInstructions"
                    label="Instructions for Home Care"
                    name="homeCareInstructions"
                    variant="outlined"
                    multiline
                    rows={3}
                    value={formData.homeCareInstructions}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="warningSigns"
                    label="Warning Signs/Symptoms to Watch For"
                    name="warningSigns"
                    variant="outlined"
                    multiline
                    rows={2}
                    value={formData.warningSigns}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="contactForQuestions"
                    label="Contact Information for Questions or Emergencies"
                    name="contactForQuestions"
                    variant="outlined"
                    multiline
                    rows={2}
                    value={formData.contactForQuestions}
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          <Accordion className='bg-[#8cc6e9] mb-2 '>
            <AccordionSummary className='py-3  bg-white ' expandIcon={<ExpandMore />}>
              <Typography className='text-xl font-semibold'>Signatures</Typography>
            </AccordionSummary>
            <AccordionDetails className='py-6 bg-white border-t-[#dfd7d7] border-2 '>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    id="attendingPhysicianSignature"
                    label="Attending Physician Signature"
                    name="attendingPhysicianSignature"
                    variant="outlined"
                    value={formData.attendingPhysicianSignature}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    id="nurseSignature"
                    label="Nurse Signature"
                    name="nurseSignature"
                    variant="outlined"
                    value={formData.nurseSignature}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    id="patientSignature"
                    label="Patient/Guardian Signature"
                    name="patientSignature"
                    variant="outlined"
                    value={formData.patientSignature}
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          <Button
    className='py-3 text-xl font-semibold'
    type="submit"
    fullWidth
    variant="contained"
    onClick={handleSubmit}
    sx={{ mt: 3, mb: 2 }}
    disabled={loading} // Disable the button while loading
>
    {loading ? (
        <>
            
            Generating...
            <CircularProgress size={24} sx={{ color: 'white', marginRight: '10px' }} />
        </>
    ) : (
        'Generate Summary'
    )}
</Button>
        </Box>
      </Box>
    </Container>
  );
};

export default ModernInputForm;



