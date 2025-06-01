
export interface Broadcast {
  id: string;
  name: string;
  audience: {
    type: 'all' | 'segments';
    filters?: {
      channel?: string;
    };
  };
  channels: string[];
  message: string;
  schedule: {
    type: 'now' | 'later';
    dateTime?: string;
  };
  timeZone: string;
  status: 'draft' | 'scheduled' | 'sent' | 'failed';
  createdBy: {
    id: string;
    name: string;
  };
  createdAt: string;
}
