"use client";

import { UserPlus } from "lucide-react";
import { UsersHeader } from "@/components/app/users/UsersHeader";
import { MembersTable } from "@/components/app/users/MembersTable";
import { PendingInvitations } from "@/components/app/users/PendingInvitations";
import { PermissionAlert } from "@/components/app/users/PermissionAlert";
import { InviteMemberDialog } from "@/components/app/users/InviteMemberDialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useUsers, PLAN_MEMBER_LIMIT, INVITATIONS_PAGE_SIZE } from "@/components/app/users/useUsers";

export default function UsersPage() {
  const {
    currentUser,
    roles,
    invitations,
    inviteOpen,
    setInviteOpen,
    activeMembers,
    canManage,
    canActOn,
    tab,
    setTab,
    search,
    handleSearchChange,
    statusFilter,
    handleStatusChange,
    roleFilter,
    handleRoleChange,
    membersPage,
    setMembersPage,
    membersPageCount,
    membersPageSize,
    paginatedMembers,
    totalMembers,
    invPage,
    setInvPage,
    invPageCount,
    paginatedInvitations,
    handleInvite,
    handleResend,
    handleRevoke,
    handleSuspend,
    handleReactivate,
    handleRemove,
    handleChangeRole,
  } = useUsers();

  return (
    <div className="space-y-5">
      <UsersHeader
        membersCount={activeMembers.length}
        memberLimit={PLAN_MEMBER_LIMIT}
        canManage={canManage}
        onInvite={() => setInviteOpen(true)}
      />

      <Tabs value={tab} onValueChange={(v) => setTab(v as "members" | "invitations")}>
        <TabsList>
          <TabsTrigger value="members">Miembros</TabsTrigger>
          <TabsTrigger value="invitations">
            Invitaciones
            {invitations.length > 0 && (
              <span className="ml-1 inline-flex min-w-4 items-center justify-center rounded-full bg-primary/15 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                {invitations.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="members">
          <MembersTable
            members={paginatedMembers}
            roles={roles}
            canActOn={canActOn}
            onSuspend={handleSuspend}
            onReactivate={handleReactivate}
            onRemove={handleRemove}
            onChangeRole={handleChangeRole}
            search={search}
            onSearchChange={handleSearchChange}
            statusFilter={statusFilter}
            onStatusChange={handleStatusChange}
            roleFilter={roleFilter}
            onRoleChange={handleRoleChange}
            page={membersPage}
            pageCount={membersPageCount}
            onPage={setMembersPage}
            totalItems={totalMembers}
            pageSize={membersPageSize}
          />
        </TabsContent>

        <TabsContent value="invitations">
          <PendingInvitations
            invitations={paginatedInvitations}
            roles={roles}
            canManage={canManage}
            onResend={handleResend}
            onRevoke={handleRevoke}
            page={invPage}
            pageCount={invPageCount}
            onPageChange={setInvPage}
            totalItems={invitations.length}
            pageSize={INVITATIONS_PAGE_SIZE}
          />
        </TabsContent>
      </Tabs>

      {tab === "invitations" && invitations.length === 0 && activeMembers.length > 0 && (
        <button
          type="button"
          onClick={() => setInviteOpen(true)}
          disabled={!canManage}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80"
        >
          <UserPlus className="size-4" />
          Invitar al primer miembro
        </button>
      )}

      {!canManage && <PermissionAlert />}

      <InviteMemberDialog
        open={inviteOpen}
        onOpenChange={setInviteOpen}
        roles={roles}
        memberLimit={PLAN_MEMBER_LIMIT}
        membersCount={activeMembers.length}
        onInvite={handleInvite}
        currentUserEmail={currentUser?.email ?? ""}
      />
    </div>
  );
}