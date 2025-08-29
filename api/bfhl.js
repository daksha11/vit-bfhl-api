// Minimal Vercel serverless function for /api/bfhl (rewritten from /bfhl via vercel.json)

// Build reverse + alternating caps string (start Uppercase)
function altCapsOnReverse(lettersJoined) {
  const arr = lettersJoined.split("").reverse();
  return arr.map((ch, i) => (i % 2 === 0 ? ch.toUpperCase() : ch.toLowerCase())).join("");
}

// Convert full name to slug "john_doe"
function slugifyName(name) {
  return (name || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .replace(/_+/g, "_");
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    // Proper 405 semantics
    res.setHeader("Allow", "POST");
    return res.status(405).json({
      is_success: false,
      message: "Only POST is allowed at /bfhl",
    });
  }

  try {
    // Be resilient if body arrives as a string
    const rawBody = req.body ?? {};
    const body = typeof rawBody === "string" ? JSON.parse(rawBody || "{}") : rawBody;

    const input = Array.isArray(body.data) ? body.data : null;
    if (!input) {
      return res.status(400).json({
        is_success: false,
        message: 'Request body must be like: { "data": ["a","1","334","$"] }',
      });
    }

    const odd_numbers = [];
    const even_numbers = [];
    const alphabets = [];
    const special_characters = [];
    const lettersForConcat = [];
    let sum = 0;

    for (const raw of input) {
      const s = String(raw);

      // Collect letters from any token for concat_string
      const letters = s.match(/[A-Za-z]/g);
      if (letters) lettersForConcat.push(...letters);

      const isIntegerString = /^[+-]?\d+$/.test(s);
      const isAlphaOnly = /^[A-Za-z]+$/.test(s);

      if (isIntegerString) {
        const num = parseInt(s, 10);
        if (Math.abs(num) % 2 === 0) {
          even_numbers.push(s); // keep as string
        } else {
          odd_numbers.push(s);
        }
        sum += num;
      } else if (isAlphaOnly) {
        alphabets.push(s.toUpperCase());
      } else if (s.length > 0) {
        // Treat any non-empty non-pure-number/non-pure-alpha token as special
        special_characters.push(s);
      }
    }

    const concat_string = altCapsOnReverse(lettersForConcat.join(""));

    // Configurable via env for portability
    const fullName = process.env.FULL_NAME || "john doe";
    const dob = process.env.DOB_DDMMYYYY || "17091999"; // ddmmyyyy
    const email = process.env.EMAIL || "john@xyz.com";
    const roll = process.env.ROLL_NUMBER || "ABCD123";

    const user_id = `${slugifyName(fullName)}_${dob}`;

    return res.status(200).json({
      is_success: true,
      user_id,
      email,
      roll_number: roll,
      odd_numbers,
      even_numbers,
      alphabets,
      special_characters,
      sum: String(sum),   // must be a string
      concat_string,
    });
  } catch (e) {
    return res.status(500).json({
      is_success: false,
      message: "Internal Server Error",
    });
  }
}
