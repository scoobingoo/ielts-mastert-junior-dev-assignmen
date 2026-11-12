// Thông tin học viên đã xác thực ở phía Server
export interface AuthenticatedStudent {
  id: string;
  name: string;
  course: string;
}

/**
 * Giả lập cơ chế lấy thông tin phiên đăng nhập (Server-side Session / Auth Context).
 * Trong hệ thống thực tế, thông tin này được trích xuất từ HttpOnly Session Cookie hoặc JWT đã ký.
 * Tuyệt đối KHÔNG lấy studentId từ URL query params hoặc client request để tránh lỗ hổng IDOR.
 */
export function getAuthenticatedStudent(): AuthenticatedStudent {
  return {
    id: "S01",
    name: "Học viên S01",
    course: "IELTS Foundation",
  };
}
