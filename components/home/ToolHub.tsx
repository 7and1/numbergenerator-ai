import Link from "next/link";
import { memo } from "react";
import { CONFIG_MAP } from "@/lib/configMap";
import type { ToolConfig } from "@/lib/types";
import { Lock, Ticket, Box, Circle, List, Dice1 } from "lucide-react";

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

const ToolLink = memo(function ToolLink({ tool }: ToolLinkProps) {
  return (
    <Link
      href={`/${tool.slug}`}
      className="group rounded-lg border border-zinc-200/60 dark:border-zinc-800/60 bg-white/80 dark:bg-zinc-900/50 p-3 hover:border-violet-300 dark:hover:border-violet-700/50 hover:bg-violet-50/80 dark:hover:bg-violet-950/20 transition-all duration-200"
    >
      <div className="font-medium text-sm text-zinc-900 dark:text-zinc-100 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors duration-200">
        {tool.title}
      </div>
    </Link>
  );
});

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
    <section className="space-y-8" aria-labelledby="tool-hub-heading">
      <div className="text-center">
        <h2
          id="tool-hub-heading"
          className="text-3xl font-black tracking-tight"
        >
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
                  aria-hidden="true"
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
