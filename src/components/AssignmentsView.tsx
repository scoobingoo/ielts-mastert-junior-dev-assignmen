"use client";

import React, { useEffect, useState } from "react";
import type { AssignmentsApiResponse, AssignmentView } from "@/types/assignment";

/**
 * Component hiển thị huy hiệu (Badge) trạng thái bài tập với màu sắc trực quan
 */
function StatusBadges({ badges }: { badges: AssignmentView["badges"] }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {badges.map((badge) => {
        // Phân loại màu sắc theo từng trạng thái bài tập
        let badgeStyle = "bg-slate-100 text-slate-700 border-slate-200";

        if (badge === "Đã nộp") {
          badgeStyle = "bg-emerald-50 text-emerald-700 border-emerald-200";
        } else if (badge === "Quá hạn") {
          badgeStyle = "bg-rose-50 text-rose-700 border-rose-200";
        } else if (badge === "Chưa nộp") {
          badgeStyle = "bg-amber-50 text-amber-800 border-amber-200";
        } else if (badge === "Nộp trễ") {
          badgeStyle = "bg-orange-50 text-orange-700 border-orange-200";
        }

        return (
          <span
            key={badge}
            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${badgeStyle}`}
          >
            {badge}
          </span>
        );
      })}
    </div>
  );
}

interface AssignmentsViewProps {
  /** Dữ liệu khởi tạo từ tầng Server giúp giao diện hiển thị tức thì */
  initialData: AssignmentsApiResponse;
}

/**
 * Giao diện hiển thị danh sách bài tập của học viên S01
 * Đồng bộ dữ liệu từ API GET /api/assignments và hỗ trợ hiển thị trên cả máy tính lẫn điện thoại
 */
export default function AssignmentsView({ initialData }: AssignmentsViewProps) {
  const [data, setData] = useState<AssignmentsApiResponse>(initialData);
  const [error, setError] = useState<string | null>(null);

  // Gọi API /api/assignments để đảm bảo luồng Client -> API Route Handler hoạt động chuẩn xác
  useEffect(() => {
    async function syncFromApi() {
      try {
        const response = await fetch("/api/assignments", {
          cache: "no-store",
        });
        if (!response.ok) {
          throw new Error("Không thể tải danh sách bài tập từ máy chủ.");
        }
        const json: AssignmentsApiResponse = await response.json();
        setData(json);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Đã xảy ra lỗi không xác định."
        );
      }
    }

    syncFromApi();
  }, []);

  // Tính toán số lượng thống kê nhanh theo từng trạng thái
  const assignments = data.assignments;
  const totalCount = assignments.length;
  const submittedCount = assignments.filter(
    (a) => a.status === "Đã nộp"
  ).length;
  const pendingCount = assignments.filter(
    (a) => a.status === "Chưa nộp"
  ).length;
  const overdueCount = assignments.filter((a) => a.status === "Quá hạn").length;
  const lateCount = assignments.filter((a) => a.isLate).length;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Thanh điều hướng trên cùng (Header) */}
      <header className="border-b border-slate-200 bg-white shadow-xs">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 font-bold text-white shadow-xs">
              IM
            </div>
            <div>
              <p className="text-xs font-semibold tracking-wider text-indigo-600 uppercase">
                IELTS Master • E-Learning
              </p>
              <h1 className="text-lg font-bold text-slate-900 sm:text-xl">
                Bài tập của tôi
              </h1>
            </div>
          </div>

          {/* Thông tin phiên học viên giả lập từ Server */}
          <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5">
              <span className="text-slate-500">Học viên: </span>
              <span className="font-semibold text-slate-900">
                {data.student.name} ({data.student.id})
              </span>
            </div>
            <div className="rounded-lg border border-indigo-100 bg-indigo-50/70 px-3 py-1.5 text-indigo-900">
              <span className="text-indigo-600">Mốc đối chiếu: </span>
              <span className="font-semibold">
                {data.referenceTime.formatted}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Nội dung chính */}
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
        {error && (
          <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-700">
            <p className="font-semibold">Lỗi đồng bộ dữ liệu API</p>
            <p className="mt-1 text-sm">{error}</p>
          </div>
        )}

        <div className="space-y-6">
          {/* Thẻ tóm tắt thống kê trạng thái */}
          <section
            aria-label="Thống kê bài tập"
            className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4"
          >
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
              <p className="text-xs font-medium text-slate-500">
                Tổng số bài tập ({data.student.id})
              </p>
              <p className="mt-1 text-2xl font-bold text-slate-900">
                {totalCount}
              </p>
            </div>

            <div className="rounded-xl border border-emerald-200 bg-white p-4 shadow-xs">
              <p className="text-xs font-medium text-emerald-700">Đã nộp</p>
              <div className="mt-1 flex items-baseline gap-2">
                <p className="text-2xl font-bold text-emerald-700">
                  {submittedCount}
                </p>
                {lateCount > 0 && (
                  <span className="text-xs font-medium text-orange-600">
                    ({lateCount} nộp trễ)
                  </span>
                )}
              </div>
            </div>

            <div className="rounded-xl border border-amber-200 bg-white p-4 shadow-xs">
              <p className="text-xs font-medium text-amber-800">Chưa nộp</p>
              <p className="mt-1 text-2xl font-bold text-amber-700">
                {pendingCount}
              </p>
            </div>

            <div className="rounded-xl border border-rose-200 bg-white p-4 shadow-xs">
              <p className="text-xs font-medium text-rose-700">Quá hạn</p>
              <p className="mt-1 text-2xl font-bold text-rose-600">
                {overdueCount}
              </p>
            </div>
          </section>

          {/* Khung danh sách bài tập */}
          <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
            <div className="border-b border-slate-200 px-4 py-4 sm:px-6 flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Danh sách bài tập khóa {data.student.course}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Dữ liệu được lọc riêng cho tài khoản {data.student.id} tại
                  server (API: <code>/api/assignments</code>).
                </p>
              </div>
              <span className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                Múi giờ: GMT+7
              </span>
            </div>

            {/* Giao diện Bảng dành cho máy tính (Desktop >= sm) */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold uppercase tracking-wide text-slate-600">
                    <th className="py-3.5 pl-6 pr-3">Mã bài</th>
                    <th className="px-3 py-3.5">Tên bài tập</th>
                    <th className="px-3 py-3.5">Hạn nộp (GMT+7)</th>
                    <th className="px-3 py-3.5">Thời điểm nộp (GMT+7)</th>
                    <th className="py-3.5 pl-3 pr-6">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-sm">
                  {assignments.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      <td className="whitespace-nowrap py-4 pl-6 pr-3 font-mono text-xs font-bold text-indigo-600">
                        {item.id}
                      </td>
                      <td className="px-3 py-4 font-medium text-slate-900">
                        {item.title}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-slate-600 font-mono text-xs">
                        {item.dueAtFormatted}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-slate-600 font-mono text-xs">
                        {item.submittedAtFormatted}
                      </td>
                      <td className="whitespace-nowrap py-4 pl-3 pr-6">
                        <StatusBadges badges={item.badges} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Giao diện Thẻ (Card) dành cho điện thoại (Mobile < sm) */}
            <div className="divide-y divide-slate-200 sm:hidden">
              {assignments.map((item) => (
                <article key={item.id} className="p-4 space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-mono text-xs font-bold text-indigo-600">
                        {item.id}
                      </span>
                      <h3 className="text-sm font-semibold text-slate-900">
                        {item.title}
                      </h3>
                    </div>
                    <StatusBadges badges={item.badges} />
                  </div>
                  <div className="grid grid-cols-2 gap-2 rounded-lg bg-slate-50 p-2.5 text-xs">
                    <div>
                      <span className="block text-slate-500">
                        Hạn nộp (GMT+7)
                      </span>
                      <span className="font-mono font-medium text-slate-800">
                        {item.dueAtFormatted}
                      </span>
                    </div>
                    <div>
                      <span className="block text-slate-500">
                        Đã nộp (GMT+7)
                      </span>
                      <span className="font-mono font-medium text-slate-800">
                        {item.submittedAtFormatted}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
