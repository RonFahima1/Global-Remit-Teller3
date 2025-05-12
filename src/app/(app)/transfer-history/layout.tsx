import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Transfer History | Global Remit Teller',
  description: 'View and manage your money transfer history',
};

export default function TransferHistoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full flex flex-col">
      {children}
    </div>
  );
}
