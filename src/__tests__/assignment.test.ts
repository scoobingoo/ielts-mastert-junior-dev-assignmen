import { describe, expect, it } from "vitest";
import { MOCK_ASSIGNMENTS, REFERENCE_NOW_ISO } from "@/data/mockAssignments";
import {
  evaluateAssignmentStatus,
  getAssignmentsByStudentId,
  getAuthenticatedStudentAssignmentsPayload,
} from "@/lib/assignmentService";
import { GET } from "@/app/api/assignments/route";

describe("Kiểm thử 1: Logic tính trạng thái bài tập (4 trường hợp chuẩn tại mốc 11/11/2026 09:00 GMT+7)", () => {
  it("A01 (chưa nộp, hạn 13/11/2026 23:59) -> phải trả về 'Chưa nộp'", () => {
    const a01 = MOCK_ASSIGNMENTS.find((item) => item.id === "A01")!;
    const result = evaluateAssignmentStatus(a01, REFERENCE_NOW_ISO);

    expect(result.status).toBe("Chưa nộp");
    expect(result.isLate).toBe(false);
    expect(result.displayLabel).toBe("Chưa nộp");
    expect(result.badges).toEqual(["Chưa nộp"]);
  });

  it("A02 (chưa nộp, hạn 09/11/2026 23:59) -> phải trả về 'Quá hạn'", () => {
    const a02 = MOCK_ASSIGNMENTS.find((item) => item.id === "A02")!;
    const result = evaluateAssignmentStatus(a02, REFERENCE_NOW_ISO);

    expect(result.status).toBe("Quá hạn");
    expect(result.isLate).toBe(false);
    expect(result.displayLabel).toBe("Quá hạn");
    expect(result.badges).toEqual(["Quá hạn"]);
  });

  it("A03 (nộp 10/11 20:00, hạn 10/11/2026 23:59) -> phải trả về 'Đã nộp' (đúng hạn)", () => {
    const a03 = MOCK_ASSIGNMENTS.find((item) => item.id === "A03")!;
    const result = evaluateAssignmentStatus(a03, REFERENCE_NOW_ISO);

    expect(result.status).toBe("Đã nộp");
    expect(result.isLate).toBe(false);
    expect(result.displayLabel).toBe("Đã nộp");
    expect(result.badges).toEqual(["Đã nộp"]);
  });

  it("A04 (nộp 10/11 12:00, hạn 08/11/2026 23:59) -> phải trả về 'Đã nộp + Nộp trễ'", () => {
    const a04 = MOCK_ASSIGNMENTS.find((item) => item.id === "A04")!;
    const result = evaluateAssignmentStatus(a04, REFERENCE_NOW_ISO);

    expect(result.status).toBe("Đã nộp");
    expect(result.isLate).toBe(true);
    expect(result.displayLabel).toBe("Đã nộp + Nộp trễ");
    expect(result.badges).toEqual(["Đã nộp", "Nộp trễ"]);
  });
});

describe("Kiểm thử 2: Lọc đúng dữ liệu học viên S01 & Chống lộ dữ liệu B01 của S02", () => {
  it("Service chỉ trả về 4 bài tập của S01 (A01, A02, A03, A04) và tuyệt đối không chứa B01 của S02", () => {
    const payload = getAuthenticatedStudentAssignmentsPayload();
    const ids = payload.assignments.map((item) => item.id);

    expect(payload.student.id).toBe("S01");
    expect(ids).toEqual(["A01", "A02", "A03", "A04"]);
    expect(ids).not.toContain("B01");
    expect(
      payload.assignments.every((item) => item.studentId === "S01")
    ).toBe(true);

    // Đối chiếu kết quả tổng hợp theo đúng mục 3 của đề bài
    const summaryMap = Object.fromEntries(
      payload.assignments.map((item) => [item.id, item.displayLabel])
    );
    expect(summaryMap).toEqual({
      A01: "Chưa nộp",
      A02: "Quá hạn",
      A03: "Đã nộp",
      A04: "Đã nộp + Nộp trễ",
    });
  });

  it("Route Handler GET /api/assignments bỏ qua query ?studentId=S02 giả mạo và không làm lộ dữ liệu S02", async () => {
    // Giả lập client cố tình truyền ?studentId=S02 trên URL để khai thác lỗi IDOR
    const forgedRequest = new Request(
      "http://localhost:3000/api/assignments?studentId=S02"
    );
    const response = await GET(forgedRequest);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.student.id).toBe("S01");
    expect(body.assignments.map((a: { id: string }) => a.id)).toEqual([
      "A01",
      "A02",
      "A03",
      "A04",
    ]);
    expect(
      body.assignments.some((a: { id: string }) => a.id === "B01")
    ).toBe(false);
    expect(
      body.assignments.some((a: { studentId: string }) => a.studentId === "S02")
    ).toBe(false);
  });

  it("Hàm getAssignmentsByStudentId tách biệt chính xác dữ liệu theo từng học viên", () => {
    const s01List = getAssignmentsByStudentId("S01");
    expect(s01List.map((a) => a.id)).toEqual(["A01", "A02", "A03", "A04"]);
  });
});
