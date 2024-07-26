import React from 'react';
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';

const PDFSummaryDocument = ({ summary }) => {
  // Function to format the summary text into sections
  const formatSummarySections = (text) => {
    return text
      .replace(/Patient Discharge Summary\s*/, '')
      .split('\n\n')
      .map((section, index) => (
        <Text key={index} style={styles.section}>
          {section.replace(/^(.*?):/, (match, p1) => `\n${p1.toUpperCase()}:\n`)}
        </Text>
      ));
  };

  return (
    <Document>
      <Page style={styles.body}>
        <Text style={styles.title}>Discharge Summary</Text>
        <View style={styles.content}>
          {formatSummarySections(summary)}
        </View>
      </Page>
    </Document>
  );
};

const styles = StyleSheet.create({
  body: {
    padding: 20,
    fontSize: 12,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
  content: {
    marginBottom: 20,
  },
  section: {
    marginBottom: 10,
  },
});
  
export default PDFSummaryDocument;
