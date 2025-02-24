import type { NextApiRequest, NextApiResponse } from "next";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const s3 = new S3Client({
  region: process.env.AWS_DEFAULT_REGION,
});

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
      const s3Command = new PutObjectCommand({
        Key: type?`${userId}/${fileName}/${type}`: `${userId}/${fileName}`,
        Bucket: process.env.S3_BUCKET_NAME,
        ContentType: fileType,
      });
      const signedUrl = await getSignedUrl(s3, s3Command);

      return res.status(200).json({ signedUrl });
    } catch (err) {
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}
