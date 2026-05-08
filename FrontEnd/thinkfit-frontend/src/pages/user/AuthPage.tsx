import React, { useState } from 'react';

// Định nghĩa các interface nếu ông muốn truyền props từ component cha
interface AuthPageProps {
  onLoginSuccess?: (token: string) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLoginSuccess }) => {
  // Trạng thái chuyển đổi giữa Login và Register
  const [isLogin, setIsLogin] = useState<boolean>(true);

  // State lưu trữ dữ liệu form
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [error, setError] = useState<string>('');

  // Hàm xử lý Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Reset lỗi mỗi lần submit mới

    if (isLogin) {
      // Logic gọi API Đăng nhập
      console.log('Gửi request Đăng nhập:', { email, password });
      // Thường ông sẽ fetch API tới Backend Spring Boot/ASP.NET Core ở đây
      // Nếu thành công -> onLoginSuccess(token)
    } else {
      // Logic gọi API Đăng ký
      if (password !== confirmPassword) {
        setError('Mật khẩu xác nhận không khớp!');
        return;
      }
      console.log('Gửi request Đăng ký:', { name, email, password });
      // Fetch API đăng ký tại đây
    }
  };

  // Reset form khi chuyển đổi giữa Đăng nhập / Đăng ký
  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg border border-gray-100">
        
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            {isLogin ? 'Đăng Nhập' : 'Tạo Tài Khoản'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isLogin ? 'Chào mừng bạn quay trở lại' : 'Bắt đầu hành trình của bạn ngay hôm nay'}
          </p>
        </div>

        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Họ và tên</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nhập họ và tên"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="example@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Mật khẩu</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="••••••••"
            />
          </div>

          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Xác nhận mật khẩu</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="••••••••"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium transition-colors"
          >
            {isLogin ? 'Đăng Nhập' : 'Đăng Ký'}
          </button>
        </form>

        <div className="text-center mt-4 border-t pt-4">
          <p className="text-sm text-gray-600">
            {isLogin ? 'Chưa có tài khoản? ' : 'Đã có tài khoản? '}
            <button
              onClick={toggleMode}
              className="font-medium text-blue-600 hover:text-blue-500 underline focus:outline-none"
            >
              {isLogin ? 'Đăng ký ngay' : 'Đăng nhập'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;