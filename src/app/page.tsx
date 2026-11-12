import React from "react";
import AssignmentsView from "@/components/AssignmentsView";
import { getAuthenticatedStudentAssignmentsPayload } from "@/lib/assignmentService";

/**
 * Trang Server Component chính của chức năng "Bài tập của tôi".
 * Lấy dữ liệu của học viên S01 từ tầng Service phía Server và đồng bộ với API /api/assignments.
 */
export default function MyAssignmentsPage() {
  const initialData = getAuthenticatedStudentAssignmentsPayload();
  return <AssignmentsView initialData={initialData} />;
}
