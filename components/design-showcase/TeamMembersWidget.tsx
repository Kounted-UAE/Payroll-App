import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const TeamMembersWidget = () => {
  const teamMembers = [
    {
      name: "Sofia Davis",
      email: "m@example.com",
      role: "Owner",
      avatar: "SD"
    },
    {
      name: "Jackson Lee",
      email: "p@example.com",
      role: "Developer",
      avatar: "JL"
    },
    {
      name: "Isabella Nguyen",
      email: "b@example.com",
      role: "Billing",
      avatar: "IN"
    }
  ];

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-4">
        <CardTitle className="text-xs">Team Members</CardTitle>
        <p className="text-xs text-muted-foreground">
          Invite your team members to collaborate.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Team Members List */}
        {teamMembers.map((member, index) => (
          <div key={index} className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src="" />
                <AvatarFallback className="text-xs bg-blue-500/10 text-blue-500">
                  {member.avatar}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-xs font-medium">{member.name}</p>
                <p className="text-xs text-muted-foreground">{member.email}</p>
              </div>
            </div>
            <Select defaultValue={member.role.toLowerCase()}>
              <SelectTrigger className="w-24 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="owner">Owner</SelectItem>
                <SelectItem value="developer">Developer</SelectItem>
                <SelectItem value="billing">Billing</SelectItem>
                <SelectItem value="member">Member</SelectItem>
              </SelectContent>
            </Select>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};