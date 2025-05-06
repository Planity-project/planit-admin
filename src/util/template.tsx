// menuItems.ts
import { ReactNode } from "react";
import Link from "next/link";

export interface MenuItem {
  key: string;
  label: ReactNode;
  icon?: ReactNode;
  children?: MenuItem[];
}

export const sidebarMenus: MenuItem[] = [
  {
    key: "/dashboard",
    label: "대시보드",
  },
  {
    key: "/users",
    label: "회원 관리",
    children: [
      {
        key: "/users/manage",
        label: <Link href="/users/manage">회원 정보</Link>,
      },
      {
        key: "/users/album",
        label: <Link href="/users/album">앨범 관리</Link>,
      },
      {
        key: "/users/blacklist",
        label: <Link href="/users/report">블랙 리스트</Link>,
      },
    ],
  },

  {
    key: "/reports",
    label: "신고 관리",
    children: [
      {
        key: "/reports/comment",
        label: <Link href="/reports/comment">댓글</Link>,
      },
      {
        key: "/reports/post",
        label: <Link href="/reports/post">게시글</Link>,
      },
    ],
  },
  {
    key: "/banner",
    label: <Link href="/banner">배너 관리</Link>,
  },
];
