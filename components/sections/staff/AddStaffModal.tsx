"use client";

import { Button } from "@/components/ui"
import { Input } from "@/components/ui"
import { Label } from "@/components/ui"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { useAddStaffApi } from "lib";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { mapRolesToDisplay, useGetAllRolesApi } from "lib";
import { Role } from "types";

export function AddStaffModal() {

  const [open , setOpen] = useState(false)

  const session = useSession()
  const accessToken = session.data?.accessToken
  const agencyId = session.data?.user.agencyId
  const {mutate: addStaff , isPending } = useAddStaffApi()
  const {data, isLoading: rolesLoading} = useGetAllRolesApi()

  

  const roles = data?.roles ? mapRolesToDisplay(data.roles as Role[]) : [];

  const [staffInfo , setStaffInfo] = useState({
    fullName : '',
    email: '',
    phone: '',
    roleId : '',
    password : ''
  })

  const handleSubmitStaff = (e: React.FormEvent) => {
    e.preventDefault()
    if (!accessToken || !agencyId) {
      toast.error('Cannot add staff currently')
      return
    }
    addStaff({
      email: staffInfo.email,
      fullname: staffInfo.fullName,
      roleId: staffInfo.roleId,
      phone: staffInfo.phone,
      password: staffInfo.password,
      accessToken: accessToken,
      agencyId: agencyId,
    }, {
      onSuccess: () => {
        toast.success('Staff added successfully')
        setStaffInfo({
          email: '',
          fullName: '',
          password: '',
          phone: '',
          roleId: ''
        })
        setOpen(false)
      }
    });
  }

  



  return (

    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button>
            <Plus className="h-4 w-4" />
            Add Staff Member
          </Button>
        }
      />

      <DialogContent className="max-w-lg border-cf-border bg-cf-surface">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-cf-ink">
            Add Staff Member
          </DialogTitle>
          <DialogDescription className="text-cf-ink-60">
            Fill in the details below to add a new staff member to your agency.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmitStaff}>
        <div className="space-y-6 py-4">

          <div className="space-y-2">
            <Label
              htmlFor="name"
              className="text-sm font-semibold text-cf-ink"
            >
              Full Name <span className="text-cf-error">*</span>
            </Label>
            <Input
              id="name"
              type="text"
              value={staffInfo.fullName}
              onChange={(e) => setStaffInfo({ ...staffInfo, fullName: e.target.value })}
              placeholder="e.g., John Doe"
              className="border-cf-border bg-cf-surface-inset text-cf-ink placeholder:text-cf-ink-40"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-sm font-semibold text-cf-ink"
            >
              Email Address <span className="text-cf-error">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              value={staffInfo.email}
              onChange={(e) => setStaffInfo({ ...staffInfo, email: e.target.value })}
              placeholder="john@careflow.app"
              className="border-cf-border bg-cf-surface-inset text-cf-ink placeholder:text-cf-ink-40"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="phone"
              className="text-sm font-semibold text-cf-ink"
            >
              Phone Number
            </Label>
            <Input
              id="phone"
              type="tel"
              value={staffInfo.phone}
              onChange={(e) => setStaffInfo({ ...staffInfo, phone: e.target.value })}
              placeholder="020 7123 4567"
              className="border-cf-border bg-cf-surface-inset text-cf-ink placeholder:text-cf-ink-40"
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="password"
              className="text-sm font-semibold text-cf-ink"
            >
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={staffInfo.password}
              onChange={(e) => setStaffInfo({ ...staffInfo, password: e.target.value })}
              placeholder=""
              className="border-cf-border bg-cf-surface-inset text-cf-ink placeholder:text-cf-ink-40"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="role"
              className="text-sm font-semibold text-cf-ink"
            >
              Role <span className="text-cf-error">*</span>
            </Label>
            <Select
            value={staffInfo.roleId}
            onValueChange={(value) => setStaffInfo({ ...staffInfo, roleId: value! })}
            >
              <SelectTrigger
                id="role"
                className="border-cf-border bg-cf-surface-inset text-cf-ink"
              >
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent className="bg-cf-surface border-cf-border">
                {rolesLoading ? (
                    <div className="p-2 text-sm text-cf-ink-60">Loading roles...</div>
                  ) : roles.length === 0 ? (
                    <div className="p-2 text-sm text-cf-ink-60">No roles available</div>
                  ) : (
                    roles.map((role) => (
                      <SelectItem value={role.id} key={role.id}>
                        {role.displayName || role.name}
                      </SelectItem>
                    ))
                  )}
              </SelectContent>
            </Select>
          </div>
        </div>


        <div className="flex gap-3 border-t border-cf-border-light pt-6">
          <DialogTrigger >
            <Button
              variant="outline"
              className="border-cf-border bg-cf-surface text-cf-ink hover:bg-cf-surface-muted"
            >
              Cancel
            </Button>
          </DialogTrigger>
          <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Staff Member"
              )}
            </Button>
        </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}