"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { staffService } from "@/services";
import { Staff } from "@/types";
import { useReactTable, getCoreRowModel, ColumnDef, flexRender } from "@tanstack/react-table";
import { Button, Card, Avatar, StatusBadge, SearchBar, PageHeader, EmptyState, Skeleton, Badge } from "@/components/ui";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Plus, MoreHorizontal, Pencil, Trash2, UserCog, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

const roleLabels: Record<string, string> = {
  receptionist: "Receptionist",
  manager: "Manager",
  cleaner: "Cleaner",
  maintenance: "Maintenance",
  other: "Other",
};

export default function StaffPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["staff", { search, status, page }],
    queryFn: () => staffService.getStaff({ search, status, page, limit: 10 }),
    placeholderData: (prev) => prev,
  });

  const deleteMutation = useMutation({
    mutationFn: staffService.deleteStaff,
    onSuccess: () => { toast.success("Staff member removed"); qc.invalidateQueries({ queryKey: ["staff"] }); },
    onError: () => toast.error("Failed to delete"),
  });

  const columns: ColumnDef<Staff>[] = [
    {
      id: "staff",
      header: "Name",
      cell: ({ row: { original: s } }) => (
        <div className="flex items-center gap-3">
          <Avatar name={s.name} size="sm" />
          <div>
            <p className="text-sm font-medium">{s.name}</p>
            <p className="text-xs text-muted-foreground">{s.email}</p>
          </div>
        </div>
      ),
    },
    { accessorKey: "phone", header: "Phone", cell: ({ getValue }) => <span className="text-sm text-muted-foreground">{getValue<string>()}</span> },
    { accessorKey: "role", header: "Role", cell: ({ getValue }) => <Badge variant="outline" className="text-xs capitalize">{roleLabels[getValue<string>()] ?? getValue<string>()}</Badge> },
    { accessorKey: "salary", header: "Salary", cell: ({ getValue }) => <span className="text-sm">{formatCurrency(getValue<number>())}</span> },
    { accessorKey: "joinDate", header: "Joined", cell: ({ getValue }) => <span className="text-sm">{formatDate(getValue<string>())}</span> },
    { accessorKey: "status", header: "Status", cell: ({ getValue }) => <StatusBadge status={getValue<string>()} /> },
    {
      id: "actions",
      header: "",
      cell: ({ row: { original: s } }) => (
        <div className="relative">
          <Button variant="ghost" size="icon-sm" onClick={() => setOpenMenu(openMenu === s.id ? null : s.id)}>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
          {openMenu === s.id && (
            <div className="absolute right-0 top-full mt-1 bg-popover border border-border rounded-xl shadow-lg py-1 w-40 z-50">
              <Link href={`/staff/${s.id}/edit`} className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted transition-colors" onClick={() => setOpenMenu(null)}>
                <Pencil className="h-3.5 w-3.5" />Edit
              </Link>
              <button
                className="flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-muted transition-colors w-full"
                onClick={() => { deleteMutation.mutate(s.id); setOpenMenu(null); }}
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
        title="Staff"
        description={data ? `${data.total} staff members` : ""}
        action={
          <Link href="/staff/new">
            <Button variant="brand" size="sm" className="gap-1.5">
              <Plus className="h-4 w-4" />Add staff
            </Button>
          </Link>
        }
      />

      <div className="flex flex-wrap gap-2">
        <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search staff…" className="w-64" />
        <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          className="h-9 rounded-lg border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
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
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="border-b border-border">
                    {columns.map((_, j) => <td key={j} className="px-5 py-3"><Skeleton className="h-4 w-full" /></td>)}
                  </tr>
                ))
              ) : table.getRowModel().rows.length === 0 ? (
                <tr><td colSpan={columns.length}>
                  <EmptyState icon={<UserCog className="h-8 w-8" />} title="No staff found"
                    action={<Link href="/staff/new"><Button variant="brand" size="sm">Add staff member</Button></Link>} />
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
