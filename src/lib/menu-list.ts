import {
  BadgeDollarSign,
  Bookmark,
  LayoutDashboard,
  LucideIcon,
  ScrollText,
  Settings,
  SquarePen,
  Tag,
  UserRound,
  Users,
  UsersRound
} from "lucide-react";

type SubMenu = {
  href: string;
  label: string;
  active: boolean;
};

type Menu = {
  href: string;
  label: string;
  active: boolean;
  icon: LucideIcon;
  submenus: SubMenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/buyml",
          label: "BuyML",
          active: pathname.includes("/buy-mintlayer"),
          icon: BadgeDollarSign,
          submenus: []
        },
        {
          href: "/dashboard",
          label: "Dashboard",
          active: pathname.includes("/dashboard"),
          icon: LayoutDashboard,
          submenus: []
        },
        {
          href: "/delegators",
          label: "Delegators",
          active: pathname.includes("/delegators"),
          icon: UsersRound,
          submenus: []
        },
        {
          href: "/projects",
          label: "Projects",
          active: pathname.includes("/projects"),
          icon: ScrollText,
          submenus: []
        },
        {
          href: "/account",
          label: "Account",
          active: pathname.includes("/account"),
          icon: UserRound,
          submenus: []
        }
      ]
    },
    {
      groupLabel: "Contents",
      menus: [
        {
          href: "",
          label: "Posts",
          active: pathname.includes("/posts"),
          icon: SquarePen,
          submenus: [
            {
              href: "/posts",
              label: "All Posts",
              active: pathname === "/posts"
            },
            {
              href: "/posts/new",
              label: "New Post",
              active: pathname === "/posts/new"
            }
          ]
        },
        {
          href: "/categories",
          label: "Categories",
          active: pathname.includes("/categories"),
          icon: Bookmark,
          submenus: []
        },
        {
          href: "/tags",
          label: "Tags",
          active: pathname.includes("/tags"),
          icon: Tag,
          submenus: []
        }
      ]
    },
    {
      groupLabel: "Settings",
      menus: [
        {
          href: "/users",
          label: "Users",
          active: pathname.includes("/users"),
          icon: Users,
          submenus: []
        },
        {
          href: "/account",
          label: "Account",
          active: pathname.includes("/account"),
          icon: Settings,
          submenus: []
        }
      ]
    }
  ];
}
