"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { trainerService } from "@/services";
import { Trainer } from "@/types";
import { useReactTable, getCoreRowModel, ColumnDef, flexRender } from "@tanstack/react-table";
import { Button, Card, Avatar, StatusBadge, SearchBar, PageHeader, EmptyState, Skeleton, Badge } from "@/components/ui";
import { formatCurrency, cn } from "@/lib/utils";
import { Plus, MoreHorizontal, Eye, Pencil, Trash2, Dumbbell, ChevronLeft, ChevronRight, Star } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { mockBranches } from "@/mock/data";

export default function TrainersPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [branchId, setBranchId] = useState("");
  const [page, setPage] = useState(1);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["trainers", { search, status, branchId, page }],
    queryFn: () => trainerService.getTrainers({ search, status, branchId, page, limit: 10 }),
    placeholderData: (prev) => prev,
  });

  const deleteMutation = useMutation({
    mutationFn: trainerService.deleteTrainer,
    onSuccess: () => { toast.success("Trainer removed"); qc.invalidateQueries({ queryKey: ["trainers"] }); },
    onError: () => toast.error("Failed to delete trainer"),
  });

  const columns: ColumnDef<Trainer>[] = [
    {
      id: "trainer",
      header: "Trainer",
      cell: ({ row: { original: t } }) => (
        <div className="flex items-center gap-3">
          <Avatar name={t.name} size="sm" />
          <div>
            <Link href={`/trainers/${t.id}`} className="text-sm font-medium hover:text-brand transition-colors">{t.name}</Link>
            <p className="text-xs text-muted-foreground">{t.email}</p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "specialization",
      header: "Specialization",
      cell: ({ getValue }) => (
        <div className="flex flex-wrap gap-1">
          {(getValue<string[]>()).slice(0, 2).map(s => (
            <Badge key={s} variant="outline" className="text-xs">{s}</Badge>
          ))}
        </div>
      ),
    },
    { accessorKey: "experience", header: "Experience", cell: ({ getValue }) => <span className="text-sm">{getValue<number>()} yrs</span> },
    {
      accessorKey: "rating",
      header: "Rating",
      cell: ({ getValue }) => {
        const r = getValue<number>();
        return (
          <div className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span className="text-sm font-medium">{r > 0 ? r.toFixed(1) : "—"}</span>
          </div>
        );
      },
    },
    { accessorKey: "assignedMembers", header: "Members", cell: ({ getValue }) => <span className="text-sm">{getValue<number>()}</span> },
    { accessorKey: "salary", header: "Salary", cell: ({ getValue }) => <span className="text-sm">{formatCurrency(getValue<number>())}</span> },
    { accessorKey: "status", header: "Status", cell: ({ getValue }) => <StatusBadge status={getValue<string>()} /> },
    {
      id: "actions",
      header: "",
      cell: ({ row: { original: t } }) => (
        <div className="relative">
          <Button variant="ghost" size="icon-sm" onClick={() => setOpenMenu(openMenu === t.id ? null : t.id)}>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
          {openMenu === t.id && (
            <div className="absolute right-0 top-full mt-1 bg-popover border border-border rounded-xl shadow-lg py-1 w-40 z-50">
              <Link href={`/trainers/${t.id}`} className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted transition-colors" onClick={() => setOpenMenu(null)}>
                <Eye className="h-3.5 w-3.5" />View
              </Link>
              <Link href={`/trainers/${t.id}/edit`} className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted transition-colors" onClick={() => setOpenMenu(null)}>
                <Pencil className="h-3.5 w-3.5" />Edit
              </Link>
              <button
                className="flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-muted transition-colors w-full"
                onClick={() => { deleteMutation.mutate(t.id); setOpenMenu(null); }}
              >
                <Trash2 className="h-3.5 w-3.5" />Delete
              </button>
            </div>
          )}
        </div>
      ),
    },
  ];

  const table = useReactTable({ data: data?.data ?? [], columns, getCoreRowModel: getCoreRowModel() });

  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader
        title="Trainers"
        description={data ? `${data.total} trainers total` : ""}
        action={
          <Link href="/trainers/new">
            <Button variant="brand" size="sm" className="gap-1.5">
              <Plus className="h-4 w-4" />Add trainer
            </Button>
          </Link>
        }
      />

      <div className="flex flex-wrap gap-2">
        <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search trainers…" className="w-64" />
        <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          className="h-9 rounded-lg border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="on_leave">On Leave</option>
        </select>
        <select value={branchId} onChange={(e) => { setBranchId(e.target.value); setPage(1); }}
          className="h-9 rounded-lg border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <option value="">All branches</option>
          {mockBranches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              {table.getHeaderGroups().map(hg => (
                <tr key={hg.id} className="border-b border-border">
                  {hg.headers.map(h => (
                    <th key={h.id} className="text-left px-5 py-3 text-xs font-medium text-muted-foreground whitespace-nowrap">
                      {flexRender(h.column.columnDef.header, h.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i} className="border-b border-border">
                    {columns.map((_, j) => <td key={j} className="px-5 py-3"><Skeleton className="h-4 w-full" /></td>)}
                  </tr>
                ))
              ) : table.getRowModel().rows.length === 0 ? (
                <tr><td colSpan={columns.length}>
                  <EmptyState icon={<Dumbbell className="h-8 w-8" />} title="No trainers found" description="Try adjusting your search or filters."
                    action={<Link href="/trainers/new"><Button variant="brand" size="sm">Add trainer</Button></Link>} />
                </td></tr>
              ) : (
                table.getRowModel().rows.map(row => (
                  <tr key={row.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} className="px-5 py-3 whitespace-nowrap">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {data && data.totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-border">
            <p className="text-xs text-muted-foreground">Showing {((page - 1) * 10) + 1}–{Math.min(page * 10, data.total)} of {data.total}</p>
            <div className="flex gap-1">
              <Button variant="outline" size="icon-sm" onClick={() => setPage(p => p - 1)} disabled={page === 1}><ChevronLeft className="h-4 w-4" /></Button>
              {Array.from({ length: Math.min(5, data.totalPages) }, (_, i) => (
                <Button key={i + 1} variant={page === i + 1 ? "brand" : "outline"} size="icon-sm" onClick={() => setPage(i + 1)}>{i + 1}</Button>
              ))}
              <Button variant="outline" size="icon-sm" onClick={() => setPage(p => p + 1)} disabled={page === data.totalPages}><ChevronRight className="h-4 w-4" /></Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
