import axios from 'axios';

const N8N_WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL;

export interface WorkflowPayload {
  userId: string;
  file: File;
  uploadId: string;
}

export async function triggerProcessingWorkflow(payload: WorkflowPayload) {
  const formData = new FormData();
  formData.append('userId', payload.userId);
  formData.append('uploadId', payload.uploadId);
  formData.append('file', payload.file);

  const response = await axios.post(N8N_WEBHOOK_URL, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}
