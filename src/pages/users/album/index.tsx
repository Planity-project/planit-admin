import UserManage from "@/features/UserManage";
import { useRouter } from "next/router";
import { useEffect } from "react";

const AlbumPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace({
      pathname: router.pathname,
      query: { type: "album" },
    });
  }, []);

  return (
    <div>
      <UserManage />
    </div>
  );
};

export default AlbumPage;
