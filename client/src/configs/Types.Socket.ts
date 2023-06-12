export type BasicSocketType = {
  id: string;
  type: 'insert' | 'delete';
  userId: string;
  isNotReply?: boolean;
}