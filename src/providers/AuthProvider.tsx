import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";
import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

type AuthData = {
  session: Session | null;
  loading: boolean;
};

const AuthContext = createContext<AuthData>({ session: null, loading: true });

export default function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  //Khi thành phần được mount (khi thành phần ban đầu được thêm vào DOM và useEffect chạy hiệu ứng phụ của nó để lấy đữ liệu phiên)
  //Khi chỉ định mảng phụ thuộc rỗng('[]') trong useEffect() làm đối số thứ hai cho useEffect, nó chỉ chạy một lần sau khi render ban đầu, tương ứng giai đoạn mounting của thành phần
  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setLoading(false);
    };
    fetchSession();
    //Dùng để cập nhật trạng thái Khi người dùng đăng nhập hoặc đăng xuất
    //_event: với các trạng thái như SIGNED_IN, SIGNED_OUT, TOKEN_REFRESH
    //session: đối tượng chứa thông tin phiên xác thực hiện tại. Nếu đã đăng nhập session != null, ngược lại session = null
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);
  return (
    <AuthContext.Provider value={{ session, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
