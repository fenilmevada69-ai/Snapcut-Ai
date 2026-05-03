# SnapCut AI Resources

## Supabase Database Schema

Run these SQL commands in your Supabase SQL Editor:

```sql
-- 1. Profiles Table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  user_id UUID UNIQUE NOT NULL DEFAULT auth.uid(),
  full_name TEXT,
  avatar_url TEXT,
  credits INTEGER DEFAULT 5,
  subscription_status TEXT DEFAULT 'free',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  PRIMARY KEY (id)
);

-- 2. Uploads Table
CREATE TABLE uploads (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  original_url TEXT,
  result_url TEXT,
  status TEXT DEFAULT 'pending',
  file_name TEXT,
  file_size BIGINT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE
);

-- 3. Credits Transactions
CREATE TABLE transactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  amount INTEGER NOT NULL,
  type TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- RLS Rules
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

ALTER TABLE uploads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own uploads" ON uploads FOR ALL USING (auth.uid() = user_id);

-- Profile Sync Trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

## n8n Workflow (JSON)

Copy this into n8n:

```json
{
  "nodes": [
    {
      "parameters": {},
      "id": "...",
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1,
      "position": [250, 300],
      "webhookId": "image-process"
    },
    {
      "parameters": {
        "url": "={{$node[\"Webhook\"].json[\"imageUrl\"]}}",
        "responseFormat": "file"
      },
      "name": "Download Image",
      "type": "n8n-nodes-base.httpRequest",
      "position": [450, 300]
    },
    {
      "parameters": {
        "url": "https://api.remove.bg/v1.0/removebg",
        "method": "POST",
        "headerParameters": {
          "parameters": [
            { "name": "X-Api-Key", "value": "YOUR_REMOVE_BG_API_KEY" }
          ]
        },
        "sendBinaryData": true,
        "binaryPropertyName": "data",
        "responseFormat": "file"
      },
      "name": "Remove BG API",
      "type": "n8n-nodes-base.httpRequest",
      "position": [650, 300]
    },
    {
      "parameters": {
        "authentication": "cloudinaryApi",
        "resourceType": "image",
        "binaryData": true,
        "binaryPropertyName": "data"
      },
      "name": "Upload Result",
      "type": "n8n-nodes-base.cloudinary",
      "position": [850, 300]
    },
    {
      "parameters": {
        "table": "uploads",
        "data": {
          "result_url": "={{$node[\"Upload Result\"].json[\"secure_url\"]}}",
          "status": "completed"
        },
        "where": {
          "id": "={{$node[\"Webhook\"].json[\"uploadId\"]}}"
        }
      },
      "name": "Update Supabase",
      "type": "n8n-nodes-base.supabase",
      "position": [1050, 300]
    }
  ],
  "connections": { ... }
}
```
