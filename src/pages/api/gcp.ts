import type { NextApiRequest, NextApiResponse } from "next";
import { Storage } from "@google-cloud/storage";
import { env } from "~/env.mjs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method == "POST") {
    const { fileType, userId,fileName, type } = JSON.parse(req.body);
    if (!fileType || !userId || !fileName) {
      return res.status(400).json({ error: "Invalid request" });
    }
    try {
        const storage = new Storage({
          keyFilename: env.GCS_FILE_NAME
        });
        const [url] = await storage.bucket(env.GCS_BUCKET_NAME).file(type?`${userId}/${fileName}/${type}`: `${userId}/${fileName}`).getSignedUrl({
            version: 'v4',
            action: 'write',
            expires: Date.now() + 5 * 60 * 1000, 
            contentType: fileType,
        });

      return res.status(200).json({ signedUrl:url });
    } catch (err) {
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}
