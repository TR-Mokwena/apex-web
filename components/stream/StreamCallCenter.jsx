"use client";

import { useEffect, useState } from "react";
import { StreamVideo } from "@stream-io/video-react-sdk";
import { getVideoClient, isStreamConfigured } from "@/lib/stream";
import IncomingCall from "./IncomingCall";

/**
 * App-wide Stream presence + incoming-call listener. Mounted once in the (app)
 * layout so a ringing call reaches the user on any screen. Shares the single
 * Stream client instance (getOrCreateInstance) with the in-call components.
 */
export default function StreamCallCenter() {
  const [client, setClient] = useState(null);

  useEffect(() => {
    if (isStreamConfigured) setClient(getVideoClient());
  }, []);

  if (!client) return null;

  return (
    <StreamVideo client={client}>
      <IncomingCall />
    </StreamVideo>
  );
}
