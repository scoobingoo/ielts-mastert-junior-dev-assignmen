import { NextResponse } from "next/server";
import { getAuthenticatedStudentAssignmentsPayload } from "@/lib/assignmentService";

/**
 * Route Handler GET /api/assignments
 * Trả về danh sách bài tập của học viên đang đăng nhập (S01).
 *
 * Bảo mật (Chống IDOR):
 * - Không đọc tham số studentId từ URL query (?studentId=...) hay request headers do client tự truyền.
 * - Luôn lấy định danh học viên từ phiên làm việc phía server (getAuthenticatedStudent).
 * - Đảm bảo bài tập B01 của S02 không bao giờ bị lộ trong JSON trả về.
 */
export async function GET(_request: Request) {
  const payload = getAuthenticatedStudentAssignmentsPayload();
  return NextResponse.json(payload, { status: 200 });
}
