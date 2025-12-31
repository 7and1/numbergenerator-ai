import Link from "next/link";
import { CONFIG_MAP } from "@/lib/configMap";
import type { ToolConfig } from "@/lib/types";
import { Hash, Lock, Ticket, Box, Circle, List, Dice1 } from "lucide-react";

const CATEGORY_CONFIG = [
  {
    id: "random-numbers",
    title: "Random Number Generators",
    description: "Generate random numbers in any range with advanced options",
    icon: Dice1,
    color: "text-blue-500",
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
    borderColor: "border-blue-200 dark:border-blue-900",
  },
  {
    id: "passwords-pins",
    title: "Passwords & PINs",
    description: "Create secure passwords and PIN codes for your accounts",
    icon: Lock,
    color: "text-emerald-500",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
    borderColor: "border-emerald-200 dark:border-emerald-900",
  },
  {
    id: "lottery",
    title: "Lottery Number Pickers",
    description:
      "Generate lucky numbers for Powerball, Mega Millions, and more",
    icon: Ticket,
    color: "text-purple-500",
    bgColor: "bg-purple-50 dark:bg-purple-950/30",
    borderColor: "border-purple-200 dark:border-purple-900",
  },
  {
    id: "dice",
    title: "Dice Rollers",
    description: "Roll virtual dice for D&D, board games, and tabletop gaming",
    icon: Box,
    color: "text-amber-500",
    bgColor: "bg-amber-50 dark:bg-amber-950/30",
    borderColor: "border-amber-200 dark:border-amber-900",
  },
  {
    id: "coins",
    title: "Coin Flippers",
    description: "Flip coins for decisions with statistics tracking",
    icon: Circle,
    color: "text-orange-500",
    bgColor: "bg-orange-50 dark:bg-orange-950/30",
    borderColor: "border-orange-200 dark:border-orange-900",
  },
  {
    id: "list-tools",
    title: "List & Pick Tools",
    description: "Pick from lists, shuffle items, and spin wheels",
    icon: List,
    color: "text-rose-500",
    bgColor: "bg-rose-50 dark:bg-rose-950/30",
    borderColor: "border-rose-200 dark:border-rose-900",
  },
];

interface ToolLinkProps {
  tool: ToolConfig;
}

function ToolLink({ tool }: ToolLinkProps) {
  return (
    <Link
      href={`/${tool.slug}`}
      className="group rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/30 p-3 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors"
    >
      <div className="font-medium text-sm text-zinc-900 dark:text-zinc-100 group-hover:underline underline-offset-4">
        {tool.title}
      </div>
    </Link>
  );
}

export default function ToolHub() {
  // Group tools by category
  const toolsByCategory = CATEGORY_CONFIG.map((category) => ({
    ...category,
    tools: Object.values(CONFIG_MAP).filter(
      (tool) =>
        tool.category === category.id && !tool.slug.startsWith("template-"),
    ),
  })).filter((category) => category.tools.length > 0);

  return (
    <section className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-black tracking-tight">
          Explore All Tools
        </h2>
        <p className="mt-2 text-zinc-500 dark:text-zinc-400">
          Fast, secure, and free random generators for every need
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {toolsByCategory.map((category) => {
          const Icon = category.icon;
          return (
            <div
              key={category.id}
              className={`rounded-2xl border ${category.borderColor} ${category.bgColor} p-6`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`p-2 rounded-xl bg-white dark:bg-black ${category.color} ${category.borderColor} border`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-zinc-900 dark:text-zinc-100">
                    {category.title}
                  </h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    {category.description}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {category.tools.map((tool) => (
                  <ToolLink key={tool.slug} tool={tool} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
