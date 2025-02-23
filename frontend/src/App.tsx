import { Container, Typography, Button, Box, Grid } from '@mui/material';
import BlobList, { SelectedBlob } from './components/BlobList';
import PromptEditor from './components/PromptEditor';
import { useState } from 'react';

function App() {
  const [selectedBlobs, setSelectedBlobs] = useState<SelectedBlob[]>([]);

  // Azure Function URLs
  const azureFunctionUrls = {
    processUploads: '/api/processUploads',
    callAoai: '/api/callAoai'
  };

  // Generic function to call Azure Functions
  const callAzureFunction = async (url: string) => {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ blobs: selectedBlobs })
      });

      const responseText = await response.text();
      const data = responseText ? JSON.parse(responseText) : {};

      if (!response.ok) {
        console.error('Azure Function response:', data);
        alert(`Error: ${data.errors?.join('\n') || 'Unknown error'}`);
      } else {
        console.log('Azure Function response:', data);
        alert(`Azure Function completed successfully! Processed files: ${data.processedFiles?.join(', ')}`);
      }
    } catch (error) {
      console.error('Error calling Azure Function:', error);
      alert(`Error: ${error}`);
    }
  };

  return (
    <Container maxWidth={false} disableGutters sx={{ textAlign: 'center', py: 0 }}>
      <Box
        sx={{
          backgroundColor: '#0A1F44',
          color: 'white',
          py: 3,
          px: 2,
          textAlign: 'center',
          boxShadow: 3,
        }}
      >
        <Typography variant="h4" gutterBottom>
          AI Document Processor
        </Typography>

        {/* Two buttons at the top */}
        <Box display="flex" justifyContent="center" gap={2} marginTop={2}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => callAzureFunction(azureFunctionUrls.processUploads)}
          >
            Extract Text
          </Button>

          <Button 
            variant="contained" 
            color="secondary" 
            onClick={() => callAzureFunction(azureFunctionUrls.callAoai)}
          >
            Call AOAI
          </Button>
        </Box>
      </Box>

      {/* Two-column layout */}
      <Grid container spacing={2}>
        {/* Left column: Blob viewer */}
        <Grid item xs={12} md={6}>
          <BlobList onSelectionChange={setSelectedBlobs} />
        </Grid>

        {/* Right column: Prompt Editor */}
        <Grid item xs={12} md={6}>
          <PromptEditor />
        </Grid>
      </Grid>
    </Container>
  );
}

export default App;
