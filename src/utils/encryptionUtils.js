import crypto from "crypto";

const algorithm = "aes-256-cbc";
const secretKey =
  "87f7219c5bdba3252896ead167cd91d55847136672a475468d732cce2ea0e73d"; // Make sure this is set in your environment variables

export const encryptCardNumber = (cardNumber) => {
  const iv = crypto.randomBytes(16); // Generate a new IV for each encryption
  const cipher = crypto.createCipheriv(
    algorithm,
    Buffer.from(secretKey, "hex"),
    iv
  );
  let encrypted = cipher.update(cardNumber, "utf8", "hex");
  encrypted += cipher.final("hex");
  return `${iv.toString("hex")}:${encrypted}`; // Store IV with encrypted data
};

export const decryptCardNumber = (encryptedCard) => {
  if (!encryptedCard || typeof encryptedCard !== "string") {
    console.error("decryptCardNumber: Invalid encryptedCard", encryptedCard);
    return null; // Return null instead of crashing
  }

  const parts = encryptedCard.split(":");
  if (parts.length !== 2) {
    console.error("decryptCardNumber: Incorrect format", encryptedCard);
    return null;
  }

  const [ivHex, encryptedData] = parts;

  try {
    const decipher = crypto.createDecipheriv(
      algorithm,
      Buffer.from(secretKey, "hex"),
      Buffer.from(ivHex, "hex")
    );
    let decrypted = decipher.update(encryptedData, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch (error) {
    console.error("decryptCardNumber: Decryption failed", error);
    return null;
  }
};
