/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import orders from "@/icons/Property_2_Cart_1_ubt3so.svg";
import analytics from "@/icons/Property_2_Chart-pie_bygfly.svg";
import help from "@/icons/Property_2_Chat_6_qlrj4q.svg";
import explore from "@/icons/Property_2_Compass_jfe95t.svg";
import downloads from "@/icons/Property_2_Downloads-folder_zb8tdq.svg";
import home from "@/icons/Property_2_Layout-4-blocks_gs8r2r.svg";
import funnel from "@/icons/Property_2_Layout-top-panel-2_xbc11g.svg";
import integration from "@/icons/Property_2_Outlet_gqk6rs.svg";
import products from "@/icons/Property_2_Price_2_ugwdhq.svg";
import settings from "@/icons/Property_2_Settings_4_tm54pe.svg";
import profile from "@/icons/Property_2_User_iiqfxz.svg";
import customers from "@/icons/Property_2_User-folder_n4spfl.svg";
import payouts from "@/icons/Property_2_Wallet_3_teopvy.svg";
import { useEffect, useState } from "react";

import { useNotifications } from "~/features/push-notification/hooks/use-notification";

export const useSidebarItems = () => {
  const { notifications } = useNotifications();
  const [items, setItems] = useState<SidebarItem[]>(sideItems);

  useEffect(() => {
    const orderCreatedCount = notifications.filter((notification) => notification.type === "order.created").length;

    const updatedItems = items.map((item) => {
      if (item.id === "orders") {
        return {
          ...item,
          badge: {
            ...item.badge,
            count: orderCreatedCount,
            variant: item.badge?.variant ?? "danger", // Ensure variant is always defined
          },
        };
      }
      return item;
    });

    setItems(updatedItems);
  }, [notifications]);

  return items;
};

export const sideItems: SidebarItem[] = [
  {
    route: "Home",
    link: "/dashboard/:userID/home",
    iconUrl: home,
    id: "home",
  },
  {
    route: "Products",
    link: "/dashboard/:userID/products",
    iconUrl: products,
    id: "products",
  },
  {
    route: "Funnels",
    link: "/dashboard/:userID/funnels",
    iconUrl: funnel,
    id: "funnels",
  },
  {
    route: "Orders",
    link: "/dashboard/:userID/orders",
    iconUrl: orders,
    id: "orders",
    badge: {
      count: 0,
      variant: "danger",
    },
  },
  {
    route: "Analytics",
    link: "/dashboard/:userID/analytics",
    iconUrl: analytics,
    id: "analytics",
  },
  {
    route: "Customers",
    link: "/dashboard/:userID/customers",
    iconUrl: customers,
    id: "customers",
  },
  {
    route: "Payouts",
    link: "/dashboard/:userID/payouts",
    iconUrl: payouts,
    id: "payouts",
  },
  {
    divider: true,
    route: "",
    link: "",
    id: "divider-1",
  },
  {
    route: "Downloads",
    link: "/dashboard/:userID/downloads",
    iconUrl: downloads,
    id: "downloads",
  },
  {
    route: "Explore",
    link: "/explore?category=all",
    iconUrl: explore,
    id: "explore",
  },
  {
    route: "Integration",
    link: "/dashboard/:userID/integration",
    iconUrl: integration,
    id: "integration",
  },
  {
    divider: true,
    route: "",
    link: "",
    id: "divider-2",
  },
  {
    route: "Help",
    link: "/dashboard/:userID/help",
    iconUrl: help,
    id: "help",
  },
  {
    route: "Settings",
    link: "/dashboard/:userID/settings",
    iconUrl: settings,
    id: "settings",
  },
  {
    route: "Profile",
    link: "/dashboard/:userID/profile",
    iconUrl: profile,
    id: "profile",
  },
];

export const statusOptions = [
  { label: "All Products", value: "all" },
  { label: "Published", value: "published" },
  { label: "Draft", value: "draft" },
];

