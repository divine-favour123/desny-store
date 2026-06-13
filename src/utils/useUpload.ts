import React from 'react';
import { supabase } from '@/lib/supabase';

interface UploadInput {
  file?: File;
  url?: string;
}

interface UploadResult {
  url?: string;
  mimeType?: string | null;
  error?: string;
}

interface UploadHookResult {
  loading: boolean;
}

function useUpload(): [(input: UploadInput) => Promise<UploadResult>, UploadHookResult] {
  const [loading, setLoading] = React.useState(false);

  const upload = React.useCallback(async (input: UploadInput): Promise<UploadResult> => {
    try {
      setLoading(true);

      if (input.file) {
        const file = input.file;
        const ext = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

        const { data, error } = await supabase.storage
          .from('product-images')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false,
          });

        if (error) {
          return { error: error.message };
        }

        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(data.path);

        return { url: publicUrl, mimeType: file.type };
      }

      return { error: 'No file provided' };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Upload failed' };
    } finally {
      setLoading(false);
    }
  }, []);

  return [upload, { loading }];
}

export default useUpload;
