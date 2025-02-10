export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { email } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: "Invalid email address" });
  }

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

  console.log("Supabase URL:", SUPABASE_URL);
  console.log("Supabase Key:", SUPABASE_ANON_KEY ? "Key exists" : "Key is missing");

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error("Supabase environment variables are missing.");
    return res.status(500).json({ error: "Supabase configuration error" });
  }

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/waitlist`, {  // 
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
        "Prefer": "return=minimal"
      },
      body: JSON.stringify([{ email }]) // 
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Supabase API error:", errorData);
      return res.status(500).json({ error: "Supabase API error", details: errorData });
    }

    return res.status(200).json({ message: "Success! Email saved 🎉" });
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
