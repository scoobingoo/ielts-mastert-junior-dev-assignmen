// Định nghĩa các trạng thái cơ bản của một bài tập theo quy tắc đề bài
export type BaseAssignmentStatus = "Chưa nộp" | "Quá hạn" | "Đã nộp";

// Dữ liệu bài tập gốc lưu trữ ở phía server (chưa qua tính toán trạng thái)
export interface RawAssignment {
  /** Mã bài tập (ví dụ: A01, A02, B01) */
  id: string;
  /** Mã học viên sở hữu bài tập (ví dụ: S01, S02) */
  studentId: string;
  /** Tên bài tập hiển thị */
  title: string;
  /** Hạn nộp bài theo định dạng ISO 8601 có múi giờ +07:00 */
  dueAt: string;
  /** Thời điểm học viên đã nộp bài (ISO 8601 +07:00) hoặc null nếu chưa nộp */
  submittedAt: string | null;
}

// Kết quả đánh giá trạng thái của một bài tập
export interface AssignmentStatusResult {
  /** Trạng thái chính: "Chưa nộp" | "Quá hạn" | "Đã nộp" */
  status: BaseAssignmentStatus;
  /** Cờ đánh dấu bài nộp sau thời hạn (Nộp trễ) */
  isLate: boolean;
  /** Nhãn đầy đủ để hiển thị hoặc kiểm thử (ví dụ: "Đã nộp + Nộp trễ" hoặc "Chưa nộp") */
  displayLabel: string;
  /** Danh sách các huy hiệu (badges) hiển thị trên giao diện */
  badges: Array<"Chưa nộp" | "Quá hạn" | "Đã nộp" | "Nộp trễ">;
}

// Dữ liệu bài tập trả về cho giao diện sau khi đã lọc và tính toán trạng thái
export interface AssignmentView {
  id: string;
  studentId: string;
  title: string;
  dueAt: string;
  dueAtFormatted: string;
  submittedAt: string | null;
  submittedAtFormatted: string;
  status: BaseAssignmentStatus;
  isLate: boolean;
  displayLabel: string;
  badges: Array<"Chưa nộp" | "Quá hạn" | "Đã nộp" | "Nộp trễ">;
}

// Cấu trúc dữ liệu phản hồi từ API GET /api/assignments
export interface AssignmentsApiResponse {
  student: {
    id: string;
    name: string;
    course: string;
  };
  referenceTime: {
    iso: string;
    formatted: string;
  };
  assignments: AssignmentView[];
}
