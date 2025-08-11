'use client'

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Send, Plus } from "lucide-react";

export const SupportChatWidget = () => {
  const [message, setMessage] = useState("");
  const [issueArea, setIssueArea] = useState("");
  const [securityLevel, setSecurityLevel] = useState("");
  const [subject, setSubject] = useState("");

  const messages = [
    {
      user: "Sofia Davis",
      email: "m@example.com",
      message: "Hi, how can I help you today?",
      isSupport: true
    },
    {
      user: "You",
      message: "Hey, I'm having trouble with my account.",
      isSupport: false
    }
  ];

  return (
    <div className="w-full max-w-md space-y-4">
      {/* Chat Widget */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src="" />
              <AvatarFallback className="text-xs bg-blue-500/10 text-blue-500">
                SD
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-xs">Sofia Davis</CardTitle>
              <p className="text-xs text-blue-200">m@example.com</p>
            </div>
            <Button variant="ghost" size="sm" className="ml-auto h-6 w-6 p-0">
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Messages */}
          <div className="space-y-3 max-h-32 overflow-y-auto">
            {messages.map((msg, index) => (
              <div key={index} className={`flex gap-2 ${msg.isSupport ? '' : 'flex-row-reverse'}`}>
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-xs bg-blue-500/10 text-blue-500">
                    {msg.isSupport ? 'SD' : 'Y'}
                  </AvatarFallback>
                </Avatar>
                <div className={`max-w-[70%] p-2 rounded-lg text-xs ${
                  msg.isSupport 
                    ? 'bg-blue-100 text-blue-200' 
                    : 'bg-blue-500 text-blue-500-foreground'
                }`}>
                  {msg.message}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="space-y-2">
            <Button variant="outline" size="sm" className="w-full h-8 text-xs justify-start">
              Hey, I'm having trouble with my account.
            </Button>
            <div className="text-xs text-blue-200">
              What seems to be the problem?
            </div>
            <Button variant="outline" size="sm" className="w-full h-8 text-xs justify-start">
              I can't log in.
            </Button>
          </div>

          {/* Message Input */}
          <div className="flex gap-2">
            <Input
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 h-8 text-xs"
            />
            <Button size="sm" className="h-8 w-8 p-0">
              <Send className="h-3 w-3" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Report Issue Form */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-xs">Report an issue</CardTitle>
          <p className="text-xs text-blue-200">
            What area are you having problems with?
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="area" className="text-xs">Area</Label>
              <Select value={issueArea} onValueChange={setIssueArea}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Billing" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="billing">Billing</SelectItem>
                  <SelectItem value="technical">Technical</SelectItem>
                  <SelectItem value="account">Account</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="security" className="text-xs">Security Level</Label>
              <Select value={securityLevel} onValueChange={setSecurityLevel}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Severity 2" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Severity 1</SelectItem>
                  <SelectItem value="2">Severity 2</SelectItem>
                  <SelectItem value="3">Severity 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject" className="text-xs">Subject</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="h-8 text-xs"
            />
          </div>
        </CardContent>
      </Card>

      {/* Share Document */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-xs">Share this document</CardTitle>
          <p className="text-xs text-blue-200">
            Anyone with the link can view this document.
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Input
              value="http://example.com/link/to/document"
              readOnly
              className="flex-1 h-8 text-xs"
            />
            <Button size="sm" className="h-8 px-3 text-xs">
              Copy Link
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};