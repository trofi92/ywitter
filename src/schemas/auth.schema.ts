import { z } from "zod";

export const authSchema = z.object({
 email: z
  .string()
  .email("유효한 이메일 주소를 입력해주세요")
  .min(1, "이메일을 입력해주세요"),
 password: z
  .string()
  .min(8, "비밀번호는 최소 8자 이상이어야 합니다")
  .regex(
   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
   "비밀번호는 대문자, 소문자, 숫자, 특수문자를 포함해야 합니다",
  ),
});

export type AuthFormData = z.infer<typeof authSchema>;
