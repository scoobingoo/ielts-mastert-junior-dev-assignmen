import type { Metadata } from "next";
import "./globals.css";

// Cấu hình metadata cho trang E-Learning của IELTS Master
export const metadata: Metadata = {
  title: "Bài tập của tôi | IELTS Master E-Learning",
  description:
    "Hệ thống quản lý và theo dõi tiến độ bài tập dành cho học viên IELTS Master.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
