export class ActivityEntity {
  id: string;
  title: string;
  description: string;
  start_date: Date;
  transaction_id: string;
  photos: MediaEntity[];
}

export class MediaEntity {
  id: string;
  name: string;
  size: number;
  mime_type: string;
  url: string;
  media_type: string | null;
  activity_id: string | null;
  Activity?: ActivityEntity | null;
}
