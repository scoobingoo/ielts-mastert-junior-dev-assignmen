import { RawAssignment } from "@/types/assignment";

/**
 * Mốc thời gian giả lập cố định theo đề bài: 11/11/2026, 09:00 (GMT+7)
 * Tuyệt đối không dùng new Date() hiện tại để đảm bảo kết quả đối chiếu luôn cố định.
 */
export const REFERENCE_NOW_ISO = "2026-11-11T09:00:00+07:00";
export const REFERENCE_NOW_FORMATTED = "11/11/2026 09:00 (GMT+7)";

/**
 * Bảng dữ liệu mẫu chuyển đổi từ đề bài sang định dạng TypeScript/JSON (múi giờ +07:00)
 * Bao gồm 4 bài tập của học viên S01 (A01 -> A04) và 1 bài tập của học viên S02 (B01).
 */
export const MOCK_ASSIGNMENTS: RawAssignment[] = [
  {
    id: "A01",
    studentId: "S01",
    title: "Foundation U1 – Reading",
    dueAt: "2026-11-13T23:59:00+07:00",
    submittedAt: null,
  },
  {
    id: "A02",
    studentId: "S01",
    title: "Foundation U2 – Listening",
    dueAt: "2026-11-09T23:59:00+07:00",
    submittedAt: null,
  },
  {
    id: "A03",
    studentId: "S01",
    title: "Foundation U3 – Writing",
    dueAt: "2026-11-10T23:59:00+07:00",
    submittedAt: "2026-11-10T20:00:00+07:00",
  },
  {
    id: "A04",
    studentId: "S01",
    title: "Foundation U4 – Speaking",
    dueAt: "2026-11-08T23:59:00+07:00",
    submittedAt: "2026-11-10T12:00:00+07:00",
  },
  {
    id: "B01",
    studentId: "S02",
    title: "Foundation U1 – Reading",
    dueAt: "2026-11-13T23:59:00+07:00",
    submittedAt: null,
  },
];
