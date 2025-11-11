

import { ElevenLabsClient } from "elevenlabs";

export async function GET() {
  const agentId = process.env.EXPO_PUBLIC_ELEVENLABS_AGENT_ID;
  console.log("AGENT_ID:", agentId);
  if (!agentId) {
    throw Error("AGENT_ID is not set");
  }
  try {
    const client = new ElevenLabsClient({
      apiKey: process.env.EXPO_PUBLIC_ELEVENLABS_API_KEY, // important
    });
    const response = await client.conversationalAi.getSignedUrl({
      agent_id: agentId,
    });
    console.log("Signed URL response:", Response.json({ signedUrl: response.signed_url }));
    return Response.json({ signedUrl: response.signed_url });
  } catch (error) {
        console.log("Signed URL response:",error );

    console.error("Error:", error);
    return Response.json(
      { error: "Failed to get signed URL" },
      { status: 500 }
    );
  }
}