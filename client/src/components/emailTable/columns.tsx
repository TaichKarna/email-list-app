import { ColumnDef } from "@tanstack/react-table";

export type Email = {
  id: string; 
  sender: string; 
  subject: string; 
  timestamp: string; 
  status: "pending" | "processing" | "success" | "failed"
};

export const columns : ColumnDef<Email>[] = [
  {
    accessorKey: "sender",
    header: "Sender",
  },
  {
    accessorKey: "subject",
    header: "Subject",
  },
  {
    accessorKey: "timestamp",
    header: "Timestamp",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
];
