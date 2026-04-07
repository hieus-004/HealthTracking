export interface UserBodyResponse {
  userName: string;
  age: number;
  gender: string;
  weight: number;
  height: number;
  bodyfatPerc: number | null;
  smm: number | null;
  target: string;
  activityLevel: string;
  targetIntensity: string; // Mới thêm trường này
  bmi: number; // Backend trả về bmi đã tính sẵn
}