import {
  MOCK_ASSIGNMENTS,
  REFERENCE_NOW_FORMATTED,
  REFERENCE_NOW_ISO,
} from "@/data/mockAssignments";
import { getAuthenticatedStudent } from "@/lib/auth";
import {
  AssignmentStatusResult,
  AssignmentsApiResponse,
  AssignmentView,
  RawAssignment,
} from "@/types/assignment";

/**
 * Hàm định dạng chuỗi thời gian ISO (+07:00) sang định dạng dễ đọc: DD/MM/YYYY HH:mm
 * Tính toán trực tiếp theo múi giờ GMT+7 để không bị lệch giờ khi chạy trên server khác múi giờ.
 */
export function formatDateTimeGmt7(isoString: string | null): string {
  if (!isoString) {
    return "—";
  }

  const timestamp = Date.parse(isoString);
  if (Number.isNaN(timestamp)) {
    throw new Error(`Định dạng thời gian không hợp lệ: ${isoString}`);
  }

  // Chuyển sang mốc giờ GMT+7 bằng cách cộng thêm 7 giờ vào UTC
  const gmt7Date = new Date(timestamp + 7 * 60 * 60 * 1000);
  const day = String(gmt7Date.getUTCDate()).padStart(2, "0");
  const month = String(gmt7Date.getUTCMonth() + 1).padStart(2, "0");
  const year = gmt7Date.getUTCFullYear();
  const hours = String(gmt7Date.getUTCHours()).padStart(2, "0");
  const minutes = String(gmt7Date.getUTCMinutes()).padStart(2, "0");

  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

/**
 * Hàm tính toán trạng thái bài tập dựa trên hạn nộp, thời điểm nộp và thời điểm đối chiếu.
 * Quy tắc đề bài:
 * - Đã nộp -> "Đã nộp" (Nếu nộp sau hạn thì thêm "Nộp trễ")
 * - Chưa nộp và hết hạn (now > dueAt) -> "Quá hạn"
 * - Chưa nộp còn hạn (now <= dueAt) -> "Chưa nộp"
 */
export function evaluateAssignmentStatus(
  assignment: Pick<RawAssignment, "dueAt" | "submittedAt">,
  referenceNowIso: string = REFERENCE_NOW_ISO
): AssignmentStatusResult {
  const dueTime = Date.parse(assignment.dueAt);
  const nowTime = Date.parse(referenceNowIso);

  if (Number.isNaN(dueTime) || Number.isNaN(nowTime)) {
    throw new Error("Thời gian hạn nộp hoặc thời gian đối chiếu không hợp lệ.");
  }

  // Trường hợp 1: Học viên đã nộp bài
  if (assignment.submittedAt !== null) {
    const submittedTime = Date.parse(assignment.submittedAt);
    if (Number.isNaN(submittedTime)) {
      throw new Error("Thời gian nộp bài không hợp lệ.");
    }

    const isLate = submittedTime > dueTime;
    return {
      status: "Đã nộp",
      isLate,
      displayLabel: isLate ? "Đã nộp + Nộp trễ" : "Đã nộp",
      badges: isLate ? ["Đã nộp", "Nộp trễ"] : ["Đã nộp"],
    };
  }

  // Trường hợp 2: Chưa nộp và đã quá hạn so với mốc thời gian đối chiếu
  if (nowTime > dueTime) {
    return {
      status: "Quá hạn",
      isLate: false,
      displayLabel: "Quá hạn",
      badges: ["Quá hạn"],
    };
  }

  // Trường hợp 3: Chưa nộp và vẫn còn hạn
  return {
    status: "Chưa nộp",
    isLate: false,
    displayLabel: "Chưa nộp",
    badges: ["Chưa nộp"],
  };
}

/**
 * Lọc danh sách bài tập của riêng một học viên xác định và đính kèm thông tin trạng thái.
 * Không bao giờ trả về bài tập của học viên khác.
 */
export function getAssignmentsByStudentId(
  studentId: string,
  sourceAssignments: RawAssignment[] = MOCK_ASSIGNMENTS,
  referenceNowIso: string = REFERENCE_NOW_ISO
): AssignmentView[] {
  return sourceAssignments
    .filter((item) => item.studentId === studentId)
    .map((item) => {
      const statusResult = evaluateAssignmentStatus(item, referenceNowIso);
      return {
        id: item.id,
        studentId: item.studentId,
        title: item.title,
        dueAt: item.dueAt,
        dueAtFormatted: formatDateTimeGmt7(item.dueAt),
        submittedAt: item.submittedAt,
        submittedAtFormatted: formatDateTimeGmt7(item.submittedAt),
        status: statusResult.status,
        isLate: statusResult.isLate,
        displayLabel: statusResult.displayLabel,
        badges: statusResult.badges,
      };
    });
}

/**
 * Service trả về toàn bộ dữ liệu bài tập cho học viên đang đăng nhập trên Server (S01).
 * Đảm bảo tính cô lập dữ liệu: B01 của S02 bị loại bỏ ngay ở tầng Server.
 */
export function getAuthenticatedStudentAssignmentsPayload(): AssignmentsApiResponse {
  // Lấy thông tin học viên từ phiên xác thực phía server (cố định là S01)
  const authenticatedStudent = getAuthenticatedStudent();

  // Chỉ truy xuất các bài tập thuộc về học viên đã xác thực
  const assignments = getAssignmentsByStudentId(authenticatedStudent.id);

  return {
    student: authenticatedStudent,
    referenceTime: {
      iso: REFERENCE_NOW_ISO,
      formatted: REFERENCE_NOW_FORMATTED,
    },
    assignments,
  };
}
