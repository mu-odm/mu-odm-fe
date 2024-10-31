"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import useRouteHandler from "@/lib/routeHandler"

export function MenuBar({ title_name, route_list }: { title_name: string, route_list: { name: string; route: string }[] }) {

    const navigateRoute = useRouteHandler()

  return (
    <NavigationMenu className="flex w-full">
      <NavigationMenuList>
        <NavigationMenuItem className="flex flex-row items-center p-2">
          <div className="mx-4 font-bold text-xl p-2 rounded-md px-4 text-white">{title_name} Manager</div>
          <div className="border-l border-1 border-white h-[3rem] mr-5"></div>
          <NavigationMenuTrigger className="border h-[3rem] text-red-500">Navigator</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-2">
              <div>
                <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <a
                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                  >
                    <div className="mb-2 mt-4 text-lg font-medium">
                      MU-ODM
                    </div>
                    <p className="text-sm leading-tight text-muted-foreground">
                      Welcome to Admin Manager section. Here you can manage all the orders, products and sizes.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              </div>
              <div className="flex flex-col gap-3">
              {
                route_list.map((route) => (
                  <ListItem
                    key={route.name}
                    title={route.name}
                    onClick={() => navigateRoute(route.route, "")}
                    className="border"
                  >
                  </ListItem>
                ))
              }
              </div>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"