export const customersData = {
  data: [
    {
      id: "9ad4f0b6-aa97-49aa-9a68-f11e701e474c",

      name: "Kingsley Solomon Free",
      email: "kinxly@testemail.com",
      free_products: 5,
      sale_products: 5,
      total_order: 1,
      total_transactions: "17085",
      latest_purchase_title: "Porro cum aut.",
      latest_purchase_price: 5695,
      latest_purchase_date: "2023-12-12T15:07:02.000000Z",
      joined: "2023-12-12T15:07:02.000000Z",
      latest_purchases: [
        {
          id: "9ad4f0b6-ac34-4445-a5e8-d4dbc882d5ac",
          product_title: "Porro cum aut.",
          product_price: 5695,
          product_thumbnail:
            "https://productize.nyc3.cdn.digitaloceanspaces.com/products-thumbnail/3d_collection_showcase-20210110-0001.jpg",
          quantity: 3,
          total_amount: 17_085,
          customer_name: "Kingsley Solomon Free",
          customer_email: "kinxly@testemail.com",
          total_order: 1,
          total_sales: 17_085,
          total_views: 1,
          date: "2023-12-12T15:07:02.000000Z",
        },
        {
          id: "9ad4f0b6-ac34-4445-a5e8-d4dbc882d5ac",
          product_title: "Porro cum aut.",
          product_price: 5695,
          product_thumbnail:
            "https://productize.nyc3.cdn.digitaloceanspaces.com/products-thumbnail/3d_collection_showcase-20210110-0001.jpg",
          quantity: 3,
          total_amount: 17_085,
          customer_name: "Kingsley Solomon Free",
          customer_email: "kinxly@testemail.com",
          total_order: 1,
          total_sales: 17_085,
          total_views: 1,
          date: "2023-12-12T15:07:02.000000Z",
        },
        {
          id: "9ad4f0b6-ac34-4445-a5e8-d4dbc882d5ac",
          product_title: "Porro cum aut.",
          product_price: 5695,
          product_thumbnail:
            "https://productize.nyc3.cdn.digitaloceanspaces.com/products-thumbnail/3d_collection_showcase-20210110-0001.jpg",
          quantity: 3,
          total_amount: 17_085,
          customer_name: "Kingsley Solomon Free",
          customer_email: "kinxly@testemail.com",
          total_order: 1,
          total_sales: 17_085,
          total_views: 1,
          date: "2023-12-12T15:07:02.000000Z",
        },
      ],
    },
    {
      id: "9ad4f0b6-aa97-49aa-9a68-f11e701e474c",
      name: "Kingsley Solomon Free",
      email: "kinxly@testemail.com",
      free_products: 5,
      sale_products: 5,
      total_order: 1,
      total_transactions: "17085",
      latest_purchase_title: "Porro cum aut.",
      latest_purchase_price: 5695,
      latest_purchase_date: "2023-12-12T15:07:02.000000Z",
      joined: "2023-12-12T15:07:02.000000Z",
      latest_purchases: [
        {
          id: "9ad4f0b6-ac34-4445-a5e8-d4dbc882d5ac",
          product_title: "Porro cum aut.",
          product_price: 5695,
          product_thumbnail:
            "https://productize.nyc3.cdn.digitaloceanspaces.com/products-thumbnail/3d_collection_showcase-20210110-0001.jpg",
          quantity: 3,
          total_amount: 17_085,
          customer_name: "Kingsley Solomon Free",
          customer_email: "kinxly@testemail.com",
          total_order: 1,
          total_sales: 17_085,
          total_views: 1,
          date: "2023-12-12T15:07:02.000000Z",
        },
      ],
    },
    {
      id: "9ad4f0b6-aa97-49aa-9a68-f11e701e474c",
      name: "Kingsley Solomon Free",
      email: "kinxly@testemail.com",
      free_products: 5,
      sale_products: 5,
      total_order: 1,
      total_transactions: "17085",
      latest_purchase_title: "Porro cum aut.",
      latest_purchase_price: 5695,
      latest_purchase_date: "2023-12-12T15:07:02.000000Z",
      joined: "2023-12-12T15:07:02.000000Z",
      latest_purchases: [
        {
          id: "9ad4f0b6-ac34-4445-a5e8-d4dbc882d5ac",
          product_title: "Porro cum aut.",
          product_price: 5695,
          product_thumbnail:
            "https://productize.nyc3.cdn.digitaloceanspaces.com/products-thumbnail/3d_collection_showcase-20210110-0001.jpg",
          quantity: 3,
          total_amount: 17_085,
          customer_name: "Kingsley Solomon Free",
          customer_email: "kinxly@testemail.com",
          total_order: 1,
          total_sales: 17_085,
          total_views: 1,
          date: "2023-12-12T15:07:02.000000Z",
        },
      ],
    },
    {
      id: "9ad4f0b6-aa97-49aa-9a68-f11e701e474c",
      name: "Kingsley Solomon Free",
      email: "kinxly@testemail.com",
      free_products: 5,
      sale_products: 5,
      total_order: 1,
      total_transactions: "17085",
      latest_purchase_title: "Porro cum aut.",
      latest_purchase_price: 5695,
      latest_purchase_date: "2023-12-12T15:07:02.000000Z",
      joined: "2023-12-12T15:07:02.000000Z",
      latest_purchases: [
        {
          id: "9ad4f0b6-ac34-4445-a5e8-d4dbc882d5ac",
          product_title: "Porro cum aut.",
          product_price: 5695,
          product_thumbnail:
            "https://productize.nyc3.cdn.digitaloceanspaces.com/products-thumbnail/3d_collection_showcase-20210110-0001.jpg",
          quantity: 3,
          total_amount: 17_085,
          customer_name: "Kingsley Solomon Free",
          customer_email: "kinxly@testemail.com",
          total_order: 1,
          total_sales: 17_085,
          total_views: 1,
          date: "2023-12-12T15:07:02.000000Z",
        },
      ],
    },
    {
      id: "9ad4f0b6-aa97-49aa-9a68-f11e701e474c",
      name: "Kingsley Solomon Free",
      email: "kinxly@testemail.com",
      free_products: 5,
      sale_products: 5,
      total_order: 1,
      total_transactions: "17085",
      latest_purchase_title: "Porro cum aut.",
      latest_purchase_price: 5695,
      latest_purchase_date: "2023-12-12T15:07:02.000000Z",
      joined: "2023-12-12T15:07:02.000000Z",
      latest_purchases: [
        {
          id: "9ad4f0b6-ac34-4445-a5e8-d4dbc882d5ac",
          product_title: "Porro cum aut.",
          product_price: 5695,
          product_thumbnail:
            "https://productize.nyc3.cdn.digitaloceanspaces.com/products-thumbnail/3d_collection_showcase-20210110-0001.jpg",
          quantity: 3,
          total_amount: 17_085,
          customer_name: "Kingsley Solomon Free",
          customer_email: "kinxly@testemail.com",
          total_order: 1,
          total_sales: 17_085,
          total_views: 1,
          date: "2023-12-12T15:07:02.000000Z",
        },
      ],
    },
  ],
  meta: {
    current_page: 1,
    from: 1,
    last_page: 1,
    links: [
      {
        url: null,
        label: "&laquo; Previous",
        active: false,
      },
      {
        url: "http://localhost:8000/api/customers?page=1",
        label: "1",
        active: true,
      },
      {
        url: null,
        label: "Next &raquo;",
        active: false,
      },
    ],
    path: "http://localhost:8000/api/customers",
    per_page: 10,
    to: 1,
    total: 1,
  },
};

