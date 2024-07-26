

"use client"
import React, { useEffect, useRef } from 'react';
import { useSummary } from '../SummaryContext';  // Import the context
import { useRouter } from 'next/navigation';
import { PDFDownloadLink } from '@react-pdf/renderer';
import PDFSummaryDocument from './pdfGenerator.js';  // Adjust the import path as necessary
import { db } from '@/firebase';
import { collection, addDoc } from 'firebase/firestore';
import {  IconButton } from '@mui/material';
import {
    Box,
  } from '@mui/material';
  import {
    AccountCircle
  } from '@mui/icons-material';

const SummaryPage = () => {
  const { summary } = useSummary();  // Destructure the summary from the context
  const router = useRouter();
  const summaryRef = useRef(null);

  useEffect(() => {
    // console.log('Summary in SummaryPage:', summary);  // Log the summary
  }, [summary]);

  const formatSummary = (text) => {
    return text
      .replace(/Patient Discharge Summary\s*/, '')
      .replace(/^(.*?:)/gm, '<b>$1</b>')
      .replace(/\*\*/g, '');
  };
  const saveSummaryToFirebase = async () => {
    try {
      console.log('Saving summary to Firebase...');
      await addDoc(collection(db, 'dischargeSummaries'), { summary });
      console.log('Summary saved successfully.');
    } catch (error) {
      console.error('Error saving summary to Firebase:', error);
    }
  };

  const handleEdit = () => {
    router.push('/homepage');  // Redirect to homepage
  };
  const handleLogout = () => {
    router.push('/');  // Redirect to login page
    localStorage.removeItem('formData');
  };

  return (
    <div style={styles.container}>
         <Box
        className="absolute right-2 top-0 !text-white "
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'flex-end',
            padding: 1,
          }}
        >
          <IconButton className='text-black gap-2' onClick={handleLogout}>
            <AccountCircle />
            Logout
          </IconButton>
        </Box>
      <div className='my-10' style={styles.summaryBox}>
        <h1 className='text-black text-center !text-4xl' style={styles.heading}>Discharge Summary</h1>
        <div
          id="summary-content"
          ref={summaryRef}
          style={styles.summaryContent}
          dangerouslySetInnerHTML={{ __html: formatSummary(summary) }}
        />
        <div style={styles.buttonContainer}>
          <PDFDownloadLink
            document={<PDFSummaryDocument summary={summary} />}
            fileName="discharge-summary.pdf"
            style={styles.button}
            onClick={saveSummaryToFirebase}
          >
            {({ blob, url, loading, error }) => (loading ? 'Loading document...' : 'Export as PDF')}
          </PDFDownloadLink>
          <button className='hover:bg-black' style={styles.button} onClick={handleEdit}>Edit</button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f2f5',
    padding: '20px'
  },
  summaryBox: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    maxWidth: '800px',
    width: '100%'
  },
  heading: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px'
  },
  summaryContent: {
    whiteSpace: 'pre-wrap', // To maintain the formatting of the summary text
    fontSize: '16px',
    color: "black"
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap:'10px',
    marginTop: '20px'
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: '#007bff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    textAlign: 'center'
  },
};

export default SummaryPage;
