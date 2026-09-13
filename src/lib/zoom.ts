export type ZoomMeetingInput = {
  topic: string;
  startTime: string;
  durationMinutes: number;
  timezone: string;
  idempotencyKey: string;
};

export type ZoomMeeting = {
  provider: "zoom";
  meetingId: string;
  joinUrl: string;
  startTime: string;
  timezone: string;
};

export type ZoomClient = {
  createMeeting(input: ZoomMeetingInput): Promise<ZoomMeeting>;
};

export class ZoomUnconfiguredError extends Error {
  constructor() {
    super("Zoom is not configured.");
    this.name = "ZoomUnconfiguredError";
  }
}

export function zoomConfigured() {
  return Boolean(
    process.env.ZOOM_ACCOUNT_ID && process.env.ZOOM_CLIENT_ID && process.env.ZOOM_CLIENT_SECRET
  );
}

async function zoomAccessToken() {
  const accountId = process.env.ZOOM_ACCOUNT_ID || "";
  const clientId = process.env.ZOOM_CLIENT_ID || "";
  const clientSecret = process.env.ZOOM_CLIENT_SECRET || "";
  if (!accountId || !clientId || !clientSecret) {
    throw new ZoomUnconfiguredError();
  }
  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const res = await fetch("https://zoom.us/oauth/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "account_credentials",
      account_id: accountId,
    }),
  });
  if (!res.ok) {
    throw new Error("Zoom authorization failed.");
  }
  const body = (await res.json()) as { access_token?: string };
  if (!body.access_token) {
    throw new Error("Zoom authorization failed.");
  }
  return body.access_token;
}

export function createZoomClient(): ZoomClient {
  return {
    async createMeeting(input) {
      const token = await zoomAccessToken();
      const res = await fetch("https://api.zoom.us/v2/users/me/meetings", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic: input.topic,
          type: 2,
          start_time: input.startTime,
          duration: input.durationMinutes,
          timezone: input.timezone,
          settings: {
            join_before_host: true,
            waiting_room: false,
            host_video: false,
            participant_video: false,
          },
        }),
      });
      if (!res.ok) {
        throw new Error("Zoom meeting could not be created.");
      }
      const body = (await res.json()) as {
        id?: number | string;
        join_url?: string;
        start_time?: string;
        timezone?: string;
      };
      if (!body.id || !body.join_url) {
        throw new Error("Zoom meeting could not be created.");
      }
      return {
        provider: "zoom",
        meetingId: String(body.id),
        joinUrl: body.join_url,
        startTime: body.start_time || input.startTime,
        timezone: body.timezone || input.timezone,
      };
    },
  };
}
