// api/supabase.js
import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  const { email } = req.body;

  if (!email || !email.includes('@')) {
    res.status(400).json({ error: "Invalid email address" });
    return;
  }

  // Conect to Supabase
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

  // add email to database
  const { data, error } = await supabase
    .from('subscribers')
    .insert([{ email }]);

  if (error) {
    console.error("Supabase Error:", error);
    res.status(500).json({ error: "Failed to save email" });
    return;
  }

  res.status(200).json({ message: "Success! Email saved 🎉" });
}