export const countries = [
  { value: "afghanistan", label: "🇦🇫 Afghanistan" },
  { value: "albania", label: "🇦🇱 Albania" },
  { value: "algeria", label: "🇩🇿 Algeria" },
  { value: "andorra", label: "🇦🇩 Andorra" },
  { value: "angola", label: "🇦🇴 Angola" },
  { value: "antigua_and_barbuda", label: "🇦🇬 Antigua and Barbuda" },
  { value: "argentina", label: "🇦🇷 Argentina" },
  { value: "armenia", label: "🇦🇲 Armenia" },
  { value: "australia", label: "🇦🇺 Australia" },
  { value: "austria", label: "🇦🇹 Austria" },
  { value: "azerbaijan", label: "🇦🇿 Azerbaijan" },
  { value: "bahamas", label: "🇧🇸 Bahamas" },
  { value: "bahrain", label: "🇧🇭 Bahrain" },
  { value: "bangladesh", label: "🇧🇩 Bangladesh" },
  { value: "barbados", label: "🇧🇧 Barbados" },
  { value: "belarus", label: "🇧🇾 Belarus" },
  { value: "belgium", label: "🇧🇪 Belgium" },
  { value: "belize", label: "🇧🇿 Belize" },
  { value: "benin", label: "🇧🇯 Benin" },
  { value: "bhutan", label: "🇧🇹 Bhutan" },
  { value: "bolivia", label: "🇧🇴 Bolivia" },
  { value: "bosnia_and_herzegovina", label: "🇧🇦 Bosnia and Herzegovina" },
  { value: "botswana", label: "🇧🇼 Botswana" },
  { value: "brazil", label: "🇧🇷 Brazil" },
  { value: "brunei", label: "🇧🇳 Brunei" },
  { value: "bulgaria", label: "🇧🇬 Bulgaria" },
  { value: "burkina_faso", label: "🇧🇫 Burkina Faso" },
  { value: "burundi", label: "🇧🇮 Burundi" },
  { value: "cambodia", label: "🇰🇭 Cambodia" },
  { value: "cameroon", label: "🇨🇲 Cameroon" },
  { value: "canada", label: "🇨🇦 Canada" },
  { value: "cape_verde", label: "🇨🇻 Cape Verde" },
  { value: "central_african_republic", label: "🇨🇫 Central African Republic" },
  { value: "chad", label: "🇹🇩 Chad" },
  { value: "chile", label: "🇨🇱 Chile" },
  { value: "china", label: "🇨🇳 China" },
  { value: "colombia", label: "🇨🇴 Colombia" },
  { value: "comoros", label: "🇰🇲 Comoros" },
  { value: "congo", label: "🇨🇬 Congo" },
  { value: "costa_rica", label: "🇨🇷 Costa Rica" },
  { value: "croatia", label: "🇭🇷 Croatia" },
  { value: "cuba", label: "🇨🇺 Cuba" },
  { value: "cyprus", label: "🇨🇾 Cyprus" },
  { value: "czech_republic", label: "🇨🇿 Czech Republic" },
  { value: "denmark", label: "🇩🇰 Denmark" },
  { value: "djibouti", label: "🇩🇯 Djibouti" },
  { value: "dominica", label: "🇩🇲 Dominica" },
  { value: "dominican_republic", label: "🇩🇴 Dominican Republic" },
  { value: "ecuador", label: "🇪🇨 Ecuador" },
  { value: "egypt", label: "🇪🇬 Egypt" },
  { value: "el_salvador", label: "🇸🇻 El Salvador" },
  { value: "equatorial_guinea", label: "🇬🇶 Equatorial Guinea" },
  { value: "eritrea", label: "🇪🇷 Eritrea" },
  { value: "estonia", label: "🇪🇪 Estonia" },
  { value: "ethiopia", label: "🇪🇹 Ethiopia" },
  { value: "fiji", label: "🇫🇯 Fiji" },
  { value: "finland", label: "🇫🇮 Finland" },
  { value: "france", label: "🇫🇷 France" },
  { value: "gabon", label: "🇬🇦 Gabon" },
  { value: "gambia", label: "🇬🇲 Gambia" },
  { value: "georgia", label: "🇬🇪 Georgia" },
  { value: "germany", label: "🇩🇪 Germany" },
  { value: "ghana", label: "🇬🇭 Ghana" },
  { value: "greece", label: "🇬🇷 Greece" },
  { value: "grenada", label: "🇬🇩 Grenada" },
  { value: "guatemala", label: "🇬🇹 Guatemala" },
  { value: "guinea", label: "🇬🇳 Guinea" },
  { value: "guinea_bissau", label: "🇬🇼 Guinea-Bissau" },
  { value: "guyana", label: "🇬🇾 Guyana" },
  { value: "haiti", label: "🇭🇹 Haiti" },
  { value: "honduras", label: "🇭🇳 Honduras" },
  { value: "hungary", label: "🇭🇺 Hungary" },
  { value: "iceland", label: "🇮🇸 Iceland" },
  { value: "india", label: "🇮🇳 India" },
  { value: "indonesia", label: "🇮🇩 Indonesia" },
  { value: "iran", label: "🇮🇷 Iran" },
  { value: "iraq", label: "🇮🇶 Iraq" },
  { value: "ireland", label: "🇮🇪 Ireland" },
  { value: "israel", label: "🇮🇱 Israel" },
  { value: "italy", label: "🇮🇹 Italy" },
  { value: "jamaica", label: "🇯🇲 Jamaica" },
  { value: "japan", label: "🇯🇵 Japan" },
  { value: "jordan", label: "🇯🇴 Jordan" },
  { value: "kazakhstan", label: "🇰🇿 Kazakhstan" },
  { value: "kenya", label: "🇰🇪 Kenya" },
  { value: "kiribati", label: "🇰🇮 Kiribati" },
  { value: "north_korea", label: "🇰🇵 North Korea" },
  { value: "south_korea", label: "🇰🇷 South Korea" },
  { value: "kuwait", label: "🇰🇼 Kuwait" },
  { value: "kyrgyzstan", label: "🇰🇬 Kyrgyzstan" },
  { value: "laos", label: "🇱🇦 Laos" },
  { value: "latvia", label: "🇱🇻 Latvia" },
  { value: "lebanon", label: "🇱🇧 Lebanon" },
  { value: "lesotho", label: "🇱🇸 Lesotho" },
  { value: "liberia", label: "🇱🇷 Liberia" },
  { value: "libya", label: "🇱🇾 Libya" },
  { value: "liechtenstein", label: "🇱🇮 Liechtenstein" },
  { value: "lithuania", label: "🇱🇹 Lithuania" },
  { value: "luxembourg", label: "🇱🇺 Luxembourg" },
  { value: "madagascar", label: "🇲🇬 Madagascar" },
  { value: "malawi", label: "🇲🇼 Malawi" },
  { value: "malaysia", label: "🇲🇾 Malaysia" },
  { value: "maldives", label: "🇲🇻 Maldives" },
  { value: "mali", label: "🇲🇱 Mali" },
  { value: "malta", label: "🇲🇹 Malta" },
  { value: "marshall_islands", label: "🇲🇭 Marshall Islands" },
  { value: "mauritania", label: "🇲🇷 Mauritania" },
  { value: "mauritius", label: "🇲🇺 Mauritius" },
  { value: "mexico", label: "🇲🇽 Mexico" },
  { value: "micronesia", label: "🇫🇲 Micronesia" },
  { value: "moldova", label: "🇲🇩 Moldova" },
  { value: "monaco", label: "🇲🇨 Monaco" },
  { value: "mongolia", label: "🇲🇳 Mongolia" },
  { value: "montenegro", label: "🇲🇪 Montenegro" },
  { value: "morocco", label: "🇲🇦 Morocco" },
  { value: "mozambique", label: "🇲🇿 Mozambique" },
  { value: "myanmar", label: "🇲🇲 Myanmar" },
  { value: "namibia", label: "🇳🇦 Namibia" },
  { value: "nauru", label: "🇳🇷 Nauru" },
  { value: "nepal", label: "🇳🇵 Nepal" },
  { value: "netherlands", label: "🇳🇱 Netherlands" },
  { value: "new_zealand", label: "🇳🇿 New Zealand" },
  { value: "nicaragua", label: "🇳🇮 Nicaragua" },
  { value: "niger", label: "🇳🇪 Niger" },
  { value: "nigeria", label: "🇳🇬 Nigeria" },
  { value: "norway", label: "🇳🇴 Norway" },
  { value: "oman", label: "🇴🇲 Oman" },
  { value: "pakistan", label: "🇵🇰 Pakistan" },
  { value: "palau", label: "🇵🇼 Palau" },
  { value: "palestine", label: "🇵🇸 Palestine" },
  { value: "panama", label: "🇵🇦 Panama" },
  { value: "papua_new_guinea", label: "🇵🇬 Papua New Guinea" },
  { value: "paraguay", label: "🇵🇾 Paraguay" },
  { value: "peru", label: "🇵🇪 Peru" },
  { value: "philippines", label: "🇵🇭 Philippines" },
  { value: "poland", label: "🇵🇱 Poland" },
  { value: "portugal", label: "🇵🇹 Portugal" },
  { value: "qatar", label: "🇶🇦 Qatar" },
  { value: "romania", label: "🇷🇴 Romania" },
  { value: "russia", label: "🇷🇺 Russia" },
  { value: "rwanda", label: "🇷🇼 Rwanda" },
  { value: "saint_kitts_and_nevis", label: "🇰🇳 Saint Kitts and Nevis" },
  { value: "saint_lucia", label: "🇱🇨 Saint Lucia" },
  { value: "saint_vincent", label: "🇻🇨 Saint Vincent and the Grenadines" },
  { value: "samoa", label: "🇼🇸 Samoa" },
  { value: "san_marino", label: "🇸🇲 San Marino" },
  { value: "sao_tome_and_principe", label: "🇸🇹 São Tomé and Príncipe" },
  { value: "saudi_arabia", label: "🇸🇦 Saudi Arabia" },
  { value: "senegal", label: "🇸🇳 Senegal" },
  { value: "serbia", label: "🇷🇸 Serbia" },
  { value: "seychelles", label: "🇸🇨 Seychelles" },
  { value: "sierra_leone", label: "🇸🇱 Sierra Leone" },
  { value: "singapore", label: "🇸🇬 Singapore" },
  { value: "slovakia", label: "🇸🇰 Slovakia" },
  { value: "slovenia", label: "🇸🇮 Slovenia" },
  { value: "solomon_islands", label: "🇸🇧 Solomon Islands" },
  { value: "somalia", label: "🇸🇴 Somalia" },
  { value: "south_africa", label: "🇿🇦 South Africa" },
  { value: "south_sudan", label: "🇸🇸 South Sudan" },
  { value: "spain", label: "🇪🇸 Spain" },
  { value: "sri_lanka", label: "🇱🇰 Sri Lanka" },
  { value: "sudan", label: "🇸🇩 Sudan" },
  { value: "suriname", label: "🇸🇷 Suriname" },
  { value: "sweden", label: "🇸🇪 Sweden" },
  { value: "switzerland", label: "🇨🇭 Switzerland" },
  { value: "syria", label: "🇸🇾 Syria" },
  { value: "taiwan", label: "🇹🇼 Taiwan" },
  { value: "tajikistan", label: "🇹🇯 Tajikistan" },
  { value: "tanzania", label: "🇹🇿 Tanzania" },
  { value: "thailand", label: "🇹🇭 Thailand" },
  { value: "timor_leste", label: "🇹🇱 Timor-Leste" },
  { value: "togo", label: "🇹🇬 Togo" },
  { value: "tonga", label: "🇹🇴 Tonga" },
  { value: "trinidad_and_tobago", label: "🇹🇹 Trinidad and Tobago" },
  { value: "tunisia", label: "🇹🇳 Tunisia" },
  { value: "turkey", label: "🇹🇷 Turkey" },
  { value: "turkmenistan", label: "🇹🇲 Turkmenistan" },
  { value: "tuvalu", label: "🇹🇻 Tuvalu" },
  { value: "uganda", label: "🇺🇬 Uganda" },
  { value: "ukraine", label: "🇺🇦 Ukraine" },
  { value: "united_arab_emirates", label: "🇦🇪 United Arab Emirates" },
  { value: "united_kingdom", label: "🇬🇧 United Kingdom" },
  { value: "united_states", label: "🇺🇸 United States" },
  { value: "uruguay", label: "🇺🇾 Uruguay" },
  { value: "uzbekistan", label: "🇺🇿 Uzbekistan" },
  { value: "vanuatu", label: "🇻🇺 Vanuatu" },
  { value: "vatican_city", label: "🇻🇦 Vatican City" },
  { value: "venezuela", label: "🇻🇪 Venezuela" },
  { value: "vietnam", label: "🇻🇳 Vietnam" },
  { value: "yemen", label: "🇾🇪 Yemen" },
  { value: "zambia", label: "🇿🇲 Zambia" },
  { value: "zimbabwe", label: "🇿🇼 Zimbabwe" },
];

