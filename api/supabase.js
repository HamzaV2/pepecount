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
  const AC_API_URL = process.env.AC_API_URL;
  const AC_API_KEY = process.env.AC_API_KEY;

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !AC_API_URL || !AC_API_KEY) {
    console.error("Missing environment variables.");
    return res.status(500).json({ error: "Configuration error" }); 
  }

  try {
    // 📌 1. Зберігаємо email у Supabase
    const supabaseResponse = await fetch(`${SUPABASE_URL}/rest/v1/waitlist`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
        "Prefer": "return=minimal"
      },
      body: JSON.stringify([{ email }])
    });

    if (!supabaseResponse.ok) {
      const supabaseError = await supabaseResponse.json();
      console.error("Supabase API error:", supabaseError);
      return res.status(500).json({ error: "Supabase API error", details: supabaseError });
    }

    // 📌 2. Відправляємо email у ActiveCampaign
    const activeCampaignResponse = await fetch(`${AC_API_URL}/api/3/contacts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Api-Token": AC_API_KEY
      },
      body: JSON.stringify({
        contact: {
          email: email,
          firstName: "",  // Якщо треба, можеш додати поле firstName у форму
          lastName: "",
          phone: "" // Якщо треба телефон
        }
      })
    });

    if (!activeCampaignResponse.ok) {
      const acError = await activeCampaignResponse.json();
      console.error("ActiveCampaign API error:", acError);
      return res.status(500).json({ error: "ActiveCampaign API error", details: acError });
    }

    return res.status(200).json({ message: "Success! Email saved 🎉" });
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
