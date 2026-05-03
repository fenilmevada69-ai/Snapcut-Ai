import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { uploadToCloudinary } from '@/src/services/cloudinary';
import { triggerProcessingWorkflow } from '@/src/services/ai';
import { supabase } from '@/src/services/supabase';
import { useAuthStore } from '@/src/store/authStore';
import { toast } from 'sonner';

export function UploadArea({ onComplete }: { onComplete: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const { user } = useAuthStore();

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const pastedFile = items[i].getAsFile();
          if (pastedFile) {
            if (pastedFile.size > 10 * 1024 * 1024) {
              toast.error('File size exceeds 10MB limit');
              return;
            }
            setFile(pastedFile);
            setPreview(URL.createObjectURL(pastedFile));
            break;
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile) {
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast.error('File size exceeds 10MB limit');
        return;
      }
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
    maxFiles: 1,
    multiple: false,
  } as any);

  const clearFile = () => {
    setFile(null);
    setPreview(null);
  };

  const handleUpload = async () => {
    if (!file || !user) return;

    setIsUploading(true);
    try {
      // 1. Create record in Supabase
      const { data: uploadRecord, error: dbError } = await supabase
        .from('uploads')
        .insert({
          user_id: user.id,
          file_name: file.name,
          file_size: file.size,
          status: 'pending',
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        })
        .select()
        .single();

      if (dbError) throw dbError;

      // 2. Upload to Cloudinary
      const originalUrl = await uploadToCloudinary(file);

      // 3. Update Supabase with original URL
      await supabase
        .from('uploads')
        .update({ original_url: originalUrl, status: 'processing' })
        .eq('id', uploadRecord.id);

      // 4. Trigger n8n Workflow
      const response = await triggerProcessingWorkflow({
        userId: user.id,
        file: file,
        uploadId: uploadRecord.id,
      });

      // 5. Update Supabase with the returned URL if n8n processes synchronously
      if (response && response.url) {
        const completedRecord = { ...uploadRecord, result_url: response.url, status: 'completed' };
        
        await supabase
          .from('uploads')
          .update({ result_url: response.url, status: 'completed' })
          .eq('id', uploadRecord.id);
          
        // Immediately save to local storage for persistence
        const localKey = `snapcut_uploads_${user.id}`;
        const existingLocal = JSON.parse(localStorage.getItem(localKey) || '[]');
        // Prepend new record or update existing
        const updatedLocal = [completedRecord, ...existingLocal.filter((item: any) => item.id !== uploadRecord.id)];
        localStorage.setItem(localKey, JSON.stringify(updatedLocal));

        toast.success('Image processed successfully!');
      } else {
        toast.success('Processing started! Your image will be ready shortly.');
      }

      clearFile();
      onComplete();
    } catch (error: any) {
      console.error('Upload Error:', error);
      
      let errorMessage = 'Processing failed. Please try again.';
      
      // Cloudinary error format
      if (error?.response?.data?.error?.message) {
        errorMessage = `Cloudinary: ${error.response.data.error.message}`;
      } 
      // General Axios error format
      else if (error?.response?.data?.message) {
        errorMessage = `Server: ${error.response.data.message}`;
      } 
      else if (error?.message) {
        errorMessage = error.message;
      }

      const errorUrl = error?.config?.url ? `\nFailed URL: ${new URL(error.config.url).hostname}` : '';
      toast.error(`Error: ${errorMessage}${errorUrl}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="p-10 border-dashed border border-white/10 bg-white/[0.01] flex flex-col items-center justify-center min-h-[400px] rounded-[32px]">
      {!file ? (
        <div 
          {...getRootProps()} 
          className={`w-full h-full flex flex-col items-center justify-center cursor-pointer transition-all duration-300 py-12 ${isDragActive ? 'bg-primary/5 scale-[0.99] border-primary/50' : 'hover:bg-white/[0.02]'}`}
        >
          <input {...getInputProps()} />
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
            <Upload className="w-6 h-6 text-muted-foreground" />
          </div>
          <h3 className="text-2xl font-display font-bold mb-3 tracking-tight">Drop image here</h3>
          <p className="text-muted-foreground text-sm text-center max-w-xs leading-relaxed">
            Upload high-resolution assets up to 10MB. <br/>
            Supported formats: JPG, PNG, WEBP.
          </p>
          <Button type="button" onClick={open} variant="outline" className="mt-10 h-11 px-8 rounded-full border-white/10 font-bold hover:bg-white/5">
            Select from device
          </Button>
        </div>
      ) : (
        <div className="w-full space-y-8">
          <div className="relative aspect-auto max-h-[300px] w-full max-w-md mx-auto rounded-2xl overflow-hidden border border-white/10 group bg-black/40">
            <img src={preview!} alt="Preview" className="w-full h-full object-contain p-4" />
            <button 
              onClick={clearFile}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex flex-col items-center gap-6">
            <div className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-muted-foreground">
              <span className="truncate max-w-[200px] text-white">{file.name}</span>
              <span className="w-1 h-1 rounded-full bg-white/10" />
              <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
            </div>
            
            <div className="flex gap-3 w-full max-w-xs">
              <Button 
                className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold h-12 rounded-full glow-sm"
                onClick={handleUpload}
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Process Image'
                )}
              </Button>
              <Button variant="ghost" className="h-12 px-6 rounded-full text-muted-foreground hover:text-white" onClick={clearFile} disabled={isUploading}>
                Discard
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
