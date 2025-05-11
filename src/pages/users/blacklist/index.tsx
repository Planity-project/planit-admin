import UserManage from "@/features/UserManage";
import { useRouter } from "next/router";
import { useEffect } from "react";

const BlacklistPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace({
      pathname: router.pathname,
      query: { type: "blacklist" },
    });
  }, []);

  return (
    <div>
      <UserManage />
    </div>
  );
};

export default BlacklistPage;
