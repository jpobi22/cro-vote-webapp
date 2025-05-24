const crypto = require("crypto");
const algorithm = "aes-256-gcm";
const secretKey = crypto.createHash("sha256").update(process.env.SECRET_KEY || "he1L0.t41s-i$-43Y-t0-0ur,4pP").digest(); //Mg-he1L0.t41s,i$-Jp-43Y,t0.0ur,4pP-Lp

function encrypt(text) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  const authTag = cipher.getAuthTag().toString("hex");

  return `${iv.toString("hex")}:${encrypted}:${authTag}`;
}

function decrypt(encryptedText) {
  try {
    const [ivHex, encrypted, authTagHex] = encryptedText.split(":");
    const iv = Buffer.from(ivHex, "hex");
    const authTag = Buffer.from(authTagHex, "hex");

    const decipher = crypto.createDecipheriv(algorithm, secretKey, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  } catch (error) {
    console.error("Decryption failed:", error.message);
    return null;
  }
}

module.exports = { encrypt, decrypt };