export const documentType = [
  {
    value: `National Id Card`,
    label: `National ID Card`,
  },
  {
    value: `National Passport`,
    label: `National Passport`,
  },
];

export const months = [
  { value: "1", label: "January" },
  { value: "2", label: "February" },
  { value: "3", label: "March" },
  { value: "4", label: "April" },
  { value: "5", label: "May" },
  { value: "6", label: "June" },
  { value: "7", label: "July" },
  { value: "8", label: "August" },
  { value: "9", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

export const externalNavlinks = [
  {
    id: 3,
    name: "Explore",
    path: "/explore",
    type: "dropdown",
    subLinks: [{ id: 1, name: "All", path: "/explore?category=all", type: "link" }],
  },
  { id: 5, name: "Features", path: "/features", type: "link" },
  { id: 4, name: "Pricing", path: "/pricing", type: "link" },
];

export const cards: CardData[] = [
  {
    image: "https://res.cloudinary.com/kingsleysolomon/image/upload/v1699951006/productize/Image_1_wc3l2p_a7lovq.png",
    title: "Digital Product",
    description: "Ebooks, video content, digital art/graphics, online courses or stock photos.",
  },
  {
    image: "https://res.cloudinary.com/kingsleysolomon/image/upload/v1721286358/productize/gkw6ietvs5asmzsqlkkk.png",
    title: "Sales Dashboard",
    description: "Monitor real-time sales data, track trends, and optimize your business.",
  },
  {
    image: "https://res.cloudinary.com/kingsleysolomon/image/upload/v1721286358/productize/obodmkoin4emt8vhncll.png",
    title: "Product Analytics",
    description: "Gain valuable insights into your product performance and understand user engagement.",
  },
  {
    image: "https://res.cloudinary.com/kingsleysolomon/image/upload/v1721286358/productize/wl8tu0t12l1fse6gm8tw.png",
    title: "Branded Profiles",
    description: "Showcase your unique identity with a personalized profile and connect with your audience.",
  },
];

export const homeSteps = [
  {
    title: "Customize your profile",
    description: "Start off by putting in your details and customizing what you want your profile to look like.",
    imageSrc:
      "https://res.cloudinary.com/kingsleysolomon/image/upload/v1699951004/productize/Illustration_jzxpjd_zawis9.png",
  },
  {
    title: "Set up your payout",
    description: "Put in your payment details and get ready to receive payments from all over the world.",
    imageSrc:
      "https://res.cloudinary.com/kingsleysolomon/image/upload/v1699951033/productize/Illustration_1_wdmvgf_jpnhgm.png",
  },
  {
    title: "Create your first product",
    description:
      "Upload your first product on our platform and put in the necessary details to ensure customers can get a feel of what you’re selling.",
    imageSrc:
      "https://res.cloudinary.com/kingsleysolomon/image/upload/v1699951002/productize/Illustration_2_zibmgb_aun5ux.png",
  },
  {
    title: "Make your first sale",
    description: "Patiently await your first customer and make your first sale.",
    imageSrc:
      "https://res.cloudinary.com/kingsleysolomon/image/upload/v1699951025/productize/Frame_40446_y425kr_pcfgv4.png",
  },
];

export const aboutSteps = [
  {
    title: "Flexible Product Options",
    description:
      "Sell a variety of digital products, including courses, eBooks, software, music, and more. Customize your product pages with detailed descriptions, multimedia, and personalized settings.",
  },
  {
    title: "Affiliate Programs",
    description:
      "Leverage our built-in affiliate marketing features to expand your product reach. Collaborate with affiliates who promote your products in exchange for commissions.",
  },
  {
    title: "Secure Transactions",
    description:
      "Our platform ensures secure and seamless transactions, giving both sellers and buyers peace of mind. Our commitment to security extends to regular audits and compliance with industry standards",
  },
  {
    title: "Community Engagement",
    description:
      "Join a vibrant community of creators and entrepreneurs. Share insights and learn from others’ experiences. Our platform fosters an environment of innovation, where you can network with like-minded individuals",
  },
];

export const termsandconditions = [
  {
    title: "1. Acceptance of Terms",
    text: "By accessing Bytealley’s website or using our digital products, you agree to these Terms and Conditions, as well as any additional terms that may apply to specific features or services. If you do not agree to these terms, please do not use our platform.",
    points: [],
  },
  {
    title: "2. Information We Collect",
    text: "You must be at least 18 years old to use Bytealley. By accessing our services, you represent and warrant that you are legally capable of entering into binding contracts and that all information you provide is accurate and up-to-date.",
    points: [],
  },
  {
    title: "3. User Accounts",
    text: "To access certain features of Bytealley, you may be required to create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities conducted under your account. If you suspect unauthorized use of your account, you must notify us immediately. Bytealley reserves the right to suspend or terminate any account that violates these Terms.",
    points: [],
  },
  {
    title: "4. Purchasing Digital Products",
    text: "When you purchase digital products on Bytealley, you agree to provide accurate billing and payment information. All sales are final, and refunds are only offered under certain conditions in compliance with our Refund Policy. We reserve the right to limit or refuse orders.",
    points: [],
  },
  {
    title: "5. Your Rights and Choices",
    text: "When you submit content (e.g., reviews, comments) to Bytealley, you grant us a non-exclusive, royalty-free, and transferable license to use, modify, and distribute that content. You must ensure that your content does not violate any third-party rights or applicable laws. We reserve the right to remove any content that breaches these Terms. ",
    points: [],
  },
  {
    title: "6. Prohibited Activities",
    text: " You agree not to use Bytealley for any unlawful or harmful activities. Bytealley reserves the right to investigate and take legal action against users who violate these terms including but not limited to: Violating any applicable laws or regulations. Infringing on intellectual property rights. Uploading harmful or malicious software (e.g., viruses, malware). Spamming, phishing, or engaging in other deceptive practices.",
    points: [
      "Violating any applicable laws or regulations.",
      "Infringing on intellectual property rights.",
      "Uploading harmful or malicious software (e.g., viruses, malware).",
      "Spamming, phishing, or engaging in other deceptive practices.",
    ],
  },
  {
    title: "7. Intellectual Property",
    text: "All content available on Bytealley, including but not limited to text, images, videos, and logos, is the property of Bytealley or its licensors. You may not reproduce, distribute, or otherwise use any of the content without prior written consent from Bytealley.",
    points: [],
  },
  {
    title: "8. Third-Party Links",
    text: "Our platform may contain links to third-party websites. Bytealley is not responsible for the content, privacy policies, or practices of these websites. Accessing third-party sites is at your own risk.",
    points: [],
  },
  {
    title: "9. Limitation of Liability",
    text: "To the fullest extent permitted by law, Bytealley and its affiliates will not be liable for any direct, indirect, incidental, or consequential damages arising from your use of our services. This includes, but is not limited to, loss of profits, data loss, or damage caused by unauthorized access to your account.",
    points: [],
  },
  {
    title: "10. Termination",
    text: "Bytealley reserves the right to suspend or terminate your access to the platform at any time, without notice, for any reason, including but not limited to violating these Terms and Conditions. Upon termination, you must cease using Bytealley immediately.",
    points: [],
  },
  {
    title: "11. Modifications to the Terms",
    text: "We may update these Terms and Conditions from time to time. Any changes will be posted on this page with an updated effective date. By continuing to use Bytealley after changes are made, you agree to be bound by the updated terms.",
    points: [],
  },
  {
    title: "12. Governing Law",
    text: "These Terms and Conditions shall be governed by and construed in accordance with the laws, without regard to its conflict of law principles. Any disputes arising from your use of Bytealley will be subject to the exclusive jurisdiction of the courts.",
    points: [],
  },
  {
    title: "13. Contact Us",
    text: "If you have any questions or concerns about this Privacy Policy, please contact us at: Email: info@trybytealley.com",
    points: [],
  },
];

export const policies = [
  {
    title: "1. Introduction",
    text: "Welcome to Bytealley! We respect your privacy and are committed to protecting the personal information you share. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website or use our digital products.",
    points: [],
  },
  {
    title: "2. Information We Collect",
    text: "We may collect the following types of information:",
    points: [
      "Personal Information: This includes your name, email address, payment details, and any other information you provide when creating an account, purchasing products, or contacting us.",
      "Usage Data: We collect information about how you interact with our site, such as your IP address, browser type, operating system, referral URLs, and pages viewed.",
      "Cookies and Tracking Technologies: We use cookies, web beacons, and similar technologies to track your activities on our site and gather usage data.",
    ],
  },
  {
    title: "3. How We Use Your Information",
    text: "We use the collected information for various purposes, including:",
    points: [
      "To Provide and Improve Our Services: Your information helps us operate and enhance our digital products and services.",
      "To Process Transactions: We use your personal information to process payments and deliver purchased products.",
      "To Communicate with You: We may send you emails regarding your account, transactions, or updates about our services.",
      "For Marketing and Advertising: With your consent, we may use your information to inform you about promotions, new products, and special offers.",
      "To Ensure Security: We may use your data to detect and prevent fraud, abuse, or other harmful activities.",
    ],
  },
  {
    title: "4. Sharing Your Information",
    text: "We may share your information with third parties in the following situations:",
    points: [
      "Service Providers: We may share your information with third-party vendors who help us provide and improve our services (e.g., payment processors, hosting services).",
      "Legal Requirements: We may disclose your information if required by law or in response to legal requests.",
      "Business Transfers: If Bytealley is involved in a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction.",
    ],
  },
  {
    title: "5. Your Rights and Choices",
    text: " ",
    points: [
      "Access and Update: You can access and update your personal information by logging into your account.",
      "Opt-Out: You may opt out of receiving promotional communications by following the unsubscribe instructions in those emails.",
      "Cookies: You can control cookies through your browser settings and other tools.",
      "Data Deletion: You can request the deletion of your account and personal data by contacting us.",
    ],
  },
  {
    title: "6. Security",
    text: "We take reasonable measures to protect your information from unauthorized access, alteration, or disclosure. However, no internet-based service can be 100% secure, and we cannot guarantee absolute security.",
    points: [],
  },
  {
    title: "7. Children’s Privacy",
    text: "Bytealley is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If we discover that we have inadvertently collected such information, we will promptly delete it.",
    points: [],
  },
  {
    title: "8. Changes to This Privacy",
    text: "We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated effective date. We encourage you to review this policy periodically.",
    points: [],
  },
  {
    title: "9. Contact Us",
    text: "If you have any questions or concerns about this Privacy Policy, please contact us at: Email: info@trybytealley.com",
    points: [],
  },
];
