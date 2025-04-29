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
        key: "/users/info",
        label: <Link href="/users/manage">회원 정보</Link>,
      },
      {
        key: "/users/album",
        label: <Link href="/users/report">앨범 관리</Link>,
      },
      {
        key: "/users/blacklist",
        label: <Link href="/users/report">블랙 리스트</Link>,
      },
    ],
  },

  {
    key: "/report",
    label: <Link href="/hashtag">신고 관리</Link>,
    children: [
      {
        key: "/report/comment",
        label: <Link href="/users/manage">댓글</Link>,
      },
      {
        key: "/report/post",
        label: <Link href="/users/report">게시글</Link>,
      },
    ],
  },
  {
    key: "/banner",
    label: <Link href="/banner">배너 관리</Link>,
  },
];
