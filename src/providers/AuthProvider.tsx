import { Tables } from "@/database.types";
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

type Profile = Tables<"profiles">;
type AuthData = {
  session: Session | null;
  loading: boolean;
  profile: Profile | null;
  isAdmin: boolean;
};

const AuthContext = createContext<AuthData>({
  session: null,
  loading: true,
  profile: null,
  isAdmin: false,
});

export default function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  //Khi thành phần được mount (khi thành phần ban đầu được thêm vào DOM và useEffect chạy hiệu ứng phụ của nó để lấy đữ liệu phiên)
  //Khi chỉ định mảng phụ thuộc rỗng('[]') trong useEffect() làm đối số thứ hai cho useEffect, nó chỉ chạy một lần sau khi render ban đầu, tương ứng giai đoạn mounting của thành phần
  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      console.log(data.session);
      if (data.session) {
        //fetch Profile
        const { data: prof } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", data.session.user.id)
          .single();

        setProfile(prof || null);
      }

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
    <AuthContext.Provider
      value={{ session, loading, profile, isAdmin: profile?.group == "ADMIN" }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
